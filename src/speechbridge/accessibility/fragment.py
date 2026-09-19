"""断续表达拼接"""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class Fragment:
    """语音片段"""
    text: str
    is_complete: bool       # 是否是完整句子
    confidence: float


def detect_fragments(text: str) -> list[str]:
    """
    检测断续表达.

    识别模式:
    1. 不完整句子 (缺少主语或谓语)
    2. 中断后重新开始
    3. 未完成的想法
    """
    # 按句号/逗号/停顿分割
    segments = re.split(r'[.!?;,]\s*', text)
    fragments = []

    for seg in segments:
        seg = seg.strip()
        if not seg:
            continue

        # 检查是否是完整句子 (有主语和动词)
        words = seg.split()
        if len(words) < 2:
            fragments.append(seg)
            continue

        # 简单启发式: 检查是否有动词
        has_verb = any(w.lower() in {
            "is", "are", "was", "were", "am", "be", "been", "being",
            "have", "has", "had", "do", "does", "did",
            "will", "would", "shall", "should", "can", "could", "may", "might",
            "go", "goes", "went", "going", "come", "comes", "came", "coming",
            "want", "wants", "wanted", "need", "needs", "needed",
            "say", "says", "said", "tell", "tells", "told",
            "get", "gets", "got", "make", "makes", "made",
            "take", "takes", "took", "give", "gives", "gave",
        } for w in words)

        if has_verb:
            fragments.append(seg)
        else:
            # 可能是不完整的片段
            fragments.append(seg)

    return fragments


def merge_fragments(text: str, context: str = "") -> tuple[str, list[dict]]:
    """
    拼接断续表达为完整句子.

    Args:
        text: 原始文本 (可能包含断续表达)
        context: 上下文信息 (可选, 用于辅助拼接)

    Returns:
        (merged_text, merge_operations)
    """
    fragments = detect_fragments(text)
    merges = []

    if len(fragments) <= 1:
        return text, merges

    # 尝试合并相邻的不完整片段
    merged = []
    i = 0

    while i < len(fragments):
        current = fragments[i]

        # 检查是否可以与下一个片段合并
        if i + 1 < len(fragments):
            next_frag = fragments[i + 1]

            # 如果当前片段不完整 (缺少动词), 尝试合并
            current_words = set(current.lower().split())
            next_words = set(next_frag.lower().split())

            # 检查是否有重叠词 (可能是重新开始)
            overlap = current_words & next_words
            if overlap:
                # 有重叠, 可能是重新开始, 保留更长的
                if len(next_frag) > len(current):
                    merged.append(next_frag)
                    merges.append({
                        "operation": "replace",
                        "from": current,
                        "to": next_frag,
                        "reason": "speaker restarted with longer version",
                    })
                else:
                    merged.append(current)
                i += 2
                continue

            # 尝试语法合并
            combined = _try_merge_pair(current, next_frag)
            if combined:
                merged.append(combined)
                merges.append({
                    "operation": "merge",
                    "from": [current, next_frag],
                    "to": combined,
                    "reason": "fragments merged into complete sentence",
                })
                i += 2
                continue

        merged.append(current)
        i += 1

    result = ". ".join(merged)
    if not result.endswith((".", "!", "?")):
        result += "."

    return result, merges


def _try_merge_pair(frag1: str, frag2: str) -> str | None:
    """尝试合并两个片段"""
    # 如果第一个片段缺少动词, 第二个有, 则合并
    words1 = frag1.lower().split()
    words2 = frag2.lower().split()

    verbs = {"is", "are", "was", "were", "have", "has", "had", "do", "does", "did",
             "want", "need", "go", "come", "make", "take", "get", "say", "tell"}

    has_verb1 = any(w in verbs for w in words1)
    has_verb2 = any(w in verbs for w in words2)

    if not has_verb1 and has_verb2:
        return f"{frag1} {frag2}"

    return None


def estimate_fragment_severity(text: str) -> dict:
    """
    估计断续表达严重程度.

    Returns:
        {
            "severity": "none" | "mild" | "moderate" | "severe",
            "fragment_count": int,
            "avg_fragment_length": float,
        }
    """
    fragments = detect_fragments(text)

    if len(fragments) <= 1:
        return {"severity": "none", "fragment_count": 0, "avg_fragment_length": 0}

    avg_len = sum(len(f.split()) for f in fragments) / len(fragments)

    if len(fragments) <= 2:
        severity = "mild"
    elif len(fragments) <= 5:
        severity = "moderate"
    else:
        severity = "severe"

    return {
        "severity": severity,
        "fragment_count": len(fragments),
        "avg_fragment_length": round(avg_len, 1),
    }

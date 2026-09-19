"""口吃检测与消除"""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class StutterPattern:
    """口吃模式"""
    original: str       # 原始文本
    cleaned: str        # 清理后文本
    pattern_type: str   # word_repetition | syllable_repetition | block


def detect_stutter(text: str) -> list[StutterPattern]:
    """
    检测文本中的口吃模式.

    支持的模式:
    1. 词重复: "I I I want" → "I want"
    2. 音节重复: "I w-w-want" → "I want"
    3. 停顿: "I... want" → "I want"
    """
    patterns = []

    # 1. 词重复: "I I I want" 或 "the the the"
    word_rep = re.findall(r'\b(\w+)(\s+\1){1,}\b', text, re.IGNORECASE)
    for match in re.finditer(r'\b(\w+)(\s+\1){1,}\b', text, re.IGNORECASE):
        word = match.group(1)
        full_match = match.group(0)
        patterns.append(StutterPattern(
            original=full_match,
            cleaned=word,
            pattern_type="word_repetition",
        ))

    # 2. 音节重复: "w-w-want" 或 "st-st-stop"
    syllable_rep = re.findall(r'\b(\w{1,3})-(\1-)*(\w+)\b', text, re.IGNORECASE)
    for match in re.finditer(r'\b(\w{1,3})-(?:\1-)*(\w+)\b', text, re.IGNORECASE):
        prefix = match.group(1)
        main_word = match.group(2)
        full_match = match.group(0)
        # 检查是否真的是口吃 (前缀是主词的一部分)
        if main_word.lower().startswith(prefix.lower()):
            patterns.append(StutterPattern(
                original=full_match,
                cleaned=main_word,
                pattern_type="syllable_repetition",
            ))

    # 3. 停顿填充: "um", "uh", "er", "like"
    filler_words = re.findall(r'\b(um|uh|er|ah|like|you know)\b', text, re.IGNORECASE)
    for filler in filler_words:
        # 只在句中去除, 句首保留
        if text.lower().strip().startswith(filler.lower()):
            continue
        patterns.append(StutterPattern(
            original=filler,
            cleaned="",
            pattern_type="filler",
        ))

    return patterns


def clean_stutter(text: str, remove_fillers: bool = True) -> tuple[str, list[StutterPattern]]:
    """
    清理文本中的口吃模式.

    Args:
        text: 原始文本
        remove_fillers: 是否移除填充词 (um, uh, er)

    Returns:
        (cleaned_text, detected_patterns)
    """
    patterns = detect_stutter(text)
    cleaned = text

    # 按位置从后往前替换, 避免偏移问题
    replacements = []
    for p in patterns:
        if p.pattern_type == "filler" and not remove_fillers:
            continue
        if p.cleaned != p.original:
            replacements.append(p)

    # 按原始文本长度降序排列, 先替换更长的匹配
    replacements.sort(key=lambda p: len(p.original), reverse=True)

    for p in replacements:
        # 使用 re.sub 进行替换, 处理大小写
        pattern = re.compile(re.escape(p.original), re.IGNORECASE)
        cleaned = pattern.sub(p.cleaned, cleaned, count=1)

    # 清理多余空格
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    return cleaned, patterns


def estimate_stutter_severity(text: str) -> dict:
    """
    估计口吃严重程度.

    Returns:
        {
            "severity": "none" | "mild" | "moderate" | "severe",
            "stutter_ratio": float,  # 口吃词占比
            "patterns_found": int,
        }
    """
    patterns = detect_stutter(text)
    words = text.split()

    if not words:
        return {"severity": "none", "stutter_ratio": 0.0, "patterns_found": 0}

    stutter_words = sum(len(p.original.split()) for p in patterns)
    ratio = stutter_words / len(words)

    if ratio == 0:
        severity = "none"
    elif ratio < 0.1:
        severity = "mild"
    elif ratio < 0.3:
        severity = "moderate"
    else:
        severity = "severe"

    return {
        "severity": severity,
        "stutter_ratio": round(ratio, 3),
        "patterns_found": len(patterns),
    }

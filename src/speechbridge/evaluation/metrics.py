"""评估指标"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class EvaluationResult:
    """评估结果"""
    wer: float                  # Word Error Rate
    intent_correct: bool        # 意图是否正确
    entity_f1: float            # 实体提取 F1
    latency: float              # 处理延迟 (秒)
    details: dict               # 详细信息


def compute_wer(reference: str, hypothesis: str) -> float:
    """
    计算词错误率 (Word Error Rate).

    WER = (S + D + I) / N
    S: 替换, D: 删除, I: 插入, N: 参考文本词数
    """
    ref_words = reference.lower().split()
    hyp_words = hypothesis.lower().split()

    n = len(ref_words)
    if n == 0:
        return 0.0 if len(hyp_words) == 0 else 1.0

    # 动态规划计算编辑距离
    d = [[0] * (len(hyp_words) + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        d[i][0] = i
    for j in range(len(hyp_words) + 1):
        d[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, len(hyp_words) + 1):
            if ref_words[i - 1] == hyp_words[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                substitution = d[i - 1][j - 1] + 1
                insertion = d[i][j - 1] + 1
                deletion = d[i - 1][j] + 1
                d[i][j] = min(substitution, insertion, deletion)

    return d[n][len(hyp_words)] / n


def compute_entity_f1(
    predicted: list[dict],
    reference: list[dict],
    key: str = "name",
) -> float:
    """
    计算实体提取 F1 分数.

    Args:
        predicted: 预测的实体列表
        reference: 参考的实体列表
        key: 比较的字段名

    Returns:
        F1 分数 (0.0 ~ 1.0)
    """
    if not reference and not predicted:
        return 1.0
    if not reference or not predicted:
        return 0.0

    pred_set = {e[key].lower() for e in predicted}
    ref_set = {e[key].lower() for e in reference}

    tp = len(pred_set & ref_set)
    precision = tp / len(pred_set) if pred_set else 0.0
    recall = tp / len(ref_set) if ref_set else 0.0

    if precision + recall == 0:
        return 0.0

    return 2 * precision * recall / (precision + recall)


def evaluate(
    reference_text: str,
    hypothesis_text: str,
    reference_intent: str,
    hypothesis_intent: str,
    reference_entities: list[dict],
    hypothesis_entities: list[dict],
    latency: float,
) -> EvaluationResult:
    """
    综合评估.

    Returns:
        EvaluationResult
    """
    wer = compute_wer(reference_text, hypothesis_text)
    intent_correct = reference_intent.lower().strip() == hypothesis_intent.lower().strip()
    entity_f1 = compute_entity_f1(hypothesis_entities, reference_entities)

    return EvaluationResult(
        wer=wer,
        intent_correct=intent_correct,
        entity_f1=entity_f1,
        latency=latency,
        details={
            "reference_text": reference_text,
            "hypothesis_text": hypothesis_text,
            "reference_intent": reference_intent,
            "hypothesis_intent": hypothesis_intent,
        },
    )

"""语速归一化"""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class SpeedAnalysis:
    """语速分析结果"""
    words_per_minute: float
    category: str           # very_slow | slow | normal | fast | very_fast
    is_anomaly: bool
    recommendation: str


# 英语语速参考 (WPM):
# < 100: very slow (可能有语言障碍)
# 100-130: slow
# 130-170: normal
# 170-210: fast
# > 210: very fast


def analyze_speed(text: str, duration_seconds: float) -> SpeedAnalysis:
    """
    分析语速.

    Args:
        text: 转录文本
        duration_seconds: 音频时长 (秒)

    Returns:
        SpeedAnalysis
    """
    if duration_seconds <= 0 or not text.strip():
        return SpeedAnalysis(
            words_per_minute=0,
            category="normal",
            is_anomaly=False,
            recommendation="",
        )

    words = text.split()
    wpm = len(words) / (duration_seconds / 60)

    if wpm < 80:
        category = "very_slow"
        is_anomaly = True
        recommendation = "语速过慢, 可能需要延长音频或使用 TTS 加速"
    elif wpm < 120:
        category = "slow"
        is_anomaly = False
        recommendation = "语速偏慢, 但可正常处理"
    elif wpm <= 180:
        category = "normal"
        is_anomaly = False
        recommendation = "语速正常"
    elif wpm <= 220:
        category = "fast"
        is_anomaly = False
        recommendation = "语速偏快, 建议检查识别准确性"
    else:
        category = "very_fast"
        is_anomaly = True
        recommendation = "语速过快, 可能需要降速处理或分段识别"

    return SpeedAnalysis(
        words_per_minute=round(wpm, 1),
        category=category,
        is_anomaly=is_anomaly,
        recommendation=recommendation,
    )


def normalize_speed_text(text: str, target_wpm: float = 150) -> str:
    """
    文本层面的语速归一化.

    通过调整停顿和标点来影响 TTS 输出语速.
    不改变文本内容, 只调整节奏标记.

    Args:
        text: 原始文本
        target_wpm: 目标语速 (WPM)

    Returns:
        添加了节奏标记的文本
    """
    # 如果文本过短, 直接返回
    words = text.split()
    if len(words) < 5:
        return text

    # 在长句中添加逗号停顿 (每 8-10 个词)
    result = []
    for i, word in enumerate(words):
        result.append(word)
        # 每 8 个词添加一个逗号 (如果不是标点结尾)
        if (i + 1) % 8 == 0 and i < len(words) - 1:
            if not word.endswith((".", ",", "!", "?", ";", ":")):
                result[-1] = word + ","

    return " ".join(result)


def adjust_tts_rate(current_wpm: float, target_wpm: float = 150) -> str:
    """
    根据当前语速计算 TTS 语速调整.

    Returns:
        TTS rate 字符串 (如 "+20%", "-10%")
    """
    if current_wpm <= 0:
        return "+0%"

    ratio = target_wpm / current_wpm
    # 限制调整范围在 -50% 到 +50%
    ratio = max(0.5, min(1.5, ratio))

    adjustment = (ratio - 1.0) * 100
    return f"{adjustment:+.0f}%"

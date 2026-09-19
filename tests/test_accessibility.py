"""无障碍功能测试"""

from src.speechbridge.accessibility.fragment import (
    detect_fragments,
    estimate_fragment_severity,
    merge_fragments,
)
from src.speechbridge.accessibility.speed import (
    adjust_tts_rate,
    analyze_speed,
    normalize_speed_text,
)
from src.speechbridge.accessibility.stutter import (
    clean_stutter,
    detect_stutter,
    estimate_stutter_severity,
)


# === 口吃检测测试 ===

def test_detect_word_repetition():
    """检测词重复"""
    patterns = detect_stutter("I I I want to go")
    assert len(patterns) > 0
    assert patterns[0].pattern_type == "word_repetition"


def test_detect_syllable_repetition():
    """检测音节重复"""
    patterns = detect_stutter("I w-w-want to go")
    assert len(patterns) > 0
    assert patterns[0].pattern_type == "syllable_repetition"


def test_clean_stutter():
    """清理口吃"""
    cleaned, patterns = clean_stutter("I I I want to to go")
    assert "I I I" not in cleaned
    assert "I" in cleaned


def test_clean_stutter_preserves_meaning():
    """清理口吃保留语义"""
    cleaned, _ = clean_stutter("I I I need help please")
    assert "need" in cleaned
    assert "help" in cleaned
    assert "please" in cleaned


def test_stutter_severity():
    """口吃严重程度估计"""
    result = estimate_stutter_severity("I I I want to go")
    assert result["severity"] in ["none", "mild", "moderate", "severe"]
    assert result["patterns_found"] > 0


# === 断续表达测试 ===

def test_detect_fragments():
    """检测断续表达"""
    fragments = detect_fragments("I want. To go. Home.")
    assert len(fragments) > 0


def test_merge_fragments():
    """拼接断续表达"""
    merged, ops = merge_fragments("I want to go home")
    assert isinstance(merged, str)


def test_merge_fragments_with_restart():
    """处理重新开始的表达"""
    merged, ops = merge_fragments("I want to go. I need to go home.")
    assert isinstance(merged, str)


def test_fragment_severity():
    """断续严重程度"""
    result = estimate_fragment_severity("I want to go home")
    assert result["severity"] in ["none", "mild", "moderate", "severe"]


# === 语速分析测试 ===

def test_analyze_speed_normal():
    """正常语速"""
    result = analyze_speed("This is a normal speed sentence with several words", 3.0)
    assert result.category in ["slow", "normal", "fast"]
    assert result.words_per_minute > 0


def test_analyze_speed_fast():
    """快速语速"""
    text = " ".join(["word"] * 100)
    result = analyze_speed(text, 20.0)  # 300 WPM
    assert result.category in ["fast", "very_fast"]
    assert result.is_anomaly is True


def test_analyze_speed_slow():
    """慢速语速"""
    text = "slow speech"
    result = analyze_speed(text, 10.0)  # 12 WPM
    assert result.category in ["very_slow", "slow"]
    assert result.is_anomaly is True


def test_normalize_speed_text():
    """语速归一化"""
    text = "This is a long sentence with many words that should be broken up into smaller chunks for better pacing"
    normalized = normalize_speed_text(text)
    # 应该添加了逗号
    assert "," in normalized or len(text.split()) < 8


def test_adjust_tts_rate():
    """TTS 语速调整"""
    rate = adjust_tts_rate(100, 150)  # 慢速 → 正常
    assert "+" in rate  # 应该加速

    rate = adjust_tts_rate(200, 150)  # 快速 → 正常
    assert "-" in rate  # 应该减速

    rate = adjust_tts_rate(150, 150)  # 正常 → 正常
    assert rate == "+0%"

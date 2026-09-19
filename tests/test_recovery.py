"""语义恢复测试"""

import json

from src.speechbridge.models import ASRResult, Scene
from src.speechbridge.recovery.prompts import build_recovery_prompt


def test_build_prompt_general():
    """测试通用场景 prompt"""
    asr = ASRResult(
        text="I want to go to the arport tomorow",
        n_best=["I want to go to the arport tomorow"],
        segment_confidence=0.75,
        language="en",
        duration=3.0,
    )
    prompt = build_recovery_prompt(asr, Scene.GENERAL)

    assert "SpeechBridge" in prompt
    assert "I want to go to the arport tomorow" in prompt
    assert "corrected_text" in prompt
    assert "intent" in prompt


def test_build_prompt_meeting():
    """测试会议场景 prompt"""
    asr = ASRResult(text="we need to finish the report by friday")
    prompt = build_recovery_prompt(asr, Scene.MEETING)

    assert "meeting" in prompt.lower()
    assert "action item" in prompt.lower()


def test_build_prompt_accessibility():
    """测试语言障碍场景 prompt"""
    asr = ASRResult(text="I I I want to to go to the store")
    prompt = build_recovery_prompt(asr, Scene.ACCESSIBILITY)

    assert "speech language disorder" in prompt.lower()
    assert "stuttering" in prompt.lower()


def test_build_prompt_medical():
    """测试医疗场景 prompt"""
    asr = ASRResult(text="I have pain in my chest and difficulty breathing")
    prompt = build_recovery_prompt(asr, Scene.MEDICAL)

    assert "medical" in prompt.lower()
    assert "symptoms" in prompt.lower()


def test_prompt_output_format():
    """测试 prompt 包含正确的 JSON 输出格式"""
    asr = ASRResult(text="hello world")
    prompt = build_recovery_prompt(asr, Scene.GENERAL)

    # 应该包含 JSON 输出格式说明
    assert "corrected_text" in prompt
    assert "entities" in prompt
    assert "confidence" in prompt
    assert "JSON" in prompt

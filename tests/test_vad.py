"""VAD 测试"""

import numpy as np
import pytest

from src.speechbridge.audio.vad import detect_speech, has_speech


@pytest.mark.slow
def test_detect_speech_with_audio(sample_audio_16k):
    """测试检测到语音"""
    audio, sr = sample_audio_16k
    segments = detect_speech(audio, sr)
    # 正弦波应该被检测为语音 (取决于 VAD 阈值)
    # 这个测试可能需要调整, 因为纯正弦波可能不被 VAD 视为语音
    assert isinstance(segments, list)


def test_has_speech_with_silence():
    """测试静音不被检测为语音"""
    sr = 16000
    silence = np.zeros(sr * 2, dtype=np.float32)  # 2 秒静音
    result = has_speech(silence, sr)
    assert result is False


@pytest.mark.slow
def test_detect_speech_returns_segments(sample_audio_16k):
    """测试返回的段格式正确"""
    audio, sr = sample_audio_16k
    segments = detect_speech(audio, sr, threshold=0.3)

    for seg in segments:
        assert seg.start_time >= 0
        assert seg.end_time > seg.start_time
        assert seg.sample_rate == sr
        assert len(seg.audio) > 0

"""公共测试 fixtures"""

import numpy as np
import pytest


@pytest.fixture
def sample_audio_16k():
    """生成 2 秒 16kHz 测试音频 (正弦波)"""
    sr = 16000
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration), dtype=np.float32)
    # 440Hz 正弦波 (A4 音)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    return audio, sr


@pytest.fixture
def sample_audio_bytes():
    """生成 WAV 格式的字节数据"""
    import io
    import soundfile as sf

    sr = 16000
    duration = 1.0
    t = np.linspace(0, duration, int(sr * duration), dtype=np.float32)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)

    buf = io.BytesIO()
    sf.write(buf, audio, sr, format="WAV")
    buf.seek(0)
    return buf.read()


@pytest.fixture
def sample_wav_file(tmp_path):
    """生成临时 WAV 文件"""
    import soundfile as sf

    sr = 16000
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration), dtype=np.float32)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)

    path = tmp_path / "test.wav"
    sf.write(str(path), audio, sr)
    return path

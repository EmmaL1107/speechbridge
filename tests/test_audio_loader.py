"""音频加载测试"""

import numpy as np
import soundfile as sf

from src.speechbridge.audio.loader import load_audio, TARGET_SAMPLE_RATE


def test_load_wav_file(sample_wav_file):
    """测试加载 WAV 文件"""
    audio, sr = load_audio(sample_wav_file)
    assert sr == TARGET_SAMPLE_RATE
    assert audio.dtype == np.float32
    assert len(audio) > 0


def test_load_wav_bytes(sample_audio_bytes):
    """测试从字节加载 WAV"""
    audio, sr = load_audio(sample_audio_bytes, filename="test.wav")
    assert sr == TARGET_SAMPLE_RATE
    assert audio.dtype == np.float32
    assert len(audio) > 0


def test_load_nonexistent_file():
    """测试加载不存在的文件"""
    import pytest
    with pytest.raises(FileNotFoundError):
        load_audio("/nonexistent/file.wav")


def test_load_unsupported_format(tmp_path):
    """测试加载不支持的格式"""
    import pytest
    path = tmp_path / "test.xyz"
    path.write_bytes(b"fake data")
    with pytest.raises(ValueError, match="不支持的音频格式"):
        load_audio(path)


def test_stereo_to_mono(tmp_path):
    """测试立体声转单声道"""
    sr = 16000
    duration = 1.0
    t = np.linspace(0, duration, int(sr * duration), dtype=np.float32)
    # 立立声: 左右声道不同
    stereo = np.column_stack([
        0.5 * np.sin(2 * np.pi * 440 * t),
        0.3 * np.sin(2 * np.pi * 880 * t),
    ])

    path = tmp_path / "stereo.wav"
    sf.write(str(path), stereo, sr)

    audio, out_sr = load_audio(path)
    assert out_sr == TARGET_SAMPLE_RATE
    assert audio.ndim == 1  # 应为单声道


def test_resample(tmp_path):
    """测试采样率转换"""
    sr = 44100  # CD 音质
    duration = 1.0
    t = np.linspace(0, duration, int(sr * duration), dtype=np.float32)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)

    path = tmp_path / "44100.wav"
    sf.write(str(path), audio, sr)

    out_audio, out_sr = load_audio(path)
    assert out_sr == TARGET_SAMPLE_RATE
    # 重采样后样本数应该不同
    expected_len = int(len(audio) * TARGET_SAMPLE_RATE / sr)
    assert abs(len(out_audio) - expected_len) < 10  # 允许小误差

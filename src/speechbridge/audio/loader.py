"""音频加载与格式转换"""

from __future__ import annotations

import io
from pathlib import Path

import numpy as np
import soundfile as sf
from pydub import AudioSegment

# Whisper 要求: 16kHz mono float32
TARGET_SAMPLE_RATE = 16000
SUPPORTED_FORMATS = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm", ".opus"}


def load_audio(source: str | Path | bytes, filename: str | None = None) -> tuple[np.ndarray, int]:
    """
    加载音频并转换为 16kHz mono float32.

    Args:
        source: 文件路径或音频字节数据
        filename: 当 source 为 bytes 时, 提供文件名用于格式检测

    Returns:
        (audio_data, sample_rate) — audio_data 为 float32 numpy 数组
    """
    if isinstance(source, bytes):
        return _load_from_bytes(source, filename)

    path = Path(source)
    if not path.exists():
        raise FileNotFoundError(f"音频文件不存在: {path}")

    suffix = path.suffix.lower()
    if suffix not in SUPPORTED_FORMATS:
        raise ValueError(f"不支持的音频格式: {suffix}. 支持: {SUPPORTED_FORMATS}")

    if suffix == ".wav":
        return _load_wav(path)
    else:
        return _load_with_pydub(path)


def _load_wav(path: Path) -> tuple[np.ndarray, int]:
    """直接加载 WAV 文件"""
    audio, sr = sf.read(str(path), dtype="float32")

    # 多声道 → 单声道
    if audio.ndim > 1:
        audio = audio.mean(axis=1)

    # 重采样
    if sr != TARGET_SAMPLE_RATE:
        audio = _resample(audio, sr, TARGET_SAMPLE_RATE)
        sr = TARGET_SAMPLE_RATE

    return audio, sr


def _load_with_pydub(path: Path) -> tuple[np.ndarray, int]:
    """使用 pydub 加载非 WAV 格式"""
    seg = AudioSegment.from_file(str(path))
    seg = seg.set_frame_rate(TARGET_SAMPLE_RATE).set_channels(1).set_sample_width(4)

    # 转为 float32 numpy 数组
    raw = seg.raw_data
    audio = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0

    return audio, TARGET_SAMPLE_RATE


def _load_from_bytes(data: bytes, filename: str | None = None) -> tuple[np.ndarray, int]:
    """从字节数据加载音频"""
    if filename and filename.endswith(".wav"):
        audio, sr = sf.read(io.BytesIO(data), dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        if sr != TARGET_SAMPLE_RATE:
            audio = _resample(audio, sr, TARGET_SAMPLE_RATE)
            sr = TARGET_SAMPLE_RATE
        return audio, sr

    # 非 WAV 用 pydub
    fmt = None
    if filename:
        suffix = Path(filename).suffix.lstrip(".")
        fmt = suffix if suffix in {"mp3", "m4a", "flac", "ogg", "webm", "opus"} else None

    seg = AudioSegment.from_file(io.BytesIO(data), format=fmt)
    seg = seg.set_frame_rate(TARGET_SAMPLE_RATE).set_channels(1).set_sample_width(4)

    raw = seg.raw_data
    audio = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0

    return audio, TARGET_SAMPLE_RATE


def _resample(audio: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    """简单线性插值重采样"""
    if orig_sr == target_sr:
        return audio

    duration = len(audio) / orig_sr
    target_len = int(duration * target_sr)
    indices = np.linspace(0, len(audio) - 1, target_len)
    return np.interp(indices, np.arange(len(audio)), audio).astype(np.float32)

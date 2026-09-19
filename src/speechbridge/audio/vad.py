"""语音活动检测 (VAD)"""

from __future__ import annotations

import torch
import numpy as np

from ..models import AudioSegment

# silero-vad 模型缓存
_model = None
_utils = None


def _load_model():
    """加载 silero-vad 模型 (懒加载, 只加载一次)"""
    global _model, _utils
    if _model is None:
        _model, _utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad",
            model="silero_vad",
            trust_repo=True,
        )
    return _model, _utils


def detect_speech(
    audio: np.ndarray,
    sample_rate: int = 16000,
    threshold: float = 0.5,
    min_speech_duration: float = 0.5,
    min_silence_duration: float = 0.3,
) -> list[AudioSegment]:
    """
    检测音频中的语音段.

    Args:
        audio: float32 音频数据
        sample_rate: 采样率 (应为 16000)
        threshold: VAD 置信度阈值
        min_speech_duration: 最短语音段时长 (秒)
        min_silence_duration: 最短静音段时长 (秒), 用于合并相邻语音段

    Returns:
        语音段列表
    """
    model, utils = _load_model()
    get_speech_timestamps = utils[0]

    # 确保是 torch tensor
    if isinstance(audio, np.ndarray):
        audio_tensor = torch.from_numpy(audio).float()
    else:
        audio_tensor = audio

    # 获取语音时间戳
    speech_timestamps = get_speech_timestamps(
        audio_tensor,
        model,
        threshold=threshold,
        min_speech_duration_ms=int(min_speech_duration * 1000),
        min_silence_duration_ms=int(min_silence_duration * 1000),
        return_seconds=False,
        sampling_rate=sample_rate,
    )

    # 转为 AudioSegment 列表
    segments = []
    for ts in speech_timestamps:
        start_sample = ts["start"]
        end_sample = ts["end"]

        segment_audio = audio[start_sample:end_sample]
        start_time = start_sample / sample_rate
        end_time = end_sample / sample_rate

        segments.append(AudioSegment(
            audio=segment_audio,
            start_time=start_time,
            end_time=end_time,
            sample_rate=sample_rate,
        ))

    return segments


def has_speech(audio: np.ndarray, sample_rate: int = 16000, threshold: float = 0.5) -> bool:
    """快速检测音频中是否包含语音"""
    segments = detect_speech(audio, sample_rate, threshold)
    return len(segments) > 0

"""音频预处理 (降噪等)"""

from __future__ import annotations

import numpy as np


def reduce_noise(audio: np.ndarray, sample_rate: int = 16000) -> np.ndarray:
    """
    降噪处理.

    使用 noisereduce 库的 spectral gating 方法.
    如果库不可用, 返回原始音频.
    """
    try:
        import noisereduce as nr
        return nr.reduce_noise(y=audio, sr=sample_rate, prop_decrease=0.8)
    except ImportError:
        return audio


def normalize_volume(audio: np.ndarray, target_db: float = -20.0) -> np.ndarray:
    """
    音量归一化.

    将音频调整到目标分贝值.
    """
    if len(audio) == 0:
        return audio

    # 计算当前 RMS
    rms = np.sqrt(np.mean(audio ** 2))
    if rms == 0:
        return audio

    current_db = 20 * np.log10(rms)
    gain_db = target_db - current_db
    gain = 10 ** (gain_db / 20)

    normalized = audio * gain

    # 防止削波
    max_val = np.max(np.abs(normalized))
    if max_val > 1.0:
        normalized = normalized / max_val * 0.99

    return normalized.astype(np.float32)


def detect_speed_anomaly(audio: np.ndarray, sample_rate: int = 16000) -> dict:
    """
    检测语速异常.

    返回:
        {
            "is_anomaly": bool,
            "estimated_wpm": float,  # 估计每分钟词数
            "category": "normal" | "too_fast" | "too_slow"
        }
    """
    # 简单估计: 通过过零率和能量变化估算语速
    if len(audio) < sample_rate * 0.5:
        return {"is_anomaly": False, "estimated_wpm": 0, "category": "normal"}

    # 过零率
    zero_crossings = np.sum(np.abs(np.diff(np.sign(audio)))) / 2
    duration_sec = len(audio) / sample_rate
    zcr_per_sec = zero_crossings / duration_sec

    # 粗略估算 WPM (英语平均 ~150 WPM, 每词约 6 个音素)
    # 过零率与音素速率有一定相关性
    estimated_wpm = zcr_per_sec * 15  # 粗略映射

    if estimated_wpm > 250:
        category = "too_fast"
        is_anomaly = True
    elif estimated_wpm < 50 and duration_sec > 2:
        category = "too_slow"
        is_anomaly = True
    else:
        category = "normal"
        is_anomaly = False

    return {
        "is_anomaly": is_anomaly,
        "estimated_wpm": round(estimated_wpm, 1),
        "category": category,
    }

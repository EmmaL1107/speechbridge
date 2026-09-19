"""ASR 引擎抽象基类"""

from __future__ import annotations

from abc import ABC, abstractmethod

import numpy as np

from ..models import ASRResult


class ASREngine(ABC):
    """ASR 引擎接口"""

    @abstractmethod
    def transcribe(
        self,
        audio: np.ndarray,
        sample_rate: int = 16000,
        language: str | None = None,
    ) -> ASRResult:
        """
        转录音频.

        Args:
            audio: float32 音频数据
            sample_rate: 采样率
            language: 语言代码 (None = 自动检测)

        Returns:
            ASRResult
        """
        ...

    @abstractmethod
    def is_loaded(self) -> bool:
        """模型是否已加载"""
        ...

"""faster-whisper ASR 引擎实现"""

from __future__ import annotations

import logging

import numpy as np

from ..config import ASRConfig
from ..models import ASRResult, WordInfo
from .engine import ASREngine

logger = logging.getLogger(__name__)


class WhisperEngine(ASREngine):
    """基于 faster-whisper 的 ASR 引擎"""

    def __init__(self, config: ASRConfig | None = None):
        self.config = config or ASRConfig()
        self._model = None

    def _ensure_loaded(self):
        """确保模型已加载"""
        if self._model is not None:
            return

        from faster_whisper import WhisperModel

        # 设备选择
        device = self.config.device
        if device == "auto":
            try:
                import torch
                if torch.cuda.is_available():
                    device = "cuda"
                elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
                    device = "cpu"  # faster-whisper 对 MPS 支持有限, 用 CPU 更稳
                else:
                    device = "cpu"
            except ImportError:
                device = "cpu"

        compute_type = self.config.compute_type
        if compute_type == "auto":
            compute_type = "float32" if device == "cpu" else "float16"

        logger.info(f"加载 Whisper 模型: {self.config.model} (device={device}, compute={compute_type})")
        self._model = WhisperModel(
            self.config.model,
            device=device,
            compute_type=compute_type,
        )
        logger.info("Whisper 模型加载完成")

    def is_loaded(self) -> bool:
        return self._model is not None

    def transcribe(
        self,
        audio: np.ndarray,
        sample_rate: int = 16000,
        language: str | None = None,
    ) -> ASRResult:
        self._ensure_loaded()

        # faster-whisper 需要 float32 numpy 数组
        if audio.dtype != np.float32:
            audio = audio.astype(np.float32)

        # 如果不是 16kHz, 需要重采样
        if sample_rate != 16000:
            from ..audio.loader import _resample
            audio = _resample(audio, sample_rate, 16000)

        # 转录
        lang = language or self.config.language
        segments, info = self._model.transcribe(
            audio,
            beam_size=self.config.beam_size,
            language=lang,
            word_timestamps=True,
            vad_filter=False,  # 我们用自己的 VAD
        )

        # 收集结果
        full_text_parts = []
        words = []
        n_best_texts = []  # faster-whisper 不直接支持 n-best, 用 top-1 替代

        for segment in segments:
            full_text_parts.append(segment.text.strip())

            # 收集词级信息
            if segment.words:
                for w in segment.words:
                    words.append(WordInfo(
                        word=w.word.strip(),
                        start=w.start,
                        end=w.end,
                        confidence=w.probability,
                    ))

        full_text = " ".join(full_text_parts).strip()

        # 计算段级置信度 (所有词置信度的平均值)
        if words:
            seg_confidence = sum(w.confidence for w in words) / len(words)
        else:
            seg_confidence = 0.0

        # n_best: faster-whisper 不直接支持, 用 top-1 填充
        # 后续可通过多次转录 (不同 beam_size/temperature) 模拟
        n_best = [full_text]

        return ASRResult(
            text=full_text,
            n_best=n_best,
            words=words,
            segment_confidence=seg_confidence,
            language=info.language,
            duration=info.duration,
        )

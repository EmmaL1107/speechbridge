"""语义恢复引擎抽象基类"""

from __future__ import annotations

from abc import ABC, abstractmethod

from ..models import ASRResult, RecoveryResult, Scene


class RecoveryEngine(ABC):
    """语义恢复引擎接口"""

    @abstractmethod
    def recover(
        self,
        asr_result: ASRResult,
        scene: Scene = Scene.GENERAL,
    ) -> RecoveryResult:
        """
        从 ASR 结果中恢复语义.

        Args:
            asr_result: ASR 识别结果
            scene: 应用场景

        Returns:
            RecoveryResult
        """
        ...

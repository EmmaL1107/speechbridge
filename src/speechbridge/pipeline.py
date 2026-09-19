"""主管线编排"""

from __future__ import annotations

import logging
import time
from pathlib import Path

import numpy as np

from .accessibility.fragment import merge_fragments
from .accessibility.speed import adjust_tts_rate, analyze_speed
from .accessibility.stutter import clean_stutter
from .audio.loader import load_audio
from .audio.preprocessor import normalize_volume, reduce_noise
from .audio.vad import detect_speech
from .asr.whisper_engine import WhisperEngine
from .config import PipelineConfig
from .models import ASRResult, OutputFormat, PipelineResult, RecoveryResult, Scene
from .output.json_formatter import format_json
from .output.text_formatter import format_text
from .output.tts_engine import text_to_speech_sync
from .rag.glossary import GlossaryManager
from .recovery.llm_engine import LLMRecoveryEngine

logger = logging.getLogger(__name__)


class SpeechBridgePipeline:
    """SpeechBridge 主管线"""

    def __init__(self, config: PipelineConfig | None = None):
        self.config = config or PipelineConfig.from_env()

        # 根据 ASR_MODEL 选择引擎
        if self.config.asr.model == "sensevoice-v1":
            from .asr.sensevoice_engine import SenseVoiceEngine
            self.asr = SenseVoiceEngine(self.config.asr)
            logger.info("使用 SenseVoice ASR 引擎（阿里云端）")
        else:
            self.asr = WhisperEngine(self.config.asr)
            logger.info(f"使用 Whisper ASR 引擎（模型: {self.config.asr.model}）")

        self.recovery = LLMRecoveryEngine(self.config.recovery)
        self.glossary = GlossaryManager()

    def load_glossaries(self, directory: str | Path):
        """加载领域词汇表"""
        self.glossary.load_from_dir(directory)

    def process(
        self,
        source: str | Path | bytes,
        filename: str | None = None,
        scene: Scene | None = None,
        output_format: OutputFormat | None = None,
    ) -> PipelineResult:
        """
        处理音频输入.

        Args:
            source: 音频文件路径或字节数据
            filename: 文件名 (bytes 输入时需要)
            scene: 应用场景 (None 使用默认)
            output_format: 输出格式 (None 使用默认)

        Returns:
            PipelineResult
        """
        total_start = time.time()
        scene = scene or self.config.scene
        output_format = output_format or self.config.output.format

        # Layer 1: 音频预处理
        logger.info("Layer 1: 音频预处理...")
        audio, sr = load_audio(source, filename)
        audio = reduce_noise(audio, sr)
        audio = normalize_volume(audio)

        # VAD: 检测语音段
        segments = detect_speech(
            audio, sr,
            threshold=self.config.vad.threshold,
            min_speech_duration=self.config.vad.min_speech_duration,
        )

        if not segments:
            logger.warning("未检测到语音")
            empty_asr = ASRResult(text="", duration=len(audio) / sr)
            empty_recovery = RecoveryResult(original_text="")
            return PipelineResult(
                asr=empty_asr,
                recovery=empty_recovery,
                output_text="(未检测到语音)",
                total_time=time.time() - total_start,
            )

        # 合并所有语音段
        combined_audio = np.concatenate([seg.audio for seg in segments])
        logger.info(f"检测到 {len(segments)} 个语音段, 总时长 {len(combined_audio)/sr:.1f}s")

        # Layer 2: ASR 语音识别
        logger.info("Layer 2: ASR 语音识别...")
        asr_result = self.asr.transcribe(combined_audio, sr, self.config.asr.language)
        logger.info(f"ASR 结果: '{asr_result.text}' (confidence={asr_result.segment_confidence:.2f})")

        # Layer 1.5: 语言障碍预处理 (如有需要)
        if self.config.accessibility.enabled:
            logger.info("Layer 1.5: 语言障碍预处理...")
            asr_result = self._accessibility_preprocess(asr_result)

        # Layer 3.5: RAG 词汇表纠正
        if self.glossary.glossaries:
            logger.info("Layer 3.5: RAG 词汇表纠正...")
            corrected_text, glossary_corrections = self.glossary.correct_text(asr_result.text)
            if glossary_corrections:
                asr_result.text = corrected_text
                logger.info(f"词汇表纠正: {len(glossary_corrections)} 处")

        # Layer 4: 语义恢复
        logger.info("Layer 4: 语义恢复...")
        recovery_result = self.recovery.recover(asr_result, scene)
        logger.info(f"恢复结果: '{recovery_result.corrected_text}' (confidence={recovery_result.confidence:.2f})")

        # Layer 5: 输出格式化
        result = PipelineResult(
            asr=asr_result,
            recovery=recovery_result,
            total_time=time.time() - total_start,
        )

        if output_format == OutputFormat.TEXT:
            result.output_text = format_text(result)
        elif output_format == OutputFormat.JSON:
            result.output_text = format_json(result)
        elif output_format == OutputFormat.TTS:
            result.output_text = format_text(result)
            try:
                tts_path = text_to_speech_sync(
                    recovery_result.corrected_text,
                    voice=self.config.output.tts_voice,
                    rate=self.config.output.tts_rate,
                )
                result.output_audio_path = tts_path
            except Exception as e:
                logger.warning(f"TTS 生成失败: {e}")

        return result

    def _accessibility_preprocess(self, asr_result: ASRResult) -> ASRResult:
        """语言障碍模式预处理: 处理重复、断续、语速等问题"""
        text = asr_result.text

        # 1. 口吃检测与消除
        if self.config.accessibility.stutter_detection:
            text, stutter_patterns = clean_stutter(text, remove_fillers=True)
            if stutter_patterns:
                logger.info(f"检测到 {len(stutter_patterns)} 处口吃模式")

        # 2. 断续拼接
        if self.config.accessibility.fragment_merging:
            text, merge_ops = merge_fragments(text)
            if merge_ops:
                logger.info(f"合并了 {len(merge_ops)} 处断续表达")

        # 3. 语速分析
        if self.config.accessibility.speed_normalization and asr_result.duration > 0:
            speed = analyze_speed(text, asr_result.duration)
            if speed.is_anomaly:
                logger.info(f"语速异常: {speed.words_per_minute} WPM ({speed.category})")

        asr_result.text = text
        if asr_result.n_best:
            asr_result.n_best = [text]
        return asr_result

    def process_stream(self, audio_chunks: list[bytes], **kwargs) -> PipelineResult:
        """
        处理流式音频数据 (用于实时场景).

        Args:
            audio_chunks: 音频数据块列表
            **kwargs: 传递给 process 的参数

        Returns:
            PipelineResult
        """
        # 合并所有 chunks
        combined = b"".join(audio_chunks)
        return self.process(combined, **kwargs)

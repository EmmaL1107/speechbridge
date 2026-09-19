"""核心数据模型"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class Scene(str, Enum):
    """应用场景"""
    GENERAL = "general"
    MEETING = "meeting"
    EDUCATION = "education"
    MEDICAL = "medical"
    ACCESSIBILITY = "accessibility"


class OutputFormat(str, Enum):
    """输出格式"""
    TEXT = "text"
    JSON = "json"
    TTS = "tts"


@dataclass
class AudioSegment:
    """VAD 切分后的音频片段"""
    audio: bytes            # 原始音频数据 (16kHz mono, float32)
    start_time: float       # 开始时间 (秒)
    end_time: float         # 结束时间 (秒)
    sample_rate: int = 16000


@dataclass
class WordInfo:
    """词级识别结果"""
    word: str
    start: float
    end: float
    confidence: float       # 0.0 ~ 1.0


@dataclass
class ASRResult:
    """ASR 识别结果"""
    text: str                           # top-1 转录文本
    n_best: list[str] = field(default_factory=list)  # N-best 假设
    words: list[WordInfo] = field(default_factory=list)  # 词级详情
    segment_confidence: float = 0.0     # 段级置信度
    language: str = "en"                # 检测到的语言
    duration: float = 0.0               # 音频时长 (秒)


@dataclass
class Correction:
    """一次纠正记录"""
    original: str
    corrected: str
    reason: str


@dataclass
class Entity:
    """提取的实体"""
    name: str
    type: str           # person, place, date, number, organization, etc.
    value: str


@dataclass
class RecoveryResult:
    """语义恢复结果"""
    original_text: str                          # ASR 原始转录
    corrected_text: str = ""                    # 纠正后的标准文本
    intent: str = ""                            # 用户意图
    entities: list[Entity] = field(default_factory=list)
    actions: list[str] = field(default_factory=list)  # 行动项 (会议场景)
    corrections: list[Correction] = field(default_factory=list)
    confidence: float = 0.0                     # 恢复置信度
    processing_time: float = 0.0                # 处理耗时 (秒)
    llm_fallback: bool = False                  # 是否使用 LLM fallback
    fallback_reason: str | None = None          # fallback 原因
    llm_error: str | None = None                # LLM 错误信息


@dataclass
class StageTiming:
    """管线阶段耗时"""
    name: str
    duration: float


@dataclass
class PipelineResult:
    """完整管线处理结果"""
    asr: ASRResult
    recovery: RecoveryResult
    output_text: str = ""                       # 最终输出文本
    output_audio_path: str | None = None        # TTS 输出路径
    total_time: float = 0.0                     # 总处理耗时
    stage_timings: list[StageTiming] = field(default_factory=list)

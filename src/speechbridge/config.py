"""配置管理"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

from .models import OutputFormat, Scene

# 加载 .env
load_dotenv()


@dataclass
class ASRConfig:
    """ASR 配置"""
    model: str = "large-v3-turbo"
    beam_size: int = 5
    n_best_count: int = 3
    language: str | None = None         # None = 自动检测
    device: str = "auto"                # auto / cpu / cuda / mps
    compute_type: str = "auto"          # auto / int8 / float16 / float32


@dataclass
class VADConfig:
    """VAD 配置"""
    threshold: float = 0.5
    min_speech_duration: float = 0.5    # 最短语音段 (秒)
    min_silence_duration: float = 0.3   # 最短静音段 (秒)


@dataclass
class RecoveryConfig:
    """语义恢复配置"""
    provider: str = "deepseek"          # openai / anthropic / ollama / deepseek
    model: str = "deepseek-chat"        # 各平台默认模型
    ollama_base_url: str = "http://localhost:11434"
    temperature: float = 0.3
    max_tokens: int = 2048


@dataclass
class AccessibilityConfig:
    """语言障碍模式配置"""
    enabled: bool = False
    stutter_detection: bool = True
    fragment_merging: bool = True
    speed_normalization: bool = True


@dataclass
class OutputConfig:
    """输出配置"""
    format: OutputFormat = OutputFormat.TEXT
    tts_voice: str = "en-US-AriaNeural"
    tts_rate: str = "+0%"


@dataclass
class PipelineConfig:
    """管线总配置"""
    asr: ASRConfig = field(default_factory=ASRConfig)
    vad: VADConfig = field(default_factory=VADConfig)
    recovery: RecoveryConfig = field(default_factory=RecoveryConfig)
    accessibility: AccessibilityConfig = field(default_factory=AccessibilityConfig)
    output: OutputConfig = field(default_factory=OutputConfig)
    scene: Scene = Scene.GENERAL

    @classmethod
    def from_env(cls) -> PipelineConfig:
        """从环境变量创建配置"""
        config = cls()

        # ASR
        config.asr.model = os.getenv("ASR_MODEL", config.asr.model)

        # Recovery
        config.recovery.provider = os.getenv("LLM_PROVIDER", config.recovery.provider)
        config.recovery.ollama_base_url = os.getenv(
            "OLLAMA_BASE_URL", config.recovery.ollama_base_url
        )

        # 根据 provider 自动选择默认模型
        provider = config.recovery.provider
        if provider == "deepseek" and config.recovery.model == "gpt-4o-mini":
            config.recovery.model = "deepseek-chat"
        elif provider == "openai" and config.recovery.model == "deepseek-chat":
            config.recovery.model = "gpt-4o-mini"
        elif provider == "dashscope":
            config.recovery.model = os.getenv("LLM_MODEL", "qwen-plus")

        # 默认场景
        scene_str = os.getenv("DEFAULT_SCENE", config.scene.value)
        try:
            config.scene = Scene(scene_str)
        except ValueError:
            pass

        return config

    @classmethod
    def from_yaml(cls, path: str | Path) -> PipelineConfig:
        """从 YAML 文件创建配置"""
        import yaml

        with open(path) as f:
            data = yaml.safe_load(f)

        config = cls()
        if "asr" in data:
            for k, v in data["asr"].items():
                if hasattr(config.asr, k):
                    setattr(config.asr, k, v)
        if "recovery" in data:
            for k, v in data["recovery"].items():
                if hasattr(config.recovery, k):
                    setattr(config.recovery, k, v)
        if "scene" in data:
            try:
                config.scene = Scene(data["scene"])
            except ValueError:
                pass
        return config

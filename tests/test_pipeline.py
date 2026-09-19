"""管线集成测试"""

import json

import pytest

from src.speechbridge.config import PipelineConfig
from src.speechbridge.models import OutputFormat, Scene
from src.speechbridge.pipeline import SpeechBridgePipeline


@pytest.fixture
def config():
    """测试配置"""
    config = PipelineConfig()
    config.asr.model = "tiny"  # 测试用小模型
    config.recovery.provider = "ollama"
    config.recovery.model = "qwen2.5:7b"
    return config


@pytest.mark.integration
def test_pipeline_with_file(config, sample_wav_file):
    """测试文件处理管线 (需要 ASR 和 LLM 服务)"""
    pipeline = SpeechBridgePipeline(config)
    result = pipeline.process(sample_wav_file)

    assert result.asr is not None
    assert result.recovery is not None
    assert result.total_time > 0


@pytest.mark.integration
def test_pipeline_output_text(config, sample_wav_file):
    """测试文本输出格式"""
    pipeline = SpeechBridgePipeline(config)
    result = pipeline.process(sample_wav_file, output_format=OutputFormat.TEXT)

    assert "SpeechBridge" in result.output_text or len(result.output_text) > 0


@pytest.mark.integration
def test_pipeline_output_json(config, sample_wav_file):
    """测试 JSON 输出格式"""
    pipeline = SpeechBridgePipeline(config)
    result = pipeline.process(sample_wav_file, output_format=OutputFormat.JSON)

    # 应该是合法 JSON
    data = json.loads(result.output_text)
    assert "asr" in data
    assert "recovery" in data


def test_pipeline_no_speech(config, tmp_path):
    """测试无语音输入"""
    import numpy as np
    import soundfile as sf

    # 生成纯静音文件
    silence = np.zeros(16000 * 2, dtype=np.float32)
    path = tmp_path / "silence.wav"
    sf.write(str(path), silence, 16000)

    pipeline = SpeechBridgePipeline(config)
    result = pipeline.process(path)

    assert result.asr.text == ""
    assert "(未检测到语音)" in result.output_text

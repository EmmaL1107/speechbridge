"""TTS 语音输出"""

from __future__ import annotations

import asyncio
import logging
import tempfile
from pathlib import Path

logger = logging.getLogger(__name__)


async def text_to_speech(
    text: str,
    voice: str = "en-US-AriaNeural",
    rate: str = "+0%",
    output_path: str | None = None,
) -> str:
    """
    将文本转为语音.

    Args:
        text: 要转换的文本
        voice: TTS 语音名称
        rate: 语速调整 (如 "+10%", "-20%")
        output_path: 输出文件路径 (None = 自动生成临时文件)

    Returns:
        输出音频文件路径
    """
    try:
        import edge_tts

        if output_path is None:
            output_path = tempfile.mktemp(suffix=".mp3", prefix="speechbridge_tts_")

        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(output_path)

        logger.info(f"TTS 输出: {output_path}")
        return output_path

    except ImportError:
        logger.error("edge-tts 未安装, 无法生成语音")
        raise
    except Exception as e:
        logger.error(f"TTS 生成失败: {e}")
        raise


def text_to_speech_sync(
    text: str,
    voice: str = "en-US-AriaNeural",
    rate: str = "+0%",
    output_path: str | None = None,
) -> str:
    """同步版本的 TTS"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    return loop.run_until_complete(text_to_speech(text, voice, rate, output_path))

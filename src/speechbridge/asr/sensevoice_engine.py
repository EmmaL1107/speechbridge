"""阿里 SenseVoice ASR 引擎实现（通过 DashScope API）"""

from __future__ import annotations

import json
import logging
import os
import tempfile
import time
import urllib.request
import wave

import numpy as np

from ..config import ASRConfig
from ..models import ASRResult, WordInfo
from .engine import ASREngine

logger = logging.getLogger(__name__)


class SenseVoiceEngine(ASREngine):
    """基于阿里 SenseVoice 的 ASR 引擎（云端 API）"""

    def __init__(self, config: ASRConfig | None = None):
        self.config = config or ASRConfig()
        self._loaded = True  # 云端 API 不需要本地加载

    def is_loaded(self) -> bool:
        return self._loaded

    def _ensure_loaded(self):
        """云端 API 不需要预加载，兼容 pipeline 调用"""
        pass

    def transcribe(
        self,
        audio: np.ndarray,
        sample_rate: int = 16000,
        language: str | None = None,
    ) -> ASRResult:
        import dashscope
        from dashscope.audio.asr import Transcription

        api_key = os.getenv("DASHSCOPE_API_KEY")
        if not api_key:
            raise ValueError("DASHSCOPE_API_KEY 未配置")
        dashscope.api_key = api_key

        # 保存音频为临时 WAV 文件
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        tmp_path = tmp.name
        try:
            if audio.dtype != np.float32:
                audio = audio.astype(np.float32)
            # float32 → int16
            audio_int16 = (audio * 32767).astype(np.int16)
            with wave.open(tmp_path, "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(sample_rate)
                wf.writeframes(audio_int16.tobytes())

            # 上传文件
            from dashscope import Uploads

            file_info = Uploads.upload(model="sensevoice-v1", file=tmp_path)
            file_url = file_info.data.uploaded_filepath

            # 调用异步转写
            lang_hints = []
            if language:
                lang_hints.append(language)
            else:
                lang_hints = ["zh", "en"]

            task_response = Transcription.async_call(
                model="sensevoice-v1",
                file_urls=[file_url],
                language_hints=lang_hints,
            )
            task_id = task_response.output.task_id

            # 轮询等待结果
            for _ in range(120):  # 最多等 120 秒
                result = Transcription.fetch(task=task_id)
                status = result.output.task_status
                if status in ("SUCCEEDED", "FAILED"):
                    break
                time.sleep(1)

            if status != "SUCCEEDED":
                raise RuntimeError(f"SenseVoice 转写失败: {status}")

            # 解析结果
            result_url = result.output.results[0]["transcription_url"]
            with urllib.request.urlopen(result_url) as resp:
                data = json.loads(resp.read())

            # 提取文本
            full_text = ""
            detected_lang = language or "zh"
            duration = 0.0
            words = []

            # SenseVoice 返回格式解析
            if "transcripts" in data:
                for seg in data["transcripts"]:
                    full_text += seg.get("text", "")
                    if "language" in seg:
                        detected_lang = seg["language"]
                    if "end_time" in seg:
                        end_sec = seg["end_time"] / 1000.0
                        duration = max(duration, end_sec)
            elif "output" in data:
                full_text = data["output"].get("text", "")
                detected_lang = data["output"].get("language", detected_lang)

            full_text = full_text.strip()
            if not duration:
                duration = len(audio) / sample_rate

            return ASRResult(
                text=full_text,
                n_best=[full_text],
                words=words,
                segment_confidence=0.9,  # SenseVoice 不返回置信度，给默认值
                language=detected_lang,
                duration=duration,
            )

        except Exception as e:
            logger.error(f"SenseVoice 识别失败: {e}")
            raise
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

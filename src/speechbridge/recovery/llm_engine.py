"""基于 LLM 的语义恢复引擎"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass

from ..config import RecoveryConfig
from ..models import ASRResult, Correction, Entity, RecoveryResult, Scene
from .engine import RecoveryEngine
from .prompts import build_recovery_prompt

logger = logging.getLogger(__name__)


@dataclass
class LLMCallResult:
    content: str
    fallback: bool = False
    reason: str | None = None
    error: str | None = None


class LLMRecoveryEngine(RecoveryEngine):
    """使用 LLM 进行语义恢复"""

    def __init__(self, config: RecoveryConfig | None = None):
        self.config = config or RecoveryConfig()

    def recover(
        self,
        asr_result: ASRResult,
        scene: Scene = Scene.GENERAL,
    ) -> RecoveryResult:
        start_time = time.time()

        # 构建 prompt
        prompt = build_recovery_prompt(asr_result, scene)

        # 调用 LLM
        call_result = self._call_llm(prompt)

        # 解析响应
        result = self._parse_response(call_result.content, asr_result)
        result.llm_fallback = call_result.fallback
        result.fallback_reason = call_result.reason
        result.llm_error = call_result.error
        result.processing_time = time.time() - start_time

        return result

    def _call_llm(self, prompt: str) -> LLMCallResult:
        """调用 LLM API"""
        try:
            import litellm
            import os

            # 配置 provider
            if self.config.provider == "ollama":
                model = f"ollama/{self.config.model}"
                base_url = self.config.ollama_base_url
            elif self.config.provider == "anthropic":
                model = f"anthropic/{self.config.model}"
                base_url = None
            elif self.config.provider == "deepseek":
                model = f"deepseek/{self.config.model}"
                base_url = None
            elif self.config.provider == "dashscope":
                # 阿里百炼 Qwen 系列，通过 OpenAI 兼容接口
                model = f"openai/{self.config.model}"
                base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
                os.environ["OPENAI_API_KEY"] = os.getenv("DASHSCOPE_API_KEY", "")
            else:
                model = self.config.model
                base_url = None

            response = litellm.completion(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                api_base=base_url,
            )

            return LLMCallResult(response.choices[0].message.content)

        except Exception as e:
            logger.error(f"LLM 调用失败: {e}")
            return LLMCallResult(
                content=json.dumps({
                    "corrected_text": "",
                    "intent": "unknown",
                    "entities": [],
                    "actions": [],
                    "corrections": [],
                    "confidence": 0.0,
                }),
                fallback=True,
                reason="llm_call_failed",
                error=str(e),
            )

    def _parse_response(self, raw: str, asr_result: ASRResult) -> RecoveryResult:
        """解析 LLM 响应为 RecoveryResult"""
        try:
            # 尝试提取 JSON (可能被 markdown 代码块包裹)
            json_str = raw.strip()
            if json_str.startswith("```"):
                # 移除 markdown 代码块
                lines = json_str.split("\n")
                json_str = "\n".join(lines[1:-1])

            data = json.loads(json_str)

            # 解析 entities
            entities = []
            for e in data.get("entities", []):
                entities.append(Entity(
                    name=e.get("name", ""),
                    type=e.get("type", "other"),
                    value=e.get("value", ""),
                ))

            # 解析 corrections
            corrections = []
            for c in data.get("corrections", []):
                corrections.append(Correction(
                    original=c.get("original", ""),
                    corrected=c.get("corrected", ""),
                    reason=c.get("reason", ""),
                ))

            return RecoveryResult(
                original_text=asr_result.text,
                corrected_text=data.get("corrected_text", asr_result.text),
                intent=data.get("intent", ""),
                entities=entities,
                actions=data.get("actions", []),
                corrections=corrections,
                confidence=float(data.get("confidence", 0.5)),
            )

        except (json.JSONDecodeError, KeyError, TypeError) as e:
            logger.warning(f"解析 LLM 响应失败: {e}, 原始响应: {raw[:200]}")
            result = RecoveryResult(
                original_text=asr_result.text,
                corrected_text=asr_result.text,
                intent="parse_error",
                confidence=0.0,
            )
            result.llm_fallback = True
            result.fallback_reason = "llm_response_parse_error"
            result.llm_error = str(e)
            return result

"""JSON 格式化输出"""

from __future__ import annotations

import json

from ..models import PipelineResult


def format_json(result: PipelineResult, indent: int = 2) -> str:
    """格式化为 JSON"""
    data = {
        "asr": {
            "text": result.asr.text,
            "n_best": result.asr.n_best,
            "confidence": result.asr.segment_confidence,
            "language": result.asr.language,
            "duration": result.asr.duration,
            "words": [
                {
                    "word": w.word,
                    "start": w.start,
                    "end": w.end,
                    "confidence": w.confidence,
                }
                for w in result.asr.words
            ],
        },
        "recovery": {
            "original_text": result.recovery.original_text,
            "corrected_text": result.recovery.corrected_text,
            "intent": result.recovery.intent,
            "entities": [
                {"name": e.name, "type": e.type, "value": e.value}
                for e in result.recovery.entities
            ],
            "actions": result.recovery.actions,
            "corrections": [
                {"original": c.original, "corrected": c.corrected, "reason": c.reason}
                for c in result.recovery.corrections
            ],
            "confidence": result.recovery.confidence,
            "processing_time": result.recovery.processing_time,
        },
        "output_text": result.output_text,
        "total_time": result.total_time,
    }

    return json.dumps(data, indent=indent, ensure_ascii=False)

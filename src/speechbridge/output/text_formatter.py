"""文本格式化输出"""

from __future__ import annotations

from ..models import PipelineResult


def format_text(result: PipelineResult) -> str:
    """格式化为人类可读文本"""
    lines = []

    # 纠正后文本
    lines.append("=== SpeechBridge 语义恢复结果 ===")
    lines.append("")
    lines.append(f"📝 原始转录: {result.asr.text}")
    lines.append(f"✅ 纠正文本: {result.recovery.corrected_text}")
    lines.append("")

    # 意图
    if result.recovery.intent:
        lines.append(f"🎯 意图: {result.recovery.intent}")

    # 实体
    if result.recovery.entities:
        lines.append("📦 实体:")
        for e in result.recovery.entities:
            lines.append(f"   - {e.name} ({e.type}): {e.value}")

    # 纠正详情
    if result.recovery.corrections:
        lines.append("🔧 纠正详情:")
        for c in result.recovery.corrections:
            lines.append(f'   "{c.original}" → "{c.corrected}" ({c.reason})')

    # 行动项 (会议场景)
    if result.recovery.actions:
        lines.append("📋 行动项:")
        for i, a in enumerate(result.recovery.actions, 1):
            lines.append(f"   {i}. {a}")

    # 元信息
    lines.append("")
    lines.append(f"⏱  ASR 耗时: {result.asr.duration:.1f}s 音频")
    lines.append(f"⏱  语义恢复耗时: {result.recovery.processing_time:.2f}s")
    lines.append(f"⏱  总耗时: {result.total_time:.2f}s")
    lines.append(f"📊 ASR 置信度: {result.asr.segment_confidence:.2f}")
    lines.append(f"📊 恢复置信度: {result.recovery.confidence:.2f}")

    return "\n".join(lines)

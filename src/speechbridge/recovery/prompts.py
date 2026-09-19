"""语义恢复 Prompt 模板管理"""

from __future__ import annotations

from ..models import ASRResult, Scene


def build_recovery_prompt(asr_result: ASRResult, scene: Scene) -> str:
    """
    构建语义恢复 prompt.

    Args:
        asr_result: ASR 识别结果
        scene: 应用场景

    Returns:
        完整的 prompt 字符串
    """
    # 构建置信度摘要
    confidence_summary = _build_confidence_summary(asr_result)

    # 基础 prompt
    prompt = f"""You are SpeechBridge, a semantic recovery system. Your job is to understand what the speaker MEANT, not just what the speech recognizer heard.

INPUT:
- ASR transcript (may contain errors): "{asr_result.text}"
- N-best hypotheses: {asr_result.n_best}
- Word confidence summary: {confidence_summary}
- Detected language: {asr_result.language}
- Audio duration: {asr_result.duration:.1f}s

TASK:
1. Identify any speech recognition errors and correct them
2. Infer the speaker's true intent
3. Extract key entities (names, dates, places, numbers, organizations)
4. If the transcript is ambiguous, use context and world knowledge to disambiguate
5. Preserve the speaker's original meaning — do NOT add information that wasn't spoken"""

    # 场景特定追加
    if scene == Scene.MEETING:
        prompt += """

CONTEXT: This is from a business meeting.
ADDITIONAL TASKS:
- Extract action items (who should do what by when)
- Identify key decisions made
- Note any follow-up items needed"""

    elif scene == Scene.EDUCATION:
        prompt += """

CONTEXT: This is from an educational setting (classroom, lecture, presentation).
ADDITIONAL TASKS:
- Identify the student's question or the teacher's explanation
- Extract key concepts being discussed
- If the speaker is asking a question, clearly identify what they want to know"""

    elif scene == Scene.MEDICAL:
        prompt += """

CONTEXT: This is from a medical/healthcare setting.
ADDITIONAL TASKS:
- Extract symptoms, conditions, and medical terms
- Identify medications, dosages, and frequencies
- Be especially precise with numbers and units
- Flag any ambiguous medical terms for human review"""

    elif scene == Scene.ACCESSIBILITY:
        prompt += """

CONTEXT: The speaker has a speech language disorder. The transcript may contain:
- Repeated words/syllables (stuttering): e.g., "I I I want" → "I want"
- Incomplete sentences that need completion
- Unusual pauses or breaks in speech
- Sound substitutions or omissions

ADDITIONAL TASKS:
- Merge fragmented thoughts into complete, coherent sentences
- Remove stuttering repetitions while preserving meaning
- Complete incomplete expressions based on context
- Output should be natural, respectful, and preserve the speaker's intent
- Do NOT medicalize or dramatize the speech — just make it clear and complete"""

    # 输出格式
    prompt += """

OUTPUT (strict JSON):
{
  "corrected_text": "the corrected, natural English text",
  "intent": "brief intent description",
  "entities": [{"name": "...", "type": "person|place|date|number|organization|other", "value": "..."}],
  "actions": ["action item 1", "action item 2"],
  "corrections": [{"original": "...", "corrected": "...", "reason": "..."}],
  "confidence": 0.0-1.0
}

Return ONLY the JSON object, no other text."""

    return prompt


def _build_confidence_summary(asr_result: ASRResult) -> str:
    """构建置信度摘要"""
    if not asr_result.words:
        return "no word-level confidence available"

    low_conf = [w for w in asr_result.words if w.confidence < 0.6]
    if not low_conf:
        return f"all words high confidence (avg={asr_result.segment_confidence:.2f})"

    low_words = ", ".join(f'"{w.word}"({w.confidence:.2f})' for w in low_conf[:10])
    return f"low confidence words: [{low_words}]"

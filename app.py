"""Hugging Face Space (Gradio SDK) front-end for SpeechBridge.

Wraps the SpeechBridgePipeline in a Gradio interface so users can upload or
record audio and see ASR + LLM semantic-recovery output.

ZeroGPU note:
  The default ASR (SenseVoice via DashScope API) and LLM (Qwen via litellm)
  are API-based — they do NOT use the GPU. To actually exercise ZeroGPU:
    1. Set ASR_MODEL to a local Whisper model in Space Settings
       (e.g. `base`, `small`, `medium`, `large-v3-turbo`).
    2. Uncomment `import spaces` and the `@spaces.GPU` decorator below.
  The decorator is only needed when running local ASR on GPU.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

import gradio as gr

# import spaces  # uncomment to enable ZeroGPU for local Whisper ASR

from speechbridge.config import PipelineConfig
from speechbridge.models import OutputFormat, Scene
from speechbridge.pipeline import SpeechBridgePipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_PIPELINE: SpeechBridgePipeline | None = None
GLOSSARY_DIR = Path(__file__).parent / "data" / "glossaries"


def get_pipeline() -> SpeechBridgePipeline:
    """Lazily build the pipeline (heavy: loads ASR/VAD on first call)."""
    global _PIPELINE
    if _PIPELINE is None:
        cfg = PipelineConfig.from_env()
        _PIPELINE = SpeechBridgePipeline(cfg)
        if GLOSSARY_DIR.exists():
            _PIPELINE.load_glossaries(GLOSSARY_DIR)
    return _PIPELINE


# @spaces.GPU  # uncomment when ASR_MODEL is a local Whisper model
def process_audio(audio_path: str | None, scene: str) -> tuple[str, str, str, str]:
    """Run the SpeechBridge pipeline on an uploaded/recorded audio file."""
    if not audio_path:
        return "", "", "", "No audio provided."

    try:
        pipeline = get_pipeline()
        result = pipeline.process(
            source=audio_path,
            scene=Scene(scene),
            output_format=OutputFormat.JSON,
        )

        asr_text = result.asr.text
        recovered = result.recovery.corrected_text or result.recovery.original_text
        try:
            payload = {
                "asr": result.asr.text,
                "recovered": result.recovery.corrected_text,
                "intent": result.recovery.intent,
                "entities": [e.__dict__ for e in result.recovery.entities],
                "actions": result.recovery.actions,
                "confidence": round(result.recovery.confidence, 3),
                "total_time_s": round(result.total_time, 3),
            }
            output_json = json.dumps(payload, ensure_ascii=False, indent=2)
        except Exception as exc:
            output_json = f"(json serialization error: {exc})"

        timing = f"Total: {result.total_time:.2f}s"
        return asr_text, recovered, output_json, timing
    except Exception as exc:
        logger.exception("pipeline failed")
        return "", "", "", f"Error: {exc}"


SCENES = [s.value for s in Scene]

with gr.Blocks(title="SpeechBridge") as demo:
    gr.Markdown("# SpeechBridge — 智能语义恢复\nUpload or record audio to see ASR + LLM semantic recovery.")
    with gr.Row():
        audio_in = gr.Audio(
            label="Audio input",
            type="filepath",
            sources=["upload", "microphone"],
        )
        scene_dd = gr.Dropdown(choices=SCENES, value="general", label="Scene")
    run_btn = gr.Button("Process", variant="primary")
    with gr.Row():
        asr_out = gr.Textbox(label="ASR transcript", lines=3)
        recovered_out = gr.Textbox(label="Recovered text", lines=3)
    json_out = gr.JSON(label="Full result")
    timing_out = gr.Textbox(label="Timing", lines=1)
    run_btn.click(
        process_audio,
        inputs=[audio_in, scene_dd],
        outputs=[asr_out, recovered_out, json_out, timing_out],
    )


if __name__ == "__main__":
    demo.queue().launch()

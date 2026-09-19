# AGENTS.md

## Project Overview

SpeechBridge: intelligent speech semantic recovery system. Pipeline: audio preprocessing → VAD → ASR → RAG glossary correction → LLM semantic recovery → output formatting.

## Common Commands

```bash
# Install
pip install -e ".[dev]"          # Core + dev deps
pip install -e ".[web]"          # Core + web deps

# Lint & Format
ruff check .                     # Lint
ruff format .                    # Format

# Test
pytest                           # All tests
pytest -m integration            # Integration tests only
pytest tests/test_pipeline.py    # Single test file
pytest tests/test_pipeline.py::test_function_name  # Single test

# CLI
python cli.py process audio.wav                    # Process audio file
python cli.py process audio.wav --scene meeting    # With scene
python cli.py process audio.wav --accessibility    # Accessibility mode
python cli.py listen --duration 30                 # Live microphone
python cli.py batch ./audio_files/                 # Batch processing

# Web (two modes)
python web/run.py                # FastAPI (localhost:8000) + Streamlit (localhost:8501)
python web/start_demo.py         # Full-stack demo with HTTPS + PWA (localhost:8000)

# Individual services
uvicorn web.api:app --reload --port 8000    # API only
uvicorn web.demo:app --reload --port 8000   # Demo app (with auth, templates)
streamlit run web/app.py                     # Streamlit frontend only
```

## Architecture

### Core Pipeline (`src/speechbridge/`)

Orchestrated by `SpeechBridgePipeline` in `pipeline.py`:

```
Audio Input
  → Audio Preprocessing: loader.py (pydub/soundfile) → vad.py (silero-vad) → preprocessor.py (noise reduction)
  → [Optional] Accessibility: stutter.py, fragment.py, speed.py
  → ASR: whisper_engine.py (faster-whisper) or sensevoice_engine.py (DashScope API, default)
  → [Optional] RAG Glossary: glossary.py (domain term correction)
  → Semantic Recovery: llm_engine.py (litellm — supports dashscope/openai/anthropic/deepseek/ollama)
  → Output: text_formatter.py / json_formatter.py / tts_engine.py (edge-tts)
```

**Key patterns:**
- Abstract base classes for swappable engines: `ASREngine` (`asr/engine.py`), `RecoveryEngine` (`recovery/engine.py`)
- All data structures are dataclasses in `models.py` (`ASRResult`, `RecoveryResult`, `PipelineResult`)
- Configuration via dataclasses in `config.py` with `from_env()` and `from_yaml()` factory methods
- Scenes: `general`, `meeting`, `education`, `medical`, `accessibility` — each affects prompt construction in `recovery/prompts.py`

### Web Layer (`web/`)

Two modes:

1. **API mode** (`web/api.py`): FastAPI REST API + WebSocket streaming. Endpoints: `POST /api/process`, `WS /api/stream`, `GET /api/scenes`, `GET /api/models`, `GET /api/health`
2. **Demo mode** (`web/demo.py`): Full-stack with Jinja2 templates, user auth (`auth.py` — HMAC-SHA256 token-based, cookie auth), task history, SQLite persistence via SQLAlchemy (`database.py`). Tables: `users`, `tasks`.

Supporting modules: `cors.py` (CORS config), `uploads.py` (file upload handling), `i18n/` (zh/en translations). Global singleton pipeline is lazy-loaded.

### i18n

Custom translation system in `web/i18n/` supporting Chinese (zh) and English (en). Language stored per-user in database.

### Evaluation (`src/speechbridge/evaluation/`)

Metrics module with WER (Word Error Rate), entity F1, and intent accuracy.

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `LLM_PROVIDER` | `dashscope` (default) / `openai` / `anthropic` / `ollama` / `deepseek` |
| `DASHSCOPE_API_KEY` | Alibaba DashScope API key (SenseVoice ASR + Qwen LLM) |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `OLLAMA_BASE_URL` | Ollama URL (default: `http://localhost:11434`) |
| `ASR_MODEL` | `sensevoice-v1` (default) / `tiny` / `base` / `small` / `medium` / `large-v3-turbo` |
| `LLM_MODEL` | LLM model name (dashscope: `qwen-plus`, deepseek: `deepseek-chat`) |
| `DEFAULT_SCENE` | `general` / `meeting` / `education` / `medical` / `accessibility` |
| `AUTH_SECRET` | HMAC-SHA256 auth secret (>= 32 bytes) |
| `DB_PATH` | SQLite path (default: `speechbridge.db`) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins (default: `*`) |
| `MAX_UPLOAD_BYTES` | Max upload size (default: 25MB) |
| `UPLOAD_DIR` | Demo upload directory (default: `uploads`) |

## Code Style

- Python 3.11+, Ruff for linting/formatting (line-length 100)
- Dataclasses over dicts for structured data
- Type hints on all function signatures
- Tests use `pytest` with `asyncio_mode = "auto"`, fixtures in `tests/conftest.py` (generates sample audio with numpy)
- Domain glossaries are JSON files in `data/glossaries/`
- Source layout: `src/speechbridge/` package, built with `hatchling`

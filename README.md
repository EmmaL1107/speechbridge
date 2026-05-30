# SpeechBridge

**AI-Powered Non-Standard Speech Understanding and Standard Expression System**

## What is SpeechBridge?

SpeechBridge transforms non-standard speech into accurate text, standardized expression, and understandable voice output.

It supports two user groups:

1. **Accent Speakers** — Non-native speakers with accented English
2. **Speech-Impaired Users** — Individuals with speech disorders or communication difficulties

This is not a speech-to-text tool. SpeechBridge recovers meaning, not simply recognizes sounds.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, PWA, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python |
| ASR | faster-whisper |
| Semantic Repair | LLM API (MiMo or compatible) |
| TTS | Text-to-Speech engine |
| Database | SQLite (V1), PostgreSQL (future) |
| Deployment | Vercel (frontend), Python hosting (backend) |

## AI Pipeline

```
Audio Input → Audio Processing → faster-whisper ASR → Uncertainty Detection → LLM Semantic Repair → Standard Expression → TTS Output → Feedback Logging → Lightweight Adaptation
```

## Project Structure

```
speechbridge/
├── frontend/          # Next.js PWA
├── backend/           # FastAPI API
├── docs/              # Project documentation
├── prompts/           # LLM prompt templates
├── data/              # Database and file storage
├── scripts/           # Utility scripts
└── .claude/           # Claude Code rules and skills
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or yarn

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Documentation

- [Product Requirements](docs/PRD.md)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Database Design](docs/DATABASE.md)
- [API Specification](docs/API.md)
- [Product Roadmap](docs/ROADMAP.md)

## License

MIT

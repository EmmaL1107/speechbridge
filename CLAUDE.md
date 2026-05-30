# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SpeechBridge is an AI-powered non-standard speech understanding and standard expression system. It transforms accented and impaired speech into accurate text, standardized expression, and understandable voice output. This is a meaning-recovery system, not a speech-to-text tool.

## Core Principle

- Build V1 first. Do not over-engineer.
- Frontend (Next.js PWA) and backend (FastAPI) are fully separated.
- All AI logic stays on the backend. Browser only handles recording, upload, display, and feedback.
- Mock data is allowed before backend is ready, but must match future API response shapes.
- Prompt templates live in `prompts/`, not hardcoded in service code.
- Audio files are sensitive user data.

## Architecture

```
Frontend (Next.js/TS/PWA)  →  Backend (FastAPI/Python)  →  AI Pipeline  →  Database (SQLite V1)
```

**AI Pipeline:**
```
Audio → faster-whisper ASR → Uncertainty Detection → LLM Semantic Repair → Standard Expression → TTS → Feedback Logging
```

- ASR output is intermediate, not final. It feeds into repair.
- LLM repair is constrained: only modify uncertain/high-risk spans, preserve high-confidence text.
- ASR must never run in the browser.

## Backend Rules

- Routers handle HTTP only. Business logic goes in services. DB logic goes in repositories.
- Do not call AI models from route handlers.
- Store audio files on disk, not in the database. Store only paths and metadata.
- Use Pydantic schemas for all request/response validation.
- API keys and secrets in environment variables only.

## Frontend Rules

- Mobile-first. All pages must work on 375px screens.
- Use Next.js App Router with TypeScript strictly.
- API calls go in `frontend/services/`, never inside UI components.
- Keep components under 300 lines.
- Microphone permission requested only on explicit user action.
- Required pages: Home, Speak/Record, Result, History, Lexicon, Profile/Settings.

## Key Documentation

| Document | Location |
|---|---|
| Architecture rules | `.claude/rules/architecture.md` |
| Frontend rules | `.claude/rules/frontend.md` |
| Backend rules | `.claude/rules/backend.md` |
| Coding style | `.claude/rules/coding-style.md` |
| AI system rules | `.claude/rules/ai-system.md` |
| System architecture | `docs/SYSTEM_ARCHITECTURE.md` |
| Database design | `docs/DATABASE.md` |
| API specification | `docs/API.md` |
| Product roadmap | `docs/ROADMAP.md` |
| Development tasks | `todo.md` |

## Expert Skills

When working on specialized tasks, adopt the appropriate expert role:

- **Frontend tasks** → Read `.claude/skills/pwa-architect.md` first
- **Backend tasks** → Read `.claude/skills/fastapi-architect.md` first
- **AI pipeline tasks** → Read `.claude/skills/ai-pipeline-architect.md` first
- **Code review** → Read `.claude/skills/code-reviewer.md` first

## Development Workflow

Before implementing any task:
1. Read `.claude/rules/`
2. Read `docs/`
3. Check `todo.md` for the next unchecked task
4. Make a small implementation plan
5. Implement only that task
6. Mark complete only after verification
7. Do not jump ahead or introduce unnecessary complexity

## Running the Project

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

## Database

V1 uses SQLite. Schema is designed for future PostgreSQL migration. All 8 tables are defined in `docs/DATABASE.md`. Use SQLAlchemy ORM so the same models work with both databases.

## Safety

- Do not frame accents as wrong or inferior.
- Do not claim to diagnose speech disorders.
- Preserve user intent in all repairs.
- Never expose API keys to the frontend.

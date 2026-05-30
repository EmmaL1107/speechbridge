# Architecture Rules

## System Purpose

* This project is a non-standard speech understanding and standard expression assistance system.
* The system supports both accented speech correction and speech-impaired user communication assistance.
* The product must be designed as a long-term scalable system, not a one-page demo.

## Separation of Concerns

* Frontend and backend must be fully separated.
* Frontend must be a Next.js PWA deployed to Vercel.
* Backend must be FastAPI.
* Heavy AI processing must stay on the backend.
* The browser frontend should only handle recording, upload, display, feedback, and user interaction.
* Do not run faster-whisper or heavy ASR models in the browser.

## Core AI Pipeline

The main AI pipeline is:

```
Audio Input
→ Audio Processing
→ faster-whisper ASR
→ Uncertainty Detection
→ LLM-based Semantic Repair
→ Standard Text Output
→ TTS Voice Output
→ Feedback Logging
→ Lightweight Adaptation
```

## Modularity

* Use modular architecture.
* Every major capability should be implemented as a separate service.
* Avoid tightly coupled code.
* Avoid putting business logic in UI components.
* Avoid putting AI logic directly in API route handlers.
* All model calls should be wrapped in service classes or service functions.

## Data Architecture

* The architecture must support future migration from SQLite to PostgreSQL.
* The architecture must support future addition of user accounts, personalized lexicons, speech profiles, and long-term adaptation.

## Platform Requirements

* The app must support mobile-first usage.
* All API communication must be HTTPS-ready.
* All uploaded audio must be treated as sensitive user data.
* Privacy and data minimization should be considered from the beginning.

## Recommended Top-Level Project Structure

```
project/
├── frontend/
├── backend/
├── docs/
├── prompts/
├── data/
├── scripts/
└── .claude/
```

## Recommended Frontend Structure

```
frontend/
├── app/
├── components/
├── features/
├── lib/
├── services/
├── types/
├── public/
└── styles/
```

## Recommended Backend Structure

```
backend/
├── app/
│   ├── api/
│   ├── services/
│   ├── db/
│   ├── schemas/
│   ├── models/
│   ├── core/
│   └── utils/
├── data/
├── tests/
└── requirements.txt
```

---

When implementing features, always check this architecture file first.

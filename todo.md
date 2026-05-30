# SpeechBridge Development TODO

**Project:** SpeechBridge
**Subtitle:** AI-Powered Non-Standard Speech Understanding and Standard Expression System
**Last Updated:** 2026-05-30

---

## Project Principle

- Build V1 first.
- Do not over-engineer.
- Keep frontend and backend separated.
- Use mock data before backend is ready.
- All AI logic belongs to backend.
- Prompt templates must live in `prompts/`.
- Audio files are sensitive user data.
- Every feature must support future scalability.

---

## Phase 0: Project Foundation

**Goal:** Establish project skeleton, documentation system, rules system, and basic engineering structure.

**Acceptance Criteria:**
- Project directory is clean and ready for development.
- Claude Code can understand rules and docs.
- No business feature is implemented yet.

### Tasks

- [ ] Verify `.claude/rules/` exists and contains all 5 rule files
- [ ] Verify `docs/` exists and contains all 5 documentation files
- [ ] Create `prompts/` directory for prompt templates
- [ ] Create `frontend/` directory
- [ ] Create `backend/` directory
- [ ] Create `data/` directory (for SQLite DB and file storage)
- [ ] Create `scripts/` directory (for utility and dev scripts)
- [ ] Initialize git repository (`git init`)
- [ ] Add `.gitignore` (node_modules, .env, __pycache__, .venv, data/uploads, *.db)
- [ ] Add `README.md` with project overview, setup instructions, and architecture summary
- [ ] Add `.env.example` for frontend environment variables
- [ ] Add `backend/.env.example` for backend environment variables (API keys, DB path, CORS origin)
- [ ] Define project naming convention (file names, variable names, directory names)
- [ ] Verify project structure matches `docs/SYSTEM_ARCHITECTURE.md`

---

## Phase 1: Frontend PWA MVP

**Goal:** Build a runnable Next.js PWA frontend skeleton supporting mobile recording, upload, page navigation, and mock result display.

**Acceptance Criteria:**
- Frontend can run locally.
- PWA structure exists.
- Mobile navigation works.
- User can record audio locally in browser.
- User can upload audio.
- Mock result page looks professional.
- No backend is required yet.

### 1.1 Frontend Setup

- [ ] Initialize Next.js project in `frontend/` with App Router
- [ ] Enable TypeScript (strict mode)
- [ ] Configure Tailwind CSS
- [ ] Configure shadcn/ui
- [ ] Configure basic app layout (header, main content area, mobile nav)
- [ ] Configure mobile-first responsive design breakpoints
- [ ] Create global styles (typography, colors, spacing)
- [ ] Create shared UI components directory (`frontend/components/`)
- [ ] Create frontend service layer directory (`frontend/services/`)
- [ ] Create mock data directory (`frontend/lib/mock/`)
- [ ] Define shared TypeScript types for API responses (`frontend/types/`)

### 1.2 PWA Setup

- [ ] Add `manifest.json` with app name, icons, theme color, display mode
- [ ] Add app icons placeholder (192x192, 512x512)
- [ ] Add PWA metadata to `<head>` (theme-color, viewport, apple-mobile-web-app)
- [ ] Add service worker or PWA plugin setup (`next-pwa` or manual)
- [ ] Verify app can be installed on mobile browser after deployment
- [ ] Add offline fallback page if simple to implement

### 1.3 Navigation and Pages

- [ ] Create Home / Dashboard page (`frontend/app/page.tsx`)
- [ ] Create Speak / Record page (`frontend/app/speak/page.tsx`)
- [ ] Create Result / Analysis Detail page (`frontend/app/result/[id]/page.tsx`)
- [ ] Create History page (`frontend/app/history/page.tsx`)
- [ ] Create Lexicon page (`frontend/app/lexicon/page.tsx`)
- [ ] Create Profile / Settings page (`frontend/app/settings/page.tsx`)
- [ ] Add mobile bottom navigation component (Home | Speak | History | Lexicon | Profile)
- [ ] Add desktop responsive layout (sidebar or top nav)
- [ ] Ensure Result page can be opened from mock history item

### 1.4 Audio Recording UI

- [ ] Implement microphone permission prompt UI
- [ ] Implement browser recording using `getUserMedia` and `MediaRecorder`
- [ ] Add recording states: idle, recording, paused, finished
- [ ] Add recording timer display
- [ ] Add stop recording button
- [ ] Add re-record button
- [ ] Add audio playback preview after recording
- [ ] Convert recorded audio to `Blob`
- [ ] Prepare upload-ready audio file object

### 1.5 Audio Upload UI

- [ ] Add audio file upload component (drag-and-drop or file picker)
- [ ] Support wav/mp3/m4a/webm file hints
- [ ] Display uploaded file name
- [ ] Display uploaded file size
- [ ] Display uploaded file preview if possible
- [ ] Add remove uploaded file action

### 1.6 Result UI

- [ ] Create raw ASR text card component
- [ ] Create uncertain span highlighter component
- [ ] Create uncertainty analysis card component
- [ ] Create repaired text card component
- [ ] Create standard expression card component
- [ ] Create TTS playback card component
- [ ] Create before/after diff viewer component
- [ ] Create feedback card component (rating + correction input)
- [ ] Add mock analysis result data
- [ ] Ensure long text is readable on mobile

### 1.7 History UI

- [ ] Create history list with mock records
- [ ] Add search input
- [ ] Add status filter (all / completed / pending / failed)
- [ ] Add repaired/pending/failed filter
- [ ] Link each record to Result page
- [ ] Add empty state when no history

### 1.8 Lexicon UI

- [ ] Create lexicon list component
- [ ] Add term input form
- [ ] Add term category field (person, place, technical, organization, other)
- [ ] Add domain field
- [ ] Add delete term action
- [ ] Use mock lexicon data
- [ ] Make page feel like a lightweight knowledge base

### 1.9 Profile / Settings UI

- [ ] Add backend connection status placeholder
- [ ] Add repair mode preference (conservative / balanced / aggressive)
- [ ] Add voice output preference (standard / future personalized)
- [ ] Add accessibility settings placeholder
- [ ] Add privacy information section

---

## Phase 2: Backend API MVP

**Goal:** Build FastAPI backend skeleton supporting audio upload, task creation, result query, feedback submission, and lexicon management.

**Acceptance Criteria:**
- Backend runs locally.
- Frontend can call backend health endpoint.
- Audio upload works.
- Database records are created.
- API response shapes match `docs/API.md`.

### 2.1 Backend Setup

- [ ] Initialize FastAPI project in `backend/`
- [ ] Create backend app structure (`app/api/`, `app/services/`, `app/db/`, `app/schemas/`, `app/core/`, `app/utils/`)
- [ ] Add environment configuration (`app/core/config.py`)
- [ ] Add CORS configuration for frontend origin
- [ ] Add health check endpoint (`GET /api/health`)
- [ ] Add logging setup
- [ ] Add `requirements.txt` or `pyproject.toml`

### 2.2 Database Setup

- [ ] Configure SQLite database (`backend/data/speechbridge.db`)
- [ ] Create database connection module (`app/db/database.py`)
- [ ] Create ORM models (`app/db/models.py`) for all 8 tables
- [ ] Create Pydantic schemas (`app/schemas/`)
- [ ] Create initial migration or create-table script
- [ ] Create tables: `audio_records`, `asr_results`, `uncertainty_results`, `repair_results`, `tts_outputs`, `feedback_records`, `lexicon_entries`, `error_logs`
- [ ] Add seed data for lexicon if useful

### 2.3 Audio API

- [ ] Implement `POST /api/audio/upload` — accept file, validate type/size, save to `data/uploads/`, store metadata, return `audio_id`
- [ ] Implement `POST /api/audio/recording` — same as upload but labeled as recording source
- [ ] Validate file type (wav, mp3, m4a, webm)
- [ ] Validate file size (max 50MB)
- [ ] Save uploaded audio to `data/uploads/`
- [ ] Store audio metadata in `audio_records` table
- [ ] Return `audio_id` and metadata

### 2.4 Analysis API

- [ ] Implement `POST /api/analysis/start` — accept `audio_id`, create analysis record, return `analysis_id`
- [ ] Implement `GET /api/analysis/{analysis_id}` — return full analysis result structure
- [ ] Return pending/completed/failed status
- [ ] Return structured result matching `docs/API.md` response shape

### 2.5 History API

- [ ] Implement `GET /api/history` — return recent analysis records
- [ ] Support basic pagination (page, page_size)
- [ ] Support status filter if simple

### 2.6 Feedback API

- [ ] Implement `POST /api/feedback` — store user feedback
- [ ] Store corrected text if provided
- [ ] Link feedback to `repair_result_id`
- [ ] Return success response

### 2.7 Lexicon API

- [ ] Implement `GET /api/lexicon` — return all lexicon entries
- [ ] Implement `POST /api/lexicon` — add new lexicon entry
- [ ] Implement `DELETE /api/lexicon/{entry_id}` — delete lexicon entry
- [ ] Validate lexicon terms
- [ ] Store source as user/manual/system

---

## Phase 3: ASR Integration

**Goal:** Integrate faster-whisper for audio transcription backbone.

**Acceptance Criteria:**
- Uploaded audio can be transcribed.
- Raw ASR text is stored.
- Analysis result returns raw ASR output.
- ASR service is isolated from API routes.

### Tasks

- [ ] Install faster-whisper dependencies (`pip install faster-whisper`)
- [ ] Add `ASRService` class (`app/services/asr_service.py`)
- [ ] Configure ASR model name in environment variables
- [ ] Implement `transcribe(audio_path)` method
- [ ] Return `raw_text` (full transcription)
- [ ] Return `segments` (timestamped segments with confidence)
- [ ] Return timestamps if available
- [ ] Store ASR result in `asr_results` table
- [ ] Connect `ASRService` to analysis pipeline
- [ ] Add error handling for ASR failure (log error, return partial result)
- [ ] Add simple test audio sample for verification
- [ ] Verify English accented speech can be transcribed

---

## Phase 4: Uncertainty Detection MVP

**Goal:** Detect high-risk regions in ASR output to feed into semantic repair.

**Acceptance Criteria:**
- System can identify high-risk text regions.
- Uncertain spans are structured as JSON.
- Frontend can highlight uncertain spans.
- Uncertainty logic is separated from repair logic.

### Tasks

- [ ] Add `UncertaintyService` class (`app/services/uncertainty_service.py`)
- [ ] Detect low-confidence segments (if ASR confidence is available)
- [ ] Detect named entities and capitalized terms heuristically
- [ ] Detect numbers and dates
- [ ] Detect repeated fragments
- [ ] Detect incomplete phrases
- [ ] Detect domain lexicon mismatch if possible
- [ ] Output `uncertain_spans` as structured JSON
- [ ] Store uncertainty result in `uncertainty_results` table
- [ ] Show uncertain spans in frontend Result page
- [ ] Add mock and real examples for testing

---

## Phase 5: LLM Semantic Repair MVP

**Goal:** Integrate MiMo or compatible LLM API for constrained semantic repair.

**Acceptance Criteria:**
- System can produce repaired text.
- Repair does not freely rewrite the entire transcript.
- Before/after comparison is visible.
- Repair result is logged.

### Tasks

- [ ] Create `prompts/` directory if not already created
- [ ] Create `prompts/repair_prompt.md` with constrained repair instructions
- [ ] Add `RepairService` class (`app/services/repair_service.py`)
- [ ] Add LLM client wrapper (`app/core/llm_client.py`)
- [ ] Store API key in environment variables (never in code)
- [ ] Build repair payload from `raw_text`, `uncertain_spans`, context, lexicon
- [ ] Ensure LLM only edits uncertain or high-risk spans
- [ ] Generate `repaired_text`
- [ ] Generate `edits_json` (original → repaired, reason, confidence)
- [ ] Store repair result in `repair_results` table
- [ ] Return repaired result to frontend
- [ ] Display before/after diff in frontend
- [ ] Add repair failure fallback (return raw ASR text if repair fails)

---

## Phase 6: Standard Expression and TTS MVP

**Goal:** Produce standardized text and understandable voice output for accent correction and speech impairment assistance.

**Acceptance Criteria:**
- System outputs standard expression text.
- System can provide playable TTS output or mock output.
- TTS does not change semantic meaning.

### Tasks

- [ ] Add `StandardExpressionService` (can be part of `RepairService`)
- [ ] Convert repaired text into standard expression text
- [ ] Preserve original meaning — do not over-polish user intent
- [ ] Add `TTSService` class (`app/services/tts_service.py`)
- [ ] Select initial TTS provider or implement mock TTS in V1
- [ ] Generate TTS-ready text (cleaned for speech synthesis)
- [ ] Generate voice output file or mock URL
- [ ] Store TTS output in `tts_outputs` table
- [ ] Add TTS playback to frontend Result page

---

## Phase 7: Feedback Loop and Lightweight Adaptation

**Goal:** Build system evolution mechanism so errors and feedback become optimization data.

**Acceptance Criteria:**
- User feedback is stored.
- Corrections can be reused.
- Error logs are structured.
- System has a real learning loop foundation.

### Tasks

- [ ] Save user feedback from frontend to database
- [ ] Allow user to correct final text in feedback form
- [ ] Store `corrected_text` in `feedback_records`
- [ ] Add `error_logs` generation for processing failures
- [ ] Classify basic error types: substitution, deletion, entity_error, semantic_inconsistency, disfluency
- [ ] Add simple lexicon update suggestion from corrected text
- [ ] Add manual lexicon update flow
- [ ] Add adaptation notes in database or logs
- [ ] Create basic admin/dev script to inspect feedback records

---

## Phase 8: Frontend-Backend Integration

**Goal:** Switch PWA frontend from mock data to real API.

**Acceptance Criteria:**
- End-to-end flow works.
- User can record/upload audio and see real processed result.
- History and feedback work with database.

### Tasks

- [ ] Create frontend API client (`frontend/services/api.ts`)
- [ ] Connect audio upload page to backend `POST /api/audio/upload`
- [ ] Connect Start Analysis button to backend `POST /api/analysis/start`
- [ ] Poll or fetch analysis result via `GET /api/analysis/{id}`
- [ ] Display real raw ASR output
- [ ] Display real uncertain spans
- [ ] Display real repaired text
- [ ] Display real standard expression
- [ ] Submit real feedback via `POST /api/feedback`
- [ ] Fetch real history via `GET /api/history`
- [ ] Fetch and update real lexicon via `GET/POST/DELETE /api/lexicon`

---

## Phase 9: Testing and Quality Assurance

**Goal:** Ensure system is maintainable, demonstrable, and reasonably reliable.

**Acceptance Criteria:**
- Main flow is reliable.
- Common failures are handled.
- Demo does not break easily.

### Tasks

- [ ] Add frontend linting (ESLint + Prettier)
- [ ] Add backend linting (Ruff or Flake8)
- [ ] Add basic frontend component tests if practical
- [ ] Add backend API tests (pytest)
- [ ] Add service tests with mock LLM responses
- [ ] Test file upload validation (wrong type, too large)
- [ ] Test microphone recording on mobile browser
- [ ] Test Vercel deployed frontend
- [ ] Test backend CORS configuration
- [ ] Test error states (ASR failure, repair failure, TTS failure)
- [ ] Test empty states (no history, no lexicon, no results)
- [ ] Test long audio failure behavior (timeout, memory)
- [ ] Verify no secrets are committed to git

---

## Phase 10: Deployment

**Goal:** Deploy a demonstrable version.

**Acceptance Criteria:**
- App is accessible on mobile.
- Microphone permission works.
- Frontend and backend communicate successfully.
- Demo can be shown to users or judges.

### Tasks

- [ ] Deploy frontend to Vercel
- [ ] Configure HTTPS frontend domain
- [ ] Verify microphone permission works on deployed mobile site
- [ ] Deploy backend to suitable Python hosting (Railway, Render, or VPS)
- [ ] Configure environment variables on production
- [ ] Configure CORS for production frontend domain
- [ ] Verify upload works in production
- [ ] Verify analysis works in production
- [ ] Verify feedback works in production
- [ ] Add deployment instructions to README

---

## Phase 11: Documentation and Demo Preparation

**Goal:** Prepare project for presentation, explanation, and future development.

**Acceptance Criteria:**
- A new developer can understand and run the project.
- A judge or advisor can understand the system value.
- Demo flow is clear.

### Tasks

- [ ] Update `README.md` with final project description
- [ ] Add setup instructions (frontend + backend)
- [ ] Add frontend run instructions
- [ ] Add backend run instructions
- [ ] Add environment variable guide
- [ ] Add demo flow screenshots if possible
- [ ] Add known limitations section
- [ ] Add future roadmap section
- [ ] Add sample test audio instructions
- [ ] Add project explanation for non-technical audience

---

## Future Phases

**Do not implement now.** These are directions for future development after V1 is complete and validated.

- [ ] Real-time streaming ASR
- [ ] Real-time conversation mode
- [ ] Personalized speech profile
- [ ] Personalized voice output
- [ ] Advanced accessibility mode
- [ ] Multi-language support
- [ ] Speaker adaptation
- [ ] Fine-tuning or small reranker
- [ ] Cloud object storage (S3, R2, etc.)
- [ ] PostgreSQL migration
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Analytics dashboard

---

## Working Instruction for Claude Code

Before implementing any task:

1. Read `.claude/rules/`
2. Read `docs/`
3. Check `todo.md`
4. Pick the next unchecked task
5. Make a small implementation plan
6. Implement only that task
7. Run tests or checks if available
8. Mark the task as completed only after verification
9. Do not jump ahead
10. Do not introduce unnecessary complexity

---

*End of todo.md.*

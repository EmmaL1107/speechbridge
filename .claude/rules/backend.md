# Backend Rules

## Core Requirements

* Backend must use FastAPI.
* Backend must provide API services for the PWA frontend.
* Backend is responsible for all heavy AI processing.
* Backend must handle:
  * audio upload
  * audio preprocessing
  * faster-whisper transcription
  * uncertainty detection
  * semantic repair through LLM API
  * standard text output
  * TTS output
  * feedback logging
  * lexicon management
  * error logging
  * lightweight adaptation

## Architecture Rules

* Use routers for HTTP endpoints only.
* Put business logic in services.
* Put database logic in repository/model layer.
* Put request/response validation in schemas.
* Do not call AI models directly from routers.
* Do not write large monolithic functions.
* Each service should have a clear responsibility.

## Recommended Service Modules

* AudioService
* ASRService
* UncertaintyService
* RepairService
* TTSService
* FeedbackService
* LexiconService
* HistoryService
* AdaptationService

## Recommended API Endpoints for V1

```
POST   /api/audio/upload
POST   /api/audio/recording
POST   /api/analysis/start
GET    /api/analysis/{analysis_id}
GET    /api/history
POST   /api/feedback
GET    /api/lexicon
POST   /api/lexicon
DELETE /api/lexicon/{entry_id}
GET    /api/health
```

## Audio Rules

* Do not store raw audio in the database.
* Store audio files in the file system or object storage.
* Store only file paths and metadata in the database.
* Normalize uploaded audio before ASR.
* Keep original audio when possible for reproducibility.

## Database Rules

V1 can use SQLite.
Future versions should support PostgreSQL.

Required tables:

* audio_records
* asr_results
* uncertainty_results
* repair_results
* tts_outputs
* feedback_records
* lexicon_entries
* error_logs
* user_profiles (in future)

## Security and Privacy Rules

* Treat audio as sensitive data.
* Do not log API keys.
* Do not expose model provider credentials to the frontend.
* Use environment variables for secrets.
* Validate uploaded file type and size.
* Add CORS configuration for frontend domain.
* Return safe error messages.

## Performance Rules

* Long-running ASR tasks should eventually support background jobs.
* V1 may use synchronous processing for simplicity.
* Design APIs so they can later become asynchronous.
* Avoid blocking frontend unnecessarily.

---

When implementing backend code, always separate router, schema, service, and database responsibilities.

# API Specification

**Product Name:** SpeechBridge
**Version:** 1.0
**Last Updated:** 2026-05-30

**Base URL:** `https://api.speechbridge.app` (production) / `http://localhost:8000` (development)

---

## 1. Overview

The SpeechBridge API follows REST conventions. All request and response bodies use JSON unless otherwise specified. Audio file uploads use `multipart/form-data`.

### Common Headers

```
Content-Type: application/json
Accept: application/json
```

### Common Response Format

All successful responses return the requested data directly. All error responses follow this format:

```json
{
    "detail": "Error description"
}
```

### Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request — invalid input |
| 404 | Not Found — resource does not exist |
| 413 | Payload Too Large — file exceeds size limit |
| 415 | Unsupported Media Type — file format not supported |
| 422 | Unprocessable Entity — validation error |
| 500 | Internal Server Error |

---

## 2. Endpoints

### 2.1 POST /api/audio/upload

Upload an audio file for processing.

**Request:**

- Content-Type: `multipart/form-data`
- Body:

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Audio file (wav, mp3, m4a, webm). Max 50MB. |

**Example (curl):**

```bash
curl -X POST https://api.speechbridge.app/api/audio/upload \
  -F "file=@/path/to/audio.wav"
```

**Response (201 Created):**

```json
{
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "file_name": "audio.wav",
    "duration": 45.2,
    "format": "wav",
    "file_size": 1440000,
    "created_at": "2026-05-30T10:30:00Z"
}
```

**Error (413 Payload Too Large):**

```json
{
    "detail": "File size exceeds maximum allowed size of 50MB"
}
```

**Error (415 Unsupported Media Type):**

```json
{
    "detail": "Unsupported audio format. Allowed formats: wav, mp3, m4a, webm"
}
```

---

### 2.2 POST /api/audio/recording

Upload a browser-recorded audio file.

**Request:**

- Content-Type: `multipart/form-data`
- Body:

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Recorded audio file (wav or webm). Max 50MB. |

**Response (201 Created):**

```json
{
    "audio_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "file_name": "recording.webm",
    "duration": 30.0,
    "format": "webm",
    "file_size": 960000,
    "created_at": "2026-05-30T10:35:00Z"
}
```

**Error responses:** Same as `/api/audio/upload`.

---

### 2.3 POST /api/analysis/start

Start the full AI analysis pipeline for an uploaded audio file.

**Request:**

- Content-Type: `application/json`
- Body:

```json
{
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `audio_id` | string (UUID) | Yes | ID of a previously uploaded audio file. |

**Response (200 OK):**

```json
{
    "analysis_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "completed",
    "created_at": "2026-05-30T10:31:00Z"
}
```

**Error (404 Not Found):**

```json
{
    "detail": "Audio record not found"
}
```

**Error (422 Unprocessable Entity):**

```json
{
    "detail": "Audio file is corrupted or cannot be processed"
}
```

---

### 2.4 GET /api/analysis/{analysis_id}

Retrieve the full analysis result for a given analysis.

**Request:**

- Path parameter: `analysis_id` (string, UUID)

**Response (200 OK):**

```json
{
    "analysis_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "completed",
    "audio": {
        "file_name": "audio.wav",
        "duration": 45.2,
        "format": "wav",
        "source_type": "upload",
        "created_at": "2026-05-30T10:30:00Z"
    },
    "asr": {
        "raw_text": "teh quik brown fox jumps over teh lazy dog",
        "segments": [
            {
                "start": 0.0,
                "end": 2.5,
                "text": "teh quik brown fox",
                "confidence": 0.72
            },
            {
                "start": 2.5,
                "end": 4.8,
                "text": "jumps over teh lazy dog",
                "confidence": 0.81
            }
        ],
        "model_name": "faster-whisper-large-v3",
        "language": "en"
    },
    "uncertainty": {
        "risk_score": 0.65,
        "uncertain_spans": [
            {
                "start": 0,
                "end": 3,
                "text": "teh",
                "risk_type": "low_confidence",
                "risk_score": 0.88,
                "suggested_alternatives": ["the"]
            },
            {
                "start": 4,
                "end": 8,
                "text": "quik",
                "risk_type": "substitution",
                "risk_score": 0.91,
                "suggested_alternatives": ["quick", "quack"]
            },
            {
                "start": 28,
                "end": 31,
                "text": "teh",
                "risk_type": "low_confidence",
                "risk_score": 0.85,
                "suggested_alternatives": ["the"]
            }
        ]
    },
    "repair": {
        "repaired_text": "the quick brown fox jumps over the lazy dog",
        "standard_text": "The quick brown fox jumps over the lazy dog.",
        "edits": [
            {
                "original": "teh",
                "repaired": "the",
                "start": 0,
                "end": 3,
                "reason": "spelling correction based on context",
                "confidence": 0.98
            },
            {
                "original": "quik",
                "repaired": "quick",
                "start": 4,
                "end": 8,
                "reason": "spelling correction",
                "confidence": 0.97
            },
            {
                "original": "teh",
                "repaired": "the",
                "start": 28,
                "end": 31,
                "reason": "spelling correction based on context",
                "confidence": 0.98
            }
        ],
        "repair_model": "gpt-4o-mini",
        "processing_time": 2.1
    },
    "tts": {
        "voice_type": "standard",
        "duration": 4.5,
        "audio_url": "/api/audio/tts/c3d4e5f6-a7b8-9012-cdef-123456789012"
    },
    "processing_time": {
        "asr": 3.2,
        "uncertainty": 0.1,
        "repair": 2.1,
        "tts": 1.8,
        "total": 7.2
    },
    "created_at": "2026-05-30T10:31:00Z"
}
```

**Error (404 Not Found):**

```json
{
    "detail": "Analysis not found"
}
```

---

### 2.5 GET /api/history

Retrieve the list of past analyses.

**Request:**

- Query parameters:

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | integer | No | 1 | Page number |
| `page_size` | integer | No | 20 | Items per page (max 100) |
| `source_type` | string | No | — | Filter by "recording" or "upload" |
| `date_from` | string (ISO 8601) | No | — | Filter from date |
| `date_to` | string (ISO 8601) | No | — | Filter to date |

**Response (200 OK):**

```json
{
    "items": [
        {
            "analysis_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
            "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "file_name": "audio.wav",
            "duration": 45.2,
            "source_type": "upload",
            "raw_text_preview": "teh quik brown fox jumps over teh lazy...",
            "repaired_text_preview": "The quick brown fox jumps over the lazy...",
            "status": "completed",
            "has_feedback": false,
            "created_at": "2026-05-30T10:31:00Z"
        }
    ],
    "total": 1,
    "page": 1,
    "page_size": 20
}
```

---

### 2.6 POST /api/feedback

Submit user feedback on an analysis result.

**Request:**

- Content-Type: `application/json`
- Body:

```json
{
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "repair_result_id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "feedback_type": "needs_improvement",
    "corrected_text": "The quick brown fox jumps over the lazy dog.",
    "error_category": "wrong_word",
    "comment": "The word 'quik' was not recognized correctly."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `audio_id` | string (UUID) | Yes | ID of the audio record |
| `repair_result_id` | string (UUID) | Yes | ID of the repair result |
| `feedback_type` | string | Yes | "good", "needs_improvement", or "bad" |
| `corrected_text` | string | No | User-provided corrected text |
| `error_category` | string | No | Error type classification |
| `comment` | string | No | Free-text comment |

**Response (201 Created):**

```json
{
    "feedback_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
    "audio_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "repair_result_id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "feedback_type": "needs_improvement",
    "created_at": "2026-05-30T10:45:00Z"
}
```

**Error (422 Unprocessable Entity):**

```json
{
    "detail": "Invalid feedback_type. Must be one of: good, needs_improvement, bad"
}
```

---

### 2.7 GET /api/lexicon

Retrieve all lexicon entries.

**Request:**

- Query parameters:

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `category` | string | No | — | Filter by category |
| `domain` | string | No | — | Filter by domain |
| `search` | string | No | — | Search term text |
| `page` | integer | No | 1 | Page number |
| `page_size` | integer | No | 50 | Items per page (max 200) |

**Response (200 OK):**

```json
{
    "items": [
        {
            "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
            "term": "TensorFlow",
            "pronunciation": null,
            "category": "technical",
            "domain": "machine_learning",
            "source": "user",
            "notes": "Google ML framework",
            "created_at": "2026-05-28T09:00:00Z",
            "updated_at": "2026-05-28T09:00:00Z"
        },
        {
            "id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
            "term": "Zhang Wei",
            "pronunciation": null,
            "category": "person",
            "domain": null,
            "source": "user",
            "notes": "Colleague name",
            "created_at": "2026-05-29T14:00:00Z",
            "updated_at": "2026-05-29T14:00:00Z"
        }
    ],
    "total": 2,
    "page": 1,
    "page_size": 50
}
```

---

### 2.8 POST /api/lexicon

Add a new lexicon entry.

**Request:**

- Content-Type: `application/json`
- Body:

```json
{
    "term": "Kubernetes",
    "pronunciation": null,
    "category": "technical",
    "domain": "cloud_computing",
    "notes": "Container orchestration platform"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `term` | string | Yes | The lexicon term |
| `pronunciation` | string | No | Phonetic representation |
| `category` | string | No | "person", "place", "technical", "organization", "other". Default: "other" |
| `domain` | string | No | Domain tag |
| `notes` | string | No | User notes |

**Response (201 Created):**

```json
{
    "id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
    "term": "Kubernetes",
    "pronunciation": null,
    "category": "technical",
    "domain": "cloud_computing",
    "source": "user",
    "notes": "Container orchestration platform",
    "created_at": "2026-05-30T11:00:00Z",
    "updated_at": "2026-05-30T11:00:00Z"
}
```

**Error (422 Unprocessable Entity):**

```json
{
    "detail": [
        {
            "loc": ["body", "term"],
            "msg": "field required",
            "type": "value_error"
        }
    ]
}
```

---

### 2.9 DELETE /api/lexicon/{id}

Delete a lexicon entry.

**Request:**

- Path parameter: `id` (string, UUID)

**Response (200 OK):**

```json
{
    "message": "Lexicon entry deleted successfully",
    "id": "b8c9d0e1-f2a3-4567-bcde-678901234567"
}
```

**Error (404 Not Found):**

```json
{
    "detail": "Lexicon entry not found"
}
```

---

### 2.10 GET /api/health

Health check endpoint for monitoring and deployment verification.

**Request:**

- No parameters

**Response (200 OK):**

```json
{
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-05-30T12:00:00Z",
    "services": {
        "database": "ok",
        "asr": "ok",
        "llm": "ok",
        "tts": "ok"
    }
}
```

**Response (503 Service Unavailable) — when a critical service is down:**

```json
{
    "status": "degraded",
    "version": "1.0.0",
    "timestamp": "2026-05-30T12:00:00Z",
    "services": {
        "database": "ok",
        "asr": "ok",
        "llm": "error",
        "tts": "ok"
    }
}
```

---

## 3. Audio File Access

### GET /api/audio/tts/{analysis_id}

Retrieve the TTS audio file for a given analysis. Returns the audio file directly with appropriate content type.

**Response (200 OK):**

- Content-Type: `audio/mpeg` or `audio/wav`
- Body: Audio file binary data

**Error (404 Not Found):**

```json
{
    "detail": "TTS audio not found"
}
```

---

## 4. Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| POST /api/audio/upload | 10 requests | per minute |
| POST /api/audio/recording | 10 requests | per minute |
| POST /api/analysis/start | 5 requests | per minute |
| GET /api/analysis/* | 60 requests | per minute |
| POST /api/feedback | 30 requests | per minute |
| GET /api/lexicon | 60 requests | per minute |
| POST /api/lexicon | 30 requests | per minute |
| DELETE /api/lexicon/* | 30 requests | per minute |
| GET /api/health | 120 requests | per minute |

When rate limit is exceeded:

**Response (429 Too Many Requests):**

```json
{
    "detail": "Rate limit exceeded. Please try again later."
}
```

---

## 5. CORS Configuration

The API accepts requests from the frontend domain only.

**Allowed origins:**

- `https://speechbridge.app` (production)
- `http://localhost:3000` (development)

**Allowed methods:**

- GET, POST, PUT, DELETE, OPTIONS

**Allowed headers:**

- Content-Type, Accept, Authorization (future)

---

## 6. Future API Additions

The following endpoints are planned for future phases:

- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User authentication
- `GET /api/user/profile` — User profile
- `PUT /api/user/settings` — User settings
- `POST /api/audio/stream` — Streaming audio upload (real-time)
- `GET /api/analysis/{id}/stream` — SSE stream for real-time results

---

*This document describes the API specification for SpeechBridge V1. It should be updated as new endpoints are added or existing endpoints are modified.*

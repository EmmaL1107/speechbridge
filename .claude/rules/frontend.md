# Frontend Rules

## Core Requirements

* The frontend must use Next.js with TypeScript.
* Use App Router unless there is a strong reason not to.
* The frontend must be a PWA.
* The frontend must be mobile-first.
* The app must be deployable to Vercel.

## Audio Recording

* The frontend must support microphone recording through browser APIs.
* Use getUserMedia and MediaRecorder for browser audio recording.
* Assume microphone access requires HTTPS.
* Do not request microphone permission before the user explicitly starts recording.
* Show clear microphone permission status.
* The app must support audio upload.
* Supported file hints: wav, mp3, m4a, webm.

## Required Pages

The UI must not put all features on one page.

Required pages:

* Home / Dashboard
* Speak / Record
* Result / Analysis Detail
* History
* Lexicon
* Profile / Settings

## Navigation

Mobile bottom navigation:

```
Home | Speak | History | Lexicon | Profile
```

Result page can be opened from a completed task or history item.

## UI/UX Rules

* Modern, clean, professional, accessible.
* Avoid childish colors or overly decorative design.
* Use clear cards and spacing.
* Use readable typography.
* Prioritize mobile usability.
* Buttons must be large enough for mobile touch.
* Keep the recording action highly visible.
* Long text must be readable and well-spaced.
* Use clear visual distinction for:
  * raw ASR text
  * uncertain spans
  * repaired text
  * standard output
  * feedback actions

## Component Rules

* Use small reusable components.
* Avoid components longer than 300 lines.
* Do not put API calls directly inside UI components.
* API calls must be placed in a service layer.
* State should be simple in V1.
* Avoid unnecessary global state.
* Mock data is allowed before backend integration, but it must match the future API response shape.

## Required Frontend Modules

* Audio recorder component
* Audio uploader component
* Audio preview player
* Raw transcript viewer
* Uncertain span highlighter
* Repaired text viewer
* Diff viewer
* TTS playback card
* Feedback form
* History list
* Lexicon manager
* App settings panel

## PWA Requirements

* Include manifest.
* Include app icons placeholder.
* Include service worker or PWA setup.
* Must be installable when deployed.
* Do not over-optimize offline mode in V1.
* Core AI features may require backend connection.

## Accessibility Requirements

* Support keyboard navigation where practical.
* Use semantic HTML.
* Buttons and inputs must have accessible labels.
* Do not rely only on color to convey uncertainty or errors.
* Provide text labels for status badges.

---

When building frontend features, preserve product clarity and mobile-first usability.

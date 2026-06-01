/**
 * Lightweight client-side audio store.
 *
 * Shares recorded audio URL and metadata between the Speak and Result pages
 * without requiring a backend or complex state management.
 *
 * Uses module-level state — persists across route navigations within the
 * same browser session. No external dependencies.
 */

export interface RecordedAudio {
  /** Object URL created from the recorded Blob */
  url: string;
  /** Duration in seconds */
  duration: number;
  /** Recording source */
  source: "recording" | "upload";
  /** Timestamp when recorded */
  recordedAt: number;
}

let _recordedAudio: RecordedAudio | null = null;

export function setRecordedAudio(audio: RecordedAudio): void {
  // Revoke previous URL to prevent memory leaks
  if (_recordedAudio?.url) {
    URL.revokeObjectURL(_recordedAudio.url);
  }
  _recordedAudio = audio;
}

export function getRecordedAudio(): RecordedAudio | null {
  return _recordedAudio;
}

export function clearRecordedAudio(): void {
  if (_recordedAudio?.url) {
    URL.revokeObjectURL(_recordedAudio.url);
  }
  _recordedAudio = null;
}

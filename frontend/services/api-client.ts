/**
 * API Client for SpeechBridge backend.
 *
 * In V1 (mock phase), all methods return mock data.
 * When backend is ready, replace mock implementations with real fetch calls.
 *
 * All API response types are defined in types/analysis.ts
 * and must match docs/API.md specification.
 */

import {
  mockAccentAnalysis,
  mockImpairmentAnalysis,
  mockAnalyses,
  getAnalysisById,
} from "@/lib/mock-data";
import type {
  AnalysisResult,
  AnalysisSummary,
  FeedbackType,
} from "@/types/analysis";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// --- Audio ---

export async function uploadAudio(_file: File): Promise<{ audio_id: string }> {
  // TODO: Replace with POST /api/audio/upload
  await delay(500);
  return { audio_id: "mock-audio-" + Date.now() };
}

// --- Analysis ---

export async function startAnalysis(
  _audioId: string
): Promise<{ analysis_id: string }> {
  // TODO: Replace with POST /api/analysis/start
  await delay(300);
  return { analysis_id: mockAccentAnalysis.analysis_id };
}

export async function getAnalysis(
  analysisId: string
): Promise<AnalysisResult | null> {
  // TODO: Replace with GET /api/analysis/{analysis_id}
  await delay(200);
  return getAnalysisById(analysisId) ?? null;
}

// --- History ---

export async function getHistory(): Promise<AnalysisSummary[]> {
  // TODO: Replace with GET /api/history
  await delay(300);
  return mockAnalyses;
}

// --- Feedback ---

export async function submitFeedback(
  _analysisId: string,
  _feedbackType: FeedbackType,
  _correctedText?: string
): Promise<{ success: boolean }> {
  // TODO: Replace with POST /api/feedback
  await delay(300);
  return { success: true };
}

// --- Health ---

export async function healthCheck(): Promise<{ status: string }> {
  // TODO: Replace with GET /api/health
  return { status: "mock" };
}

// --- Utils ---

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

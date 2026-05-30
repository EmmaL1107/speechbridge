export type SourceType = "recording" | "upload";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";
export type RiskType =
  | "low_confidence"
  | "entity"
  | "number"
  | "technical_term"
  | "disfluency"
  | "incomplete"
  | "substitution";
export type FeedbackType = "good" | "needs_improvement" | "bad";
export type UserMode = "accent_correction" | "speech_impairment_assistance";

export interface AudioSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface AudioRecord {
  id: string;
  file_name: string;
  duration: number;
  source_type: SourceType;
  format: string;
  file_size: number;
  created_at: string;
}

export interface ASRResult {
  raw_text: string;
  segments: AudioSegment[];
  model_name: string;
  language: string;
}

export interface UncertainSpan {
  start: number;
  end: number;
  text: string;
  risk_type: RiskType;
  risk_score: number;
  suggested_alternatives: string[];
}

export interface UncertaintyResult {
  risk_score: number;
  uncertain_spans: UncertainSpan[];
}

export interface Edit {
  original: string;
  repaired: string;
  start: number;
  end: number;
  reason: string;
  confidence: number;
}

export interface RepairResult {
  repaired_text: string;
  standard_text: string;
  edits: Edit[];
  repair_model: string;
}

export interface TTSOutput {
  voice_type: string;
  duration: number;
  audio_url: string;
}

export interface ProcessingTime {
  asr: number;
  uncertainty: number;
  repair: number;
  tts: number;
  total: number;
}

export interface AnalysisResult {
  analysis_id: string;
  audio: AudioRecord;
  asr: ASRResult;
  uncertainty: UncertaintyResult;
  repair: RepairResult;
  tts: TTSOutput;
  processing_time: ProcessingTime;
  status: AnalysisStatus;
  created_at: string;
}

export interface AnalysisSummary {
  analysis_id: string;
  file_name: string;
  duration: number;
  source_type: SourceType;
  raw_text_preview: string;
  repaired_text_preview: string;
  status: AnalysisStatus;
  has_feedback: boolean;
  created_at: string;
}

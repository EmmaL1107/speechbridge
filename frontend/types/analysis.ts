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
export type VocabularyCategory =
  | "people"
  | "organizations"
  | "technical"
  | "custom";

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
  intent?: IntentDetection;
  voice_comparison?: VoiceComparison;
  meaning_recovery_score?: number;
}

export interface AnalysisSummary {
  analysis_id: string;
  file_name: string;
  duration: number;
  source_type: SourceType;
  mode: UserMode;
  raw_text_preview: string;
  repaired_text_preview: string;
  status: AnalysisStatus;
  has_feedback: boolean;
  created_at: string;
  confidence_improvement: number;
  repair_count: number;
  is_favorite: boolean;
}

export interface VocabularyEntry {
  id: string;
  term: string;
  category: VocabularyCategory;
  domain: string;
  usage_count: number;
  corrections_avoided: number;
}

export interface HomeDemoExample {
  raw: string;
  repaired: string;
  confidence_score: number;
  meaning_recovery: number;
  repair_count: number;
  mode: UserMode;
}

export interface UserProfile {
  total_analyses: number;
  average_confidence: number;
  vocabulary_size: number;
  corrections_avoided: number;
  learning_progress: number;
}

export interface DetectedIssue {
  original: string;
  suggested: string;
  issue_type: string;
  confidence: number;
  explanation: string;
}

export interface RepairExplanation {
  step: string;
  detail: string;
}

export interface FeedbackPayload {
  analysis_id: string;
  choice: "good" | "needs_correction";
  corrected_text?: string;
}

export interface IntentDetection {
  intents: string[];
  confidence: number;
  topic: string;
}

export interface VoiceMetrics {
  clarity: number;
  naturalness: number;
  confidence: number;
}

export interface VoiceComparison {
  original: VoiceMetrics;
  standard: VoiceMetrics;
}

export interface SuccessStory {
  id: string;
  raw_text: string;
  repaired_text: string;
  meaning_recovery: number;
  mode: UserMode;
  time_ago: string;
}

export interface VoiceModelProfile {
  recovery_accuracy: number;
  vocabulary_learned: number;
  corrections_avoided: number;
  preferred_expressions: string[];
  frequent_topics: string[];
  accent_patterns: string[];
  progress_history: { month: string; accuracy: number }[];
}

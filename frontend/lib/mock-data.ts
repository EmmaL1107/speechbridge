import type {
  AnalysisResult,
  AnalysisSummary,
  HomeDemoExample,
  VocabularyEntry,
  UserProfile,
  SuccessStory,
  VoiceModelProfile,
} from "@/types/analysis";

export const mockAccentAnalysis: AnalysisResult = {
  analysis_id: "acc-001-a1b2c3d4",
  audio: {
    id: "audio-001",
    file_name: "meeting_notes_recording.wav",
    duration: 42.5,
    source_type: "recording",
    format: "wav",
    file_size: 1360000,
    created_at: "2026-05-30T09:15:00Z",
  },
  asr: {
    raw_text:
      "I would like to discuss teh projec deadline wiz teh team nex weak. We need to finalize teh design document and sent it to teh client for review. Also please check if teh server configration is ready for deployement.",
    segments: [
      {
        start: 0.0,
        end: 4.2,
        text: "I would like to discuss teh projec deadline",
        confidence: 0.74,
      },
      {
        start: 4.2,
        end: 7.8,
        text: "wiz teh team nex weak",
        confidence: 0.68,
      },
      {
        start: 7.8,
        end: 13.5,
        text: "We need to finalize teh design document",
        confidence: 0.82,
      },
      {
        start: 13.5,
        end: 18.1,
        text: "and sent it to teh client for review",
        confidence: 0.71,
      },
      {
        start: 18.1,
        end: 22.0,
        text: "Also please check if teh server configration",
        confidence: 0.65,
      },
      {
        start: 22.0,
        end: 25.3,
        text: "is ready for deployement",
        confidence: 0.72,
      },
    ],
    model_name: "faster-whisper-large-v3",
    language: "en",
  },
  uncertainty: {
    risk_score: 0.71,
    uncertain_spans: [
      {
        start: 28,
        end: 31,
        text: "teh",
        risk_type: "substitution",
        risk_score: 0.92,
        suggested_alternatives: ["the"],
      },
      {
        start: 32,
        end: 38,
        text: "projec",
        risk_type: "substitution",
        risk_score: 0.88,
        suggested_alternatives: ["project"],
      },
      {
        start: 48,
        end: 51,
        text: "wiz",
        risk_type: "substitution",
        risk_score: 0.94,
        suggested_alternatives: ["with"],
      },
      {
        start: 52,
        end: 55,
        text: "teh",
        risk_type: "substitution",
        risk_score: 0.91,
        suggested_alternatives: ["the"],
      },
      {
        start: 56,
        end: 59,
        text: "nex",
        risk_type: "substitution",
        risk_score: 0.89,
        suggested_alternatives: ["next"],
      },
      {
        start: 60,
        end: 64,
        text: "weak",
        risk_type: "substitution",
        risk_score: 0.87,
        suggested_alternatives: ["week"],
      },
      {
        start: 83,
        end: 86,
        text: "teh",
        risk_type: "substitution",
        risk_score: 0.93,
        suggested_alternatives: ["the"],
      },
      {
        start: 108,
        end: 112,
        text: "sent",
        risk_type: "substitution",
        risk_score: 0.85,
        suggested_alternatives: ["send"],
      },
      {
        start: 116,
        end: 119,
        text: "teh",
        risk_type: "substitution",
        risk_score: 0.9,
        suggested_alternatives: ["the"],
      },
      {
        start: 138,
        end: 141,
        text: "teh",
        risk_type: "substitution",
        risk_score: 0.91,
        suggested_alternatives: ["the"],
      },
      {
        start: 142,
        end: 155,
        text: "configration",
        risk_type: "substitution",
        risk_score: 0.95,
        suggested_alternatives: ["configuration"],
      },
      {
        start: 170,
        end: 181,
        text: "deployement",
        risk_type: "substitution",
        risk_score: 0.93,
        suggested_alternatives: ["deployment"],
      },
    ],
  },
  repair: {
    repaired_text:
      "I would like to discuss the project deadline with the team next week. We need to finalize the design document and send it to the client for review. Also please check if the server configuration is ready for deployment.",
    standard_text:
      "I would like to discuss the project deadline with the team next week. We need to finalize the design document and send it to the client for review. Also, please check if the server configuration is ready for deployment.",
    edits: [
      {
        original: "teh",
        repaired: "the",
        start: 28,
        end: 31,
        reason: "Common pronunciation-based spelling error",
        confidence: 0.98,
      },
      {
        original: "projec",
        repaired: "project",
        start: 32,
        end: 38,
        reason: "Truncated word — final consonant cluster missing",
        confidence: 0.96,
      },
      {
        original: "wiz",
        repaired: "with",
        start: 48,
        end: 51,
        reason: "Phonetic substitution — /ð/ → /z/",
        confidence: 0.97,
      },
      {
        original: "teh",
        repaired: "the",
        start: 52,
        end: 55,
        reason: "Common pronunciation-based spelling error",
        confidence: 0.98,
      },
      {
        original: "nex",
        repaired: "next",
        start: 56,
        end: 59,
        reason: "Truncated word — final consonant missing",
        confidence: 0.97,
      },
      {
        original: "weak",
        repaired: "week",
        start: 60,
        end: 64,
        reason: "Homophone substitution based on context",
        confidence: 0.95,
      },
      {
        original: "teh",
        repaired: "the",
        start: 83,
        end: 86,
        reason: "Common pronunciation-based spelling error",
        confidence: 0.98,
      },
      {
        original: "sent",
        repaired: "send",
        start: 108,
        end: 112,
        reason: "Tense correction based on context (infinitive required)",
        confidence: 0.94,
      },
      {
        original: "teh",
        repaired: "the",
        start: 116,
        end: 119,
        reason: "Common pronunciation-based spelling error",
        confidence: 0.98,
      },
      {
        original: "configration",
        repaired: "configuration",
        start: 138,
        end: 155,
        reason: "Misspelling — missing letter sequence",
        confidence: 0.97,
      },
      {
        original: "deployement",
        repaired: "deployment",
        start: 170,
        end: 181,
        reason: "Misspelling — incorrect suffix",
        confidence: 0.96,
      },
    ],
    repair_model: "gpt-4o-mini",
  },
  tts: {
    voice_type: "standard",
    duration: 28.3,
    audio_url: "/mock/tts/acc-001.mp3",
  },
  processing_time: {
    asr: 3.2,
    uncertainty: 0.1,
    repair: 2.4,
    tts: 1.8,
    total: 7.5,
  },
  status: "completed",
  created_at: "2026-05-30T09:15:00Z",
  intent: {
    intents: ["Discussing Project Timeline", "Delegating Tasks", "Requesting Action"],
    confidence: 0.94,
    topic: "Project Management",
  },
  voice_comparison: {
    original: { clarity: 62, naturalness: 58, confidence: 55 },
    standard: { clarity: 95, naturalness: 92, confidence: 94 },
  },
  meaning_recovery_score: 97,
};

export const mockImpairmentAnalysis: AnalysisResult = {
  analysis_id: "imp-002-e5f6g7h8",
  audio: {
    id: "audio-002",
    file_name: "daily_check_in.webm",
    duration: 35.0,
    source_type: "upload",
    format: "webm",
    file_size: 1120000,
    created_at: "2026-05-30T10:30:00Z",
  },
  asr: {
    raw_text:
      "I I want to go to the the park today and and meet my my friend there. We we are going to to have lunch lunch together. Can you you help me me write a a message to to her.",
    segments: [
      {
        start: 0.0,
        end: 3.8,
        text: "I I want to go to the the park today",
        confidence: 0.69,
      },
      {
        start: 3.8,
        end: 7.2,
        text: "and and meet my my friend there",
        confidence: 0.64,
      },
      {
        start: 7.2,
        end: 10.5,
        text: "We we are going to to have lunch lunch together",
        confidence: 0.61,
      },
      {
        start: 10.5,
        end: 14.8,
        text: "Can you you help me me write a a message to to her",
        confidence: 0.67,
      },
    ],
    model_name: "faster-whisper-large-v3",
    language: "en",
  },
  uncertainty: {
    risk_score: 0.82,
    uncertain_spans: [
      {
        start: 0,
        end: 4,
        text: "I I",
        risk_type: "disfluency",
        risk_score: 0.95,
        suggested_alternatives: ["I"],
      },
      {
        start: 22,
        end: 29,
        text: "the the",
        risk_type: "disfluency",
        risk_score: 0.96,
        suggested_alternatives: ["the"],
      },
      {
        start: 39,
        end: 46,
        text: "and and",
        risk_type: "disfluency",
        risk_score: 0.94,
        suggested_alternatives: ["and"],
      },
      {
        start: 52,
        end: 58,
        text: "my my",
        risk_type: "disfluency",
        risk_score: 0.93,
        suggested_alternatives: ["my"],
      },
      {
        start: 72,
        end: 78,
        text: "We we",
        risk_type: "disfluency",
        risk_score: 0.94,
        suggested_alternatives: ["We"],
      },
      {
        start: 91,
        end: 96,
        text: "to to",
        risk_type: "disfluency",
        risk_score: 0.92,
        suggested_alternatives: ["to"],
      },
      {
        start: 103,
        end: 114,
        text: "lunch lunch",
        risk_type: "disfluency",
        risk_score: 0.97,
        suggested_alternatives: ["lunch"],
      },
      {
        start: 127,
        end: 134,
        text: "you you",
        risk_type: "disfluency",
        risk_score: 0.93,
        suggested_alternatives: ["you"],
      },
      {
        start: 140,
        end: 146,
        text: "me me",
        risk_type: "disfluency",
        risk_score: 0.94,
        suggested_alternatives: ["me"],
      },
      {
        start: 154,
        end: 159,
        text: "a a",
        risk_type: "disfluency",
        risk_score: 0.91,
        suggested_alternatives: ["a"],
      },
      {
        start: 170,
        end: 176,
        text: "to to",
        risk_type: "disfluency",
        risk_score: 0.92,
        suggested_alternatives: ["to"],
      },
    ],
  },
  repair: {
    repaired_text:
      "I want to go to the park today and meet my friend there. We are going to have lunch together. Can you help me write a message to her?",
    standard_text:
      "I want to go to the park today and meet my friend there. We are going to have lunch together. Can you help me write a message to her?",
    edits: [
      {
        original: "I I",
        repaired: "I",
        start: 0,
        end: 4,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "the the",
        repaired: "the",
        start: 22,
        end: 29,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "and and",
        repaired: "and",
        start: 39,
        end: 46,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "my my",
        repaired: "my",
        start: 52,
        end: 58,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "We we",
        repaired: "We",
        start: 72,
        end: 78,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "to to",
        repaired: "to",
        start: 91,
        end: 96,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "lunch lunch",
        repaired: "lunch",
        start: 103,
        end: 114,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "you you",
        repaired: "you",
        start: 127,
        end: 134,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "me me",
        repaired: "me",
        start: 140,
        end: 146,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "a a",
        repaired: "a",
        start: 154,
        end: 159,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
      {
        original: "to to",
        repaired: "to",
        start: 170,
        end: 176,
        reason: "Disfluency — word repetition removed",
        confidence: 0.99,
      },
    ],
    repair_model: "gpt-4o-mini",
  },
  tts: {
    voice_type: "standard",
    duration: 18.5,
    audio_url: "/mock/tts/imp-002.mp3",
  },
  processing_time: {
    asr: 2.8,
    uncertainty: 0.1,
    repair: 1.9,
    tts: 1.5,
    total: 6.3,
  },
  status: "completed",
  created_at: "2026-05-30T10:30:00Z",
  intent: {
    intents: ["Making Plans", "Social Arrangement", "Requesting Help"],
    confidence: 0.91,
    topic: "Personal Planning",
  },
  voice_comparison: {
    original: { clarity: 48, naturalness: 45, confidence: 42 },
    standard: { clarity: 96, naturalness: 94, confidence: 95 },
  },
  meaning_recovery_score: 99,
};

// Accent demo: "I sink dis project is good and we should move forward wiz it"
export const mockAccentDemoAnalysis: AnalysisResult = {
  analysis_id: "acc-demo-sink-dis",
  audio: {
    id: "audio-demo-01",
    file_name: "team_standup_recording.wav",
    duration: 8.2,
    source_type: "recording",
    format: "wav",
    file_size: 262000,
    created_at: "2026-05-30T11:00:00Z",
  },
  asr: {
    raw_text:
      "I sink dis project is good and we should move forward wiz it",
    segments: [
      {
        start: 0.0,
        end: 3.1,
        text: "I sink dis project is good",
        confidence: 0.71,
      },
      {
        start: 3.1,
        end: 8.2,
        text: "and we should move forward wiz it",
        confidence: 0.68,
      },
    ],
    model_name: "faster-whisper-large-v3",
    language: "en",
  },
  uncertainty: {
    risk_score: 0.78,
    uncertain_spans: [
      {
        start: 2,
        end: 6,
        text: "sink",
        risk_type: "substitution",
        risk_score: 0.94,
        suggested_alternatives: ["think"],
      },
      {
        start: 7,
        end: 10,
        text: "dis",
        risk_type: "substitution",
        risk_score: 0.92,
        suggested_alternatives: ["this"],
      },
      {
        start: 51,
        end: 54,
        text: "wiz",
        risk_type: "substitution",
        risk_score: 0.95,
        suggested_alternatives: ["with"],
      },
    ],
  },
  repair: {
    repaired_text:
      "I think this project is good and we should move forward with it",
    standard_text:
      "I think this project is good, and we should move forward with it.",
    edits: [
      {
        original: "sink",
        repaired: "think",
        start: 2,
        end: 6,
        reason:
          "The word 'sink' does not fit the sentence context. 'think' is more semantically consistent with expressing an opinion about a project.",
        confidence: 0.94,
      },
      {
        original: "dis",
        repaired: "this",
        start: 7,
        end: 10,
        reason:
          "Pronunciation variation — 'dis' is a common accented pronunciation of 'this'. Context confirms the demonstrative pronoun.",
        confidence: 0.92,
      },
      {
        original: "wiz",
        repaired: "with",
        start: 51,
        end: 54,
        reason:
          "Phonetic substitution — /wɪz/ for /wɪð/. The preposition 'with' is required by the phrase 'move forward with it'.",
        confidence: 0.95,
      },
    ],
    repair_model: "gpt-4o-mini",
  },
  tts: {
    voice_type: "standard",
    duration: 5.8,
    audio_url: "/mock/tts/acc-demo.mp3",
  },
  processing_time: {
    asr: 1.2,
    uncertainty: 0.08,
    repair: 0.9,
    tts: 0.6,
    total: 2.8,
  },
  status: "completed",
  created_at: "2026-05-30T11:00:00Z",
  intent: {
    intents: ["Expressing Opinion", "Recommending Action"],
    confidence: 0.96,
    topic: "Project Feedback",
  },
  voice_comparison: {
    original: { clarity: 58, naturalness: 55, confidence: 52 },
    standard: { clarity: 96, naturalness: 94, confidence: 95 },
  },
  meaning_recovery_score: 97,
};

// Speech assist demo: incomplete phrase recovery
export const mockSpeechDemoAnalysis: AnalysisResult = {
  analysis_id: "sp-demo-water",
  audio: {
    id: "audio-demo-02",
    file_name: "voice_request.webm",
    duration: 4.1,
    source_type: "recording",
    format: "webm",
    file_size: 131000,
    created_at: "2026-05-30T11:15:00Z",
  },
  asr: {
    raw_text: "Need wa water please",
    segments: [
      {
        start: 0.0,
        end: 1.2,
        text: "Need",
        confidence: 0.55,
      },
      {
        start: 1.2,
        end: 1.8,
        text: "wa",
        confidence: 0.42,
      },
      {
        start: 1.8,
        end: 3.2,
        text: "water",
        confidence: 0.81,
      },
      {
        start: 3.2,
        end: 4.1,
        text: "please",
        confidence: 0.88,
      },
    ],
    model_name: "faster-whisper-large-v3",
    language: "en",
  },
  uncertainty: {
    risk_score: 0.85,
    uncertain_spans: [
      {
        start: 0,
        end: 4,
        text: "Need",
        risk_type: "incomplete",
        risk_score: 0.88,
        suggested_alternatives: ["I need"],
      },
      {
        start: 5,
        end: 7,
        text: "wa",
        risk_type: "incomplete",
        risk_score: 0.95,
        suggested_alternatives: ["water"],
      },
    ],
  },
  repair: {
    repaired_text: "I need water, please.",
    standard_text: "I need some water, please.",
    edits: [
      {
        original: "Need",
        repaired: "I need",
        start: 0,
        end: 4,
        reason:
          "Incomplete phrase — subject pronoun missing. Context indicates a request, so 'I need' is the intended phrase.",
        confidence: 0.88,
      },
      {
        original: "wa",
        repaired: "",
        start: 5,
        end: 7,
        reason:
          "Incomplete fragment — 'wa' is a truncated attempt at 'water'. The full word appears immediately after, so this fragment is removed.",
        confidence: 0.95,
      },
    ],
    repair_model: "gpt-4o-mini",
  },
  tts: {
    voice_type: "standard",
    duration: 2.4,
    audio_url: "/mock/tts/sp-demo.mp3",
  },
  processing_time: {
    asr: 0.8,
    uncertainty: 0.06,
    repair: 0.7,
    tts: 0.4,
    total: 2.0,
  },
  status: "completed",
  created_at: "2026-05-30T11:15:00Z",
  intent: {
    intents: ["Making a Request", "Expressing Need"],
    confidence: 0.93,
    topic: "Daily Needs",
  },
  voice_comparison: {
    original: { clarity: 35, naturalness: 30, confidence: 28 },
    standard: { clarity: 97, naturalness: 95, confidence: 96 },
  },
  meaning_recovery_score: 99,
};

export const mockAnalyses: AnalysisSummary[] = [
  {
    analysis_id: mockAccentDemoAnalysis.analysis_id,
    file_name: mockAccentDemoAnalysis.audio.file_name,
    duration: mockAccentDemoAnalysis.audio.duration,
    source_type: mockAccentDemoAnalysis.audio.source_type,
    mode: "accent_correction",
    raw_text_preview:
      "I sink dis project is good and we should move forward wiz it...",
    repaired_text_preview:
      "I think this project is good and we should move forward with it...",
    status: "completed",
    has_feedback: false,
    created_at: mockAccentDemoAnalysis.created_at,
    confidence_improvement: 23,
    repair_count: 3,
    is_favorite: true,
  },
  {
    analysis_id: mockAccentAnalysis.analysis_id,
    file_name: mockAccentAnalysis.audio.file_name,
    duration: mockAccentAnalysis.audio.duration,
    source_type: mockAccentAnalysis.audio.source_type,
    mode: "accent_correction",
    raw_text_preview:
      "I would like to discuss teh projec deadline wiz teh team nex weak...",
    repaired_text_preview:
      "I would like to discuss the project deadline with the team next week...",
    status: "completed",
    has_feedback: false,
    created_at: mockAccentAnalysis.created_at,
    confidence_improvement: 24,
    repair_count: 11,
    is_favorite: true,
  },
  {
    analysis_id: mockImpairmentAnalysis.analysis_id,
    file_name: mockImpairmentAnalysis.audio.file_name,
    duration: mockImpairmentAnalysis.audio.duration,
    source_type: mockImpairmentAnalysis.audio.source_type,
    mode: "speech_impairment_assistance",
    raw_text_preview:
      "I I want to go to the the park today and and meet my my friend there...",
    repaired_text_preview:
      "I want to go to the park today and meet my friend there...",
    status: "completed",
    has_feedback: true,
    created_at: mockImpairmentAnalysis.created_at,
    confidence_improvement: 31,
    repair_count: 11,
    is_favorite: false,
  },
  {
    analysis_id: mockSpeechDemoAnalysis.analysis_id,
    file_name: mockSpeechDemoAnalysis.audio.file_name,
    duration: mockSpeechDemoAnalysis.audio.duration,
    source_type: mockSpeechDemoAnalysis.audio.source_type,
    mode: "speech_impairment_assistance",
    raw_text_preview: "Need wa water please...",
    repaired_text_preview: "I need some water, please.",
    status: "completed",
    has_feedback: false,
    created_at: mockSpeechDemoAnalysis.created_at,
    confidence_improvement: 40,
    repair_count: 2,
    is_favorite: false,
  },
  {
    analysis_id: "hist-003-xyz",
    file_name: "presentation_draft.m4a",
    duration: 58.0,
    source_type: "upload",
    mode: "accent_correction",
    raw_text_preview:
      "Teh quarterly report shows dat we have achived significant growf...",
    repaired_text_preview:
      "The quarterly report shows that we have achieved significant growth...",
    status: "completed",
    has_feedback: false,
    created_at: "2026-05-29T14:00:00Z",
    confidence_improvement: 28,
    repair_count: 8,
    is_favorite: false,
  },
];

// Home page demo example
export const homeDemo: HomeDemoExample = {
  raw: "I sink dis project is good and we should move forward wiz it",
  repaired:
    "I think this project is good and we should move forward with it",
  confidence_score: 94,
  meaning_recovery: 97,
  repair_count: 3,
  mode: "accent_correction",
};

// Vocabulary entries
export const mockVocabulary: VocabularyEntry[] = [
  {
    id: "1",
    term: "TensorFlow",
    category: "technical",
    domain: "ML",
    usage_count: 12,
    corrections_avoided: 8,
  },
  {
    id: "2",
    term: "Kubernetes",
    category: "technical",
    domain: "DevOps",
    usage_count: 7,
    corrections_avoided: 5,
  },
  {
    id: "3",
    term: "Zhang Wei",
    category: "people",
    domain: "",
    usage_count: 15,
    corrections_avoided: 12,
  },
  {
    id: "4",
    term: "NVIDIA",
    category: "organizations",
    domain: "Tech",
    usage_count: 9,
    corrections_avoided: 6,
  },
  {
    id: "5",
    term: "transformer architecture",
    category: "technical",
    domain: "ML",
    usage_count: 4,
    corrections_avoided: 3,
  },
  {
    id: "6",
    term: "Dr. Sarah Chen",
    category: "people",
    domain: "",
    usage_count: 6,
    corrections_avoided: 5,
  },
];

// User profile stats
export const mockUserProfile: UserProfile = {
  total_analyses: 24,
  average_confidence: 87,
  vocabulary_size: 6,
  corrections_avoided: 39,
  learning_progress: 72,
};

export function getAnalysisById(id: string): AnalysisResult | undefined {
  const map: Record<string, AnalysisResult> = {
    [mockAccentAnalysis.analysis_id]: mockAccentAnalysis,
    [mockImpairmentAnalysis.analysis_id]: mockImpairmentAnalysis,
    [mockAccentDemoAnalysis.analysis_id]: mockAccentDemoAnalysis,
    [mockSpeechDemoAnalysis.analysis_id]: mockSpeechDemoAnalysis,
  };
  return map[id];
}

/**
 * Returns the appropriate mock analysis based on communication mode.
 * Used by the Speak → Result flow when the user records audio.
 *
 * - "accent" → accent demo (sink/dis/wiz)
 * - "speech" → impairment analysis (park/friend with disfluencies)
 */
export function getAnalysisByMode(mode: string): AnalysisResult {
  if (mode === "speech") {
    return mockImpairmentAnalysis;
  }
  return mockAccentDemoAnalysis;
}

// Success stories for home page
export const mockSuccessStories: SuccessStory[] = [
  {
    id: "story-1",
    raw_text: "I sink dis project is good and we should move forward wiz it",
    repaired_text: "I think this project is good and we should move forward with it",
    meaning_recovery: 97,
    mode: "accent_correction",
    time_ago: "2 hours ago",
  },
  {
    id: "story-2",
    raw_text: "Need wa water please",
    repaired_text: "I need some water, please.",
    meaning_recovery: 99,
    mode: "speech_impairment_assistance",
    time_ago: "5 hours ago",
  },
  {
    id: "story-3",
    raw_text: "Teh quarterly report shows dat we have achived significant growf",
    repaired_text: "The quarterly report shows that we have achieved significant growth",
    meaning_recovery: 96,
    mode: "accent_correction",
    time_ago: "Yesterday",
  },
];

// Voice model profile
export const mockVoiceModel: VoiceModelProfile = {
  recovery_accuracy: 94,
  vocabulary_learned: 47,
  corrections_avoided: 156,
  preferred_expressions: [
    "move forward with",
    "discuss the deadline",
    "project configuration",
    "deployment schedule",
  ],
  frequent_topics: [
    "Project Management",
    "Software Engineering",
    "Team Communication",
    "Technical Documentation",
    "Daily Standups",
  ],
  accent_patterns: [
    "th → d/t substitution",
    "Final consonant dropping",
    "v/w alternation",
    "Short vowel shifts",
  ],
  progress_history: [
    { month: "Jan", accuracy: 72 },
    { month: "Feb", accuracy: 76 },
    { month: "Mar", accuracy: 81 },
    { month: "Apr", accuracy: 85 },
    { month: "May", accuracy: 94 },
  ],
};

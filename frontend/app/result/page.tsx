"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileAudio,
  AlertTriangle,
  CheckCircle2,
  Type,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UncertainSpanHighlighter } from "@/components/cards/uncertain-span-highlighter";
import { DiffViewer } from "@/components/cards/diff-viewer";
import { TTSPlayer } from "@/components/cards/tts-player";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { getAnalysisById, mockAccentAnalysis } from "@/lib/mock-data";
import type { AnalysisResult } from "@/types/analysis";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function ResultContent({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-4">
      {/* Audio Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileAudio className="h-5 w-5" />
              Audio
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {analysis.audio.source_type === "recording" ? "🎤" : "📁"}{" "}
                {analysis.audio.source_type}
              </Badge>
              <Badge variant="secondary">
                {formatDuration(analysis.audio.duration)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
              <FileAudio className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {analysis.audio.file_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {analysis.audio.format.toUpperCase()} ·{" "}
                {(analysis.audio.file_size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Transcript with Uncertain Spans */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="h-5 w-5" />
            Raw Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <UncertainSpanHighlighter
              text={analysis.asr.raw_text}
              spans={analysis.uncertainty.uncertain_spans}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detected Uncertainty */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Detected Uncertainty
            </CardTitle>
            <Badge variant="destructive">
              Risk: {Math.round(analysis.uncertainty.risk_score * 100)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.uncertainty.uncertain_spans.map((span, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-mono font-medium">
                    &ldquo;{span.text}&rdquo;
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {span.risk_type.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    → {span.suggested_alternatives.join(", ")}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(span.risk_score * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Repaired Text */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5" />
            Repaired Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border bg-green-50/50 p-4 text-sm leading-relaxed">
            {analysis.repair.repaired_text}
          </p>
        </CardContent>
      </Card>

      {/* Standard Expression */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Standard Expression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border bg-blue-50/50 p-4 text-sm leading-relaxed font-medium">
            {analysis.repair.standard_text}
          </p>
        </CardContent>
      </Card>

      {/* Voice Output */}
      <TTSPlayer
        voiceType={analysis.tts.voice_type}
        duration={analysis.tts.duration}
        text={analysis.repair.standard_text}
      />

      {/* Before / After Diff */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Before / After</CardTitle>
        </CardHeader>
        <CardContent>
          <DiffViewer
            original={analysis.asr.raw_text}
            repaired={analysis.repair.repaired_text}
            edits={analysis.repair.edits}
          />
        </CardContent>
      </Card>

      {/* Processing Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">ASR</p>
              <p className="font-mono font-medium">
                {analysis.processing_time.asr}s
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Uncertainty</p>
              <p className="font-mono font-medium">
                {analysis.processing_time.uncertainty}s
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Repair</p>
              <p className="font-mono font-medium">
                {analysis.processing_time.repair}s
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Total</p>
              <p className="font-mono font-medium">
                {analysis.processing_time.total}s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <FeedbackForm analysisId={analysis.analysis_id} />
    </div>
  );
}

function ResultPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? mockAccentAnalysis.analysis_id;
  const analysis = getAnalysisById(id);

  if (!analysis) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Analysis not found</p>
            <Link href="/speak">
              <Button>Start a New Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="shrink-0" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight">
            Analysis Result
          </h1>
          <p className="text-xs text-muted-foreground">
            {new Date(analysis.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge
          variant={analysis.status === "completed" ? "default" : "secondary"}
        >
          {analysis.status}
        </Badge>
      </div>

      <ResultContent analysis={analysis} />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      }
    >
      <ResultPageInner />
    </Suspense>
  );
}

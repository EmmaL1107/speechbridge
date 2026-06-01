"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickSummary } from "@/components/result/quick-summary";
import { AdvancedAnalysis } from "@/components/result/advanced-analysis";
import {
  getAnalysisById,
  getAnalysisByMode,
  mockAccentDemoAnalysis,
} from "@/lib/mock-data";
import { getRecordedAudio } from "@/lib/audio-store";
import type { AnalysisResult } from "@/types/analysis";

interface ResultContentProps {
  analysis: AnalysisResult;
  recordedAudioUrl: string | null;
}

function ResultContent({ analysis, recordedAudioUrl }: ResultContentProps) {
  return (
    <div className="space-y-6">
      {/* Layer 1: Quick Understanding Summary */}
      <QuickSummary
        analysis={analysis}
        recordedAudioUrl={recordedAudioUrl}
      />

      {/* Layer 2: Advanced Analysis (collapsed by default) */}
      <AdvancedAnalysis
        analysis={analysis}
        recordedAudioUrl={recordedAudioUrl}
      />

      {/* Bottom padding for nav */}
      <div className="h-4" />
    </div>
  );
}

function ResultPageInner() {
  const searchParams = useSearchParams();

  // Support both ?id= (legacy) and ?mode= (new Speak→Result flow)
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");

  // Get recorded audio from the client-side store
  const recordedAudio = getRecordedAudio();

  // Resolve the analysis: by ID or by mode
  let analysis: AnalysisResult | undefined;
  if (id) {
    analysis = getAnalysisById(id);
  } else if (mode) {
    analysis = getAnalysisByMode(mode);
  } else {
    // Default fallback
    analysis = mockAccentDemoAnalysis;
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-6 pb-28">
        <div className="mb-5">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <p className="text-[13px] text-muted-foreground">
              Analysis not found
            </p>
            <Link href="/speak">
              <Button className="rounded-2xl">Start Communicating</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-6 pb-28">
      <ResultContent
        analysis={analysis}
        recordedAudioUrl={recordedAudio?.url ?? null}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-6">
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[13px] text-muted-foreground">
              Loading analysis…
            </p>
          </div>
        </div>
      }
    >
      <ResultPageInner />
    </Suspense>
  );
}

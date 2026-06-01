import { ArrowLeft, Globe, Heart, CheckCircle2, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/types/analysis";

interface ResultHeaderProps {
  analysis: AnalysisResult;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ResultHeader({ analysis }: ResultHeaderProps) {
  const isAccent = analysis.analysis_id.startsWith("acc-");
  const modeLabel = isAccent ? "Accent Assist" : "Speech Assist";
  const ModeIcon = isAccent ? Globe : Heart;

  const avgConfidence = Math.round(
    (analysis.repair.edits.reduce((sum, e) => sum + e.confidence, 0) /
      analysis.repair.edits.length) *
      100
  );

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9 rounded-2xl"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Communication Result
          </h1>
          <p className="text-[11px] text-muted-foreground">
            {formatDateTime(analysis.created_at)}
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium">
          <ModeIcon className="h-3 w-3" />
          {modeLabel}
        </Badge>
        <Badge
          variant="default"
          className="gap-1 text-[10px] font-medium bg-success text-white"
        >
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
        <Badge variant="outline" className="gap-1 text-[10px] font-mono">
          <Zap className="h-3 w-3 text-primary" />
          {avgConfidence}% Confidence
        </Badge>
        <Badge variant="outline" className="gap-1 text-[10px] font-mono">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {analysis.processing_time.total}s
        </Badge>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Clock, Globe, Heart, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisSummary } from "@/types/analysis";

interface AnalysisCardProps {
  analysis: AnalysisSummary;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const isAccent = analysis.mode === "accent_correction";
  const ModeIcon = isAccent ? Globe : Heart;

  return (
    <Link href={`/result?id=${analysis.analysis_id}`} className="block">
      <Card className="transition-all hover:shadow-md active:scale-[0.98]">
        <CardContent className="p-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2.5">
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <ModeIcon className="h-3 w-3" />
              {isAccent ? "Accent Assist" : "Speech Assist"}
            </Badge>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(analysis.created_at)}
            </div>
          </div>

          {/* Before → After */}
          <div className="mb-2.5">
            <p className="text-[11px] text-muted-foreground/60 line-through decoration-muted-foreground/30 mb-0.5">
              {analysis.raw_text_preview}
            </p>
            <p className="text-[13px] font-semibold text-foreground leading-snug">
              {analysis.repaired_text_preview}
            </p>
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>{formatDuration(analysis.duration)}</span>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">
                  +{analysis.confidence_improvement}%
                </span>
              </div>
              <span>{analysis.repair_count} repairs</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

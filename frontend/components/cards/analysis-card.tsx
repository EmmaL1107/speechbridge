import Link from "next/link";
import { FileAudio, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  return (
    <Link href={`/result?id=${analysis.analysis_id}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileAudio className="h-4 w-4 shrink-0" />
                <span className="truncate">{analysis.file_name}</span>
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(analysis.created_at)}
                <span>·</span>
                {formatDuration(analysis.duration)}
              </CardDescription>
            </div>
            <Badge
              variant={
                analysis.status === "completed"
                  ? "default"
                  : analysis.status === "failed"
                    ? "destructive"
                    : "secondary"
              }
              className="shrink-0"
            >
              {analysis.status === "completed" && (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              {analysis.status === "failed" && (
                <AlertCircle className="mr-1 h-3 w-3" />
              )}
              {analysis.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {analysis.repaired_text_preview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

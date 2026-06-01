import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UncertainSpan, Edit } from "@/types/analysis";

interface IssueCardProps {
  span: UncertainSpan;
  edit?: Edit;
  index: number;
}

const issueTypeLabels: Record<string, string> = {
  substitution: "Accent substitution",
  disfluency: "Repetition / Disfluency",
  low_confidence: "Low confidence",
  entity: "Named entity",
  number: "Number",
  technical_term: "Technical term",
  incomplete: "Incomplete phrase",
};

const issueTypeColors: Record<string, string> = {
  substitution: "bg-amber-50 text-amber-700 border-amber-200",
  disfluency: "bg-violet-50 text-violet-700 border-violet-200",
  low_confidence: "bg-slate-50 text-slate-600 border-slate-200",
  entity: "bg-sky-50 text-sky-700 border-sky-200",
  number: "bg-teal-50 text-teal-700 border-teal-200",
  technical_term: "bg-indigo-50 text-indigo-700 border-indigo-200",
  incomplete: "bg-orange-50 text-orange-700 border-orange-200",
};

export function IssueCard({ span, edit, index }: IssueCardProps) {
  const typeLabel = issueTypeLabels[span.risk_type] ?? span.risk_type;
  const typeColor =
    issueTypeColors[span.risk_type] ??
    "bg-slate-50 text-slate-600 border-slate-200";
  const confidencePercent = Math.round(span.risk_score * 100);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {index + 1}
            </span>
            <span className="text-[13px] font-semibold text-foreground">
              Issue {index + 1}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] font-medium", typeColor)}
          >
            {typeLabel}
          </Badge>
        </div>

        {/* Original → Suggested */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 rounded-xl bg-muted/50 px-3 py-2 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">
              Original
            </p>
            <p className="text-[15px] font-semibold text-foreground font-mono">
              {span.text}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-lg">→</span>
          </div>
          <div className="flex-1 rounded-xl bg-primary/5 px-3 py-2 text-center border border-primary/10">
            <p className="text-[10px] text-primary mb-0.5">Suggested</p>
            <p className="text-[15px] font-semibold text-primary font-mono">
              {span.suggested_alternatives.join(", ")}
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-muted-foreground">
              Confidence
            </span>
            <span className="text-[11px] font-semibold text-foreground font-mono">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        {edit?.reason && (
          <div className="rounded-xl bg-muted/30 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {edit.reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

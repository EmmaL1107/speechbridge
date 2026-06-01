import { Badge } from "@/components/ui/badge";
import type { UncertainSpan } from "@/types/analysis";

interface UncertainSpanHighlighterProps {
  text: string;
  spans: UncertainSpan[];
}

const riskLabels: Record<string, string> = {
  low_confidence: "Unclear",
  entity: "Name",
  number: "Number",
  technical_term: "Term",
  disfluency: "Repeated",
  incomplete: "Incomplete",
  substitution: "Word Choice",
};

export function UncertainSpanHighlighter({
  text,
  spans,
}: UncertainSpanHighlighterProps) {
  if (spans.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-foreground">{text}</p>
    );
  }

  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sorted.forEach((span, i) => {
    if (span.start > lastIndex) {
      parts.push(
        <span key={`text-${i}`} className="text-foreground">
          {text.slice(lastIndex, span.start)}
        </span>
      );
    }

    parts.push(
      <span
        key={`span-${i}`}
        className="rounded-lg bg-primary/10 text-primary px-1 py-0.5 font-medium text-[13px] border border-primary/20"
        title={`${riskLabels[span.risk_type] ?? span.risk_type} — Confidence: ${Math.round(span.risk_score * 100)}%`}
      >
        {text.slice(span.start, span.end)}
      </span>
    );
    lastIndex = span.end;
  });

  if (lastIndex < text.length) {
    parts.push(
      <span key="tail" className="text-foreground">
        {text.slice(lastIndex)}
      </span>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[14px] leading-relaxed">{parts}</p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((span, i) => (
          <Badge
            key={i}
            variant="outline"
            className="text-[10px] font-normal gap-1"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary/40" />
            {span.text} → {span.suggested_alternatives.join(", ")}
          </Badge>
        ))}
      </div>
    </div>
  );
}

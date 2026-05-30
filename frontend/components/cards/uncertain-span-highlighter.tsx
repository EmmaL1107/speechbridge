import { Badge } from "@/components/ui/badge";
import type { UncertainSpan } from "@/types/analysis";

interface UncertainSpanHighlighterProps {
  text: string;
  spans: UncertainSpan[];
}

const riskColors: Record<string, string> = {
  low_confidence: "bg-yellow-100 text-yellow-800 border-yellow-300",
  entity: "bg-blue-100 text-blue-800 border-blue-300",
  number: "bg-purple-100 text-purple-800 border-purple-300",
  technical_term: "bg-indigo-100 text-indigo-800 border-indigo-300",
  disfluency: "bg-orange-100 text-orange-800 border-orange-300",
  incomplete: "bg-red-100 text-red-800 border-red-300",
  substitution: "bg-pink-100 text-pink-800 border-pink-300",
};

const riskLabels: Record<string, string> = {
  low_confidence: "Low Confidence",
  entity: "Entity",
  number: "Number",
  technical_term: "Term",
  disfluency: "Disfluency",
  incomplete: "Incomplete",
  substitution: "Substitution",
};

export function UncertainSpanHighlighter({
  text,
  spans,
}: UncertainSpanHighlighterProps) {
  if (spans.length === 0) {
    return <p className="leading-relaxed">{text}</p>;
  }

  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sorted.forEach((span, i) => {
    if (span.start > lastIndex) {
      parts.push(
        <span key={`text-${i}`}>{text.slice(lastIndex, span.start)}</span>
      );
    }

    const colorClass =
      riskColors[span.risk_type] ?? "bg-gray-100 text-gray-800 border-gray-300";
    parts.push(
      <span
        key={`span-${i}`}
        className={`rounded border px-0.5 font-medium ${colorClass}`}
        title={`${riskLabels[span.risk_type] ?? span.risk_type} — Risk: ${Math.round(span.risk_score * 100)}%`}
      >
        {text.slice(span.start, span.end)}
      </span>
    );
    lastIndex = span.end;
  });

  if (lastIndex < text.length) {
    parts.push(<span key="tail">{text.slice(lastIndex)}</span>);
  }

  return (
    <div className="space-y-3">
      <p className="leading-relaxed">{parts}</p>
      <div className="flex flex-wrap gap-2">
        {sorted.map((span, i) => (
          <Badge key={i} variant="outline" className="text-xs font-normal">
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${riskColors[span.risk_type]?.split(" ")[0] ?? "bg-gray-400"}`}
            />
            {span.text} → {span.suggested_alternatives.join(", ")}
            <span className="ml-1 text-muted-foreground">
              ({Math.round(span.risk_score * 100)}%)
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

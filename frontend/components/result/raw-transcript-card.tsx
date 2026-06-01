import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type, AlertTriangle } from "lucide-react";
import { UncertainSpanHighlighter } from "@/components/cards/uncertain-span-highlighter";
import type { UncertainSpan } from "@/types/analysis";

interface RawTranscriptCardProps {
  rawText: string;
  spans: UncertainSpan[];
  segmentCount: number;
}

export function RawTranscriptCard({
  rawText,
  spans,
  segmentCount,
}: RawTranscriptCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">
              Raw Transcript
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              {spans.length} issues
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {segmentCount} segments
            </Badge>
          </div>
        </div>

        {/* Transcript with highlights */}
        <div className="rounded-xl bg-muted/30 px-4 py-3 border border-border">
          <UncertainSpanHighlighter text={rawText} spans={spans} />
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground">
          Highlighted words indicate detected issues. Tap to see details below.
        </p>
      </CardContent>
    </Card>
  );
}

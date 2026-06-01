import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2 } from "lucide-react";
import type { Edit } from "@/types/analysis";

interface SemanticRepairCardProps {
  repairedText: string;
  edits: Edit[];
}

export function SemanticRepairCard({
  repairedText,
  edits,
}: SemanticRepairCardProps) {
  // Build highlighted text by applying edits
  const sortedEdits = [...edits].sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedEdits.forEach((edit, i) => {
    // Add text before this edit
    if (edit.start > lastIndex) {
      parts.push(
        <span key={`pre-${i}`} className="text-foreground">
          {repairedText.slice(lastIndex, edit.start)}
        </span>
      );
    }

    // Find the repaired text at this position
    const repairedWord = edit.repaired;
    if (repairedWord) {
      parts.push(
        <span
          key={`repair-${i}`}
          className="bg-success/10 text-success font-semibold px-0.5 rounded"
          title={`Was: "${edit.original}" — ${edit.reason}`}
        >
          {repairedWord}
        </span>
      );
    }

    // Move past the repaired text
    lastIndex = edit.start + repairedWord.length;
  });

  // Add remaining text
  if (lastIndex < repairedText.length) {
    parts.push(
      <span key="tail" className="text-foreground">
        {repairedText.slice(lastIndex)}
      </span>
    );
  }

  const meaningChanges = edits.filter(
    (e) =>
      e.reason.toLowerCase().includes("meaning") ||
      e.reason.toLowerCase().includes("semantic")
  ).length;

  return (
    <Card className="border-success/20 bg-success/[0.02]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-success" />
            <h3 className="text-[13px] font-semibold text-foreground">
              Semantic Repair
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] bg-success/5 text-success border-success/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Meaning recovered
          </Badge>
        </div>

        {/* Repaired text with highlights */}
        <div className="rounded-xl bg-card px-4 py-3 border border-border mb-3">
          <p className="text-[14px] leading-relaxed">{parts}</p>
        </div>

        {/* Edit summary */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {edits.length}
            </span>{" "}
            repairs applied
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {meaningChanges}
            </span>{" "}
            meaning changes
          </span>
          <span>
            <span className="font-semibold text-success">High</span> semantic
            consistency
          </span>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground italic">
          Meaning recovered, not just transcribed.
        </p>
      </CardContent>
    </Card>
  );
}

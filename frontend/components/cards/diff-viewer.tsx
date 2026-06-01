import type { Edit } from "@/types/analysis";

interface DiffViewerProps {
  original: string;
  repaired: string;
  edits: Edit[];
}

export function DiffViewer({ original, repaired, edits }: DiffViewerProps) {
  if (edits.length === 0) {
    return (
      <p className="text-[13px] italic text-muted-foreground">
        No corrections needed — your speech was already clear.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {edits.map((edit, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl bg-muted/50 px-3.5 py-2.5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-lg bg-destructive/10 px-1.5 py-0.5 text-[11px] font-mono text-destructive line-through decoration-destructive/40">
                {edit.original}
              </span>
              <span className="text-muted-foreground text-[11px]">→</span>
              <span className="rounded-lg bg-success/10 px-1.5 py-0.5 text-[11px] font-mono text-success font-medium">
                {edit.repaired}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {edit.reason}
            </p>
          </div>
          <span className="shrink-0 text-[10px] text-muted-foreground font-mono bg-card px-1.5 py-0.5 rounded-lg border border-border">
            {Math.round(edit.confidence * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

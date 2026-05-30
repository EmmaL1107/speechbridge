import type { Edit } from "@/types/analysis";

interface DiffViewerProps {
  original: string;
  repaired: string;
  edits: Edit[];
}

export function DiffViewer({ original, repaired, edits }: DiffViewerProps) {
  if (edits.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">No edits made.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {edits.map((edit, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border p-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-red-700 line-through">
                  {edit.original}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded bg-green-50 px-1.5 py-0.5 font-mono text-green-700">
                  {edit.repaired}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {edit.reason}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {Math.round(edit.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Original
          </p>
          <p className="rounded-lg border bg-red-50/50 p-3 text-sm leading-relaxed">
            {original}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Repaired
          </p>
          <p className="rounded-lg border bg-green-50/50 p-3 text-sm leading-relaxed">
            {repaired}
          </p>
        </div>
      </div>
    </div>
  );
}

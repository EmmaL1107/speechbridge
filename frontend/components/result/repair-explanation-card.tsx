import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle2 } from "lucide-react";
import type { Edit } from "@/types/analysis";

interface RepairExplanationCardProps {
  edits: Edit[];
}

const explanationSteps = [
  {
    icon: "🔍",
    title: "Acoustic uncertainty detected",
    detail:
      "The speech recognition system identified regions where acoustic signals were ambiguous or did not match standard pronunciation patterns.",
  },
  {
    icon: "🧠",
    title: "Context mismatch found",
    detail:
      "The AI compared recognized words against sentence context and grammar to identify likely errors in transcription.",
  },
  {
    icon: "📚",
    title: "Domain/context consistency checked",
    detail:
      "Semantic analysis verified that proposed corrections maintain consistency with the topic and intent of the conversation.",
  },
  {
    icon: "✏️",
    title: "Standard expression generated",
    detail:
      "Repaired text was polished into natural, grammatically correct language while preserving the original speaker's meaning.",
  },
  {
    icon: "✅",
    title: "Meaning preserved",
    detail:
      "Every repair was validated to ensure the speaker's intended meaning was maintained — not changed or assumed.",
  },
];

export function RepairExplanationCard({ edits }: RepairExplanationCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold text-foreground">
            Why SpeechBridge Changed It
          </h3>
        </div>

        <div className="space-y-3">
          {explanationSteps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <span className="text-lg">{step.icon}</span>
                {i < explanationSteps.length - 1 && (
                  <div className="w-px flex-1 bg-border my-1" />
                )}
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-[12px] font-semibold text-foreground mb-0.5">
                  {step.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-xl bg-primary/5 px-3 py-2.5 border border-primary/10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <p className="text-[11px] text-foreground">
              <span className="font-semibold">{edits.length} repairs</span>{" "}
              applied — all meaning-preserving, context-aware, and validated.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

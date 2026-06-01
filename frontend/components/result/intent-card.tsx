import { Brain, Target, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IntentDetection } from "@/types/analysis";

interface IntentCardProps {
  intent: IntentDetection;
}

export function IntentCard({ intent }: IntentCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold text-foreground">
            AI Understanding
          </h3>
        </div>

        {/* Intents */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Intent Detected
            </span>
          </div>
          <div className="space-y-1.5">
            {intent.intents.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-[13px] font-medium text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic + Confidence */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Topic:</span>
            <span className="text-[12px] font-semibold text-foreground">
              {intent.topic}
            </span>
          </div>
          <div className="flex-1" />
          <span className="text-[11px] text-muted-foreground">
            Confidence:{" "}
            <span className="font-semibold text-primary">
              {Math.round(intent.confidence * 100)}%
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface StandardExpressionCardProps {
  standardText: string;
  repairedText: string;
}

export function StandardExpressionCard({
  standardText,
  repairedText,
}: StandardExpressionCardProps) {
  const isSameAsRepaired = standardText === repairedText;

  return (
    <Card className="border-primary/10 bg-primary/[0.02]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">
              Standard Expression
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] bg-primary/5 text-primary border-primary/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ready for conversation
          </Badge>
        </div>

        {/* Standard text */}
        <div className="rounded-xl bg-card px-4 py-3 border border-border mb-3">
          <p className="text-[15px] leading-relaxed font-semibold text-foreground">
            {standardText}
          </p>
        </div>

        {/* Note */}
        <p className="text-[11px] text-muted-foreground">
          {isSameAsRepaired
            ? "Standard expression matches the repaired text."
            : "Standard expression has been polished for natural flow while preserving your meaning."}
        </p>
      </CardContent>
    </Card>
  );
}

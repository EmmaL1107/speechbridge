import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  Brain,
  Sparkles,
  MessageCircle,
  Volume2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  label: string;
  icon: React.ElementType;
  status: "completed" | "active" | "pending";
}

interface PipelineStepsProps {
  currentStep?: number;
}

const steps: PipelineStep[] = [
  { label: "Raw Speech", icon: Mic, status: "completed" },
  { label: "AI Understanding", icon: Brain, status: "completed" },
  { label: "Semantic Repair", icon: Sparkles, status: "completed" },
  { label: "Clear Expression", icon: MessageCircle, status: "completed" },
  { label: "Voice Output", icon: Volume2, status: "completed" },
];

export function PipelineSteps({ currentStep = 5 }: PipelineStepsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-[13px] font-semibold text-foreground mb-3">
          Transformation Pipeline
        </h3>
        <div className="flex items-center gap-0">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep - 1;
            const StepIcon = step.icon;

            return (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[9px] mt-1.5 text-center leading-tight font-medium",
                      isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 mx-1 mt-[-14px]",
                      i < currentStep - 1 ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
  analysisId: string;
}

type FeedbackChoice = "perfect" | "needs_correction" | "wrong_meaning" | null;

const feedbackOptions = [
  {
    id: "perfect" as FeedbackChoice,
    label: "Perfect",
    icon: ThumbsUp,
    color: "bg-success text-white hover:bg-success/90",
    activeColor: "bg-success text-white hover:bg-success/90",
  },
  {
    id: "needs_correction" as FeedbackChoice,
    label: "Needs Correction",
    icon: ThumbsDown,
    color: "",
    activeColor: "",
  },
  {
    id: "wrong_meaning" as FeedbackChoice,
    label: "Wrong Meaning",
    icon: AlertTriangle,
    color: "",
    activeColor: "bg-amber-500 text-white hover:bg-amber-500/90",
  },
];

export function FeedbackCard({ analysisId }: FeedbackCardProps) {
  const [choice, setChoice] = useState<FeedbackChoice>(null);
  const [correction, setCorrection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log("Feedback submitted:", {
      analysisId,
      choice,
      correction,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <p className="text-[13px] font-semibold text-foreground">
            Feedback saved
          </p>
          <p className="text-[11px] text-muted-foreground text-center max-w-xs">
            SpeechBridge will use it to understand you better.
          </p>
        </CardContent>
      </Card>
    );
  }

  const showCorrection =
    choice === "needs_correction" || choice === "wrong_meaning";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold text-foreground">
            Feedback
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          Help SpeechBridge improve this result.
        </p>

        {/* Choice buttons */}
        <div className="flex gap-2 mb-4">
          {feedbackOptions.map((option) => {
            const isActive = choice === option.id;
            return (
              <Button
                key={option.id}
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "flex-1 h-11 rounded-2xl text-[12px] font-medium gap-1.5",
                  isActive && option.activeColor
                )}
                onClick={() => setChoice(option.id)}
                aria-label={option.label}
              >
                <option.icon className="h-3.5 w-3.5" />
                {option.label}
              </Button>
            );
          })}
        </div>

        {/* Correction textarea */}
        {showCorrection && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <Textarea
              placeholder={
                choice === "wrong_meaning"
                  ? "Describe what you actually meant…"
                  : "Edit the final expression if needed…"
              }
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              rows={3}
              aria-label="Corrected text"
              className="rounded-2xl text-[13px]"
            />
            <Button
              onClick={handleSubmit}
              className="w-full h-11 rounded-2xl text-[13px] font-medium"
              disabled={!correction.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        )}

        {/* Confirm button for perfect */}
        {choice === "perfect" && (
          <Button
            onClick={handleSubmit}
            className="w-full h-11 rounded-2xl text-[13px] font-medium bg-success text-white hover:bg-success/90 animate-in fade-in duration-200"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Confirm
          </Button>
        )}

        {/* Note */}
        <p className="mt-3 text-[10px] text-muted-foreground text-center">
          Your feedback helps SpeechBridge understand you better over time.
        </p>
      </CardContent>
    </Card>
  );
}

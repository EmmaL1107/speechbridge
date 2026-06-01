"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  analysisId: string;
}

type FeedbackChoice = "good" | "needs_correction" | null;

export function FeedbackForm({ analysisId }: FeedbackFormProps) {
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
            Thank you for your feedback!
          </p>
          <p className="text-[11px] text-muted-foreground text-center">
            Your input helps SpeechBridge understand you better.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-[13px] font-semibold text-foreground mb-1">
          Help Us Improve
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Was this analysis accurate?
        </p>

        <div className="flex gap-3 mb-4">
          <Button
            variant={choice === "good" ? "default" : "outline"}
            className="flex-1 h-11 rounded-2xl"
            onClick={() => setChoice("good")}
            aria-label="Looks good"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Looks Good
          </Button>
          <Button
            variant={choice === "needs_correction" ? "default" : "outline"}
            className="flex-1 h-11 rounded-2xl"
            onClick={() => setChoice("needs_correction")}
            aria-label="Needs correction"
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Needs Correction
          </Button>
        </div>

        {choice === "needs_correction" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <Textarea
              placeholder="What should the correct text say?"
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              rows={3}
              aria-label="Corrected text"
              className="rounded-2xl"
            />
            <Button
              onClick={handleSubmit}
              className="w-full h-11 rounded-2xl"
              disabled={!correction.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Correction
            </Button>
          </div>
        )}

        {choice === "good" && (
          <Button
            onClick={handleSubmit}
            className="w-full h-11 rounded-2xl animate-in fade-in duration-200"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Confirm
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

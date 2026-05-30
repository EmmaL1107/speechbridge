"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    // In V1, this will call POST /api/feedback
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
          <ThumbsUp className="h-8 w-8 text-green-600" />
          <p className="text-sm font-medium">Thank you for your feedback!</p>
          <p className="text-xs text-muted-foreground">
            Your input helps improve SpeechBridge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">How does this look?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            variant={choice === "good" ? "default" : "outline"}
            className="flex-1 h-12"
            onClick={() => setChoice("good")}
            aria-label="Looks good"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Looks Good
          </Button>
          <Button
            variant={choice === "needs_correction" ? "default" : "outline"}
            className="flex-1 h-12"
            onClick={() => setChoice("needs_correction")}
            aria-label="Needs correction"
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Needs Correction
          </Button>
        </div>

        {choice === "needs_correction" && (
          <div className="space-y-3">
            <Textarea
              placeholder="Type the corrected text or describe the issue..."
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              rows={4}
              aria-label="Corrected text"
            />
            <Button
              onClick={handleSubmit}
              className="w-full h-12"
              disabled={!correction.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Correction
            </Button>
          </div>
        )}

        {choice === "good" && (
          <Button onClick={handleSubmit} className="w-full h-12">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Confirm
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

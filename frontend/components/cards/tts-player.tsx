"use client";

import { useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TTSPlayerProps {
  voiceType: string;
  duration: number;
  text: string;
}

export function TTSPlayer({ voiceType, duration, text }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          variant="outline"
          className="h-11 w-11 rounded-2xl shrink-0 border-border"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-primary" />
          ) : (
            <Play className="h-4 w-4 ml-0.5 text-primary" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="h-1.5 w-full rounded-full bg-border">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: isPlaying ? "45%" : "0%" }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{isPlaying ? "1:17" : "0:00"}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-primary"
          aria-label="Download audio"
          title="Download audio"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

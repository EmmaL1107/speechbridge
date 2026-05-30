"use client";

import { useState } from "react";
import { Play, Pause, Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="h-5 w-5" />
            Voice Output
          </CardTitle>
          <Badge variant="secondary">{voiceType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>

        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-12 rounded-full"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: isPlaying ? "45%" : "0%" }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{isPlaying ? "1:17" : "0:00"}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Download audio"
            title="Download audio"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

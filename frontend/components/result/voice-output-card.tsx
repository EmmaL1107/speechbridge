"use client";

import { useState } from "react";
import { Play, Pause, Volume2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TTSOutput } from "@/types/analysis";

interface VoiceOutputCardProps {
  tts: TTSOutput;
  standardText: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceOutputCard({ tts, standardText }: VoiceOutputCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">
              Voice Output
            </h3>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {tts.voice_type === "standard"
              ? "Standard Voice"
              : tts.voice_type}
          </Badge>
        </div>

        {/* Play button */}
        <div className="flex items-center gap-3 mb-3">
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-12 shrink-0 rounded-2xl border-border"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause voice" : "Play standard voice"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-primary" />
            ) : (
              <Play className="h-5 w-5 ml-0.5 text-primary" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            {/* Waveform placeholder */}
            <div className="relative h-8 w-full rounded-lg bg-muted/50 overflow-hidden mb-1">
              <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-3">
                {Array.from({ length: 36 }).map((_, i) => {
                  const height =
                    Math.sin(i * 0.5) * 10 +
                    Math.sin(i * 1.2) * 5 +
                    Math.random() * 3 +
                    4;
                  return (
                    <div
                      key={i}
                      className="w-[2px] rounded-full shrink-0"
                      style={{
                        height: `${height}px`,
                        backgroundColor: isPlaying
                          ? "var(--primary)"
                          : "var(--border)",
                        opacity: isPlaying ? 0.6 : 0.4,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Progress */}
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{isPlaying ? "0:02" : "0:00"}</span>
              <span>{formatTime(tts.duration)}</span>
            </div>
          </div>
        </div>

        {/* Voice details */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-2">
          <span>
            Tone: <span className="font-medium text-foreground">Clear and Natural</span>
          </span>
          <span>
            Duration: <span className="font-medium text-foreground">{formatTime(tts.duration)}</span>
          </span>
        </div>

        {/* Speed control placeholder */}
        <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2">
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            Speed control
          </span>
          <div className="flex-1" />
          <span className="text-[11px] font-medium text-foreground">1.0x</span>
        </div>
      </CardContent>
    </Card>
  );
}

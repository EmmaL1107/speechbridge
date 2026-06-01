"use client";

import { useState } from "react";
import { Play, Pause, FileAudio, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AudioRecord } from "@/types/analysis";

interface AudioPreviewCardProps {
  audio: AudioRecord;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioPreviewCard({ audio }: AudioPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const SourceIcon = audio.source_type === "recording" ? Mic : Upload;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <FileAudio className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-foreground truncate">
              {audio.file_name}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <SourceIcon className="h-3 w-3" />
                {audio.source_type === "recording" ? "Recording" : "Upload"}
              </span>
              <span>·</span>
              <span>{formatDuration(audio.duration)}</span>
              <span>·</span>
              <span>{audio.format.toUpperCase()}</span>
              <span>·</span>
              <span>{formatFileSize(audio.file_size)}</span>
            </div>
          </div>
        </div>

        {/* Waveform placeholder */}
        <div className="relative h-12 w-full rounded-xl bg-muted/50 overflow-hidden mb-3">
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-4">
            {Array.from({ length: 48 }).map((_, i) => {
              const height =
                Math.sin(i * 0.4) * 16 +
                Math.sin(i * 0.8) * 8 +
                Math.random() * 4 +
                6;
              return (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-primary/30 shrink-0"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Play button */}
        <Button
          variant="outline"
          className="w-full h-10 rounded-2xl gap-2 text-[13px] font-medium"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 text-primary" />
              Pause Audio
            </>
          ) : (
            <>
              <Play className="h-4 w-4 ml-0.5 text-primary" />
              Play Original Recording
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

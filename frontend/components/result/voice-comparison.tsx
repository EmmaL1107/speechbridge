"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  VoiceComparison as VoiceComparisonType,
  TTSOutput,
} from "@/types/analysis";

interface VoiceComparisonProps {
  comparison: VoiceComparisonType;
  tts: TTSOutput;
  recordedAudioUrl?: string | null;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function MetricBar({
  label,
  original,
  standard,
  activeTab,
}: {
  label: string;
  original: number;
  standard: number;
  activeTab: "original" | "standard";
}) {
  const value = activeTab === "original" ? original : standard;
  const color =
    label === "Clarity"
      ? "bg-primary"
      : label === "Naturalness"
        ? "bg-success"
        : "bg-amber-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[12px] font-semibold text-foreground">
          {value}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            color
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function VoiceComparison({
  comparison,
  tts,
  recordedAudioUrl,
}: VoiceComparisonProps) {
  const [activeTab, setActiveTab] = useState<"original" | "standard">(
    "standard"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeAudioUrl =
    activeTab === "original" ? recordedAudioUrl : null;
  const activeDuration =
    activeTab === "original" ? undefined : tts.duration;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [activeAudioUrl]);

  // Stop playback when switching tabs
  const switchTab = (tab: "original" | "standard") => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveTab(tab);
  };

  const togglePlay = () => {
    if (activeTab === "original" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      // Mock playback for standard voice
      setIsPlaying(!isPlaying);
    }
  };

  const duration = activeDuration ?? 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold text-foreground">
              Voice Transformation
            </h3>
          </div>
        </div>

        {/* Audio element for recorded audio */}
        {activeTab === "original" && activeAudioUrl && (
          <audio ref={audioRef} src={activeAudioUrl} preload="metadata" />
        )}

        {/* Tab toggle */}
        <div className="flex rounded-2xl bg-muted p-1 mb-4">
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-[16px] py-2 text-[12px] font-medium transition-all",
              activeTab === "original"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => switchTab("original")}
          >
            <Mic className="h-3.5 w-3.5" />
            Original Voice
          </button>
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-[16px] py-2 text-[12px] font-medium transition-all",
              activeTab === "standard"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => switchTab("standard")}
          >
            <Volume2 className="h-3.5 w-3.5" />
            Standard Voice
          </button>
        </div>

        {/* Player */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 shrink-0 rounded-xl border-border"
            onClick={togglePlay}
            disabled={activeTab === "original" && !activeAudioUrl}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-primary" />
            ) : (
              <Play className="h-4 w-4 ml-0.5 text-primary" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <div className="relative h-2 w-full rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3 rounded-2xl bg-muted/30 p-3.5">
          <MetricBar
            label="Clarity"
            original={comparison.original.clarity}
            standard={comparison.standard.clarity}
            activeTab={activeTab}
          />
          <MetricBar
            label="Naturalness"
            original={comparison.original.naturalness}
            standard={comparison.standard.naturalness}
            activeTab={activeTab}
          />
          <MetricBar
            label="Confidence"
            original={comparison.original.confidence}
            standard={comparison.standard.confidence}
            activeTab={activeTab}
          />
        </div>
      </CardContent>
    </Card>
  );
}

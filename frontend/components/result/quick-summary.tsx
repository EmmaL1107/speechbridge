"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Heart,
  Play,
  Pause,
  Copy,
  Share2,
  Check,
  Sparkles,
  Mic,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/types/analysis";

interface QuickSummaryProps {
  analysis: AnalysisResult;
  recordedAudioUrl?: string | null;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function CircularScore({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-[76px] w-[76px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 76 76">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="5"
          />
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function VoicePlayer({
  label,
  icon: Icon,
  audioUrl,
  duration,
  accentColor,
}: {
  label: string;
  icon: typeof Mic;
  audioUrl: string | null;
  duration: number;
  accentColor: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      <Button
        size="icon"
        variant="outline"
        className="h-10 w-10 shrink-0 rounded-xl border-border"
        onClick={togglePlay}
        disabled={!audioUrl}
        aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" style={{ color: accentColor }} />
        ) : (
          <Play className="h-4 w-4 ml-0.5" style={{ color: accentColor }} />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              backgroundColor: accentColor,
            }}
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
  );
}

export function QuickSummary({
  analysis,
  recordedAudioUrl,
}: QuickSummaryProps) {
  const [copied, setCopied] = useState(false);

  const modeLabel = analysis.analysis_id.includes("imp") ||
    analysis.analysis_id.includes("sp-")
    ? "Speech Assist"
    : "Accent Assist";
  const ModeIcon = modeLabel === "Speech Assist" ? Heart : Globe;

  const avgConfidence = Math.round(
    (analysis.repair.edits.reduce((sum, e) => sum + e.confidence, 0) /
      analysis.repair.edits.length) *
      100
  );

  const meaningRecovery = analysis.meaning_recovery_score ?? 97;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.repair.standard_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SpeechBridge — Recovered Expression",
          text: analysis.repair.standard_text,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation + mode */}
      <div className="flex items-center gap-3">
        <Link href="/speak">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9 rounded-2xl"
            aria-label="Back to speak"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-bold tracking-tight text-foreground">
            Meaning Recovered
          </h1>
        </div>
        <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
          <ModeIcon className="h-3 w-3" />
          {modeLabel}
        </Badge>
      </div>

      {/* Original Speech */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
          Original Speech
        </p>
        <Card className="bg-muted/40 border-muted/60">
          <CardContent className="p-3.5">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {analysis.asr.raw_text}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recovered Expression */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Recovered Expression
          </p>
        </div>
        <Card className="border-primary/15 bg-primary/[0.03]">
          <CardContent className="p-3.5">
            <p className="text-[15px] font-semibold text-foreground leading-relaxed">
              {analysis.repair.standard_text}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scores */}
      <div className="flex items-center justify-center gap-8 py-2">
        <CircularScore
          value={avgConfidence}
          label="Confidence"
          color="var(--primary)"
        />
        <CircularScore
          value={meaningRecovery}
          label="Meaning Recovery"
          color="var(--success)"
        />
      </div>

      {/* Voice Playback — Before & After */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Voice Comparison
          </p>

          {/* Before Voice (recorded audio) */}
          <VoicePlayer
            label="Before Voice"
            icon={Mic}
            audioUrl={recordedAudioUrl ?? null}
            duration={analysis.audio.duration}
            accentColor="var(--muted-foreground)"
          />

          <div className="flex items-center gap-2 px-2">
            <div className="flex-1 h-px bg-border" />
            <Sparkles className="h-3 w-3 text-primary" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* After Voice (mock standard voice) */}
          <VoicePlayer
            label="After Voice — Standard"
            icon={Volume2}
            audioUrl={null}
            duration={analysis.tts.duration}
            accentColor="var(--primary)"
          />
        </CardContent>
      </Card>

      {/* Copy + Share */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-2xl text-[13px] font-medium gap-2"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-2xl text-[13px] font-medium gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

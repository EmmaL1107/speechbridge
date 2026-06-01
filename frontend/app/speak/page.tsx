"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, Upload, ArrowRight, Globe, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "@/components/audio/audio-recorder";
import { AudioUploader } from "@/components/audio/audio-uploader";
import { setRecordedAudio } from "@/lib/audio-store";
import { cn } from "@/lib/utils";

type CommunicationMode = "accent" | "speech";
type InputMethod = "record" | "upload";

const modes = [
  {
    id: "accent" as CommunicationMode,
    label: "Accent Assist",
    description: "Improve clarity of accented speech",
    icon: Globe,
  },
  {
    id: "speech" as CommunicationMode,
    label: "Speech Assist",
    description: "Express yourself clearly and confidently",
    icon: Heart,
  },
];

export default function SpeakPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] =
    useState<CommunicationMode>("accent");
  const [inputMethod, setInputMethod] = useState<InputMethod>("record");
  const [hasAudio, setHasAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRecordingComplete = useCallback(
    (blob: Blob, duration: number) => {
      const url = URL.createObjectURL(blob);
      setRecordedAudio({
        url,
        duration,
        source: "recording",
        recordedAt: Date.now(),
      });
      setHasAudio(true);
    },
    []
  );

  const handleFileSelected = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setRecordedAudio({
      url,
      duration: 0,
      source: "upload",
      recordedAt: Date.now(),
    });
    setHasAudio(true);
  }, []);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate 2-second AI processing
    setTimeout(() => {
      router.push(`/result?mode=${selectedMode}`);
    }, 2000);
  };

  const handleReset = useCallback(() => {
    setHasAudio(false);
    setIsAnalyzing(false);
  }, []);

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Speak
        </h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Choose your mode and provide audio
        </p>
      </div>

      {/* Mode Segmented Control */}
      <div className="mb-5">
        <div className="flex rounded-2xl bg-muted p-1 gap-1">
          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                disabled={isAnalyzing}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-[16px] py-3 px-4 text-[13px] font-semibold transition-all",
                  isSelected
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  isAnalyzing && "opacity-60 cursor-not-allowed"
                )}
              >
                <mode.icon className="h-4 w-4" />
                {mode.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {modes.find((m) => m.id === selectedMode)?.description}
        </p>
      </div>

      {/* Input Method Toggle */}
      <div className="mb-4">
        <div className="flex rounded-2xl bg-muted p-1 gap-1">
          <button
            onClick={() => setInputMethod("record")}
            disabled={isAnalyzing}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-[16px] py-2.5 text-[13px] font-medium transition-all",
              inputMethod === "record"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              isAnalyzing && "opacity-60 cursor-not-allowed"
            )}
          >
            <Mic className="h-3.5 w-3.5" />
            Record
          </button>
          <button
            onClick={() => setInputMethod("upload")}
            disabled={isAnalyzing}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-[16px] py-2.5 text-[13px] font-medium transition-all",
              inputMethod === "upload"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              isAnalyzing && "opacity-60 cursor-not-allowed"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      </div>

      {/* Audio Input */}
      <div className="mb-5">
        {inputMethod === "record" ? (
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onReset={handleReset}
            disabled={isAnalyzing}
          />
        ) : (
          <AudioUploader
            onFileSelected={handleFileSelected}
            disabled={isAnalyzing}
          />
        )}
      </div>

      {/* Audio Status */}
      {hasAudio && !isAnalyzing && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[13px] font-medium text-success">
            Audio ready for analysis
          </span>
        </div>
      )}

      {/* Processing State */}
      {isAnalyzing && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="text-[13px] font-semibold text-primary">
              Analyzing your speech…
            </p>
            <p className="text-[11px] text-muted-foreground">
              AI is recovering meaning from your voice
            </p>
          </div>
        </div>
      )}

      {/* Start Analysis */}
      <Button
        size="lg"
        className="h-[52px] w-full gap-2 text-[15px] font-semibold rounded-[20px]"
        disabled={!hasAudio || isAnalyzing}
        onClick={handleStartAnalysis}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            Start Analysis
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RecordingState = "idle" | "recording" | "paused" | "finished";

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob, duration: number) => void;
  onReset?: () => void;
  disabled?: boolean;
}

export function AudioRecorder({
  onRecordingComplete,
  onReset,
  disabled = false,
}: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestPermissionAndRecord = async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus("granted");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete?.(blob, duration);
      };

      mediaRecorder.start();
      setState("recording");
      setDuration(0);
      startTimer();
    } catch {
      setPermissionStatus("denied");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      stopTimer();
      setState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setState("recording");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      stopTimer();
      setState("finished");
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setState("idle");
    chunksRef.current = [];
    onReset?.();
  };

  const stateLabel: Record<RecordingState, string> = {
    idle: "Ready to Record",
    recording: "Recording…",
    paused: "Paused",
    finished: "Recording Complete",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Record Audio</CardTitle>
          <Badge
            variant={
              state === "recording"
                ? "destructive"
                : state === "finished"
                  ? "default"
                  : "secondary"
            }
          >
            {stateLabel[state]}
          </Badge>
        </div>
        {permissionStatus === "denied" && (
          <p className="text-sm text-destructive">
            Microphone access is needed to record your voice. You can still
            upload an audio file.
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Timer */}
        <div
          className={cn(
            "font-mono text-5xl font-bold tabular-nums tracking-tight",
            state === "recording" ? "text-destructive" : "text-foreground"
          )}
        >
          {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {state === "idle" && (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full"
              onClick={requestPermissionAndRecord}
              disabled={disabled}
              aria-label="Start recording"
            >
              <Mic className="h-7 w-7" />
            </Button>
          )}

          {state === "recording" && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                onClick={pauseRecording}
                aria-label="Pause recording"
              >
                <Pause className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full"
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <Square className="h-6 w-6" />
              </Button>
            </>
          )}

          {state === "paused" && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                onClick={resumeRecording}
                aria-label="Resume recording"
              >
                <Play className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full"
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <Square className="h-6 w-6" />
              </Button>
            </>
          )}

          {state === "finished" && (
            <>
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full max-w-xs"
                />
              )}
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                onClick={resetRecording}
                aria-label="Re-record"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

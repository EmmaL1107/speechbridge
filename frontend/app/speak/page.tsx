"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Upload, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AudioRecorder } from "@/components/audio/audio-recorder";
import { AudioUploader } from "@/components/audio/audio-uploader";

const configItems = [
  { label: "ASR Model", value: "faster-whisper-large-v3" },
  { label: "Repair Mode", value: "Balanced" },
  { label: "Context Mode", value: "General" },
];

export default function SpeakPage() {
  const router = useRouter();
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hasAudio = recordedBlob !== null || uploadedFile !== null;

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Mock: navigate to result page with mock analysis ID
    setTimeout(() => {
      router.push("/result?id=acc-001-a1b2c3d4");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Speak</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record or upload audio to analyze
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="mb-6 flex gap-2">
        <Badge variant="default" className="gap-1.5 px-3 py-1.5">
          <Mic className="h-3.5 w-3.5" />
          Record
        </Badge>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </Badge>
      </div>

      {/* Audio Input */}
      <div className="mb-4">
        <AudioRecorder
          onRecordingComplete={(blob) => setRecordedBlob(blob)}
        />
      </div>

      <div className="mb-6">
        <AudioUploader onFileSelected={(file) => setUploadedFile(file)} />
      </div>

      <Separator className="mb-6" />

      {/* Configuration (display only) */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Configuration
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {configItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Analysis */}
      <Button
        size="lg"
        className="h-14 w-full gap-2 text-sm"
        disabled={!hasAudio || isAnalyzing}
        onClick={handleStartAnalysis}
      >
        {isAnalyzing ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            Start Analysis
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {!hasAudio && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Record or upload audio to begin
        </p>
      )}
    </div>
  );
}

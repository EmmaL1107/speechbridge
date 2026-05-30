"use client";

import { useState, useRef } from "react";
import { Upload, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AudioUploaderProps {
  onFileSelected?: (file: File) => void;
}

const ACCEPTED_FORMATS = [".wav", ".mp3", ".m4a", ".webm"];
const MAX_SIZE_MB = 50;

export function AudioUploader({ onFileSelected }: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      return `Unsupported format. Accepted: ${ACCEPTED_FORMATS.join(", ")}`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size: ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
    onFileSelected?.(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upload Audio</CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            aria-label="Upload audio file"
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop audio file here or tap to select
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                WAV, MP3, M4A, WebM — up to {MAX_SIZE_MB}MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_FORMATS.join(",")}
              onChange={handleChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <FileAudio className="h-8 w-8 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  ChevronDown,
  Brain,
  Wrench,
  AlertTriangle,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IntentCard } from "@/components/result/intent-card";
import { VoiceComparison } from "@/components/result/voice-comparison";
import { DiffViewer } from "@/components/cards/diff-viewer";
import { RawTranscriptCard } from "@/components/result/raw-transcript-card";
import { IssueCard } from "@/components/result/issue-card";
import { PipelineSteps } from "@/components/result/pipeline-steps";
import { FeedbackCard } from "@/components/result/feedback-card";
import type { AnalysisResult } from "@/types/analysis";

interface AdvancedAnalysisProps {
  analysis: AnalysisResult;
  recordedAudioUrl?: string | null;
}

interface AccordionSectionProps {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({
  icon,
  title,
  defaultOpen = false,
  children,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        className="w-full flex items-center gap-2.5 p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-primary">{icon}</span>
        <span className="flex-1 text-[13px] font-semibold text-foreground">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </Card>
  );
}

export function AdvancedAnalysis({ analysis, recordedAudioUrl }: AdvancedAnalysisProps) {
  const issueData = analysis.uncertainty.uncertain_spans.map((span) => {
    const matchingEdit = analysis.repair.edits.find(
      (e) => e.start === span.start && e.end === span.end
    );
    return { span, edit: matchingEdit };
  });

  return (
    <div className="space-y-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pt-2">
        Advanced Analysis
      </h2>

      {/* AI Understanding */}
      {analysis.intent && (
        <AccordionSection
          icon={<Brain className="h-4 w-4" />}
          title="AI Understanding"
          defaultOpen
        >
          <IntentCard intent={analysis.intent} />
        </AccordionSection>
      )}

      {/* Voice Transformation */}
      {analysis.voice_comparison && (
        <AccordionSection
          icon={<MessageSquare className="h-4 w-4" />}
          title="Voice Transformation"
        >
          <VoiceComparison
            comparison={analysis.voice_comparison}
            tts={analysis.tts}
            recordedAudioUrl={recordedAudioUrl}
          />
        </AccordionSection>
      )}

      {/* Repair Details */}
      <AccordionSection
        icon={<Wrench className="h-4 w-4" />}
        title="Repair Details"
      >
        <DiffViewer
          original={analysis.asr.raw_text}
          repaired={analysis.repair.repaired_text}
          edits={analysis.repair.edits}
        />
      </AccordionSection>

      {/* Detected Issues */}
      <AccordionSection
        icon={<AlertTriangle className="h-4 w-4" />}
        title={`Detected Issues (${issueData.length})`}
      >
        <div className="space-y-3">
          {issueData.map(({ span, edit }, i) => (
            <IssueCard
              key={`${span.start}-${span.end}`}
              span={span}
              edit={edit}
              index={i}
            />
          ))}
        </div>
      </AccordionSection>

      {/* Processing Pipeline */}
      <AccordionSection
        icon={<GitBranch className="h-4 w-4" />}
        title="Processing Pipeline"
      >
        <PipelineSteps />
      </AccordionSection>

      {/* Raw Transcript */}
      <AccordionSection
        icon={<MessageSquare className="h-4 w-4" />}
        title="Raw Transcript"
      >
        <RawTranscriptCard
          rawText={analysis.asr.raw_text}
          spans={analysis.uncertainty.uncertain_spans}
          segmentCount={analysis.asr.segments.length}
        />
      </AccordionSection>

      {/* Feedback */}
      <AccordionSection
        icon={<MessageSquare className="h-4 w-4" />}
        title="Feedback"
      >
        <FeedbackCard analysisId={analysis.analysis_id} />
      </AccordionSection>
    </div>
  );
}

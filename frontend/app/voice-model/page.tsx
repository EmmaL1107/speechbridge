import {
  TrendingUp,
  BookOpen,
  Zap,
  MessageCircle,
  Target,
  Fingerprint,
  Shield,
  Info,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockVoiceModel, mockUserProfile } from "@/lib/mock-data";

function StatRing({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[88px] w-[88px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="5"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-[12px] font-medium text-muted-foreground text-center">
        {label}
      </span>
    </div>
  );
}

function ProgressBar({
  month,
  accuracy,
  max,
}: {
  month: string;
  accuracy: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-muted-foreground w-8">{month}</span>
      <div className="flex-1 h-3 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(accuracy / max) * 100}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-foreground w-8 text-right">
        {accuracy}%
      </span>
    </div>
  );
}

export default function VoiceModelPage() {
  const maxAccuracy = Math.max(
    ...mockVoiceModel.progress_history.map((p) => p.accuracy)
  );

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          My Voice Model
        </h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          SpeechBridge learns you
        </p>
      </div>

      {/* Hero: Recovery Accuracy */}
      <Card className="mb-5 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-center gap-8">
            <StatRing
              value={mockVoiceModel.recovery_accuracy}
              label="Communication Recovery"
              color="var(--primary)"
            />
            <StatRing
              value={mockUserProfile.average_confidence}
              label="Avg Confidence"
              color="var(--success)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-primary">
              {mockVoiceModel.vocabulary_learned}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Words Learned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-success">
              {mockVoiceModel.corrections_avoided}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Corrections Avoided
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {mockUserProfile.total_analyses}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Conversations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Progress Over Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Progress Over Time
              </span>
            </div>
            <div className="space-y-2.5">
              {mockVoiceModel.progress_history.map((entry) => (
                <ProgressBar
                  key={entry.month}
                  month={entry.month}
                  accuracy={entry.accuracy}
                  max={maxAccuracy}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferred Expressions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Preferred Expressions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockVoiceModel.preferred_expressions.map((expr) => (
                <Badge
                  key={expr}
                  variant="secondary"
                  className="text-[11px] font-medium rounded-xl"
                >
                  {expr}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequent Topics */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Most Frequent Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockVoiceModel.frequent_topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="text-[11px] font-medium rounded-xl"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accent Patterns Learned */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Accent Patterns Learned
              </span>
            </div>
            <div className="space-y-2">
              {mockVoiceModel.accent_patterns.map((pattern) => (
                <div
                  key={pattern}
                  className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[12px] text-foreground">
                    {pattern}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Privacy & Data
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Your voice data is processed securely and never shared. Audio
              files are stored locally and can be deleted at any time. You are
              always in control of your data.
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                About SpeechBridge
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Version
                </span>
                <span className="text-[13px] font-mono text-foreground">
                  1.0.0
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Mission
                </span>
                <span className="text-[13px] font-medium text-foreground">
                  Helping Every Voice Be Understood
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

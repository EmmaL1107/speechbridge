import {
  User,
  TrendingUp,
  BookOpen,
  Shield,
  Info,
  Sparkles,
  Volume2,
  Globe,
  Heart,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockUserProfile } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-28">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Your Voice Profile
        </h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          How SpeechBridge understands you
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {mockUserProfile.total_analyses}
            </p>
            <p className="text-[11px] text-muted-foreground">Total Analyses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {mockUserProfile.average_confidence}%
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avg Confidence
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* AI Learning Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                AI Learning Progress
              </span>
            </div>
            <div className="mb-2">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${mockUserProfile.learning_progress}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {mockUserProfile.learning_progress}% — SpeechBridge learns your
              patterns with each use
            </p>
          </CardContent>
        </Card>

        {/* Communication Style */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Communication Style
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Preferred Mode
                </span>
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  <Globe className="h-3 w-3" />
                  Accent Assist
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Voice Output
                </span>
                <span className="text-[13px] font-medium text-foreground">
                  Standard
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speech Recovery Statistics */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Speech Recovery Statistics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold text-primary">
                  {mockUserProfile.vocabulary_size}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Vocabulary Words
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3 text-center">
                <p className="text-lg font-bold text-success">
                  {mockUserProfile.corrections_avoided}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Corrections Avoided
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Over Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-semibold text-foreground">
                Growth Over Time
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              The system understands you better every day. Your vocabulary,
              preferred corrections, and feedback help the AI adapt to your
              unique communication patterns.
            </p>
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

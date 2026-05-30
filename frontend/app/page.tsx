import Link from "next/link";
import {
  Mic,
  Upload,
  ArrowRight,
  BarChart3,
  Wrench,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisCard } from "@/components/cards/analysis-card";
import { mockAnalyses } from "@/lib/mock-data";

const workflowSteps = [
  { label: "Record", icon: "🎤" },
  { label: "Understand", icon: "🧠" },
  { label: "Repair", icon: "🔧" },
  { label: "Speak", icon: "🔊" },
];

const stats = [
  { label: "Analyses", value: "24", icon: BarChart3 },
  { label: "Repairs", value: "89", icon: Wrench },
  { label: "Feedback", value: "12", icon: MessageSquare },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Hero */}
      <section className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <span className="text-2xl font-bold">SB</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SpeechBridge</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-Powered Non-Standard Speech Understanding
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Transform accented or impaired speech into clear, standardized text
          and understandable voice output. We recover meaning, not just sounds.
        </p>
      </section>

      {/* Workflow */}
      <section className="mb-8">
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
          {workflowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">{step.icon}</span>
                <span className="text-xs font-medium">{step.label}</span>
              </div>
              {i < workflowSteps.length - 1 && (
                <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Primary Actions */}
      <section className="mb-8 grid grid-cols-2 gap-3">
        <Link href="/speak">
          <Button size="lg" className="h-14 w-full gap-2 text-sm">
            <Mic className="h-5 w-5" />
            Start Speaking
          </Button>
        </Link>
        <Link href="/speak">
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full gap-2 text-sm"
          >
            <Upload className="h-5 w-5" />
            Upload Audio
          </Button>
        </Link>
      </section>

      {/* Quick Stats */}
      <section className="mb-8 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center gap-1 p-3">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Analyses */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Analyses</h2>
          <Link href="/history">
            <Badge variant="secondary" className="cursor-pointer">
              View All
            </Badge>
          </Link>
        </div>
        <div className="space-y-3">
          {mockAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.analysis_id} analysis={analysis} />
          ))}
        </div>
      </section>
    </div>
  );
}

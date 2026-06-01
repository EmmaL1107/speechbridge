import Link from "next/link";
import {
  Mic,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpeechBridgeLogo } from "@/components/logo";
import { homeDemo, mockSuccessStories, mockUserProfile } from "@/lib/mock-data";

const stats = [
  {
    value: "94%",
    label: "Meaning Recovery",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    value: "87%",
    label: "Communication Confidence",
    icon: TrendingUp,
    color: "text-success",
  },
  {
    value: String(mockUserProfile.total_analyses),
    label: "Conversations Assisted",
    icon: MessageCircle,
    color: "text-foreground",
  },
  {
    value: String(mockUserProfile.vocabulary_size),
    label: "Words Learned",
    icon: BookOpen,
    color: "text-primary",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-10 pb-28">
      {/* Hero */}
      <section className="text-center mb-8">
        <SpeechBridgeLogo size={56} className="mx-auto mb-5 text-primary" />
        <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
          Helping Every Voice
          <br />
          Be Understood
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-[320px] mx-auto">
          AI that recovers meaning from accented and impaired speech — not just
          words.
        </p>
      </section>

      {/* Single CTA */}
      <section className="mb-8">
        <Link href="/speak">
          <Button
            size="lg"
            className="h-[52px] w-full gap-2 text-[15px] font-semibold rounded-[20px]"
          >
            <Mic className="h-5 w-5" />
            Start Communicating
          </Button>
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className={`text-2xl font-bold ${stat.color} mb-0.5`}>
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Live Transformation Demo */}
      <section className="mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-[11px] font-medium">
                Live Example
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                Accent Assist
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Raw Speech */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Raw Speech
                </p>
                <p className="text-[13px] text-muted-foreground leading-relaxed bg-muted/50 rounded-2xl px-4 py-3">
                  {homeDemo.raw}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 px-4">
                <div className="flex-1 h-px bg-border" />
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-medium text-primary">
                  AI Understanding
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Clear Expression */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
                  Clear Expression
                </p>
                <p className="text-[15px] font-semibold text-foreground leading-relaxed bg-primary/5 rounded-2xl px-4 py-3 border border-primary/10">
                  {homeDemo.repaired}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">
                  {homeDemo.confidence_score}%
                </p>
                <p className="text-[10px] text-muted-foreground">Confidence</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">
                  {homeDemo.meaning_recovery}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Meaning Recovery
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {homeDemo.repair_count}
                </p>
                <p className="text-[10px] text-muted-foreground">Repairs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Success Stories */}
      <section className="mb-8">
        <h2 className="text-[15px] font-semibold text-foreground mb-3 px-1">
          Recent Success Stories
        </h2>
        <div className="space-y-3">
          {mockSuccessStories.map((story) => (
            <Link
              key={story.id}
              href="/result?id=acc-demo-sink-dis"
              className="block"
            >
              <Card className="transition-all hover:shadow-md active:scale-[0.98]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium"
                    >
                      {story.mode === "accent_correction"
                        ? "Accent Assist"
                        : "Speech Assist"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {story.time_ago}
                    </span>
                  </div>

                  {/* Before → After */}
                  <div className="mb-2.5">
                    <p className="text-[11px] text-muted-foreground/60 line-through decoration-muted-foreground/30 mb-0.5">
                      {story.raw_text}
                    </p>
                    <p className="text-[13px] font-semibold text-foreground leading-snug">
                      {story.repaired_text}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-success">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-[11px] font-medium">
                        {story.meaning_recovery}% meaning recovered
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Watch Demo Link */}
      <section>
        <Link href="/result?id=acc-001-a1b2c3d4">
          <Button
            variant="outline"
            size="lg"
            className="h-[48px] w-full gap-2 text-[14px] font-medium rounded-[20px]"
          >
            Watch Full Demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

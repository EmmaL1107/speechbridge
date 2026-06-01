"use client";

import { useState } from "react";
import { BookOpen, Plus, Users, Building2, Wrench, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockVocabulary } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { VocabularyCategory } from "@/types/analysis";

type CategoryTab = "all" | VocabularyCategory;

const tabs: { id: CategoryTab; label: string; icon?: React.ElementType }[] = [
  { id: "all", label: "All" },
  { id: "people", label: "People", icon: Users },
  { id: "organizations", label: "Organizations", icon: Building2 },
  { id: "technical", label: "Technical", icon: Wrench },
  { id: "custom", label: "Custom", icon: MessageSquare },
];

export default function LexiconPage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");

  const filtered =
    activeTab === "all"
      ? mockVocabulary
      : mockVocabulary.filter((v) => v.category === activeTab);

  const totalCorrections = mockVocabulary.reduce(
    (sum, v) => sum + v.corrections_avoided,
    0
  );

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-28">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            My Vocabulary
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Words SpeechBridge recognizes for you
          </p>
        </div>
        <Button size="sm" className="gap-1.5 rounded-2xl">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card>
          <CardContent className="p-3.5 text-center">
            <p className="text-2xl font-bold text-primary">
              {mockVocabulary.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Total Words</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3.5 text-center">
            <p className="text-2xl font-bold text-success">
              {totalCorrections}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Corrections Avoided
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[12px] font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-muted">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">
                        {entry.term}
                      </p>
                      <p className="text-[11px] text-muted-foreground capitalize">
                        {entry.category}
                      </p>
                    </div>
                  </div>
                  {entry.domain && (
                    <Badge variant="secondary" className="text-[10px]">
                      {entry.domain}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span>
                    Used <span className="font-semibold text-foreground">{entry.usage_count}</span> times
                  </span>
                  <span>
                    <span className="font-semibold text-success">
                      {entry.corrections_avoided}
                    </span>{" "}
                    corrections avoided
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-[13px] font-medium text-foreground">
            No words in this category
          </p>
        </div>
      )}
    </div>
  );
}

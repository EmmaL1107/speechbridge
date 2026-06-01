"use client";

import { useState } from "react";
import { Clock, Globe, Heart, Star } from "lucide-react";
import { AnalysisCard } from "@/components/cards/analysis-card";
import { mockAnalyses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "accent" | "speech" | "favorites";

const tabs: { id: FilterTab; label: string; icon?: React.ElementType }[] = [
  { id: "all", label: "All" },
  { id: "accent", label: "Accent", icon: Globe },
  { id: "speech", label: "Speech", icon: Heart },
  { id: "favorites", label: "Favorites", icon: Star },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = mockAnalyses.filter((a) => {
    if (activeTab === "accent") return a.mode === "accent_correction";
    if (activeTab === "speech")
      return a.mode === "speech_impairment_assistance";
    if (activeTab === "favorites") return a.is_favorite;
    return true;
  });

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-28">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Communication Timeline
        </h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Your speech analysis history
        </p>
      </div>

      {/* Filter Tabs */}
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
        <div className="space-y-3">
          {filtered.map((analysis) => (
            <AnalysisCard key={analysis.analysis_id} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Clock className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-[13px] font-medium text-foreground">
            No communications yet
          </p>
          <p className="text-[11px] text-muted-foreground text-center max-w-xs">
            Your completed speech analyses will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

import { Clock } from "lucide-react";
import { AnalysisCard } from "@/components/cards/analysis-card";
import { mockAnalyses } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your past analyses
        </p>
      </div>

      {mockAnalyses.length > 0 ? (
        <div className="space-y-3">
          {mockAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.analysis_id} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16">
          <Clock className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No analyses yet</p>
        </div>
      )}
    </div>
  );
}

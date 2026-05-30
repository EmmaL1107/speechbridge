import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockLexicon = [
  { id: "1", term: "TensorFlow", category: "technical", domain: "ML" },
  { id: "2", term: "Kubernetes", category: "technical", domain: "DevOps" },
  { id: "3", term: "Zhang Wei", category: "person", domain: "" },
  { id: "4", term: "NVIDIA", category: "organization", domain: "Tech" },
];

export default function LexiconPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Lexicon</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Custom vocabulary for better recognition
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {mockLexicon.length > 0 ? (
        <div className="space-y-2">
          {mockLexicon.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{entry.term}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.category}
                  </p>
                </div>
                {entry.domain && (
                  <Badge variant="secondary" className="text-xs">
                    {entry.domain}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No lexicon entries yet
          </p>
        </div>
      )}
    </div>
  );
}

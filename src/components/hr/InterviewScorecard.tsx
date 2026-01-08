import { Scorecard, ScorecardCategory, calculateOverallRating } from "@/hooks/hr/useHRInterviews";
import { RatingStars } from "./RatingStars";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InterviewScorecardProps {
  scorecard: Scorecard;
  onChange: (scorecard: Scorecard) => void;
  readOnly?: boolean;
}

export function InterviewScorecard({ scorecard, onChange, readOnly = false }: InterviewScorecardProps) {
  const updateCategory = (categoryId: string, updates: Partial<ScorecardCategory>) => {
    const newCategories = scorecard.categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    const newOverall = calculateOverallRating(newCategories);
    onChange({
      ...scorecard,
      categories: newCategories,
      overallRating: newOverall,
    });
  };

  const overallColor = scorecard.overallRating >= 4
    ? 'text-emerald-400'
    : scorecard.overallRating >= 3
      ? 'text-amber-400'
      : scorecard.overallRating >= 1
        ? 'text-orange-400'
        : 'text-muted-foreground';

  return (
    <div className="space-y-6">
      {/* Overall Rating Display */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div>
          <p className="text-sm text-muted-foreground">Overall Rating</p>
          <p className={cn("text-3xl font-light", overallColor)}>
            {scorecard.overallRating > 0 ? scorecard.overallRating.toFixed(2) : '—'}
          </p>
        </div>
        <RatingStars
          rating={scorecard.overallRating}
          readOnly
          size="lg"
        />
      </div>

      {/* Category Ratings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Evaluation Categories
        </h4>
        
        <div className="grid gap-4">
          {scorecard.categories.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <RatingStars
                  rating={category.rating}
                  onChange={(rating) => updateCategory(category.id, { rating })}
                  readOnly={readOnly}
                  size="md"
                />
              </div>
              
              <Textarea
                placeholder={`Notes about ${category.name.toLowerCase()}...`}
                value={category.notes}
                onChange={(e) => updateCategory(category.id, { notes: e.target.value })}
                readOnly={readOnly}
                className="bg-white/5 border-white/10 min-h-[60px] text-sm resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-emerald-400">Strengths</Label>
          <Textarea
            placeholder="Key strengths observed..."
            value={scorecard.strengths}
            onChange={(e) => onChange({ ...scorecard, strengths: e.target.value })}
            readOnly={readOnly}
            className="bg-white/5 border-white/10 min-h-[100px] resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-orange-400">Areas for Improvement</Label>
          <Textarea
            placeholder="Areas that need development..."
            value={scorecard.weaknesses}
            onChange={(e) => onChange({ ...scorecard, weaknesses: e.target.value })}
            readOnly={readOnly}
            className="bg-white/5 border-white/10 min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className="space-y-2">
        <Label>Overall Recommendation</Label>
        <Textarea
          placeholder="Your recommendation for this candidate..."
          value={scorecard.recommendation}
          onChange={(e) => onChange({ ...scorecard, recommendation: e.target.value })}
          readOnly={readOnly}
          className="bg-white/5 border-white/10 min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
}

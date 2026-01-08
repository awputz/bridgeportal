import { cn } from "@/lib/utils";

interface PoachabilityScoreProps {
  score: number | null;
  compact?: boolean;
  showLabel?: boolean;
}

export function PoachabilityScore({ score, compact = false, showLabel = true }: PoachabilityScoreProps) {
  if (score === null || score === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  const getScoreColor = (s: number) => {
    if (s <= 30) return { bg: 'bg-red-500', text: 'text-red-400', label: 'Low' };
    if (s <= 60) return { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Medium' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'High' };
  };

  const colors = getScoreColor(score);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", colors.bg)}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={cn("text-xs font-medium", colors.text)}>{score}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn("text-2xl font-bold", colors.text)}>{score}</span>
        {showLabel && (
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full border",
            colors.text,
            colors.bg.replace('bg-', 'bg-').replace('-500', '-500/10'),
            colors.bg.replace('bg-', 'border-').replace('-500', '-500/20')
          )}>
            {colors.label}
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", colors.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {score <= 30 && "Unlikely to move - well-established or recently joined"}
        {score > 30 && score <= 60 && "Open to opportunities under right conditions"}
        {score > 60 && "Actively looking or highly recruitable"}
      </p>
    </div>
  );
}

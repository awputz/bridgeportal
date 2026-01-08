import { cn } from "@/lib/utils";

interface CampaignStatsProps {
  total: number;
  sent: number;
  opened: number;
  replied: number;
  compact?: boolean;
}

export function CampaignStats({ total, sent, opened, replied, compact = false }: CampaignStatsProps) {
  const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
  const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Sent:</span>
          <span className="font-medium">{sent}/{total}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Opened:</span>
          <span className="font-medium text-amber-400">{openRate}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Replied:</span>
          <span className={cn(
            "font-medium",
            replyRate >= 20 ? "text-emerald-400" : replyRate >= 10 ? "text-amber-400" : "text-red-400"
          )}>{replyRate}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Recipients */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Recipients</span>
          <span className="font-medium">{total}</span>
        </div>
      </div>

      {/* Sent Progress */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Sent</span>
          <span className="font-medium">{sent} <span className="text-muted-foreground">/ {total}</span></span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${total > 0 ? (sent / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Opened */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Opened</span>
          <span className="font-medium text-amber-400">{opened} <span className="text-muted-foreground">({openRate}%)</span></span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${sent > 0 ? (opened / sent) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Replied */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Replied</span>
          <span className={cn(
            "font-medium",
            replyRate >= 20 ? "text-emerald-400" : replyRate >= 10 ? "text-amber-400" : "text-red-400"
          )}>
            {replied} <span className="text-muted-foreground">({replyRate}%)</span>
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              replyRate >= 20 ? "bg-emerald-500" : replyRate >= 10 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${sent > 0 ? (replied / sent) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PoachabilityScore } from "@/components/hr/PoachabilityScore";
import {
  HRAgent,
  Division,
  RecruitmentStatus,
  formatProduction,
  statusColors,
  divisionColors,
  divisionLabels,
  statusLabels
} from "@/hooks/hr/useHRAgents";
import { cn } from "@/lib/utils";

interface MobileAgentCardProps {
  agent: HRAgent;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onLogInteraction: (e: React.MouseEvent) => void;
}

export function MobileAgentCard({
  agent,
  onClick,
  onEdit,
  onDelete,
  onLogInteraction,
}: MobileAgentCardProps) {
  return (
    <div
      className="p-4 bg-card/50 border border-border rounded-xl space-y-3 active:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      {/* Header with avatar and name */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={agent.photo_url || undefined} />
          <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-sm">
            {agent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{agent.full_name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {agent.current_brokerage || 'No brokerage'}
          </p>
        </div>
        <PoachabilityScore score={agent.poachability_score} compact />
      </div>

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-2">
        {agent.division && (
          <Badge variant="outline" className={cn("text-xs", divisionColors[agent.division as Division])}>
            {divisionLabels[agent.division as Division]}
          </Badge>
        )}
        <Badge variant="outline" className={cn("text-xs", statusColors[agent.recruitment_status as RecruitmentStatus])}>
          {statusLabels[agent.recruitment_status as RecruitmentStatus]}
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto">
          {formatProduction(agent.annual_production ? Number(agent.annual_production) : null)}
        </span>
      </div>

      {/* Footer with actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {agent.last_contacted_at
            ? `Contacted ${formatDistanceToNow(new Date(agent.last_contacted_at), { addSuffix: true })}`
            : 'Never contacted'}
        </span>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={onLogInteraction}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

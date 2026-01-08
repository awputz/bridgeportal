import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HRAgent, formatProduction, divisionColors, divisionLabels, Division } from "@/hooks/hr/useHRAgents";
import { PoachabilityScore } from "./PoachabilityScore";
import { differenceInDays } from "date-fns";
import { AlertCircle } from "lucide-react";

interface PipelineAgentCardProps {
  agent: HRAgent;
  onClick: () => void;
}

export function PipelineAgentCard({ agent, onClick }: PipelineAgentCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: agent.id,
    data: { agent },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const daysInStage = agent.updated_at 
    ? differenceInDays(new Date(), new Date(agent.updated_at))
    : 0;
  const isStuck = daysInStage >= 30 && !['hired', 'lost'].includes(agent.recruitment_status || '');

  const initials = agent.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const divisionColor = agent.division 
    ? divisionColors[agent.division as Division] 
    : 'bg-muted text-muted-foreground';

  const divisionBorderColor = agent.division === 'investment-sales' 
    ? 'border-l-purple-500'
    : agent.division === 'commercial-leasing'
    ? 'border-l-blue-500'
    : agent.division === 'residential'
    ? 'border-l-green-500'
    : agent.division === 'capital-advisory'
    ? 'border-l-amber-500'
    : 'border-l-muted';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        p-3 rounded-lg border-l-4 cursor-grab active:cursor-grabbing
        bg-card/50 border border-border/50 hover:bg-card/80
        transition-all duration-200
        ${divisionBorderColor}
        ${isDragging ? 'opacity-50 scale-105 shadow-lg z-50' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={agent.photo_url || undefined} alt={agent.full_name || ''} />
          <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{agent.full_name}</p>
            {isStuck && (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate">
            {agent.current_brokerage || 'Unknown brokerage'}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {agent.division && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${divisionColor}`}>
                {divisionLabels[agent.division as Division]}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatProduction(agent.annual_production)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <PoachabilityScore score={agent.poachability_score} compact showLabel={false} />
            <span className="text-[10px] text-muted-foreground">
              {daysInStage}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

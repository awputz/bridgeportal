import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HRAgent, RecruitmentStatus } from "@/hooks/hr/useHRAgents";
import { PipelineAgentCard } from "./PipelineAgentCard";
import { Users } from "lucide-react";

interface PipelineColumnProps {
  id: RecruitmentStatus;
  title: string;
  agents: HRAgent[];
  color: string;
  onAgentClick: (agent: HRAgent) => void;
}

const colorClasses: Record<string, { bg: string; border: string; accent: string }> = {
  slate: { bg: 'bg-slate-500/5', border: 'border-slate-500/30', accent: 'bg-slate-500' },
  blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', accent: 'bg-blue-500' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', accent: 'bg-amber-500' },
  orange: { bg: 'bg-orange-500/5', border: 'border-orange-500/30', accent: 'bg-orange-500' },
  red: { bg: 'bg-red-500/5', border: 'border-red-500/30', accent: 'bg-red-500' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/30', accent: 'bg-purple-500' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', accent: 'bg-emerald-500' },
};

export function PipelineColumn({ id, title, agents, color, onAgentClick }: PipelineColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  const colors = colorClasses[color] || colorClasses.slate;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col h-full min-w-[280px] w-[280px] rounded-lg border
        ${colors.bg} ${colors.border}
        ${isOver ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''}
        transition-all duration-200
      `}
    >
      {/* Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colors.accent}`} />
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {agents.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No agents</p>
            </div>
          ) : (
            agents.map((agent) => (
              <PipelineAgentCard
                key={agent.id}
                agent={agent}
                onClick={() => onAgentClick(agent)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

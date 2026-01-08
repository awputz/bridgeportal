import { useState, useMemo } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useHRAgents, useUpdateAgentStatus, useHRInteractions, HRAgent, RecruitmentStatus, Division } from "@/hooks/hr/useHRAgents";
import { PipelineColumn } from "@/components/hr/PipelineColumn";
import { PipelineAgentCard } from "@/components/hr/PipelineAgentCard";
import { AgentQuickView } from "@/components/hr/AgentQuickView";
import { LogInteractionDialog } from "@/components/hr/LogInteractionDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Clock, Target } from "lucide-react";
import { differenceInDays } from "date-fns";

const PIPELINE_STAGES: { id: RecruitmentStatus; title: string; color: string }[] = [
  { id: 'cold', title: 'Cold Lead', color: 'slate' },
  { id: 'contacted', title: 'Contacted', color: 'blue' },
  { id: 'warm', title: 'Warm Lead', color: 'amber' },
  { id: 'qualified', title: 'Qualified', color: 'orange' },
  { id: 'hot', title: 'Hot Prospect', color: 'red' },
  { id: 'offer-made', title: 'Offer Made', color: 'purple' },
  { id: 'hired', title: 'Hired', color: 'emerald' },
];

export default function RecruitmentPipeline() {
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<HRAgent | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false);

  const { data: agents = [], isLoading } = useHRAgents(
    divisionFilter !== 'all' ? { division: divisionFilter } : undefined
  );
  const { data: selectedAgentInteractions = [] } = useHRInteractions(selectedAgent?.id);
  const updateStatus = useUpdateAgentStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group agents by status
  const groupedAgents = useMemo(() => {
    const groups: Record<RecruitmentStatus, HRAgent[]> = {
      cold: [],
      contacted: [],
      warm: [],
      qualified: [],
      hot: [],
      'offer-made': [],
      hired: [],
      lost: [],
    };
    
    agents.forEach(agent => {
      const status = (agent.recruitment_status as RecruitmentStatus) || 'cold';
      if (groups[status]) {
        groups[status].push(agent);
      }
    });
    
    return groups;
  }, [agents]);

  // Metrics
  const metrics = useMemo(() => {
    const total = agents.filter(a => a.recruitment_status !== 'lost').length;
    const hired = groupedAgents.hired.length;
    const coldTotal = agents.filter(a => a.recruitment_status === 'cold' || !a.recruitment_status).length;
    const conversionRate = coldTotal > 0 ? ((hired / coldTotal) * 100).toFixed(1) : '0';
    
    const hiredAgents = groupedAgents.hired;
    const avgDays = hiredAgents.length > 0
      ? Math.round(hiredAgents.reduce((sum, a) => {
          const days = differenceInDays(new Date(a.updated_at || new Date()), new Date(a.created_at || new Date()));
          return sum + days;
        }, 0) / hiredAgents.length)
      : 0;

    const stuckCount = agents.filter(a => {
      const daysInStage = differenceInDays(new Date(), new Date(a.updated_at || new Date()));
      return daysInStage >= 30 && !['hired', 'lost'].includes(a.recruitment_status || '');
    }).length;

    return { total, hired, conversionRate, avgDays, stuckCount };
  }, [agents, groupedAgents]);

  const activeAgent = activeId ? agents.find(a => a.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const agentId = active.id as string;
    const newStatus = over.id as RecruitmentStatus;
    const agent = agents.find(a => a.id === agentId);

    if (agent && agent.recruitment_status !== newStatus) {
      updateStatus.mutate({ id: agentId, status: newStatus });
    }
  };

  const handleAgentClick = (agent: HRAgent) => {
    setSelectedAgent(agent);
    setQuickViewOpen(true);
  };

  const handleLogInteraction = () => {
    setQuickViewOpen(false);
    setInteractionDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extralight tracking-tight">Recruitment Pipeline</h1>
          <p className="text-muted-foreground text-sm">
            {metrics.total} active candidates
          </p>
        </div>

        <Select value={divisionFilter} onValueChange={(v) => setDivisionFilter(v as Division | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Divisions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            <SelectItem value="investment-sales">Investment Sales</SelectItem>
            <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{metrics.total}</p>
                <p className="text-xs text-muted-foreground">Active Pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{metrics.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{metrics.avgDays}d</p>
                <p className="text-xs text-muted-foreground">Avg. Time to Hire</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Target className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{metrics.stuckCount}</p>
                <p className="text-xs text-muted-foreground">Stuck (30+ days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max" style={{ height: 'calc(100vh - 340px)', minHeight: '400px' }}>
            {PIPELINE_STAGES.map((stage) => (
              <PipelineColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                agents={groupedAgents[stage.id] || []}
                color={stage.color}
                onAgentClick={handleAgentClick}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeAgent ? (
            <div className="opacity-90">
              <PipelineAgentCard agent={activeAgent} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Quick View Sheet */}
      <AgentQuickView
        agent={selectedAgent}
        interactions={selectedAgentInteractions}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        onLogInteraction={handleLogInteraction}
      />

      {/* Log Interaction Dialog */}
      {selectedAgent && (
        <LogInteractionDialog
          agentId={selectedAgent.id}
          agentName={selectedAgent.full_name || 'Agent'}
          open={interactionDialogOpen}
          onOpenChange={setInteractionDialogOpen}
        />
      )}
    </div>
  );
}

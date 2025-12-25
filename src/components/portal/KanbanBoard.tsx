import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";

interface KanbanBoardProps {
  stages: CRMDealStage[];
  deals: CRMDeal[];
  onDealMove: (dealId: string, newStageId: string) => void;
}

interface DealCardProps {
  deal: CRMDeal;
  isDragging?: boolean;
}

const DealCard = ({ deal, isDragging }: DealCardProps) => (
  <div
    className={cn(
      "p-3 bg-white/5 rounded-lg transition-all border border-transparent",
      isDragging ? "opacity-50 border-primary/50 shadow-lg" : "hover:bg-white/10"
    )}
  >
    <p className="text-sm font-light text-foreground truncate">
      {deal.property_address}
    </p>
    {deal.contact && (
      <p className="text-xs text-muted-foreground truncate">
        {deal.contact.full_name}
      </p>
    )}
    {deal.value && (
      <p className="text-xs text-muted-foreground mt-1">
        ${deal.value.toLocaleString()}
      </p>
    )}
  </div>
);

interface SortableDealCardProps {
  deal: CRMDeal;
}

const SortableDealCard = ({ deal }: SortableDealCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "z-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      <Link to={`/portal/crm/deals/${deal.id}`} className="block">
        <DealCard deal={deal} isDragging={isDragging} />
      </Link>
    </div>
  );
};

interface KanbanColumnProps {
  stage: CRMDealStage;
  deals: CRMDeal[];
  isOver?: boolean;
}

const KanbanColumn = ({ stage, deals, isOver }: KanbanColumnProps) => {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-72 glass-card p-4 transition-all",
        isOver && "ring-2 ring-primary/50 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="text-sm font-medium text-foreground">{stage.name}</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {deals.length}
        </span>
      </div>
      <SortableContext
        items={deals.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[200px]">
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
          {deals.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-8">
              Drop deals here
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export const KanbanBoard = ({ stages, deals, onDealMove }: KanbanBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group deals by stage
  const dealsByStage: Record<string, CRMDeal[]> = {};
  stages.forEach((stage) => {
    dealsByStage[stage.id] = deals.filter((d) => d.stage_id === stage.id);
  });

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null;

  const findStageForDeal = (dealId: string): string | null => {
    for (const stage of stages) {
      if (dealsByStage[stage.id]?.some((d) => d.id === dealId)) {
        return stage.id;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      // Check if over a stage column or a deal
      const overStage = stages.find((s) => s.id === over.id);
      if (overStage) {
        setOverId(overStage.id);
      } else {
        // Over a deal - find which stage it's in
        const stageId = findStageForDeal(over.id as string);
        setOverId(stageId);
      }
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeStageId = findStageForDeal(active.id as string);
      
      // Determine target stage
      let targetStageId: string | null = null;
      
      // Check if dropped on a stage
      const overStage = stages.find((s) => s.id === over.id);
      if (overStage) {
        targetStageId = overStage.id;
      } else {
        // Dropped on a deal - find which stage it's in
        targetStageId = findStageForDeal(over.id as string);
      }

      if (targetStageId && activeStageId !== targetStageId) {
        onDealMove(active.id as string, targetStageId);
      }
    }

    setActiveId(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            isOver={overId === stage.id}
          />
        ))}
        
        <Link 
          to="/portal/crm/deals/new"
          className="flex-shrink-0 w-72 glass-card p-4 flex items-center justify-center hover:bg-white/5 transition-colors border-2 border-dashed border-white/10"
        >
          <Button variant="ghost" className="gap-2">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div className="w-64">
            <DealCard deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

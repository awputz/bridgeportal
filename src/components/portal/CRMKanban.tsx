import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Building2, User, Calendar, DollarSign, GripVertical } from "lucide-react";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatFullCurrency } from "@/lib/formatters";

interface CRMKanbanProps {
  deals: CRMDeal[];
  stages: CRMDealStage[];
  onStageChange: (dealId: string, newStageId: string) => void;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const priorityColors: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

// Sortable Deal Card
const SortableDealCard = ({ deal, isDragging }: { deal: CRMDeal; isDragging?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
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
        "bg-background border border-border rounded-lg p-3 transition-all",
        isDragging ? "opacity-50 shadow-lg scale-105" : "hover:border-foreground/20"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <Link
            to={`/portal/crm/deals/${deal.id}`}
            className="font-medium text-sm hover:underline truncate block"
          >
            {deal.property_address}
          </Link>
          
          {deal.contact && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <User className="h-3 w-3" />
              <span className="truncate">{deal.contact.full_name}</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 gap-2">
            {deal.value && (
              <div className="flex items-center gap-1 text-xs font-medium">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                {formatFullCurrency(deal.value)}
              </div>
            )}
            {deal.expected_close && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(deal.expected_close)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <Badge
              variant="outline"
              className={cn("text-xs border", priorityColors[deal.priority || "medium"])}
            >
              {deal.priority || "Medium"}
            </Badge>
            <span className="text-xs text-muted-foreground">{deal.probability}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Static Deal Card for DragOverlay
const DealCard = ({ deal }: { deal: CRMDeal }) => (
  <div className="bg-background border border-primary/50 rounded-lg p-3 shadow-lg">
    <div className="flex items-start gap-2">
      <GripVertical className="h-4 w-4 mt-1 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{deal.property_address}</div>
        {deal.contact && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <User className="h-3 w-3" />
            <span className="truncate">{deal.contact.full_name}</span>
          </div>
        )}
        {deal.value && (
          <div className="flex items-center gap-1 text-xs font-medium mt-2">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            {formatFullCurrency(deal.value)}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Stage Column
const StageColumn = ({
  stage,
  deals,
  totalValue,
}: {
  stage: CRMDealStage;
  deals: CRMDeal[];
  totalValue: number;
}) => {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] h-full">
      {/* Column Header */}
      <div className="px-3 py-2 rounded-t-lg border-b-2" style={{ borderColor: stage.color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <span className="font-medium text-sm">{stage.name}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {deals.length}
          </Badge>
        </div>
        {totalValue > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {formatFullCurrency(totalValue)}
          </div>
        )}
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-2 space-y-2 bg-muted/20 rounded-b-lg overflow-y-auto max-h-[calc(100vh-320px)]">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No deals
          </div>
        )}
      </div>
    </div>
  );
};

export const CRMKanban = ({ deals, stages, onStageChange }: CRMKanbanProps) => {
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeDeal = activeDealId ? deals.find((d) => d.id === activeDealId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDealId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDealId(null);

    if (!over) return;

    const dealId = active.id as string;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    // Check if dropped over a stage column or another deal
    const overId = over.id as string;
    
    // Find target stage - could be a stage column or a deal in that column
    let targetStageId: string | null = null;
    
    // Check if overId is a stage
    const overStage = stages.find((s) => s.id === overId);
    if (overStage) {
      targetStageId = overStage.id;
    } else {
      // overId is a deal, find its stage
      const overDeal = deals.find((d) => d.id === overId);
      if (overDeal?.stage_id) {
        targetStageId = overDeal.stage_id;
      }
    }

    if (targetStageId && targetStageId !== deal.stage_id) {
      onStageChange(dealId, targetStageId);
    }
  };

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((d) => d.stage_id === stage.id);
    return acc;
  }, {} as Record<string, CRMDeal[]>);

  // Calculate total value per stage
  const valueByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = dealsByStage[stage.id]?.reduce((sum, d) => sum + (d.value || 0), 0) || 0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {stages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            totalValue={valueByStage[stage.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CRMKanban;

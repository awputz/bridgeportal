import { Link } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
import { useCRMDeals, useDealStages } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { SPACING, COMPONENT_CLASSES } from "@/lib/spacing";

export const DealPipelinePreview = () => {
  const { division } = useDivision();
  const { data: deals, isLoading: dealsLoading, error: dealsError, refetch: refetchDeals } = useCRMDeals(division);
  const { data: stages, isLoading: stagesLoading, error: stagesError, refetch: refetchStages } = useDealStages(division);

  const isLoading = dealsLoading || stagesLoading;
  const error = dealsError || stagesError;

  // Count deals by stage with null safety
  const stageCounts = stages?.map((stage) => ({
    ...stage,
    count: deals?.filter((deal) => deal?.stage_id === stage?.id)?.length || 0,
  })) || [];

  const totalDeals = deals?.length || 0;

  if (error) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <QueryErrorState 
          error={error}
          onRetry={() => { refetchDeals(); refetchStages(); }}
          compact
          title="Failed to load pipeline"
        />
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-light text-muted-foreground flex items-center gap-3">
          <Briefcase className="h-4 w-4" />
          Deal Pipeline
        </h3>
        <Link
          to="/portal/crm"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {totalDeals === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No active deals</p>
          <Link
            to="/portal/crm"
            className="text-sm text-foreground hover:underline mt-2 inline-block"
          >
            Create your first deal →
          </Link>
        </div>
      ) : (
        <>
          {/* Pipeline bar visualization */}
          <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-3">
            {stageCounts.map((stage) => {
              const width = totalDeals > 0 ? ((stage?.count || 0) / totalDeals) * 100 : 0;
              return (
                <div
                  key={stage?.id || Math.random()}
                  className={cn("transition-all", width === 0 && "hidden")}
                  style={{
                    width: `${width}%`,
                    backgroundColor: stage?.color || "#888",
                  }}
                  title={`${stage?.name || "Unknown"}: ${stage?.count || 0}`}
                />
              );
            })}
          </div>

          {/* Stage labels */}
          <div className="flex flex-wrap gap-2">
            {stageCounts.slice(0, 4).map((stage) => (
              <div
                key={stage?.id || Math.random()}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stage?.color || "#888" }}
                />
                <span>{stage?.name || "Unknown"}</span>
                <span className="text-foreground font-medium">{stage?.count || 0}</span>
              </div>
            ))}
            {stageCounts.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{stageCounts.length - 4} more
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

import { TrendingUp, Users, CheckCircle2, DollarSign } from "lucide-react";
import { useAgentDashboardStats } from "@/hooks/useAgentDashboardStats";
import { useCRMStats } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { SPACING, COMPONENT_CLASSES } from "@/lib/spacing";

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export const DashboardStats = () => {
  const { division } = useDivision();
  
  // Primary: Use materialized view for fast loading
  const { data: matViewStats, isLoading: isLoadingMatView, error: matViewError, refetch: refetchMatView } = useAgentDashboardStats();
  
  // Fallback: Use regular CRM stats if materialized view is unavailable
  const { data: crmStats, isLoading: isLoadingCRM, error: crmError, refetch: refetchCRM } = useCRMStats(division);

  // If both queries failed, show error state
  if (matViewError && crmError) {
    return (
      <div className="stat-grid">
        <div className="col-span-full">
          <QueryErrorState 
            error={matViewError}
            onRetry={() => { refetchMatView(); refetchCRM(); }}
            compact
            title="Failed to load stats"
          />
        </div>
      </div>
    );
  }

  // Prefer materialized view data, fallback to regular CRM stats
  const stats = matViewStats ? {
    activeDeals: matViewStats.active_deals,
    pipelineValue: matViewStats.pipeline_value,
    totalContacts: matViewStats.total_contacts,
    todaysTasks: matViewStats.upcoming_tasks,
  } : crmStats ? {
    activeDeals: crmStats.activeDeals,
    pipelineValue: crmStats.pipelineValue,
    totalContacts: crmStats.totalContacts,
    todaysTasks: crmStats.todaysTasks,
  } : null;

  const isLoading = isLoadingMatView && isLoadingCRM;

  const statCards = [
    {
      label: "Active Deals",
      value: stats?.activeDeals || 0,
      icon: TrendingUp,
      color: "#8b5cf6",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(stats?.pipelineValue || 0),
      icon: DollarSign,
      color: "#22c55e",
    },
    {
      label: "Total Contacts",
      value: stats?.totalContacts || 0,
      icon: Users,
      color: "#3b82f6",
    },
    {
      label: "Tasks Today",
      value: stats?.todaysTasks || 0,
      icon: CheckCircle2,
      color: "#f59e0b",
    },
  ];

  if (isLoading) {
    return (
      <div className="stat-grid">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="stat-grid">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass-card p-4 flex flex-col justify-between min-h-[88px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground font-light leading-none">
                {stat.label}
              </span>
              <Icon className="h-4 w-4 flex-shrink-0" style={{ color: stat.color }} />
            </div>
            <span className="text-2xl font-light text-foreground leading-tight">
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

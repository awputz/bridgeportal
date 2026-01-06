import { TrendingUp, Users, CheckCircle2, DollarSign } from "lucide-react";
import { useCRMStats } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: stats, isLoading } = useCRMStats(division);

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
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-light">
                {stat.label}
              </span>
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
            </div>
            <span className="text-2xl font-light text-foreground">
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

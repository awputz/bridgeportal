import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Building2 } from "lucide-react";
import { useProductionSummary } from "@/hooks/hr/useAgentProduction";
import { formatFullCurrency } from "@/lib/formatters";
import { AgentLeaderboard } from "@/components/hr/performance/AgentLeaderboard";
import { ProductionTrendChart } from "@/components/hr/performance/ProductionTrendChart";
import { DivisionComparisonChart } from "@/components/hr/performance/DivisionComparisonChart";

export default function HRPerformancePage() {
  const { data: summary, isLoading } = useProductionSummary();

  // Calculate aggregate metrics
  const metrics = {
    totalAgents: summary?.length || 0,
    totalVolume: summary?.reduce((sum, a) => sum + (a.total_volume || 0), 0) || 0,
    totalCommission: summary?.reduce((sum, a) => sum + (a.total_commission || 0), 0) || 0,
    totalDeals: summary?.reduce((sum, a) => sum + (a.total_deals || 0), 0) || 0,
    avgPerAgent: summary?.length
      ? (summary.reduce((sum, a) => sum + (a.total_volume || 0), 0) / summary.length)
      : 0,
  };

  const statCards = [
    {
      label: "Active Agents",
      value: metrics.totalAgents.toString(),
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Total Volume",
      value: formatFullCurrency(metrics.totalVolume),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Commission",
      value: formatFullCurrency(metrics.totalCommission),
      icon: DollarSign,
      color: "text-purple-400",
    },
    {
      label: "Total Deals",
      value: metrics.totalDeals.toString(),
      icon: Building2,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground">Track agent production and team performance</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-light mt-1">
                      {isLoading ? (
                        <span className="animate-pulse bg-muted rounded w-20 h-8 inline-block" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionTrendChart />
        <DivisionComparisonChart />
      </div>

      {/* Leaderboard */}
      <AgentLeaderboard />
    </div>
  );
}

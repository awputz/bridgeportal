import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  UserPlus,
  Briefcase,
  Download,
  RefreshCw,
} from "lucide-react";
import { useActiveAgents, useActiveAgentStats } from "@/hooks/hr/useActiveAgents";
import { useProductionSummary, useRefreshProductionSummary } from "@/hooks/hr/useAgentProduction";
import { useHRAgents } from "@/hooks/hr/useHRAgents.tsx";
import { useContracts } from "@/hooks/hr/useContracts";
import { useHROffers } from "@/hooks/hr/useHROffers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from "date-fns";

const DIVISION_COLORS = {
  "investment-sales": "#8b5cf6",
  "commercial-leasing": "#3b82f6",
  "residential": "#10b981",
  "capital-advisory": "#f59e0b",
};

export default function ExecutiveSummaryPage() {
  const { data: activeAgents, isLoading: loadingAgents } = useActiveAgents();
  const { data: stats } = useActiveAgentStats();
  const { data: production, isLoading: loadingProduction } = useProductionSummary();
  const { data: hrAgents } = useHRAgents();
  const { data: contracts } = useContracts();
  const { data: offers } = useHROffers();
  const refreshProduction = useRefreshProductionSummary();

  const isLoading = loadingAgents || loadingProduction;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!activeAgents || !production || !hrAgents || !contracts || !offers) {
      return null;
    }

    const now = new Date();
    const thirtyDaysAgo = subMonths(now, 1);
    const ninetyDaysAgo = subMonths(now, 3);

    // Headcount
    const totalHeadcount = activeAgents.filter(a => a.status === "active").length;
    
    // New hires this month
    const newHiresThisMonth = activeAgents.filter(a => {
      const hireDate = new Date(a.hire_date);
      return isWithinInterval(hireDate, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    }).length;

    // Pipeline health - candidates in active stages
    const activePipeline = hrAgents.filter(a => 
      ["contacted", "warm", "qualified", "hot", "offer-made"].includes(a.recruitment_status)
    ).length;

    // Average time to hire (from first contact to hire)
    const hiredAgents = hrAgents.filter(a => a.recruitment_status === "hired");
    const avgTimeToHire = hiredAgents.length > 0
      ? hiredAgents.reduce((acc, agent) => {
          const created = new Date(agent.created_at);
          const lastContact = agent.last_contacted_at ? new Date(agent.last_contacted_at) : now;
          return acc + differenceInDays(lastContact, created);
        }, 0) / hiredAgents.length
      : 0;

    // Total production
    const totalVolume = production.reduce((acc, p) => acc + (p.total_volume || 0), 0);
    const totalCommission = production.reduce((acc, p) => acc + (p.total_commission || 0), 0);
    const totalDeals = production.reduce((acc, p) => acc + (p.total_deals || 0), 0);

    // Avg commission per agent
    const avgCommissionPerAgent = totalHeadcount > 0 ? totalCommission / totalHeadcount : 0;

    // Offer acceptance rate
    const sentOffers = offers.filter(o => o.sent_at).length;
    const signedOffers = offers.filter(o => o.signed_at).length;
    const acceptanceRate = sentOffers > 0 ? (signedOffers / sentOffers) * 100 : 0;

    // Division breakdown
    const divisionBreakdown = Object.entries(
      activeAgents.reduce((acc, agent) => {
        acc[agent.division] = (acc[agent.division] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([division, count]) => ({
      name: formatDivision(division),
      value: count,
      color: DIVISION_COLORS[division as keyof typeof DIVISION_COLORS] || "#6b7280",
    }));

    // Monthly hiring trend (last 6 months)
    const hiringTrend = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const hires = activeAgents.filter(a => {
        const hireDate = new Date(a.hire_date);
        return isWithinInterval(hireDate, { start: monthStart, end: monthEnd });
      }).length;

      return {
        month: format(month, "MMM"),
        hires,
      };
    });

    // Top performers
    const topPerformers = [...production]
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, 5);

    return {
      totalHeadcount,
      newHiresThisMonth,
      activePipeline,
      avgTimeToHire: Math.round(avgTimeToHire),
      totalVolume,
      totalCommission,
      totalDeals,
      avgCommissionPerAgent,
      acceptanceRate,
      divisionBreakdown,
      hiringTrend,
      topPerformers,
    };
  }, [activeAgents, production, hrAgents, contracts, offers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Executive Summary</h1>
          <p className="text-sm text-muted-foreground">
            High-level HR metrics and performance overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshProduction.mutate()}
            disabled={refreshProduction.isPending}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshProduction.isPending ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Headcount"
          value={metrics?.totalHeadcount || 0}
          icon={Users}
          loading={isLoading}
          subtitle="Active agents"
          color="emerald"
        />
        <MetricCard
          title="New Hires"
          value={metrics?.newHiresThisMonth || 0}
          icon={UserPlus}
          loading={isLoading}
          subtitle="This month"
          color="blue"
        />
        <MetricCard
          title="Pipeline"
          value={metrics?.activePipeline || 0}
          icon={Briefcase}
          loading={isLoading}
          subtitle="Active candidates"
          color="purple"
        />
        <MetricCard
          title="Avg Time to Hire"
          value={`${metrics?.avgTimeToHire || 0}d`}
          icon={Clock}
          loading={isLoading}
          subtitle="Days from contact"
          color="amber"
        />
      </div>

      {/* Production & Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Volume"
          value={formatCurrency(metrics?.totalVolume || 0)}
          icon={DollarSign}
          loading={isLoading}
          subtitle={`${metrics?.totalDeals || 0} deals closed`}
          color="emerald"
          large
        />
        <MetricCard
          title="Total Commission"
          value={formatCurrency(metrics?.totalCommission || 0)}
          icon={TrendingUp}
          loading={isLoading}
          subtitle="Gross commission"
          color="blue"
          large
        />
        <MetricCard
          title="Avg per Agent"
          value={formatCurrency(metrics?.avgCommissionPerAgent || 0)}
          icon={Users}
          loading={isLoading}
          subtitle="Commission per agent"
          color="purple"
          large
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Division Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Division Breakdown</CardTitle>
            <CardDescription>Active agents by division</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics?.divisionBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {metrics?.divisionBreakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hiring Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Hiring Trend</CardTitle>
            <CardDescription>New hires over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.hiringTrend || []}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Performers</CardTitle>
            <CardDescription>By total production volume</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {metrics?.topPerformers?.map((agent, index) => (
                  <div key={agent.active_agent_id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{agent.full_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDivision(agent.division)}</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-400">
                      {formatCurrency(agent.total_volume)}
                    </span>
                  </div>
                ))}
                {(!metrics?.topPerformers || metrics.topPerformers.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No production data available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Offer Metrics</CardTitle>
            <CardDescription>Offer success rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <Skeleton className="h-[120px]" />
            ) : (
              <>
                <div className="text-center">
                  <p className="text-4xl font-light text-emerald-400">
                    {(metrics?.acceptanceRate || 0).toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Offer Acceptance Rate</p>
                </div>
                <Progress value={metrics?.acceptanceRate || 0} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Based on offers sent vs signed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  loading: boolean;
  subtitle?: string;
  color: "emerald" | "blue" | "purple" | "amber";
  large?: boolean;
}

function MetricCard({ title, value, icon: Icon, loading, subtitle, color, large }: MetricCardProps) {
  const colorClasses = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };

  return (
    <Card>
      <CardContent className={`pt-6 ${large ? "pb-6" : ""}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className={`${large ? "h-10 w-32" : "h-8 w-20"} mt-1`} />
            ) : (
              <p className={`${large ? "text-3xl" : "text-2xl"} font-semibold mt-1`}>{value}</p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helpers
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function formatDivision(division: string): string {
  const labels: Record<string, string> = {
    "investment-sales": "Investment Sales",
    "commercial-leasing": "Commercial Leasing",
    "residential": "Residential",
    "capital-advisory": "Capital Advisory",
  };
  return labels[division] || division;
}

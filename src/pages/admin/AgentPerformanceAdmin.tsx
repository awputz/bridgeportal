import { useAgentMetrics } from "@/hooks/useAgentMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  DollarSign,
  Target,
  Activity
} from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AgentPerformanceAdmin() {
  const { data: metrics, isLoading } = useAgentMetrics();

  // Calculate team totals
  const teamTotals = metrics?.reduce(
    (acc, agent) => ({
      totalDeals: acc.totalDeals + agent.deals_closed,
      totalPipeline: acc.totalPipeline + agent.pipeline_value,
      totalContacts: acc.totalContacts + agent.contacts_count,
      avgCompletionRate: acc.avgCompletionRate + agent.completion_rate,
    }),
    { totalDeals: 0, totalPipeline: 0, totalContacts: 0, avgCompletionRate: 0 }
  );

  const avgCompletion = metrics?.length 
    ? Math.round((teamTotals?.avgCompletionRate || 0) / metrics.length) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Performance</h1>
        <p className="text-muted-foreground mt-1">
          Track agent metrics and team performance
        </p>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deals Closed
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{teamTotals?.totalDeals || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pipeline
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(teamTotals?.totalPipeline || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{teamTotals?.totalContacts || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Completion Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{avgCompletion}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : metrics?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No agent data available
          </div>
        ) : (
          metrics?.map((agent) => (
            <Card key={agent.agent_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{agent.agent_email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deals */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Deals Closed</span>
                  </div>
                  <span className="font-semibold">{agent.deals_closed}</span>
                </div>

                {/* Active Deals */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Active Deals</span>
                  </div>
                  <span className="font-semibold">{agent.deals_active}</span>
                </div>

                {/* Pipeline Value */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">Pipeline Value</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(agent.pipeline_value)}</span>
                </div>

                {/* Contacts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Total Contacts</span>
                  </div>
                  <span className="font-semibold">
                    {agent.contacts_count}
                    {agent.contacts_added_30d > 0 && (
                      <span className="text-xs text-green-600 ml-1">
                        (+{agent.contacts_added_30d})
                      </span>
                    )}
                  </span>
                </div>

                {/* Activity Completion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Activity Completion</span>
                    <span className="font-medium">{agent.completion_rate}%</span>
                  </div>
                  <Progress value={agent.completion_rate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {agent.activities_completed} of {agent.activities_total} completed
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

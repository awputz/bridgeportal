import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useDivision } from "@/contexts/DivisionContext";
import { usePipelineAnalytics, useDealMetrics, useCommissionForecast, useActivityMetrics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const Analytics = () => {
  const { division } = useDivision();
  const { data: pipelineData, isLoading: pipelineLoading } = usePipelineAnalytics(division);
  const { data: metrics, isLoading: metricsLoading } = useDealMetrics(division);
  const { data: forecast, isLoading: forecastLoading } = useCommissionForecast();
  const { data: activityMetrics, isLoading: activityLoading } = useActivityMetrics();

  const isLoading = pipelineLoading || metricsLoading || forecastLoading || activityLoading;

  // Prepare chart data
  const pipelineChartData = pipelineData?.map((stage) => ({
    name: stage.stage_name,
    deals: stage.count,
    value: stage.value,
    fill: stage.stage_color,
  })) || [];

  const totalPipelineValue = pipelineData?.reduce((sum, s) => sum + s.value, 0) || 0;

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground font-light">
            Track your performance and pipeline health
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-light">Active Deals</span>
                  </div>
                  <p className="text-3xl font-light text-foreground">{metrics?.totalDeals || 0}</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-light">Pipeline Value</span>
                  </div>
                  <p className="text-3xl font-light text-foreground">{formatCurrency(metrics?.totalValue || 0)}</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-light">Win Rate</span>
                  </div>
                  <p className="text-3xl font-light text-foreground">{metrics?.winRate || 0}%</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-light">Avg Cycle Time</span>
                  </div>
                  <p className="text-3xl font-light text-foreground">{metrics?.avgCycleTime || 0} days</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pipeline Funnel */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <BarChart3 className="h-5 w-5" />
                Pipeline by Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineLoading ? (
                <Skeleton className="h-64" />
              ) : pipelineChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No deals in pipeline
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={pipelineChartData} layout="vertical">
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "deals" ? `${value} deals` : formatCurrency(value),
                        name === "deals" ? "Count" : "Value"
                      ]}
                    />
                    <Bar dataKey="deals" radius={[0, 4, 4, 0]}>
                      {pipelineChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Value Distribution */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <PieChart className="h-5 w-5" />
                Value Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineLoading ? (
                <Skeleton className="h-64" />
              ) : pipelineChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No deals in pipeline
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPie>
                      <Pie
                        data={pipelineChartData.filter(d => d.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        labelLine={false}
                      >
                        {pipelineChartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Commission Forecast */}
        <Card className="glass-card border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-light">
              <TrendingUp className="h-5 w-5" />
              Commission Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forecastLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                    name="Projected"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(142.1 76.2% 36.3%)" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(142.1 76.2% 36.3%)" }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <Activity className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityLoading ? (
                <Skeleton className="h-32" />
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Activities This Week</span>
                      <span className="text-foreground">{activityMetrics?.activitiesThisWeek || 0}</span>
                    </div>
                    <Progress value={Math.min((activityMetrics?.activitiesThisWeek || 0) * 10, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Completed This Week</span>
                      <span className="text-foreground">{activityMetrics?.completedThisWeek || 0}</span>
                    </div>
                    <Progress value={Math.min((activityMetrics?.completedThisWeek || 0) * 10, 100)} className="h-2 [&>div]:bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Avg Per Day</span>
                      <span className="text-foreground">{activityMetrics?.avgPerDay || 0}</span>
                    </div>
                    <Progress value={Math.min((activityMetrics?.avgPerDay || 0) * 20, 100)} className="h-2 [&>div]:bg-blue-500" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-light">
                <Award className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metricsLoading ? (
                <Skeleton className="h-32" />
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-muted-foreground">Average Deal Size</span>
                    <span className="text-lg font-light text-foreground">{formatCurrency(metrics?.avgDealSize || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-muted-foreground">Deals Won</span>
                    <span className="text-lg font-light text-green-400">{metrics?.wonDeals || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-muted-foreground">Deals Lost</span>
                    <span className="text-lg font-light text-red-400">{metrics?.lostDeals || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

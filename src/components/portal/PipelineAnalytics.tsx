import { useMemo } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Funnel,
  FunnelChart,
  LabelList
} from "recharts";
import { CRMDeal, CRMDealStage } from "@/hooks/useCRM";
import { formatFullCurrency } from "@/lib/formatters";

interface PipelineAnalyticsProps {
  deals: CRMDeal[];
  stages: CRMDealStage[];
  division: string;
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const PipelineAnalytics = ({ deals, stages, division }: PipelineAnalyticsProps) => {
  const analytics = useMemo(() => {
    // Basic stats
    const totalDeals = deals.length;
    const totalPipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const totalCommission = deals.reduce((sum, d) => sum + (d.commission || 0), 0);
    const avgDealSize = totalDeals > 0 ? totalPipelineValue / totalDeals : 0;
    const avgProbability = totalDeals > 0 
      ? deals.reduce((sum, d) => sum + (d.probability || 0), 0) / totalDeals 
      : 0;
    
    // Weighted pipeline value
    const weightedPipelineValue = deals.reduce(
      (sum, d) => sum + (d.value || 0) * ((d.probability || 50) / 100),
      0
    );

    // Deals by stage
    const dealsByStage = stages.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage_id === stage.id);
      return {
        name: stage.name,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + (d.value || 0), 0),
        fill: stage.color,
      };
    }).filter((s) => s.count > 0);

    // Deals by priority
    const dealsByPriority = [
      { name: "High", value: deals.filter((d) => d.priority === "high").length, fill: "#ef4444" },
      { name: "Medium", value: deals.filter((d) => d.priority === "medium").length, fill: "#f59e0b" },
      { name: "Low", value: deals.filter((d) => d.priority === "low").length, fill: "#22c55e" },
    ].filter((p) => p.value > 0);

    // Deals by deal type
    const dealTypeMap: Record<string, number> = {};
    deals.forEach((d) => {
      const type = d.deal_type || "Other";
      dealTypeMap[type] = (dealTypeMap[type] || 0) + 1;
    });
    const dealsByType = Object.entries(dealTypeMap).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace("-", " "),
      value,
      fill: COLORS[i % COLORS.length],
    }));

    // Deals closing this week/month
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const closingThisWeek = deals.filter((d) => {
      if (!d.expected_close) return false;
      const close = new Date(d.expected_close);
      return close >= today && close <= nextWeek;
    });

    const closingThisMonth = deals.filter((d) => {
      if (!d.expected_close) return false;
      const close = new Date(d.expected_close);
      return close >= today && close <= nextMonth;
    });

    // Commission forecast
    const commissionForecast = weightedPipelineValue * 0.03; // Assuming 3% average commission

    return {
      totalDeals,
      totalPipelineValue,
      totalCommission,
      avgDealSize,
      avgProbability,
      weightedPipelineValue,
      dealsByStage,
      dealsByPriority,
      dealsByType,
      closingThisWeek,
      closingThisMonth,
      commissionForecast,
    };
  }, [deals, stages]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="h-4 w-4" />
              Pipeline Value
            </div>
            <div className="text-2xl font-light">{formatValue(analytics.totalPipelineValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Weighted: {formatValue(analytics.weightedPipelineValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              Commission Forecast
            </div>
            <div className="text-2xl font-light">{formatValue(analytics.totalCommission || analytics.commissionForecast)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.totalDeals} active deals
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="h-4 w-4" />
              Avg Deal Size
            </div>
            <div className="text-2xl font-light">{formatValue(analytics.avgDealSize)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.avgProbability.toFixed(0)}% avg probability
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" />
              Closing Soon
            </div>
            <div className="text-2xl font-light">{analytics.closingThisWeek.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.closingThisMonth.length} this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-light">
              <BarChart3 className="h-4 w-4" />
              Pipeline by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dealsByStage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80} 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "value" ? formatValue(value) : value,
                      name === "value" ? "Value" : "Deals",
                    ]}
                  />
                  <Bar dataKey="count" name="Deals" radius={[0, 4, 4, 0]}>
                    {analytics.dealsByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Distribution */}
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-light">
              <PieChartIcon className="h-4 w-4" />
              Deal Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.dealsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {analytics.dealsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Breakdown */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-light">Priority Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.dealsByPriority.map((priority) => {
              const percentage = analytics.totalDeals > 0 
                ? Math.round((priority.value / analytics.totalDeals) * 100) 
                : 0;
              return (
                <div key={priority.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: priority.fill }}
                      />
                      <span>{priority.name} Priority</span>
                    </div>
                    <span className="text-muted-foreground">
                      {priority.value} deals ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Closing Soon List */}
      {analytics.closingThisWeek.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-light">
              <Clock className="h-4 w-4 text-orange-500" />
              Closing This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.closingThisWeek.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{deal.property_address}</div>
                    {deal.contact && (
                      <div className="text-xs text-muted-foreground">{deal.contact.full_name}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {deal.value && (
                      <Badge variant="secondary">{formatValue(deal.value)}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {deal.expected_close && new Date(deal.expected_close).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PipelineAnalytics;

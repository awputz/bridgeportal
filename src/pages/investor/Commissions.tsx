import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommissionInsights, useMonthlyTrends } from "@/hooks/useInvestorData";
import { DollarSign, TrendingUp, PieChart, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(199, 89%, 48%)', 'hsl(173, 58%, 39%)', 'hsl(220, 70%, 50%)', 'hsl(280, 65%, 60%)'];

const Commissions = () => {
  const { data: insights, isLoading: loadingInsights } = useCommissionInsights();
  const { data: monthlyData, isLoading: loadingMonthly } = useMonthlyTrends(12);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (loadingInsights || loadingMonthly) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const commissionTrend = monthlyData?.map(m => ({
    month: m.month,
    commission: m.commission / 1000, // Convert to thousands
  })) || [];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-light text-foreground">Commission Insights</h1>
        <p className="text-muted-foreground mt-1">Financial performance and commission analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Commissions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(insights?.totalCommissions || 0)}</div>
            <p className="text-xs text-muted-foreground">All-time total</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              YTD Commissions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(insights?.ytdCommissions || 0)}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Average Commission
            </CardTitle>
            <PieChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(insights?.avgCommission || 0)}</div>
            <p className="text-xs text-muted-foreground">Per deal</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Top Earners
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <div className="text-lg md:text-2xl font-bold">{insights?.topEarners?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Agents tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg font-medium">Monthly Commission Trend</CardTitle>
            <CardDescription>Commission earned over 12 months (thousands)</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commissionTrend} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `$${value}K`}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(1)}K`, 'Commission']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commission" 
                    stroke="hsl(199, 89%, 48%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(199, 89%, 48%)', strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, stroke: 'hsl(199, 89%, 48%)', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Division Breakdown */}
        <Card className="border-border/50">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg font-medium">By Division</CardTitle>
            <CardDescription>Commission distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={insights?.byDivision || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="commission"
                    nameKey="name"
                  >
                    {insights?.byDivision?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Commission']}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {insights?.byDivision?.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.commission)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earners */}
      <Card className="border-border/50">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg font-medium">Top Earners</CardTitle>
          <CardDescription>Agents ranked by total commission earned</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-3">
            {insights?.topEarners?.slice(0, 10).map((agent, index) => (
              <div
                key={agent.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-400/10 text-sky-400 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">{agent.name}</span>
                </div>
                <span className="text-lg font-bold text-green-500">{formatCurrency(agent.commission)}</span>
              </div>
            ))}
            {(!insights?.topEarners || insights.topEarners.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No commission data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;

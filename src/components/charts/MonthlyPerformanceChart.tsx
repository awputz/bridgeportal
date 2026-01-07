import { useMonthlyPerformance } from '@/hooks/useMonthlyPerformance';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

interface MonthlyPerformanceChartProps {
  agentId?: string;
  division?: string;
  height?: number;
}

export function MonthlyPerformanceChart({ 
  agentId, 
  division,
  height = 200 
}: MonthlyPerformanceChartProps) {
  const { data: performance, isLoading } = useMonthlyPerformance(agentId, division);

  if (isLoading) {
    return <Skeleton className="w-full" style={{ height }} />;
  }

  if (!performance || performance.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        <TrendingUp className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No performance data yet</p>
      </div>
    );
  }

  const chartData = [...performance]
    .reverse()
    .map(p => ({
      month: format(new Date(p.month), 'MMM'),
      deals: p.deals_created,
      won: p.deals_won,
      revenue: p.revenue / 1000, // Convert to K for display
    }));

  const formatCurrency = (value: number) => `$${value.toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          className="fill-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          className="fill-muted-foreground"
          tickFormatter={formatCurrency}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number, name: string) => {
            if (name === 'revenue') return [`$${(value * 1000).toLocaleString()}`, 'Revenue'];
            if (name === 'won') return [value, 'Deals Won'];
            return [value, 'Deals Created'];
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          fill="url(#colorRevenue)"
        />
        <Area
          type="monotone"
          dataKey="won"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#colorWon)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

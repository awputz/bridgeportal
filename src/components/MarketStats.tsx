import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, DollarSign, Clock } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  sales: {
    label: "Sales Volume",
    color: "hsl(var(--accent))",
  },
  count: {
    label: "Number of Deals",
    color: "hsl(var(--primary))",
  },
};

export const MarketStats = () => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['market-stats'],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;

      // Get transactions by borough
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('borough, sale_price, deal_type, asset_type, closing_date, price_per_unit')
        .gte('year', lastYear);

      if (error) throw error;

      // Calculate stats by borough
      const boroughStats = transactions?.reduce((acc: any, t) => {
        if (!t.borough) return acc;
        
        if (!acc[t.borough]) {
          acc[t.borough] = { sales: 0, count: 0, avgPricePerUnit: 0, totalUnits: 0 };
        }
        
        if (t.deal_type === 'Sale' && t.sale_price) {
          acc[t.borough].sales += Number(t.sale_price);
          acc[t.borough].count += 1;
          
          if (t.price_per_unit) {
            acc[t.borough].avgPricePerUnit += Number(t.price_per_unit);
            acc[t.borough].totalUnits += 1;
          }
        }
        
        return acc;
      }, {});

      // Format for chart
      const chartData = Object.entries(boroughStats || {}).map(([borough, stats]: [string, any]) => ({
        borough,
        sales: Math.round(stats.sales / 1000000), // Convert to millions
        count: stats.count,
        avgPricePerUnit: stats.totalUnits > 0 
          ? Math.round(stats.avgPricePerUnit / stats.totalUnits) 
          : 0,
      }));

      // Calculate overall metrics
      const totalVolume = Object.values(boroughStats || {}).reduce((sum: number, s: any) => sum + (Number(s.sales) || 0), 0);
      const totalDeals = Object.values(boroughStats || {}).reduce((sum: number, s: any) => sum + (Number(s.count) || 0), 0);
      const avgDealSize = Number(totalDeals) > 0 ? Number(totalVolume) / Number(totalDeals) : 0;

      return {
        chartData,
        totalVolume,
        totalDeals,
        avgDealSize,
      };
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading market data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Total Volume (12mo)</span>
              </div>
              <p className="text-2xl font-light">
                {marketData ? `$${(Number(marketData.totalVolume) / 1000000).toFixed(1)}M` : '$0'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Deals Closed</span>
              </div>
              <p className="text-2xl font-light">{Number(marketData?.totalDeals) || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Avg. Deal Size</span>
              </div>
              <p className="text-2xl font-light">
                {marketData ? formatCurrency(marketData.avgDealSize) : '$0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Borough Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Borough</CardTitle>
          <CardDescription>Transaction volume over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          {marketData?.chartData && marketData.chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData.chartData}>
                  <XAxis 
                    dataKey="borough" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="sales" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                    name="Sales Volume ($M)"
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Number of Deals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transaction data available for the last 12 months
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

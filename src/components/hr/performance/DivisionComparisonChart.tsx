import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { useProductionSummary } from "@/hooks/hr/useAgentProduction";
import { useMemo } from "react";

const chartConfig = {
  volume: {
    label: "Total Volume",
    color: "hsl(160, 84%, 39%)",
  },
};

const divisionLabels: Record<string, string> = {
  residential: "Residential",
  "commercial-leasing": "Commercial",
  "investment-sales": "Investment Sales",
};

const divisionColors: Record<string, string> = {
  residential: "hsl(217, 91%, 60%)",
  "commercial-leasing": "hsl(280, 80%, 60%)",
  "investment-sales": "hsl(160, 84%, 39%)",
};

export function DivisionComparisonChart() {
  const { data: summary, isLoading } = useProductionSummary();

  const chartData = useMemo(() => {
    if (!summary) return [];

    const divisionStats: Record<string, { volume: number; agents: number; deals: number }> = {};

    summary.forEach((agent) => {
      if (!divisionStats[agent.division]) {
        divisionStats[agent.division] = { volume: 0, agents: 0, deals: 0 };
      }
      divisionStats[agent.division].volume += agent.total_volume;
      divisionStats[agent.division].agents += 1;
      divisionStats[agent.division].deals += agent.total_deals;
    });

    return Object.entries(divisionStats).map(([division, stats]) => ({
      division,
      name: divisionLabels[division] || division,
      volume: Math.round(stats.volume / 1000000 * 100) / 100,
      agents: stats.agents,
      deals: stats.deals,
      avgPerAgent: stats.agents > 0 ? Math.round(stats.volume / stats.agents / 1000000 * 100) / 100 : 0,
      color: divisionColors[division] || "hsl(0, 0%, 50%)",
    }));
  }, [summary]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-light">Division Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] bg-muted/50 rounded animate-pulse" />
        ) : !chartData.length ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} layout="vertical">
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const data = props.payload;
                      return (
                        <div className="space-y-1">
                          <p className="font-medium">${Number(value).toFixed(2)}M total</p>
                          <p className="text-xs text-muted-foreground">
                            {data.agents} agents · {data.deals} deals
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${data.avgPerAgent}M avg/agent
                          </p>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

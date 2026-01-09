import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useProductionSummary } from "@/hooks/hr/useAgentProduction";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const chartConfig = {
  residential: {
    label: "Residential",
    color: "hsl(217, 91%, 60%)",
  },
  commercial: {
    label: "Commercial",
    color: "hsl(280, 80%, 60%)",
  },
  investment: {
    label: "Investment Sales",
    color: "hsl(160, 84%, 39%)",
  },
};

export function ProductionTrendChart() {
  const { data: transactions, isLoading } = useTransactions(undefined, true);

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      months.push({
        month: format(monthDate, "MMM"),
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
        residential: 0,
        commercial: 0,
        investment: 0,
      });
    }

    transactions.forEach((tx) => {
      if (!tx.closing_date) return;
      const closingDate = new Date(tx.closing_date);
      const value = tx.sale_price || tx.total_lease_value || 0;

      months.forEach((month) => {
        if (isWithinInterval(closingDate, { start: month.start, end: month.end })) {
          if (tx.division === "residential" || tx.deal_type === "Residential Rental") {
            month.residential += value / 1000000;
          } else if (tx.division === "commercial-leasing" || tx.deal_type === "Commercial Lease") {
            month.commercial += value / 1000000;
          } else {
            month.investment += value / 1000000;
          }
        }
      });
    });

    return months.map((m) => ({
      month: m.month,
      residential: Math.round(m.residential * 100) / 100,
      commercial: Math.round(m.commercial * 100) / 100,
      investment: Math.round(m.investment * 100) / 100,
    }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-light">Production Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] bg-muted/50 rounded animate-pulse" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="residential" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commercial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="investment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `$${Number(value).toFixed(2)}M`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="residential"
                stroke="hsl(217, 91%, 60%)"
                fill="url(#residential)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="commercial"
                stroke="hsl(280, 80%, 60%)"
                fill="url(#commercial)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="hsl(160, 84%, 39%)"
                fill="url(#investment)"
                stackId="1"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

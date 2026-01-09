import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Building2, Calendar } from "lucide-react";
import { formatFullCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import type { ProductionSummary } from "@/hooks/hr/useAgentProduction";

interface ProductionSummaryCardProps {
  production: ProductionSummary | null;
  isLoading?: boolean;
}

export function ProductionSummaryCard({ production, isLoading }: ProductionSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Production Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!production) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Production Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No production data available</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Total Volume",
      value: formatFullCurrency(production.total_volume),
      subLabel: "All time",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Commission",
      value: formatFullCurrency(production.total_commission),
      subLabel: `${production.total_deals} deals`,
      icon: DollarSign,
      color: "text-blue-400",
    },
    {
      label: "Since Hire",
      value: formatFullCurrency(production.volume_since_hire),
      subLabel: `${production.deals_since_hire} deals`,
      icon: Building2,
      color: "text-purple-400",
    },
    {
      label: "Last Deal",
      value: production.last_deal_date
        ? format(new Date(production.last_deal_date), "MMM d, yyyy")
        : "No deals yet",
      subLabel: production.last_deal_date ? "Closing date" : "",
      icon: Calendar,
      color: "text-orange-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-light">Production Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="font-medium">{metric.value}</p>
                </div>
              </div>
              {metric.subLabel && (
                <span className="text-xs text-muted-foreground">{metric.subLabel}</span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'slate';
}

const colorStyles = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  slate: 'text-slate-400',
};

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon: Icon,
  color = 'emerald'
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-light text-muted-foreground">{title}</span>
          {Icon && <Icon className={cn("h-4 w-4", colorStyles[color])} />}
        </div>
        <div className="text-2xl font-light">{value}</div>
        {(subtitle || change !== undefined) && (
          <div className="flex items-center gap-2 mt-1">
            {change !== undefined && (
              <span className={cn(
                "flex items-center text-xs",
                isPositive && "text-emerald-400",
                isNegative && "text-red-400",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && <TrendingUp className="h-3 w-3 mr-0.5" />}
                {isNegative && <TrendingDown className="h-3 w-3 mr-0.5" />}
                {isPositive && "+"}
                {change}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
            {changeLabel && (
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

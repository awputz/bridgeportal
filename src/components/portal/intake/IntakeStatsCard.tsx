import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface IntakeStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning";
  isLoading?: boolean;
  suffix?: string;
}

const variantStyles = {
  default: {
    bg: "bg-gradient-to-br from-muted/50 to-muted/30",
    icon: "text-muted-foreground/50",
    border: "border-border/50",
  },
  primary: {
    bg: "bg-gradient-to-br from-primary/10 to-primary/5",
    icon: "text-primary/50",
    border: "border-primary/20",
  },
  success: {
    bg: "bg-gradient-to-br from-green-500/10 to-green-500/5",
    icon: "text-green-500/50",
    border: "border-green-500/20",
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-500/10 to-amber-500/5",
    icon: "text-amber-500/50",
    border: "border-amber-500/20",
  },
};

export function IntakeStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  isLoading = false,
  suffix,
}: IntakeStatsCardProps) {
  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className={cn("border", styles.border)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border overflow-hidden transition-all duration-200 hover:shadow-md", styles.border)}>
      <CardContent className={cn("p-6", styles.bg)}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}{suffix}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.value >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {trend.value >= 0 ? "+" : ""}{trend.value} {trend.label}
              </p>
            )}
          </div>
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            styles.bg
          )}>
            <Icon className={cn("h-7 w-7", styles.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

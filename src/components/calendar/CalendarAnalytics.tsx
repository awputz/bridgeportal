import { useMemo } from "react";
import {
  BarChart3,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useCalendarAnalytics } from "@/hooks/useCalendarAnalytics";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface CalendarAnalyticsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
}

const COLORS = ["#4285f4", "#0b8043", "#f6bf26", "#e67c73", "#8b5cf6"];

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CalendarAnalytics({
  open,
  onOpenChange,
  events,
}: CalendarAnalyticsProps) {
  const stats = useCalendarAnalytics(events);

  const dayChartData = useMemo(() => {
    return stats.dayOfWeekDistribution.map((d) => ({
      name: d.day.slice(0, 3),
      hours: d.totalHours,
      events: d.eventCount,
    }));
  }, [stats.dayOfWeekDistribution]);

  const typeChartData = useMemo(() => {
    return stats.byType.map((t, i) => ({
      name: t.type === "focus_time" ? "Focus Time" : t.type.charAt(0).toUpperCase() + t.type.slice(1),
      value: t.hours,
      color: COLORS[i % COLORS.length],
    }));
  }, [stats.byType]);

  // Focus time goal (target: 10 hours/week)
  const focusTimeGoal = 10;
  const focusTimeProgress = Math.min((stats.focusTimeHours / focusTimeGoal) * 100, 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gcal-blue" />
            Meeting Analytics
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">This Week</span>
              </div>
              <p className="text-2xl font-semibold">{stats.weeklyEvents}</p>
              <p className="text-xs text-muted-foreground">{stats.weeklyHours}h total</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Avg Duration</span>
              </div>
              <p className="text-2xl font-semibold">{stats.averageDuration}m</p>
              <p className="text-xs text-muted-foreground">per meeting</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">This Month</span>
              </div>
              <p className="text-2xl font-semibold">{stats.monthlyEvents}</p>
              <p className="text-xs text-muted-foreground">{stats.monthlyHours}h total</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Client Time</span>
              </div>
              <p className="text-2xl font-semibold">{stats.clientMeetingHours}h</p>
              <p className="text-xs text-muted-foreground">meetings</p>
            </div>
          </div>

          {/* Focus Time Goal */}
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Focus Time Goal</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.focusTimeHours}h / {focusTimeGoal}h
              </span>
            </div>
            <Progress value={focusTimeProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {focusTimeProgress >= 100
                ? "🎉 Goal achieved this week!"
                : `${(focusTimeGoal - stats.focusTimeHours).toFixed(1)}h remaining`}
            </p>
          </div>

          {/* Patterns */}
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <h3 className="text-sm font-medium mb-3">Patterns</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Busiest day</span>
                <span className="font-medium">
                  {stats.busiestDay?.day || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Most common start time</span>
                <span className="font-medium">{stats.mostCommonTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total events</span>
                <span className="font-medium">{stats.totalEvents}</span>
              </div>
            </div>
          </div>

          {/* Events by Day Chart */}
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <h3 className="text-sm font-medium mb-4">Hours by Day of Week</h3>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <BarChart data={dayChartData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hours"
                  fill="#4285f4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Time by Type Chart */}
          {typeChartData.length > 0 && (
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <h3 className="text-sm font-medium mb-4">Time by Event Type</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {typeChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">
                      {entry.name}: {entry.value}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

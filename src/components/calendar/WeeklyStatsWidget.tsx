import { Calendar, Clock, Target } from "lucide-react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useCalendarAnalytics } from "@/hooks/useCalendarAnalytics";

interface WeeklyStatsWidgetProps {
  events: CalendarEvent[];
}

export function WeeklyStatsWidget({ events }: WeeklyStatsWidgetProps) {
  const stats = useCalendarAnalytics(events);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-foreground">📊 This Week</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Events</span>
          </div>
          <span className="font-medium text-foreground">{stats.weeklyEvents}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>In meetings</span>
          </div>
          <span className="font-medium text-foreground">{stats.weeklyHours}h</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-purple-500" />
            <span>Focus time</span>
          </div>
          <span className="font-medium text-foreground">{stats.focusTimeHours}h</span>
        </div>
      </div>
    </div>
  );
}

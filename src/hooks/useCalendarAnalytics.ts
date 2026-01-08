import { useMemo } from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInMinutes,
  getDay,
  getHours,
  format,
  isWithinInterval,
} from "date-fns";

interface EventTypeStats {
  type: string;
  count: number;
  hours: number;
}

interface DayStats {
  day: string;
  dayIndex: number;
  eventCount: number;
  totalHours: number;
}

export interface CalendarStats {
  // Overview
  totalEvents: number;
  totalHours: number;
  averageDuration: number;
  
  // By type
  byType: EventTypeStats[];
  
  // Patterns
  busiestDay: DayStats | null;
  mostCommonTime: string;
  dayOfWeekDistribution: DayStats[];
  
  // Focus time
  focusTimeHours: number;
  clientMeetingHours: number;
  
  // Weekly summary
  weeklyEvents: number;
  weeklyHours: number;
  
  // Monthly summary  
  monthlyEvents: number;
  monthlyHours: number;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function useCalendarAnalytics(events: CalendarEvent[] = []) {
  const stats = useMemo((): CalendarStats => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Filter to valid events with times
    const validEvents = events.filter(
      (e) => e.start_time && !e.all_day
    );

    // Calculate duration for each event
    const eventsWithDuration = validEvents.map((event) => {
      const start = new Date(event.start_time);
      const end = event.end_time
        ? new Date(event.end_time)
        : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
      const durationMinutes = differenceInMinutes(end, start);
      return { ...event, durationMinutes, start, end };
    });

    // Total stats
    const totalEvents = eventsWithDuration.length;
    const totalMinutes = eventsWithDuration.reduce(
      (sum, e) => sum + e.durationMinutes,
      0
    );
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const averageDuration = totalEvents > 0 ? Math.round(totalMinutes / totalEvents) : 0;

    // By event type
    const typeMap = new Map<string, { count: number; minutes: number }>();
    eventsWithDuration.forEach((event) => {
      const type = event.event_type || "meeting";
      const existing = typeMap.get(type) || { count: 0, minutes: 0 };
      typeMap.set(type, {
        count: existing.count + 1,
        minutes: existing.minutes + event.durationMinutes,
      });
    });
    const byType: EventTypeStats[] = Array.from(typeMap.entries()).map(
      ([type, data]) => ({
        type,
        count: data.count,
        hours: Math.round((data.minutes / 60) * 10) / 10,
      })
    );

    // Day of week distribution
    const dayStats = DAY_NAMES.map((day, index) => ({
      day,
      dayIndex: index,
      eventCount: 0,
      totalHours: 0,
    }));
    eventsWithDuration.forEach((event) => {
      const dayIndex = getDay(event.start);
      dayStats[dayIndex].eventCount++;
      dayStats[dayIndex].totalHours += event.durationMinutes / 60;
    });
    dayStats.forEach((d) => {
      d.totalHours = Math.round(d.totalHours * 10) / 10;
    });

    // Busiest day
    const busiestDay = dayStats.reduce<DayStats | null>((max, current) => {
      if (!max || current.eventCount > max.eventCount) return current;
      return max;
    }, null);

    // Most common start hour
    const hourCounts = new Map<number, number>();
    eventsWithDuration.forEach((event) => {
      const hour = getHours(event.start);
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    let mostCommonHour = 9;
    let maxCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonHour = hour;
      }
    });
    const mostCommonTime = format(new Date().setHours(mostCommonHour, 0), "h:mm a");

    // Focus time hours
    const focusTimeHours = eventsWithDuration
      .filter((e) => e.event_type === "focus_time")
      .reduce((sum, e) => sum + e.durationMinutes / 60, 0);

    // Client meeting hours (non-focus, non-all-day)
    const clientMeetingHours = eventsWithDuration
      .filter((e) => e.event_type !== "focus_time")
      .reduce((sum, e) => sum + e.durationMinutes / 60, 0);

    // Weekly stats
    const weeklyEvents = eventsWithDuration.filter((e) =>
      isWithinInterval(e.start, { start: weekStart, end: weekEnd })
    );
    const weeklyHours = weeklyEvents.reduce(
      (sum, e) => sum + e.durationMinutes / 60,
      0
    );

    // Monthly stats
    const monthlyEventsArr = eventsWithDuration.filter((e) =>
      isWithinInterval(e.start, { start: monthStart, end: monthEnd })
    );
    const monthlyHours = monthlyEventsArr.reduce(
      (sum, e) => sum + e.durationMinutes / 60,
      0
    );

    return {
      totalEvents,
      totalHours,
      averageDuration,
      byType,
      busiestDay,
      mostCommonTime,
      dayOfWeekDistribution: dayStats,
      focusTimeHours: Math.round(focusTimeHours * 10) / 10,
      clientMeetingHours: Math.round(clientMeetingHours * 10) / 10,
      weeklyEvents: weeklyEvents.length,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      monthlyEvents: monthlyEventsArr.length,
      monthlyHours: Math.round(monthlyHours * 10) / 10,
    };
  }, [events]);

  return stats;
}

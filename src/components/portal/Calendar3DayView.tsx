import { useMemo, useRef, useEffect, useState } from "react";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  differenceInMinutes,
  addMinutes,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Calendar3DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  isLoading?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
  onNavigate?: (date: Date) => void;
}

const HOUR_HEIGHT = 60; // Larger for mobile touch targets
const START_HOUR = 0;
const END_HOUR = 24;

export function Calendar3DayView({
  currentDate,
  events,
  isLoading,
  onEventClick,
  onTimeSlotClick,
  onNavigate,
}: Calendar3DayViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTimeTop, setCurrentTimeTop] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Get 3 days starting from current date
  const days = useMemo(() => {
    return [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];
  }, [currentDate]);

  // Generate hours
  const hours = useMemo(() => {
    const dayStart = startOfDay(new Date());
    const dayEnd = endOfDay(new Date());
    return eachHourOfInterval({ start: dayStart, end: dayEnd }).slice(START_HOUR, END_HOUR);
  }, []);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    days.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return isSameDay(eventDate, day) && !event.all_day;
      });
      map.set(dateKey, dayEvents);
    });
    return map;
  }, [events, days]);

  // All-day events for the 3 days
  const allDayEvents = useMemo(() => {
    return events.filter(event => {
      if (!event.all_day) return false;
      const eventDate = new Date(event.start_time);
      return days.some(day => isSameDay(eventDate, day));
    });
  }, [events, days]);

  // Update current time indicator
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      setCurrentTimeTop((minutesSinceMidnight / 60) * HOUR_HEIGHT);
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const scrollTo = (now.getHours() - 1) * HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, []);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - go forward
        onNavigate?.(addDays(currentDate, 3));
      } else {
        // Swipe right - go back
        onNavigate?.(addDays(currentDate, -3));
      }
    }
    setTouchStart(null);
  };

  // Calculate event position
  const getEventStyle = (event: CalendarEvent, dayEvents: CalendarEvent[]) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : addMinutes(start, 60);
    
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const duration = differenceInMinutes(end, start);
    
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, HOUR_HEIGHT / 2);

    // Handle overlapping events
    const overlapping = dayEvents.filter(e => {
      if (e.id === event.id) return false;
      const eStart = new Date(e.start_time);
      const eEnd = e.end_time ? new Date(e.end_time) : addMinutes(eStart, 60);
      return (start < eEnd && end > eStart);
    });

    const overlapIndex = overlapping.findIndex(e => e.id < event.id) + 1;
    const totalOverlap = overlapping.length + 1;
    const width = `${100 / totalOverlap}%`;
    const left = `${(overlapIndex / totalOverlap) * 100}%`;

    return { top, height, width, left };
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    onTimeSlotClick?.(day, time);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex">
          <div className="w-14 border-r border-border/30">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-[60px] m-1" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-r border-border/30 last:border-r-0">
                {[...Array(12)].map((_, j) => (
                  <Skeleton key={j} className="h-[60px] m-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col flex-1 min-h-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header row with day names - larger touch targets */}
      <div className="flex border-b border-border/30 bg-muted/5 sticky top-0 z-20">
        {/* Time column header */}
        <div className="w-14 shrink-0 border-r border-border/30" />
        
        {/* Day columns */}
        {days.map((day) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 text-center py-4 border-r border-border/30 last:border-r-0",
                isCurrentDay && "bg-gcal-blue/5"
              )}
            >
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-2xl font-medium mt-1",
                  isCurrentDay
                    ? "w-11 h-11 rounded-full bg-gcal-blue text-white flex items-center justify-center mx-auto"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day events row */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b border-border/30 bg-muted/5">
          <div className="w-14 shrink-0 border-r border-border/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">All day</span>
          </div>
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayAllDayEvents = allDayEvents.filter(e =>
              isSameDay(new Date(e.start_time), day)
            );
            return (
              <div
                key={dateKey}
                className="flex-1 p-1.5 border-r border-border/30 last:border-r-0 min-h-[40px]"
              >
                {dayAllDayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="w-full text-left px-2 py-1 text-xs rounded bg-gcal-blue/90 text-white truncate mb-1"
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        <div className="flex">
          {/* Time column */}
          <div className="w-14 shrink-0 border-r border-border/30 sticky left-0 bg-card z-10">
            {hours.map((hour, index) => (
              <div
                key={index}
                className="relative"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2.5 right-2 text-xs text-muted-foreground font-medium">
                  {format(hour, "h a")}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns with events */}
          <div className="flex-1 relative">
            <div className="flex">
              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDay.get(dateKey) || [];
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "flex-1 border-r border-border/30 last:border-r-0 relative",
                      isCurrentDay && "bg-gcal-blue/[0.02]"
                    )}
                  >
                    {/* Hour grid lines */}
                    {hours.map((_, index) => (
                      <div
                        key={index}
                        className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors active:bg-muted/50"
                        style={{ height: HOUR_HEIGHT }}
                        onClick={() => handleTimeSlotClick(day, index)}
                      >
                        {/* Half-hour line */}
                        <div 
                          className="border-b border-border/10" 
                          style={{ marginTop: HOUR_HEIGHT / 2 - 1 }} 
                        />
                      </div>
                    ))}

                    {/* Events */}
                    {dayEvents.map((event) => {
                      const style = getEventStyle(event, dayEvents);
                      return (
                        <button
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="absolute rounded-lg px-2 py-1.5 text-left overflow-hidden transition-all active:scale-[0.98] border-l-4 bg-gcal-blue/90 border-gcal-blue text-white"
                          style={{
                            top: style.top,
                            height: style.height,
                            width: `calc(${style.width} - 4px)`,
                            left: style.left,
                          }}
                        >
                          <div className="text-sm font-medium truncate">
                            {event.title}
                          </div>
                          {style.height > 50 && (
                            <div className="text-xs opacity-80 truncate mt-0.5">
                              {format(new Date(event.start_time), "h:mm a")}
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {/* Current time indicator */}
                    {isCurrentDay && (
                      <div
                        className="absolute left-0 right-0 z-20 pointer-events-none"
                        style={{ top: currentTimeTop }}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
                          <div className="flex-1 h-0.5 bg-red-500" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

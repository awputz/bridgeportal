import { useRef, useEffect, useMemo } from "react";
import {
  format,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  isToday,
  differenceInMinutes,
  addMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  isLoading?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

const HOUR_HEIGHT = 60; // pixels per hour (larger for day view)

export function CalendarDayView({
  currentDate,
  events,
  isLoading,
  onEventClick,
  onTimeSlotClick,
}: CalendarDayViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate hours
  const hours = useMemo(() => {
    const dayStart = startOfDay(new Date());
    const dayEnd = endOfDay(new Date());
    return eachHourOfInterval({ start: dayStart, end: dayEnd });
  }, []);

  // Filter events for the current day
  const dayEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, currentDate) && !event.all_day;
    });
  }, [events, currentDate]);

  // All-day events for the day
  const allDayEvents = useMemo(() => {
    return events.filter(event => 
      event.all_day && isSameDay(new Date(event.start_time), currentDate)
    );
  }, [events, currentDate]);

  // Current time indicator
  const currentTimeTop = useMemo(() => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    return (minutesSinceMidnight / 60) * HOUR_HEIGHT;
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const scrollTo = (now.getHours() - 2) * HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, []);

  // Calculate event position
  const getEventStyle = (event: CalendarEvent) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : addMinutes(start, 60);
    
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const duration = differenceInMinutes(end, start);
    
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, HOUR_HEIGHT / 2);

    // Check for overlapping events
    const overlapping = dayEvents.filter(e => {
      if (e.id === event.id) return false;
      const eStart = new Date(e.start_time);
      const eEnd = e.end_time ? new Date(e.end_time) : addMinutes(eStart, 60);
      return (start < eEnd && end > eStart);
    });

    const overlapIndex = overlapping.findIndex(e => e.id < event.id) + 1;
    const totalOverlap = overlapping.length + 1;
    const width = `${90 / totalOverlap}%`;
    const left = `${(overlapIndex / totalOverlap) * 90}%`;

    return { top, height, width, left };
  };

  const handleTimeSlotClick = (hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    onTimeSlotClick?.(currentDate, time);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex">
          <div className="w-20 border-r border-border/30">
            {[...Array(24)].map((_, i) => (
              <Skeleton key={i} className="h-[60px] m-1" />
            ))}
          </div>
          <div className="flex-1">
            {[...Array(24)].map((_, i) => (
              <Skeleton key={i} className="h-[60px] m-1" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isCurrentDay = isToday(currentDate);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex border-b border-border/30 bg-muted/5 sticky top-0 z-20">
        <div className="w-20 shrink-0 border-r border-border/30 p-2">
          <div className="text-xs text-muted-foreground">GMT-05</div>
        </div>
        <div className="flex-1 text-center py-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {format(currentDate, "EEEE")}
          </div>
          <div
            className={cn(
              "text-3xl font-light mt-1",
              isCurrentDay
                ? "w-12 h-12 rounded-full bg-gcal-blue text-white flex items-center justify-center mx-auto"
                : "text-foreground"
            )}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b border-border/30 bg-muted/5">
          <div className="w-20 shrink-0 border-r border-border/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">All day</span>
          </div>
          <div className="flex-1 p-2 space-y-1">
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="w-full text-left px-3 py-1 text-sm rounded bg-gcal-blue/90 text-white hover:bg-gcal-blue transition-colors"
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable time grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 shrink-0 border-r border-border/30 sticky left-0 bg-card z-10">
            {hours.map((hour, index) => (
              <div
                key={index}
                className="relative"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2.5 right-3 text-xs text-muted-foreground">
                  {format(hour, "h a")}
                </span>
              </div>
            ))}
          </div>

          {/* Day column with events */}
          <div className={cn(
            "flex-1 relative",
            isCurrentDay && "bg-gcal-blue/[0.02]"
          )}>
            {/* Hour grid lines */}
            {hours.map((_, index) => (
              <div
                key={index}
                className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
                style={{ height: HOUR_HEIGHT }}
                onClick={() => handleTimeSlotClick(index)}
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
              const style = getEventStyle(event);
              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="absolute rounded-lg px-3 py-2 text-left overflow-hidden transition-all hover:shadow-lg hover:z-10 border-l-4 bg-gcal-blue/90 border-gcal-blue text-white"
                  style={{
                    top: style.top,
                    height: style.height,
                    width: style.width,
                    left: style.left,
                  }}
                >
                  <div className="font-medium truncate">
                    {event.title}
                  </div>
                  <div className="text-sm opacity-80 truncate">
                    {format(new Date(event.start_time), "h:mm a")}
                    {event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}
                  </div>
                  {event.location && (
                    <div className="text-sm opacity-70 truncate mt-1">
                      📍 {event.location}
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
        </div>
      </div>
    </div>
  );
}

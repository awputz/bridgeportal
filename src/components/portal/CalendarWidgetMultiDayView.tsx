import { useMemo, useRef, useEffect, useState } from "react";
import { format, isSameDay, addDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Video, MapPin, Phone } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  location?: string;
  all_day?: boolean;
  colorId?: string;
  hangoutLink?: string;
}

interface CalendarWidgetMultiDayViewProps {
  days: 2 | 3;
  startDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

// Google Calendar color palette for backgrounds
const GOOGLE_BG_COLORS: Record<string, string> = {
  "1": "bg-[#7986cb]/80",
  "2": "bg-[#33b679]/80",
  "3": "bg-[#8e24aa]/80",
  "4": "bg-[#e67c73]/80",
  "5": "bg-[#f6bf26]/80",
  "6": "bg-[#f4511e]/80",
  "7": "bg-[#039be5]/80",
  "8": "bg-[#616161]/80",
  "9": "bg-[#3f51b5]/80",
  "10": "bg-[#0b8043]/80",
  "11": "bg-[#d50000]/80",
};

const HOUR_HEIGHT = 36; // Compact height for widget
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am to 7pm

export const CalendarWidgetMultiDayView = ({
  days,
  startDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: CalendarWidgetMultiDayViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null);

  // Generate array of days to display
  const dayColumns = useMemo(() => {
    return Array.from({ length: days }, (_, i) => addDays(startDate, i));
  }, [startDate, days]);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    dayColumns.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      grouped[dayKey] = events
        .filter(e => !e.all_day && isSameDay(new Date(e.start_time), day))
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });
    return grouped;
  }, [events, dayColumns]);

  // All-day events
  const allDayEvents = useMemo(() => {
    return events.filter(e => e.all_day);
  }, [events]);

  // Update current time indicator
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      if (hour >= 7 && hour < 20) {
        const top = (hour - 7) * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;
        setCurrentTimeTop(top);
      } else {
        setCurrentTimeTop(null);
      }
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentTimeTop !== null) {
      scrollContainerRef.current.scrollTop = Math.max(0, currentTimeTop - 60);
    }
  }, []);

  const getEventStyle = (event: CalendarEvent, dayEvents: CalendarEvent[]) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 3600000);
    
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const clampedStart = Math.max(startHour, 7);
    const clampedEnd = Math.min(endHour, 20);
    
    const top = (clampedStart - 7) * HOUR_HEIGHT;
    const height = Math.max((clampedEnd - clampedStart) * HOUR_HEIGHT, 18);
    
    // Simple overlap handling
    const eventIndex = dayEvents.indexOf(event);
    const overlapping = dayEvents.filter((e, i) => {
      if (i >= eventIndex) return false;
      const eStart = new Date(e.start_time);
      const eEnd = e.end_time ? new Date(e.end_time) : new Date(eStart.getTime() + 3600000);
      return start < eEnd && end > eStart;
    });
    
    const leftOffset = overlapping.length * 8;
    
    return { top, height, left: leftOffset, right: 2 };
  };

  const getEventBgColor = (event: CalendarEvent) => {
    return GOOGLE_BG_COLORS[event.colorId || ""] || "bg-emerald-500/80";
  };

  const getMeetingIcon = (event: CalendarEvent) => {
    if (event.hangoutLink || event.location?.toLowerCase().includes('meet') || event.location?.toLowerCase().includes('zoom')) {
      return <Video className="h-2 w-2 flex-shrink-0" />;
    }
    if (event.location?.toLowerCase().includes('call') || event.location?.toLowerCase().includes('phone')) {
      return <Phone className="h-2 w-2 flex-shrink-0" />;
    }
    if (event.location) {
      return <MapPin className="h-2 w-2 flex-shrink-0" />;
    }
    return null;
  };

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isPast = (event: CalendarEvent) => {
    const end = event.end_time ? new Date(event.end_time) : new Date(event.start_time);
    return end < new Date();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header row - day names */}
      <div className="flex border-b border-border/30 bg-muted/10">
        <div className="w-8 flex-shrink-0" /> {/* Time column spacer */}
        {dayColumns.map((day, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 py-1.5 px-1 text-center border-l border-border/20",
              isToday(day) && "bg-primary/5"
            )}
          >
            <div className="text-[10px] text-muted-foreground uppercase">
              {format(day, "EEE")}
            </div>
            <div className={cn(
              "text-sm font-semibold",
              isToday(day) ? "text-primary" : "text-foreground"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* All-day events row (if any) */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b border-border/30 bg-muted/5">
          <div className="w-8 flex-shrink-0 text-[8px] text-muted-foreground py-1 text-center">
            All
          </div>
          {dayColumns.map((day, i) => {
            const dayAllDay = allDayEvents.filter(e => isSameDay(new Date(e.start_time), day));
            return (
              <div key={i} className="flex-1 p-0.5 border-l border-border/20 min-h-[20px]">
                {dayAllDay.slice(0, 2).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={cn(
                      "w-full text-left text-[9px] px-1 py-0.5 rounded truncate text-white",
                      getEventBgColor(event),
                      "hover:opacity-80 transition-opacity"
                    )}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Time grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
        <div className="flex relative" style={{ minHeight: HOURS.length * HOUR_HEIGHT }}>
          {/* Time labels column */}
          <div className="w-8 flex-shrink-0 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 text-[9px] text-muted-foreground text-right pr-1"
                style={{ top: (hour - 7) * HOUR_HEIGHT - 5 }}
              >
                {format(new Date().setHours(hour, 0), "ha")}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {dayColumns.map((day, colIndex) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay[dayKey] || [];
            
            return (
              <div
                key={colIndex}
                className={cn(
                  "flex-1 relative border-l border-border/20",
                  isToday(day) && "bg-primary/[0.02]"
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-border/10 cursor-pointer hover:bg-muted/20 transition-colors"
                    style={{ top: (hour - 7) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    onClick={() => {
                      const clickDate = new Date(day);
                      clickDate.setHours(hour, 0, 0, 0);
                      onTimeSlotClick(clickDate);
                    }}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, dayEvents);
                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        "absolute rounded-sm px-1 py-0.5 text-left overflow-hidden",
                        "text-white shadow-sm",
                        "hover:z-20 hover:shadow-md hover:scale-[1.02] transition-all",
                        getEventBgColor(event),
                        isPast(event) && "opacity-50"
                      )}
                      style={{
                        top: style.top,
                        height: style.height,
                        left: style.left,
                        right: style.right,
                        zIndex: 10,
                      }}
                    >
                      <div className="text-[9px] font-medium truncate leading-tight">
                        {event.title}
                      </div>
                      {style.height > 24 && (
                        <div className="text-[8px] opacity-90 flex items-center gap-0.5">
                          {getMeetingIcon(event)}
                          <span>{format(new Date(event.start_time), "h:mm")}</span>
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Current time indicator */}
                {isToday(day) && currentTimeTop !== null && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none"
                    style={{ top: currentTimeTop }}
                  >
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <div className="flex-1 h-[1px] bg-red-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

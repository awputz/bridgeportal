import { useMemo, useRef, useEffect, useState } from "react";
import { format, isSameDay, addDays } from "date-fns";
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

// Google Calendar color palette
const GOOGLE_COLORS: Record<string, string> = {
  "1": "#7986cb", "2": "#33b679", "3": "#8e24aa", "4": "#e67c73",
  "5": "#f6bf26", "6": "#f4511e", "7": "#039be5", "8": "#616161",
  "9": "#3f51b5", "10": "#0b8043", "11": "#d50000",
};

const getEventColor = (colorId?: string): string => {
  return colorId && GOOGLE_COLORS[colorId] ? GOOGLE_COLORS[colorId] : "#10b981";
};

const HOUR_HEIGHT = 48;
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6AM to 10PM

export const CalendarWidgetMultiDayView = ({
  days,
  startDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: CalendarWidgetMultiDayViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get timezone abbreviation
  const timezone = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' });
      const parts = formatter.formatToParts(new Date());
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      return tzPart?.value || 'Local';
    } catch {
      return 'Local';
    }
  }, []);

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

  // All-day events by day
  const allDayEventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    dayColumns.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      grouped[dayKey] = events.filter(e => e.all_day && isSameDay(new Date(e.start_time), day));
    });
    return grouped;
  }, [events, dayColumns]);

  const hasAnyAllDayEvents = useMemo(() => {
    return Object.values(allDayEventsByDay).some(arr => arr.length > 0);
  }, [allDayEventsByDay]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= HOURS[0] && hour <= HOURS[HOURS.length - 1]) {
        const top = (hour - HOURS[0]) * HOUR_HEIGHT;
        scrollContainerRef.current.scrollTop = Math.max(0, top - 80);
      }
    }
  }, []);

  // Calculate current time indicator position
  const getCurrentTimePosition = () => {
    const hour = currentTime.getHours() + currentTime.getMinutes() / 60;
    if (hour < HOURS[0] || hour > HOURS[HOURS.length - 1] + 1) return null;
    return (hour - HOURS[0]) * HOUR_HEIGHT;
  };

  const currentTimeTop = getCurrentTimePosition();

  const getEventStyle = (event: CalendarEvent, dayEvents: CalendarEvent[]) => {
    const start = new Date(event.start_time);
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 3600000);
    
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const clampedStart = Math.max(startHour, HOURS[0]);
    const clampedEnd = Math.min(endHour, HOURS[HOURS.length - 1] + 1);
    
    const top = (clampedStart - HOURS[0]) * HOUR_HEIGHT;
    const height = Math.max((clampedEnd - clampedStart) * HOUR_HEIGHT, 22);
    
    // Simple overlap handling
    const eventIndex = dayEvents.indexOf(event);
    const overlapping = dayEvents.filter((e, i) => {
      if (i >= eventIndex) return false;
      const eStart = new Date(e.start_time);
      const eEnd = e.end_time ? new Date(e.end_time) : new Date(eStart.getTime() + 3600000);
      return start < eEnd && end > eStart;
    });
    
    const leftOffset = overlapping.length * 10;
    
    return { top, height, left: leftOffset };
  };

  const getMeetingIcon = (event: CalendarEvent) => {
    if (event.hangoutLink || event.location?.toLowerCase().includes('meet') || event.location?.toLowerCase().includes('zoom')) {
      return <Video className="h-2.5 w-2.5 flex-shrink-0" />;
    }
    if (event.location?.toLowerCase().includes('call') || event.location?.toLowerCase().includes('phone')) {
      return <Phone className="h-2.5 w-2.5 flex-shrink-0" />;
    }
    if (event.location) {
      return <MapPin className="h-2.5 w-2.5 flex-shrink-0" />;
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
      {/* Day Headers */}
      <div className="flex border-b border-border/30">
        {/* Time column spacer */}
        <div className="w-12 flex-shrink-0" />
        
        {/* Day columns */}
        {dayColumns.map((day, index) => {
          const isDayToday = isToday(day);
          return (
            <div
              key={index}
              className={cn(
                "flex-1 py-2 text-center border-l border-border/30",
                isDayToday && "bg-primary/5"
              )}
            >
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-lg font-light mt-0.5 w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors",
                  isDayToday && "bg-primary text-primary-foreground font-medium"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day events row */}
      {hasAnyAllDayEvents && (
        <div className="flex border-b border-border/30">
          <div className="w-12 flex-shrink-0 text-[10px] text-muted-foreground py-1.5 px-1 text-right pr-2">
            All-day
          </div>
          {dayColumns.map((day, index) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayAllDayEvents = allDayEventsByDay[dayKey] || [];
            return (
              <div
                key={index}
                className={cn(
                  "flex-1 py-1 px-0.5 border-l border-border/30 min-h-[28px]",
                  isToday(day) && "bg-primary/5"
                )}
              >
                {dayAllDayEvents.slice(0, 2).map((event) => {
                  const color = getEventColor(event.colorId);
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left text-[10px] px-1.5 py-0.5 rounded truncate mb-0.5 hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: `${color}25`,
                        color: color,
                        borderLeft: `2px solid ${color}`,
                      }}
                    >
                      {event.title}
                    </button>
                  );
                })}
                {dayAllDayEvents.length > 2 && (
                  <div className="text-[9px] text-muted-foreground px-1">
                    +{dayAllDayEvents.length - 2} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Time Grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
        <div className="flex relative" style={{ minHeight: HOURS.length * HOUR_HEIGHT }}>
          {/* Time labels column */}
          <div className="w-12 flex-shrink-0 relative">
            {HOURS.map((hour, idx) => (
              <div
                key={hour}
                className="absolute left-0 right-0 flex items-start justify-end pr-2"
                style={{ top: idx * HOUR_HEIGHT - 6 }}
              >
                <span className="text-[10px] text-muted-foreground font-medium">
                  {hour === 0 ? "12AM" : hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`}
                </span>
              </div>
            ))}
            
            {/* Current time label */}
            {currentTimeTop !== null && dayColumns.some(d => isToday(d)) && (
              <div
                className="absolute left-0 right-0 z-30 pr-1 flex justify-end"
                style={{ top: currentTimeTop - 7 }}
              >
                <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded font-medium">
                  {format(currentTime, "h:mma")}
                </span>
              </div>
            )}
          </div>

          {/* Day columns with events */}
          {dayColumns.map((day, colIndex) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay[dayKey] || [];
            const isDayToday = isToday(day);

            return (
              <div
                key={colIndex}
                className={cn(
                  "flex-1 relative border-l border-border/30",
                  isDayToday && "bg-primary/5"
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour, idx) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-border/20 cursor-pointer hover:bg-muted/10 transition-colors"
                    style={{ 
                      top: idx * HOUR_HEIGHT, 
                      height: HOUR_HEIGHT 
                    }}
                    onClick={() => {
                      const clickDate = new Date(day);
                      clickDate.setHours(hour, 0, 0, 0);
                      onTimeSlotClick(clickDate);
                    }}
                  />
                ))}

                {/* Half-hour lines (subtle) */}
                {HOURS.map((hour, idx) => (
                  <div
                    key={`half-${hour}`}
                    className="absolute left-0 right-0 border-t border-border/10 pointer-events-none"
                    style={{ top: idx * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, dayEvents);
                  const color = getEventColor(event.colorId);
                  const eventIsPast = isPast(event);

                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        "absolute rounded-sm px-1.5 py-1 text-left overflow-hidden",
                        "shadow-sm hover:z-20 hover:shadow-md hover:scale-[1.02] transition-all",
                        eventIsPast && "opacity-50"
                      )}
                      style={{
                        top: style.top,
                        height: style.height,
                        left: style.left + 2,
                        right: 2,
                        zIndex: 10,
                        backgroundColor: `${color}20`,
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <div 
                        className="text-[10px] font-medium truncate leading-tight"
                        style={{ color }}
                      >
                        {event.title}
                      </div>
                      {style.height > 32 && (
                        <div className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          {getMeetingIcon(event)}
                          <span>{format(new Date(event.start_time), "h:mm a")}</span>
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Current time indicator line */}
                {isDayToday && currentTimeTop !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                    style={{ top: currentTimeTop }}
                  >
                    <div className="h-[2px] bg-red-500 relative">
                      <div className="absolute -left-1 -top-[3px] w-2 h-2 bg-red-500 rounded-full" />
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

import { useState, useRef, useEffect, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  isToday,
  differenceInMinutes,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { DraggableEvent } from "@/components/calendar/DraggableEvent";
import { DroppableTimeSlot } from "@/components/calendar/DroppableTimeSlot";

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  isLoading?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
  onEventDrop?: (eventId: string, newStart: Date, newEnd: Date) => void;
}

const HOUR_HEIGHT = 48; // pixels per hour
const START_HOUR = 0; // Start from midnight
const END_HOUR = 24; // End at midnight next day

export function CalendarWeekView({
  currentDate,
  events,
  isLoading,
  onEventClick,
  onTimeSlotClick,
  onEventDrop,
}: CalendarWeekViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTimeTop, setCurrentTimeTop] = useState(0);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  // DnD sensors with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Prevent accidental drags
    })
  );

  // Calculate week days
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Generate hours for the time column
  const hours = useMemo(() => {
    const dayStart = startOfDay(new Date());
    const dayEnd = endOfDay(new Date());
    return eachHourOfInterval({ start: dayStart, end: dayEnd }).slice(START_HOUR, END_HOUR);
  }, []);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    weekDays.forEach(day => {
      const dateKey = format(day, "yyyy-MM-dd");
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return isSameDay(eventDate, day) && !event.all_day;
      });
      map.set(dateKey, dayEvents);
    });
    return map;
  }, [events, weekDays]);

  // All-day events
  const allDayEvents = useMemo(() => {
    return events.filter(event => event.all_day);
  }, [events]);

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
      const scrollTo = (now.getHours() - 2) * HOUR_HEIGHT;
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, []);

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent, dayEvents: CalendarEvent[]) => {
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
    const width = `${100 / totalOverlap}%`;
    const left = `${(overlapIndex / totalOverlap) * 100}%`;

    return { top, height, width, left };
  };

  // Get event color based on source or type
  const getEventColor = (event: CalendarEvent) => {
    if (event.source === "google") {
      return "bg-gcal-blue/90 border-gcal-blue text-white";
    }
    return "bg-primary/90 border-primary text-primary-foreground";
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    onTimeSlotClick?.(day, time);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEvent(null);
    const { active, over } = event;
    
    if (!over || !onEventDrop) return;

    const draggedEvent = active.data.current?.event as CalendarEvent;
    if (!draggedEvent || draggedEvent.source !== "google") return;

    const dropData = over.data.current as { day: Date; hour: number; minute?: number } | undefined;
    if (!dropData) return;

    // Calculate event duration
    const originalStart = new Date(draggedEvent.start_time);
    const originalEnd = draggedEvent.end_time 
      ? new Date(draggedEvent.end_time) 
      : addMinutes(originalStart, 60);
    const duration = differenceInMinutes(originalEnd, originalStart);

    // Calculate new times
    const newStart = setMinutes(setHours(dropData.day, dropData.hour), dropData.minute || 0);
    const newEnd = addMinutes(newStart, duration);

    onEventDrop(draggedEvent.id, newStart, newEnd);
  };

  const handleDragStart = (event: any) => {
    const draggedEvent = event.active.data.current?.event as CalendarEvent;
    setActiveEvent(draggedEvent);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex">
          <div className="w-16 border-r border-border/30">
            {[...Array(24)].map((_, i) => (
              <Skeleton key={i} className="h-12 m-1" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="border-r border-border/30 last:border-r-0">
                {[...Array(24)].map((_, j) => (
                  <Skeleton key={j} className="h-12 m-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Header row with day names */}
        <div className="flex border-b border-border/30 bg-muted/5 sticky top-0 z-20">
          {/* Time column header */}
          <div className="w-16 shrink-0 border-r border-border/30" />
          
          {/* Day columns */}
          {weekDays.map((day) => {
            const isCurrentDay = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 text-center py-3 border-r border-border/30 last:border-r-0",
                  isCurrentDay && "bg-gcal-blue/5"
                )}
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-2xl font-light mt-1",
                    isCurrentDay
                      ? "w-10 h-10 rounded-full bg-gcal-blue text-white flex items-center justify-center mx-auto"
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
            <div className="w-16 shrink-0 border-r border-border/30 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">All day</span>
            </div>
            {weekDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayAllDayEvents = allDayEvents.filter(e =>
                isSameDay(new Date(e.start_time), day)
              );
              return (
                <div
                  key={dateKey}
                  className="flex-1 p-1 border-r border-border/30 last:border-r-0 min-h-[32px]"
                >
                  {dayAllDayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "w-full text-left px-2 py-0.5 text-xs rounded truncate mb-0.5",
                        getEventColor(event)
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

        {/* Scrollable time grid */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative"
        >
          <div className="flex">
            {/* Time column */}
            <div className="w-16 shrink-0 border-r border-border/30 sticky left-0 bg-card z-10">
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="absolute -top-2.5 right-2 text-xs text-muted-foreground">
                    {format(hour, "h a")}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns with events */}
            <div className="flex-1 relative">
              <div className="flex">
                {weekDays.map((day) => {
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
                      {/* Hour grid lines (droppable) */}
                      {hours.map((_, index) => (
                        <DroppableTimeSlot
                          key={`${dateKey}_${index}`}
                          id={`${dateKey}_${index}`}
                          day={day}
                          hour={index}
                          className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                          <div
                            style={{ height: HOUR_HEIGHT }}
                            onClick={() => handleTimeSlotClick(day, index)}
                          >
                            {/* Half-hour line */}
                            <div 
                              className="border-b border-border/10" 
                              style={{ marginTop: HOUR_HEIGHT / 2 - 1 }} 
                            />
                          </div>
                        </DroppableTimeSlot>
                      ))}

                      {/* Events */}
                      {dayEvents.map((event) => {
                        const style = getEventStyle(event, dayEvents);
                        return (
                          <div
                            key={event.id}
                            className="absolute"
                            style={{
                              top: style.top,
                              height: style.height,
                              width: `calc(${style.width} - 4px)`,
                              left: style.left,
                            }}
                          >
                            <DraggableEvent event={event}>
                              <button
                                onClick={() => onEventClick?.(event)}
                                className={cn(
                                  "w-full h-full rounded-md px-2 py-1 text-left overflow-hidden transition-all hover:shadow-lg hover:z-10 border-l-4",
                                  getEventColor(event),
                                  event.source === "google" && "cursor-grab active:cursor-grabbing"
                                )}
                              >
                                <div className="text-xs font-medium truncate">
                                  {event.title}
                                </div>
                                {style.height > 40 && (
                                  <div className="text-xs opacity-80 truncate">
                                    {format(new Date(event.start_time), "h:mm a")}
                                    {event.end_time &&
                                      ` - ${format(new Date(event.end_time), "h:mm a")}`}
                                  </div>
                                )}
                                {style.height > 60 && event.location && (
                                  <div className="text-xs opacity-70 truncate mt-0.5">
                                    📍 {event.location}
                                  </div>
                                )}
                              </button>
                            </DraggableEvent>
                          </div>
                        );
                      })}

                      {/* Current time indicator (red line) */}
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

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeEvent && (
          <div className={cn(
            "rounded-md px-2 py-1 text-left border-l-4 shadow-xl opacity-90",
            getEventColor(activeEvent)
          )}>
            <div className="text-xs font-medium truncate">
              {activeEvent.title}
            </div>
            <div className="text-xs opacity-80">
              {format(new Date(activeEvent.start_time), "h:mm a")}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

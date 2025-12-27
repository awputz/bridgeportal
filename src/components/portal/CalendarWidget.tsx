import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Clock, 
  MapPin,
  Plus,
  ExternalLink,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay, addHours, setHours, setMinutes } from "date-fns";
import { useUpcomingEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { 
  useGoogleCalendarConnection, 
  useGoogleCalendarEvents, 
  useConnectGoogleCalendar,
  useCreateGoogleEvent,
} from "@/hooks/useGoogleCalendar";
import { CalendarEventDialog } from "./CalendarEventDialog";

// Google Calendar color mapping
const googleColors: Record<string, string> = {
  "1": "#7986cb", // Lavender
  "2": "#33b679", // Sage
  "3": "#8e24aa", // Grape
  "4": "#e67c73", // Flamingo
  "5": "#f6bf26", // Banana
  "6": "#f4511e", // Tangerine
  "7": "#039be5", // Peacock (default)
  "8": "#616161", // Graphite
  "9": "#3f51b5", // Blueberry
  "10": "#0b8043", // Basil
  "11": "#d50000", // Tomato
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am to 7pm

export const CalendarWidget = () => {
  const today = new Date();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultTime, setDefaultTime] = useState<string | undefined>();

  // Fetch company events
  const { data: companyEvents = [], isLoading: isLoadingCompany } = useUpcomingEvents(1);

  // Fetch Google Calendar connection status
  const { data: googleConnection, isLoading: isLoadingConnection } = useGoogleCalendarConnection();
  
  // Fetch today's Google Calendar events
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data: googleEvents = [], isLoading: isLoadingGoogle } = useGoogleCalendarEvents(startOfDay, endOfDay);

  // Mutations
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();
  const createEvent = useCreateGoogleEvent();

  // Filter to today's events only
  const todaysEvents = useMemo(() => {
    const allEvents = [...companyEvents, ...googleEvents];
    return allEvents
      .filter(event => isSameDay(new Date(event.start_time), today))
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [companyEvents, googleEvents, today]);

  const isLoading = isLoadingCompany || isLoadingConnection || isLoadingGoogle;
  const isConnected = googleConnection?.calendar_enabled && !!googleConnection?.access_token;

  // Get event position and height for day view
  const getEventStyle = (event: CalendarEvent) => {
    if (event.all_day) return null;
    
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : addHours(startTime, 1);
    
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
    
    // Calculate position relative to 7am
    const top = Math.max(0, (startHour - 7) * 48); // 48px per hour
    const height = Math.max(24, (endHour - startHour) * 48);
    
    return { top, height };
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.source === "company") return "#10b981"; // Emerald for company
    const colorId = (event as any).colorId;
    return googleColors[colorId] || "#039be5"; // Default to Peacock
  };

  const handleTimeSlotClick = (hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    setDefaultTime(time);
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleQuickAdd = () => {
    // Default to next hour
    const now = new Date();
    const nextHour = now.getHours() + 1;
    const time = `${nextHour.toString().padStart(2, "0")}:00`;
    setDefaultTime(time);
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (isConnected && eventData.title && eventData.start_time) {
      createEvent.mutate({
        title: eventData.title,
        description: eventData.description || undefined,
        start_time: eventData.start_time,
        end_time: eventData.end_time || undefined,
        all_day: eventData.all_day,
        location: eventData.location || undefined,
      });
    }
    setEventDialogOpen(false);
  };

  // All-day events
  const allDayEvents = todaysEvents.filter(e => e.all_day);
  const timedEvents = todaysEvents.filter(e => !e.all_day);

  if (!isConnected && !isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Today
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Connect Google Calendar to see your events
          </p>
          <Button
            size="sm"
            onClick={() => connectGoogle()}
            disabled={isConnecting}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Connect Calendar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{format(today, "EEEE, MMM d")}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleQuickAdd}
              className="h-7 w-7"
              title="Add Event"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : (
            <>
              {/* All-day events */}
              {allDayEvents.length > 0 && (
                <div className="px-4 py-2 border-b border-border/30 space-y-1">
                  {allDayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="w-full text-left px-2 py-1 rounded text-xs font-medium text-white truncate"
                      style={{ backgroundColor: getEventColor(event) }}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Day timeline */}
              <ScrollArea className="h-[280px]">
                <div className="relative px-4 py-2">
                  {/* Hour grid */}
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="flex h-12 border-t border-border/20 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handleTimeSlotClick(hour)}
                    >
                      <div className="w-12 text-[10px] text-muted-foreground pr-2 pt-0.5 text-right shrink-0">
                        {format(setHours(setMinutes(new Date(), 0), hour), "h a")}
                      </div>
                      <div className="flex-1 relative" />
                    </div>
                  ))}

                  {/* Events overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ left: "60px", right: "16px" }}>
                    {timedEvents.map((event) => {
                      const style = getEventStyle(event);
                      if (!style) return null;

                      const hasLocation = !!event.location;
                      const hasGoogleMeet = !!(event as any).hangoutLink;

                      return (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={cn(
                            "absolute left-0 right-2 rounded-md px-2 py-1 text-left pointer-events-auto",
                            "text-white text-xs overflow-hidden shadow-sm",
                            "hover:ring-2 hover:ring-white/30 transition-all"
                          )}
                          style={{
                            top: `${style.top + 8}px`, // Offset for padding
                            height: `${style.height - 4}px`,
                            backgroundColor: getEventColor(event),
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          {style.height > 36 && (
                            <div className="flex items-center gap-2 text-[10px] opacity-90 mt-0.5">
                              <span>
                                {format(new Date(event.start_time), "h:mm a")}
                                {event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}
                              </span>
                              {hasGoogleMeet && <Video className="h-3 w-3" />}
                            </div>
                          )}
                          {style.height > 52 && hasLocation && (
                            <div className="flex items-center gap-1 text-[10px] opacity-80 mt-0.5 truncate">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>

              {/* Current time indicator */}
              {(() => {
                const now = new Date();
                const currentHour = now.getHours();
                if (currentHour >= 7 && currentHour <= 19) {
                  const position = (currentHour - 7 + now.getMinutes() / 60) * 48 + 8;
                  return (
                    <div
                      className="absolute left-14 right-4 h-0.5 bg-red-500 pointer-events-none z-10"
                      style={{ top: `${position}px` }}
                    >
                      <div className="absolute -left-1.5 -top-1 w-3 h-3 rounded-full bg-red-500" />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Empty state */}
              {todaysEvents.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm text-muted-foreground">No events today</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CalendarEventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        defaultDate={today}
        defaultTime={defaultTime}
        onSave={handleSaveEvent}
      />
    </>
  );
};

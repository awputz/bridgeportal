import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { useUpcomingEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { ScrollArea } from "@/components/ui/scroll-area";

const eventTypeColors: Record<string, string> = {
  company: "bg-emerald-500",
  training: "bg-blue-500",
  deadline: "bg-red-500",
  meeting: "bg-purple-500",
  personal: "bg-violet-500",
};

const eventSourceBadge: Record<string, { label: string; className: string }> = {
  company: { label: "Company", className: "bg-emerald-500/20 text-emerald-400" },
  google: { label: "Personal", className: "bg-violet-500/20 text-violet-400" },
};

export const CalendarWidget = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch company events
  const { data: companyEvents = [], isLoading: isLoadingCompany } = useUpcomingEvents(30);

  // Fetch Google Calendar connection status
  const { data: googleConnection, isLoading: isLoadingConnection } = useGoogleCalendarConnection();
  
  // Fetch Google Calendar events if connected
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const { data: googleEvents = [] } = useGoogleCalendarEvents(monthStart, monthEnd);

  // Combine events
  const allEvents = useMemo(() => {
    const combined = [...companyEvents, ...googleEvents];
    return combined.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [companyEvents, googleEvents]);

  // Connect/disconnect mutations
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();
  const { mutate: disconnectGoogle, isPending: isDisconnecting } = useDisconnectGoogleCalendar();

  // Get days in current month view
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return allEvents.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= now && eventDate <= weekFromNow;
    }).slice(0, 5);
  }, [allEvents]);

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const isLoading = isLoadingCompany || isLoadingConnection;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Calendar
          </CardTitle>
          {googleConnection?.access_token ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnectGoogle()}
              disabled={isDisconnecting}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              <LinkIcon className="h-3 w-3 mr-1" />
              {isDisconnecting ? "..." : "Disconnect Google"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => connectGoogle()}
              disabled={isConnecting}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {isConnecting ? "Connecting..." : "Connect Google"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini Calendar */}
        <div className="space-y-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}
              
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const hasCompanyEvent = dayEvents.some(e => e.source === "company");
                const hasGoogleEvent = dayEvents.some(e => e.source === "google");
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={cn(
                      "h-8 w-full rounded text-sm relative transition-colors",
                      "hover:bg-muted",
                      isToday(day) && "bg-primary/10 text-primary font-semibold",
                      isSelected && "bg-primary text-primary-foreground",
                      !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50"
                    )}
                  >
                    {format(day, "d")}
                    {hasEvents && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {hasCompanyEvent && (
                          <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        )}
                        {hasGoogleEvent && (
                          <div className="h-1 w-1 rounded-full bg-violet-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Day Events */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-3">
            <h4 className="text-sm font-medium">
              {format(selectedDate, "EEEE, MMMM d")}
            </h4>
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="space-y-2 border-t border-border/50 pt-3">
          <h4 className="text-sm font-medium text-muted-foreground">Upcoming</h4>
          <ScrollArea className="h-[180px]">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming events
              </p>
            ) : (
              <div className="space-y-2 pr-2">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Company</span>
          </div>
          {googleConnection?.access_token && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-violet-500" />
              <span>Personal</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
}

const EventCard = ({ event, compact = false }: EventCardProps) => {
  const sourceInfo = eventSourceBadge[event.source || "company"];
  const typeColor = eventTypeColors[event.event_type] || eventTypeColors.company;

  return (
    <div
      className={cn(
        "p-3 rounded-lg bg-muted/50 border border-border/50",
        "hover:bg-muted/80 transition-colors"
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn("h-2 w-2 rounded-full mt-1.5 flex-shrink-0", typeColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-medium text-sm truncate">{event.title}</h5>
            <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", sourceInfo.className)}>
              {sourceInfo.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {event.all_day
                  ? "All day"
                  : format(new Date(event.start_time), "h:mm a")}
              </span>
            </div>
            {event.location && !compact && (
              <div className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {event.description && !compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

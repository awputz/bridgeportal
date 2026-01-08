import { useMemo } from "react";
import { format, isPast, isFuture } from "date-fns";
import { Calendar, Clock, MapPin, Plus, Video, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  all_day?: boolean;
  event_type?: string | null;
}

interface RelatedEventsCardProps {
  title?: string;
  events: CalendarEvent[];
  isLoading?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onScheduleClick?: () => void;
  emptyMessage?: string;
  showPastEvents?: boolean;
  maxHeight?: string;
}

export function RelatedEventsCard({
  title = "Related Events",
  events,
  isLoading,
  onEventClick,
  onScheduleClick,
  emptyMessage = "No events linked to this record",
  showPastEvents = true,
  maxHeight = "300px",
}: RelatedEventsCardProps) {
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const sorted = [...events].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    
    return {
      upcomingEvents: sorted.filter((e) => isFuture(new Date(e.start_time)) || !isPast(new Date(e.end_time || e.start_time))),
      pastEvents: sorted.filter((e) => isPast(new Date(e.end_time || e.start_time))),
    };
  }, [events]);

  const formatEventTime = (event: CalendarEvent) => {
    const start = new Date(event.start_time);
    if (event.all_day) return "All day";
    
    const startStr = format(start, "h:mm a");
    if (event.end_time) {
      const end = new Date(event.end_time);
      return `${startStr} - ${format(end, "h:mm a")}`;
    }
    return startStr;
  };

  const getEventTypeStyles = (eventType?: string | null) => {
    switch (eventType) {
      case "focus_time":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "meeting":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "showing":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "call":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gcal-blue/20 text-gcal-blue border-gcal-blue/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-light text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const renderEvent = (event: CalendarEvent, isPast: boolean = false) => (
    <button
      key={event.id}
      onClick={() => onEventClick?.(event)}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
        "hover:bg-white/5",
        isPast && "opacity-60"
      )}
    >
      <div
        className={cn(
          "w-1 h-full min-h-[40px] rounded-full",
          getEventTypeStyles(event.event_type).split(" ")[0].replace("bg-", "bg-")
        )}
        style={{ backgroundColor: isPast ? "hsl(var(--muted-foreground))" : undefined }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {event.title}
          </p>
          {event.event_type === "focus_time" && (
            <span className="text-xs">🎯</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(event.start_time), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatEventTime(event)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-light text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {title}
        </CardTitle>
        {onScheduleClick && (
          <Button variant="outline" size="sm" onClick={onScheduleClick} className="gap-1">
            <Plus className="h-3 w-3" />
            Schedule
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {emptyMessage}
          </p>
        ) : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-1">
              {/* Upcoming events */}
              {upcomingEvents.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                    Upcoming
                  </p>
                  {upcomingEvents.map((event) => renderEvent(event))}
                </div>
              )}

              {/* Past events */}
              {showPastEvents && pastEvents.length > 0 && (
                <div className="space-y-1 mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                    Past
                  </p>
                  {pastEvents.slice(0, 5).map((event) => renderEvent(event, true))}
                  {pastEvents.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      + {pastEvents.length - 5} more past events
                    </p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
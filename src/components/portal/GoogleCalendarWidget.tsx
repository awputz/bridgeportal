import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  ExternalLink,
  Clock,
  RefreshCw,
  MapPin,
  Video,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay, differenceInMinutes } from "date-fns";
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";
import { useQueryClient } from "@tanstack/react-query";

export const GoogleCalendarWidget = () => {
  const queryClient = useQueryClient();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Calendar connection and data
  const { data: googleCalConnection, isLoading: calConnectionLoading } = useGoogleCalendarConnection();
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const isConnected = googleCalConnection?.calendar_enabled && !!googleCalConnection?.access_token;
  const { data: googleEvents = [], isLoading: eventsLoading, refetch: refetchEvents, isRefetching } = useGoogleCalendarEvents(startOfDay, endOfDay);
  const { data: companyEvents = [] } = useUpcomingEvents(1);
  
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();
  
  // Combine and sort events
  const todaysEvents = [...companyEvents, ...googleEvents]
    .filter(event => isSameDay(new Date(event.start_time), today))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  const isLoading = calConnectionLoading || (isConnected && eventsLoading);

  // Update last sync time when data loads
  useEffect(() => {
    if (!eventsLoading && isConnected) {
      setLastSyncTime(new Date());
    }
  }, [eventsLoading, isConnected]);

  const handleRefresh = async () => {
    await refetchEvents();
    setLastSyncTime(new Date());
  };

  const getSyncStatusText = () => {
    if (isRefetching) return 'Syncing...';
    if (!lastSyncTime) return '';
    const mins = differenceInMinutes(new Date(), lastSyncTime);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return format(lastSyncTime, 'h:mm a');
  };

  // Get meeting type icon
  const getMeetingIcon = (event: any) => {
    if (event.hangoutLink || event.location?.toLowerCase().includes('zoom') || event.location?.toLowerCase().includes('meet')) {
      return <Video className="h-3 w-3 text-blue-400" />;
    }
    if (event.location?.toLowerCase().includes('call') || event.location?.toLowerCase().includes('phone')) {
      return <Phone className="h-3 w-3 text-green-400" />;
    }
    if (event.location) {
      return <MapPin className="h-3 w-3 text-orange-400" />;
    }
    return null;
  };

  // Get event color
  const getEventColor = (event: any) => {
    const colorId = event.colorId;
    const colorMap: Record<string, string> = {
      '1': 'bg-blue-500',
      '2': 'bg-green-500',
      '3': 'bg-purple-500',
      '4': 'bg-red-500',
      '5': 'bg-yellow-500',
      '6': 'bg-orange-500',
      '7': 'bg-cyan-500',
      '8': 'bg-gray-500',
      '9': 'bg-blue-600',
      '10': 'bg-green-600',
      '11': 'bg-red-600',
    };
    return colorMap[colorId] || 'bg-emerald-500';
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card h-full">
      <CardHeader className="px-3 py-2.5 pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold">Google Calendar</span>
            {todaysEvents.length > 0 && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
                {todaysEvents.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isConnected && (
              <>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {getSyncStatusText()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleRefresh}
                  disabled={isRefetching}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", isRefetching && "animate-spin")} />
                </Button>
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-1.5 py-1 rounded hover:bg-muted/50 transition-colors"
                >
                  <span className="hidden sm:inline">View All</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <ScrollArea className="max-h-[340px]">
            {/* Not connected state */}
            {!isConnected && !isLoading && (
              <div className="mx-3 mb-3 flex flex-col items-center justify-center py-6 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Connect Calendar to see events
                </p>
                <Button 
                  size="sm" 
                  onClick={() => connectGoogle()} 
                  disabled={isConnecting}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs px-3"
                >
                  {isConnecting ? "Connecting..." : "Connect Calendar"}
                </Button>
              </div>
            )}

            {/* Loading state - 3 line skeleton */}
            {isLoading && (
              <div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="px-3 py-2.5 border-b border-border/30 last:border-b-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3.5 w-full mb-1.5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {isConnected && !isLoading && todaysEvents.length === 0 && (
              <div className="mx-3 mb-3 flex flex-col items-center justify-center py-6 bg-muted/20 rounded-lg">
                <Clock className="h-7 w-7 text-muted-foreground mb-1.5" />
                <p className="text-xs text-muted-foreground">No events today</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  {format(today, "EEEE, MMMM d")}
                </p>
              </div>
            )}

            {/* Events list - 3-line layout matching Gmail */}
            {isConnected && !isLoading && todaysEvents.length > 0 && (
              <div>
                {todaysEvents.map((event) => {
                  const eventData = event as any;
                  const eventUrl = eventData.htmlLink || `https://calendar.google.com/calendar/u/0/r/eventedit/${event.id}`;
                  const startTime = new Date(event.start_time);
                  const endTime = event.end_time ? new Date(event.end_time) : null;
                  const isPast = startTime < new Date() && (!endTime || endTime < new Date());
                  
                  return (
                    <a
                      key={event.id}
                      href={eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "block px-3 py-2.5 border-b border-border/30 last:border-b-0",
                        "hover:bg-muted/50 transition-colors cursor-pointer",
                        isPast && "opacity-60"
                      )}
                      tabIndex={0}
                      role="button"
                      aria-label={`Event: ${event.title} at ${format(startTime, "h:mm a")}`}
                    >
                      {/* Line 1: Time indicator + Time range */}
                      <div className="flex items-center gap-2 mb-0.5">
                        {/* Color indicator dot */}
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getEventColor(event))} />
                        
                        {/* Time range */}
                        <time 
                          dateTime={event.start_time}
                          className="text-xs text-muted-foreground"
                        >
                          {format(startTime, "h:mm a")}
                          {endTime && ` - ${format(endTime, "h:mm a")}`}
                        </time>
                      </div>

                      {/* Line 2: Event title */}
                      <p className="text-sm font-medium text-foreground truncate mb-0.5">
                        {event.title}
                      </p>

                      {/* Line 3: Location / Meeting type */}
                      {event.location ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {getMeetingIcon(event)}
                          <span className="truncate">{event.location}</span>
                        </div>
                      ) : (
                        <div className="h-4" /> // Placeholder for consistent row height
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </ScrollArea>
          
          {/* Scroll fade indicator */}
          {isConnected && todaysEvents.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

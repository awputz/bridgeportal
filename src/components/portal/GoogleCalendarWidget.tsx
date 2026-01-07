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
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay, differenceInMinutes } from "date-fns";
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar, useDeleteGoogleEvent, useCreateGoogleEvent } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarEventSlideOver } from "./CalendarEventSlideOver";
import { CalendarEventDialog } from "./CalendarEventDialog";
import { toast } from "sonner";

// Google Calendar color palette (unified)
const GOOGLE_COLORS: Record<string, string> = {
  "1": "border-l-[#7986cb]",
  "2": "border-l-[#33b679]",
  "3": "border-l-[#8e24aa]",
  "4": "border-l-[#e67c73]",
  "5": "border-l-[#f6bf26]",
  "6": "border-l-[#f4511e]",
  "7": "border-l-[#039be5]",
  "8": "border-l-[#616161]",
  "9": "border-l-[#3f51b5]",
  "10": "border-l-[#0b8043]",
  "11": "border-l-[#d50000]",
};

export const GoogleCalendarWidget = () => {
  const queryClient = useQueryClient();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

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
  const deleteEvent = useDeleteGoogleEvent();
  const createEvent = useCreateGoogleEvent();
  
  // Combine and sort events
  const todaysEvents = [...companyEvents, ...googleEvents]
    .filter(event => isSameDay(new Date(event.start_time), today))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  const isLoading = calConnectionLoading || (isConnected && eventsLoading);

  // Find next upcoming event within 60 minutes
  const now = new Date();
  const nextMeeting = todaysEvents.find(event => {
    const startTime = new Date(event.start_time);
    const minsUntil = differenceInMinutes(startTime, now);
    return minsUntil >= -5 && minsUntil <= 60; // Within -5 to +60 minutes
  });

  const getNextMeetingText = () => {
    if (!nextMeeting) return null;
    const startTime = new Date(nextMeeting.start_time);
    const minsUntil = differenceInMinutes(startTime, now);
    if (minsUntil <= 0) return "Starting now";
    if (minsUntil === 1) return "In 1 min";
    return `In ${minsUntil} min`;
  };

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

  // Get event border color class
  const getEventBorderColor = (event: any) => {
    const colorId = event.colorId;
    return GOOGLE_COLORS[colorId] || "border-l-emerald-500";
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(null);
    setEditingEvent(event);
  };

  const handleDeleteEvent = async (eventId: string) => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        toast.success("Event deleted");
        setSelectedEvent(null);
      },
      onError: () => {
        toast.error("Failed to delete event");
      }
    });
  };

  const handleDuplicateEvent = (event: any) => {
    setSelectedEvent(null);
    // Open create dialog with pre-filled data
    setEditingEvent({
      ...event,
      id: undefined, // Remove ID to create new
      title: `${event.title} (copy)`,
    });
  };

  const handleSaveEvent = (eventData: any) => {
    if (eventData.id) {
      // Update existing event - would need useUpdateGoogleEvent
      toast.info("Event updates coming soon");
    } else {
      // Create new event
      createEvent.mutate(eventData, {
        onSuccess: () => {
          toast.success("Event created");
          setShowCreateDialog(false);
          setEditingEvent(null);
        },
        onError: () => {
          toast.error("Failed to create event");
        }
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card h-full">
        <CardHeader className="p-3 pb-2">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowCreateDialog(true)}
                    title="Create event"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
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
          <ScrollArea className="h-[340px]">
            <div className="p-3">
              {/* Next Meeting Banner */}
              {isConnected && !isLoading && nextMeeting && (
                <div className="mb-3 p-2.5 rounded-lg bg-gcal-blue/10 border border-gcal-blue/20">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gcal-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gcal-blue"></span>
                    </span>
                    <span className="text-xs font-medium text-gcal-blue">
                      {getNextMeetingText()}
                    </span>
                    <span className="text-xs text-foreground truncate flex-1">
                      {nextMeeting.title}
                    </span>
                    {(nextMeeting as any).hangoutLink && (
                      <a
                        href={(nextMeeting as any).hangoutLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gcal-blue text-white px-2 py-0.5 rounded hover:bg-gcal-blue/90 transition-colors"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Not connected state */}
              {!isConnected && !isLoading && (
                <div className="flex flex-col items-center justify-center py-6 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
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

              {/* Loading state */}
              {isLoading && (
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="px-2.5 py-2 rounded-md border border-border/30 bg-muted/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {isConnected && !isLoading && todaysEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-lg">
                  <Clock className="h-7 w-7 text-muted-foreground mb-1.5" />
                  <p className="text-xs text-muted-foreground">No events today</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {format(today, "EEEE, MMMM d")}
                  </p>
                </div>
              )}

              {/* Events list - card layout with left border accent */}
              {isConnected && !isLoading && todaysEvents.length > 0 && (
                <div className="space-y-1.5">
                  {todaysEvents.map((event) => {
                    const eventData = event as any;
                    const startTime = new Date(event.start_time);
                    const endTime = event.end_time ? new Date(event.end_time) : null;
                    const isPast = startTime < new Date() && (!endTime || endTime < new Date());
                    const borderColorClass = getEventBorderColor(event);
                    
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(eventData)}
                        className={cn(
                          "block w-full text-left px-2.5 py-1.5 rounded-md border border-border/30 border-l-2",
                          "hover:bg-muted/50 hover:border-border/50 hover:shadow-md hover:scale-[1.02]",
                          "transition-all duration-200 cursor-pointer bg-muted/5",
                          borderColorClass,
                          isPast && "opacity-50"
                        )}
                        aria-label={`Event: ${event.title} at ${format(startTime, "h:mm a")}`}
                      >
                        {/* Line 1: Time range */}
                        <time 
                          dateTime={event.start_time}
                          className="text-[10px] text-muted-foreground block mb-px"
                        >
                          {format(startTime, "h:mm a")}
                          {endTime && ` - ${format(endTime, "h:mm a")}`}
                        </time>

                        {/* Line 2: Event title */}
                        <p className="text-xs font-medium text-foreground truncate mb-px">
                          {event.title}
                        </p>

                        {/* Line 3: Location / Meeting type */}
                        {event.location && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80">
                            {getMeetingIcon(event)}
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Event Detail Slide-Over */}
      <CalendarEventSlideOver
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
      />

      {/* Create/Edit Event Dialog */}
      <CalendarEventDialog
        open={showCreateDialog || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingEvent(null);
          }
        }}
        event={editingEvent}
        defaultDate={today}
        onSave={handleSaveEvent}
      />
    </>
  );
};

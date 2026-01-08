import { useState, useEffect, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPACING, COMPONENT_CLASSES } from "@/lib/spacing";
import { format, isSameDay, differenceInMinutes, addDays, subDays } from "date-fns";
import { useGoogleCalendarConnection, useGoogleCalendarEvents, useConnectGoogleCalendar, useDeleteGoogleEvent, useCreateGoogleEvent } from "@/hooks/useGoogleCalendar";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarEventSlideOver } from "./CalendarEventSlideOver";
import { CalendarEventDialog } from "./CalendarEventDialog";
import { CalendarWidgetMultiDayView } from "./CalendarWidgetMultiDayView";
import { toast } from "sonner";

type ViewMode = "list" | "2day" | "3day";

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
  const [viewMode, setViewMode] = useState<ViewMode>("3day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [defaultEventTime, setDefaultEventTime] = useState<Date | null>(null);

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

  // Calendar connection and data
  const { data: googleCalConnection, isLoading: calConnectionLoading } = useGoogleCalendarConnection();
  
  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    if (viewMode === "2day") {
      end.setDate(end.getDate() + 1);
    } else if (viewMode === "3day") {
      end.setDate(end.getDate() + 2);
    }
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, [selectedDate, viewMode]);
  
  const isConnected = googleCalConnection?.calendar_enabled && !!googleCalConnection?.access_token;
  const { data: googleEvents = [], isLoading: eventsLoading, refetch: refetchEvents, isRefetching } = useGoogleCalendarEvents(dateRange.start, dateRange.end);
  const { data: companyEvents = [] } = useUpcomingEvents(viewMode === "3day" ? 3 : viewMode === "2day" ? 2 : 1);
  
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogleCalendar();
  const deleteEvent = useDeleteGoogleEvent();
  const createEvent = useCreateGoogleEvent();
  
  // Combine and filter events for the current view
  const allEvents = useMemo(() => {
    return [...companyEvents, ...googleEvents]
      .filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate >= dateRange.start && eventDate <= dateRange.end;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [companyEvents, googleEvents, dateRange]);

  // For list view, show today's events only (limited to 5)
  const todaysEvents = useMemo(() => {
    return allEvents
      .filter(event => isSameDay(new Date(event.start_time), selectedDate))
      .slice(0, 5);
  }, [allEvents, selectedDate]);

  const isLoading = calConnectionLoading || (isConnected && eventsLoading);

  // Find next upcoming event within 60 minutes
  const now = new Date();
  const nextMeeting = todaysEvents.find(event => {
    const startTime = new Date(event.start_time);
    const minsUntil = differenceInMinutes(startTime, now);
    return minsUntil >= -5 && minsUntil <= 60;
  });

  const getNextMeetingText = () => {
    if (!nextMeeting) return null;
    const startTime = new Date(nextMeeting.start_time);
    const minsUntil = differenceInMinutes(startTime, now);
    if (minsUntil <= 0) return "Starting now";
    if (minsUntil === 1) return "In 1 min";
    return `In ${minsUntil} min`;
  };

  // Navigation functions
  const navigatePrevious = () => {
    const offset = viewMode === "3day" ? 3 : viewMode === "2day" ? 2 : 1;
    setSelectedDate(prev => subDays(prev, offset));
  };

  const navigateNext = () => {
    const offset = viewMode === "3day" ? 3 : viewMode === "2day" ? 2 : 1;
    setSelectedDate(prev => addDays(prev, offset));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
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

  const handleTimeSlotClick = (date: Date) => {
    setDefaultEventTime(date);
    setShowCreateDialog(true);
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
    setEditingEvent({
      ...event,
      id: undefined,
      title: `${event.title} (copy)`,
    });
  };

  const handleSaveEvent = (eventData: any) => {
    if (eventData.id) {
      toast.info("Event updates coming soon");
    } else {
      createEvent.mutate(eventData, {
        onSuccess: () => {
          toast.success("Event created");
          setShowCreateDialog(false);
          setEditingEvent(null);
          setDefaultEventTime(null);
        },
        onError: () => {
          toast.error("Failed to create event");
        }
      });
    }
  };

  const isToday = isSameDay(selectedDate, new Date());
  const dateDisplay = viewMode === "list" 
    ? format(selectedDate, "MMM d")
    : `${format(selectedDate, "MMM d")} - ${format(addDays(selectedDate, viewMode === "2day" ? 1 : 2), "d")}`;

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card h-full flex flex-col">
        <CardHeader className="p-3 pb-2 flex-shrink-0">
          <CardTitle className="flex flex-col gap-2">
            {/* Top row: Title + Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold">{format(selectedDate, "MMMM yyyy")}</span>
                <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded font-medium">
                  {timezone}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isConnected && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setDefaultEventTime(null);
                        setShowCreateDialog(true);
                      }}
                      title="Create event"
                    >
                      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
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
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-muted/50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Bottom row: Navigation + View Mode */}
            {isConnected && (
              <div className="flex items-center justify-between">
                {/* Date Navigation */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={navigatePrevious}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs font-medium",
                      isToday && "text-primary"
                    )}
                    onClick={goToToday}
                  >
                    {isToday ? "Today" : dateDisplay}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={navigateNext}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-muted/30 rounded-md p-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-5 px-2 text-[10px] rounded-sm",
                      viewMode === "list" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-3 w-3 mr-1" />
                    List
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-5 px-2 text-[10px] rounded-sm",
                      viewMode === "2day" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("2day")}
                  >
                    2D
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-5 px-2 text-[10px] rounded-sm",
                      viewMode === "3day" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("3day")}
                  >
                    3D
                  </Button>
                </div>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          {/* Not connected state */}
          {!isConnected && !isLoading && (
            <div className="flex flex-col items-center justify-center py-6 px-3 bg-emerald-500/5 mx-3 rounded-lg border border-emerald-500/10">
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
            <div className="space-y-2 p-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-3 py-2 rounded-md border border-border/30 bg-muted/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Connected content */}
          {isConnected && !isLoading && (
            <>
              {/* List View */}
              {viewMode === "list" && (
                <ScrollArea className="flex-1">
                  <div className="p-3">
                    {/* Next Meeting Banner */}
                    {nextMeeting && isSameDay(selectedDate, new Date()) && (
                      <div className="mb-3 p-3 rounded-lg bg-gcal-blue/10 border border-gcal-blue/20">
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

                    {/* Empty state */}
                    {todaysEvents.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-lg">
                        <Clock className="h-7 w-7 text-muted-foreground mb-1.5" />
                        <p className="text-xs text-muted-foreground">No events</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                          {format(selectedDate, "EEEE, MMMM d")}
                        </p>
                      </div>
                    )}

                    {/* Events list */}
                    {todaysEvents.length > 0 && (
                      <div className="space-y-2">
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
                                "block w-full text-left px-3 py-2 rounded-md border border-border/30 border-l-2",
                                "hover:bg-muted/50 hover:border-border/50 hover:shadow-md hover:scale-[1.02]",
                                "transition-all duration-200 cursor-pointer bg-muted/5",
                                borderColorClass,
                                isPast && "opacity-50"
                              )}
                              aria-label={`Event: ${event.title} at ${format(startTime, "h:mm a")}`}
                            >
                              <time 
                                dateTime={event.start_time}
                                className="text-[10px] text-muted-foreground block mb-px"
                              >
                                {format(startTime, "h:mm a")}
                                {endTime && ` - ${format(endTime, "h:mm a")}`}
                              </time>
                              <p className="text-xs font-medium text-foreground truncate mb-px">
                                {event.title}
                              </p>
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
              )}

              {/* Multi-day Views */}
              {(viewMode === "2day" || viewMode === "3day") && (
                <div className="flex-1 overflow-hidden">
                  <CalendarWidgetMultiDayView
                    days={viewMode === "2day" ? 2 : 3}
                    startDate={selectedDate}
                    events={allEvents}
                    onEventClick={handleEventClick}
                    onTimeSlotClick={handleTimeSlotClick}
                  />
                </div>
              )}
            </>
          )}
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
            setDefaultEventTime(null);
          }
        }}
        event={editingEvent}
        defaultDate={defaultEventTime || selectedDate}
        onSave={handleSaveEvent}
      />
    </>
  );
};

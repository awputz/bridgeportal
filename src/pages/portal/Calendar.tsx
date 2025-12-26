import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  Settings,
  RefreshCw,
  LayoutGrid,
  List,
  CalendarDays,
  ExternalLink,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useGoogleCalendarConnection,
  useConnectGoogleCalendar,
  useDisconnectGoogleCalendar,
  useGoogleCalendarEvents,
} from "@/hooks/useGoogleCalendar";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { hardLogout } from "@/lib/auth";
import { CalendarEventDialog } from "@/components/portal/CalendarEventDialog";
import { CalendarWeekView } from "@/components/portal/CalendarWeekView";
import { CalendarDayView } from "@/components/portal/CalendarDayView";
import { CalendarSidebar } from "@/components/portal/CalendarSidebar";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { toast } from "@/hooks/use-toast";

type ViewMode = "day" | "week" | "month" | "agenda";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultEventTime, setDefaultEventTime] = useState<string | undefined>();

  // Calculate date range for fetching events
  const dateRange = useMemo(() => {
    if (viewMode === "day") {
      return { start: selectedDate || currentDate, end: selectedDate || currentDate };
    } else if (viewMode === "week") {
      return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return { start: startOfWeek(monthStart), end: endOfWeek(monthEnd) };
    }
  }, [currentDate, viewMode, selectedDate]);

  const { data: connection, isLoading: isLoadingConnection } = useGoogleCalendarConnection();
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useGoogleCalendarEvents(dateRange.start, dateRange.end);

  const connectCalendar = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectGoogleCalendar();

  const isConnected = connection?.calendar_enabled && !!connection?.access_token;

  // Map events to dates
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events?.forEach((event) => {
      const dateKey = format(new Date(event.start_time), "yyyy-MM-dd");
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, event]);
    });
    return map;
  }, [events]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return eventsByDate.get(dateKey) || [];
  }, [selectedDate, eventsByDate]);

  // Agenda view - upcoming events
  const agendaEvents = useMemo(() => {
    if (!events) return [];
    const today = new Date();
    return events
      .filter((event) => new Date(event.start_time) >= today)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 20);
  }, [events]);

  // Get all days for month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
  }, [currentDate]);

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const navigatePrevious = () => {
    if (viewMode === "day") setCurrentDate(subDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setDefaultEventTime(time);
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setDefaultEventTime(undefined);
    setEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    // For now, show a toast - full save would require Google Calendar API write access
    toast({
      title: eventData.id ? "Event Updated" : "Event Created",
      description: `"${eventData.title}" - Note: Google Calendar write access required to sync.`,
    });
    setEventDialogOpen(false);
  };

  const getHeaderTitle = () => {
    if (viewMode === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      if (format(weekStart, "MMM") === format(weekEnd, "MMM")) {
        return `${format(weekStart, "MMMM d")} – ${format(weekEnd, "d, yyyy")}`;
      }
      return `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  };

  if (isLoadingConnection) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Checking connection...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gcal-blue flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extralight text-foreground">Google Calendar</h1>
            </div>
            <p className="text-muted-foreground font-light">Connect your Google Calendar to view and manage events</p>
          </div>

          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gcal-blue/20 to-gcal-green/20 flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-10 w-10 text-gcal-blue" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-3">Connect Your Google Calendar</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-sm mx-auto">
              View your events, schedule meetings, and stay organized with your Google Calendar.
            </p>
            <Button
              size="lg"
              onClick={() => connectCalendar.mutate()}
              disabled={connectCalendar.isPending}
              className="gap-2 bg-gcal-blue hover:bg-gcal-blue/90"
            >
              {connectCalendar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
              Connect Google Calendar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <h1 className="text-xl md:text-2xl font-light text-foreground">{getHeaderTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={goToToday} className="border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10">
              Today
            </Button>
            
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="bg-muted/30">
                <TabsTrigger value="day" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Month
                </TabsTrigger>
                <TabsTrigger value="agenda" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <List className="h-3.5 w-3.5" />
                  Agenda
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm" onClick={() => refetchEvents()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open('https://calendar.google.com', '_blank')} className="gap-2 border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => disconnectCalendar.mutate()} className="text-muted-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {eventsError && (
          <div className="mb-4 rounded-xl border border-border/50 bg-muted/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{(eventsError as Error).message}</span>
            </div>
            <Button variant="outline" size="sm" onClick={hardLogout}>Sign in again</Button>
          </div>
        )}

        {/* Main Content with Sidebar */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <CalendarSidebar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={(date) => { setSelectedDate(date); setCurrentDate(date); }}
              onCreateEvent={handleCreateEvent}
              eventsByDate={eventsByDate}
              isLoadingEvents={isLoadingEvents}
            />
          </div>

          {/* Calendar View */}
          <div className="flex-1 min-w-0">
            {viewMode === "day" && (
              <CalendarDayView
                currentDate={selectedDate || currentDate}
                events={events}
                isLoading={isLoadingEvents}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}
            
            {viewMode === "week" && (
              <CalendarWeekView
                currentDate={currentDate}
                events={events}
                isLoading={isLoadingEvents}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}

            {viewMode === "month" && (
              <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
                  ))}
                </div>
                {isLoadingEvents ? (
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(35)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const dayEvents = eventsByDate.get(dateKey) || [];
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={dateKey}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "aspect-square p-1 rounded-xl transition-all flex flex-col items-center relative",
                            !isCurrentMonth && "opacity-40",
                            isSelected && "bg-gcal-blue text-white shadow-lg",
                            !isSelected && isToday(day) && "bg-gcal-blue/10 ring-2 ring-gcal-blue ring-inset",
                            !isSelected && !isToday(day) && "hover:bg-muted/50"
                          )}
                        >
                          <span className={cn("text-sm font-medium", isToday(day) && !isSelected && "text-gcal-blue font-semibold")}>
                            {format(day, "d")}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-0.5 mt-1">
                              {dayEvents.slice(0, 3).map((_, i) => (
                                <div key={i} className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-gcal-blue")} />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {viewMode === "agenda" && (
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border/30 bg-muted/5">
                  <h2 className="text-lg font-medium">Upcoming Events</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {isLoadingEvents ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))
                  ) : agendaEvents.length === 0 ? (
                    <div className="p-8 text-center">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No upcoming events</p>
                    </div>
                  ) : (
                    agendaEvents.map((event) => (
                      <button key={event.id} onClick={() => handleEventClick(event)} className="w-full p-4 flex gap-4 hover:bg-muted/20 transition-colors text-left">
                        <div className="w-16 h-16 rounded-lg bg-gcal-blue/10 flex flex-col items-center justify-center text-gcal-blue">
                          <span className="text-xs font-medium uppercase">{format(new Date(event.start_time), "MMM")}</span>
                          <span className="text-2xl font-light">{format(new Date(event.start_time), "d")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                          {!event.all_day && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{format(new Date(event.start_time), "h:mm a")}{event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}</span>
                            </div>
                          )}
                          {event.all_day && <Badge variant="secondary" className="text-xs mt-1 bg-gcal-blue/10 text-gcal-blue">All day</Badge>}
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Dialog */}
      <CalendarEventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        defaultDate={selectedDate || undefined}
        defaultTime={defaultEventTime}
        onSave={handleSaveEvent}
      />
    </div>
  );
}

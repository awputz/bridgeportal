import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  CalendarDays,
  ExternalLink,
  CalendarClock,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Checking connection...</span>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="glass-card p-8 md:p-12 max-w-xl text-center">
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
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-border/30 bg-card shrink-0">
        {/* Top Row: Title, Navigation, Today */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gcal-blue flex items-center justify-center shrink-0">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={navigatePrevious} className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateNext} className="h-9 w-9">
                <ChevronRight className="h-5 w-5" />
              </Button>
              <h1 className="text-lg md:text-xl font-medium text-foreground">{getHeaderTitle()}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday} 
              className="border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10 h-9"
            >
              Today
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreateEvent} 
              className="gap-2 bg-gcal-blue hover:bg-gcal-blue/90 text-white h-9 hidden sm:flex"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Create</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: View Tabs, Actions */}
        <div className="flex items-center justify-between gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="bg-muted/30 h-10">
              <TabsTrigger value="day" className="gap-1.5 px-3 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <CalendarClock className="h-4 w-4" />
                <span className="hidden sm:inline">Day</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="gap-1.5 px-3 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Week</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-1.5 px-3 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Month</span>
              </TabsTrigger>
              <TabsTrigger value="agenda" className="gap-1.5 px-3 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Agenda</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => refetchEvents()} className="h-9 w-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.open('https://calendar.google.com', '_blank')} 
              className="h-9 w-9"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open('https://calendar.google.com', '_blank')}>
                  Open Google Calendar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => disconnectCalendar.mutate()}
                  className="text-destructive"
                >
                  Disconnect Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {eventsError && (
        <div className="mx-4 lg:mx-6 mt-4 rounded-xl border border-border/50 bg-muted/20 p-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{(eventsError as Error).message}</span>
            </div>
            <Button variant="outline" size="sm" onClick={hardLogout}>Sign in again</Button>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 border-r border-border/30 overflow-y-auto shrink-0">
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
        <div className="flex-1 min-w-0 overflow-hidden">
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
            <div className="h-full p-4 lg:p-6 overflow-auto">
              <div className="rounded-xl border border-border/50 bg-card p-4 lg:p-6 shadow-sm">
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-3">{day}</div>
                  ))}
                </div>
                {isLoadingEvents ? (
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(35)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
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
                            "aspect-square p-2 rounded-xl transition-all flex flex-col items-center relative",
                            !isCurrentMonth && "opacity-40",
                            isSelected && "bg-gcal-blue text-white shadow-lg",
                            !isSelected && isToday(day) && "bg-gcal-blue/10 ring-2 ring-gcal-blue ring-inset",
                            !isSelected && !isToday(day) && "hover:bg-muted/50"
                          )}
                        >
                          <span className={cn(
                            "text-sm font-medium", 
                            isToday(day) && !isSelected && "text-gcal-blue font-semibold"
                          )}>
                            {format(day, "d")}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-0.5 mt-1">
                              {dayEvents.slice(0, 3).map((_, i) => (
                                <div key={i} className={cn(
                                  "w-1.5 h-1.5 rounded-full", 
                                  isSelected ? "bg-white" : "bg-gcal-blue"
                                )} />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "agenda" && (
            <div className="h-full p-4 lg:p-6 overflow-auto">
              <div className="max-w-3xl mx-auto rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <div className="p-4 lg:p-5 border-b border-border/30 bg-muted/5">
                  <h2 className="text-lg font-medium">Upcoming Events</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {isLoadingEvents ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 lg:p-5 flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))
                  ) : agendaEvents.length === 0 ? (
                    <div className="p-12 text-center">
                      <CalendarIcon className="h-14 w-14 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-lg text-muted-foreground">No upcoming events</p>
                    </div>
                  ) : (
                    agendaEvents.map((event) => (
                      <button 
                        key={event.id} 
                        onClick={() => handleEventClick(event)} 
                        className="w-full p-4 lg:p-5 flex gap-4 hover:bg-muted/20 transition-colors text-left"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gcal-blue/10 flex flex-col items-center justify-center text-gcal-blue shrink-0">
                          <span className="text-xs font-medium uppercase">{format(new Date(event.start_time), "MMM")}</span>
                          <span className="text-2xl font-light">{format(new Date(event.start_time), "d")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate text-base">{event.title}</h4>
                          {!event.all_day && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(event.start_time), "h:mm a")}
                                {event.end_time && ` – ${format(new Date(event.end_time), "h:mm a")}`}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
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
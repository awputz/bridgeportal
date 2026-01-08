import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Loader2,
  RefreshCw,
  LayoutGrid,
  List,
  CalendarDays,
  ExternalLink,
  CalendarClock,
  Plus,
  Settings,
  Keyboard,
} from "lucide-react";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
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
  useCreateGoogleEvent,
  useUpdateGoogleEvent,
  useDeleteGoogleEvent,
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
import { Calendar3DayView } from "@/components/portal/Calendar3DayView";
import { CalendarSidebar } from "@/components/portal/CalendarSidebar";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarKeyboardShortcuts } from "@/hooks/useCalendarKeyboardShortcuts";
import { useCalendarPreferences } from "@/hooks/useCalendarPreferences";
import { KeyboardShortcutsModal } from "@/components/calendar/KeyboardShortcutsModal";
import { CalendarSettingsSheet } from "@/components/calendar/CalendarSettingsSheet";
import { CalendarSearch } from "@/components/calendar/CalendarSearch";
import { CalendarAnalytics } from "@/components/calendar/CalendarAnalytics";
import { addMinutes, differenceInMinutes } from "date-fns";

type ViewMode = "day" | "3day" | "week" | "month" | "agenda";

export default function Calendar() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? "3day" : "week");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultEventTime, setDefaultEventTime] = useState<string | undefined>();
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  
  // Calendar preferences
  const { data: preferences } = useCalendarPreferences();
  
  // Update view mode when mobile state changes
  React.useEffect(() => {
    if (isMobile && viewMode === "week") {
      setViewMode("3day");
    }
  }, [isMobile]);
  
  // Apply default view from preferences on initial load
  useEffect(() => {
    if (preferences?.default_view && !isMobile) {
      setViewMode(preferences.default_view);
    }
  }, [preferences?.default_view]);
  
  // Keyboard shortcuts
  useCalendarKeyboardShortcuts({
    onToday: () => { setCurrentDate(new Date()); setSelectedDate(new Date()); },
    onNext: () => {
      if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
      else if (viewMode === "3day") setCurrentDate(addDays(currentDate, 3));
      else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
      else setCurrentDate(addMonths(currentDate, 1));
    },
    onPrevious: () => {
      if (viewMode === "day") setCurrentDate(subDays(currentDate, 1));
      else if (viewMode === "3day") setCurrentDate(subDays(currentDate, 3));
      else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
      else setCurrentDate(subMonths(currentDate, 1));
    },
    onViewChange: setViewMode,
    onCreateEvent: () => { setSelectedEvent(null); setDefaultEventTime(undefined); setEventDialogOpen(true); },
    onOpenSearch: () => setSearchOpen(true),
    onShowHelp: () => setShortcutsModalOpen(true),
    onOpenAnalytics: () => setAnalyticsOpen(true),
    enabled: !eventDialogOpen && !settingsSheetOpen && !searchOpen,
  });

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
  const createEvent = useCreateGoogleEvent();
  const updateEvent = useUpdateGoogleEvent();
  const deleteEvent = useDeleteGoogleEvent();

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
    else if (viewMode === "3day") setCurrentDate(subDays(currentDate, 3));
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === "3day") setCurrentDate(addDays(currentDate, 3));
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
    if (!eventData.title || !eventData.start_time) return;
    
    const eventPayload = {
      title: eventData.title,
      description: eventData.description || undefined,
      start_time: eventData.start_time,
      end_time: eventData.end_time || undefined,
      all_day: eventData.all_day,
      location: eventData.location || undefined,
    };

    if (eventData.id && selectedEvent?.source === "google") {
      // Update existing Google event
      updateEvent.mutate({ eventId: eventData.id, event: eventPayload });
    } else {
      // Create new event
      createEvent.mutate(eventPayload);
    }
    setEventDialogOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent.mutate(eventId);
    setEventDialogOpen(false);
  };

  // Handle event drag-and-drop rescheduling
  const handleEventDrop = (eventId: string, newStart: Date, newEnd: Date) => {
    const event = events?.find((e) => e.id === eventId);
    if (!event || event.source !== "google") return;

    updateEvent.mutate({
      eventId,
      event: {
        title: event.title,
        start_time: newStart.toISOString(),
        end_time: newEnd.toISOString(),
        description: event.description || undefined,
        location: event.location || undefined,
        all_day: event.all_day,
      },
    });
    toast({
      title: "Event Rescheduled",
      description: `Moved to ${format(newStart, "MMM d, h:mm a")}`,
    });
  };

  const getHeaderTitle = () => {
    if (viewMode === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (viewMode === "3day") {
      const endDate = addDays(currentDate, 2);
      if (format(currentDate, "MMM") === format(endDate, "MMM")) {
        return `${format(currentDate, "MMM d")} – ${format(endDate, "d")}`;
      }
      return `${format(currentDate, "MMM d")} – ${format(endDate, "MMM d")}`;
    }
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
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Checking connection...</span>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
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
    <div className="flex-1 flex flex-col overflow-hidden bg-background min-h-0 pb-16 md:pb-0">
      {/* Mobile Header */}
      {isMobile ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/30 bg-card shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gcal-blue flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" onClick={navigatePrevious} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateNext} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-sm font-medium text-foreground truncate">{getHeaderTitle()}</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToToday} 
              className="h-8 px-2 text-xs text-gcal-blue"
            >
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={() => refetchEvents()} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">View</p>
                  <div className="grid grid-cols-5 gap-1">
                    {(["day", "3day", "week", "month", "agenda"] as ViewMode[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setViewMode(v)}
                        className={cn(
                          "p-2 rounded text-xs capitalize",
                          viewMode === v ? "bg-gcal-blue text-white" : "bg-muted/50"
                        )}
                      >
                        {v === "3day" ? "3D" : v.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open('https://calendar.google.com', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
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
      ) : (
        /* Desktop Header */
        <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3 border-b border-border/30 bg-card shrink-0">
          {/* Left: Icon + Navigation + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gcal-blue flex items-center justify-center shrink-0">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={navigatePrevious} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateNext} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-base md:text-lg font-medium text-foreground truncate">{getHeaderTitle()}</h1>
          </div>

          {/* Center: View Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="bg-muted/30 h-9">
              <TabsTrigger value="day" className="h-7 px-2.5 text-xs data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
                Day
              </TabsTrigger>
              <TabsTrigger value="3day" className="h-7 px-2.5 text-xs data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                3
              </TabsTrigger>
              <TabsTrigger value="week" className="h-7 px-2.5 text-xs data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="h-7 px-2.5 text-xs data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                Month
              </TabsTrigger>
              <TabsTrigger value="agenda" className="h-7 px-2.5 text-xs data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                <List className="h-3.5 w-3.5 mr-1.5" />
                Agenda
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToToday} 
              className="h-8 px-2.5 text-xs text-gcal-blue hover:bg-gcal-blue/10"
            >
              Today
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreateEvent} 
              className="gap-1.5 bg-gcal-blue hover:bg-gcal-blue/90 text-white h-8 px-3"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs">Create</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => refetchEvents()} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSettingsSheetOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Calendar Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShortcutsModalOpen(true)}>
                  <Keyboard className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open('https://calendar.google.com', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
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
      )}

      {eventsError && (
        <div className="mx-4 lg:mx-6 mt-4 shrink-0">
          <QueryErrorState
            error={eventsError}
            onRetry={() => refetchEvents()}
            title="Calendar sync issue"
            compact
          />
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
            events={events}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </div>

        {/* Calendar View */}
        <div className={cn("flex-1 min-w-0 flex flex-col overflow-hidden", isMobile ? "p-3" : "p-4 lg:p-6")}>
          {viewMode === "day" && (
            <CalendarDayView
              currentDate={selectedDate || currentDate}
              events={events}
              isLoading={isLoadingEvents}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
            />
          )}
          
          {viewMode === "3day" && (
            <Calendar3DayView
              currentDate={currentDate}
              events={events}
              isLoading={isLoadingEvents}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
              onNavigate={setCurrentDate}
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
            <div className="flex-1 overflow-auto min-h-0">
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

      {/* Mobile FAB for Create Event */}
      {isMobile && (
        <button
          onClick={handleCreateEvent}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-gcal-blue text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Event Dialog */}
      <CalendarEventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        defaultDate={selectedDate || undefined}
        defaultTime={defaultEventTime}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={shortcutsModalOpen}
        onOpenChange={setShortcutsModalOpen}
      />

      {/* Calendar Settings Sheet */}
      <CalendarSettingsSheet
        open={settingsSheetOpen}
        onOpenChange={setSettingsSheetOpen}
        preferences={preferences}
      />

      {/* Search */}
      <CalendarSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        events={events}
        onEventSelect={handleEventClick}
      />

      {/* Analytics */}
      <CalendarAnalytics
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
        events={events}
      />
    </div>
  );
}
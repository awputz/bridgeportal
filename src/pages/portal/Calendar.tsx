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
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { hardLogout } from "@/lib/auth";

type ViewMode = "month" | "week" | "agenda";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useGoogleCalendarConnection();
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useGoogleCalendarEvents(calendarStart, calendarEnd);

  const connectCalendar = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectGoogleCalendar();

  const isConnected = connection?.calendar_enabled && !!connection?.access_token;

  // Get all days for the calendar grid
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  // Map events to dates
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
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

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  if (isLoadingConnection) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="glass-card p-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Checking connection...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gcal-blue flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground">
                Google Calendar
              </h1>
            </div>
            <p className="text-muted-foreground font-light">Connect your Google Calendar to view and manage events</p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gcal-blue/20 to-gcal-green/20 flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-10 w-10 text-gcal-blue" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-3">Connect Your Google Calendar</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-sm mx-auto">
              View your events, schedule meetings, and stay organized with your Google Calendar.
            </p>

            {connectionError && (
              <div className="flex items-center gap-2 justify-center text-amber-400 mb-6 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Connection check failed. Try connecting anyway.</span>
              </div>
            )}

            <Button
              size="lg"
              onClick={() => connectCalendar.mutate()}
              disabled={connectCalendar.isPending}
              className="gap-2 bg-gcal-blue hover:bg-gcal-blue/90"
            >
              {connectCalendar.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  Connect Google Calendar
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground mt-6">We'll only request read permissions for your calendar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Google Calendar-style Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gcal-blue flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-foreground">Calendar</h1>
              <p className="text-sm text-muted-foreground">Your Google Calendar events</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Today Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10"
            >
              Today
            </Button>
            
            {/* View Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="hidden sm:block">
              <TabsList className="bg-muted/30">
                <TabsTrigger value="month" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Month
                </TabsTrigger>
                <TabsTrigger value="week" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Week
                </TabsTrigger>
                <TabsTrigger value="agenda" className="gap-1.5 data-[state=active]:bg-gcal-blue data-[state=active]:text-white">
                  <List className="h-3.5 w-3.5" />
                  Agenda
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm" onClick={() => refetchEvents()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="gap-2 border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open Calendar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => disconnectCalendar.mutate()}
              disabled={disconnectCalendar.isPending}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {eventsError && (
          <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Couldn't load Calendar events</p>
                  <p className="text-sm text-muted-foreground break-words">{(eventsError as Error).message}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={hardLogout} className="shrink-0">
                Sign in again
              </Button>
            </div>
          </div>
        )}

        {viewMode === "agenda" ? (
          /* Agenda View */
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
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
                  <div key={event.id} className="p-4 flex gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-gcal-blue/10 flex flex-col items-center justify-center text-gcal-blue">
                      <span className="text-xs font-medium uppercase">{format(new Date(event.start_time), "MMM")}</span>
                      <span className="text-2xl font-light">{format(new Date(event.start_time), "d")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                      {!event.all_day && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(event.start_time), "h:mm a")}
                            {event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}
                          </span>
                        </div>
                      )}
                      {event.all_day && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-gcal-blue/10 text-gcal-blue">
                          All day
                        </Badge>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Month/Week View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-light text-foreground">{format(currentMonth, "MMMM yyyy")}</h2>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {isLoadingEvents ? (
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(35)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayEvents = eventsByDate.get(dateKey) || [];
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square p-1 md:p-2 rounded-xl transition-all duration-200 flex flex-col items-center relative",
                          !isCurrentMonth && "opacity-40",
                          isSelected && "bg-gcal-blue text-white shadow-lg shadow-gcal-blue/30",
                          !isSelected && isTodayDate && "bg-gcal-blue/10 ring-2 ring-gcal-blue ring-inset",
                          !isSelected && !isTodayDate && "hover:bg-muted/50"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isTodayDate && !isSelected && "text-gcal-blue font-semibold"
                        )}>
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isSelected ? "bg-white" : "bg-gcal-blue"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Event List */}
            <div className="rounded-2xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                {selectedDate ? (
                  <>
                    <span className="text-gcal-blue">{format(selectedDate, "d")}</span>
                    <span className="text-muted-foreground font-normal">{format(selectedDate, "EEEE, MMMM")}</span>
                  </>
                ) : (
                  "Select a date"
                )}
              </h3>

              {!selectedDate ? (
                <p className="text-muted-foreground text-sm">Click on a date to view events</p>
              ) : selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No events</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Nothing scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-3 rounded-xl bg-gcal-blue/5 border-l-4 border-l-gcal-blue hover:bg-gcal-blue/10 transition-colors"
                    >
                      <h4 className="font-medium text-sm text-foreground">{event.title}</h4>
                      {!event.all_day && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(new Date(event.start_time), "h:mm a")}
                            {event.end_time && ` - ${format(new Date(event.end_time), "h:mm a")}`}
                          </span>
                        </div>
                      )}
                      {event.all_day && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-gcal-blue/10 text-gcal-blue">
                          All day
                        </Badge>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

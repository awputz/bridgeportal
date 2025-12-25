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
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  useGoogleCalendarConnection, 
  useConnectGoogleCalendar, 
  useDisconnectGoogleCalendar,
  useGoogleCalendarEvents 
} from "@/hooks/useGoogleCalendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const { data: connection, isLoading: isLoadingConnection, error: connectionError } = useGoogleCalendarConnection();
  const { data: events, isLoading: isLoadingEvents, refetch: refetchEvents } = useGoogleCalendarEvents(
    calendarStart,
    calendarEnd
  );

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
      const dateKey = format(new Date(event.start_time), 'yyyy-MM-dd');
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, event]);
    });
    return map;
  }, [events]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDate.get(dateKey) || [];
  }, [selectedDate, eventsByDate]);

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Calendar
            </h1>
            <p className="text-muted-foreground font-light">
              Connect your Google Calendar to view and manage events
            </p>
          </div>

          {/* Connect Card */}
          <div className="glass-card p-8 md:p-12 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-3">
              Connect Your Google Calendar
            </h2>
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
              className="gap-2"
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

            <p className="text-xs text-muted-foreground mt-6">
              We'll only request read permissions for your calendar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
              Calendar
            </h1>
            <p className="text-muted-foreground font-light">
              Your Google Calendar events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchEvents()} 
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 glass-card p-4 md:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-light">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEvents = eventsByDate.get(dateKey) || [];
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "aspect-square p-1 md:p-2 rounded-lg transition-all duration-200 flex flex-col items-center",
                        !isCurrentMonth && "opacity-40",
                        isSelected && "bg-primary text-primary-foreground",
                        !isSelected && isTodayDate && "bg-accent",
                        !isSelected && !isTodayDate && "hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isTodayDate && !isSelected && "text-primary"
                      )}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isSelected ? "bg-primary-foreground" : "bg-primary"
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
          <div className="glass-card p-4 md:p-6">
            <h3 className="text-lg font-light mb-4">
              {selectedDate 
                ? format(selectedDate, 'EEEE, MMMM d')
                : 'Select a date'
              }
            </h3>
            
            {!selectedDate ? (
              <p className="text-muted-foreground text-sm">
                Click on a date to view events
              </p>
            ) : selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">No events on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    {!event.all_day && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(event.start_time), 'h:mm a')}
                          {event.end_time && ` - ${format(new Date(event.end_time), 'h:mm a')}`}
                        </span>
                      </div>
                    )}
                    {event.all_day && (
                      <Badge variant="secondary" className="text-xs mb-1">
                        All day
                      </Badge>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
      </div>
    </div>
  );
}

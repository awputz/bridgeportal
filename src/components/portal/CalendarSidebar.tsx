import { useState } from "react";
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
} from "date-fns";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Calendar,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useCalendarAnalytics } from "@/hooks/useCalendarAnalytics";

interface CalendarSidebarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onCreateEvent: () => void;
  eventsByDate: Map<string, CalendarEvent[]>;
  calendars?: { id: string; name: string; color: string; enabled: boolean }[];
  onToggleCalendar?: (calendarId: string) => void;
  isLoadingEvents?: boolean;
  events?: CalendarEvent[];
  onOpenSearch?: () => void;
}

export function CalendarSidebar({
  currentDate,
  selectedDate,
  onDateSelect,
  onCreateEvent,
  eventsByDate,
  calendars = [],
  onToggleCalendar,
  isLoadingEvents,
  events = [],
  onOpenSearch,
}: CalendarSidebarProps) {
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(currentDate);
  const stats = useCalendarAnalytics(events);

  // Calculate mini calendar days
  const monthStart = startOfMonth(miniCalendarMonth);
  const monthEnd = endOfMonth(miniCalendarMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Default calendars if none provided
  const defaultCalendars = calendars.length > 0 ? calendars : [
    { id: "primary", name: "My Calendar", color: "#4285f4", enabled: true },
    { id: "google", name: "Google Calendar", color: "#0b8043", enabled: true },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Create Button */}
      <Button
        onClick={onCreateEvent}
        size="lg"
        className="w-full gap-2 shadow-lg bg-white hover:bg-gray-50 text-gray-700 border border-border/50 hover:shadow-xl transition-all rounded-full"
      >
        <Plus className="h-5 w-5 text-gcal-blue" />
        <span className="font-medium">Create</span>
      </Button>

      {/* Quick Search */}
      {onOpenSearch && (
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground flex-1">Search events...</span>
          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">/</kbd>
        </button>
      )}

      {/* Mini Calendar */}
      <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMiniCalendarMonth(subMonths(miniCalendarMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(miniCalendarMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMiniCalendarMonth(addMonths(miniCalendarMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const hasEvents = eventsByDate.has(dateKey) && (eventsByDate.get(dateKey)?.length || 0) > 0;
            const isCurrentMonth = isSameMonth(day, miniCalendarMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={dateKey}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "h-7 w-7 text-xs rounded-full flex items-center justify-center transition-all relative",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isSelected && "bg-gcal-blue text-white",
                  !isSelected && isTodayDate && "bg-gcal-blue/20 text-gcal-blue font-semibold",
                  !isSelected && !isTodayDate && isCurrentMonth && "hover:bg-muted text-foreground",
                  !isSelected && !isTodayDate && !isCurrentMonth && "hover:bg-muted"
                )}
              >
                {format(day, "d")}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gcal-blue" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Stats Widget */}
      <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-foreground">📊 This Week</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Events</span>
            </div>
            <span className="font-medium text-foreground">{stats.weeklyEvents}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>In meetings</span>
            </div>
            <span className="font-medium text-foreground">{stats.weeklyHours}h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-purple-500" />
              <span>Focus time</span>
            </div>
            <span className="font-medium text-foreground">{stats.focusTimeHours}h</span>
          </div>
        </div>
      </div>

      {/* My Calendars */}
      <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">My calendars</span>
          {isLoadingEvents && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1">
          {defaultCalendars.map((calendar) => (
            <button
              key={calendar.id}
              onClick={() => onToggleCalendar?.(calendar.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded flex items-center justify-center border-2",
                  calendar.enabled ? "border-transparent" : "border-muted-foreground/30"
                )}
                style={{
                  backgroundColor: calendar.enabled ? calendar.color : "transparent",
                }}
              >
                {calendar.enabled && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-foreground flex-1 truncate">
                {calendar.name}
              </span>
              {calendar.enabled ? (
                <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Other calendars */}
      <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Other calendars</span>
        </div>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left">
            <div
              className="w-4 h-4 rounded flex items-center justify-center border-2 border-transparent"
              style={{ backgroundColor: "#f6bf26" }}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-foreground flex-1">Holidays</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left">
            <div
              className="w-4 h-4 rounded flex items-center justify-center border-2 border-transparent"
              style={{ backgroundColor: "#e67c73" }}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-foreground flex-1">Birthdays</span>
          </button>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-gcal-blue/30 text-gcal-blue hover:bg-gcal-blue/10"
          onClick={() => {
            const today = new Date();
            setMiniCalendarMonth(today);
            onDateSelect(today);
          }}
        >
          Go to today
        </Button>
      </div>
    </div>
  );
}

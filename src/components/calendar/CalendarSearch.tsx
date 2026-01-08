import { useState, useEffect, useRef } from "react";
import { Search, Calendar, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useCalendarSearch } from "@/hooks/useCalendarSearch";
import { cn } from "@/lib/utils";

interface CalendarSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}

export function CalendarSearch({
  open,
  onOpenChange,
  events,
  onEventSelect,
}: CalendarSearchProps) {
  const {
    query,
    setQuery,
    results,
    clearSearch,
    getRecentSearches,
    addRecentSearch,
  } = useCalendarSearch({ events });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    } else {
      clearSearch();
    }
  }, [open, getRecentSearches, clearSearch]);

  const handleSelect = (event: CalendarEvent) => {
    if (query.trim()) {
      addRecentSearch(query);
    }
    onEventSelect(event);
    onOpenChange(false);
  };

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search events..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() === "" && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((search) => (
              <CommandItem
                key={search}
                onSelect={() => handleRecentSearch(search)}
                className="cursor-pointer"
              >
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                {search}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query.trim() !== "" && results.length === 0 && (
          <CommandEmpty>No events found.</CommandEmpty>
        )}

        {results.length > 0 && (
          <CommandGroup heading={`${results.length} event${results.length !== 1 ? "s" : ""} found`}>
            {results.slice(0, 10).map((event) => (
              <CommandItem
                key={event.id}
                onSelect={() => handleSelect(event)}
                className="cursor-pointer py-3"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-gcal-blue/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-gcal-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.start_time), "MMM d, h:mm a")}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.all_day && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      All day
                    </Badge>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query.trim() === "" && recentSearches.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Search by event title, description, or location</p>
            <p className="text-xs mt-1">Press <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> to close</p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}

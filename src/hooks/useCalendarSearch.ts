import { useState, useMemo, useCallback } from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";

interface SearchFilters {
  query: string;
  dateRange?: { start: Date; end: Date };
  eventType?: "all" | "meeting" | "focus_time" | "all_day";
}

interface UseCalendarSearchOptions {
  events: CalendarEvent[];
  debounceMs?: number;
}

export function useCalendarSearch({ events, debounceMs = 300 }: UseCalendarSearchOptions) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Omit<SearchFilters, "query">>({});

  const results = useMemo(() => {
    if (!query.trim() && !filters.dateRange && !filters.eventType) {
      return [];
    }

    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);

    return events.filter((event) => {
      // Text search
      if (searchTerms.length > 0) {
        const searchableText = [
          event.title,
          event.description,
          event.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchTerms.every((term) =>
          searchableText.includes(term)
        );
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const eventDate = new Date(event.start_time);
        if (
          eventDate < filters.dateRange.start ||
          eventDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      // Event type filter
      if (filters.eventType && filters.eventType !== "all") {
        if (filters.eventType === "all_day" && !event.all_day) return false;
        if (filters.eventType === "focus_time" && event.event_type !== "focus_time") return false;
        if (filters.eventType === "meeting" && event.all_day) return false;
      }

      return true;
    });
  }, [events, query, filters]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setFilters({});
  }, []);

  // Get recent searches from localStorage
  const getRecentSearches = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem("calendar-recent-searches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const addRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const recent = getRecentSearches();
    const updated = [
      searchQuery,
      ...recent.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    
    localStorage.setItem("calendar-recent-searches", JSON.stringify(updated));
  }, [getRecentSearches]);

  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem("calendar-recent-searches");
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    clearSearch,
    getRecentSearches,
    addRecentSearch,
    clearRecentSearches,
    hasActiveSearch: query.trim().length > 0 || !!filters.dateRange || !!filters.eventType,
  };
}

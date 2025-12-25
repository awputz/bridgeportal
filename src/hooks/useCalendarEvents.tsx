import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  all_day: boolean;
  event_type: string;
  location: string | null;
  created_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // For Google Calendar events
  source?: "company" | "google";
  calendar_id?: string;
}

export interface CreateCalendarEvent {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  all_day?: boolean;
  event_type?: string;
  location?: string;
}

export const useCalendarEvents = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["calendar-events", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("calendar_events")
        .select("*")
        .eq("is_active", true)
        .order("start_time", { ascending: true });

      if (startDate) {
        query = query.gte("start_time", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("start_time", endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Mark all events as company events
      return (data || []).map(event => ({
        ...event,
        source: "company" as const,
      })) as CalendarEvent[];
    },
  });
};

export const useUpcomingEvents = (days: number = 7) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return useQuery({
    queryKey: ["calendar-events", "upcoming", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("is_active", true)
        .gte("start_time", now.toISOString())
        .lte("start_time", futureDate.toISOString())
        .order("start_time", { ascending: true })
        .limit(10);

      if (error) throw error;
      return (data || []).map(event => ({
        ...event,
        source: "company" as const,
      })) as CalendarEvent[];
    },
  });
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CreateCalendarEvent) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          ...event,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast({
        title: "Event Created",
        description: "Calendar event has been added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CalendarEvent> & { id: string }) => {
      const { data, error } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast({
        title: "Event Updated",
        description: "Calendar event has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("calendar_events")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast({
        title: "Event Deleted",
        description: "Calendar event has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    },
  });
};

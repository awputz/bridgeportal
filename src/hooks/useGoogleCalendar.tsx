import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarEvent } from "./useCalendarEvents";
import { invokeWithAuthHandling } from "@/lib/auth";

interface GoogleToken {
  user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
  calendar_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useGoogleCalendarConnection = () => {
  return useQuery({
    queryKey: ["google-calendar-connection"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_google_tokens")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking calendar connection:", error);
        return null;
      }

      return data as GoogleToken | null;
    },
    staleTime: 30000,
  });
};

export const useGoogleCalendarEvents = (startDate?: Date, endDate?: Date) => {
  const { data: connection } = useGoogleCalendarConnection();

  return useQuery({
    queryKey: ["google-calendar-events", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async (): Promise<CalendarEvent[]> => {
      if (!connection?.access_token || !connection.calendar_enabled) {
        return [];
      }

      const { data, error } = await invokeWithAuthHandling<{ events: any[] }>(
        "google-calendar-events",
        {
          body: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
          },
        }
      );

      if (error) throw error;

      return (data?.events || []).map((event: any) => ({
        id: event.id,
        title: event.summary || "Untitled",
        description: event.description || null,
        start_time: event.start?.dateTime || event.start?.date,
        end_time: event.end?.dateTime || event.end?.date || null,
        all_day: !!event.start?.date,
        event_type: "personal",
        location: event.location || null,
        created_by: null,
        is_active: true,
        created_at: event.created,
        updated_at: event.updated,
        source: "google" as const,
        calendar_id: event.calendarId,
      }));
    },
    enabled: !!connection?.access_token && connection.calendar_enabled,
  });
};

export const useConnectGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await invokeWithAuthHandling<{ url: string }>(
        "google-calendar-auth",
        {
          body: { action: "get-auth-url" },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error("Failed to get auth URL");

      // Open popup for OAuth
      const popup = window.open(data.url, "_blank", "width=500,height=600");

      // Poll for popup close and refetch connection
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            queryClient.invalidateQueries({ queryKey: ["google-calendar-connection"] });
            queryClient.invalidateQueries({ queryKey: ["google-calendar-events"] });
            resolve({ success: true });
          }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          resolve({ success: true });
        }, 300000);
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Google Calendar",
        variant: "destructive",
      });
    },
  });
};

export const useDisconnectGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Use maybeSingle to handle case where no row exists
      const { data: existing } = await supabase
        .from("user_google_tokens")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_google_tokens")
          .update({
            calendar_enabled: false,
            access_token: null,
            refresh_token: null,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar-connection"] });
      queryClient.invalidateQueries({ queryKey: ["google-calendar-events"] });
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect",
        variant: "destructive",
      });
    },
  });
};

export const useToggleGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_google_tokens")
        .update({ calendar_enabled: enabled })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar-connection"] });
      toast({
        title: enabled ? "Calendar Enabled" : "Calendar Disabled",
        description: enabled
          ? "Google Calendar events will now appear."
          : "Google Calendar events are hidden.",
      });
    },
  });
};


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CalendarPreferences {
  user_id: string;
  default_view: 'day' | '3day' | 'week' | 'month' | 'agenda';
  week_starts_on: number;
  time_format: '12h' | '24h';
  working_hours_start: string;
  working_hours_end: string;
  working_days: number[];
  default_event_duration: number;
  default_reminder_minutes: number;
  show_weekends: boolean;
  show_declined_events: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultPreferences: Omit<CalendarPreferences, 'user_id'> = {
  default_view: 'week',
  week_starts_on: 0,
  time_format: '12h',
  working_hours_start: '09:00',
  working_hours_end: '18:00',
  working_days: [1, 2, 3, 4, 5],
  default_event_duration: 60,
  default_reminder_minutes: 15,
  show_weekends: true,
  show_declined_events: false,
};

export const useCalendarPreferences = () => {
  return useQuery({
    queryKey: ["calendar-preferences"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("calendar_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Return merged with defaults if data exists, otherwise just defaults
      if (data) {
        return data as CalendarPreferences;
      }
      
      return { ...defaultPreferences, user_id: user.id } as CalendarPreferences;
    },
  });
};

export const useUpdateCalendarPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<Omit<CalendarPreferences, 'user_id' | 'created_at' | 'updated_at'>>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("calendar_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-preferences"] });
      toast({
        title: "Preferences Saved",
        description: "Your calendar settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    },
  });
};

export { defaultPreferences };

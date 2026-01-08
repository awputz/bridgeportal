import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface HRReminder {
  id: string;
  user_id: string;
  reminder_date: string;
  message: string;
  related_agent_id: string | null;
  is_completed: boolean;
  created_at: string;
  hr_agents?: {
    full_name: string;
  } | null;
}

export function useHRReminders() {
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ["hr-reminders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("hr_reminders")
        .select(`
          *,
          hr_agents (full_name)
        `)
        .eq("user_id", user.id)
        .order("reminder_date", { ascending: true });

      if (error) throw error;
      return data as HRReminder[];
    },
  });

  const upcomingReminders = reminders.filter(
    (r) => !r.is_completed && new Date(r.reminder_date) >= new Date()
  );

  const createReminder = useMutation({
    mutationFn: async (reminder: {
      reminder_date: string;
      message: string;
      related_agent_id?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("hr_reminders")
        .insert({
          user_id: user.id,
          ...reminder,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-reminders"] });
      toast({ title: "Reminder created" });
    },
    onError: (error) => {
      toast({ title: "Failed to create reminder", description: error.message, variant: "destructive" });
    },
  });

  const completeReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from("hr_reminders")
        .update({ is_completed: true })
        .eq("id", reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-reminders"] });
      toast({ title: "Reminder completed" });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from("hr_reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-reminders"] });
      toast({ title: "Reminder deleted" });
    },
  });

  return {
    reminders,
    upcomingReminders,
    isLoading,
    createReminder,
    completeReminder,
    deleteReminder,
  };
}

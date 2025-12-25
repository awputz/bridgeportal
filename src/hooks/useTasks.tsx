import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  activity_type: string;
  contact_id: string | null;
  deal_id: string | null;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  priority: string;
  reminder_at: string | null;
  recurring_pattern: string | null;
  is_all_day: boolean;
  category: string;
  contact?: { full_name: string } | null;
  deal?: { property_address: string } | null;
}

export const useTasks = (filter?: "today" | "week" | "overdue" | "completed" | "all") => {
  return useQuery({
    queryKey: ["tasks", filter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("crm_activities")
        .select(`
          *,
          contact:crm_contacts(full_name),
          deal:crm_deals(property_address)
        `)
        .eq("agent_id", user.id)
        .order("due_date", { ascending: true, nullsFirst: false });

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString();

      switch (filter) {
        case "today":
          query = query
            .eq("is_completed", false)
            .gte("due_date", todayStart)
            .lt("due_date", todayEnd);
          break;
        case "week":
          query = query
            .eq("is_completed", false)
            .gte("due_date", todayStart)
            .lt("due_date", weekEnd);
          break;
        case "overdue":
          query = query
            .eq("is_completed", false)
            .lt("due_date", todayStart);
          break;
        case "completed":
          query = query.eq("is_completed", true);
          break;
        default:
          // All tasks
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Task[];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<Task, "id" | "created_at" | "completed_at" | "contact" | "deal">) => {
      const { data, error } = await supabase
        .from("crm_activities")
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
      toast.success("Task created");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("crm_activities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
    },
    onError: (error) => {
      toast.error("Failed to update task: " + error.message);
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from("crm_activities")
        .update({ 
          is_completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
      toast.success("Task completed!");
    },
    onError: (error) => {
      toast.error("Failed to complete task: " + error.message);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("crm_activities")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete task: " + error.message);
    },
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: ["task-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString();

      const [todayResult, weekResult, overdueResult, completedResult] = await Promise.all([
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .eq("is_completed", false)
          .gte("due_date", todayStart)
          .lt("due_date", todayEnd),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .eq("is_completed", false)
          .gte("due_date", todayStart)
          .lt("due_date", weekEnd),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .eq("is_completed", false)
          .lt("due_date", todayStart),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact" })
          .eq("agent_id", user.id)
          .eq("is_completed", true),
      ]);

      return {
        today: todayResult.count || 0,
        thisWeek: weekResult.count || 0,
        overdue: overdueResult.count || 0,
        completed: completedResult.count || 0,
      };
    },
  });
};

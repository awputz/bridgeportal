import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface TemplateData {
  title_pattern?: string;
  duration?: number;
  color?: string;
  event_type?: string;
  location?: string;
  description?: string;
  reminders?: number[];
}

export interface CalendarTemplate {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  template_data: TemplateData;
  is_shared: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export const useCalendarTemplates = () => {
  return useQuery({
    queryKey: ["calendar-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_templates")
        .select("*")
        .order("usage_count", { ascending: false });

      if (error) throw error;
      return (data || []).map(t => ({
        ...t,
        template_data: t.template_data as unknown as TemplateData,
      })) as CalendarTemplate[];
    },
  });
};

export const useCreateCalendarTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: {
      name: string;
      description?: string;
      template_data: TemplateData;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("calendar_templates")
        .insert({
          user_id: user.id,
          name: template.name,
          description: template.description,
          template_data: template.template_data as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-templates"] });
      toast({ title: "Template Created", description: "Your template has been saved." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateCalendarTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, template_data, ...updates }: Partial<CalendarTemplate> & { id: string }) => {
      const updatePayload = {
        ...updates,
        ...(template_data && { template_data: template_data as Json }),
      };
      const { data, error } = await supabase
        .from("calendar_templates")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-templates"] });
      toast({ title: "Template Updated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteCalendarTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("calendar_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-templates"] });
      toast({ title: "Template Deleted" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};

export const useIncrementTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: template } = await supabase
        .from("calendar_templates")
        .select("usage_count")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("calendar_templates")
        .update({ usage_count: (template?.usage_count || 0) + 1 })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-templates"] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface HREmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useHREmailTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["hr-email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hr_email_templates")
        .select("*")
        .eq("is_active", true)
        .order("template_type", { ascending: true });

      if (error) throw error;
      return data as HREmailTemplate[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<HREmailTemplate, "id" | "created_at" | "updated_at" | "is_active">) => {
      const { data, error } = await supabase
        .from("hr_email_templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-email-templates"] });
      toast({ title: "Template created" });
    },
    onError: (error) => {
      toast({ title: "Failed to create template", description: error.message, variant: "destructive" });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HREmailTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("hr_email_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-email-templates"] });
      toast({ title: "Template updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update template", description: error.message, variant: "destructive" });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hr_email_templates")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-email-templates"] });
      toast({ title: "Template deleted" });
    },
  });

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

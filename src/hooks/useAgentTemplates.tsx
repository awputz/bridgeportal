import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  division: string;
  file_url: string;
  file_type: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useAgentTemplates = (division?: string) => {
  return useQuery({
    queryKey: ["agent-templates", division],
    queryFn: async () => {
      let query = supabase
        .from("agent_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (division) {
        query = query.eq("division", division);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }

      return data as AgentTemplate[];
    },
  });
};

export const useAllAgentTemplates = () => {
  return useQuery({
    queryKey: ["agent-templates-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_templates")
        .select("*")
        .order("division")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching all templates:", error);
        throw error;
      }

      return data as AgentTemplate[];
    },
  });
};

export const useAgentTemplateMutations = () => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<AgentTemplate, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("agent_templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      queryClient.invalidateQueries({ queryKey: ["agent-templates-all"] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AgentTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("agent_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      queryClient.invalidateQueries({ queryKey: ["agent-templates-all"] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agent_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      queryClient.invalidateQueries({ queryKey: ["agent-templates-all"] });
    },
  });

  return { createTemplate, updateTemplate, deleteTemplate };
};

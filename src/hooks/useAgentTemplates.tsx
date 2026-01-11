import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FormSchema, TemplateCategory } from "@/types/templates";
import type { Json } from "@/integrations/supabase/types";

export interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  division: string;
  file_url: string;
  file_type: string | null;
  display_order: number | null;
  is_active: boolean | null;
  is_fillable: boolean;
  form_schema: FormSchema | null;
  fill_count: number;
  download_count: number;
  category: TemplateCategory | null;
  version: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Helper to safely cast database row to AgentTemplate
const mapRowToTemplate = (row: {
  id: string;
  name: string;
  description: string | null;
  division: string;
  file_url: string;
  file_type: string | null;
  display_order: number | null;
  is_active: boolean | null;
  is_fillable: boolean | null;
  form_schema: Json | null;
  fill_count: number | null;
  download_count: number | null;
  category?: string | null;
  version?: string | null;
  created_at: string | null;
  updated_at: string | null;
}): AgentTemplate => ({
  ...row,
  is_fillable: row.is_fillable ?? false,
  form_schema: row.form_schema as unknown as FormSchema | null,
  fill_count: row.fill_count ?? 0,
  download_count: row.download_count ?? 0,
  category: (row.category as TemplateCategory) ?? null,
  version: row.version ?? null,
});

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
        // Include templates for this division OR 'all' divisions
        query = query.or(`division.eq.${division},division.eq.all`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }

      return (data ?? []).map(mapRowToTemplate);
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

      return (data ?? []).map(mapRowToTemplate);
    },
  });
};

export const useAgentTemplateMutations = () => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<AgentTemplate, "id" | "created_at" | "updated_at">) => {
      const { form_schema, ...rest } = template;
      const { data, error } = await supabase
        .from("agent_templates")
        .insert([{
          ...rest,
          form_schema: form_schema as unknown as Json,
        }])
        .select()
        .single();

      if (error) throw error;
      return mapRowToTemplate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      queryClient.invalidateQueries({ queryKey: ["agent-templates-all"] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AgentTemplate> & { id: string }) => {
      const { form_schema, ...rest } = updates;
      // Build update object compatible with Supabase types
      const updateData = {
        ...rest,
        ...(form_schema !== undefined ? { form_schema: form_schema as unknown as Json } : {}),
      };
      
      const { data, error } = await supabase
        .from("agent_templates")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapRowToTemplate(data);
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

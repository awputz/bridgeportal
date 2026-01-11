import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TemplateCategoryInfo } from "@/types/templates";

export const useTemplateCategories = () => {
  return useQuery({
    queryKey: ["template-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching template categories:", error);
        throw error;
      }

      return (data ?? []) as TemplateCategoryInfo[];
    },
  });
};

export const useTemplatesByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["agent-templates", "category", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from("agent_templates")
        .select("*")
        .eq("category", categoryId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching templates by category:", error);
        throw error;
      }

      return data ?? [];
    },
    enabled: !!categoryId,
  });
};

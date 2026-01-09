import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketingTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: string;
  thumbnail_url: string | null;
  design_data: Record<string, unknown> | null;
  is_featured: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export const useMarketingTemplates = (category?: string) => {
  return useQuery({
    queryKey: ["marketing-templates", category],
    queryFn: async () => {
      let query = supabase
        .from("marketing_templates")
        .select("*")
        .order("name", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketingTemplate[];
    },
  });
};

export const useFeaturedTemplates = () => {
  return useQuery({
    queryKey: ["marketing-templates", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_templates")
        .select("*")
        .eq("is_featured", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as MarketingTemplate[];
    },
  });
};

export const useMarketingTemplate = (id: string) => {
  return useQuery({
    queryKey: ["marketing-template", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_templates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as MarketingTemplate;
    },
    enabled: !!id,
  });
};

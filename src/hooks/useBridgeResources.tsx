import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BridgeResource {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string | null;
  body_content: string | null;
  external_url: string | null;
  metadata: Record<string, unknown> | null;
  display_order: number | null;
  is_active: boolean | null;
}

export const useBridgeResources = (category?: string) => {
  return useQuery({
    queryKey: ["bridge-resources", category],
    queryFn: async () => {
      let query = supabase
        .from("bridge_resources")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BridgeResource[];
    },
  });
};

export const useBridgeResourceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["bridge-resource", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_resources")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BridgeResource | null;
    },
    enabled: !!slug,
  });
};

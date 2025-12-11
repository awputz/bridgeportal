import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BridgePageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
  display_order: number | null;
  is_active: boolean | null;
}

export const useBridgePageContent = (pageSlug: string) => {
  return useQuery({
    queryKey: ["bridge-page-content", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_pages")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as BridgePageContent[];
    },
    enabled: !!pageSlug,
  });
};

export const useBridgePageSection = (pageSlug: string, sectionKey: string) => {
  return useQuery({
    queryKey: ["bridge-page-section", pageSlug, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_pages")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("section_key", sectionKey)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BridgePageContent | null;
    },
    enabled: !!pageSlug && !!sectionKey,
  });
};

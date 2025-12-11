import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BridgeBuilding {
  id: string;
  slug: string;
  name: string;
  address: string;
  borough: string | null;
  neighborhood: string | null;
  unit_count: number | null;
  description: string | null;
  tags: string[] | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

export const useBridgeBuildings = (borough?: string) => {
  return useQuery({
    queryKey: ["bridge-buildings", borough],
    queryFn: async () => {
      let query = supabase
        .from("bridge_buildings")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (borough) {
        query = query.eq("borough", borough);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BridgeBuilding[];
    },
  });
};

export const useBridgeBuilding = (slug: string) => {
  return useQuery({
    queryKey: ["bridge-building", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_buildings")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BridgeBuilding | null;
    },
    enabled: !!slug,
  });
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BridgeCalculator {
  id: string;
  slug: string;
  service_slug: string;
  calculator_type: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  input_config: Record<string, unknown> | null;
  output_description: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

export const useBridgeCalculators = (serviceSlug?: string) => {
  return useQuery({
    queryKey: ["bridge-calculators", serviceSlug],
    queryFn: async () => {
      let query = supabase
        .from("bridge_calculators")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (serviceSlug) {
        query = query.eq("service_slug", serviceSlug);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BridgeCalculator[];
    },
    enabled: true,
  });
};

export const useBridgeCalculator = (slug: string) => {
  return useQuery({
    queryKey: ["bridge-calculator", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_calculators")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BridgeCalculator | null;
    },
    enabled: !!slug,
  });
};

export const useBridgeCalculatorBySection = (serviceSlug: string, sectionKey: string) => {
  return useQuery({
    queryKey: ["bridge-calculator-section", serviceSlug, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_calculators")
        .select("*")
        .eq("service_slug", serviceSlug)
        .eq("section_key", sectionKey)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BridgeCalculator | null;
    },
    enabled: !!serviceSlug && !!sectionKey,
  });
};

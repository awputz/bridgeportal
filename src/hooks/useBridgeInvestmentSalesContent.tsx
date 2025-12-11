import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for Investment Sales CMS content
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ClientProfile {
  type: string;
  description: string;
}

export interface BoroughData {
  name: string;
  focus: string;
  stats: string;
  neighborhoods: string;
}

export interface AssetTypeData {
  name: string;
  description: string;
  buyer_profile: string;
}

export interface PricingMetric {
  label: string;
  value: string;
  trend: string;
}

interface PageSection {
  page_slug: string;
  section_key: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, any> | null;
}

// Fetch all Investment Sales page sections
export function useInvestmentSalesContent(pageSlug: string) {
  return useQuery({
    queryKey: ["investment-sales-content", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_pages")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as PageSection[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get a specific section from Investment Sales content
export function useInvestmentSalesSection(pageSlug: string, sectionKey: string) {
  return useQuery({
    queryKey: ["investment-sales-section", pageSlug, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_pages")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("section_key", sectionKey)
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as PageSection | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch the investment deals email from settings
export function useInvestmentDealsEmail() {
  return useQuery({
    queryKey: ["investment-deals-email"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_settings")
        .select("value")
        .eq("key", "investmentDealsEmail")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      // Parse the JSON value - it's stored as a quoted string
      const email = data?.value ? JSON.parse(JSON.stringify(data.value)).replace(/"/g, '') : "alex@bridgenyre.com";
      return email as string;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Helper to get typed metadata from a section
export function getSectionMetadata<T>(section: PageSection | null | undefined): T | null {
  if (!section?.metadata) return null;
  return section.metadata as T;
}

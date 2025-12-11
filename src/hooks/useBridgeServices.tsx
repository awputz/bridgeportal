import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DIVISIONS, NAV_ITEMS } from "@/lib/constants";

export interface BridgeService {
  id: string;
  name: string;
  slug: string;
  path: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

// Fallback data from constants
const FALLBACK_SERVICES: BridgeService[] = Object.entries(DIVISIONS).map(([key, division], index) => ({
  id: key,
  name: division.name,
  slug: key.replace(/([A-Z])/g, '-$1').toLowerCase(),
  path: division.path,
  tagline: division.tagline,
  description: division.description,
  icon: null,
  display_order: index + 1,
  is_active: true,
}));

export const useBridgeServices = () => {
  return useQuery({
    queryKey: ["bridge-services"],
    queryFn: async (): Promise<BridgeService[]> => {
      const { data, error } = await supabase
        .from("bridge_services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.warn("Failed to fetch bridge services, using fallback:", error);
        return FALLBACK_SERVICES;
      }

      if (!data || data.length === 0) {
        return FALLBACK_SERVICES;
      }

      return data.map((service) => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        path: service.path,
        tagline: service.tagline,
        description: service.description,
        icon: service.icon,
        display_order: service.display_order ?? 0,
        is_active: service.is_active ?? true,
      }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Helper to get service nav items (for Navigation component)
export const useBridgeServiceNavItems = () => {
  const { data, ...rest } = useBridgeServices();

  const navItems = data?.map((service) => ({
    name: service.name,
    path: service.path,
  })) || NAV_ITEMS.services.items;

  return {
    ...rest,
    data: {
      label: "Services",
      items: navItems,
    },
  };
};

// Helper to get a specific service by slug
export const useBridgeServiceBySlug = (slug: string) => {
  const { data, ...rest } = useBridgeServices();
  return {
    ...rest,
    data: data?.find((service) => service.slug === slug),
  };
};

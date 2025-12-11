import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LISTINGS_ITEMS } from "@/lib/constants";

export interface BridgeListingLink {
  id: string;
  name: string;
  category: string;
  url: string;
  parent_id: string | null;
  is_external: boolean;
  display_order: number;
  is_active: boolean;
}

export interface ListingNavItem {
  name: string;
  url?: string;
  external?: boolean;
  nested?: boolean;
  items?: { name: string; url: string; external: boolean }[];
}

export interface ListingNavData {
  label: string;
  items: ListingNavItem[];
}

export const useBridgeListingLinks = () => {
  return useQuery({
    queryKey: ["bridge-listing-links"],
    queryFn: async (): Promise<BridgeListingLink[]> => {
      const { data, error } = await supabase
        .from("bridge_listing_links")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.warn("Failed to fetch bridge listing links:", error);
        return [];
      }

      return (data || []).map((link) => ({
        id: link.id,
        name: link.name,
        category: link.category,
        url: link.url,
        parent_id: link.parent_id,
        is_external: link.is_external ?? true,
        display_order: link.display_order ?? 0,
        is_active: link.is_active ?? true,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Helper to get listing links in nav format (for Navigation component)
export const useBridgeListingNavItems = (): { data: ListingNavData | undefined; isLoading: boolean } => {
  const { data, isLoading } = useBridgeListingLinks();

  if (!data || data.length === 0) {
    return {
      data: LISTINGS_ITEMS as ListingNavData,
      isLoading,
    };
  }

  // Separate parent items (no parent_id) from children
  const parentItems = data.filter((link) => !link.parent_id);
  const childItems = data.filter((link) => link.parent_id);

  const navItems: ListingNavItem[] = parentItems.map((parent) => {
    const children = childItems.filter((child) => child.parent_id === parent.id);

    if (children.length > 0) {
      return {
        name: parent.name,
        nested: true,
        items: children.map((child) => ({
          name: child.name,
          url: child.url,
          external: child.is_external,
        })),
      };
    }

    return {
      name: parent.name,
      url: parent.url,
      external: parent.is_external,
    };
  });

  return {
    data: {
      label: "Listings",
      items: navItems,
    },
    isLoading,
  };
};

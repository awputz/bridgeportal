import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BoroughStats {
  avgPricePerUnit: string;
  capRate: string;
  volume: string;
}

export interface BoroughMetadata {
  neighborhoods: string[];
  stats: BoroughStats;
}

export interface AssetTypeMetadata {
  icon: string;
  subtitle: string;
  highlights: string[];
  buyers: string[];
}

export interface BridgeMarket {
  id: string;
  type: "borough" | "asset_type";
  name: string;
  slug: string;
  description: string | null;
  metadata: BoroughMetadata | AssetTypeMetadata | null;
  display_order: number;
  is_active: boolean;
}

export interface BridgeBorough extends BridgeMarket {
  type: "borough";
  metadata: BoroughMetadata | null;
}

export interface BridgeAssetType extends BridgeMarket {
  type: "asset_type";
  metadata: AssetTypeMetadata | null;
}

export const useBridgeMarkets = () => {
  return useQuery({
    queryKey: ["bridge-markets"],
    queryFn: async (): Promise<BridgeMarket[]> => {
      const { data, error } = await supabase
        .from("bridge_markets")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.warn("Failed to fetch bridge markets:", error);
        return [];
      }

      return (data || []).map((market) => ({
        id: market.id,
        type: market.type as "borough" | "asset_type",
        name: market.name,
        slug: market.slug,
        description: market.description,
        metadata: market.metadata as unknown as BoroughMetadata | AssetTypeMetadata | null,
        display_order: market.display_order ?? 0,
        is_active: market.is_active ?? true,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Helper to get only boroughs
export const useBridgeBoroughs = () => {
  const { data, ...rest } = useBridgeMarkets();
  return {
    ...rest,
    data: (data?.filter((m) => m.type === "borough") || []) as BridgeBorough[],
  };
};

// Helper to get only asset types
export const useBridgeAssetTypes = () => {
  const { data, ...rest } = useBridgeMarkets();
  return {
    ...rest,
    data: (data?.filter((m) => m.type === "asset_type") || []) as BridgeAssetType[],
  };
};

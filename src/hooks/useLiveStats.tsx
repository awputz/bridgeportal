import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LiveStats {
  transactionCount: number;
  teamCount: number;
  totalVolume: number;
  yearsExperience: number;
}

export const useLiveStats = () => {
  return useQuery({
    queryKey: ["live-stats"],
    queryFn: async (): Promise<LiveStats> => {
      // Fetch transaction count
      const { count: transactionCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      // Fetch team count
      const { count: teamCount } = await supabase
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Fetch total sales volume
      const { data: volumeData } = await supabase
        .from("transactions")
        .select("sale_price");

      const totalVolume = volumeData?.reduce(
        (sum, t) => sum + (t.sale_price || 0),
        0
      ) || 0;

      return {
        transactionCount: transactionCount || 0,
        teamCount: teamCount || 0,
        totalVolume,
        yearsExperience: 15, // Static for now, could come from settings
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

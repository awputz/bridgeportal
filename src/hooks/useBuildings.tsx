import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "./useProperties";

export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_represented_building", true)
        .eq("status", "active")
        .order("address", { ascending: true });

      if (error) throw error;
      return data as Property[];
    },
  });
};

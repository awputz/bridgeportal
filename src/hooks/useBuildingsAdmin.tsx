import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Building = Tables<"bridge_buildings">;

export function useBuildingsAdmin() {
  const queryClient = useQueryClient();

  const { data: buildings, isLoading } = useQuery({
    queryKey: ["admin-buildings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_buildings")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Building[];
    },
  });

  const createBuilding = useMutation({
    mutationFn: async (building: TablesInsert<"bridge_buildings">) => {
      const { error } = await supabase.from("bridge_buildings").insert(building);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buildings"] });
      toast({ title: "Building created" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create building", description: error.message, variant: "destructive" });
    },
  });

  const updateBuilding = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"bridge_buildings">) => {
      const { error } = await supabase
        .from("bridge_buildings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buildings"] });
      toast({ title: "Building updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteBuilding = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bridge_buildings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buildings"] });
      toast({ title: "Building deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("bridge_buildings")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-buildings"] });
      toast({ title: "Building status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  return {
    buildings,
    isLoading,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    toggleActive,
  };
}

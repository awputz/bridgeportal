import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type DealStage = Tables<"crm_deal_stages">;

export function useDealStagesAdmin() {
  const queryClient = useQueryClient();

  const { data: stages, isLoading } = useQuery({
    queryKey: ["admin-deal-stages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_deal_stages")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as DealStage[];
    },
  });

  const createStage = useMutation({
    mutationFn: async (stage: TablesInsert<"crm_deal_stages">) => {
      const { error } = await supabase.from("crm_deal_stages").insert(stage);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-stages"] });
      toast({ title: "Stage created" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create stage", description: error.message, variant: "destructive" });
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"crm_deal_stages">) => {
      const { error } = await supabase
        .from("crm_deal_stages")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-stages"] });
      toast({ title: "Stage updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteStage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_deal_stages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-stages"] });
      toast({ title: "Stage deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("crm_deal_stages")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-stages"] });
      toast({ title: "Stage status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  return {
    stages,
    isLoading,
    createStage,
    updateStage,
    deleteStage,
    toggleActive,
  };
}

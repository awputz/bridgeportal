import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExternalTool {
  id: string;
  name: string;
  description: string | null;
  url: string;
  icon: string;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export const useExternalTools = () => {
  return useQuery({
    queryKey: ["external-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("external_tools")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching external tools:", error);
        throw error;
      }

      return data as ExternalTool[];
    },
  });
};

export const useAllExternalTools = () => {
  return useQuery({
    queryKey: ["external-tools-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("external_tools")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching all external tools:", error);
        throw error;
      }

      return data as ExternalTool[];
    },
  });
};

export const useExternalToolMutations = () => {
  const queryClient = useQueryClient();

  const createTool = useMutation({
    mutationFn: async (tool: Omit<ExternalTool, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("external_tools")
        .insert(tool)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-tools"] });
      queryClient.invalidateQueries({ queryKey: ["external-tools-all"] });
    },
  });

  const updateTool = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExternalTool> & { id: string }) => {
      const { data, error } = await supabase
        .from("external_tools")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-tools"] });
      queryClient.invalidateQueries({ queryKey: ["external-tools-all"] });
    },
  });

  const deleteTool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("external_tools")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-tools"] });
      queryClient.invalidateQueries({ queryKey: ["external-tools-all"] });
    },
  });

  return { createTool, updateTool, deleteTool };
};

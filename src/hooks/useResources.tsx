import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  body_content: string | null;
  external_url: string | null;
  metadata: Json | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useResources = () => {
  return useQuery({
    queryKey: ["bridge_resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_resources")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Resource[];
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: Omit<Resource, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("bridge_resources")
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bridge_resources"] });
      toast({
        title: "Resource created",
        description: "The resource has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create resource",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Resource> & { id: string }) => {
      const { data, error } = await supabase
        .from("bridge_resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bridge_resources"] });
      toast({
        title: "Resource updated",
        description: "Changes saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bridge_resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bridge_resources"] });
      toast({
        title: "Resource deleted",
        description: "The resource has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    },
  });
};

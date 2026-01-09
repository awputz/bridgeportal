import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MarketingAsset {
  id: string;
  agent_id: string;
  name: string;
  type: string;
  file_url: string | null;
  metadata: Record<string, unknown> | null;
  is_default: boolean;
  created_at: string;
}

export type CreateAssetInput = {
  name: string;
  type: string;
  file_url?: string;
  metadata?: Record<string, unknown>;
  is_default?: boolean;
};

export const useMarketingAssets = (type?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["marketing-assets", user?.id, type],
    queryFn: async () => {
      let query = supabase
        .from("marketing_assets")
        .select("*")
        .eq("agent_id", user!.id)
        .order("created_at", { ascending: false });

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketingAsset[];
    },
    enabled: !!user?.id,
  });
};

export const useUploadMarketingAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ file, name, type }: { file: File; name: string; type: string }) => {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("marketing-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("marketing-assets")
        .getPublicUrl(fileName);

      // Create asset record
      const { data, error } = await supabase
        .from("marketing_assets")
        .insert({
          agent_id: user!.id,
          name,
          type,
          file_url: urlData.publicUrl,
          metadata: {
            original_name: file.name,
            size: file.size,
            mime_type: file.type,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data as MarketingAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-assets"] });
      toast.success("Asset uploaded");
    },
    onError: (error) => {
      toast.error("Failed to upload asset");
      console.error("Upload asset error:", error);
    },
  });
};

export const useDeleteMarketingAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: MarketingAsset) => {
      // Delete from storage if file_url exists
      if (asset.file_url) {
        const path = asset.file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("marketing-assets").remove([path]);
      }

      // Delete record
      const { error } = await supabase
        .from("marketing_assets")
        .delete()
        .eq("id", asset.id);

      if (error) throw error;
      return asset.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-assets"] });
      toast.success("Asset deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete asset");
      console.error("Delete asset error:", error);
    },
  });
};

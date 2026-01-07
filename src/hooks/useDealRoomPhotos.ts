import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleQueryError } from "@/lib/errorHandler";

export interface DealRoomPhoto {
  id: string;
  deal_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  category: string;
  is_primary: boolean;
  uploaded_by: string | null;
  created_at: string;
}

/**
 * Fetch all photos for a deal
 */
export const useDealRoomPhotos = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-photos", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_photos")
        .select("*")
        .eq("deal_id", dealId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as DealRoomPhoto[];
    },
    enabled: !!dealId,
  });
};

/**
 * Get primary photo for a deal (for card display)
 */
export const useDealRoomPrimaryPhoto = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-primary-photo", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_photos")
        .select("*")
        .eq("deal_id", dealId)
        .eq("is_primary", true)
        .maybeSingle();

      if (error) throw error;
      
      // If no primary photo, get the first photo
      if (!data) {
        const { data: firstPhoto } = await supabase
          .from("deal_room_photos")
          .select("*")
          .eq("deal_id", dealId)
          .order("display_order", { ascending: true })
          .limit(1)
          .maybeSingle();
        
        return firstPhoto as DealRoomPhoto | null;
      }
      
      return data as DealRoomPhoto;
    },
    enabled: !!dealId,
  });
};

/**
 * Upload a photo to a deal
 */
export const useUploadDealRoomPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      file,
      caption,
      category = "exterior",
      isPrimary = false,
    }: {
      dealId: string;
      file: File;
      caption?: string;
      category?: string;
      isPrimary?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current photo count for display order
      const { count } = await supabase
        .from("deal_room_photos")
        .select("*", { count: "exact", head: true })
        .eq("deal_id", dealId);

      // Upload file to storage
      const filePath = `${user.id}/${dealId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("deal-room-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("deal-room-photos")
        .getPublicUrl(filePath);

      // If this is set as primary, unset other primary photos
      if (isPrimary) {
        await supabase
          .from("deal_room_photos")
          .update({ is_primary: false })
          .eq("deal_id", dealId);
      }

      // Insert photo record
      const { data, error } = await supabase
        .from("deal_room_photos")
        .insert({
          deal_id: dealId,
          image_url: publicUrl,
          caption: caption || null,
          category,
          is_primary: isPrimary || (count === 0), // First photo is auto-primary
          display_order: count || 0,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update deal's primary_image_url if this is the primary
      if (isPrimary || (count === 0)) {
        await supabase
          .from("crm_deals")
          .update({ primary_image_url: publicUrl })
          .eq("id", dealId);
      }

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-primary-photo", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-deal", dealId] });
      toast.success("Photo uploaded");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Upload multiple photos at once
 */
export const useUploadDealRoomPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      files,
      category = "exterior",
    }: {
      dealId: string;
      files: File[];
      category?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current photo count for display order
      const { count } = await supabase
        .from("deal_room_photos")
        .select("*", { count: "exact", head: true })
        .eq("deal_id", dealId);

      const results = [];
      const isFirstBatch = (count || 0) === 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${user.id}/${dealId}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("deal-room-photos")
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("deal-room-photos")
          .getPublicUrl(filePath);

        const isPrimary = isFirstBatch && i === 0;

        const { data, error } = await supabase
          .from("deal_room_photos")
          .insert({
            deal_id: dealId,
            image_url: publicUrl,
            category,
            is_primary: isPrimary,
            display_order: (count || 0) + i,
            uploaded_by: user.id,
          })
          .select()
          .single();

        if (!error && data) {
          results.push(data);

          // Set first photo as primary image on deal
          if (isPrimary) {
            await supabase
              .from("crm_deals")
              .update({ primary_image_url: publicUrl })
              .eq("id", dealId);
          }
        }
      }

      return results;
    },
    onSuccess: (data, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-primary-photo", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-deal", dealId] });
      toast.success(`${data.length} photo${data.length !== 1 ? "s" : ""} uploaded`);
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Set a photo as primary
 */
export const useSetPrimaryPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, photoId }: { dealId: string; photoId: string }) => {
      // Unset all primary
      await supabase
        .from("deal_room_photos")
        .update({ is_primary: false })
        .eq("deal_id", dealId);

      // Set new primary
      const { data, error } = await supabase
        .from("deal_room_photos")
        .update({ is_primary: true })
        .eq("id", photoId)
        .select()
        .single();

      if (error) throw error;

      // Update deal's primary_image_url
      await supabase
        .from("crm_deals")
        .update({ primary_image_url: data.image_url })
        .eq("id", dealId);

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-primary-photo", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-deal", dealId] });
      toast.success("Primary photo updated");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Update photo details
 */
export const useUpdateDealRoomPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      photoId,
      caption,
      category,
      dealId,
    }: {
      photoId: string;
      caption?: string;
      category?: string;
      dealId: string;
    }) => {
      const updates: Record<string, unknown> = {};
      if (caption !== undefined) updates.caption = caption;
      if (category !== undefined) updates.category = category;

      const { data, error } = await supabase
        .from("deal_room_photos")
        .update(updates)
        .eq("id", photoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
      toast.success("Photo updated");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Delete a photo
 */
export const useDeleteDealRoomPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoId, dealId }: { photoId: string; dealId: string }) => {
      // Get photo info first
      const { data: photo } = await supabase
        .from("deal_room_photos")
        .select("*")
        .eq("id", photoId)
        .single();

      // Delete from database
      const { error } = await supabase
        .from("deal_room_photos")
        .delete()
        .eq("id", photoId);

      if (error) throw error;

      // If this was the primary photo, set another as primary
      if (photo?.is_primary) {
        const { data: nextPhoto } = await supabase
          .from("deal_room_photos")
          .select("*")
          .eq("deal_id", dealId)
          .order("display_order", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (nextPhoto) {
          await supabase
            .from("deal_room_photos")
            .update({ is_primary: true })
            .eq("id", nextPhoto.id);

          await supabase
            .from("crm_deals")
            .update({ primary_image_url: nextPhoto.image_url })
            .eq("id", dealId);
        } else {
          await supabase
            .from("crm_deals")
            .update({ primary_image_url: null })
            .eq("id", dealId);
        }
      }

      return { success: true };
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-primary-photo", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-deal", dealId] });
      toast.success("Photo deleted");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Reorder photos
 */
export const useReorderDealRoomPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, photoIds }: { dealId: string; photoIds: string[] }) => {
      // Update each photo's display_order
      const updates = photoIds.map((id, index) => 
        supabase
          .from("deal_room_photos")
          .update({ display_order: index })
          .eq("id", id)
      );

      await Promise.all(updates);
      return { success: true };
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-photos", dealId] });
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

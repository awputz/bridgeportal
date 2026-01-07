import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleQueryError } from "@/lib/errorHandler";

// ========== Types ==========

export interface DealRoomDeal {
  id: string;
  property_address: string;
  borough: string | null;
  neighborhood: string | null;
  tenant_legal_name: string | null;
  value: number | null;
  gross_sf: number | null;
  deal_type: string;
  property_type: string | null;
  division: string;
  stage_id: string | null;
  agent_id: string;
  deal_room_notes: string | null;
  om_file_url: string | null;
  om_file_name: string | null;
  deal_room_visibility: string;
  last_deal_room_update: string | null;
  updated_at: string;
  created_at: string;
  is_off_market: boolean;
  // Joined data
  stage?: { name: string; color: string } | null;
  agent?: { full_name: string; avatar_url: string | null } | null;
}

export interface DealRoomComment {
  id: string;
  deal_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: { full_name: string; avatar_url: string | null } | null;
  replies?: DealRoomComment[];
}

export interface DealRoomInterest {
  id: string;
  deal_id: string;
  user_id: string;
  interest_type: string;
  message: string | null;
  created_at: string;
  // Joined data
  user?: { full_name: string; avatar_url: string | null } | null;
}

export interface DealRoomActivity {
  id: string;
  deal_id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
  // Joined data
  user?: { full_name: string; avatar_url: string | null } | null;
}

export interface DealRoomFile {
  id: string;
  deal_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
  // Joined data
  uploader?: { full_name: string } | null;
}

export interface DealRoomFilters {
  division?: string;
  agentId?: string;
  propertyType?: string;
  search?: string;
}

export interface DealRoomStats {
  total: number;
  newThisWeek: number;
  byDivision: Record<string, number>;
}

// ========== Query Hooks ==========

/**
 * Fetch all off-market deals visible to the team
 */
export const useDealRoomDeals = (filters?: DealRoomFilters) => {
  return useQuery({
    queryKey: ["deal-room-deals", filters],
    queryFn: async () => {
      let query = supabase
        .from("crm_deals")
        .select(`
          id,
          property_address,
          borough,
          neighborhood,
          tenant_legal_name,
          value,
          gross_sf,
          deal_type,
          property_type,
          division,
          stage_id,
          agent_id,
          deal_room_notes,
          om_file_url,
          om_file_name,
          deal_room_visibility,
          last_deal_room_update,
          updated_at,
          created_at,
          is_off_market,
          stage:crm_deal_stages(name, color)
        `)
        .eq("is_off_market", true)
        .eq("is_active", true)
        .in("deal_room_visibility", ["team", "public"])
        .order("last_deal_room_update", { ascending: false, nullsFirst: false });

      if (filters?.division) {
        query = query.eq("division", filters.division);
      }
      if (filters?.agentId) {
        query = query.eq("agent_id", filters.agentId);
      }
      if (filters?.propertyType) {
        query = query.eq("property_type", filters.propertyType);
      }
      if (filters?.search) {
        query = query.or(`property_address.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%,tenant_legal_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch agent profiles separately
      const agentIds = [...new Set((data || []).map(d => d.agent_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", agentIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return (data || []).map(deal => ({
        ...deal,
        agent: profileMap.get(deal.agent_id) || null,
      })) as DealRoomDeal[];
    },
  });
};

/**
 * Fetch a single deal room deal with full details
 */
export const useDealRoomDeal = (id: string) => {
  return useQuery({
    queryKey: ["deal-room-deal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          id,
          property_address,
          borough,
          neighborhood,
          tenant_legal_name,
          value,
          gross_sf,
          deal_type,
          property_type,
          division,
          stage_id,
          agent_id,
          deal_room_notes,
          om_file_url,
          om_file_name,
          deal_room_visibility,
          last_deal_room_update,
          updated_at,
          created_at,
          is_off_market,
          stage:crm_deal_stages(name, color)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Fetch agent profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", data.agent_id)
        .maybeSingle();

      return {
        ...data,
        agent: profile || null,
      } as DealRoomDeal;
    },
    enabled: !!id,
  });
};

/**
 * Fetch comments for a deal with threading
 */
export const useDealRoomComments = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-comments", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_comments")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch user profiles
      const userIds = [...new Set((data || []).map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Map comments with user data
      const comments = (data || []).map(c => ({
        ...c,
        user: profileMap.get(c.user_id) || null,
      })) as DealRoomComment[];

      // Group into threads
      const threads = comments.filter(c => !c.parent_id);
      threads.forEach(thread => {
        thread.replies = comments.filter(c => c.parent_id === thread.id);
      });

      return threads;
    },
    enabled: !!dealId,
  });
};

/**
 * Fetch interests for a deal
 */
export const useDealRoomInterests = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-interests", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_interests")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles
      const userIds = [...new Set((data || []).map(i => i.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return (data || []).map(interest => ({
        ...interest,
        user: profileMap.get(interest.user_id) || null,
      })) as DealRoomInterest[];
    },
    enabled: !!dealId,
  });
};

/**
 * Fetch activity log for a deal
 */
export const useDealRoomActivity = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-activity", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_activity")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles
      const userIds = [...new Set((data || []).map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return (data || []).map(activity => ({
        ...activity,
        user: profileMap.get(activity.user_id) || null,
      })) as DealRoomActivity[];
    },
    enabled: !!dealId,
  });
};

/**
 * Fetch additional files for a deal
 */
export const useDealRoomFiles = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-room-files", dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_files")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch uploader profiles
      const uploaderIds = [...new Set((data || []).filter(f => f.uploaded_by).map(f => f.uploaded_by!))];
      const { data: profiles } = uploaderIds.length > 0
        ? await supabase.from("profiles").select("id, full_name").in("id", uploaderIds)
        : { data: [] };

      const profileMap = new Map((profiles || []).map(p => [p.id, p] as const));

      return (data || []).map(file => ({
        ...file,
        uploader: file.uploaded_by ? profileMap.get(file.uploaded_by) || null : null,
      })) as DealRoomFile[];
    },
    enabled: !!dealId,
  });
};

/**
 * Dashboard stats for deal room
 */
export const useDealRoomStats = () => {
  return useQuery({
    queryKey: ["deal-room-stats"],
    queryFn: async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("crm_deals")
        .select("id, division, last_deal_room_update")
        .eq("is_off_market", true)
        .eq("is_active", true)
        .in("deal_room_visibility", ["team", "public"]);

      if (error) throw error;

      const deals = data || [];
      const byDivision: Record<string, number> = {};
      let newThisWeek = 0;

      deals.forEach(deal => {
        byDivision[deal.division] = (byDivision[deal.division] || 0) + 1;
        if (deal.last_deal_room_update && new Date(deal.last_deal_room_update) > oneWeekAgo) {
          newThisWeek++;
        }
      });

      return {
        total: deals.length,
        newThisWeek,
        byDivision,
      } as DealRoomStats;
    },
  });
};

/**
 * Current user's deals shared to deal room
 */
export const useMyDealRoomDeals = () => {
  return useQuery({
    queryKey: ["my-deal-room-deals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          id,
          property_address,
          borough,
          neighborhood,
          tenant_legal_name,
          value,
          gross_sf,
          deal_type,
          property_type,
          division,
          stage_id,
          agent_id,
          deal_room_notes,
          om_file_url,
          om_file_name,
          deal_room_visibility,
          last_deal_room_update,
          updated_at,
          created_at,
          is_off_market,
          stage:crm_deal_stages(name, color)
        `)
        .eq("agent_id", user.id)
        .eq("is_off_market", true)
        .eq("is_active", true)
        .order("last_deal_room_update", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as DealRoomDeal[];
    },
  });
};

/**
 * Agent's CRM deals NOT yet shared to deal room
 */
export const useAgentShareableDeals = () => {
  return useQuery({
    queryKey: ["agent-shareable-deals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          id,
          property_address,
          borough,
          neighborhood,
          value,
          deal_type,
          property_type,
          division,
          stage:crm_deal_stages(name, color)
        `)
        .eq("agent_id", user.id)
        .eq("is_off_market", false)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// ========== Mutation Hooks ==========

/**
 * Share a deal to the deal room
 */
export const useShareDealToRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      notes,
      visibility = "team",
      omFile,
    }: {
      dealId: string;
      notes?: string;
      visibility?: string;
      omFile?: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let omFileUrl: string | null = null;
      let omFileName: string | null = null;

      // Upload OM file if provided
      if (omFile) {
        const filePath = `${dealId}/${Date.now()}-${omFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("deal-room-files")
          .upload(filePath, omFile);

        if (uploadError) throw uploadError;

        const { data: signedData } = await supabase.storage
          .from("deal-room-files")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

        omFileUrl = signedData?.signedUrl || null;
        omFileName = omFile.name;
      }

      // Update the deal
      const { data, error } = await supabase
        .from("crm_deals")
        .update({
          is_off_market: true,
          deal_room_notes: notes || null,
          om_file_url: omFileUrl,
          om_file_name: omFileName,
          deal_room_visibility: visibility,
          last_deal_room_update: new Date().toISOString(),
        })
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from("deal_room_activity").insert({
        deal_id: dealId,
        user_id: user.id,
        action: "shared",
        details: { notes_length: notes?.length || 0, has_om: !!omFile },
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-deals"] });
      queryClient.invalidateQueries({ queryKey: ["my-deal-room-deals"] });
      queryClient.invalidateQueries({ queryKey: ["agent-shareable-deals"] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-stats"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Deal shared to Deal Room");

      // Trigger AI matching in background
      supabase.functions.invoke("match-deals", {
        body: { deal_id: variables.dealId },
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["deal-matches", variables.dealId] });
        queryClient.invalidateQueries({ queryKey: ["deal-match-count", variables.dealId] });
      }).catch((err) => {
        console.error("Failed to trigger deal matching:", err);
      });
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Update deal room notes/visibility
 */
export const useUpdateDealRoomDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      notes,
      visibility,
    }: {
      dealId: string;
      notes?: string;
      visibility?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates: Record<string, unknown> = {
        last_deal_room_update: new Date().toISOString(),
      };
      if (notes !== undefined) updates.deal_room_notes = notes;
      if (visibility !== undefined) updates.deal_room_visibility = visibility;

      const { data, error } = await supabase
        .from("crm_deals")
        .update(updates)
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from("deal_room_activity").insert({
        deal_id: dealId,
        user_id: user.id,
        action: "updated",
        details: { updated_fields: Object.keys(updates) },
      });

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-deals"] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-deal", dealId] });
      queryClient.invalidateQueries({ queryKey: ["my-deal-room-deals"] });
      toast.success("Deal updated");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Remove deal from deal room
 */
export const useRemoveFromDealRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const { data, error } = await supabase
        .from("crm_deals")
        .update({
          is_off_market: false,
          deal_room_visibility: "team",
        })
        .eq("id", dealId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-deals"] });
      queryClient.invalidateQueries({ queryKey: ["my-deal-room-deals"] });
      queryClient.invalidateQueries({ queryKey: ["agent-shareable-deals"] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-stats"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Removed from Deal Room");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Add a comment to a deal
 */
export const useAddDealRoomComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      comment,
      isInternal = true,
      parentId,
      mentionedUsers,
    }: {
      dealId: string;
      comment: string;
      isInternal?: boolean;
      parentId?: string;
      mentionedUsers?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current user's profile for notification messages
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data, error } = await supabase
        .from("deal_room_comments")
        .insert({
          deal_id: dealId,
          user_id: user.id,
          comment,
          is_internal: isInternal,
          parent_id: parentId || null,
          mentioned_users: mentionedUsers || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Get deal info for notifications
      const { data: deal } = await supabase
        .from("crm_deals")
        .select("property_address, agent_id")
        .eq("id", dealId)
        .single();

      const commenterName = userProfile?.full_name || "Someone";
      const propertyAddress = deal?.property_address || "a deal";

      // Create notifications for mentioned users
      if (mentionedUsers?.length) {
        const mentionNotifications = mentionedUsers
          .filter((userId) => userId !== user.id)
          .map((userId) => ({
            agent_id: userId,
            type: "deal_room_mention",
            title: `${commenterName} mentioned you`,
            message: `In deal: ${propertyAddress}`,
            action_url: `/portal/deal-room?deal=${dealId}`,
            is_read: false,
          }));

        if (mentionNotifications.length > 0) {
          await supabase.from("notifications").insert(mentionNotifications);
        }
      }

      // Notify deal owner if commenter is not the owner
      if (deal?.agent_id && deal.agent_id !== user.id) {
        await supabase.from("notifications").insert({
          agent_id: deal.agent_id,
          type: "deal_room_comment",
          title: "New comment on your deal",
          message: `${commenterName} commented on ${propertyAddress}`,
          action_url: `/portal/deal-room?deal=${dealId}`,
          is_read: false,
        });
      }

      // Log activity
      await supabase.from("deal_room_activity").insert({
        deal_id: dealId,
        user_id: user.id,
        action: "comment_added",
        details: { is_reply: !!parentId, mentions_count: mentionedUsers?.length || 0 },
      });

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-comments", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-activity", dealId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Comment added");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Update own comment
 */
export const useUpdateDealRoomComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      comment,
      dealId,
    }: {
      commentId: string;
      comment: string;
      dealId: string;
    }) => {
      const { data, error } = await supabase
        .from("deal_room_comments")
        .update({ comment, updated_at: new Date().toISOString() })
        .eq("id", commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-comments", dealId] });
      toast.success("Comment updated");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Delete own comment
 */
export const useDeleteDealRoomComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      dealId,
    }: {
      commentId: string;
      dealId: string;
    }) => {
      const { error } = await supabase
        .from("deal_room_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-comments", dealId] });
      toast.success("Comment deleted");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Upload additional file to a deal
 */
export const useUploadDealRoomFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      file,
    }: {
      dealId: string;
      file: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const filePath = `${dealId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("deal-room-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: signedData } = await supabase.storage
        .from("deal-room-files")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      const { data, error } = await supabase
        .from("deal_room_files")
        .insert({
          deal_id: dealId,
          file_url: signedData?.signedUrl || "",
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from("deal_room_activity").insert({
        deal_id: dealId,
        user_id: user.id,
        action: "file_uploaded",
        details: { file_name: file.name, file_size: file.size },
      });

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-files", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-activity", dealId] });
      toast.success("File uploaded");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Delete a file
 */
export const useDeleteDealRoomFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      dealId,
    }: {
      fileId: string;
      dealId: string;
    }) => {
      const { error } = await supabase
        .from("deal_room_files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-files", dealId] });
      toast.success("File deleted");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Express interest in a deal
 */
export const useExpressInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      interestType,
      message,
    }: {
      dealId: string;
      interestType: string;
      message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current user's profile for notification message
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data, error } = await supabase
        .from("deal_room_interests")
        .insert({
          deal_id: dealId,
          user_id: user.id,
          interest_type: interestType,
          message: message || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Get deal info for notifications
      const { data: deal } = await supabase
        .from("crm_deals")
        .select("property_address, agent_id")
        .eq("id", dealId)
        .single();

      const interestedUserName = userProfile?.full_name || "Someone";
      const propertyAddress = deal?.property_address || "a deal";

      // Notify deal owner if expresser is not the owner
      if (deal?.agent_id && deal.agent_id !== user.id) {
        await supabase.from("notifications").insert({
          agent_id: deal.agent_id,
          type: "deal_room_interest",
          title: "New interest in your deal",
          message: `${interestedUserName} expressed ${interestType} interest in ${propertyAddress}`,
          action_url: `/portal/deal-room?deal=${dealId}`,
          is_read: false,
        });
      }

      // Log activity
      await supabase.from("deal_room_activity").insert({
        deal_id: dealId,
        user_id: user.id,
        action: "interest_expressed",
        details: { interest_type: interestType },
      });

      return data;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-interests", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-room-activity", dealId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Interest expressed");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

/**
 * Remove interest from a deal
 */
export const useRemoveInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interestId,
      dealId,
    }: {
      interestId: string;
      dealId: string;
    }) => {
      const { error } = await supabase
        .from("deal_room_interests")
        .delete()
        .eq("id", interestId);

      if (error) throw error;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-room-interests", dealId] });
      toast.success("Interest removed");
    },
    onError: (error: unknown) => {
      toast.error(handleQueryError(error));
    },
  });
};

// ========== Agent List Hook ==========

export interface AgentProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

/**
 * Fetch list of all agents for @mentions
 */
export const useAgentsList = () => {
  return useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .order("full_name");

      if (error) throw error;
      return (data || []) as AgentProfile[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ========== Types ==========

export interface DealMatch {
  id: string;
  deal_id: string;
  contact_id: string;
  match_score: number;
  match_reasons: string[];
  ai_summary: string | null;
  is_dismissed: boolean;
  is_contacted: boolean;
  contacted_at: string | null;
  contacted_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  contact?: {
    id: string;
    full_name: string;
    company: string | null;
    contact_type: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface ContactDealMatch extends DealMatch {
  deal?: {
    id: string;
    property_address: string;
    borough: string | null;
    neighborhood: string | null;
    value: number | null;
    gross_sf: number | null;
    property_type: string | null;
  } | null;
}

// ========== Query Hooks ==========

/**
 * Fetch AI-generated matches for a deal
 */
export const useDealMatches = (dealId: string, showDismissed = false) => {
  return useQuery({
    queryKey: ["deal-matches", dealId, showDismissed],
    queryFn: async () => {
      let query = supabase
        .from("deal_matches")
        .select("*")
        .eq("deal_id", dealId)
        .order("match_score", { ascending: false });

      if (!showDismissed) {
        query = query.eq("is_dismissed", false);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch contact details
      const contactIds = [...new Set((data || []).map((m) => m.contact_id))];
      if (contactIds.length === 0) return [];

      const { data: contacts } = await supabase
        .from("crm_contacts")
        .select("id, full_name, company, contact_type, email, phone")
        .in("id", contactIds);

      const contactMap = new Map(contacts?.map((c) => [c.id, c]) || []);

      return (data || []).map((match) => ({
        ...match,
        contact: contactMap.get(match.contact_id) || null,
      })) as DealMatch[];
    },
    enabled: !!dealId,
  });
};

/**
 * Fetch deals that match a specific contact's criteria
 */
export const useContactDealMatches = (contactId: string) => {
  return useQuery({
    queryKey: ["contact-deal-matches", contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_matches")
        .select("*")
        .eq("contact_id", contactId)
        .eq("is_dismissed", false)
        .order("match_score", { ascending: false });

      if (error) throw error;

      // Fetch deal details
      const dealIds = [...new Set((data || []).map((m) => m.deal_id))];
      if (dealIds.length === 0) return [];

      const { data: deals } = await supabase
        .from("crm_deals")
        .select("id, property_address, borough, neighborhood, value, gross_sf, property_type")
        .in("id", dealIds)
        .eq("is_off_market", true)
        .eq("is_active", true);

      const dealMap = new Map(deals?.map((d) => [d.id, d]) || []);

      return (data || [])
        .filter((match) => dealMap.has(match.deal_id))
        .map((match) => ({
          ...match,
          deal: dealMap.get(match.deal_id) || null,
        })) as ContactDealMatch[];
    },
    enabled: !!contactId,
  });
};

/**
 * Get match count for a deal (for badges)
 */
export const useDealMatchCount = (dealId: string) => {
  return useQuery({
    queryKey: ["deal-match-count", dealId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("deal_matches")
        .select("*", { count: "exact", head: true })
        .eq("deal_id", dealId)
        .eq("is_dismissed", false)
        .gte("match_score", 70);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!dealId,
  });
};

// ========== Mutation Hooks ==========

/**
 * Trigger AI matching for a deal
 */
export const useGenerateDealMatches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const { data, error } = await supabase.functions.invoke("match-deals", {
        body: { deal_id: dealId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, dealId) => {
      queryClient.invalidateQueries({ queryKey: ["deal-matches", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-match-count", dealId] });
      toast.success(`Found ${data.matches_found} matching contacts`);
    },
    onError: (error: Error) => {
      console.error("Failed to generate matches:", error);
      toast.error(error.message || "Failed to generate matches");
    },
  });
};

/**
 * Dismiss a match
 */
export const useDismissMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, dealId }: { matchId: string; dealId: string }) => {
      const { error } = await supabase
        .from("deal_matches")
        .update({ is_dismissed: true })
        .eq("id", matchId);

      if (error) throw error;
      return { matchId, dealId };
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-matches", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-match-count", dealId] });
    },
    onError: () => {
      toast.error("Failed to dismiss match");
    },
  });
};

/**
 * Restore a dismissed match
 */
export const useRestoreMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, dealId }: { matchId: string; dealId: string }) => {
      const { error } = await supabase
        .from("deal_matches")
        .update({ is_dismissed: false })
        .eq("id", matchId);

      if (error) throw error;
      return { matchId, dealId };
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-matches", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal-match-count", dealId] });
    },
    onError: () => {
      toast.error("Failed to restore match");
    },
  });
};

/**
 * Mark a match as contacted
 */
export const useMarkMatchContacted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, dealId }: { matchId: string; dealId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("deal_matches")
        .update({
          is_contacted: true,
          contacted_at: new Date().toISOString(),
          contacted_by: user.id,
        })
        .eq("id", matchId);

      if (error) throw error;
      return { matchId, dealId };
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ["deal-matches", dealId] });
      toast.success("Marked as contacted");
    },
    onError: () => {
      toast.error("Failed to update match");
    },
  });
};

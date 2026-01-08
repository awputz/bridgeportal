import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type HROffer = Database['public']['Tables']['hr_offers']['Row'];
export type HROfferInsert = Database['public']['Tables']['hr_offers']['Insert'];
export type HROfferUpdate = Database['public']['Tables']['hr_offers']['Update'];
export type OfferStatus = 'draft' | 'sent' | 'signed' | 'declined';

export interface HROfferWithAgent extends HROffer {
  hr_agents: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    current_brokerage: string | null;
    annual_production: number | null;
    years_experience: number | null;
    poachability_score: number | null;
    division?: string | null;
  } | null;
}

export const offerStatusColors: Record<OfferStatus, string> = {
  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  sent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  signed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  declined: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const offerStatusLabels: Record<OfferStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  signed: 'Signed',
  declined: 'Declined',
};

export function getOfferStatus(offer: HROffer): OfferStatus {
  if (offer.declined_at) return 'declined';
  if (offer.signed_at) return 'signed';
  if (offer.sent_at) return 'sent';
  return 'draft';
}

interface OfferFilters {
  status?: OfferStatus;
  division?: string;
  search?: string;
}

export function useHROffers(filters?: OfferFilters) {
  return useQuery({
    queryKey: ['hr-offers', filters],
    queryFn: async () => {
      let query = supabase
        .from('hr_offers')
        .select(`
          *,
          hr_agents (
            id,
            full_name,
            email,
            phone,
            current_brokerage,
            annual_production,
            years_experience,
            poachability_score,
            division
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.division) {
        query = query.eq('division', filters.division);
      }

      if (filters?.search) {
        query = query.or(`hr_agents.full_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      let result = data as HROfferWithAgent[];

      // Filter by status client-side (since it's computed)
      if (filters?.status) {
        result = result.filter(offer => getOfferStatus(offer) === filters.status);
      }

      return result;
    },
  });
}

export function useHROffer(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-offer', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('hr_offers')
        .select(`
          *,
          hr_agents (
            id,
            full_name,
            email,
            phone,
            current_brokerage,
            annual_production,
            years_experience,
            poachability_score,
            division
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as HROfferWithAgent;
    },
    enabled: !!id,
  });
}

export function useAgentOffers(agentId: string | undefined) {
  return useQuery({
    queryKey: ['hr-agent-offers', agentId],
    queryFn: async () => {
      if (!agentId) return [];

      const { data, error } = await supabase
        .from('hr_offers')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HROffer[];
    },
    enabled: !!agentId,
  });
}

export function useCreateHROffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offer: HROfferInsert) => {
      const { data, error } = await supabase
        .from('hr_offers')
        .insert(offer)
        .select()
        .single();

      if (error) throw error;

      // Update agent status to offer-made
      if (offer.agent_id) {
        await supabase
          .from('hr_agents')
          .update({ recruitment_status: 'offer-made' })
          .eq('id', offer.agent_id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
    },
  });
}

export function useUpdateHROffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HROfferUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hr_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-offer', variables.id] });
    },
  });
}

export function useDeleteHROffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hr_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
    },
  });
}

export function useSendOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('hr_offers')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-offer', id] });
    },
  });
}

export function useMarkOfferSigned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signedAt }: { id: string; signedAt?: string }) => {
      const { data, error } = await supabase
        .from('hr_offers')
        .update({ signed_at: signedAt || new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update agent status to hired
      if (data.agent_id) {
        await supabase
          .from('hr_agents')
          .update({ recruitment_status: 'hired' })
          .eq('id', data.agent_id);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-offer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
    },
  });
}

export function useMarkOfferDeclined() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const updates: HROfferUpdate = {
        declined_at: new Date().toISOString(),
      };

      if (reason) {
        updates.special_terms = `Declined reason: ${reason}`;
      }

      const { data, error } = await supabase
        .from('hr_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hr-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-offer', variables.id] });
    },
  });
}

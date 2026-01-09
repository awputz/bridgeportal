import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type HROffer = Database['public']['Tables']['hr_offers']['Row'];
export type HROfferInsert = Database['public']['Tables']['hr_offers']['Insert'];
export type HROfferUpdate = Database['public']['Tables']['hr_offers']['Update'];
export type OfferStatus = 'draft' | 'sent' | 'signed' | 'declined';

// Agent info from unified agents table
export interface AgentInfo {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  current_brokerage: string | null;
  annual_production: number | null;
  years_experience: number | null;
  poachability_score: number | null;
  division: string | null;
}

export interface HROfferWithAgent extends HROffer {
  agents: AgentInfo | null;
  // Keep backward compatibility with hr_agents key
  hr_agents?: AgentInfo | null;
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
      // First get offers
      let query = supabase
        .from('hr_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.division) {
        query = query.eq('division', filters.division);
      }

      const { data: offers, error } = await query;
      if (error) throw error;

      // Get unique agent IDs
      const agentIds = [...new Set(offers?.map(o => o.agent_id).filter(Boolean))];
      
      // Fetch agent info from unified agents table
      let agentsMap: Record<string, AgentInfo> = {};
      if (agentIds.length > 0) {
        const { data: agents } = await supabase
          .from('agents')
          .select('id, full_name, email, phone, current_brokerage, annual_production, years_experience, poachability_score, division')
          .in('id', agentIds);
        
        if (agents) {
          agents.forEach(a => {
            agentsMap[a.id] = a;
          });
        }
      }

      // Combine offers with agent data
      let result: HROfferWithAgent[] = (offers || []).map(offer => ({
        ...offer,
        agents: offer.agent_id ? agentsMap[offer.agent_id] || null : null,
        // Backward compatibility
        hr_agents: offer.agent_id ? agentsMap[offer.agent_id] || null : null,
      }));

      // Filter by search (agent name)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(o => 
          o.agents?.full_name?.toLowerCase().includes(searchLower)
        );
      }

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

      const { data: offer, error } = await supabase
        .from('hr_offers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch agent info separately
      let agent: AgentInfo | null = null;
      if (offer.agent_id) {
        const { data } = await supabase
          .from('agents')
          .select('id, full_name, email, phone, current_brokerage, annual_production, years_experience, poachability_score, division')
          .eq('id', offer.agent_id)
          .single();
        agent = data;
      }

      return {
        ...offer,
        agents: agent,
        hr_agents: agent, // Backward compatibility
      } as HROfferWithAgent;
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

      // Update agent status to offer-made in unified agents table
      if (offer.agent_id) {
        await supabase
          .from('agents')
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

      // Update agent status to hired in unified agents table
      if (data.agent_id) {
        await supabase
          .from('agents')
          .update({ 
            recruitment_status: 'hired',
            employment_status: 'recruited'
          })
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

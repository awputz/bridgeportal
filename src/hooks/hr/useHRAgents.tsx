import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for the unified agents table (recruitment view)
export interface HRAgent {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  employment_status: string;
  recruitment_status: string | null;
  current_brokerage: string | null;
  poachability_score: number | null;
  annual_production: number | null;
  years_experience: number | null;
  last_contacted_at: string | null;
  next_action: string | null;
  source: string | null;
  notes: string | null;
  linkedin_url: string | null;
  division: string | null;
  license_number: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}

export interface HRAgentInsert {
  full_name: string;
  email: string;
  phone?: string | null;
  photo_url?: string | null;
  employment_status?: string;
  recruitment_status?: string;
  current_brokerage?: string | null;
  poachability_score?: number | null;
  annual_production?: number | null;
  years_experience?: number | null;
  last_contacted_at?: string | null;
  next_action?: string | null;
  source?: string | null;
  notes?: string | null;
  linkedin_url?: string | null;
  division?: string | null;
  license_number?: string | null;
}

export interface HRAgentUpdate extends Partial<HRAgentInsert> {}

// Keep interaction types from the existing hr_interactions table
export interface HRInteraction {
  id: string;
  agent_id: string;
  interaction_type: string;
  interaction_date: string;
  notes: string | null;
  outcome: string | null;
  created_by: string | null;
  created_at: string | null;
}

export interface HRInteractionInsert {
  agent_id: string;
  interaction_type: string;
  interaction_date?: string;
  notes?: string | null;
  outcome?: string | null;
}

export type RecruitmentStatus = 'cold' | 'contacted' | 'warm' | 'qualified' | 'hot' | 'offer-made' | 'hired' | 'lost';
export type Division = 'investment-sales' | 'commercial-leasing' | 'residential' | 'capital-advisory';
export type InteractionType = 'email' | 'call' | 'meeting' | 'linkedin' | 'text' | 'other';
export type InteractionOutcome = 'positive' | 'neutral' | 'negative';

export function useHRAgents(filters?: {
  division?: Division;
  status?: RecruitmentStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: ['hr-agents', filters],
    queryFn: async () => {
      let query = supabase
        .from('agents')
        .select('*')
        // Only show candidates and recruited (not active employees)
        .in('employment_status', ['candidate', 'recruited'])
        .order('updated_at', { ascending: false });

      if (filters?.division) {
        query = query.eq('division', filters.division);
      }
      if (filters?.status) {
        query = query.eq('recruitment_status', filters.status);
      }
      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,current_brokerage.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HRAgent[];
    },
  });
}

export function useHRAgent(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-agent', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as HRAgent;
    },
    enabled: !!id,
  });
}

export function useHRInteractions(agentId: string | undefined) {
  return useQuery({
    queryKey: ['hr-interactions', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      const { data, error } = await supabase
        .from('hr_interactions')
        .select('*')
        .eq('agent_id', agentId)
        .order('interaction_date', { ascending: false });
      if (error) throw error;
      return data as HRInteraction[];
    },
    enabled: !!agentId,
  });
}

export function useCreateHRAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agent: HRAgentInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('agents')
        .insert({ 
          ...agent, 
          created_by: user?.id,
          employment_status: 'candidate',
          recruitment_status: agent.recruitment_status || 'cold'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
      toast.success('Agent added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add agent: ${error.message}`);
    },
  });
}

export function useUpdateHRAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HRAgentUpdate }) => {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
      queryClient.invalidateQueries({ queryKey: ['hr-agent', data.id] });
      toast.success('Agent updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update agent: ${error.message}`);
    },
  });
}

export function useDeleteHRAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
      toast.success('Agent deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete agent: ${error.message}`);
    },
  });
}

export function useCreateHRInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interaction: HRInteractionInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create the interaction
      const { data, error } = await supabase
        .from('hr_interactions')
        .insert({ ...interaction, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;

      // Update last_contacted_at on the agent (now in unified agents table)
      await supabase
        .from('agents')
        .update({ last_contacted_at: new Date().toISOString() })
        .eq('id', interaction.agent_id);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-interactions', data.agent_id] });
      queryClient.invalidateQueries({ queryKey: ['hr-agent', data.agent_id] });
      queryClient.invalidateQueries({ queryKey: ['hr-agents'] });
      toast.success('Interaction logged successfully');
    },
    onError: (error) => {
      toast.error(`Failed to log interaction: ${error.message}`);
    },
  });
}

export function useUpdateAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RecruitmentStatus }) => {
      // Update employment_status when hired
      const updates: Record<string, string> = { recruitment_status: status };
      if (status === 'hired') {
        updates.employment_status = 'recruited';
      }

      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel ALL hr-agents queries (including filtered ones)
      await queryClient.cancelQueries({ queryKey: ['hr-agents'], exact: false });
      
      // Get all cached queries matching the pattern and store for rollback
      const previousQueries = queryClient.getQueriesData<HRAgent[]>({ 
        queryKey: ['hr-agents'] 
      });
      
      // Update all cached queries optimistically
      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<HRAgent[]>(queryKey, (old) =>
          old?.map(a => a.id === id ? { ...a, recruitment_status: status } : a)
        );
      });
      
      // Also update the individual agent cache if it exists
      queryClient.setQueryData<HRAgent>(['hr-agent', id], (old) =>
        old ? { ...old, recruitment_status: status } : old
      );
      
      return { previousQueries };
    },
    onError: (err, variables, context) => {
      // Rollback all queries to their previous state
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error('Failed to update status');
    },
    onSettled: () => {
      // Invalidate all hr-agents queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['hr-agents'], exact: false });
    },
  });
}

// Utility functions
export const formatProduction = (amount: number | null) => {
  if (!amount) return '-';
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
};

export const statusColors: Record<RecruitmentStatus, string> = {
  cold: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  warm: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  qualified: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  hot: 'bg-red-500/10 text-red-400 border-red-500/20',
  'offer-made': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  hired: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  lost: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export const divisionColors: Record<Division, string> = {
  'investment-sales': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'commercial-leasing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'residential': 'bg-green-500/10 text-green-400 border-green-500/20',
  'capital-advisory': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const divisionLabels: Record<Division, string> = {
  'investment-sales': 'Investment Sales',
  'commercial-leasing': 'Commercial Leasing',
  'residential': 'Residential',
  'capital-advisory': 'Capital Advisory',
};

export const statusLabels: Record<RecruitmentStatus, string> = {
  cold: 'Cold',
  contacted: 'Contacted',
  warm: 'Warm',
  qualified: 'Qualified',
  hot: 'Hot',
  'offer-made': 'Offer Made',
  hired: 'Hired',
  lost: 'Lost',
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

export type HRCampaign = Database['public']['Tables']['hr_campaigns']['Row'];
export type HRCampaignInsert = Database['public']['Tables']['hr_campaigns']['Insert'];
export type HRCampaignUpdate = Database['public']['Tables']['hr_campaigns']['Update'];
export type HRCampaignAgent = Database['public']['Tables']['hr_campaign_agents']['Row'];
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type EmailStatus = 'pending' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced';

export interface CampaignWithStats extends HRCampaign {
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  replied_count: number;
}

// Fetch all campaigns with stats
export function useHRCampaigns() {
  return useQuery({
    queryKey: ['hr-campaigns'],
    queryFn: async () => {
      // Fetch campaigns
      const { data: campaigns, error } = await supabase
        .from('hr_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch stats for each campaign
      const campaignsWithStats: CampaignWithStats[] = await Promise.all(
        (campaigns || []).map(async (campaign) => {
          const { data: agents } = await supabase
            .from('hr_campaign_agents')
            .select('email_status')
            .eq('campaign_id', campaign.id);

          const agentList = agents || [];
          return {
            ...campaign,
            total_recipients: agentList.length,
            sent_count: agentList.filter(a => a.email_status !== 'pending').length,
            opened_count: agentList.filter(a => ['opened', 'clicked', 'replied'].includes(a.email_status)).length,
            replied_count: agentList.filter(a => a.email_status === 'replied').length,
          };
        })
      );

      return campaignsWithStats;
    },
  });
}

// Fetch single campaign
export function useHRCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-campaign', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('hr_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// Fetch agents in a campaign
export function useCampaignAgents(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['hr-campaign-agents', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from('hr_campaign_agents')
        .select(`
          *,
          agent:hr_agents(*)
        `)
        .eq('campaign_id', campaignId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!campaignId,
  });
}

// Create campaign
export function useCreateHRCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: HRCampaignInsert) => {
      const { data, error } = await supabase
        .from('hr_campaigns')
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      toast.success('Campaign created');
    },
    onError: (error) => {
      toast.error('Failed to create campaign');
      console.error(error);
    },
  });
}

// Update campaign
export function useUpdateHRCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HRCampaignUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hr_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['hr-campaign', data.id] });
      toast.success('Campaign updated');
    },
    onError: (error) => {
      toast.error('Failed to update campaign');
      console.error(error);
    },
  });
}

// Delete campaign
export function useDeleteHRCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hr_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      toast.success('Campaign deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete campaign');
      console.error(error);
    },
  });
}

// Add agents to campaign
export function useAddAgentsToCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, agentIds }: { campaignId: string; agentIds: string[] }) => {
      const inserts = agentIds.map(agentId => ({
        campaign_id: campaignId,
        agent_id: agentId,
        email_status: 'pending' as const,
      }));

      const { error } = await supabase
        .from('hr_campaign_agents')
        .insert(inserts);

      if (error) throw error;
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['hr-campaign-agents', campaignId] });
      toast.success('Agents added to campaign');
    },
    onError: (error) => {
      toast.error('Failed to add agents');
      console.error(error);
    },
  });
}

// Remove agent from campaign
export function useRemoveAgentFromCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, agentId }: { campaignId: string; agentId: string }) => {
      const { error } = await supabase
        .from('hr_campaign_agents')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('agent_id', agentId);

      if (error) throw error;
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['hr-campaign-agents', campaignId] });
      toast.success('Agent removed from campaign');
    },
    onError: (error) => {
      toast.error('Failed to remove agent');
      console.error(error);
    },
  });
}

// Update campaign status
export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CampaignStatus }) => {
      const { data, error } = await supabase
        .from('hr_campaigns')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['hr-campaign', data.id] });
      toast.success(`Campaign ${data.status}`);
    },
    onError: (error) => {
      toast.error('Failed to update status');
      console.error(error);
    },
  });
}

// Utility: Status colors
export const campaignStatusColors: Record<CampaignStatus, string> = {
  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  paused: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export const emailStatusColors: Record<EmailStatus, string> = {
  pending: 'bg-slate-500/10 text-slate-400',
  sent: 'bg-blue-500/10 text-blue-400',
  opened: 'bg-amber-500/10 text-amber-400',
  clicked: 'bg-orange-500/10 text-orange-400',
  replied: 'bg-emerald-500/10 text-emerald-400',
  bounced: 'bg-red-500/10 text-red-400',
};

// Utility: Parse email template
export function parseEmailTemplate(template: string, agent: { full_name: string; current_brokerage?: string | null; division?: string }): string {
  const firstName = agent.full_name.split(' ')[0];
  const divisionLabels: Record<string, string> = {
    'investment-sales': 'Investment Sales',
    'commercial-leasing': 'Commercial Leasing',
    'residential': 'Residential',
    'capital-advisory': 'Capital Advisory',
  };
  
  return template
    .replace(/\{\{first_name\}\}/g, firstName)
    .replace(/\{\{full_name\}\}/g, agent.full_name)
    .replace(/\{\{brokerage\}\}/g, agent.current_brokerage || '')
    .replace(/\{\{division\}\}/g, divisionLabels[agent.division || ''] || agent.division || '');
}

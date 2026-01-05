import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CRMContact, CRMDeal, CRMActivity, CRMActivityContact, CRMActivityDeal, CRMDealStage } from "./useCRM";

export interface CRMContactWithAgent extends CRMContact {
  agent_name: string | null;
  agent_email: string | null;
}

export interface CRMDealWithAgent extends CRMDeal {
  agent_name: string | null;
  agent_email: string | null;
}

export interface CRMActivityWithAgent extends Omit<CRMActivity, 'contact' | 'deal'> {
  agent_name: string | null;
  agent_email: string | null;
  contact?: CRMActivityContact | null;
  deal?: CRMActivityDeal | null;
}

// Utility to fetch profiles for agent IDs
async function fetchAgentProfiles(agentIds: string[]) {
  if (agentIds.length === 0) return new Map<string, { full_name: string | null; email: string | null }>();
  
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", agentIds);

  return new Map(
    profiles?.map(p => [p.id, { full_name: p.full_name, email: p.email }]) || []
  );
}

// Admin: All Contacts (across all agents)
export const useAllCRMContacts = () => {
  return useQuery({
    queryKey: ["admin-crm-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_contacts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const agentIds = [...new Set(data.map(c => c.agent_id))];
      const profileMap = await fetchAgentProfiles(agentIds);

      return data.map(contact => ({
        ...contact,
        agent_name: profileMap.get(contact.agent_id)?.full_name || null,
        agent_email: profileMap.get(contact.agent_id)?.email || null,
      })) as CRMContactWithAgent[];
    },
  });
};

// Admin: All Deals (across all agents)
export const useAllCRMDeals = () => {
  return useQuery({
    queryKey: ["admin-crm-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          *,
          contact:crm_contacts(*),
          stage:crm_deal_stages(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const agentIds = [...new Set(data.map(d => d.agent_id))];
      const profileMap = await fetchAgentProfiles(agentIds);

      return data.map(deal => ({
        ...deal,
        agent_name: profileMap.get(deal.agent_id)?.full_name || null,
        agent_email: profileMap.get(deal.agent_id)?.email || null,
      })) as CRMDealWithAgent[];
    },
  });
};

// Admin: All Activities (across all agents)
export const useAllCRMActivities = () => {
  return useQuery({
    queryKey: ["admin-crm-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_activities")
        .select(`
          *,
          contact:crm_contacts(id, full_name),
          deal:crm_deals(id, property_address)
        `)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;

      const agentIds = [...new Set(data.map(a => a.agent_id))];
      const profileMap = await fetchAgentProfiles(agentIds);

      return data.map(activity => ({
        ...activity,
        agent_name: profileMap.get(activity.agent_id)?.full_name || null,
        agent_email: profileMap.get(activity.agent_id)?.email || null,
      })) as CRMActivityWithAgent[];
    },
  });
};

// Admin: CRM Stats Summary
export const useAdminCRMStats = () => {
  return useQuery({
    queryKey: ["admin-crm-stats"],
    queryFn: async () => {
      // Get counts for contacts, deals, activities
      const [
        { count: totalContacts },
        { count: totalDeals },
        { count: pendingActivities },
        { data: deals },
      ] = await Promise.all([
        supabase
          .from("crm_contacts")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("crm_deals")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true)
          .is("won", null),
        supabase
          .from("crm_activities")
          .select("id", { count: "exact", head: true })
          .eq("is_completed", false),
        supabase
          .from("crm_deals")
          .select("value")
          .eq("is_active", true)
          .is("won", null),
      ]);

      const pipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0;

      return {
        totalContacts: totalContacts || 0,
        activeDeals: totalDeals || 0,
        pendingActivities: pendingActivities || 0,
        pipelineValue,
      };
    },
  });
};

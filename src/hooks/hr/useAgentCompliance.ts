import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { differenceInDays, parseISO } from "date-fns";

export type ComplianceStatus = "active" | "expiring_soon" | "expired" | "suspended";

export interface AgentCompliance {
  id: string;
  active_agent_id: string;
  license_type: string;
  license_number: string;
  license_state: string;
  issue_date: string | null;
  expiry_date: string;
  status: ComplianceStatus;
  renewal_reminder_sent: boolean;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceInsert {
  active_agent_id: string;
  license_type: string;
  license_number: string;
  license_state?: string;
  issue_date?: string | null;
  expiry_date: string;
  document_url?: string | null;
}

export const useAgentCompliance = (activeAgentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-compliance", activeAgentId],
    queryFn: async () => {
      if (!activeAgentId) return [];
      const { data, error } = await supabase
        .from("agent_compliance")
        .select("*")
        .eq("active_agent_id", activeAgentId)
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return data as AgentCompliance[];
    },
    enabled: !!activeAgentId,
  });
};

export const useExpiringLicenses = (days: number = 30) => {
  return useQuery({
    queryKey: ["expiring-licenses", days],
    queryFn: async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data, error } = await supabase
        .from("agent_compliance")
        .select(`
          *,
          active_agents!inner(id, full_name, email, division)
        `)
        .lte("expiry_date", futureDate.toISOString().split("T")[0])
        .order("expiry_date", { ascending: true });

      if (error) throw error;
      return data as (AgentCompliance & { active_agents: { id: string; full_name: string; email: string; division: string } })[];
    },
  });
};

export const useAddCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (compliance: ComplianceInsert) => {
      // Calculate initial status
      const expiryDate = parseISO(compliance.expiry_date);
      const daysUntilExpiry = differenceInDays(expiryDate, new Date());
      
      let status: ComplianceStatus = "active";
      if (daysUntilExpiry < 0) status = "expired";
      else if (daysUntilExpiry <= 30) status = "expiring_soon";

      const { data, error } = await supabase
        .from("agent_compliance")
        .insert({ ...compliance, status })
        .select()
        .single();

      if (error) throw error;
      return data as AgentCompliance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-compliance", data.active_agent_id] });
      queryClient.invalidateQueries({ queryKey: ["expiring-licenses"] });
      toast.success("License/certification added");
    },
    onError: (error) => {
      toast.error(`Failed to add: ${error.message}`);
    },
  });
};

export const useUpdateCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AgentCompliance> & { id: string }) => {
      // Recalculate status if expiry date changed
      if (updates.expiry_date) {
        const expiryDate = parseISO(updates.expiry_date);
        const daysUntilExpiry = differenceInDays(expiryDate, new Date());
        
        if (daysUntilExpiry < 0) updates.status = "expired";
        else if (daysUntilExpiry <= 30) updates.status = "expiring_soon";
        else updates.status = "active";
      }

      const { data, error } = await supabase
        .from("agent_compliance")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as AgentCompliance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-compliance", data.active_agent_id] });
      queryClient.invalidateQueries({ queryKey: ["expiring-licenses"] });
      toast.success("Compliance record updated");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
};

export const useDeleteCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, activeAgentId }: { id: string; activeAgentId: string }) => {
      const { error } = await supabase.from("agent_compliance").delete().eq("id", id);
      if (error) throw error;
      return { id, activeAgentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-compliance", data.activeAgentId] });
      queryClient.invalidateQueries({ queryKey: ["expiring-licenses"] });
      toast.success("Compliance record deleted");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
};

// Status utilities
export const complianceStatusConfig: Record<ComplianceStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  expiring_soon: { label: "Expiring Soon", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  expired: { label: "Expired", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  suspended: { label: "Suspended", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};

export const licenseTypes = [
  { value: "real_estate", label: "Real Estate License" },
  { value: "broker", label: "Broker License" },
  { value: "insurance", label: "Insurance License" },
  { value: "notary", label: "Notary Public" },
  { value: "other", label: "Other Certification" },
];

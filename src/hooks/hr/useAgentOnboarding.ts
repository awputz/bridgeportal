import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AgentOnboarding {
  id: string;
  active_agent_id: string;
  contract_signed: boolean;
  contract_signed_at: string | null;
  license_verified: boolean;
  license_verified_at: string | null;
  license_number: string | null;
  license_expiry: string | null;
  background_check_passed: boolean;
  background_check_at: string | null;
  w9_submitted: boolean;
  w9_submitted_at: string | null;
  direct_deposit_setup: boolean;
  direct_deposit_at: string | null;
  email_account_created: boolean;
  email_account_at: string | null;
  company_email: string | null;
  crm_access_granted: boolean;
  crm_access_at: string | null;
  training_completed: boolean;
  training_completed_at: string | null;
  headshot_uploaded: boolean;
  headshot_url: string | null;
  headshot_at: string | null;
  bio_submitted: boolean;
  bio_text: string | null;
  bio_at: string | null;
  created_at: string;
  updated_at: string;
}

export type OnboardingItem = {
  key: keyof AgentOnboarding;
  label: string;
  timestampKey: keyof AgentOnboarding;
  dataKey?: keyof AgentOnboarding;
  dataLabel?: string;
};

export const onboardingItems: OnboardingItem[] = [
  { key: "contract_signed", label: "Contract Signed", timestampKey: "contract_signed_at" },
  { key: "license_verified", label: "License Verified", timestampKey: "license_verified_at", dataKey: "license_number", dataLabel: "License #" },
  { key: "background_check_passed", label: "Background Check", timestampKey: "background_check_at" },
  { key: "w9_submitted", label: "W-9 Submitted", timestampKey: "w9_submitted_at" },
  { key: "direct_deposit_setup", label: "Direct Deposit Setup", timestampKey: "direct_deposit_at" },
  { key: "email_account_created", label: "Email Account Created", timestampKey: "email_account_at", dataKey: "company_email", dataLabel: "Email" },
  { key: "crm_access_granted", label: "CRM Access Granted", timestampKey: "crm_access_at" },
  { key: "training_completed", label: "Training Completed", timestampKey: "training_completed_at" },
  { key: "headshot_uploaded", label: "Headshot Uploaded", timestampKey: "headshot_at" },
  { key: "bio_submitted", label: "Bio Submitted", timestampKey: "bio_at" },
];

export const useAgentOnboarding = (activeAgentId: string | undefined) => {
  return useQuery({
    queryKey: ["agent-onboarding", activeAgentId],
    queryFn: async () => {
      if (!activeAgentId) return null;
      const { data, error } = await supabase
        .from("agent_onboarding")
        .select("*")
        .eq("active_agent_id", activeAgentId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data as AgentOnboarding | null;
    },
    enabled: !!activeAgentId,
  });
};

export const useUpdateOnboardingItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activeAgentId,
      itemKey,
      value,
      additionalData,
    }: {
      activeAgentId: string;
      itemKey: string;
      value: boolean;
      additionalData?: Record<string, unknown>;
    }) => {
      const timestampKey = `${itemKey.replace("_signed", "_signed").replace("_verified", "_verified").replace("_passed", "").replace("_submitted", "_submitted").replace("_setup", "").replace("_created", "").replace("_granted", "").replace("_completed", "_completed").replace("_uploaded", "")}_at`;
      
      const updates: Record<string, unknown> = {
        [itemKey]: value,
        [`${itemKey.replace(/_[^_]+$/, "")}_at`]: value ? new Date().toISOString() : null,
        ...additionalData,
      };

      // Fix timestamp key mapping
      const item = onboardingItems.find(i => i.key === itemKey);
      if (item) {
        updates[item.timestampKey as string] = value ? new Date().toISOString() : null;
      }

      const { data, error } = await supabase
        .from("agent_onboarding")
        .update(updates)
        .eq("active_agent_id", activeAgentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agent-onboarding", variables.activeAgentId] });
      toast.success("Onboarding item updated");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
};

export const calculateOnboardingProgress = (onboarding: AgentOnboarding | null): number => {
  if (!onboarding) return 0;
  
  const items = [
    onboarding.contract_signed,
    onboarding.license_verified,
    onboarding.background_check_passed,
    onboarding.w9_submitted,
    onboarding.direct_deposit_setup,
    onboarding.email_account_created,
    onboarding.crm_access_granted,
    onboarding.training_completed,
    onboarding.headshot_uploaded,
    onboarding.bio_submitted,
  ];
  
  const completed = items.filter(Boolean).length;
  return Math.round((completed / items.length) * 100);
};

export const useOnboardingStats = () => {
  return useQuery({
    queryKey: ["onboarding-stats"],
    queryFn: async () => {
      const { data: onboardingData, error: onboardingError } = await supabase
        .from("agent_onboarding")
        .select("*");
      
      if (onboardingError) throw onboardingError;

      const records = onboardingData as AgentOnboarding[];
      const inProgress = records.filter(r => {
        const progress = calculateOnboardingProgress(r);
        return progress > 0 && progress < 100;
      }).length;
      
      const completed = records.filter(r => calculateOnboardingProgress(r) === 100).length;
      const notStarted = records.filter(r => calculateOnboardingProgress(r) === 0).length;

      return { inProgress, completed, notStarted, total: records.length };
    },
  });
};

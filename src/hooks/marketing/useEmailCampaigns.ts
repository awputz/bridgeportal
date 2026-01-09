import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface EmailCampaign {
  id: string;
  agent_id: string;
  name: string;
  subject: string | null;
  content: string | null;
  template_id: string | null;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignRecipient {
  id: string;
  campaign_id: string;
  contact_id: string | null;
  email: string;
  name: string | null;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
}

export type CreateCampaignInput = {
  name: string;
  subject?: string;
  content?: string;
  template_id?: string;
};

export type UpdateCampaignInput = Partial<Omit<EmailCampaign, 'id' | 'agent_id' | 'created_at'>>;

export const useEmailCampaigns = (status?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["email-campaigns", user?.id, status],
    queryFn: async () => {
      let query = supabase
        .from("email_campaigns")
        .select("*")
        .eq("agent_id", user!.id)
        .order("updated_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as EmailCampaign[];
    },
    enabled: !!user?.id,
  });
};

export const useEmailCampaign = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["email-campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .eq("id", id)
        .eq("agent_id", user!.id)
        .single();

      if (error) throw error;
      return data as EmailCampaign;
    },
    enabled: !!user?.id && !!id,
  });
};

export const useEmailCampaignRecipients = (campaignId: string) => {
  return useQuery({
    queryKey: ["email-campaign-recipients", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_campaign_recipients")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EmailCampaignRecipient[];
    },
    enabled: !!campaignId,
  });
};

export const useCreateEmailCampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateCampaignInput) => {
      const { data, error } = await supabase
        .from("email_campaigns")
        .insert({
          agent_id: user!.id,
          name: input.name,
          subject: input.subject || null,
          content: input.content || null,
          template_id: input.template_id || null,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data as EmailCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      toast.success("Campaign created");
    },
    onError: (error) => {
      toast.error("Failed to create campaign");
      console.error("Create campaign error:", error);
    },
  });
};

export const useUpdateEmailCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateCampaignInput & { id: string }) => {
      const { data, error } = await supabase
        .from("email_campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as EmailCampaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["email-campaign", data.id] });
      toast.success("Campaign updated");
    },
    onError: (error) => {
      toast.error("Failed to update campaign");
      console.error("Update campaign error:", error);
    },
  });
};

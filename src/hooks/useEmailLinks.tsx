import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailDealLink {
  id: string;
  agent_id: string;
  email_id: string;
  thread_id: string;
  deal_id: string;
  email_subject?: string;
  email_from?: string;
  linked_at: string;
  created_at: string;
}

export interface EmailContactLink {
  id: string;
  agent_id: string;
  email_id: string;
  thread_id: string;
  contact_id: string;
  email_subject?: string;
  email_from?: string;
  linked_at: string;
  created_at: string;
}

export interface SnoozedEmail {
  id: string;
  agent_id: string;
  email_id: string;
  thread_id: string;
  email_subject?: string;
  email_from?: string;
  snooze_until: string;
  snoozed_at: string;
  created_at: string;
}

// Get email links for a specific email
export function useEmailLinks(emailId: string | null) {
  return useQuery({
    queryKey: ["email-links", emailId],
    queryFn: async () => {
      if (!emailId) return { deals: [], contacts: [] };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { deals: [], contacts: [] };

      const [dealLinksResult, contactLinksResult] = await Promise.all([
        supabase
          .from("email_deal_links")
          .select("*, deal:crm_deals(id, property_address, value)")
          .eq("agent_id", user.id)
          .eq("email_id", emailId),
        supabase
          .from("email_contact_links")
          .select("*, contact:crm_contacts(id, full_name, email, company)")
          .eq("agent_id", user.id)
          .eq("email_id", emailId),
      ]);

      return {
        deals: dealLinksResult.data || [],
        contacts: contactLinksResult.data || [],
      };
    },
    enabled: !!emailId,
  });
}

// Get all linked emails for a deal
export function useDealEmails(dealId: string | null) {
  return useQuery({
    queryKey: ["deal-emails", dealId],
    queryFn: async () => {
      if (!dealId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("email_deal_links")
        .select("*")
        .eq("agent_id", user.id)
        .eq("deal_id", dealId)
        .order("linked_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!dealId,
  });
}

// Get all linked emails for a contact
export function useContactEmails(contactId: string | null) {
  return useQuery({
    queryKey: ["contact-emails", contactId],
    queryFn: async () => {
      if (!contactId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("email_contact_links")
        .select("*")
        .eq("agent_id", user.id)
        .eq("contact_id", contactId)
        .order("linked_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!contactId,
  });
}

// Link email to deal
export function useLinkEmailToDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      emailId: string;
      threadId: string;
      dealId: string;
      emailSubject?: string;
      emailFrom?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("email_deal_links")
        .insert({
          agent_id: user.id,
          email_id: params.emailId,
          thread_id: params.threadId,
          deal_id: params.dealId,
          email_subject: params.emailSubject,
          email_from: params.emailFrom,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-links", variables.emailId] });
      queryClient.invalidateQueries({ queryKey: ["deal-emails", variables.dealId] });
      toast.success("Email linked to deal");
    },
    onError: (error: Error) => {
      if (error.message?.includes("duplicate")) {
        toast.info("Email already linked to this deal");
      } else {
        toast.error("Failed to link email: " + error.message);
      }
    },
  });
}

// Link email to contact
export function useLinkEmailToContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      emailId: string;
      threadId: string;
      contactId: string;
      emailSubject?: string;
      emailFrom?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("email_contact_links")
        .insert({
          agent_id: user.id,
          email_id: params.emailId,
          thread_id: params.threadId,
          contact_id: params.contactId,
          email_subject: params.emailSubject,
          email_from: params.emailFrom,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-links", variables.emailId] });
      queryClient.invalidateQueries({ queryKey: ["contact-emails", variables.contactId] });
      toast.success("Email linked to contact");
    },
    onError: (error: Error) => {
      if (error.message?.includes("duplicate")) {
        toast.info("Email already linked to this contact");
      } else {
        toast.error("Failed to link email: " + error.message);
      }
    },
  });
}

// Unlink email from deal
export function useUnlinkEmailFromDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { emailId: string; dealId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("email_deal_links")
        .delete()
        .eq("agent_id", user.id)
        .eq("email_id", params.emailId)
        .eq("deal_id", params.dealId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-links", variables.emailId] });
      queryClient.invalidateQueries({ queryKey: ["deal-emails", variables.dealId] });
      toast.success("Link removed");
    },
  });
}

// Unlink email from contact
export function useUnlinkEmailFromContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { emailId: string; contactId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("email_contact_links")
        .delete()
        .eq("agent_id", user.id)
        .eq("email_id", params.emailId)
        .eq("contact_id", params.contactId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-links", variables.emailId] });
      queryClient.invalidateQueries({ queryKey: ["contact-emails", variables.contactId] });
      toast.success("Link removed");
    },
  });
}

// Snooze email
export function useSnoozeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      emailId: string;
      threadId: string;
      snoozeUntil: Date;
      emailSubject?: string;
      emailFrom?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("snoozed_emails")
        .upsert({
          agent_id: user.id,
          email_id: params.emailId,
          thread_id: params.threadId,
          snooze_until: params.snoozeUntil.toISOString(),
          email_subject: params.emailSubject,
          email_from: params.emailFrom,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snoozed-emails"] });
      toast.success("Email snoozed");
    },
    onError: (error: Error) => {
      toast.error("Failed to snooze email: " + error.message);
    },
  });
}

// Get snoozed emails
export function useSnoozedEmails() {
  return useQuery({
    queryKey: ["snoozed-emails"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("snoozed_emails")
        .select("*")
        .eq("agent_id", user.id)
        .order("snooze_until", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

// Unsnooze email
export function useUnsnoozeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("snoozed_emails")
        .delete()
        .eq("agent_id", user.id)
        .eq("email_id", emailId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snoozed-emails"] });
      toast.success("Email unsnoozed");
    },
  });
}

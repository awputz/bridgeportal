import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CalendarEventLink {
  id: string;
  google_event_id: string;
  user_id: string;
  deal_id: string | null;
  contact_id: string | null;
  created_at: string;
}

export const useEventLinks = (googleEventId: string | undefined) => {
  return useQuery({
    queryKey: ["calendar-event-links", googleEventId],
    queryFn: async () => {
      if (!googleEventId) return null;

      const { data, error } = await supabase
        .from("calendar_event_links")
        .select(`
          *,
          deal:crm_deals(id, property_address, deal_type),
          contact:crm_contacts(id, full_name, company)
        `)
        .eq("google_event_id", googleEventId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!googleEventId,
  });
};

export const useEventsForDeal = (dealId: string | undefined) => {
  return useQuery({
    queryKey: ["calendar-events-for-deal", dealId],
    queryFn: async () => {
      if (!dealId) return [];

      const { data, error } = await supabase
        .from("calendar_event_links")
        .select("google_event_id")
        .eq("deal_id", dealId);

      if (error) throw error;
      return data?.map(link => link.google_event_id) || [];
    },
    enabled: !!dealId,
  });
};

export const useEventsForContact = (contactId: string | undefined) => {
  return useQuery({
    queryKey: ["calendar-events-for-contact", contactId],
    queryFn: async () => {
      if (!contactId) return [];

      const { data, error } = await supabase
        .from("calendar_event_links")
        .select("google_event_id")
        .eq("contact_id", contactId);

      if (error) throw error;
      return data?.map(link => link.google_event_id) || [];
    },
    enabled: !!contactId,
  });
};

export const useCreateEventLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: {
      google_event_id: string;
      deal_id?: string;
      contact_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("calendar_event_links")
        .upsert({
          google_event_id: link.google_event_id,
          user_id: user.id,
          deal_id: link.deal_id || null,
          contact_id: link.contact_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["calendar-event-links", variables.google_event_id] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events-for-deal"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events-for-contact"] });
      toast({ title: "Event Linked", description: "Event has been linked to the record." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteEventLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("calendar_event_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-event-links"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events-for-deal"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events-for-contact"] });
      toast({ title: "Link Removed" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};

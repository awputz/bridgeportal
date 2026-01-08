import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LinkedEvent {
  id: string;
  google_event_id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  all_day: boolean;
  event_type: string | null;
}

// Note: This hook fetches events linked to CRM records via calendar_event_links
// Since we're using Google Calendar, we store google_event_id references
// For now, we'll fetch from local calendar_events table for linked events

export const useLinkedEventsForDeal = (dealId: string | undefined) => {
  return useQuery({
    queryKey: ["linked-calendar-events-deal", dealId],
    queryFn: async (): Promise<LinkedEvent[]> => {
      if (!dealId) return [];

      // First get the event links for this deal
      const { data: links, error: linksError } = await supabase
        .from("calendar_event_links")
        .select("google_event_id")
        .eq("deal_id", dealId);

      if (linksError) throw linksError;
      if (!links || links.length === 0) return [];

      // For now, we'll try to match with local calendar_events by ID
      // In a full implementation, you'd fetch from Google Calendar API
      const eventIds = links.map(l => l.google_event_id);
      
      const { data: events, error: eventsError } = await supabase
        .from("calendar_events")
        .select("id, title, start_time, end_time, location, all_day, event_type")
        .in("id", eventIds)
        .eq("is_active", true)
        .order("start_time", { ascending: false });

      if (eventsError) throw eventsError;

      return (events || []).map(e => ({
        id: e.id,
        google_event_id: e.id,
        title: e.title,
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location,
        all_day: e.all_day || false,
        event_type: e.event_type,
      }));
    },
    enabled: !!dealId,
  });
};

export const useLinkedEventsForContact = (contactId: string | undefined) => {
  return useQuery({
    queryKey: ["linked-calendar-events-contact", contactId],
    queryFn: async (): Promise<LinkedEvent[]> => {
      if (!contactId) return [];

      // First get the event links for this contact
      const { data: links, error: linksError } = await supabase
        .from("calendar_event_links")
        .select("google_event_id")
        .eq("contact_id", contactId);

      if (linksError) throw linksError;
      if (!links || links.length === 0) return [];

      // For now, we'll try to match with local calendar_events by ID
      const eventIds = links.map(l => l.google_event_id);
      
      const { data: events, error: eventsError } = await supabase
        .from("calendar_events")
        .select("id, title, start_time, end_time, location, all_day, event_type")
        .in("id", eventIds)
        .eq("is_active", true)
        .order("start_time", { ascending: false });

      if (eventsError) throw eventsError;

      return (events || []).map(e => ({
        id: e.id,
        google_event_id: e.id,
        title: e.title,
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location,
        all_day: e.all_day || false,
        event_type: e.event_type,
      }));
    },
    enabled: !!contactId,
  });
};
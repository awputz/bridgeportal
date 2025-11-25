import { useCallback } from "react";
import { logActivity } from "@/lib/api";

/**
 * Hook to log user activities
 * Use throughout the app to track important user actions
 */
export const useActivityLogger = () => {
  const log = useCallback(
    (action: string, entity_type: string, entity_id?: string, details?: any) => {
      logActivity(action, entity_type, entity_id, details);
    },
    []
  );

  return { log };
};

/**
 * Common activity logging helpers
 */
export const ActivityLogger = {
  propertyViewed: (propertyId: string) => 
    logActivity('property_viewed', 'properties', propertyId),
  
  propertyFavorited: (propertyId: string) =>
    logActivity('property_favorited', 'properties', propertyId),
  
  propertyUnfavorited: (propertyId: string) =>
    logActivity('property_unfavorited', 'properties', propertyId),
  
  inquirySubmitted: (inquiryId: string) =>
    logActivity('inquiry_submitted', 'inquiries', inquiryId),
  
  tourRequested: (tourId: string, propertyId: string) =>
    logActivity('tour_requested', 'tour_requests', tourId, { property_id: propertyId }),
  
  contactClicked: (propertyId: string, contactType: string) =>
    logActivity('contact_clicked', 'properties', propertyId, { contact_type: contactType }),
  
  searchPerformed: (query: string, filters: any) =>
    logActivity('search_performed', 'search', undefined, { query, filters }),
  
  aiChatStarted: (sessionId: string) =>
    logActivity('ai_chat_started', 'chat_sessions', sessionId),
};

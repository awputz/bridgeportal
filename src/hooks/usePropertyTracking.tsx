import { useEffect } from "react";
import { trackPropertyView } from "@/lib/api";

/**
 * Hook to automatically track property views
 * Call this in property detail pages
 */
export const usePropertyTracking = (
  propertyId: string | undefined,
  viewType: 'page_view' | 'image_view' | 'map_view' | 'contact_click' = 'page_view'
) => {
  useEffect(() => {
    if (!propertyId) return;

    // Track view after a short delay to ensure user actually viewed the content
    const timer = setTimeout(() => {
      trackPropertyView(propertyId, viewType);
    }, 2000);

    return () => clearTimeout(timer);
  }, [propertyId, viewType]);
};

/**
 * Manual tracking function for specific interactions
 */
export const trackPropertyInteraction = (
  propertyId: string,
  action: 'contact_click' | 'image_view' | 'map_view' | 'share',
  metadata?: any
) => {
  trackPropertyView(propertyId, action as any, metadata);
};

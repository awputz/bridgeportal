import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook to subscribe to real-time CRM updates
 * Automatically invalidates queries when changes occur
 */
export const useCRMRealtime = (division?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to CRM deals changes
    const dealsChannel = supabase
      .channel("crm-deals-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_deals",
        },
        (payload) => {
          
          // Invalidate deals queries
          queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
          queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
          
          // Show toast for relevant changes
          if (payload.eventType === "INSERT") {
            toast.info("New deal added", { duration: 3000 });
          } else if (payload.eventType === "UPDATE") {
            // Only show toast for stage changes
            const oldStage = (payload.old as { stage_id?: string })?.stage_id;
            const newStage = (payload.new as { stage_id?: string })?.stage_id;
            if (oldStage !== newStage) {
              toast.info("Deal moved to new stage", { duration: 3000 });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to CRM contacts changes
    const contactsChannel = supabase
      .channel("crm-contacts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_contacts",
        },
        (payload) => {
          
          // Invalidate contacts queries
          queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
          queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
          
          if (payload.eventType === "INSERT") {
            toast.info("New contact added", { duration: 3000 });
          }
        }
      )
      .subscribe();

    // Subscribe to CRM activities changes
    const activitiesChannel = supabase
      .channel("crm-activities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_activities",
        },
        () => {
          
          // Invalidate activities queries
          queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
          queryClient.invalidateQueries({ queryKey: ["crm-todays-tasks"] });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(dealsChannel);
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [queryClient, division]);
};

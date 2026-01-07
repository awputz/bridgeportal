import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook to subscribe to real-time Deal Room updates
 * Automatically invalidates queries when changes occur
 */
export const useDealRoomRealtime = (dealId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to deal_room_comments changes
    const commentsChannel = supabase
      .channel("deal-room-comments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deal_room_comments",
        },
        (payload) => {
          const newRecord = payload.new as { deal_id?: string };
          const oldRecord = payload.old as { deal_id?: string };
          const affectedDealId = newRecord?.deal_id || oldRecord?.deal_id;

          // Invalidate specific deal comments if we have a deal_id
          if (affectedDealId) {
            queryClient.invalidateQueries({ queryKey: ["deal-room-comments", affectedDealId] });
          }

          // Show toast for new comments (not on the deal user is viewing)
          if (payload.eventType === "INSERT" && affectedDealId !== dealId) {
            toast.info("New comment on a deal", { duration: 3000 });
          }
        }
      )
      .subscribe();

    // Subscribe to deal_room_interests changes
    const interestsChannel = supabase
      .channel("deal-room-interests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deal_room_interests",
        },
        (payload) => {
          const newRecord = payload.new as { deal_id?: string };
          const oldRecord = payload.old as { deal_id?: string };
          const affectedDealId = newRecord?.deal_id || oldRecord?.deal_id;

          if (affectedDealId) {
            queryClient.invalidateQueries({ queryKey: ["deal-room-interests", affectedDealId] });
          }

          if (payload.eventType === "INSERT") {
            toast.info("Someone expressed interest in a deal", { duration: 3000 });
          }
        }
      )
      .subscribe();

    // Subscribe to deal_room_activity changes
    const activityChannel = supabase
      .channel("deal-room-activity-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "deal_room_activity",
        },
        (payload) => {
          const newRecord = payload.new as { deal_id?: string };
          if (newRecord?.deal_id) {
            queryClient.invalidateQueries({ queryKey: ["deal-room-activity", newRecord.deal_id] });
          }
        }
      )
      .subscribe();

    // Subscribe to crm_deals changes (for off-market deals)
    const dealsChannel = supabase
      .channel("deal-room-deals-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_deals",
        },
        (payload) => {
          const newRecord = payload.new as { is_off_market?: boolean; id?: string };
          const oldRecord = payload.old as { is_off_market?: boolean; id?: string };

          // Only react to off-market changes
          if (newRecord?.is_off_market || oldRecord?.is_off_market) {
            queryClient.invalidateQueries({ queryKey: ["deal-room-deals"] });
            queryClient.invalidateQueries({ queryKey: ["deal-room-stats"] });
            queryClient.invalidateQueries({ queryKey: ["my-deal-room-deals"] });
            queryClient.invalidateQueries({ queryKey: ["agent-shareable-deals"] });

            if (newRecord?.id) {
              queryClient.invalidateQueries({ queryKey: ["deal-room-deal", newRecord.id] });
            }

            if (payload.eventType === "UPDATE" && !oldRecord?.is_off_market && newRecord?.is_off_market) {
              toast.info("New deal added to Deal Room", { duration: 3000 });
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(interestsChannel);
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(dealsChannel);
    };
  }, [queryClient, dealId]);
};

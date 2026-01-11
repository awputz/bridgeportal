import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type NotificationType = "signing_request" | "reminder" | "completed" | "voided";

export const useSendESignNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      recipientId,
      type,
    }: {
      documentId: string;
      recipientId: string;
      type: NotificationType;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "send-esign-notification",
        {
          body: { documentId, recipientId, type },
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["esign-documents"] });
      queryClient.invalidateQueries({
        queryKey: ["esign-recipients", variables.documentId],
      });
    },
    onError: (error) => {
      console.error("Notification error:", error);
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSendAllSigningRequests = () => {
  const sendNotification = useSendESignNotification();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get all pending signers
      const { data: recipients, error } = await supabase
        .from("esign_recipients")
        .select("id")
        .eq("document_id", documentId)
        .eq("role", "signer")
        .in("status", ["pending", "sent"]);

      if (error) throw error;

      // Send to all
      const results = await Promise.allSettled(
        (recipients || []).map((r) =>
          sendNotification.mutateAsync({
            documentId,
            recipientId: r.id,
            type: "signing_request",
          })
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      return { successful, failed, total: recipients?.length || 0 };
    },
    onSuccess: (result) => {
      if (result.failed > 0) {
        toast({
          title: "Partially Sent",
          description: `${result.successful}/${result.total} notifications sent. ${result.failed} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Notifications Sent",
          description: `Successfully sent to ${result.successful} recipients.`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSendReminder = () => {
  const sendNotification = useSendESignNotification();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get all signers who haven't signed yet
      const { data: recipients, error } = await supabase
        .from("esign_recipients")
        .select("id")
        .eq("document_id", documentId)
        .eq("role", "signer")
        .in("status", ["sent", "viewed"]);

      if (error) throw error;

      if (!recipients?.length) {
        throw new Error("No recipients pending signature");
      }

      // Send reminder to all
      const results = await Promise.allSettled(
        recipients.map((r) =>
          sendNotification.mutateAsync({
            documentId,
            recipientId: r.id,
            type: "reminder",
          })
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      return { successful, total: recipients.length };
    },
    onSuccess: (result) => {
      toast({
        title: "Reminders Sent",
        description: `Sent to ${result.successful} recipient(s).`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Reminders",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSendCompletionNotifications = () => {
  const sendNotification = useSendESignNotification();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get all recipients
      const { data: recipients, error } = await supabase
        .from("esign_recipients")
        .select("id")
        .eq("document_id", documentId);

      if (error) throw error;

      // Send completion notification to all
      await Promise.allSettled(
        (recipients || []).map((r) =>
          sendNotification.mutateAsync({
            documentId,
            recipientId: r.id,
            type: "completed",
          })
        )
      );

      return { total: recipients?.length || 0 };
    },
  });
};

export const useSendVoidNotifications = () => {
  const sendNotification = useSendESignNotification();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Get all recipients who were notified
      const { data: recipients, error } = await supabase
        .from("esign_recipients")
        .select("id")
        .eq("document_id", documentId)
        .neq("status", "pending");

      if (error) throw error;

      // Send void notification to all
      await Promise.allSettled(
        (recipients || []).map((r) =>
          sendNotification.mutateAsync({
            documentId,
            recipientId: r.id,
            type: "voided",
          })
        )
      );

      return { total: recipients?.length || 0 };
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ESignRecipient, CreateESignRecipientInput } from "@/types/esign";

// Fetch recipients for a document
export const useESignRecipients = (documentId: string | undefined) => {
  return useQuery({
    queryKey: ["esign-recipients", documentId],
    enabled: !!documentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("esign_recipients")
        .select("*")
        .eq("document_id", documentId)
        .order("signing_order", { ascending: true });

      if (error) throw error;
      return data as ESignRecipient[];
    },
  });
};

// Add recipient to document
export const useAddRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      recipient,
    }: {
      documentId: string;
      recipient: CreateESignRecipientInput;
    }) => {
      // Get current max signing order
      const { data: existing } = await supabase
        .from("esign_recipients")
        .select("signing_order")
        .eq("document_id", documentId)
        .order("signing_order", { ascending: false })
        .limit(1);

      const nextOrder = existing?.[0]?.signing_order ?? 0;

      const { data, error } = await supabase
        .from("esign_recipients")
        .insert({
          document_id: documentId,
          name: recipient.name,
          email: recipient.email,
          role: recipient.role,
          signer_type: recipient.signer_type || null,
          signing_order: recipient.signing_order ?? nextOrder + 1,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Update total_signers count if this is a signer
      if (recipient.role === "signer") {
        await supabase.rpc("log_esign_action", {
          p_document_id: documentId,
          p_recipient_id: data.id,
          p_action: "recipient_added",
          p_action_details: { 
            name: recipient.name, 
            email: recipient.email,
            role: recipient.role,
          },
        });
      }

      return data as ESignRecipient;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["esign-recipients", variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ["esign-document", variables.documentId] });
      toast({
        title: "Recipient Added",
        description: "The recipient has been added to this document.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add recipient.",
        variant: "destructive",
      });
    },
  });
};

// Update recipient
export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      documentId,
      ...updates
    }: Partial<ESignRecipient> & { id: string; documentId: string }) => {
      const { data, error } = await supabase
        .from("esign_recipients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, documentId } as ESignRecipient & { documentId: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["esign-recipients", data.documentId] });
      queryClient.invalidateQueries({ queryKey: ["esign-document", data.documentId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update recipient.",
        variant: "destructive",
      });
    },
  });
};

// Remove recipient
export const useRemoveRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, documentId }: { id: string; documentId: string }) => {
      // First check if document is still in draft
      const { data: doc } = await supabase
        .from("esign_documents")
        .select("status")
        .eq("id", documentId)
        .single();

      if (doc?.status !== "draft") {
        throw new Error("Can only remove recipients from draft documents.");
      }

      const { error } = await supabase
        .from("esign_recipients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { documentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["esign-recipients", data.documentId] });
      queryClient.invalidateQueries({ queryKey: ["esign-document", data.documentId] });
      toast({
        title: "Recipient Removed",
        description: "The recipient has been removed from this document.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove recipient.",
        variant: "destructive",
      });
    },
  });
};

// Reorder recipients
export const useReorderRecipients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      recipientIds,
    }: {
      documentId: string;
      recipientIds: string[];
    }) => {
      // Update each recipient's signing order
      const updates = recipientIds.map((id, idx) =>
        supabase
          .from("esign_recipients")
          .update({ signing_order: idx + 1 })
          .eq("id", id)
      );

      await Promise.all(updates);
      return { documentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["esign-recipients", data.documentId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reorder recipients.",
        variant: "destructive",
      });
    },
  });
};

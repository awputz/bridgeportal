import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { 
  ESignDocument, 
  ESignDocumentWithRelations, 
  CreateESignDocumentInput,
  ESignDocumentStatus 
} from "@/types/esign";

// Fetch all documents created by user
export const useESignDocuments = () => {
  return useQuery({
    queryKey: ["esign-documents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("esign_documents")
        .select(`
          *,
          recipients:esign_recipients(count),
          deal:crm_deals(property_address)
        `)
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (ESignDocument & { 
        recipients: { count: number }[]; 
        deal: { property_address: string } | null;
      })[];
    },
  });
};

// Fetch single document with all relations
export const useESignDocument = (id: string | undefined) => {
  return useQuery({
    queryKey: ["esign-document", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("esign_documents")
        .select(`
          *,
          recipients:esign_recipients(*),
          fields:esign_fields(*),
          audit_log:esign_audit_log(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as ESignDocumentWithRelations;
    },
  });
};

// Create new document with file upload
export const useCreateESignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateESignDocumentInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload file to storage
      const fileExt = input.file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("esign-documents")
        .upload(filePath, input.file);

      if (uploadError) throw uploadError;

      // 2. Get signed URL for private bucket
      const { data: signedData } = await supabase.storage
        .from("esign-documents")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      const fileUrl = signedData?.signedUrl || filePath;

      // 3. Create document record
      const { data: document, error: docError } = await supabase
        .from("esign_documents")
        .insert({
          created_by: user.id,
          deal_id: input.dealId || null,
          template_id: input.templateId || null,
          title: input.title,
          description: input.description || null,
          original_file_url: fileUrl,
          original_file_name: input.file.name,
          original_file_type: input.file.type,
          total_signers: input.recipients.filter((r) => r.role === "signer").length,
          status: "draft" as ESignDocumentStatus,
        })
        .select()
        .single();

      if (docError) throw docError;

      // 4. Create recipient records
      if (input.recipients.length > 0) {
        const recipientsToInsert = input.recipients.map((r, idx) => ({
          document_id: document.id,
          name: r.name,
          email: r.email,
          role: r.role,
          signer_type: r.signer_type || null,
          signing_order: r.signing_order ?? idx + 1,
          status: "pending" as const,
        }));

        const { error: recipientError } = await supabase
          .from("esign_recipients")
          .insert(recipientsToInsert);

        if (recipientError) throw recipientError;
      }

      // 5. Log action
      await supabase.rpc("log_esign_action", {
        p_document_id: document.id,
        p_recipient_id: null,
        p_action: "document_created",
        p_action_details: { 
          title: input.title, 
          recipient_count: input.recipients.length,
          file_name: input.file.name,
        },
      });

      return document as ESignDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-documents"] });
      toast({
        title: "Document Created",
        description: "Your document is ready for signature fields.",
      });
    },
    onError: (error) => {
      console.error("Create document error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create document.",
        variant: "destructive",
      });
    },
  });
};

// Update document metadata
export const useUpdateESignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ESignDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from("esign_documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ESignDocument;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["esign-documents"] });
      queryClient.invalidateQueries({ queryKey: ["esign-document", variables.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update document.",
        variant: "destructive",
      });
    },
  });
};

// Void a document
export const useVoidESignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from("esign_documents")
        .update({
          status: "voided" as ESignDocumentStatus,
          voided_at: new Date().toISOString(),
          void_reason: reason,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Log action
      await supabase.rpc("log_esign_action", {
        p_document_id: id,
        p_recipient_id: null,
        p_action: "document_voided",
        p_action_details: { reason },
      });

      return data as ESignDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-documents"] });
      toast({
        title: "Document Voided",
        description: "The document has been voided and can no longer be signed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to void document.",
        variant: "destructive",
      });
    },
  });
};

// Delete a draft document
export const useDeleteESignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Only allow deleting drafts
      const { data: doc } = await supabase
        .from("esign_documents")
        .select("status, original_file_url")
        .eq("id", id)
        .single();

      if (doc?.status !== "draft") {
        throw new Error("Only draft documents can be deleted.");
      }

      // Delete from storage if possible
      if (doc.original_file_url) {
        const path = doc.original_file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("esign-documents").remove([path]);
      }

      // Delete document (cascades to recipients, fields, audit log)
      const { error } = await supabase
        .from("esign_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-documents"] });
      toast({
        title: "Document Deleted",
        description: "The draft document has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete document.",
        variant: "destructive",
      });
    },
  });
};

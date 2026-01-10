import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ESignField, ESignFieldType } from "@/types/esign";

interface CreateFieldInput {
  document_id: string;
  recipient_id: string;
  field_type: ESignFieldType;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  options?: string[] | null;
}

export const useESignFields = (documentId: string | undefined) => {
  const queryClient = useQueryClient();

  const createField = useMutation({
    mutationFn: async (field: CreateFieldInput) => {
      const { data, error } = await supabase
        .from("esign_fields")
        .insert({
          document_id: field.document_id,
          recipient_id: field.recipient_id,
          field_type: field.field_type,
          page_number: field.page_number,
          x_position: field.x_position,
          y_position: field.y_position,
          width: field.width,
          height: field.height,
          required: field.required ?? true,
          label: field.label,
          placeholder: field.placeholder,
          options: field.options,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-document", documentId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create field: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateField = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<ESignField> & { id: string }) => {
      const { data, error } = await supabase
        .from("esign_fields")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-document", documentId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update field: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("esign_fields").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-document", documentId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete field: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const bulkSaveFields = useMutation({
    mutationFn: async ({
      fieldsToCreate,
      fieldsToUpdate,
      fieldsToDelete,
    }: {
      fieldsToCreate: CreateFieldInput[];
      fieldsToUpdate: (Partial<ESignField> & { id: string })[];
      fieldsToDelete: string[];
    }) => {
      // Delete fields
      if (fieldsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("esign_fields")
          .delete()
          .in("id", fieldsToDelete);
        if (deleteError) throw deleteError;
      }

      // Create new fields
      if (fieldsToCreate.length > 0) {
        const { error: createError } = await supabase
          .from("esign_fields")
          .insert(fieldsToCreate);
        if (createError) throw createError;
      }

      // Update existing fields
      for (const field of fieldsToUpdate) {
        const { id, ...updates } = field;
        const { error: updateError } = await supabase
          .from("esign_fields")
          .update(updates)
          .eq("id", id);
        if (updateError) throw updateError;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esign-document", documentId] });
      toast({ title: "Fields Saved", description: "All changes have been saved." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save fields: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return { createField, updateField, deleteField, bulkSaveFields };
};

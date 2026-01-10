import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { FilledTemplate, FilledTemplateWithTemplate } from "@/types/templates";
import type { Json } from "@/integrations/supabase/types";

export const useFilledTemplates = () => {
  return useQuery({
    queryKey: ["filled-templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("filled_templates")
        .select(`
          *,
          template:agent_templates(name, division, file_type)
        `)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as FilledTemplateWithTemplate[];
    },
  });
};

export const useFilledTemplateById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["filled-template", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("filled_templates")
        .select(`
          *,
          template:agent_templates(name, division, file_type, form_schema)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as FilledTemplateWithTemplate;
    },
    enabled: !!id,
  });
};

export const useCreateFilledTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      formData,
      dealId,
      status = "completed",
    }: {
      templateId: string;
      formData: Record<string, unknown>;
      dealId?: string;
      status?: FilledTemplate["status"];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("filled_templates")
        .insert([{
          template_id: templateId,
          user_id: user.id,
          form_data: formData as unknown as Json,
          deal_id: dealId || null,
          status,
        }])
        .select()
        .single();

      if (error) throw error;

      // Increment fill count on template
      await supabase.rpc("increment_template_fill_count", { p_template_id: templateId });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filled-templates"] });
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      toast({
        title: "Template Filled",
        description: "Your document has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFilledTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
      status,
      generatedFileUrl,
      generatedFileName,
    }: {
      id: string;
      formData?: Record<string, unknown>;
      status?: FilledTemplate["status"];
      generatedFileUrl?: string;
      generatedFileName?: string;
    }) => {
      const updates: Record<string, unknown> = {};
      if (formData !== undefined) updates.form_data = formData;
      if (status !== undefined) updates.status = status;
      if (generatedFileUrl !== undefined) updates.generated_file_url = generatedFileUrl;
      if (generatedFileName !== undefined) updates.generated_file_name = generatedFileName;

      const { data, error } = await supabase
        .from("filled_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["filled-templates"] });
      queryClient.invalidateQueries({ queryKey: ["filled-template", variables.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFilledTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("filled_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filled-templates"] });
      toast({ title: "Document Deleted" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Helper hook to track downloads
export const useTrackTemplateDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      await supabase.rpc("increment_template_download_count", { p_template_id: templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseContractTemplate } from "@/lib/contract-utils";
import type { Database } from "@/integrations/supabase/types";

export type HRContractTemplate = Database['public']['Tables']['hr_contract_templates']['Row'];
export type HRContractTemplateInsert = Database['public']['Tables']['hr_contract_templates']['Insert'];
export type HRContractTemplateUpdate = Database['public']['Tables']['hr_contract_templates']['Update'];

// Fetch all templates with optional contract type filter
export function useContractTemplates(contractType?: string) {
  return useQuery({
    queryKey: ['hr-contract-templates', contractType],
    queryFn: async () => {
      let query = supabase
        .from('hr_contract_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (contractType) {
        query = query.eq('contract_type', contractType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HRContractTemplate[];
    },
  });
}

// Fetch a single template by ID
export function useContractTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-contract-template', id],
    queryFn: async () => {
      if (!id) throw new Error('Template ID is required');
      
      const { data, error } = await supabase
        .from('hr_contract_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as HRContractTemplate;
    },
    enabled: !!id,
  });
}

// Fetch the default template for a contract type
export function useDefaultTemplate(contractType: string) {
  return useQuery({
    queryKey: ['hr-contract-template', 'default', contractType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_contract_templates')
        .select('*')
        .eq('contract_type', contractType)
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as HRContractTemplate;
    },
    enabled: !!contractType,
  });
}

// Create a new template
export function useCreateContractTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: HRContractTemplateInsert) => {
      const { data, error } = await supabase
        .from('hr_contract_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data as HRContractTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-contract-templates'] });
      toast.success('Template created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });
}

// Update an existing template
export function useUpdateContractTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HRContractTemplateUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hr_contract_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as HRContractTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-contract-templates'] });
      queryClient.invalidateQueries({ queryKey: ['hr-contract-template', data.id] });
      toast.success('Template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
}

// Delete a template (soft delete by marking inactive)
export function useDeleteContractTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('hr_contract_templates')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-contract-templates'] });
      toast.success('Template deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });
}

// Hook to parse a template with variables
export function useParseTemplate() {
  return {
    parse: (templateHtml: string, variables: Record<string, string | number | null | undefined>) => {
      return parseContractTemplate(templateHtml, variables);
    },
  };
}

// Get list of available contract types
export function useContractTypes() {
  return useQuery({
    queryKey: ['hr-contract-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_contract_templates')
        .select('contract_type')
        .eq('is_active', true);

      if (error) throw error;
      
      // Get unique contract types
      const types = [...new Set(data.map(t => t.contract_type))];
      return types;
    },
  });
}

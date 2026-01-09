import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

export type HRContract = Database['public']['Tables']['hr_contracts']['Row'];
export type HRContractInsert = Database['public']['Tables']['hr_contracts']['Insert'];
export type HRContractUpdate = Database['public']['Tables']['hr_contracts']['Update'];

export type ContractStatus = 'draft' | 'sent' | 'pending_signature' | 'signed' | 'voided';

interface ContractFilters {
  status?: ContractStatus;
  division?: string;
  agentId?: string;
  search?: string;
}

// Fetch all contracts with optional filters
export function useContracts(filters?: ContractFilters) {
  return useQuery({
    queryKey: ['hr-contracts', filters],
    queryFn: async () => {
      let query = supabase
        .from('hr_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.division) {
        query = query.eq('division', filters.division);
      }
      if (filters?.agentId) {
        query = query.eq('agent_id', filters.agentId);
      }
      if (filters?.search) {
        query = query.or(`agent_name.ilike.%${filters.search}%,agent_email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HRContract[];
    },
  });
}

// Fetch a single contract by ID
export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ['hr-contract', id],
    queryFn: async () => {
      if (!id) throw new Error('Contract ID is required');
      
      const { data, error } = await supabase
        .from('hr_contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    enabled: !!id,
  });
}

// Fetch contracts for a specific agent
export function useContractsByAgent(agentId: string | undefined) {
  return useQuery({
    queryKey: ['hr-contracts', 'by-agent', agentId],
    queryFn: async () => {
      if (!agentId) throw new Error('Agent ID is required');
      
      const { data, error } = await supabase
        .from('hr_contracts')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HRContract[];
    },
    enabled: !!agentId,
  });
}

// Create a new contract
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: HRContractInsert) => {
      const { data, error } = await supabase
        .from('hr_contracts')
        .insert(contract)
        .select()
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      toast.success('Contract created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create contract: ${error.message}`);
    },
  });
}

// Update an existing contract
export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HRContractUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hr_contracts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['hr-contract', data.id] });
      toast.success('Contract updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contract: ${error.message}`);
    },
  });
}

// Send a contract (mark as sent)
export function useSendContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await supabase
        .from('hr_contracts')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['hr-contract', data.id] });
      toast.success('Contract sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send contract: ${error.message}`);
    },
  });
}

// Sign a contract
export function useSignContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      signatureData,
      signatoryName,
      signatoryEmail,
    }: {
      contractId: string;
      signatureData: string;
      signatoryName: string;
      signatoryEmail: string;
    }) => {
      const { data, error } = await supabase
        .from('hr_contracts')
        .update({
          status: 'signed',
          signature_data: signatureData,
          signatory_name: signatoryName,
          signatory_email: signatoryEmail,
          signature_date: new Date().toISOString(),
          signed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['hr-contract', data.id] });
      toast.success('Contract signed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to sign contract: ${error.message}`);
    },
  });
}

// Void a contract
export function useVoidContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, reason }: { contractId: string; reason: string }) => {
      const { data, error } = await supabase
        .from('hr_contracts')
        .update({
          status: 'voided',
          voided_at: new Date().toISOString(),
          voided_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      return data as HRContract;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['hr-contract', data.id] });
      toast.success('Contract voided');
    },
    onError: (error: Error) => {
      toast.error(`Failed to void contract: ${error.message}`);
    },
  });
}

// Delete a contract (only drafts)
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      const { error } = await supabase
        .from('hr_contracts')
        .delete()
        .eq('id', contractId)
        .eq('status', 'draft'); // Only allow deleting drafts

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-contracts'] });
      toast.success('Contract deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contract: ${error.message}`);
    },
  });
}

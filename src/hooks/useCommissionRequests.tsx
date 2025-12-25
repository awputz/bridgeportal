import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CommissionRequest {
  id: string;
  agent_id: string;
  closing_date: string;
  deal_type: "sale" | "lease";
  property_address: string;
  commission_amount: number;
  invoice_url: string | null;
  w9_url: string | null;
  contract_url: string | null;
  status: "pending" | "under_review" | "approved" | "paid" | "rejected";
  notes: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCommissionRequest {
  closing_date: string;
  deal_type: "sale" | "lease";
  property_address: string;
  commission_amount: number;
  invoice_url?: string | null;
  w9_url?: string | null;
  contract_url?: string | null;
  notes?: string | null;
}

export const useMyCommissionRequests = () => {
  return useQuery({
    queryKey: ["commission-requests", "my"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("commission_requests")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CommissionRequest[];
    },
  });
};

export const useCreateCommissionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateCommissionRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("commission_requests")
        .insert({
          ...request,
          agent_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-requests"] });
      toast({
        title: "Request Submitted",
        description: "Your commission request has been submitted for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit commission request",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCommissionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CommissionRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from("commission_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-requests"] });
    },
  });
};

// File upload helper
export const uploadCommissionDocument = async (
  file: File,
  requestId: string,
  docType: "invoice" | "w9" | "contract"
): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${requestId}/${docType}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("private-documents")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("private-documents")
    .getPublicUrl(fileName);

  return publicUrl;
};

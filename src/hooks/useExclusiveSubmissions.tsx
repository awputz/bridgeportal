import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AddressComponents } from "@/components/ui/AddressAutocomplete";

export type ExclusiveDivision = "residential" | "investment-sales" | "commercial-leasing";
export type ExclusiveStatus = "draft" | "pending_review" | "under_review" | "approved" | "needs_revision" | "rejected" | "live";

export interface ResidentialListingData {
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  floor?: string;
  rent_price?: number;
  sale_price?: number;
  is_rental?: boolean;
  security_deposit_months?: number;
  fee_structure?: "cyof" | "op" | "co_broke";
  co_broke_percent?: number;
  amenities?: string[];
  available_date?: string;
}

export interface InvestmentSalesListingData {
  building_class?: string;
  total_units?: number;
  gross_sf?: number;
  year_built?: number;
  zoning?: string;
  lot_size?: number;
  gpi?: number;
  noi?: number;
  current_cap_rate?: number;
  pro_forma_cap_rate?: number;
  tax_class?: string;
  annual_taxes?: number;
  asking_price?: number;
  price_per_unit?: number;
  price_per_sf?: number;
  is_1031_exchange?: boolean;
}

export interface CommercialLeasingListingData {
  property_type?: "retail" | "office" | "industrial" | "flex" | "mixed";
  total_sf?: number;
  divisible_min_sf?: number;
  ceiling_height_ft?: number;
  frontage_ft?: number;
  has_basement?: boolean;
  basement_sf?: number;
  electric_amps?: number;
  ppsf?: number;
  lease_type?: "nnn" | "gross" | "modified_gross";
  possession_date?: string;
  lease_term_years?: number;
}

export type ListingData = ResidentialListingData | InvestmentSalesListingData | CommercialLeasingListingData;

export interface AdditionalDocument {
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface ExclusiveSubmission {
  id: string;
  agent_id: string;
  division: ExclusiveDivision;
  status: ExclusiveStatus;
  property_address: string;
  unit_number?: string;
  neighborhood?: string;
  borough?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  owner_name: string;
  owner_email?: string;
  owner_phone?: string;
  owner_company?: string;
  listing_data: ListingData;
  exclusive_contract_url?: string;
  additional_documents: AdditionalDocument[];
  is_off_market?: boolean;
  is_pocket_listing?: boolean;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  converted_deal_id?: string;
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExclusiveSubmission {
  division: ExclusiveDivision;
  property_address: string;
  unit_number?: string;
  neighborhood?: string;
  borough?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  owner_name: string;
  owner_email?: string;
  owner_phone?: string;
  owner_company?: string;
  listing_data?: ListingData;
  exclusive_contract_url?: string;
  additional_documents?: AdditionalDocument[];
  is_off_market?: boolean;
  is_pocket_listing?: boolean;
  status?: ExclusiveStatus;
}

// Fetch agent's own submissions
export const useMyExclusiveSubmissions = (status?: ExclusiveStatus) => {
  return useQuery({
    queryKey: ["exclusive-submissions", "mine", status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("exclusive_submissions")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown) as ExclusiveSubmission[];
    },
  });
};

// Fetch single submission
export const useExclusiveSubmission = (id: string) => {
  return useQuery({
    queryKey: ["exclusive-submissions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exclusive_submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as ExclusiveSubmission;
    },
    enabled: !!id,
  });
};

// Fetch all submissions (admin)
export const useAllExclusiveSubmissions = (filters?: {
  status?: ExclusiveStatus;
  division?: ExclusiveDivision;
}) => {
  return useQuery({
    queryKey: ["exclusive-submissions", "all", filters],
    queryFn: async () => {
      let query = supabase
        .from("exclusive_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.division) {
        query = query.eq("division", filters.division);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as ExclusiveSubmission[];
    },
  });
};

// Create submission
export const useCreateExclusiveSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: CreateExclusiveSubmission) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("exclusive_submissions")
        .insert({
          ...submission,
          agent_id: user.id,
          listing_data: (submission.listing_data || {}) as unknown as Record<string, unknown>,
          additional_documents: (submission.additional_documents || []) as unknown as Record<string, unknown>[],
        } as never)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ExclusiveSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create submission",
        variant: "destructive",
      });
    },
  });
};

// Update submission
export const useUpdateExclusiveSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExclusiveSubmission> & { id: string }) => {
      const { data, error } = await supabase
        .from("exclusive_submissions")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ExclusiveSubmission;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update submission",
        variant: "destructive",
      });
    },
  });
};

// Submit for review (change status from draft to pending_review)
export const useSubmitForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First verify the submission has required fields
      const { data: submission, error: fetchError } = await supabase
        .from("exclusive_submissions")
        .select("exclusive_contract_url")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!submission?.exclusive_contract_url) {
        throw new Error("Exclusive contract is required before submission");
      }

      const { data, error } = await supabase
        .from("exclusive_submissions")
        .update({ status: "pending_review" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ExclusiveSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions"] });
      toast({
        title: "Submitted for Review",
        description: "Your exclusive has been submitted and is pending review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit for review",
        variant: "destructive",
      });
    },
  });
};

// Admin: Update submission status
export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_notes 
    }: { 
      id: string; 
      status: ExclusiveStatus; 
      admin_notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("exclusive_submissions")
        .update({
          status,
          admin_notes,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ExclusiveSubmission;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions"] });
      toast({
        title: "Status Updated",
        description: `Submission status changed to ${data.status.replace("_", " ")}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });
};

// Delete submission
export const useDeleteExclusiveSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("exclusive_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exclusive-submissions"] });
      toast({
        title: "Deleted",
        description: "Submission has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete submission",
        variant: "destructive",
      });
    },
  });
};

// File upload helper
export const uploadExclusiveDocument = async (
  file: File,
  submissionId: string,
  documentType: "contract" | "additional"
): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const fileExt = file.name.split(".").pop();
  const fileName = documentType === "contract" 
    ? `exclusive-contract.${fileExt}`
    : `${Date.now()}-${file.name}`;
  const filePath = `${user.id}/${submissionId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("exclusive-documents")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  return filePath;
};

// Get signed URL for document
export const getExclusiveDocumentUrl = async (path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from("exclusive-documents")
    .createSignedUrl(path, 3600);

  if (error) return null;
  return data.signedUrl;
};

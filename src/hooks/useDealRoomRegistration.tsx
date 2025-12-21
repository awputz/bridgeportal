import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DealRoomRegistration {
  id: string;
  listing_id: string;
  email: string;
  phone: string;
  full_name: string;
  company_name: string | null;
  user_type: string;
  brokerage_firm: string | null;
  working_with: string | null;
  notes: string | null;
  registered_at: string;
  last_accessed_at: string | null;
  access_count: number | null;
}

export type UserType = 
  | "principal" 
  | "broker" 
  | "attorney" 
  | "lender" 
  | "developer" 
  | "other";

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  userType: UserType;
  brokerageFirm?: string;
  workingWith?: string;
}

const STORAGE_KEY_PREFIX = "deal_room_access_";

// Get stored email from localStorage for a specific listing
export const getStoredAccess = (listingId: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${listingId}`);
};

// Store access in localStorage
export const setStoredAccess = (listingId: string, email: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${listingId}`, email);
  }
};

// Check if user already has access to a listing
export const useCheckRegistration = (listingId: string, email: string | null) => {
  return useQuery({
    queryKey: ["deal-room-registration-check", listingId, email],
    queryFn: async () => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from("deal_room_registrations")
        .select("*")
        .eq("listing_id", listingId)
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      return data as DealRoomRegistration | null;
    },
    enabled: !!listingId && !!email,
  });
};

// Register a new user for deal room access
export const useRegisterForDealRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      formData,
    }: {
      listingId: string;
      formData: RegistrationFormData;
    }) => {
      const { data, error } = await supabase
        .from("deal_room_registrations")
        .insert({
          listing_id: listingId,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          full_name: formData.fullName,
          company_name: formData.companyName || null,
          user_type: formData.userType,
          brokerage_firm: formData.brokerageFirm || null,
          working_with: formData.workingWith || null,
        })
        .select()
        .single();

      if (error) {
        // Handle duplicate email error gracefully
        if (error.code === "23505") {
          throw new Error("This email is already registered for this deal room.");
        }
        throw error;
      }

      return data as DealRoomRegistration;
    },
    onSuccess: (data) => {
      // Store access in localStorage
      setStoredAccess(data.listing_id, data.email);
      queryClient.invalidateQueries({ queryKey: ["deal-room-registration-check"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register. Please try again.");
    },
  });
};

// Update access count when returning user accesses deal room
export const useUpdateAccessCount = () => {
  return useMutation({
    mutationFn: async ({ registrationId }: { registrationId: string }) => {
      const { error } = await supabase
        .from("deal_room_registrations")
        .update({
          last_accessed_at: new Date().toISOString(),
          access_count: supabase.rpc ? undefined : 1, // Will use raw SQL increment
        })
        .eq("id", registrationId);

      if (error) throw error;
    },
  });
};

// Hook to manage the full registration flow
export const useDealRoomAccess = (listingId: string) => {
  const [storedEmail] = useState(() => getStoredAccess(listingId));
  const { data: existingRegistration, isLoading: isCheckingRegistration } = 
    useCheckRegistration(listingId, storedEmail);
  const registerMutation = useRegisterForDealRoom();
  const updateAccessMutation = useUpdateAccessCount();

  const hasAccess = !!existingRegistration;

  const register = async (formData: RegistrationFormData) => {
    const result = await registerMutation.mutateAsync({ listingId, formData });
    return result;
  };

  const refreshAccess = () => {
    if (existingRegistration) {
      updateAccessMutation.mutate({ registrationId: existingRegistration.id });
    }
  };

  return {
    hasAccess,
    isCheckingRegistration,
    existingRegistration,
    register,
    refreshAccess,
    isRegistering: registerMutation.isPending,
    registrationError: registerMutation.error,
  };
};

// Get all registrations for admin
export const useAllDealRoomRegistrations = (listingId?: string) => {
  return useQuery({
    queryKey: ["deal-room-registrations", listingId],
    queryFn: async () => {
      let query = supabase
        .from("deal_room_registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      if (listingId) {
        query = query.eq("listing_id", listingId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DealRoomRegistration[];
    },
  });
};

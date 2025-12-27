import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
export interface CRMContact {
  id: string;
  agent_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  contact_type: string;
  source: string | null;
  division: string;
  tags: string[];
  notes: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  title: string | null;
  linkedin_url: string | null;
  secondary_email: string | null;
  secondary_phone: string | null;
  assistant_name: string | null;
  assistant_email: string | null;
  assistant_phone: string | null;
  birthday: string | null;
  last_contact_date: string | null;
  preferred_contact_method: string | null;
  do_not_contact: boolean;
  relationship_score: number;
  company_website: string | null;
  portfolio_size: number | null;
  investor_profile: string | null;
  ownership_entities: string[] | null;
  preferred_asset_types: string[] | null;
  target_markets: string[] | null;
  investment_criteria: Record<string, any> | null;
  // Address fields
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface CRMDealStage {
  id: string;
  division: string;
  name: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

export interface CRMDeal {
  id: string;
  agent_id: string;
  contact_id: string | null;
  stage_id: string | null;
  property_address: string;
  deal_type: string;
  division: string;
  value: number | null;
  commission: number | null;
  expected_close: string | null;
  probability: number;
  notes: string | null;
  priority: string;
  is_active: boolean;
  won: boolean | null;
  created_at: string;
  updated_at: string;
  // Common new fields
  property_type: string | null;
  neighborhood: string | null;
  borough: string | null;
  latitude: number | null;
  longitude: number | null;
  zoning: string | null;
  lot_size: number | null;
  gross_sf: number | null;
  last_activity_date: string | null;
  referral_source: string | null;
  // Investment Sales fields
  cap_rate: number | null;
  noi: number | null;
  building_class: string | null;
  unit_count: number | null;
  year_built: number | null;
  asking_price: number | null;
  offer_price: number | null;
  price_per_unit: number | null;
  price_per_sf: number | null;
  is_1031_exchange: boolean;
  financing_type: string | null;
  lender_name: string | null;
  loan_amount: number | null;
  co_broker_id: string | null;
  co_broker_name: string | null;
  co_broker_split: number | null;
  due_diligence_deadline: string | null;
  // Commercial Leasing fields
  tenant_legal_name: string | null;
  asking_rent_psf: number | null;
  negotiated_rent_psf: number | null;
  lease_type: string | null;
  lease_term_months: number | null;
  commencement_date: string | null;
  expiration_date: string | null;
  free_rent_months: number | null;
  escalation_rate: number | null;
  ti_allowance_psf: number | null;
  security_deposit_months: number | null;
  landlord_broker: string | null;
  use_clause: string | null;
  space_type: string | null;
  // Residential fields
  bedrooms: number | null;
  bathrooms: number | null;
  is_rental: boolean;
  listing_price: number | null;
  monthly_rent: number | null;
  lease_length_months: number | null;
  move_in_date: string | null;
  pets_allowed: boolean;
  guarantor_required: boolean;
  co_broke_percent: number | null;
  // Joined data
  contact?: CRMContact | null;
  stage?: CRMDealStage | null;
}

export interface CRMActivity {
  id: string;
  agent_id: string;
  contact_id: string | null;
  deal_id: string | null;
  activity_type: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed_at: string | null;
  is_completed: boolean;
  created_at: string;
  // Joined data
  contact?: CRMContact | null;
  deal?: CRMDeal | null;
}

// ========== Deal Stages ==========
export const useDealStages = (division?: string) => {
  return useQuery({
    queryKey: ["crm-deal-stages", division],
    queryFn: async () => {
      let query = supabase
        .from("crm_deal_stages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (division) {
        query = query.eq("division", division);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRMDealStage[];
    },
  });
};

// ========== Contacts ==========
export const useCRMContacts = (division?: string) => {
  return useQuery({
    queryKey: ["crm-contacts", division],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("crm_contacts")
        .select("*")
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (division) {
        query = query.eq("division", division);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRMContact[];
    },
  });
};

export const useCRMContact = (id: string) => {
  return useQuery({
    queryKey: ["crm-contact", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CRMContact;
    },
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Partial<CRMContact> & { agent_id: string; full_name: string; division: string }) => {
      const { data, error } = await supabase
        .from("crm_contacts")
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      toast.success("Contact created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create contact: " + error.message);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMContact> & { id: string }) => {
      const { data, error } = await supabase
        .from("crm_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["crm-contact", data.id] });
      toast.success("Contact updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update contact: " + error.message);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_contacts")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      toast.success("Contact deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete contact: " + error.message);
    },
  });
};

// ========== Deals ==========
export const useCRMDeals = (division?: string) => {
  return useQuery({
    queryKey: ["crm-deals", division],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("crm_deals")
        .select(`
          *,
          contact:crm_contacts(*),
          stage:crm_deal_stages(*)
        `)
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (division) {
        query = query.eq("division", division);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRMDeal[];
    },
  });
};

export const useCRMDeal = (id: string) => {
  return useQuery({
    queryKey: ["crm-deal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_deals")
        .select(`
          *,
          contact:crm_contacts(*),
          stage:crm_deal_stages(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CRMDeal;
    },
    enabled: !!id,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Omit<CRMDeal, "id" | "created_at" | "updated_at" | "is_active" | "won" | "contact" | "stage">) => {
      const { data, error } = await supabase
        .from("crm_deals")
        .insert(deal)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Deal created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create deal: " + error.message);
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMDeal> & { id: string }) => {
      const { data, error } = await supabase
        .from("crm_deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      queryClient.invalidateQueries({ queryKey: ["crm-deal", data.id] });
      toast.success("Deal updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update deal: " + error.message);
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_deals")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      toast.success("Deal deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete deal: " + error.message);
    },
  });
};

// ========== Activities ==========
export const useCRMActivities = (filters?: { contactId?: string; dealId?: string; limit?: number }) => {
  return useQuery({
    queryKey: ["crm-activities", filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("crm_activities")
        .select(`
          *,
          contact:crm_contacts(id, full_name),
          deal:crm_deals(id, property_address)
        `)
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (filters?.contactId) {
        query = query.eq("contact_id", filters.contactId);
      }
      if (filters?.dealId) {
        query = query.eq("deal_id", filters.dealId);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRMActivity[];
    },
  });
};

export const useTodaysTasks = () => {
  return useQuery({
    queryKey: ["crm-todays-tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from("crm_activities")
        .select(`
          *,
          contact:crm_contacts(id, full_name),
          deal:crm_deals(id, property_address)
        `)
        .eq("agent_id", user.id)
        .eq("is_completed", false)
        .gte("due_date", startOfDay)
        .lte("due_date", endOfDay)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as CRMActivity[];
    },
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<CRMActivity, "id" | "created_at" | "contact" | "deal">) => {
      const { data, error } = await supabase
        .from("crm_activities")
        .insert(activity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
      queryClient.invalidateQueries({ queryKey: ["crm-todays-tasks"] });
      toast.success("Activity created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create activity: " + error.message);
    },
  });
};

export const useCompleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("crm_activities")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-activities"] });
      queryClient.invalidateQueries({ queryKey: ["crm-todays-tasks"] });
      toast.success("Task completed");
    },
    onError: (error: Error) => {
      toast.error("Failed to complete task: " + error.message);
    },
  });
};

// ========== Dashboard Stats ==========
export const useCRMStats = (division?: string) => {
  return useQuery({
    queryKey: ["crm-stats", division],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get active deals for this agent
      let dealsQuery = supabase
        .from("crm_deals")
        .select("id, value", { count: "exact" })
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .is("won", null);

      if (division) {
        dealsQuery = dealsQuery.eq("division", division);
      }

      const { count: activeDeals, data: dealsData } = await dealsQuery;

      // Get contacts for this agent
      let contactsQuery = supabase
        .from("crm_contacts")
        .select("id", { count: "exact" })
        .eq("agent_id", user.id)
        .eq("is_active", true);

      if (division) {
        contactsQuery = contactsQuery.eq("division", division);
      }

      const { count: totalContacts } = await contactsQuery;

      // Get today's incomplete tasks for this agent
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { count: todaysTasks } = await supabase
        .from("crm_activities")
        .select("id", { count: "exact" })
        .eq("agent_id", user.id)
        .eq("is_completed", false)
        .gte("due_date", startOfDay)
        .lte("due_date", endOfDay);

      // Calculate pipeline value
      const pipelineValue = dealsData?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

      return {
        activeDeals: activeDeals || 0,
        totalContacts: totalContacts || 0,
        todaysTasks: todaysTasks || 0,
        pipelineValue,
      };
    },
  });
};

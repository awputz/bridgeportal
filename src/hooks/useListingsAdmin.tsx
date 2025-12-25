import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type InvestmentListing = Tables<"investment_listings">;
type CommercialListing = Tables<"commercial_listings">;

export function useInvestmentListingsAdmin() {
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-investment-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_listings")
        .select(`
          *,
          investment_listing_agents (
            id,
            agent_id,
            role,
            team_members:agent_id (
              id,
              name,
              email
            )
          )
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createListing = useMutation({
    mutationFn: async (listing: TablesInsert<"investment_listings">) => {
      const { data, error } = await supabase
        .from("investment_listings")
        .insert(listing)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast({ title: "Listing created" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create listing", description: error.message, variant: "destructive" });
    },
  });

  const updateListing = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"investment_listings">) => {
      const { error } = await supabase
        .from("investment_listings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast({ title: "Listing updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("investment_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast({ title: "Listing deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("investment_listings")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-investment-listings"] });
      toast({ title: "Listing status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  return {
    listings,
    isLoading,
    createListing,
    updateListing,
    deleteListing,
    toggleActive,
  };
}

export function useCommercialListingsAdmin() {
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-commercial-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commercial_listings")
        .select(`
          *,
          commercial_listing_agents (
            id,
            agent_id,
            role,
            team_members:agent_id (
              id,
              name,
              email
            )
          )
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createListing = useMutation({
    mutationFn: async (listing: TablesInsert<"commercial_listings">) => {
      const { data, error } = await supabase
        .from("commercial_listings")
        .insert(listing)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast({ title: "Listing created" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create listing", description: error.message, variant: "destructive" });
    },
  });

  const updateListing = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"commercial_listings">) => {
      const { error } = await supabase
        .from("commercial_listings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast({ title: "Listing updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("commercial_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast({ title: "Listing deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("commercial_listings")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commercial-listings"] });
      toast({ title: "Listing status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  return {
    listings,
    isLoading,
    createListing,
    updateListing,
    deleteListing,
    toggleActive,
  };
}

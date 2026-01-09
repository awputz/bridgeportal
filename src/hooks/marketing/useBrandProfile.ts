import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface BrandProfile {
  id: string;
  agent_id: string;
  full_name: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  company_name: string | null;
  office_address: string | null;
  company_phone: string | null;
  instagram_handle: string | null;
  facebook_handle: string | null;
  linkedin_handle: string | null;
  twitter_handle: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  headshot_asset_id: string | null;
  logo_asset_id: string | null;
  bio: string | null;
  tagline: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export type BrandProfileInput = Omit<BrandProfile, 'id' | 'agent_id' | 'created_at' | 'updated_at'>;

export const useBrandProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['brand-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('agent_brand_profiles')
        .select('*')
        .eq('agent_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as BrandProfile | null;
    },
    enabled: !!user?.id,
  });
};

export const useUpsertBrandProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profile: BrandProfileInput) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('agent_brand_profiles')
        .upsert({
          agent_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'agent_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-profile'] });
      toast.success("Brand profile saved");
    },
    onError: (error) => {
      toast.error("Failed to save profile: " + error.message);
    },
  });
};

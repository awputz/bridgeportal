import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CurrentAgent {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  title: string | null;
  category: string | null;
  photoUrl: string | null;
  phone: string | null;
}

export const useCurrentAgent = () => {
  return useQuery({
    queryKey: ['current-agent'],
    queryFn: async (): Promise<CurrentAgent | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .maybeSingle();

      const email = profile?.email || user.email || '';
      const fullName = profile?.full_name || '';
      
      // Extract first name from full name
      const firstName = fullName.split(' ')[0] || email.split('@')[0] || 'Agent';

      // Try to find matching team member by email
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('name, title, category, image_url, phone')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      return {
        id: user.id,
        email,
        fullName: teamMember?.name || fullName,
        firstName: teamMember?.name?.split(' ')[0] || firstName,
        title: teamMember?.title || null,
        category: teamMember?.category || null,
        photoUrl: teamMember?.image_url || null,
        phone: teamMember?.phone || profile?.phone || null,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

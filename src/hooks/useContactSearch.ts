import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { withRetry } from '@/lib/supabaseRetry';
import type { CRMContact } from './useCRM';

export const useContactSearch = (searchTerm: string, division?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['contact-search', searchTerm, division, user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await withRetry(
        async () => {
          let query = supabase
            .from('crm_contacts')
            .select('*')
            .eq('is_active', true)
            .is('deleted_at', null);

          if (searchTerm && searchTerm.length >= 2) {
            // Use full-text search with proper escaping
            const cleanedSearch = searchTerm
              .replace(/[^\w\s@.-]/g, '') // Remove special chars except @ . -
              .trim();

            if (cleanedSearch) {
              // Use ilike for simple search (full-text search requires proper setup)
              query = query.or(
                `full_name.ilike.%${cleanedSearch}%,` +
                `email.ilike.%${cleanedSearch}%,` +
                `company.ilike.%${cleanedSearch}%,` +
                `phone.ilike.%${cleanedSearch}%`
              );
            }
          }

          if (division) {
            query = query.eq('division', division);
          }

          return query
            .order('last_contact_date', { ascending: false, nullsFirst: false })
            .limit(50);
        },
        { maxAttempts: 3 }
      );

      if (error) throw error;
      return data as CRMContact[];
    },
    enabled: !!user?.id && searchTerm.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false, // Don't refetch search on focus
    refetchOnReconnect: true,
    retry: 2,
  });
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentCategory {
  id: string;
  name: string;
  description: string | null;
  parent_category_id: string | null;
  color: string;
  icon: string;
  division: string | null;
  is_active: boolean;
  display_order: number;
}

export const useDocumentCategories = (division?: string) => {
  return useQuery({
    queryKey: ['document-categories', division],
    queryFn: async () => {
      let query = supabase
        .from('document_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (division) {
        query = query.or(`division.eq.${division},division.is.null`);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Document categories query failed:', error.message);
        return [];
      }
      return data as DocumentCategory[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  });
};

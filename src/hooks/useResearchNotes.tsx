import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ResearchNote {
  id: string;
  title: string;
  date: string;
  category: string | null;
  summary: string | null;
  content: string | null;
  download_link: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useResearchNotes = (filters?: {
  category?: string;
  year?: number;
}) => {
  return useQuery({
    queryKey: ["research_notes", filters],
    queryFn: async () => {
      let query = supabase
        .from("research_notes")
        .select("*")
        .order("date", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.year) {
        query = query.gte("date", `${filters.year}-01-01`)
                     .lte("date", `${filters.year}-12-31`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ResearchNote[];
    },
  });
};

export const useResearchNote = (id: string) => {
  return useQuery({
    queryKey: ["research_note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_notes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as ResearchNote | null;
    },
    enabled: !!id,
  });
};
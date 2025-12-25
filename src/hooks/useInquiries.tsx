import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  user_type: string | null;
  inquiry_type: string | null;
  property_address: string | null;
  neighborhoods: string | null;
  requirements: string | null;
  budget: string | null;
  timeline: string | null;
  timing: string | null;
  assignment_type: string | null;
  unit_count: string | null;
  notes: string | null;
  created_at: string;
}

export const useInquiries = () => {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Inquiry[];
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast({
        title: "Inquiry deleted",
        description: "The inquiry has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    },
  });
};

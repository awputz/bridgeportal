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
  status: string | null;
  contacted_at: string | null;
  contacted_by: string | null;
  follow_up_notes: string | null;
}

export type InquiryStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

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

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Inquiry, "status" | "contacted_at" | "contacted_by" | "follow_up_notes">>;
    }) => {
      const { error } = await supabase
        .from("inquiries")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive",
      });
    },
  });
};

export const useMarkAsContacted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from("inquiries")
        .update({
          status: "contacted",
          contacted_at: new Date().toISOString(),
          contacted_by: userId,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast({
        title: "Marked as contacted",
        description: "Inquiry status updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark inquiry as contacted",
        variant: "destructive",
      });
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type DealRoomRegistration = Tables<"deal_room_registrations">;
type DealRoomDocument = Tables<"deal_room_documents">;

export function useDealRoomRegistrations() {
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["admin-deal-room-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_registrations")
        .select(`
          *,
          investment_listings:listing_id (
            property_address,
            asset_class
          )
        `)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteRegistration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("deal_room_registrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-room-registrations"] });
      toast({ title: "Registration deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  return { registrations, isLoading, deleteRegistration };
}

export function useDealRoomDocuments() {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["admin-deal-room-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_room_documents")
        .select(`
          *,
          investment_listings:listing_id (
            property_address
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createDocument = useMutation({
    mutationFn: async (doc: TablesInsert<"deal_room_documents">) => {
      const { error } = await supabase.from("deal_room_documents").insert(doc);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-room-documents"] });
      toast({ title: "Document added" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add document", description: error.message, variant: "destructive" });
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TablesUpdate<"deal_room_documents">) => {
      const { error } = await supabase
        .from("deal_room_documents")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-room-documents"] });
      toast({ title: "Document updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("deal_room_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deal-room-documents"] });
      toast({ title: "Document deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  return { documents, isLoading, createDocument, updateDocument, deleteDocument };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Note {
  id: string;
  agent_id: string;
  title: string;
  content: string | null;
  color: string;
  is_pinned: boolean;
  tags: string[];
  deal_id: string | null;
  contact_id: string | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  deal?: { property_address: string } | null;
  contact?: { full_name: string } | null;
}

export interface NoteFilters {
  search?: string;
  color?: string;
  isPinned?: boolean;
  hasDeal?: boolean;
  hasContact?: boolean;
}

export const useNotes = (filters?: NoteFilters) => {
  return useQuery({
    queryKey: ["notes", filters],
    queryFn: async () => {
      let query = supabase
        .from("agent_notes")
        .select(`
          *,
          deal:crm_deals(property_address),
          contact:crm_contacts(full_name)
        `)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (filters?.color) {
        query = query.eq("color", filters.color);
      }
      if (filters?.isPinned !== undefined) {
        query = query.eq("is_pinned", filters.isPinned);
      }
      if (filters?.hasDeal) {
        query = query.not("deal_id", "is", null);
      }
      if (filters?.hasContact) {
        query = query.not("contact_id", "is", null);
      }

      const { data, error } = await query;
      if (error) throw error;

      let notes = data as Note[];

      // Client-side search filtering
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        notes = notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchLower) ||
            note.content?.toLowerCase().includes(searchLower) ||
            note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return notes;
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (note: Partial<Note>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("agent_notes")
        .insert({
          agent_id: user.user.id,
          title: note.title || "Untitled Note",
          content: note.content,
          color: note.color || "yellow",
          is_pinned: note.is_pinned || false,
          tags: note.tags || [],
          deal_id: note.deal_id,
          contact_id: note.contact_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Note created" });
    },
    onError: (error) => {
      toast({ title: "Error creating note", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("agent_notes")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      toast({ title: "Error updating note", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agent_notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Note deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting note", description: error.message, variant: "destructive" });
    },
  });
};

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
  starred: boolean;
  tags: string[];
  deal_id: string | null;
  contact_id: string | null;
  folder_id: string | null;
  priority: string;
  category: string;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  deal?: { property_address: string } | null;
  contact?: { full_name: string } | null;
  folder?: { name: string } | null;
  participants?: NoteParticipant[];
}

export interface NoteFolder {
  id: string;
  agent_id: string;
  name: string;
  parent_folder_id: string | null;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  note_count?: number;
}

export interface NoteParticipant {
  id: string;
  note_id: string;
  contact_id: string;
  created_at: string;
  contact?: { id: string; full_name: string; email: string | null };
}

export interface NoteFilters {
  search?: string;
  folderId?: string | "starred" | "inbox" | "all";
  category?: string;
  priority?: string;
  participantId?: string;
  dealId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "updated_at" | "created_at" | "title" | "priority";
  sortDirection?: "asc" | "desc";
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
          contact:crm_contacts(full_name),
          folder:note_folders(name)
        `);

      // Apply folder filter
      if (filters?.folderId === "starred") {
        query = query.eq("starred", true);
      } else if (filters?.folderId === "inbox") {
        query = query.is("folder_id", null);
      } else if (filters?.folderId && filters.folderId !== "all") {
        query = query.eq("folder_id", filters.folderId);
      }

      // Apply category filter
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      // Apply priority filter
      if (filters?.priority) {
        query = query.eq("priority", filters.priority);
      }

      // Apply deal filter
      if (filters?.dealId) {
        query = query.eq("deal_id", filters.dealId);
      }

      // Apply date filters
      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }

      // Apply sorting
      const sortBy = filters?.sortBy || "updated_at";
      const sortDirection = filters?.sortDirection || "desc";
      
      // Always show starred first, then apply the selected sort
      query = query
        .order("starred", { ascending: false })
        .order(sortBy, { ascending: sortDirection === "asc" });

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
            note.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return notes;
    },
  });
};

export const useNote = (noteId: string | null) => {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      const { data, error } = await supabase
        .from("agent_notes")
        .select(`
          *,
          deal:crm_deals(property_address),
          contact:crm_contacts(full_name),
          folder:note_folders(name)
        `)
        .eq("id", noteId)
        .single();

      if (error) throw error;
      return data as Note;
    },
    enabled: !!noteId,
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
          starred: note.starred || false,
          tags: note.tags || [],
          deal_id: note.deal_id,
          contact_id: note.contact_id,
          folder_id: note.folder_id,
          priority: note.priority || "normal",
          category: note.category || "general",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
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
      queryClient.invalidateQueries({ queryKey: ["note"] });
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
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
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
      toast({ title: "Note deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting note", description: error.message, variant: "destructive" });
    },
  });
};

// Folder hooks
export const useNoteFolders = () => {
  return useQuery({
    queryKey: ["note-folders"],
    queryFn: async () => {
      // Get folders with note counts
      const { data: folders, error } = await supabase
        .from("note_folders")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Get note counts per folder
      const { data: notes } = await supabase
        .from("agent_notes")
        .select("folder_id");

      const folderCounts: Record<string, number> = {};
      notes?.forEach((note) => {
        if (note.folder_id) {
          folderCounts[note.folder_id] = (folderCounts[note.folder_id] || 0) + 1;
        }
      });

      return (folders as NoteFolder[]).map((folder) => ({
        ...folder,
        note_count: folderCounts[folder.id] || 0,
      }));
    },
  });
};

export const useCreateNoteFolder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (folder: Partial<NoteFolder>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("note_folders")
        .insert({
          agent_id: user.user.id,
          name: folder.name || "New Folder",
          color: folder.color || "gray",
          icon: folder.icon || "folder",
          parent_folder_id: folder.parent_folder_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
      toast({ title: "Folder created" });
    },
    onError: (error) => {
      toast({ title: "Error creating folder", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateNoteFolder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NoteFolder> & { id: string }) => {
      const { data, error } = await supabase
        .from("note_folders")
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
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
    },
    onError: (error) => {
      toast({ title: "Error updating folder", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteNoteFolder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, unset folder_id for all notes in this folder
      await supabase
        .from("agent_notes")
        .update({ folder_id: null })
        .eq("folder_id", id);

      const { error } = await supabase.from("note_folders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-folders"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Folder deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting folder", description: error.message, variant: "destructive" });
    },
  });
};

// Participant hooks
export const useNoteParticipants = (noteId: string | null) => {
  return useQuery({
    queryKey: ["note-participants", noteId],
    queryFn: async () => {
      if (!noteId) return [];
      
      const { data, error } = await supabase
        .from("note_participants")
        .select(`
          *,
          contact:crm_contacts(id, full_name, email)
        `)
        .eq("note_id", noteId);

      if (error) throw error;
      return data as NoteParticipant[];
    },
    enabled: !!noteId,
  });
};

export const useAddNoteParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, contactId }: { noteId: string; contactId: string }) => {
      const { data, error } = await supabase
        .from("note_participants")
        .insert({ note_id: noteId, contact_id: contactId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["note-participants", variables.noteId] });
    },
  });
};

export const useRemoveNoteParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, contactId }: { noteId: string; contactId: string }) => {
      const { error } = await supabase
        .from("note_participants")
        .delete()
        .eq("note_id", noteId)
        .eq("contact_id", contactId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["note-participants", variables.noteId] });
    },
  });
};

// Special counts for sidebar
export const useNoteCounts = () => {
  return useQuery({
    queryKey: ["note-counts"],
    queryFn: async () => {
      const { data: notes, error } = await supabase
        .from("agent_notes")
        .select("id, folder_id, starred");

      if (error) throw error;

      const total = notes?.length || 0;
      const starred = notes?.filter((n) => n.starred).length || 0;
      const inbox = notes?.filter((n) => !n.folder_id).length || 0;

      return { total, starred, inbox };
    },
  });
};

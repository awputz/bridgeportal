import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GoogleContact {
  resourceName: string;
  etag?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  photoUrl?: string;
  address?: string;
}

export function useContactsConnection() {
  return useQuery({
    queryKey: ['contacts-connection'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { connected: false };

      const { data, error } = await supabase.functions.invoke('google-contacts-list', {
        body: { action: 'check-connection' }
      });

      if (error) throw error;
      return data as { connected: boolean };
    }
  });
}

export function useConnectContacts() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-contacts-auth', {
        body: { action: 'get-auth-url' }
      });

      if (error) throw error;
      window.open(data.url, '_blank', 'width=500,height=600');
      return data;
    }
  });
}

export function useDisconnectContacts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-contacts-auth', {
        body: { action: 'disconnect' }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts-connection'] });
    }
  });
}

export function useGoogleContactsList(enabled = true) {
  return useQuery({
    queryKey: ['google-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-contacts-list', {
        body: { action: 'list' }
      });

      if (error) throw error;
      return data as { contacts: GoogleContact[]; nextPageToken?: string; totalItems?: number };
    },
    enabled
  });
}

export function useImportGoogleContacts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contacts, division }: { contacts: GoogleContact[]; division: string }) => {
      const { data, error } = await supabase.functions.invoke('google-contacts-import', {
        body: { contacts, division }
      });

      if (error) throw error;
      return data as { imported: number; skipped: number; message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
    },
    onError: (error) => {
      toast.error('Failed to import contacts');
    }
  });
}

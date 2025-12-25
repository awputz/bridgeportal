import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  parents?: string[];
}

export function useDriveConnection() {
  return useQuery({
    queryKey: ['drive-connection'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { connected: false };

      const { data, error } = await supabase.functions.invoke('google-drive-auth', {
        body: { action: 'check-connection' }
      });

      if (error) throw error;
      return data as { connected: boolean };
    }
  });
}

export function useConnectDrive() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-drive-auth', {
        body: { action: 'get-auth-url' }
      });

      if (error) throw error;
      window.open(data.url, '_blank', 'width=500,height=600');
      return data;
    }
  });
}

export function useDisconnectDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-drive-auth', {
        body: { action: 'disconnect' }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive-connection'] });
    }
  });
}

export function useDriveFiles(options?: { query?: string; folderId?: string; enabled?: boolean }) {
  return useQuery({
    queryKey: ['drive-files', options?.query, options?.folderId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: { action: 'list', query: options?.query, folderId: options?.folderId }
      });

      if (error) throw error;
      return data as { files: DriveFile[]; nextPageToken?: string };
    },
    enabled: options?.enabled !== false
  });
}

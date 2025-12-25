import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      if (!session) return { isConnected: false };

      try {
        const { data, error } = await supabase.functions.invoke('google-drive-auth', {
          body: { action: 'check-connection' }
        });

        if (error) {
          console.error('Drive connection check error:', error);
          return { isConnected: false };
        }
        return { isConnected: data?.connected || false };
      } catch (err) {
        console.error('Drive connection check failed:', err);
        return { isConnected: false };
      }
    },
    retry: false,
    staleTime: 30000,
  });
}

export function useConnectDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-drive-auth', {
        body: { action: 'get-auth-url' }
      });

      if (error) throw error;
      
      // Open popup for OAuth
      const popup = window.open(data.url, '_blank', 'width=500,height=600');
      
      // Poll for popup close and refetch connection
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            queryClient.invalidateQueries({ queryKey: ['drive-connection'] });
            resolve(data);
          }
        }, 500);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          resolve(data);
        }, 300000);
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to connect Google Drive: ' + error.message);
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
      toast.success('Google Drive disconnected');
      queryClient.invalidateQueries({ queryKey: ['drive-connection'] });
      queryClient.invalidateQueries({ queryKey: ['drive-files'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to disconnect: ' + error.message);
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
    enabled: options?.enabled !== false,
    staleTime: 60000,
    retry: 1,
  });
}

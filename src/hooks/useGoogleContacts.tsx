import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { invokeWithAuthHandling } from "@/lib/auth";
import { useDivision } from "@/contexts/DivisionContext";
import { useState, useCallback } from "react";

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

interface ConnectionData {
  connected: boolean;
  lastSync: string | null;
  syncCount: number;
  needsReconnect: boolean;
}

export function useContactsConnection() {
  return useQuery({
    queryKey: ["contacts-connection"],
    queryFn: async (): Promise<ConnectionData> => {
      console.log("[useContactsConnection] Checking connection status...");
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("[useContactsConnection] No user found");
          return { connected: false, lastSync: null, syncCount: 0, needsReconnect: false };
        }

        // Call edge function to check connection status (doesn't trigger token refresh)
        const { data, error } = await invokeWithAuthHandling<{ 
          connected?: boolean; 
          needsReconnect?: boolean;
          reason?: string;
        }>(
          "google-contacts-list",
          { body: { action: "check-connection" } }
        );

        console.log("[useContactsConnection] Edge function response:", { data, error });

        if (error) {
          console.error("[useContactsConnection] Edge function error:", error);
          return { 
            connected: false, 
            lastSync: null, 
            syncCount: 0,
            needsReconnect: true
          };
        }
        
        if (!data?.connected) {
          console.log("[useContactsConnection] Not connected:", data?.reason);
          return { 
            connected: false, 
            lastSync: null, 
            syncCount: 0,
            needsReconnect: data?.needsReconnect || false
          };
        }

        // Get last sync info from contact_sync_log
        const { data: syncLog } = await supabase
          .from("contact_sync_log")
          .select("last_synced_at")
          .eq("agent_id", user.id)
          .order("last_synced_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get sync count
        const { count } = await supabase
          .from("crm_contacts")
          .select("*", { count: "exact", head: true })
          .eq("agent_id", user.id)
          .eq("source", "google-contacts");

        console.log("[useContactsConnection] Connected! syncCount:", count, "lastSync:", syncLog?.last_synced_at);

        return {
          connected: true,
          lastSync: syncLog?.last_synced_at || null,
          syncCount: count || 0,
          needsReconnect: false,
        };
      } catch (err) {
        console.error("[useContactsConnection] Unexpected error:", err);
        return { 
          connected: false, 
          lastSync: null, 
          syncCount: 0,
          needsReconnect: false
        };
      }
    },
    retry: 1,
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useConnectContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await invokeWithAuthHandling<{ url: string }>(
        "google-contacts-auth",
        {
          body: { action: "get-auth-url" },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error("Failed to get auth URL");

      // Open popup for OAuth
      const popup = window.open(data.url, "_blank", "width=500,height=600");

      // Poll for popup close and refetch connection
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            queryClient.invalidateQueries({ queryKey: ["contacts-connection"] });
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
      toast.error("Failed to connect Google Contacts: " + error.message);
    },
  });
}

export function useDisconnectContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await invokeWithAuthHandling("google-contacts-auth", {
        body: { action: "disconnect" },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Google Contacts disconnected");
      queryClient.invalidateQueries({ queryKey: ["contacts-connection"] });
      queryClient.invalidateQueries({ queryKey: ["google-contacts"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to disconnect: " + error.message);
    },
  });
}

export function useGoogleContactsList(enabled = true) {
  const { data: connection } = useContactsConnection();
  
  return useQuery({
    queryKey: ["google-contacts"],
    queryFn: async () => {
      // Pre-check: don't call edge function if not connected
      if (!connection?.connected) {
        return { contacts: [], nextPageToken: undefined, totalItems: 0 };
      }

      const { data, error } = await invokeWithAuthHandling("google-contacts-list", {
        body: { action: "list" },
      });

      if (error) throw error;
      return data as { contacts: GoogleContact[]; nextPageToken?: string; totalItems?: number };
    },
    enabled: enabled && !!connection?.connected,
    staleTime: 60000, // Cache for 1 minute
    retry: 1,
  });
}

export function useImportGoogleContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contacts, division }: { contacts: GoogleContact[]; division: string }) => {
      const { data, error } = await invokeWithAuthHandling("google-contacts-import", {
        body: { contacts, division },
      });

      if (error) throw error;
      return data as { imported: number; skipped: number; message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to import contacts: " + error.message);
    },
  });
}

// New hook for full sync with progress tracking
export function useSyncAllContacts() {
  const queryClient = useQueryClient();
  const { division } = useDivision();
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      // Step 1: Fetch all contacts from Google with full pagination
      const { data: listData, error: listError } = await invokeWithAuthHandling<{
        contacts?: GoogleContact[];
      }>("google-contacts-list", {
        body: { action: "list-all" },
      });

      if (listError) throw listError;

      const contacts = listData?.contacts || [];
      const total = contacts.length;

      if (total === 0) {
        return { imported: 0, skipped: 0, total: 0 };
      }

      // Step 2: Import in batches of 50
      const batchSize = 50;
      let imported = 0;
      let skipped = 0;

      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);
        setProgress({ current: Math.min(i + batchSize, total), total });

        const { data, error } = await invokeWithAuthHandling<{
          imported?: number;
          skipped?: number;
        }>("google-contacts-import", {
          body: { contacts: batch, division },
        });

        if (!error && data) {
          imported += data.imported || 0;
          skipped += data.skipped || 0;
        }
      }

      setProgress(null);
      return { imported, skipped, total };
    },
    onSuccess: (data) => {
      if (data.imported > 0) {
        toast.success(`Synced ${data.imported} contacts${data.skipped > 0 ? ` (${data.skipped} duplicates skipped)` : ''}`);
      } else if (data.total === 0) {
        toast.info("No contacts found in Google Contacts");
      } else {
        toast.info("All contacts already synced");
      }
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts-connection"] });
    },
    onError: (error: Error) => {
      setProgress(null);
      toast.error("Sync failed: " + error.message);
    },
  });

  return {
    ...mutation,
    progress,
  };
}

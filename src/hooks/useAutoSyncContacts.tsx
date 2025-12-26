import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useContactsConnection, useGoogleContactsList, GoogleContact } from "./useGoogleContacts";
import { useDivision } from "@/contexts/DivisionContext";
import { invokeWithAuthHandling } from "@/lib/auth";

interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncedCount: number;
  error: string | null;
}

export function useAutoSyncContacts() {
  const { division } = useDivision();
  const queryClient = useQueryClient();
  const hasSyncedRef = useRef(false);
  const isSyncingRef = useRef(false);
  
  const { data: connectionData, isLoading: isCheckingConnection } = useContactsConnection();
  const { data: googleContactsData, isLoading: isLoadingContacts } = useGoogleContactsList(
    connectionData?.connected && !hasSyncedRef.current
  );

  const performSync = useCallback(async (contacts: GoogleContact[]) => {
    if (isSyncingRef.current || contacts.length === 0) return;
    
    isSyncingRef.current = true;
    
    try {
      const { data, error } = await invokeWithAuthHandling("google-contacts-import", {
        body: { contacts, division },
      });

      if (error) {
        console.error("Auto-sync error:", error);
        return;
      }

      const result = data as { imported: number; skipped: number; message: string };
      
      // Only show toast if contacts were actually imported
      if (result.imported > 0) {
        toast.success(`Synced ${result.imported} new contact${result.imported !== 1 ? 's' : ''} from Google`, {
          description: result.skipped > 0 ? `${result.skipped} already existed` : undefined,
        });
        queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      }
      
      hasSyncedRef.current = true;
    } catch (err) {
      console.error("Auto-sync failed:", err);
    } finally {
      isSyncingRef.current = false;
    }
  }, [division, queryClient]);

  // Auto-sync when Google Contacts are loaded
  useEffect(() => {
    if (
      !isCheckingConnection && 
      !isLoadingContacts && 
      connectionData?.connected && 
      googleContactsData?.contacts && 
      googleContactsData.contacts.length > 0 &&
      !hasSyncedRef.current
    ) {
      performSync(googleContactsData.contacts);
    }
  }, [isCheckingConnection, isLoadingContacts, connectionData, googleContactsData, performSync]);

  // Reset sync flag when division changes
  useEffect(() => {
    hasSyncedRef.current = false;
  }, [division]);

  return {
    isConnected: connectionData?.connected ?? false,
    isLoading: isCheckingConnection || isLoadingContacts,
    isSyncing: isSyncingRef.current,
    googleContactsCount: googleContactsData?.contacts?.length ?? 0,
  };
}

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContactsConnection, GoogleContact } from "./useGoogleContacts";
import { useDivision } from "@/contexts/DivisionContext";
import { invokeWithAuthHandling } from "@/lib/auth";

const BATCH_SIZE = 50;
const SYNC_DEBOUNCE_MS = 2000;

export function useAutoSyncContacts() {
  const { division } = useDivision();
  const queryClient = useQueryClient();
  const hasSyncedRef = useRef(false);
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const failureCountRef = useRef(0);
  
  const { data: connectionData, isLoading: isCheckingConnection } = useContactsConnection();

  const performSync = useCallback(async () => {
    // Prevent race conditions - strict guard
    if (isSyncingRef.current || hasSyncedRef.current) {
      return;
    }
    
    isSyncingRef.current = true;
    
    try {
      // Fetch first batch of contacts
      const { data: listData, error: listError } = await invokeWithAuthHandling<{
        contacts?: GoogleContact[];
      }>("google-contacts-list", {
        body: { action: "list" },
      });

      if (listError || !listData?.contacts?.length) {
        isSyncingRef.current = false;
        hasSyncedRef.current = true; // Mark as synced even on empty
        return;
      }

      // Import the batch
      const batch = listData.contacts.slice(0, BATCH_SIZE);
      
      const { data, error } = await invokeWithAuthHandling("google-contacts-import", {
        body: { contacts: batch, division },
      });

      if (error) {
        failureCountRef.current++;
        // Only show error on first failure, not retries
        if (failureCountRef.current === 1) {
          toast.error("Failed to sync contacts");
        }
        return;
      }

      const result = data as { imported: number; skipped: number; message: string };
      
      // Only show toast if contacts were actually imported
      if (result.imported > 0) {
        toast.success(`Synced ${result.imported} contact${result.imported !== 1 ? 's' : ''}`);
        queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      }
      
      hasSyncedRef.current = true;
      failureCountRef.current = 0;
    } catch {
      failureCountRef.current++;
    } finally {
      isSyncingRef.current = false;
    }
  }, [division, queryClient]);

  // Debounced auto-sync when connected
  useEffect(() => {
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    if (
      !isCheckingConnection && 
      connectionData?.connected && 
      !hasSyncedRef.current &&
      !isSyncingRef.current
    ) {
      // Debounce to prevent multiple rapid calls
      syncTimeoutRef.current = setTimeout(() => {
        performSync();
      }, SYNC_DEBOUNCE_MS);
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isCheckingConnection, connectionData, performSync]);

  // Reset sync flag when division changes
  useEffect(() => {
    hasSyncedRef.current = false;
    failureCountRef.current = 0;
  }, [division]);

  return {
    isConnected: connectionData?.connected ?? false,
    isLoading: isCheckingConnection,
    isSyncing: isSyncingRef.current,
    syncCount: connectionData?.syncCount ?? 0,
    lastSync: connectionData?.lastSync ?? null,
  };
}

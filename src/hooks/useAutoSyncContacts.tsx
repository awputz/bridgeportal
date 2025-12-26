import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContactsConnection, useGoogleContactsList, GoogleContact } from "./useGoogleContacts";
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
  const { data: googleContactsData, isLoading: isLoadingContacts } = useGoogleContactsList(
    connectionData?.connected && !hasSyncedRef.current
  );

  const performSync = useCallback(async (contacts: GoogleContact[]) => {
    // Prevent race conditions - strict guard
    if (isSyncingRef.current || hasSyncedRef.current || contacts.length === 0) {
      return;
    }
    
    isSyncingRef.current = true;
    
    try {
      // Batch contacts to reduce payload size
      const batch = contacts.slice(0, BATCH_SIZE);
      
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

  // Debounced auto-sync when Google Contacts are loaded
  useEffect(() => {
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    if (
      !isCheckingConnection && 
      !isLoadingContacts && 
      connectionData?.connected && 
      googleContactsData?.contacts && 
      googleContactsData.contacts.length > 0 &&
      !hasSyncedRef.current &&
      !isSyncingRef.current
    ) {
      // Debounce to prevent multiple rapid calls
      syncTimeoutRef.current = setTimeout(() => {
        performSync(googleContactsData.contacts);
      }, SYNC_DEBOUNCE_MS);
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isCheckingConnection, isLoadingContacts, connectionData, googleContactsData, performSync]);

  // Reset sync flag when division changes
  useEffect(() => {
    hasSyncedRef.current = false;
    failureCountRef.current = 0;
  }, [division]);

  return {
    isConnected: connectionData?.connected ?? false,
    isLoading: isCheckingConnection || isLoadingContacts,
    isSyncing: isSyncingRef.current,
    googleContactsCount: googleContactsData?.contacts?.length ?? 0,
  };
}

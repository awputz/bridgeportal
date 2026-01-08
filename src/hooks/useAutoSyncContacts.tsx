import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContactsConnection, GoogleContact } from "./useGoogleContacts";
import { useDivision } from "@/contexts/DivisionContext";
import { invokeWithAuthHandling } from "@/lib/auth";

const BATCH_SIZE = 50;
const SYNC_DEBOUNCE_MS = 3000;
const MAX_RETRY_ATTEMPTS = 2;

interface SyncState {
  hasCompletedInitialSync: boolean;
  isCurrentlySyncing: boolean;
  failureCount: number;
  lastSyncDivision: string | null;
}

export function useAutoSyncContacts() {
  const { division } = useDivision();
  const queryClient = useQueryClient();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Consolidated state ref to prevent race conditions
  const syncStateRef = useRef<SyncState>({
    hasCompletedInitialSync: false,
    isCurrentlySyncing: false,
    failureCount: 0,
    lastSyncDivision: null,
  });
  
  const { data: connectionData, isLoading: isCheckingConnection } = useContactsConnection();

  const performSync = useCallback(async () => {
    const state = syncStateRef.current;
    
    // Guard: prevent concurrent syncs
    if (state.isCurrentlySyncing) {
      console.log("[AutoSync] Already syncing, skipping");
      return;
    }
    
    // Guard: already synced for this division
    if (state.hasCompletedInitialSync && state.lastSyncDivision === division) {
      console.log("[AutoSync] Already synced for division:", division);
      return;
    }
    
    // Guard: too many failures
    if (state.failureCount >= MAX_RETRY_ATTEMPTS) {
      console.log("[AutoSync] Max retries reached, skipping");
      return;
    }
    
    // Set syncing state
    syncStateRef.current = { ...state, isCurrentlySyncing: true };
    console.log("[AutoSync] Starting sync for division:", division);
    
    try {
      // Fetch first batch of contacts
      const { data: listData, error: listError } = await invokeWithAuthHandling<{
        contacts?: GoogleContact[];
      }>("google-contacts-list", {
        body: { action: "list" },
      });

      if (listError) {
        console.error("[AutoSync] List error:", listError);
        syncStateRef.current = {
          ...syncStateRef.current,
          isCurrentlySyncing: false,
          failureCount: syncStateRef.current.failureCount + 1,
        };
        return;
      }
      
      if (!listData?.contacts?.length) {
        console.log("[AutoSync] No contacts to sync");
        syncStateRef.current = {
          ...syncStateRef.current,
          hasCompletedInitialSync: true,
          isCurrentlySyncing: false,
          lastSyncDivision: division,
        };
        return;
      }

      // Import the batch
      const batch = listData.contacts.slice(0, BATCH_SIZE);
      console.log("[AutoSync] Importing batch of", batch.length, "contacts");
      
      const { data, error } = await invokeWithAuthHandling("google-contacts-import", {
        body: { contacts: batch, division },
      });

      if (error) {
        console.error("[AutoSync] Import error:", error);
        syncStateRef.current = {
          ...syncStateRef.current,
          isCurrentlySyncing: false,
          failureCount: syncStateRef.current.failureCount + 1,
        };
        // Only show error on first failure
        if (syncStateRef.current.failureCount === 1) {
          toast.error("Failed to sync contacts");
        }
        return;
      }

      const result = data as { imported: number; skipped: number; message: string };
      console.log("[AutoSync] Import result:", result);
      
      // Only show toast if contacts were actually imported
      if (result.imported > 0) {
        toast.success(`Synced ${result.imported} contact${result.imported !== 1 ? 's' : ''}`);
        queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      }
      
      // Mark sync complete
      syncStateRef.current = {
        hasCompletedInitialSync: true,
        isCurrentlySyncing: false,
        failureCount: 0,
        lastSyncDivision: division,
      };
      
    } catch (err) {
      console.error("[AutoSync] Unexpected error:", err);
      syncStateRef.current = {
        ...syncStateRef.current,
        isCurrentlySyncing: false,
        failureCount: syncStateRef.current.failureCount + 1,
      };
    }
  }, [division, queryClient]);

  // Debounced auto-sync when connected
  useEffect(() => {
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    
    const state = syncStateRef.current;
    const shouldSync = 
      !isCheckingConnection && 
      connectionData?.connected && 
      !state.isCurrentlySyncing &&
      (!state.hasCompletedInitialSync || state.lastSyncDivision !== division) &&
      state.failureCount < MAX_RETRY_ATTEMPTS;
    
    if (shouldSync) {
      console.log("[AutoSync] Scheduling sync in", SYNC_DEBOUNCE_MS, "ms");
      syncTimeoutRef.current = setTimeout(() => {
        performSync();
      }, SYNC_DEBOUNCE_MS);
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, [isCheckingConnection, connectionData?.connected, division, performSync]);

  // Reset sync state when division changes
  useEffect(() => {
    const state = syncStateRef.current;
    if (state.lastSyncDivision !== division) {
      console.log("[AutoSync] Division changed from", state.lastSyncDivision, "to", division);
      // Only reset if we've already synced once (to allow re-sync for new division)
      if (state.hasCompletedInitialSync) {
        syncStateRef.current = {
          ...state,
          hasCompletedInitialSync: false,
          failureCount: 0,
        };
      }
    }
  }, [division]);

  return {
    isConnected: connectionData?.connected ?? false,
    isLoading: isCheckingConnection,
    isSyncing: syncStateRef.current.isCurrentlySyncing,
    syncCount: connectionData?.syncCount ?? 0,
    lastSync: connectionData?.lastSync ?? null,
  };
}

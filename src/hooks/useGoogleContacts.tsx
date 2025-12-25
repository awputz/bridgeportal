import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { invokeWithAuthHandling } from "@/lib/auth";

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
    queryKey: ["contacts-connection"],
    queryFn: async () => {
      try {
        const { data, error } = await invokeWithAuthHandling<{ connected: boolean }>(
          "google-contacts-list",
          {
            body: { action: "check-connection" },
          }
        );

        if (error) {
          console.error("Connection check error:", error);
          return { connected: false };
        }

        return data ?? { connected: false };
      } catch (err) {
        console.error("Connection check failed:", err);
        return { connected: false };
      }
    },
    retry: false,
    staleTime: 30000,
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
  return useQuery({
    queryKey: ["google-contacts"],
    queryFn: async () => {
      const { data, error } = await invokeWithAuthHandling("google-contacts-list", {
        body: { action: "list" },
      });

      if (error) throw error;
      return data as { contacts: GoogleContact[]; nextPageToken?: string; totalItems?: number };
    },
    enabled,
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

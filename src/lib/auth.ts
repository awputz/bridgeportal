import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

let lastAuthToastAt = 0;

/**
 * Hard logout - clears all auth storage and redirects to login.
 * Use this when the session is broken or for guaranteed logout.
 */
export const hardLogout = () => {
  // Clear all Supabase-related localStorage items
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear sessionStorage too
  const sessionKeysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));

  // Full page reload to login - guarantees clean state
  window.location.href = "/login";
};

const maybeShowReauthToast = () => {
  // Avoid spamming when multiple queries fail at once
  const now = Date.now();
  if (now - lastAuthToastAt < 10_000) return;
  lastAuthToastAt = now;

  toast.error("Your session needs to be refreshed.", {
    description: "Click Sign in again to restore Google features.",
    action: {
      label: "Sign in again",
      onClick: () => hardLogout(),
    },
  });
};

// List of Google service function names - 401s are expected when not connected
const GOOGLE_SERVICE_FUNCTIONS = [
  'gmail-auth', 'gmail-messages', 'gmail-send', 'gmail-labels',
  'google-calendar-auth', 'google-calendar-events',
  'google-drive-auth', 'google-drive-files', 'google-drive-upload',
  'google-contacts-auth', 'google-contacts-list', 'google-contacts-import',
  'google-unified-auth'
];

/**
 * Wrapper for supabase.functions.invoke that handles auth errors gracefully.
 * If we get a 401/403, it means the session is invalid and we should force logout.
 * Google service 401s are silently suppressed as they're expected when not connected.
 */
export const invokeWithAuthHandling = async <T = unknown>(
  functionName: string,
  options?: { 
    body?: Record<string, unknown>; 
    headers?: Record<string, string>;
    suppressAuthErrors?: boolean;
  }
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Most of our backend functions require a user JWT, not the anon key.
    if (!session?.access_token) {
      return { data: null, error: new Error("Not authenticated") };
    }

    const mergedHeaders: Record<string, string> = {
      Authorization: `Bearer ${session.access_token}`,
      ...(options?.headers ?? {}),
    };

    const { data, error } = await supabase.functions.invoke<T>(functionName, {
      ...options,
      headers: mergedHeaders,
    });

    if (error) {
      // Check if this is an auth error
      const errorMessage = error.message?.toLowerCase() || "";
      const isAuthError =
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("session") ||
        errorMessage.includes("jwt") ||
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("token");

      // Check if this is a Google services function - these 401s are expected when not connected
      const isGoogleService = GOOGLE_SERVICE_FUNCTIONS.some(fn => 
        functionName === fn || functionName.startsWith(fn)
      );

      // For Google services, silently return the error without showing toast
      // These errors are expected when user hasn't connected the service
      if (isGoogleService && isAuthError) {
        // Silent fail for expected disconnected state
        return { data: null, error };
      }

      // Only show reauth toast for real auth errors on non-Google functions
      if (isAuthError && !options?.suppressAuthErrors && !isGoogleService) {
        maybeShowReauthToast();
      }

      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

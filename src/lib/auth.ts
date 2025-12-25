import { supabase } from "@/integrations/supabase/client";

/**
 * Hard logout - clears all auth storage and redirects to login.
 * Use this when the session is broken or for guaranteed logout.
 */
export const hardLogout = () => {
  // Clear all Supabase-related localStorage items
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage too
  const sessionKeysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  
  // Full page reload to login - guarantees clean state
  window.location.href = "/login";
};

/**
 * Wrapper for supabase.functions.invoke that handles auth errors gracefully.
 * If we get a 401/403, it means the session is invalid and we should force logout.
 */
export const invokeWithAuthHandling = async <T = unknown>(
  functionName: string,
  options?: { body?: Record<string, unknown>; headers?: Record<string, string> }
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.functions.invoke<T>(functionName, options);
    
    if (error) {
      // Check if this is an auth error
      const errorMessage = error.message?.toLowerCase() || '';
      const isAuthError = 
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('session') ||
        errorMessage.includes('jwt') ||
        errorMessage.includes('401') ||
        errorMessage.includes('403');
      
      if (isAuthError) {
        console.error(`Auth error calling ${functionName}:`, error);
        // Don't immediately logout - let the caller decide
        // But log it for debugging
      }
      
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error(`Exception invoking ${functionName}:`, err);
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

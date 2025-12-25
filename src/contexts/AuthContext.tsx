import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  hardLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hard logout clears everything and does a full reload - works even when session is broken
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Validate session by making a lightweight call
  const validateSession = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setUser(null);
      setSession(null);
      return false;
    }

    try {
      // getUser validates the JWT against the server
      const { data: { user: validatedUser }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Session validation failed:", error.message);
        // Session is invalid - clear it
        if (error.message.includes('session_not_found') || 
            error.message.includes('invalid') ||
            error.status === 401 ||
            error.status === 403) {
          console.log("Invalid session detected, forcing logout...");
          hardLogout();
          return false;
        }
      }
      
      if (validatedUser) {
        setUser(validatedUser);
        setSession(currentSession);
        return true;
      } else {
        setUser(null);
        setSession(null);
        return false;
      }
    } catch (err) {
      console.error("Session validation exception:", err);
      setUser(null);
      setSession(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log("Auth state change:", event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          queryClient.clear();
          return;
        }

        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (newSession) {
            // Use setTimeout to avoid deadlock with async operations
            setTimeout(() => {
              if (mounted) {
                setSession(newSession);
                setUser(newSession.user);
              }
            }, 0);
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        if (existingSession) {
          await validateSession(existingSession);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [validateSession, queryClient]);

  const signOut = useCallback(async () => {
    try {
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        // Even if signOut fails, do a hard logout
        hardLogout();
      }
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Sign out exception:", err);
      // Always fall back to hard logout
      hardLogout();
    }
  }, [queryClient]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    signOut,
    hardLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

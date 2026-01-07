import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GoogleServicesStatus {
  connected: boolean;
  services: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
    contacts: boolean;
  };
  email?: string;
}

export function useGoogleServicesStatus() {
  return useQuery({
    queryKey: ['google-services-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { connected: false, services: { gmail: false, calendar: false, drive: false, contacts: false } };

      // Check user_google_tokens table directly - use maybeSingle for graceful handling
      const { data: tokens, error } = await supabase
        .from('user_google_tokens')
        .select('gmail_enabled, calendar_enabled, drive_enabled, contacts_enabled, google_email, access_token')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching Google services status:', error);
        return { 
          connected: false, 
          services: { gmail: false, calendar: false, drive: false, contacts: false },
          email: user.email
        };
      }

      if (!tokens) {
        return { 
          connected: false, 
          services: { gmail: false, calendar: false, drive: false, contacts: false },
          email: user.email
        };
      }

      return {
        connected: !!tokens.access_token,
        services: {
          gmail: tokens.gmail_enabled || false,
          calendar: tokens.calendar_enabled || false,
          drive: tokens.drive_enabled || false,
          contacts: tokens.contacts_enabled || false,
        },
        email: tokens.google_email || user.email
      } as GoogleServicesStatus;
    },
    staleTime: 30000,
    retry: 1,
  });
}

export function useStoreGoogleTokensOnLogin() {
  const queryClient = useQueryClient();
  const [hasAttemptedStore, setHasAttemptedStore] = useState(false);

  useEffect(() => {
    // Listen for auth state changes to detect OAuth login completion
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only proceed if this is a sign-in event with a Google provider
      if (event === 'SIGNED_IN' && session?.user && !hasAttemptedStore) {
        const googleIdentity = session.user.identities?.find(i => i.provider === 'google');
        
        if (googleIdentity && session.provider_token) {
          setHasAttemptedStore(true);
          
          try {
            // Store the provider token in user_google_tokens
            const expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + (session.expires_in || 3600));

            const { error } = await supabase
              .from('user_google_tokens')
              .upsert({
                user_id: session.user.id,
                access_token: session.provider_token,
                refresh_token: session.provider_refresh_token || null,
                token_expiry: expiryDate.toISOString(),
                google_email: session.user.email,
                google_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                google_avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                gmail_enabled: true,
                calendar_enabled: true,
                drive_enabled: true,
                contacts_enabled: true,
              });

            if (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to store Google tokens:', error);
              }
            } else {
              // Invalidate queries to refresh connection status
              queryClient.invalidateQueries({ queryKey: ['google-services-status'] });
              queryClient.invalidateQueries({ queryKey: ['gmail-connection'] });
              queryClient.invalidateQueries({ queryKey: ['calendar-connection'] });
              queryClient.invalidateQueries({ queryKey: ['drive-connection'] });
              queryClient.invalidateQueries({ queryKey: ['contacts-connection'] });
            }
          } catch (err) {
            console.error('Error storing Google tokens:', err);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, hasAttemptedStore]);
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, phone, created_at')
        .eq('id', user.id)
        .maybeSingle();

      return {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
        phone: profile?.phone,
        createdAt: profile?.created_at || user.created_at,
      };
    },
    staleTime: 60000,
  });
}

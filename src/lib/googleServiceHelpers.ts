import { supabase } from "@/integrations/supabase/client";

export interface GoogleConnectionStatus {
  hasTokens: boolean;
  services: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
    contacts: boolean;
  };
  email?: string;
}

/**
 * Check Google connection status directly from database.
 * This avoids making edge function calls that will fail with 401.
 */
export async function checkGoogleConnection(): Promise<GoogleConnectionStatus> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { hasTokens: false, services: { gmail: false, calendar: false, drive: false, contacts: false } };
    }

    const { data: tokens, error } = await supabase
      .from('user_google_tokens')
      .select('access_token, gmail_enabled, calendar_enabled, drive_enabled, contacts_enabled, google_email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !tokens) {
      return { 
        hasTokens: false, 
        services: { gmail: false, calendar: false, drive: false, contacts: false },
        email: user.email 
      };
    }

    return {
      hasTokens: !!tokens.access_token,
      services: {
        gmail: tokens.gmail_enabled || false,
        calendar: tokens.calendar_enabled || false,
        drive: tokens.drive_enabled || false,
        contacts: tokens.contacts_enabled || false,
      },
      email: tokens.google_email || user.email
    };
  } catch {
    return { hasTokens: false, services: { gmail: false, calendar: false, drive: false, contacts: false } };
  }
}

/**
 * Check if a specific Google service is connected before making API calls.
 */
export async function isServiceConnected(service: 'gmail' | 'calendar' | 'drive' | 'contacts'): Promise<boolean> {
  const status = await checkGoogleConnection();
  return status.hasTokens && status.services[service];
}

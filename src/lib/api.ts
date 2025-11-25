import { supabase } from "@/integrations/supabase/client";

/**
 * Centralized API client for edge functions
 * Provides type-safe calls with error handling
 */

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

/**
 * Send notification via edge function
 */
export async function sendNotification(
  type: 'new_inquiry' | 'tour_request' | 'property_matched',
  data: any
): Promise<ApiResponse> {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-notification', {
      body: { type, data }
    });

    if (error) throw error;
    return { data: result };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { error: error instanceof Error ? error.message : 'Failed to send notification' };
  }
}

/**
 * Log activity via edge function
 */
export async function logActivity(
  action: string,
  entity_type: string,
  entity_id?: string,
  details?: any
): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: result, error } = await supabase.functions.invoke('log-activity', {
      body: {
        action,
        entity_type,
        entity_id,
        details,
        user_id: user?.id
      }
    });

    if (error) throw error;
    return { data: result };
  } catch (error) {
    console.error('Failed to log activity:', error);
    return { error: error instanceof Error ? error.message : 'Failed to log activity' };
  }
}

/**
 * Track property view via edge function
 */
export async function trackPropertyView(
  property_id: string,
  view_type: 'page_view' | 'image_view' | 'map_view' | 'contact_click' = 'page_view',
  metadata?: any
): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate or get session ID
    let session_id = sessionStorage.getItem('analytics_session_id');
    if (!session_id) {
      session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', session_id);
    }

    const { data: result, error } = await supabase.functions.invoke('track-view', {
      body: {
        property_id,
        user_id: user?.id,
        view_type,
        session_id,
        metadata
      }
    });

    if (error) throw error;
    return { data: result };
  } catch (error) {
    console.error('Failed to track view:', error);
    return { error: error instanceof Error ? error.message : 'Failed to track view' };
  }
}

/**
 * Match properties to inquiry using AI
 */
export async function matchProperties(inquiry_id: string): Promise<ApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('match-properties', {
      body: { inquiryId: inquiry_id }
    });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Failed to match properties:', error);
    return { error: error instanceof Error ? error.message : 'Failed to match properties' };
  }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(
  messages: Array<{ role: string; content: string }>,
  sessionId?: string
): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages,
        sessionId,
        userId: user?.id
      }
    });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Failed to chat with AI:', error);
    return { error: error instanceof Error ? error.message : 'Failed to chat with AI' };
  }
}

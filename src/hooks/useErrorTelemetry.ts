import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ErrorContext {
  section?: string;
  componentStack?: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook for reporting client-side errors to the database for debugging
 */
export function useErrorTelemetry() {
  const reportError = useCallback(
    async (error: Error, context: ErrorContext = {}) => {
      // Always log to console for dev visibility
      console.error("[ErrorTelemetry]", {
        message: error.message,
        stack: error.stack,
        ...context,
      });

      try {
        // Get current user if authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Insert error using rpc or direct SQL to avoid type issues with new table
        const { error: insertError } = await supabase.rpc("log_client_error" as never, {
          p_user_id: user?.id || null,
          p_section: context.section || null,
          p_error_message: error.message,
          p_stack_trace: error.stack || null,
          p_component_stack: context.componentStack || null,
          p_user_agent: navigator.userAgent,
          p_url: context.url || window.location.href,
        } as never);

        if (insertError) {
          console.warn("[ErrorTelemetry] Failed to log error:", insertError);
        }
      } catch (insertError) {
        // Silently fail - don't break the app if error reporting fails
        console.warn("[ErrorTelemetry] Failed to report error:", insertError);
      }
    },
    []
  );

  return { reportError };
}

/**
 * Static error reporter for use in class components
 */
export async function reportErrorStatic(
  error: Error,
  context: ErrorContext = {}
): Promise<void> {
  console.error("[ErrorTelemetry]", {
    message: error.message,
    stack: error.stack,
    ...context,
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.rpc("log_client_error" as never, {
      p_user_id: user?.id || null,
      p_section: context.section || null,
      p_error_message: error.message,
      p_stack_trace: error.stack || null,
      p_component_stack: context.componentStack || null,
      p_user_agent: navigator.userAgent,
      p_url: context.url || window.location.href,
    } as never);
  } catch {
    // Silently fail
  }
}

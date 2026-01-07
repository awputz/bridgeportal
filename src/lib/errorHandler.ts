// Global error handler utility for Supabase and API errors
import { toast } from "sonner";

/**
 * AppError interface for consistent error typing
 */
export interface AppError {
  code?: string;
  message: string;
  userMessage: string;
  isRetryable: boolean;
}

/**
 * Translate Supabase and API errors to user-friendly messages
 */
export function handleQueryError(error: unknown): string {
  console.error('Query error:', error);
  
  if (!error) return 'An unexpected error occurred';
  
  const err = error as { code?: string; message?: string };
  
  // Supabase specific errors
  if (err.code === 'PGRST116') {
    return 'You do not have permission to access this resource';
  }
  
  if (err.code === 'PGRST301' || err.code === '22P02') {
    return 'This item was not found or the ID is invalid';
  }
  
  if (err.code === 'PGRST204') {
    return 'This item was not found';
  }
  
  if (err.code === 'PGRST100') {
    return 'Invalid request. Please check your input';
  }
  
  if (err.code === 'PGRST000' || err.code === '08006') {
    return 'Unable to connect to the server. Please check your connection';
  }
  
  if (err.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  
  if (err.code === '23503') {
    return 'This item is referenced by other records and cannot be deleted';
  }
  
  if (err.code === '23505') {
    return 'A record with this information already exists';
  }
  
  if (err.code === '23502') {
    return 'Required field is missing';
  }
  
  if (err.code === '23514') {
    return 'Invalid value provided';
  }
  
  // Network errors
  if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (err.message?.includes('JWT') || err.message?.includes('token')) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (err.message?.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }
  
  // Return the error message or a generic fallback
  return err.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Parse any error into AppError format
 */
export function parseError(error: unknown): AppError {
  const err = error as { code?: string; message?: string };
  const userMessage = handleQueryError(error);
  
  // Determine if retryable
  const nonRetryableCodes = ['42501', 'PGRST116', '23505', '23503'];
  const isRetryable = !nonRetryableCodes.includes(err?.code || '');
  
  return {
    code: err?.code,
    message: err?.message || 'Unknown error',
    userMessage,
    isRetryable,
  };
}

/**
 * Show error toast with user-friendly message
 */
export function showError(error: unknown, fallbackMessage?: string): void {
  const message = handleQueryError(error) || fallbackMessage || 'An error occurred';
  toast.error(message);
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Supabase error type guard
 */
export function isSupabaseError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

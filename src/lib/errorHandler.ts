// Global error handler utility for Supabase and API errors

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
  
  if (err.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  
  if (err.code === '23503') {
    return 'This item is referenced by other records and cannot be deleted';
  }
  
  if (err.code === '23505') {
    return 'A record with this information already exists';
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

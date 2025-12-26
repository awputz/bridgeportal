/**
 * Retry utility for Supabase operations with exponential backoff
 * Handles transient network errors and rate limiting gracefully
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    'PGRST301', // Connection error
    'PGRST502', // Bad gateway
    'PGRST503', // Service unavailable
    'PGRST504', // Gateway timeout
    'FetchError',
    'NetworkError',
    'TimeoutError',
    'AbortError',
  ],
};

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (!error) return false;

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Check error code/message
  const errorObj = error as { code?: string; message?: string; status?: number };
  
  // Retry on 5xx server errors
  if (errorObj.status && errorObj.status >= 500 && errorObj.status < 600) {
    return true;
  }

  // Check for specific error codes
  if (errorObj.code && retryableErrors.includes(errorObj.code)) {
    return true;
  }

  // Check error message
  if (errorObj.message) {
    return retryableErrors.some(e => 
      errorObj.message?.toLowerCase().includes(e.toLowerCase())
    );
  }

  return false;
}

/**
 * Sleep utility for delays between retries
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

/**
 * Wraps an async function with automatic retry logic
 * 
 * @example
 * const result = await withRetry(
 *   () => supabase.from('table').select(),
 *   { maxAttempts: 3 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on the last attempt or non-retryable errors
      if (
        attempt === config.maxAttempts ||
        !isRetryableError(error, config.retryableErrors)
      ) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        config.initialDelayMs,
        config.maxDelayMs,
        config.backoffMultiplier
      );

      console.warn(
        `[Retry] Attempt ${attempt}/${config.maxAttempts} failed. Retrying in ${Math.round(delay)}ms...`,
        { error: (error as Error).message }
      );

      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Retry failed');
}

/**
 * Wraps a Supabase query with retry logic, handling the response format
 * 
 * @example
 * const { data, error } = await withSupabaseRetry(
 *   supabase.from('table').select()
 * );
 */
export async function withSupabaseRetry<T>(
  queryPromise: PromiseLike<{ data: T | null; error: Error | null }>,
  options?: RetryOptions
): Promise<{ data: T | null; error: Error | null }> {
  return withRetry(async () => {
    const result = await queryPromise;
    
    // If there's an error that's retryable, throw it to trigger retry
    if (result.error && isRetryableError(result.error, options?.retryableErrors || DEFAULT_OPTIONS.retryableErrors)) {
      throw result.error;
    }
    
    return result;
  }, options);
}

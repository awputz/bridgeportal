import { useRef, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  queryKey: string;
  duration: number;
  timestamp: Date;
  status: 'success' | 'error' | 'slow';
}

// Store for performance metrics (in-memory for current session)
const performanceStore: PerformanceMetrics[] = [];
const SLOW_QUERY_THRESHOLD_MS = 2000;
const MAX_STORED_METRICS = 100;

/**
 * Hook to track query performance and detect slow queries
 * 
 * @example
 * const { startTiming, endTiming, getMetrics } = useQueryPerformance('my-query');
 * startTiming();
 * // ... do work
 * endTiming();
 */
export const useQueryPerformance = (queryKey: string | string[]) => {
  const startTimeRef = useRef<number | null>(null);
  const keyString = Array.isArray(queryKey) ? queryKey.join('-') : queryKey;

  const startTiming = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endTiming = useCallback((status: 'success' | 'error' = 'success') => {
    if (startTimeRef.current === null) return;

    const duration = performance.now() - startTimeRef.current;
    const isSlow = duration > SLOW_QUERY_THRESHOLD_MS;

    const metric: PerformanceMetrics = {
      queryKey: keyString,
      duration: Math.round(duration),
      timestamp: new Date(),
      status: isSlow ? 'slow' : status,
    };

    // Log slow queries
    if (isSlow) {
      console.warn(
        `[Performance] Slow query detected: "${keyString}" took ${Math.round(duration)}ms`,
        { threshold: SLOW_QUERY_THRESHOLD_MS }
      );
    }

    // Store metric (with cleanup to prevent memory leak)
    performanceStore.push(metric);
    if (performanceStore.length > MAX_STORED_METRICS) {
      performanceStore.shift();
    }

    startTimeRef.current = null;
    return metric;
  }, [keyString]);

  // Cleanup on unmount - log if query didn't complete
  useEffect(() => {
    return () => {
      if (startTimeRef.current !== null) {
        const duration = performance.now() - startTimeRef.current;
        console.debug(
          `[Performance] Query "${keyString}" unmounted after ${Math.round(duration)}ms without completing`
        );
      }
    };
  }, [keyString]);

  return { startTiming, endTiming };
};

/**
 * Get all stored performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  return [...performanceStore];
};

/**
 * Get slow query metrics only
 */
export const getSlowQueries = (): PerformanceMetrics[] => {
  return performanceStore.filter(m => m.status === 'slow');
};

/**
 * Get average duration for a specific query key
 */
export const getAverageDuration = (queryKey: string): number | null => {
  const relevant = performanceStore.filter(m => m.queryKey.includes(queryKey));
  if (relevant.length === 0) return null;
  
  const total = relevant.reduce((sum, m) => sum + m.duration, 0);
  return Math.round(total / relevant.length);
};

/**
 * Clear all stored metrics
 */
export const clearPerformanceMetrics = (): void => {
  performanceStore.length = 0;
};

/**
 * Hook that auto-tracks a React Query hook's performance
 * Use this wrapper for useQuery hooks
 */
export const useTrackedQuery = <T>(
  queryKey: string | string[],
  isLoading: boolean,
  data: T | undefined,
  error: unknown
) => {
  const { startTiming, endTiming } = useQueryPerformance(queryKey);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (isLoading && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startTiming();
    } else if (!isLoading && hasStartedRef.current) {
      endTiming(error ? 'error' : 'success');
      hasStartedRef.current = false;
    }
  }, [isLoading, error, startTiming, endTiming]);

  return { data, error, isLoading };
};

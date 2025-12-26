/**
 * Cache Utility for Edge Functions
 * Provides Redis-like caching patterns using Supabase
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface CacheOptions {
  ttlSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date;
  hitCount: number;
  createdAt: Date;
}

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get Supabase client with service role for cache operations
 */
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get a cached value by key
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('cache_entries')
      .select('value, expires_at, hit_count')
      .eq('key', key)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      // Clean up expired entry
      await supabase.from('cache_entries').delete().eq('key', key);
      return null;
    }

    // Update hit count (fire and forget)
    supabase
      .from('cache_entries')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('key', key)
      .then(() => {});

    return data.value as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set a cached value with TTL
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const ttl = options.ttlSeconds || DEFAULT_TTL;
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const { error } = await supabase
      .from('cache_entries')
      .upsert({
        key,
        value,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
        metadata: options.metadata || {},
        hit_count: 0,
      }, { onConflict: 'key' });

    if (error) {
      console.error('Cache set error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Cache-aside pattern: Get from cache or fetch and cache
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const freshData = await fetchFn();

  // Cache the result (fire and forget)
  cacheSet(key, freshData, options).catch((error) => {
    console.error('Cache set error in getOrSet:', error);
  });

  return freshData;
}

/**
 * Invalidate cache by exact key
 */
export async function cacheInvalidate(key: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('cache_entries')
      .delete()
      .eq('key', key);

    return !error;
  } catch (error) {
    console.error('Cache invalidate error:', error);
    return false;
  }
}

/**
 * Invalidate cache by key pattern (prefix match)
 */
export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('cache_entries')
      .delete()
      .like('key', `${pattern}%`)
      .select('key');

    if (error) {
      console.error('Cache invalidate pattern error:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Cache invalidate pattern error:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export async function cacheStats(): Promise<{
  totalEntries: number;
  expiredEntries: number;
  totalHits: number;
}> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('cache_entries')
      .select('expires_at, hit_count');

    if (error || !data) {
      return { totalEntries: 0, expiredEntries: 0, totalHits: 0 };
    }

    const now = new Date();
    const expiredEntries = data.filter((e) => new Date(e.expires_at) < now).length;
    const totalHits = data.reduce((sum, e) => sum + (e.hit_count || 0), 0);

    return {
      totalEntries: data.length,
      expiredEntries,
      totalHits,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { totalEntries: 0, expiredEntries: 0, totalHits: 0 };
  }
}

/**
 * Clean up expired cache entries
 */
export async function cacheCleanup(): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('cache_entries')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('key');

    if (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return 0;
  }
}

/**
 * Common cache key generators
 */
export const CacheKeys = {
  investorStats: () => 'investor:dashboard:stats',
  divisionStats: () => 'investor:division:stats',
  agentPerformance: () => 'investor:agent:performance',
  teamMembers: () => 'public:team:members',
  settings: (key: string) => `settings:${key}`,
  userProfile: (userId: string) => `user:profile:${userId}`,
};

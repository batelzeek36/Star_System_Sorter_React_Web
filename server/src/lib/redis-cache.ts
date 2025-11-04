/**
 * Redis Cache Layer
 * 
 * Core Redis operations with error handling, timeouts, compression, and circuit breaker.
 * Provides getCached(), setCached(), deleteByPattern(), and getCacheStats().
 */

import { promisify } from 'util';
import { gzip, gunzip } from 'zlib';
import crypto from 'crypto';
import { getRedisClient } from './redis-connection.js';
import { getCacheConfig } from './cache-config.js';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

// ============================================================================
// Types
// ============================================================================

export interface CachedNarrative {
  version: string;
  engine: string;
  prompt_hash: string;
  profile: {
    classification: string;
    primary?: string;
    hybrid?: string[];
    percentages: Record<string, number>;
  };
  narrative: {
    summary: string;
    bullets?: string[];
  };
  meta: {
    created_at: number;
    refreshed_at: number;
    stale_after: number;
    ttl_seconds: number;
    size_bytes: number;
    compression: 'none' | 'gzip';
  };
}

export interface CacheStats {
  keys: number;
  memoryUsed: string;
  hitRate: number;
  hits: number;
  misses: number;
}

// ============================================================================
// Circuit Breaker (scoped to Redis operations only)
// ============================================================================

class RedisCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly failureThreshold = 5;
  private readonly resetTimeout = 60000; // 1 minute

  async executeRedisOp<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.resetTimeout) {
        console.log('Redis circuit breaker: Transitioning to half-open');
        this.state = 'half-open';
      } else {
        throw new Error('Redis circuit breaker open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      console.log('Redis circuit breaker: Closed after successful operation');
      this.state = 'closed';
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
      console.error(`Redis circuit breaker: Opened after ${this.failures} failures`);
    }
  }

  getState(): string {
    return this.state;
  }
}

const circuitBreaker = new RedisCircuitBreaker();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Execute Redis operation with timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 1000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Redis operation timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Compress value if it exceeds threshold
 */
async function compressIfNeeded(
  value: string,
  threshold: number
): Promise<{ data: string; compressed: boolean }> {
  const size = Buffer.byteLength(value, 'utf8');

  if (size > threshold) {
    const compressed = await gzipAsync(Buffer.from(value, 'utf8'));
    return {
      data: compressed.toString('base64'),
      compressed: true,
    };
  }

  return {
    data: value,
    compressed: false,
  };
}

/**
 * Decompress value if needed
 */
async function decompressIfNeeded(
  value: string,
  compressed: boolean
): Promise<string> {
  if (!compressed) {
    return value;
  }

  const buffer = Buffer.from(value, 'base64');
  const decompressed = await gunzipAsync(buffer);
  return decompressed.toString('utf8');
}

// ============================================================================
// Core Cache Operations
// ============================================================================

/**
 * Get cached value with error handling and timeout
 */
export async function getCached(key: string): Promise<CachedNarrative | null> {
  try {
    return await circuitBreaker.executeRedisOp(async () => {
      const redis = getRedisClient();
      const value = await withTimeout(redis.get(key));

      if (!value) {
        return null;
      }

      // Parse the cached value
      const cached = JSON.parse(value) as CachedNarrative;

      // Decompress if needed
      if (cached.meta.compression === 'gzip') {
        const decompressed = await decompressIfNeeded(
          cached.narrative.summary,
          true
        );
        cached.narrative.summary = decompressed;
      }

      return cached;
    });
  } catch (error) {
    console.error('Redis getCached error:', error);
    return null; // Graceful fallback
  }
}

/**
 * Set cached value with TTL and compression
 */
export async function setCached(
  key: string,
  value: CachedNarrative,
  ttlDays?: number
): Promise<void> {
  try {
    await circuitBreaker.executeRedisOp(async () => {
      const config = getCacheConfig();
      const redis = getRedisClient();

      // Calculate TTL in seconds
      const ttl = (ttlDays || config.ttlDays) * 24 * 60 * 60;

      // Compress narrative if needed
      const narrativeStr = value.narrative.summary;
      const { data, compressed } = await compressIfNeeded(
        narrativeStr,
        config.cacheCompressThreshold
      );

      // Update metadata
      const cachedValue: CachedNarrative = {
        ...value,
        narrative: {
          ...value.narrative,
          summary: data,
        },
        meta: {
          ...value.meta,
          compression: compressed ? 'gzip' : 'none',
          size_bytes: Buffer.byteLength(narrativeStr, 'utf8'),
          ttl_seconds: ttl,
        },
      };

      // Serialize and store
      const serialized = JSON.stringify(cachedValue);

      // Check max value size
      if (Buffer.byteLength(serialized, 'utf8') > config.cacheMaxValueBytes) {
        throw new Error(
          `Cached value exceeds max size: ${config.cacheMaxValueBytes} bytes`
        );
      }

      await withTimeout(redis.setex(key, ttl, serialized));
    });
  } catch (error) {
    console.error('Redis setCached error:', error);
    // Don't throw - allow operation to continue without caching
  }
}

/**
 * Delete keys matching a pattern using SCAN
 */
export async function deleteByPattern(pattern: string): Promise<number> {
  try {
    return await circuitBreaker.executeRedisOp(async () => {
      const config = getCacheConfig();
      const redis = getRedisClient();

      // Ensure pattern includes cache prefix to avoid scanning entire keyspace
      const prefixedPattern = pattern.startsWith(config.cachePrefix)
        ? pattern
        : `${config.cachePrefix}:${pattern}`;

      let cursor = '0';
      let totalDeleted = 0;
      const batchSize = 1000;

      do {
        // Use SCAN with MATCH to find keys
        const [nextCursor, keys] = await withTimeout(
          redis.scan(cursor, 'MATCH', prefixedPattern, 'COUNT', batchSize)
        );

        cursor = nextCursor;

        if (keys.length > 0) {
          // Delete keys in pipeline for efficiency
          const pipeline = redis.pipeline();
          keys.forEach((key) => pipeline.del(key));
          await withTimeout(pipeline.exec());
          totalDeleted += keys.length;
        }
      } while (cursor !== '0');

      return totalDeleted;
    });
  } catch (error) {
    console.error('Redis deleteByPattern error:', error);
    return 0;
  }
}

/**
 * Get cache statistics by parsing Redis INFO command
 */
export async function getCacheStats(): Promise<CacheStats> {
  try {
    return await circuitBreaker.executeRedisOp(async () => {
      const config = getCacheConfig();
      const redis = getRedisClient();

      // Get Redis INFO
      const info = await withTimeout(redis.info('stats'));
      const memory = await withTimeout(redis.info('memory'));

      // Parse stats
      const statsLines = info.split('\r\n');
      const memoryLines = memory.split('\r\n');

      let hits = 0;
      let misses = 0;
      let memoryUsed = '0';

      // Parse keyspace hits/misses
      for (const line of statsLines) {
        if (line.startsWith('keyspace_hits:')) {
          hits = parseInt(line.split(':')[1], 10);
        } else if (line.startsWith('keyspace_misses:')) {
          misses = parseInt(line.split(':')[1], 10);
        }
      }

      // Parse memory usage
      for (const line of memoryLines) {
        if (line.startsWith('used_memory_human:')) {
          memoryUsed = line.split(':')[1];
        }
      }

      // Count keys with our prefix
      const keys = await withTimeout(
        redis.keys(`${config.cachePrefix}:*`)
      );

      // Calculate hit rate
      const total = hits + misses;
      const hitRate = total > 0 ? hits / total : 0;

      return {
        keys: keys.length,
        memoryUsed,
        hitRate,
        hits,
        misses,
      };
    });
  } catch (error) {
    console.error('Redis getCacheStats error:', error);
    return {
      keys: 0,
      memoryUsed: '0',
      hitRate: 0,
      hits: 0,
      misses: 0,
    };
  }
}

/**
 * Helper to create a CachedNarrative object with metadata
 */
export function createCachedNarrative(
  narrative: string,
  profile: CachedNarrative['profile'],
  options?: {
    engineVersion?: string;
    promptHash?: string;
    staleDays?: number;
  }
): CachedNarrative {
  const config = getCacheConfig();
  const now = Date.now();
  const staleDays = options?.staleDays || config.staleDays;

  return {
    version: '2.1.0',
    engine: options?.engineVersion || config.engineVersion,
    prompt_hash: options?.promptHash || config.promptHash,
    profile,
    narrative: {
      summary: narrative,
    },
    meta: {
      created_at: now,
      refreshed_at: now,
      stale_after: now + staleDays * 24 * 60 * 60 * 1000,
      ttl_seconds: config.ttlDays * 24 * 60 * 60,
      size_bytes: Buffer.byteLength(narrative, 'utf8'),
      compression: 'none', // Will be set by setCached if needed
    },
  };
}

/**
 * Get circuit breaker state (for monitoring)
 */
export function getCircuitBreakerState(): string {
  return circuitBreaker.getState();
}

// ============================================================================
// Negative Caching
// ============================================================================

export interface NegativeCacheEntry {
  error: string;
  timestamp: number;
}

/**
 * Cache a negative result (validation error, etc.) to prevent thundering herds
 */
export async function cacheNegativeResult(
  key: string,
  error: string,
  ttlMinutes: number = 15
): Promise<void> {
  try {
    await circuitBreaker.executeRedisOp(async () => {
      const redis = getRedisClient();
      const entry: NegativeCacheEntry = {
        error,
        timestamp: Date.now(),
      };
      const negKey = `neg:${key}`;
      await withTimeout(redis.setex(negKey, ttlMinutes * 60, JSON.stringify(entry)));
    });
  } catch (error) {
    console.error('Redis cacheNegativeResult error:', error);
    // Don't throw - allow operation to continue
  }
}

/**
 * Get negative cache entry if present
 */
export async function getNegativeCacheEntry(
  key: string
): Promise<NegativeCacheEntry | null> {
  try {
    return await circuitBreaker.executeRedisOp(async () => {
      const redis = getRedisClient();
      const negKey = `neg:${key}`;
      const value = await withTimeout(redis.get(negKey));
      
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as NegativeCacheEntry;
    });
  } catch (error) {
    console.error('Redis getNegativeCacheEntry error:', error);
    return null; // Graceful fallback
  }
}

// ============================================================================
// Stampede Protection
// ============================================================================

/**
 * Sleep helper for backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe lock release using Lua script (only delete if we own the lock)
 */
async function safeUnlock(lockKey: string, token: string): Promise<void> {
  try {
    await circuitBreaker.executeRedisOp(async () => {
      const redis = getRedisClient();
      const UNLOCK_SCRIPT = `
        if redis.call("get", KEYS[1]) == ARGV[1] then 
          return redis.call("del", KEYS[1]) 
        else 
          return 0 
        end
      `;
      await withTimeout(redis.eval(UNLOCK_SCRIPT, 1, lockKey, token));
    });
  } catch (error) {
    console.error('Redis safeUnlock error:', error);
    // Don't throw - lock will expire naturally
  }
}

/**
 * Execute function with stampede protection using distributed locks
 * 
 * This prevents multiple concurrent requests from generating the same narrative.
 * Only one request acquires the lock and generates; others wait with exponential backoff.
 */
export async function withStampedeProtection<T>(
  key: string,
  buildFn: () => Promise<T>,
  options: {
    lockTimeoutSec?: number;
    maxWaitSec?: number;
  } = {}
): Promise<T> {
  const { lockTimeoutSec = 30, maxWaitSec = 5 } = options;
  
  // Try to acquire lock with unique token
  const lockKey = `lock:${key}`;
  const token = crypto.randomUUID();
  
  try {
    const redis = getRedisClient();
    // Use SET with NX (only set if not exists) and EX (expiry in seconds)
    const gotLock = await withTimeout(
      redis.set(lockKey, token, 'EX', lockTimeoutSec, 'NX') as Promise<string | null>
    );
    
    if (gotLock === 'OK') {
      // We got the lock - generate the result
      try {
        const result = await buildFn();
        return result;
      } finally {
        // Safe lock release - only delete if we still own it
        await safeUnlock(lockKey, token);
      }
    }
    
    // Someone else is building - wait with exponential backoff
    const startTime = Date.now();
    let attempt = 0;
    
    while (Date.now() - startTime < maxWaitSec * 1000) {
      // Exponential backoff with jitter: 100ms, 200ms, 400ms, 800ms
      const backoff = Math.min(100 * Math.pow(2, attempt), 1000);
      const jitter = Math.random() * backoff * 0.5;
      await sleep(backoff + jitter);
      
      // Check if the lock is released (result should be ready)
      const lockExists = await withTimeout(redis.exists(lockKey));
      if (!lockExists) {
        // Lock released - result should be available, let caller retry
        throw new Error('Lock released, retry cache lookup');
      }
      
      attempt++;
    }
    
    // Timeout - try to acquire lock ourselves as fallback
    const finalToken = crypto.randomUUID();
    const finalLock = await withTimeout(
      redis.set(lockKey, finalToken, 'EX', lockTimeoutSec, 'NX') as Promise<string | null>
    );
    
    if (finalLock === 'OK') {
      try {
        const result = await buildFn();
        return result;
      } finally {
        await safeUnlock(lockKey, finalToken);
      }
    }
    
    // Still can't get lock - fall back to direct generation
    console.warn('Stampede protection timeout, falling back to direct generation');
    return await buildFn();
    
  } catch (error) {
    // On any error, fall back to direct generation
    console.error('Stampede protection error:', error);
    return await buildFn();
  }
}

// ============================================================================
// Stale-While-Revalidate
// ============================================================================

/**
 * Retry helper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    baseDelay?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const { attempts = 3, baseDelay = 100, timeout = 10000 } = options;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await Promise.race([
        fn(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
    } catch (error) {
      if (i === attempts - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      const jitter = Math.random() * delay * 0.5;
      await sleep(delay + jitter);
    }
  }
  
  throw new Error('Retry exhausted');
}

/**
 * Execute function with stale-while-revalidate strategy
 * 
 * Serves cached content immediately if available (even if stale),
 * and triggers background refresh for stale content.
 */
export async function withStaleWhileRevalidate(
  key: string,
  buildFn: () => Promise<string>,
  options: {
    staleDays?: number;
    ttlDays?: number;
  } = {}
): Promise<string> {
  const config = getCacheConfig();
  const { staleDays = config.staleDays, ttlDays = config.ttlDays } = options;
  
  // Check cache first
  const cached = await getCached(key);
  
  if (!cached) {
    // Cache miss - generate fresh
    const narrative = await buildFn();
    
    // Create cached value with metadata
    const profile = {
      classification: 'unknown',
      percentages: {},
    } as CachedNarrative['profile'];
    
    const cachedValue = createCachedNarrative(narrative, profile, {
      staleDays,
    });
    
    await setCached(key, cachedValue, ttlDays);
    return narrative;
  }
  
  const now = Date.now();
  const age = now - cached.meta.created_at;
  const staleThreshold = staleDays * 24 * 60 * 60 * 1000;
  
  if (age < staleThreshold) {
    // Fresh - return immediately
    return cached.narrative.summary;
  }
  
  // Stale - return old value and refresh in background
  setImmediate(async () => {
    try {
      // Acquire refresh lock to prevent multiple nodes from refreshing
      const refreshKey = `refresh:${key}`;
      const redis = getRedisClient();
      const gotRefresh = await withTimeout(
        redis.set(refreshKey, '1', 'EX', 30, 'NX') as Promise<string | null>
      );
      
      if (gotRefresh !== 'OK') {
        // Another worker is already refreshing
        return;
      }
      
      try {
        // Refresh with retry logic
        const fresh = await withRetry(buildFn, {
          attempts: 3,
          baseDelay: 100,
          timeout: 10000,
        });
        
        const refreshedAt = Date.now();
        const updated: CachedNarrative = {
          ...cached,
          narrative: { summary: fresh },
          meta: {
            ...cached.meta,
            refreshed_at: refreshedAt,
            stale_after: refreshedAt + (staleDays * 24 * 60 * 60 * 1000),
          },
        };
        
        await setCached(key, updated, ttlDays);
      } catch (error) {
        console.error('Background refresh failed:', error);
        // Keep stale value in cache
      } finally {
        await withTimeout(redis.del(refreshKey));
      }
    } catch (error) {
      console.error('Background refresh coordination error:', error);
    }
  });
  
  return cached.narrative.summary;
}

/**
 * Cache Configuration Module
 * 
 * Provides centralized configuration for Redis caching with sensible defaults.
 * All cache-related environment variables are parsed and validated here.
 */

export interface CacheConfig {
  // Redis connection
  redisUrl: string;
  cachePrefix: string;
  
  // TTL and staleness
  staleDays: number;
  ttlDays: number;
  
  // Value size limits
  cacheMaxValueBytes: number;
  cacheCompressThreshold: number;
  
  // Eviction policy
  cacheEvictionPolicy: string;
  
  // Feature flags
  enableRedisCache: boolean;
  enableSWR: boolean;
  enableStampedeProtection: boolean;
  enableNegativeCache: boolean;
  
  // Engine versioning
  engineVersion: string;
  promptHash: string;
}

/**
 * Parse and validate cache configuration from environment variables
 */
export function parseCacheConfig(): CacheConfig {
  return {
    // Redis connection
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    cachePrefix: process.env.CACHE_PREFIX || 'narr',
    
    // TTL and staleness (defaults: 7 days stale, 30 days TTL)
    staleDays: parseInt(process.env.STALE_DAYS || '7', 10),
    ttlDays: parseInt(process.env.TTL_DAYS || '30', 10),
    
    // Value size limits (defaults: 128KB max, 64KB compression threshold)
    cacheMaxValueBytes: parseInt(process.env.CACHE_MAX_VALUE_BYTES || '131072', 10),
    cacheCompressThreshold: parseInt(process.env.CACHE_COMPRESS_THRESHOLD || '65536', 10),
    
    // Eviction policy (default: allkeys-lru)
    cacheEvictionPolicy: process.env.CACHE_EVICTION_POLICY || 'allkeys-lru',
    
    // Feature flags (all default to false for gradual rollout)
    enableRedisCache: process.env.ENABLE_REDIS_CACHE === 'true',
    enableSWR: process.env.ENABLE_SWR === 'true',
    enableStampedeProtection: process.env.ENABLE_STAMPEDE_PROTECTION === 'true',
    enableNegativeCache: process.env.ENABLE_NEGATIVE_CACHE === 'true',
    
    // Engine versioning
    engineVersion: process.env.ENGINE_VERSION || 'narrative@1.0.0',
    promptHash: process.env.PROMPT_HASH || 'default',
  };
}

/**
 * Validate cache configuration
 * Throws error if configuration is invalid
 */
export function validateCacheConfig(config: CacheConfig): void {
  // Validate TTL values (check TTL first, then STALE_DAYS)
  if (config.ttlDays < 1) {
    throw new Error('Invalid TTL_DAYS: must be at least 1');
  }
  
  if (config.staleDays < 1 || config.staleDays > config.ttlDays) {
    throw new Error(`Invalid STALE_DAYS: must be between 1 and TTL_DAYS (${config.ttlDays})`);
  }
  
  // Validate size limits (check max value first, then compression threshold)
  if (config.cacheMaxValueBytes < 1024) {
    throw new Error('CACHE_MAX_VALUE_BYTES must be at least 1024 bytes');
  }
  
  if (config.cacheCompressThreshold > config.cacheMaxValueBytes) {
    throw new Error('CACHE_COMPRESS_THRESHOLD cannot exceed CACHE_MAX_VALUE_BYTES');
  }
  
  // Validate eviction policy
  const validPolicies = [
    'noeviction',
    'allkeys-lru',
    'allkeys-lfu',
    'allkeys-random',
    'volatile-lru',
    'volatile-lfu',
    'volatile-random',
    'volatile-ttl'
  ];
  
  if (!validPolicies.includes(config.cacheEvictionPolicy)) {
    throw new Error(
      `Invalid CACHE_EVICTION_POLICY: ${config.cacheEvictionPolicy}. ` +
      `Must be one of: ${validPolicies.join(', ')}`
    );
  }
  
  // Validate Redis URL format
  if (!config.redisUrl.startsWith('redis://') && !config.redisUrl.startsWith('rediss://')) {
    throw new Error('REDIS_URL must start with redis:// or rediss://');
  }
}

// Export singleton instance
let cachedConfig: CacheConfig | null = null;

export function getCacheConfig(): CacheConfig {
  if (!cachedConfig) {
    cachedConfig = parseCacheConfig();
    validateCacheConfig(cachedConfig);
  }
  return cachedConfig;
}

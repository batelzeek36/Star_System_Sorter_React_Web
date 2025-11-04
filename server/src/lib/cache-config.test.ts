/**
 * Cache Configuration Tests
 * 
 * Tests for feature flag parsing and validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseCacheConfig, validateCacheConfig, type CacheConfig } from './cache-config.js';

describe('Cache Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Feature Flags', () => {
    it('should default all feature flags to false', () => {
      const config = parseCacheConfig();
      
      expect(config.enableRedisCache).toBe(false);
      expect(config.enableSWR).toBe(false);
      expect(config.enableStampedeProtection).toBe(false);
      expect(config.enableNegativeCache).toBe(false);
    });

    it('should enable Redis cache when ENABLE_REDIS_CACHE=true', () => {
      process.env.ENABLE_REDIS_CACHE = 'true';
      const config = parseCacheConfig();
      
      expect(config.enableRedisCache).toBe(true);
    });

    it('should enable SWR when ENABLE_SWR=true', () => {
      process.env.ENABLE_SWR = 'true';
      const config = parseCacheConfig();
      
      expect(config.enableSWR).toBe(true);
    });

    it('should enable stampede protection when ENABLE_STAMPEDE_PROTECTION=true', () => {
      process.env.ENABLE_STAMPEDE_PROTECTION = 'true';
      const config = parseCacheConfig();
      
      expect(config.enableStampedeProtection).toBe(true);
    });

    it('should enable negative cache when ENABLE_NEGATIVE_CACHE=true', () => {
      process.env.ENABLE_NEGATIVE_CACHE = 'true';
      const config = parseCacheConfig();
      
      expect(config.enableNegativeCache).toBe(true);
    });

    it('should treat non-"true" values as false', () => {
      process.env.ENABLE_REDIS_CACHE = 'false';
      process.env.ENABLE_SWR = '1';
      process.env.ENABLE_STAMPEDE_PROTECTION = 'yes';
      process.env.ENABLE_NEGATIVE_CACHE = 'TRUE';
      
      const config = parseCacheConfig();
      
      expect(config.enableRedisCache).toBe(false);
      expect(config.enableSWR).toBe(false);
      expect(config.enableStampedeProtection).toBe(false);
      expect(config.enableNegativeCache).toBe(false);
    });

    it('should enable all flags when all set to true', () => {
      process.env.ENABLE_REDIS_CACHE = 'true';
      process.env.ENABLE_SWR = 'true';
      process.env.ENABLE_STAMPEDE_PROTECTION = 'true';
      process.env.ENABLE_NEGATIVE_CACHE = 'true';
      
      const config = parseCacheConfig();
      
      expect(config.enableRedisCache).toBe(true);
      expect(config.enableSWR).toBe(true);
      expect(config.enableStampedeProtection).toBe(true);
      expect(config.enableNegativeCache).toBe(true);
    });
  });

  describe('Configuration Defaults', () => {
    it('should use default values when env vars not set', () => {
      const config = parseCacheConfig();
      
      expect(config.redisUrl).toBe('redis://localhost:6379');
      expect(config.cachePrefix).toBe('narr');
      expect(config.staleDays).toBe(7);
      expect(config.ttlDays).toBe(30);
      expect(config.cacheMaxValueBytes).toBe(131072);
      expect(config.cacheCompressThreshold).toBe(65536);
      expect(config.cacheEvictionPolicy).toBe('allkeys-lru');
      expect(config.engineVersion).toBe('narrative@1.0.0');
      expect(config.promptHash).toBe('default');
    });

    it('should parse custom values from env vars', () => {
      process.env.REDIS_URL = 'redis://custom:6380';
      process.env.CACHE_PREFIX = 'test';
      process.env.STALE_DAYS = '14';
      process.env.TTL_DAYS = '60';
      process.env.CACHE_MAX_VALUE_BYTES = '262144';
      process.env.CACHE_COMPRESS_THRESHOLD = '131072';
      process.env.CACHE_EVICTION_POLICY = 'volatile-ttl';
      process.env.ENGINE_VERSION = 'narrative@2.0.0';
      process.env.PROMPT_HASH = 'abc123';
      
      const config = parseCacheConfig();
      
      expect(config.redisUrl).toBe('redis://custom:6380');
      expect(config.cachePrefix).toBe('test');
      expect(config.staleDays).toBe(14);
      expect(config.ttlDays).toBe(60);
      expect(config.cacheMaxValueBytes).toBe(262144);
      expect(config.cacheCompressThreshold).toBe(131072);
      expect(config.cacheEvictionPolicy).toBe('volatile-ttl');
      expect(config.engineVersion).toBe('narrative@2.0.0');
      expect(config.promptHash).toBe('abc123');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate successfully with default config', () => {
      const config = parseCacheConfig();
      expect(() => validateCacheConfig(config)).not.toThrow();
    });

    it('should reject STALE_DAYS < 1', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        staleDays: 0,
      };
      
      expect(() => validateCacheConfig(config)).toThrow('Invalid STALE_DAYS');
    });

    it('should reject STALE_DAYS > TTL_DAYS', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        staleDays: 40,
        ttlDays: 30,
      };
      
      expect(() => validateCacheConfig(config)).toThrow('Invalid STALE_DAYS');
    });

    it('should reject TTL_DAYS < 1', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        ttlDays: 0,
      };
      
      expect(() => validateCacheConfig(config)).toThrow('Invalid TTL_DAYS');
    });

    it('should reject CACHE_COMPRESS_THRESHOLD > CACHE_MAX_VALUE_BYTES', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        cacheCompressThreshold: 200000,
        cacheMaxValueBytes: 100000,
      };
      
      expect(() => validateCacheConfig(config)).toThrow('CACHE_COMPRESS_THRESHOLD cannot exceed CACHE_MAX_VALUE_BYTES');
    });

    it('should reject CACHE_MAX_VALUE_BYTES < 1024', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        cacheMaxValueBytes: 512,
      };
      
      expect(() => validateCacheConfig(config)).toThrow('CACHE_MAX_VALUE_BYTES must be at least 1024 bytes');
    });

    it('should reject invalid eviction policy', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        cacheEvictionPolicy: 'invalid-policy',
      };
      
      expect(() => validateCacheConfig(config)).toThrow('Invalid CACHE_EVICTION_POLICY');
    });

    it('should accept all valid eviction policies', () => {
      const validPolicies = [
        'noeviction',
        'allkeys-lru',
        'allkeys-lfu',
        'allkeys-random',
        'volatile-lru',
        'volatile-lfu',
        'volatile-random',
        'volatile-ttl',
      ];
      
      for (const policy of validPolicies) {
        const config: CacheConfig = {
          ...parseCacheConfig(),
          cacheEvictionPolicy: policy,
        };
        
        expect(() => validateCacheConfig(config)).not.toThrow();
      }
    });

    it('should reject Redis URL without redis:// or rediss:// prefix', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        redisUrl: 'localhost:6379',
      };
      
      expect(() => validateCacheConfig(config)).toThrow('REDIS_URL must start with redis:// or rediss://');
    });

    it('should accept redis:// URL', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        redisUrl: 'redis://localhost:6379',
      };
      
      expect(() => validateCacheConfig(config)).not.toThrow();
    });

    it('should accept rediss:// URL (TLS)', () => {
      const config: CacheConfig = {
        ...parseCacheConfig(),
        redisUrl: 'rediss://user:pass@host:6380/0',
      };
      
      expect(() => validateCacheConfig(config)).not.toThrow();
    });
  });
});

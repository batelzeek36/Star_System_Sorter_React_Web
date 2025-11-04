/**
 * Redis Startup Validation
 * 
 * Validates Redis configuration at server startup
 */

import { getRedisClient, validateRedisEvictionPolicy, isRedisConnected } from './redis-connection.js';
import { getCacheConfig } from './cache-config.js';

/**
 * Initialize Redis and validate configuration
 * Should be called during server startup
 */
export async function initializeRedis(): Promise<void> {
  const config = getCacheConfig();
  
  // Skip if Redis cache is not enabled
  if (!config.enableRedisCache) {
    console.log('Redis: Cache disabled (ENABLE_REDIS_CACHE=false)');
    return;
  }
  
  console.log('Redis: Initializing connection...');
  console.log(`Redis: URL: ${config.redisUrl.replace(/:[^:@]+@/, ':****@')}`); // Hide password
  console.log(`Redis: Prefix: ${config.cachePrefix}`);
  console.log(`Redis: Stale after: ${config.staleDays} days`);
  console.log(`Redis: TTL: ${config.ttlDays} days`);
  console.log(`Redis: Max value size: ${config.cacheMaxValueBytes} bytes`);
  console.log(`Redis: Compression threshold: ${config.cacheCompressThreshold} bytes`);
  
  try {
    // Get Redis client (will connect automatically)
    const client = getRedisClient();
    
    // Wait for connection to be ready
    await waitForConnection(5000); // 5 second timeout
    
    if (!isRedisConnected()) {
      throw new Error('Redis connection not ready after timeout');
    }
    
    // Validate eviction policy
    await validateRedisEvictionPolicy();
    
    // Test basic operations
    await testRedisOperations(client);
    
    console.log('Redis: Initialization complete');
    
  } catch (error) {
    console.error('Redis: Initialization failed:', error);
    
    if (config.enableRedisCache) {
      console.warn('Redis: Cache is enabled but connection failed. Server will fall back to direct generation.');
    }
  }
}

/**
 * Wait for Redis connection to be ready
 */
async function waitForConnection(timeoutMs: number): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (isRedisConnected()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error('Redis connection timeout');
}

/**
 * Test basic Redis operations
 */
async function testRedisOperations(client: any): Promise<void> {
  const testKey = 'test:startup:ping';
  const testValue = 'pong';
  
  try {
    // Test SET
    await client.set(testKey, testValue, 'EX', 10);
    
    // Test GET
    const result = await client.get(testKey);
    
    if (result !== testValue) {
      throw new Error(`Expected ${testValue}, got ${result}`);
    }
    
    // Test DEL
    await client.del(testKey);
    
    console.log('Redis: Basic operations test passed');
    
  } catch (error) {
    throw new Error(`Redis operations test failed: ${error}`);
  }
}

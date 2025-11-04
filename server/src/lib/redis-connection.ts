/**
 * Redis Connection Module
 * 
 * Manages Redis connection with automatic reconnection, timeouts, and error handling.
 */

import Redis from 'ioredis';
import { getCacheConfig } from './cache-config.js';

let redisClient: Redis | null = null;
let isConnecting = false;

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis {
  if (redisClient) {
    return redisClient;
  }
  
  if (isConnecting) {
    throw new Error('Redis connection already in progress');
  }
  
  isConnecting = true;
  
  try {
    const config = getCacheConfig();
    
    redisClient = new Redis(config.redisUrl, {
      // Connection pooling and timeouts
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      connectTimeout: 10000,
      lazyConnect: false,
      keepAlive: 30000,
      family: 4, // IPv4
      
      // Retry strategy with exponential backoff
      retryStrategy(times: number) {
        if (times > 10) {
          console.error('Redis: Max retry attempts reached, giving up');
          return null; // Stop retrying
        }
        
        const delay = Math.min(times * 100, 3000); // Max 3 second delay
        console.log(`Redis: Retry attempt ${times}, waiting ${delay}ms`);
        return delay;
      },
      
      // Reconnect on error
      reconnectOnError(err: Error) {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        if (targetErrors.some(target => err.message.includes(target))) {
          console.log('Redis: Reconnecting due to error:', err.message);
          return true;
        }
        return false;
      },
    });
    
    // Event handlers
    redisClient.on('connect', () => {
      console.log('Redis: Connected successfully');
    });
    
    redisClient.on('ready', () => {
      console.log('Redis: Ready to accept commands');
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis: Connection error:', err.message);
    });
    
    redisClient.on('close', () => {
      console.log('Redis: Connection closed');
    });
    
    redisClient.on('reconnecting', () => {
      console.log('Redis: Reconnecting...');
    });
    
    isConnecting = false;
    return redisClient;
    
  } catch (error) {
    isConnecting = false;
    throw error;
  }
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis: Connection closed gracefully');
  }
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisConnected(): boolean {
  return redisClient !== null && redisClient.status === 'ready';
}

/**
 * Validate Redis eviction policy at startup
 */
export async function validateRedisEvictionPolicy(): Promise<void> {
  const config = getCacheConfig();
  const client = getRedisClient();
  
  try {
    // Get current eviction policy
    const result = await client.config('GET', 'maxmemory-policy') as string[];
    
    if (!result || result.length < 2) {
      console.warn('Redis: Unable to retrieve maxmemory-policy');
      return;
    }
    
    const currentPolicy = result[1] as string;
    const recommendedPolicy = config.cacheEvictionPolicy;
    
    if (currentPolicy !== recommendedPolicy) {
      console.warn(
        `Redis: Eviction policy mismatch. Current: ${currentPolicy}, Recommended: ${recommendedPolicy}`
      );
      
      // Try to set the policy (will fail on serverless/managed Redis)
      try {
        await client.config('SET', 'maxmemory-policy', recommendedPolicy);
        console.log(`Redis: Successfully set eviction policy to ${recommendedPolicy}`);
      } catch (setError) {
        console.warn(
          `Redis: Cannot set eviction policy (likely serverless/managed Redis). ` +
          `Please configure maxmemory-policy=${recommendedPolicy} in your Redis provider dashboard.`
        );
      }
    } else {
      console.log(`Redis: Eviction policy is correctly set to ${currentPolicy}`);
    }
  } catch (error) {
    console.error('Redis: Error validating eviction policy:', error);
  }
}

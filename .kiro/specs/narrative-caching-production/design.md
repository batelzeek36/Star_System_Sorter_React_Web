# Design Document: Narrative Caching Production Upgrade

## Overview

This design document outlines the architecture for upgrading the Star System Sorter narrative caching system from in-memory NodeCache to production-ready Redis-based caching. The upgrade provides persistent caching, distributed locking for stampede protection, stale-while-revalidate (SWR) strategy, pre-warming capabilities, and comprehensive observability.

### Goals

- Maintain 99.9% availability with p95 latency ≤ 10ms
- Achieve ≥90% cache hit rate after warm-up
- Reduce OpenAI API costs by 10x at scale (10k+ users)
- Support horizontal scaling across multiple server instances
- Provide graceful degradation when Redis is unavailable
- Enable GDPR/CCPA compliance through data minimization

### Non-Goals (Phase 1)

- Multi-region replication (future phase)
- Real-time cache invalidation UI
- A/B testing different narrative prompts
- User-specific narrative personalization

## Architecture

### High-Level Flow

```
User Request
    ↓
Express Route (/api/narrative)
    ↓
Narrative Service
    ↓
Redis Cache Layer (with SWR)
    ├─ Cache Hit → Return immediately
    │   └─ If stale → Background refresh
    └─ Cache Miss → Stampede Protection
        ↓
    Distributed Lock (Redis)
        ↓
    GPT-4o API Call
        ↓
    Store in Redis (30-day TTL)
        ↓
    Return to User
```

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Narrative Route (/api/narrative)                  │ │
│  │  - Request validation                              │ │
│  │  - Cache key generation                            │ │
│  │  - Response formatting                             │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Narrative Service                                 │ │
│  │  - Business logic                                  │ │
│  │  - GPT-4o integration                              │ │
│  │  - Template fallback                               │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Redis Cache Layer                                 │ │
│  │  - SWR logic                                       │ │
│  │  - Stampede protection                             │ │
│  │  - Metrics collection                              │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
              ┌───────────────────────┐
              │   Redis Instance      │
              │   - Key-value store   │
              │   - Distributed locks │
              │   - TTL management    │
              └───────────────────────┘
```

## Components and Interfaces

### 1. Redis Cache Layer (`server/src/lib/redis-cache.ts`)

Primary interface for all Redis operations with built-in error handling and fallback.

#### Interface

```typescript
interface CachedNarrative {
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

interface CacheStats {
  keys: number;
  memoryUsed: string;
  hitRate: number;
  hits: number;
  misses: number;
}

// Core functions
export async function getCached(key: string): Promise<CachedNarrative | null>;
export async function setCached(key: string, value: CachedNarrative, ttlDays?: number): Promise<void>;
export async function deleteCached(pattern: string): Promise<number>;
export async function deleteByPattern(pattern: string): Promise<number>;
export async function getCacheStats(): Promise<CacheStats>;

// Advanced functions
export async function withStaleWhileRevalidate(
  key: string,
  buildFn: () => Promise<string>,
  options?: { staleDays?: number; ttlDays?: number }
): Promise<string>;

export async function withStampedeProtection(
  key: string,
  buildFn: () => Promise<string>,
  options?: { lockTimeoutSec?: number; maxWaitSec?: number }
): Promise<string>;
```

#### Key Design Decisions

**Connection Management:**
- Single Redis client instance shared across all requests
- Lazy connection on first use
- Automatic reconnection with exponential backoff
- Connection pooling handled by ioredis library

**Error Handling:**
- All Redis operations wrapped in try-catch
- Timeouts set to 1 second for all operations
- Graceful fallback to direct API calls on Redis failure
- Errors logged but never exposed to end users

**Compression:**
- Values >64KB automatically compressed with gzip
- Compression flag stored in metadata
- Transparent decompression on retrieval
- Maximum value size: 128KB pre-compression

**Pattern Deletion:**
- Use SCAN with MATCH instead of KEYS to avoid blocking Redis
- Pipeline DEL commands for efficiency
- Process in batches of 1000 keys

```typescript
async function deleteByPattern(pattern: string): Promise<number> {
  let cursor = '0';
  let total = 0;
  
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 1000);
    if (keys.length) {
      await redis.del(...keys);
      total += keys.length;
    }
    cursor = next;
  } while (cursor !== '0');
  
  return total;
}
```

### 2. Cache Key Generation (`server/src/lib/cache-utils.ts`)

Enhanced version of existing cache key generator with versioning and namespacing.

#### Interface

```typescript
interface CacheKeyOptions {
  engineVersion: string;
  promptHash: string;
  keyPrefix?: string;
}

export function generateCacheKey(
  profile: ClassificationResult,
  options: CacheKeyOptions
): string;

export function generateLockKey(cacheKey: string): string;
export function generateUserIndexKey(userId: string): string;
```

#### Key Format

```
narr:v1:narrative@1.0.0:a3f2c1b9:sha1(normalizedProfile)
│    │  │               │         │
│    │  │               │         └─ Profile hash (deterministic)
│    │  │               └─────────── Prompt hash (6 chars)
│    │  └─────────────────────────── Engine version
│    └────────────────────────────── Major version
└─────────────────────────────────── Namespace prefix
```

**Normalization Rules:**
1. Sort all object keys alphabetically
2. Quantize percentages to 0.5% buckets (32.4% → 32.0%)
3. Remove undefined/null values
4. Stringify with no whitespace
5. SHA-1 hash the result

**Example:**
```typescript
const profile = {
  classification: 'primary',
  primary: 'Arcturus',
  percentages: { Arcturus: 42.3, Sirius: 18.7, Pleiades: 15.2 }
};

// Normalized:
// {"classification":"primary","percentages":{"Arcturus":42.0,"Pleiades":15.0,"Sirius":18.5},"primary":"Arcturus"}

// Key (using 10-char prompt hash, lowercase):
// narr:v1:narrative@1.0.0:a3f2c1b9d8:8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
```

**Key Hygiene:**
- Prompt hash: 10 hex characters (lowercase) to reduce collision risk
- Key prefix from CACHE_PREFIX env var for staging/prod isolation
- All components lowercase for consistency

### 3. Stampede Protection

Distributed locking mechanism to prevent multiple concurrent requests from generating the same narrative.

#### Algorithm

```typescript
async function withStampedeProtection(
  key: string,
  buildFn: () => Promise<string>,
  options = { lockTimeoutSec: 30, maxWaitSec: 5 }
): Promise<string> {
  // 1. Check cache first
  const cached = await getCached(key);
  if (cached) return cached.narrative.summary;
  
  // 2. Try to acquire lock with unique token
  const lockKey = generateLockKey(key);
  const token = crypto.randomUUID();
  const gotLock = await redis.set(lockKey, token, 'EX', options.lockTimeoutSec, 'NX');
  
  if (gotLock) {
    // We got the lock - generate the narrative
    try {
      const narrative = await buildFn();
      await setCached(key, createCachedNarrative(narrative));
      return narrative;
    } finally {
      // Safe lock release - only delete if we still own it
      await safeUnlock(lockKey, token);
    }
  }
  
  // 3. Someone else is building - wait with exponential backoff
  const startTime = Date.now();
  let attempt = 0;
  
  while (Date.now() - startTime < options.maxWaitSec * 1000) {
    // Exponential backoff with jitter: 100ms, 200ms, 400ms, 800ms
    const backoff = Math.min(100 * Math.pow(2, attempt), 1000);
    const jitter = Math.random() * backoff * 0.5;
    await sleep(backoff + jitter);
    
    // Check if cache is populated now
    const result = await getCached(key);
    if (result) return result.narrative.summary;
    
    attempt++;
  }
  
  // 4. Timeout - try to acquire lock ourselves
  const finalToken = crypto.randomUUID();
  const finalLock = await redis.set(lockKey, finalToken, 'EX', options.lockTimeoutSec, 'NX');
  if (finalLock) {
    try {
      const narrative = await buildFn();
      await setCached(key, createCachedNarrative(narrative));
      return narrative;
    } finally {
      await safeUnlock(lockKey, finalToken);
    }
  }
  
  // 5. Still can't get lock - fall back to direct generation
  return await buildFn();
}

// Safe lock release using Lua script
async function safeUnlock(lockKey: string, token: string): Promise<void> {
  const UNLOCK_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then 
      return redis.call("del", KEYS[1]) 
    else 
      return 0 
    end
  `;
  await redis.eval(UNLOCK_SCRIPT, 1, lockKey, token);
}
```

#### Lock Key Format

```
lock:narr:v1:narrative@1.0.0:a3f2c1:8f3e2a1b...
```

### 4. Stale-While-Revalidate (SWR)

Serves cached content immediately while refreshing in the background.

#### Algorithm

```typescript
async function withStaleWhileRevalidate(
  key: string,
  buildFn: () => Promise<string>,
  options = { staleDays: 7, ttlDays: 30 }
): Promise<string> {
  const cached = await getCached(key);
  
  if (!cached) {
    // Cache miss - generate fresh
    const narrative = await buildFn();
    await setCached(key, createCachedNarrative(narrative), options.ttlDays);
    return narrative;
  }
  
  const now = Date.now();
  const age = now - cached.meta.created_at;
  const staleThreshold = options.staleDays * 24 * 60 * 60 * 1000;
  
  if (age < staleThreshold) {
    // Fresh - return immediately
    return cached.narrative.summary;
  }
  
  // Stale - return old value and refresh in background with lock
  setImmediate(async () => {
    // Acquire refresh lock to prevent multiple nodes from refreshing
    const refreshKey = `refresh:${key}`;
    const gotRefresh = await redis.set(refreshKey, '1', 'NX', 'EX', 30);
    
    if (!gotRefresh) {
      // Another worker is already refreshing
      return;
    }
    
    try {
      const fresh = await withRetry(buildFn, {
        attempts: 3,
        baseDelay: 100,
        timeout: 10000
      });
      
      const refreshedAt = Date.now();
      const updated = {
        ...cached,
        narrative: { summary: fresh },
        meta: {
          ...cached.meta,
          refreshed_at: refreshedAt,
          stale_after: refreshedAt + (options.staleDays * 24 * 60 * 60 * 1000)
        }
      };
      
      await setCached(key, updated, options.ttlDays);
    } catch (error) {
      console.error('Background refresh failed:', error);
      // Keep stale value in cache
    } finally {
      await redis.del(refreshKey);
    }
  });
  
  return cached.narrative.summary;
}
```

#### Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options = { attempts: 3, baseDelay: 100, timeout: 10000 }
): Promise<T> {
  for (let i = 0; i < options.attempts; i++) {
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), options.timeout)
        )
      ]);
    } catch (error) {
      if (i === options.attempts - 1) throw error;
      
      const delay = options.baseDelay * Math.pow(2, i);
      const jitter = Math.random() * delay * 0.5;
      await sleep(delay + jitter);
    }
  }
  throw new Error('Retry exhausted');
}
```

### 5. Narrative Service Updates (`server/src/services/narrative.ts`)

Integration point between existing narrative generation and new caching layer.

#### Updated Interface

```typescript
export async function getNarrative(
  request: NarrativeRequest
): Promise<string> {
  const cacheKey = generateCacheKey(request, {
    engineVersion: ENGINE_VERSION,
    promptHash: PROMPT_HASH,
    keyPrefix: process.env.CACHE_PREFIX
  });
  
  return await withStaleWhileRevalidate(
    cacheKey,
    async () => {
      return await withStampedeProtection(
        cacheKey,
        async () => {
          const result = await generateNarrative(request);
          return result.summary;
        }
      );
    }
  );
}
```

### 6. Negative Caching

Cache known-invalid profiles to prevent thundering herds on bad inputs.

#### Interface

```typescript
interface NegativeCacheEntry {
  error: string;
  timestamp: number;
}

export async function cacheNegativeResult(
  key: string,
  error: string,
  ttlMinutes: number = 15
): Promise<void> {
  const entry: NegativeCacheEntry = {
    error,
    timestamp: Date.now()
  };
  await redis.set(`neg:${key}`, JSON.stringify(entry), 'EX', ttlMinutes * 60);
}

export async function getNegativeCacheEntry(
  key: string
): Promise<NegativeCacheEntry | null> {
  const cached = await redis.get(`neg:${key}`);
  return cached ? JSON.parse(cached) : null;
}
```

#### Usage

```typescript
async function getNarrativeWithNegativeCache(
  request: NarrativeRequest
): Promise<string> {
  const cacheKey = generateCacheKey(request, options);
  
  // Check negative cache first
  const negativeEntry = await getNegativeCacheEntry(cacheKey);
  if (negativeEntry) {
    throw new Error(negativeEntry.error);
  }
  
  try {
    return await getNarrative(request);
  } catch (error) {
    // Cache validation errors for 15 minutes
    if (error instanceof ValidationError) {
      await cacheNegativeResult(cacheKey, error.message, 15);
    }
    throw error;
  }
}
```

**Use Cases:**
- Invalid birth data (malformed dates, impossible locations)
- Unsupported classification types
- Profile validation failures

**TTL:** 5-15 minutes (short enough to allow retries, long enough to prevent abuse)

### 7. API Routes

#### GET /api/narrative/stats (Admin Only)

Returns cache performance metrics.

**Response:**
```json
{
  "keys": 1247,
  "memoryUsed": "2.4M",
  "hitRate": 0.9523,
  "hits": 9523,
  "misses": 477,
  "engineVersion": "narrative@1.0.0",
  "promptHash": "a3f2c1",
  "ttlDays": 30
}
```

#### GET /api/narrative/analytics (Admin Only)

Returns detailed analytics and cost projections.

**Response:**
```json
{
  "totalRequests": 10000,
  "cacheHits": 9523,
  "cacheMisses": 477,
  "hitRate": 0.9523,
  "topSystems": [
    { "system": "Pleiades", "count": 3421 },
    { "system": "Arcturus", "count": 2156 },
    { "system": "Sirius", "count": 1834 }
  ],
  "avgGenerationTime": 2340,
  "estimatedCost": {
    "openai": 9.54,
    "redis": 10.00,
    "total": 19.54
  },
  "period": "30d"
}
```

#### DELETE /api/narrative/user/:userId (Admin Only)

Deletes user data for GDPR/CCPA compliance.

**Response:**
```json
{
  "deleted_cache_entries": 0,
  "deleted_analytics_rows": 5,
  "rationale": "Cache keys are profile-based hashes with no PII"
}
```

## Data Models

### Cached Narrative Value

```typescript
interface CachedNarrative {
  version: string;              // "2.1.0"
  engine: string;               // "gpt-4o"
  prompt_hash: string;          // "a3f2c1b9d8e7"
  profile: {
    classification: string;     // "primary" | "hybrid" | "unresolved"
    primary?: string;           // "Arcturus"
    hybrid?: string[];          // ["Arcturus", "Sirius"]
    percentages: Record<string, number>;
  };
  narrative: {
    summary: string;
    bullets?: string[];
  };
  meta: {
    created_at: number;         // Unix timestamp (ms)
    refreshed_at: number;       // Unix timestamp (ms)
    stale_after: number;        // Unix timestamp (ms)
    ttl_seconds: number;        // 2592000 (30 days)
    size_bytes: number;         // Uncompressed size
    compression: 'none' | 'gzip';
  };
}
```

### Analytics Record

```typescript
interface AnalyticsRecord {
  timestamp: number;
  event: 'cache_hit' | 'cache_miss' | 'generation' | 'error';
  cache_key: string;
  system?: string;
  duration_ms?: number;
  error?: string;
}
```

## Error Handling

### Error Hierarchy

```
CacheError (base)
├─ RedisConnectionError
├─ RedisTimeoutError
├─ CacheCorruptionError
└─ LockAcquisitionError
```

### Fallback Strategy

```typescript
async function getNarrativeWithFallback(request: NarrativeRequest): Promise<string> {
  try {
    // Try Redis cache with SWR
    return await getNarrative(request);
  } catch (error) {
    if (error instanceof RedisConnectionError) {
      console.error('Redis unavailable, falling back to direct generation');
      return await generateNarrative(request).then(r => r.summary);
    }
    
    if (error instanceof CacheCorruptionError) {
      console.error('Corrupted cache entry, regenerating');
      await deleteCached(error.key);
      return await generateNarrative(request).then(r => r.summary);
    }
    
    // Unknown error - use template fallback
    console.error('Narrative generation failed:', error);
    return generateTemplateFallback(request);
  }
}
```

### Circuit Breaker

Prevent cascading failures when Redis is consistently unavailable. Scoped narrowly to Redis operations only to avoid short-circuiting the model path.

```typescript
class RedisCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async executeRedisOp<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > 60000) {
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
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    
    if (this.failures >= 5) {
      this.state = 'open';
      console.error('Redis circuit breaker opened after 5 failures');
    }
  }
}
```

**Important:** Circuit breaker only applies to Redis operations, not to narrative generation. If Redis is down, the system falls back to direct generation without caching.

## Testing Strategy

### Unit Tests

**redis-cache.test.ts:**
- Connection handling (success, failure, timeout)
- Key generation (determinism, normalization)
- Value serialization (compression, metadata)
- Stampede protection (lock acquisition, contention)
- SWR logic (fresh, stale, background refresh)
- Error handling (Redis down, corrupted data)

**cache-utils.test.ts:**
- Key normalization (sorting, quantization)
- Hash determinism (same input → same key)
- Version bumping (invalidation)

### Integration Tests

**narrative-cache-integration.test.ts:**
- End-to-end cache flow
- Concurrent request handling
- Background refresh behavior
- Fallback to direct generation
- Analytics tracking

### Load Tests

**narrative-cache-load.test.ts:**
- 100 concurrent requests for same profile
- 1000 requests for different profiles
- Cache hit rate measurement
- Latency percentiles (p50, p95, p99)

### Pre-Production Checklist

- [ ] Redis connection successful
- [ ] Cache hit rate >90% after warm-up
- [ ] p95 latency <10ms
- [ ] Stampede protection prevents duplicate generations
- [ ] SWR serves stale content and refreshes in background
- [ ] Graceful fallback when Redis unavailable
- [ ] Admin endpoints require authentication
- [ ] Rate limiting active on admin endpoints
- [ ] Metrics exported to monitoring system
- [ ] Alerts configured for SLO violations

## Redis Configuration

### Eviction Policy

Configure Redis with appropriate eviction policy for cache workload:

```bash
# Recommended: Evict any key using LRU when memory limit reached
maxmemory-policy allkeys-lru

# Alternative: Only evict keys with TTL set
maxmemory-policy volatile-ttl
```

**Rationale:** All cached narratives have TTL set (30 days), so `volatile-ttl` works well. However, `allkeys-lru` provides better protection if non-TTL keys are accidentally added.

### Memory Limits

```bash
# Set based on expected cache size
maxmemory 512mb  # For ~10k cached narratives
maxmemory 2gb    # For ~50k cached narratives
maxmemory 8gb    # For ~200k cached narratives
```

**Calculation:**
- Average narrative size: ~2-4 KB (uncompressed)
- With compression: ~1-2 KB
- 10k narratives: ~20 MB
- Add 50% overhead for Redis metadata: ~30 MB
- Recommend 512 MB to allow for growth

### Persistence

```bash
# RDB snapshots (recommended for cache)
save 900 1      # Save if 1 key changed in 15 minutes
save 300 10     # Save if 10 keys changed in 5 minutes
save 60 10000   # Save if 10k keys changed in 1 minute

# AOF (optional, adds overhead)
appendonly no   # Not needed for cache workload
```

**Rationale:** RDB snapshots provide good balance of durability and performance for cache workload. AOF adds overhead and is unnecessary since cache can be rebuilt.

### Connection Pooling

```typescript
// ioredis configuration
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: false,
  connectTimeout: 10000,
  lazyConnect: false,
  keepAlive: 30000,
  family: 4, // IPv4
});
```

## Deployment Strategy

### Phase 1: Parallel Run (Week 1)

- Deploy Redis alongside existing NodeCache
- Route 10% of traffic to Redis
- Compare performance metrics
- Monitor error rates

### Phase 2: Gradual Rollout (Week 2)

- Increase Redis traffic to 50%
- Monitor cache hit rates
- Verify cost savings
- Test failover scenarios

### Phase 3: Full Migration (Week 3)

- Route 100% of traffic to Redis
- Remove NodeCache dependency
- Enable SWR and stampede protection
- Deploy pre-warming script

### Phase 4: Optimization (Week 4)

- Analyze cache hit patterns
- Adjust quantization if needed
- Pre-warm top 100 profiles
- Fine-tune TTL and stale thresholds

## Monitoring and Observability

### Key Metrics

**Performance:**
- Cache hit rate - fresh (target: ≥80%)
- Cache hit rate - stale (target: ≥10%)
- Cache hit rate - total (target: ≥90%)
- p50, p95, p99 latency (target: p95 ≤10ms)
- Request throughput (req/sec)

**Reliability:**
- Availability (target: ≥99.9%)
- Error rate (target: <0.1%)
- Circuit breaker state
- Locks in flight (gauge)

**Cost:**
- OpenAI API calls per day
- Redis memory usage
- Value size bytes (histogram)
- Estimated monthly cost

**Refresh Metrics:**
- refresh_started (counter)
- refresh_skipped_locked (counter)
- refresh_success (counter)
- refresh_fail (counter)

### Dashboards

**Cache Performance Dashboard:**
- Hit rate over time (line chart)
- Latency percentiles (line chart)
- Top star systems (bar chart)
- Cache size and memory (gauge)

**Cost Dashboard:**
- API calls vs cached responses (stacked area)
- Estimated cost per user (line chart)
- Cost savings vs no cache (comparison)

### Alerts

**Critical:**
- Redis connection down for >5 minutes
- Cache hit rate <50% for >10 minutes
- p95 latency >100ms for >10 minutes

**Warning:**
- Cache hit rate <90% for >10 minutes
- Refresh error rate >5% for >10 minutes
- Memory usage >80%

## Security Considerations

### Data Privacy

- Cache keys are SHA-1 hashes (no PII)
- Cache values contain no birth data or userId
- Optional user→keys index expires in 30 days
- All PII stored only in analytics (separate from cache)

### Access Control

- Admin endpoints require JWT authentication
- Role-based access control (RBAC)
- IP whitelisting for admin routes
- Rate limiting (10 req/sec, burst 20)

### Network Security

- TLS encryption for Redis connections (rediss://)
- Credentials only via environment variables
- No secrets in logs or error messages
- Redis password rotation supported

### Compliance

- GDPR: Right to deletion via /api/narrative/user/:userId
- CCPA: Data minimization (no PII in cache)
- SOC 2: Audit logs for all admin actions
- HIPAA: Not applicable (no health data)

## Cost Analysis

### Current (NodeCache)

| Users/Month | Hit Rate | OpenAI | Redis | Total |
|-------------|----------|--------|-------|-------|
| 1,000       | 70%      | $15    | $0    | $15   |
| 10,000      | 70%      | $150   | $0    | $150  |
| 100,000     | 70%      | $1,500 | $0    | $1,500|

### Phase 1 (Redis)

| Users/Month | Hit Rate | OpenAI | Redis | Total |
|-------------|----------|--------|-------|-------|
| 1,000       | 95%      | $5     | $10   | $15   |
| 10,000      | 98%      | $20    | $20   | $40   |
| 100,000     | 98%      | $200   | $50   | $250  |

### Phase 2 (Redis + Pre-warming)

| Users/Month | Hit Rate | OpenAI | Redis | Total |
|-------------|----------|--------|-------|-------|
| 10,000      | 99%      | $10    | $20   | $30   |
| 100,000     | 99.5%    | $50    | $50   | $100  |
| 1,000,000   | 99.8%    | $200   | $100  | $300  |

**ROI at 100k users/month:**
- Current cost: $1,500/month
- New cost: $100/month
- Savings: $1,400/month (93% reduction)
- Redis cost: $50/month
- Net savings: $1,350/month

## Migration Plan

### Pre-Migration

1. Set up Redis instance (Upstash free tier or Redis Cloud)
2. Configure REDIS_URL in environment
3. Deploy redis-cache.ts without routing traffic
4. Run integration tests against Redis
5. Verify metrics collection

### Migration

1. Deploy code with feature flag (ENABLE_REDIS_CACHE=false)
2. Enable for 10% of traffic
3. Monitor for 24 hours
4. Increase to 50% if metrics look good
5. Monitor for 48 hours
6. Enable for 100% of traffic
7. Remove NodeCache after 1 week

### Post-Migration

1. Enable SWR (ENABLE_SWR=true)
2. Enable stampede protection (ENABLE_STAMPEDE_PROTECTION=true)
3. Deploy pre-warming script
4. Schedule nightly pre-warming cron job
5. Monitor cost savings

### Rollback Plan

If issues arise:
1. Set ENABLE_REDIS_CACHE=false
2. Traffic routes back to NodeCache
3. Investigate Redis issues
4. Fix and redeploy
5. Resume migration

## Open Questions (To Be Resolved)

1. **Locale/Language**: Do narratives vary by locale? If yes, include in cache key.
2. **Model/Temperature**: Do narratives vary by AI model or temperature? If yes, include in cache key.
3. **Personalization**: Are narratives shared across users or personalized? Affects cache key design.
4. **Max Narrative Size**: What's the cap before compression? Recommend 64-128 KB.
5. **Multi-Region**: Will system run in multiple regions? Affects Redis replication strategy.

## References

- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Upstash Documentation](https://docs.upstash.com/redis)
- [Cache Stampede Prevention](https://en.wikipedia.org/wiki/Cache_stampede)
- [Stale-While-Revalidate](https://web.dev/stale-while-revalidate/)
- [ioredis Documentation](https://github.com/redis/ioredis)

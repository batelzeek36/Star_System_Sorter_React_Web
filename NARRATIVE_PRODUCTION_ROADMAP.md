# Narrative Caching: Production Roadmap

Based on GPT-5's recommendations for bulletproof production caching.

## ✅ Phase 1: MVP (Implemented)

### What's Working Now

1. **✅ Canonical Cache Keys**
   - Normalized input (sorted keys, quantized percentages)
   - Engine version tracking (`narrative@1.0.0`)
   - Prompt hash (invalidates cache on prompt changes)
   - Deterministic hashing (same input = same key)
   - **File:** `server/src/lib/cache-utils.ts`

2. **✅ In-Memory Cache**
   - NodeCache with 7-day TTL
   - Fast (microseconds)
   - Perfect for MVP

3. **✅ Graceful Fallback**
   - Template-based narratives when API fails
   - No user-facing errors

4. **✅ Privacy by Design**
   - Keys are hashes (no PII)
   - Values contain no birth data
   - 7-day TTL

## 🚧 Phase 2: Scale to 1k-10k Users (Next)

### Priority 1: Persistent Cache (Redis)

**Why:** Survive server restarts, share across instances

**Implementation:**

```typescript
// server/src/lib/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function getCached(key: string): Promise<string | null> {
  return await redis.get(key);
}

export async function setCached(
  key: string,
  value: string,
  ttlDays: number = 30
): Promise<void> {
  await redis.set(key, value, 'EX', ttlDays * 24 * 60 * 60);
}

export async function getCacheStats() {
  const info = await redis.info();
  const hit = /keyspace_hits:(\d+)/.exec(info)?.[1] ?? '0';
  const miss = /keyspace_misses:(\d+)/.exec(info)?.[1] ?? '0';
  const used = /used_memory_human:(\S+)/.exec(info)?.[1] ?? '?';
  const keys = await redis.dbsize();
  
  const h = Number(hit), m = Number(miss);
  return {
    keys,
    memoryUsed: used,
    hitRate: (h + m) ? +(h / (h + m)).toFixed(4) : 0,
  };
}
```

**Setup:**
```bash
# Install Redis client
npm install ioredis

# Add to .env
REDIS_URL=redis://localhost:6379

# Or use managed Redis (Upstash free tier)
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

**Cost:** ~$0-10/month (Upstash free tier → 10k commands/day)

### Priority 2: Stampede Protection

**Why:** Prevent 100 concurrent requests from all calling GPT-4o for the same profile

**Implementation:**

```typescript
// server/src/lib/redis-cache.ts (continued)

/**
 * Distributed lock to prevent cache stampede
 * Only one process generates the narrative, others wait
 */
export async function withNarrativeCache(
  key: string,
  buildFn: () => Promise<string>,
  ttlSec: number = 2592000 // 30 days
): Promise<string> {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) return cached;
  
  // Try to acquire lock
  const lockKey = `lock:${key}`;
  const gotLock = await redis.set(lockKey, '1', 'NX', 'EX', 30); // 30s lock
  
  if (gotLock) {
    // We got the lock - generate the narrative
    try {
      const value = await buildFn();
      await redis.set(key, value, 'EX', ttlSec);
      return value;
    } finally {
      await redis.del(lockKey);
    }
  }
  
  // Someone else is building - wait and retry
  await new Promise(r => setTimeout(r, 150)); // 150ms backoff
  
  // Check cache again (should be there now)
  const result = await redis.get(key);
  if (result) return result;
  
  // Still not there? Recursive retry (max 3 attempts)
  return await withNarrativeCache(key, buildFn, ttlSec);
}
```

**Usage in route:**
```typescript
const narrative = await withNarrativeCache(cacheKey, async () => {
  return (await generateNarrative(request)).summary;
});
```

**Impact:** Prevents $100s in wasted API calls during traffic spikes

### Priority 3: Real Cache Stats Endpoint

**Why:** Monitor performance, optimize costs

**Implementation:**

```typescript
// server/src/routes/narrative.ts

router.get('/narrative/stats', async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({
      ...stats,
      engineVersion: ENGINE_VERSION,
      promptHash: PROMPT_HASH,
      ttlDays: 30,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});
```

**Response:**
```json
{
  "keys": 1247,
  "memoryUsed": "2.4M",
  "hitRate": 0.9523,
  "engineVersion": "narrative@1.0.0",
  "promptHash": "a3f2c1b9d8e7",
  "ttlDays": 30
}
```

## 🎯 Phase 3: Scale to 10k+ Users (Future)

### Priority 1: Stale-While-Revalidate

**Why:** Serve cached content instantly, refresh in background

**Implementation:**

```typescript
interface CachedNarrative {
  body: string;
  timestamp: number;
  version: string;
}

export async function getWithSWR(
  key: string,
  buildFn: () => Promise<string>,
  staleMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days
): Promise<string> {
  const cached = await redis.get(key);
  
  if (!cached) {
    // Cache miss - generate fresh
    const value = await buildFn();
    await setCachedWithMeta(key, value);
    return value;
  }
  
  const data: CachedNarrative = JSON.parse(cached);
  const age = Date.now() - data.timestamp;
  
  if (age < staleMs) {
    // Fresh - return immediately
    return data.body;
  }
  
  // Stale - return old, refresh in background
  setImmediate(async () => {
    try {
      const fresh = await buildFn();
      await setCachedWithMeta(key, fresh);
    } catch (err) {
      console.error('Background refresh failed:', err);
    }
  });
  
  return data.body;
}
```

**Impact:** Zero perceived latency for users, always fresh content

### Priority 2: Pre-Warming Strategy

**Why:** Pre-generate narratives for common profiles

**Implementation:**

```typescript
// scripts/prewarm-cache.ts

import { generateNarrative } from '../server/src/services/narrative';
import { setCached } from '../server/src/lib/redis-cache';
import { generateCacheKey } from '../server/src/lib/cache-utils';

// Top 100 profiles from analytics
const topProfiles = [
  {
    classification: 'primary',
    primary: 'Pleiades',
    percentages: { Pleiades: 42, Sirius: 18, Arcturus: 15, /* ... */ },
    hdData: { type: 'Generator', authority: 'Sacral', profile: '2/4', /* ... */ },
  },
  // ... 99 more
];

async function prewarmCache() {
  console.log(`Pre-warming ${topProfiles.length} profiles...`);
  
  for (const profile of topProfiles) {
    const key = generateCacheKey(profile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'current_hash',
    });
    
    // Check if already cached
    const exists = await redis.exists(key);
    if (exists) {
      console.log(`✓ ${profile.primary || profile.hybrid} (cached)`);
      continue;
    }
    
    // Generate and cache
    try {
      const narrative = await generateNarrative(profile);
      await setCached(key, narrative.summary, 30);
      console.log(`✓ ${profile.primary || profile.hybrid} (generated)`);
      
      // Rate limit to avoid OpenAI throttling
      await new Promise(r => setTimeout(r, 1000)); // 1 req/sec
    } catch (error) {
      console.error(`✗ ${profile.primary || profile.hybrid}:`, error);
    }
  }
  
  console.log('Pre-warming complete!');
}

prewarmCache();
```

**Run nightly:**
```bash
# crontab
0 2 * * * cd /app && node scripts/prewarm-cache.js
```

**Impact:** 99%+ cache hit rate, ~$10/month OpenAI costs

### Priority 3: Analytics & Optimization

**Track:**
- Most common star systems
- Cache hit rate by hour/day
- Average narrative generation time
- Cost per user (actual vs. cached)

**Tools:**
- Redis TopK (most frequent profiles)
- HyperLogLog (unique users)
- Time-series data (hit rate trends)

**Dashboard:**
```typescript
router.get('/narrative/analytics', async (req, res) => {
  const stats = {
    totalRequests: await redis.get('stats:total_requests'),
    cacheHits: await redis.get('stats:cache_hits'),
    cacheMisses: await redis.get('stats:cache_misses'),
    topSystems: await redis.zrevrange('stats:top_systems', 0, 9, 'WITHSCORES'),
    avgGenerationTime: await redis.get('stats:avg_gen_time'),
    estimatedCost: calculateCost(stats),
  };
  res.json(stats);
});
```

## 🔒 Security & Compliance

### Already Implemented
- ✅ Keys are hashes (no PII)
- ✅ Values contain no birth data
- ✅ 7-day TTL (auto-cleanup)

### Phase 2 Additions
- Add user deletion endpoint (GDPR/CCPA)
- Log cache operations (audit trail)
- Encrypt sensitive data at rest (if needed)

### User Deletion
```typescript
router.delete('/narrative/user/:userId', async (req, res) => {
  // Find all keys for this user
  const pattern = `narr:*${req.params.userId}*`;
  const keys = await redis.keys(pattern);
  
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  
  res.json({ deleted: keys.length });
});
```

## 📊 Cost Projections

### Current (In-Memory)
| Users/Month | Cache Hit Rate | OpenAI Cost | Infrastructure | Total |
|-------------|----------------|-------------|----------------|-------|
| 100         | 60%            | $2-4        | $0             | $2-4  |
| 1,000       | 70%            | $15-20      | $0             | $15-20|
| 10,000      | 70%            | $150-200    | $0             | $150-200|

### Phase 2 (Redis)
| Users/Month | Cache Hit Rate | OpenAI Cost | Infrastructure | Total |
|-------------|----------------|-------------|----------------|-------|
| 1,000       | 95%            | $5-10       | $10            | $15-20|
| 10,000      | 98%            | $20-40      | $20            | $40-60|
| 100,000     | 98%            | $200-400    | $50            | $250-450|

### Phase 3 (Redis + Pre-warming)
| Users/Month | Cache Hit Rate | OpenAI Cost | Infrastructure | Total |
|-------------|----------------|-------------|----------------|-------|
| 10,000      | 99%            | $10-20      | $20            | $30-40|
| 100,000     | 99.5%          | $50-100     | $50            | $100-150|
| 1,000,000   | 99.8%          | $200-400    | $100           | $300-500|

## 🚀 Migration Checklist

### Phase 1 → Phase 2 (1k users)
- [ ] Set up Redis (Upstash free tier)
- [ ] Install `ioredis` package
- [ ] Implement `redis-cache.ts`
- [ ] Add stampede protection
- [ ] Update narrative route to use Redis
- [ ] Add `/narrative/stats` endpoint
- [ ] Monitor cache hit rate for 1 week
- [ ] Adjust TTL based on data

### Phase 2 → Phase 3 (10k users)
- [ ] Implement stale-while-revalidate
- [ ] Build analytics dashboard
- [ ] Identify top 100 profiles
- [ ] Create pre-warming script
- [ ] Set up nightly cron job
- [ ] Monitor cost savings
- [ ] Optimize quantization step (0.5% → 1%?)

## 📝 Notes

### Quantization Trade-offs

**Current: 0.5% buckets**
- 32.4% and 32.6% → different keys
- More unique narratives
- Lower cache hit rate

**Alternative: 1% buckets**
- 32.4% and 32.6% → same key (32%)
- Fewer unique narratives
- Higher cache hit rate

**Recommendation:** Start with 0.5%, increase to 1% if hit rate < 90%

### Prompt Versioning

When you update prompts:
1. Bump `ENGINE_VERSION` (e.g., `narrative@1.1.0`)
2. Old cache entries automatically invalidated
3. Pre-warm top profiles with new version
4. Monitor quality improvements

### Redis Alternatives

**Upstash** (Recommended for MVP → Scale)
- Free tier: 10k commands/day
- Pay-as-you-go: $0.20/100k commands
- Global edge caching
- No server management

**Redis Cloud**
- Free tier: 30MB
- Paid: $5-50/month
- More features (modules, clustering)

**Self-Hosted**
- Free (infrastructure cost only)
- Full control
- Requires DevOps

## 🎯 Success Metrics

### Phase 1 (Current)
- ✅ Narratives generate in < 5s
- ✅ Zero user-facing errors
- ✅ Cost < $20/month

### Phase 2 (Redis)
- 🎯 Cache hit rate > 95%
- 🎯 P99 latency < 100ms
- 🎯 Cost < $50/month at 10k users

### Phase 3 (Pre-warming)
- 🎯 Cache hit rate > 99%
- 🎯 P99 latency < 50ms
- 🎯 Cost < $500/month at 100k users

## 🔗 Resources

- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Upstash Documentation](https://docs.upstash.com/redis)
- [Cache Stampede Prevention](https://en.wikipedia.org/wiki/Cache_stampede)
- [Stale-While-Revalidate](https://web.dev/stale-while-revalidate/)

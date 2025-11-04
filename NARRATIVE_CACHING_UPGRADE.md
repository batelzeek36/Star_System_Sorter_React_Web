# Narrative Caching: Current vs. Production Setup

## Current Setup (In-Memory)

**Technology:** NodeCache (in-memory)
**TTL:** 7 days
**Persistence:** ❌ No - resets on server restart

### Pros:
- ✅ Zero setup required
- ✅ Extremely fast (microseconds)
- ✅ No external dependencies
- ✅ Perfect for development

### Cons:
- ❌ Cache lost on server restart
- ❌ Not shared across multiple server instances
- ❌ Limited by server RAM

### Cost Impact:
- **With cache hits:** ~$0.001 per user
- **After restart:** Back to ~$0.01-0.02 per user until cache rebuilds

## Production Upgrade: Redis

**Technology:** Redis (persistent key-value store)
**TTL:** 30 days (or longer)
**Persistence:** ✅ Yes - survives restarts

### Implementation:

```typescript
// server/src/services/narrative-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedNarrative(key: string): Promise<string | null> {
  return await redis.get(key);
}

export async function setCachedNarrative(
  key: string, 
  narrative: string, 
  ttlDays: number = 30
): Promise<void> {
  await redis.setex(key, ttlDays * 24 * 60 * 60, narrative);
}

export async function getCacheStats(): Promise<{
  keys: number;
  memoryUsed: string;
  hitRate: number;
}> {
  const info = await redis.info('stats');
  // Parse Redis stats
  return {
    keys: await redis.dbsize(),
    memoryUsed: '...',
    hitRate: 0.95, // Calculate from hits/misses
  };
}
```

### Pros:
- ✅ Survives server restarts
- ✅ Shared across multiple server instances
- ✅ Can store millions of narratives
- ✅ Built-in TTL management
- ✅ Analytics on cache performance

### Cons:
- ❌ Requires Redis server (Upstash, Redis Cloud, self-hosted)
- ❌ Adds ~$10-20/month cost (for managed Redis)
- ❌ Slightly slower than in-memory (~1-5ms vs microseconds)

### Cost Impact:
- **Initial users:** ~$0.01-0.02 per generation
- **After 1,000 users:** ~95% cache hit rate
- **After 10,000 users:** ~98% cache hit rate
- **Steady state:** ~$0.0001 per user (1000x cheaper!)

## Alternative: Database Table

**Technology:** PostgreSQL/MySQL table
**TTL:** Manual cleanup or timestamp-based
**Persistence:** ✅ Yes

### Schema:

```sql
CREATE TABLE narrative_cache (
  cache_key VARCHAR(64) PRIMARY KEY,
  narrative TEXT NOT NULL,
  classification VARCHAR(20) NOT NULL,
  primary_system VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  accessed_at TIMESTAMP DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  INDEX idx_created (created_at),
  INDEX idx_accessed (accessed_at)
);

-- Cleanup old entries (run daily)
DELETE FROM narrative_cache 
WHERE accessed_at < NOW() - INTERVAL 30 DAY;
```

### Pros:
- ✅ Survives restarts
- ✅ Already have a database (probably)
- ✅ Can query for analytics
- ✅ No additional infrastructure

### Cons:
- ❌ Slower than Redis (~10-50ms)
- ❌ Manual TTL cleanup required
- ❌ Adds load to main database

## Recommendation by Scale

### < 1,000 users/month
**Use:** Current in-memory cache
**Why:** Simple, fast, good enough
**Cost:** ~$10-20/month

### 1,000 - 10,000 users/month
**Use:** Redis (Upstash free tier or Redis Cloud)
**Why:** Cache persistence worth it, still affordable
**Cost:** ~$10-30/month (Redis) + ~$20-50/month (OpenAI)

### 10,000+ users/month
**Use:** Redis + pre-warming strategy
**Why:** Maximum cache hits, minimal API costs
**Cost:** ~$20-50/month (Redis) + ~$50-100/month (OpenAI)

## Pre-Warming Strategy

Once you have enough data, you can pre-generate narratives for common profiles:

```typescript
// scripts/prewarm-cache.ts
import { generateNarrative } from '../server/src/services/narrative';
import { setCachedNarrative } from '../server/src/services/narrative-cache';

// Most common profiles from analytics
const commonProfiles = [
  { classification: 'primary', primary: 'Pleiades', percentages: {...} },
  { classification: 'primary', primary: 'Sirius', percentages: {...} },
  { classification: 'hybrid', hybrid: ['Arcturus', 'Orion Light'], percentages: {...} },
  // ... top 100 profiles
];

async function prewarmCache() {
  for (const profile of commonProfiles) {
    const narrative = await generateNarrative(profile);
    const key = generateCacheKey(profile);
    await setCachedNarrative(key, narrative.summary);
    console.log(`Cached: ${profile.classification} - ${profile.primary || profile.hybrid}`);
  }
}
```

## Analytics to Track

With persistent cache, you can track:

1. **Cache hit rate** - % of requests served from cache
2. **Most common profiles** - Which star systems are most popular
3. **Narrative quality** - User feedback on narratives
4. **Cost per user** - Actual OpenAI spend vs. cached responses

## Migration Path

### Phase 1 (Now): In-Memory
- ✅ Already implemented
- ✅ Works great for MVP
- ✅ Zero setup

### Phase 2 (1,000+ users): Add Redis
```bash
# Add Redis
npm install ioredis

# Update .env
REDIS_URL=redis://localhost:6379

# Update narrative route to use Redis
```

### Phase 3 (10,000+ users): Pre-warming
```bash
# Run nightly
node scripts/prewarm-cache.js

# Pre-generate top 100 profiles
# Cache hit rate → 99%+
```

## Cost Comparison

### 1,000 users/month:

**In-Memory (current):**
- Cache hit rate: ~70% (resets on deploy)
- OpenAI cost: ~$15-20/month
- Infrastructure: $0
- **Total: ~$15-20/month**

**Redis:**
- Cache hit rate: ~95% (persistent)
- OpenAI cost: ~$5-10/month
- Infrastructure: ~$10/month (Upstash)
- **Total: ~$15-20/month** (same, but more reliable)

### 10,000 users/month:

**In-Memory:**
- Cache hit rate: ~70%
- OpenAI cost: ~$150-200/month
- Infrastructure: $0
- **Total: ~$150-200/month**

**Redis:**
- Cache hit rate: ~98%
- OpenAI cost: ~$20-40/month
- Infrastructure: ~$20/month
- **Total: ~$40-60/month** (4x cheaper!)

### 100,000 users/month:

**In-Memory:**
- Cache hit rate: ~70%
- OpenAI cost: ~$1,500-2,000/month
- Infrastructure: $0
- **Total: ~$1,500-2,000/month**

**Redis + Pre-warming:**
- Cache hit rate: ~99%+
- OpenAI cost: ~$100-200/month
- Infrastructure: ~$50/month
- **Total: ~$150-250/month** (10x cheaper!)

## Conclusion

Your intuition is correct! Once enough people get results, the cache will handle most requests. But for that to work long-term, you'll want persistent caching (Redis) once you hit ~1,000 users/month.

For now, the in-memory cache is perfect for MVP and will give you great performance during active sessions.

# Narrative Cache MVP: Quick Start Checklist

**Goal:** Implement basic Redis caching to save GPT-4o API costs for a few users.

**Time Estimate:** 3-4 hours  
**Expected Savings:** ~70% reduction in API costs ($0.02 → $0.006 per user)

---

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] Access to Redis (choose one option below)

### Option A: Upstash (Recommended - Free Tier)
- [ ] Sign up at [upstash.com](https://upstash.com)
- [ ] Create a new Redis database
- [ ] Copy the Redis URL (starts with `rediss://`)

### Option B: Local Redis
```bash
# macOS
brew install redis
redis-server

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

---

## Step 1: Install Dependencies (5 min)

```bash
cd server
npm install ioredis
npm install --save-dev @types/ioredis
```

**Verify:**
- [ ] `ioredis` appears in `server/package.json`

---

## Step 2: Configure Environment (5 min)

Add to `server/.env`:

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379
# OR for Upstash:
# REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:6379

# Feature Flag
ENABLE_REDIS_CACHE=true

# Cache Settings (optional - defaults work fine)
CACHE_TTL_DAYS=30
```

Add to `server/.env.example`:

```bash
# Redis Cache
REDIS_URL=redis://localhost:6379
ENABLE_REDIS_CACHE=false
CACHE_TTL_DAYS=30
```

**Verify:**
- [ ] `.env` has `REDIS_URL` and `ENABLE_REDIS_CACHE=true`
- [ ] `.env.example` updated for other developers

---

## Step 3: Create Redis Cache Module (45 min)

Create `server/src/lib/redis-cache.ts`:

```typescript
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

// Simple cache interface
export interface CachedNarrative {
  summary: string;
  created_at: number;
}

export async function getCached(key: string): Promise<string | null> {
  if (process.env.ENABLE_REDIS_CACHE !== 'true') {
    return null;
  }

  try {
    const cached = await redis.get(key);
    if (!cached) return null;

    const data: CachedNarrative = JSON.parse(cached);
    return data.summary;
  } catch (error) {
    console.error('Redis get error:', error);
    return null; // Fail gracefully
  }
}

export async function setCached(
  key: string,
  narrative: string,
  ttlDays: number = 30
): Promise<void> {
  if (process.env.ENABLE_REDIS_CACHE !== 'true') {
    return;
  }

  try {
    const data: CachedNarrative = {
      summary: narrative,
      created_at: Date.now(),
    };

    const ttlSeconds = ttlDays * 24 * 60 * 60;
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    console.error('Redis set error:', error);
    // Fail gracefully - don't block narrative generation
  }
}

export async function getCacheStats() {
  try {
    const info = await redis.info('stats');
    const keys = await redis.dbsize();
    
    const hitMatch = /keyspace_hits:(\d+)/.exec(info);
    const missMatch = /keyspace_misses:(\d+)/.exec(info);
    
    const hits = hitMatch ? parseInt(hitMatch[1]) : 0;
    const misses = missMatch ? parseInt(missMatch[1]) : 0;
    const total = hits + misses;
    
    return {
      keys,
      hits,
      misses,
      hitRate: total > 0 ? (hits / total).toFixed(4) : '0.0000',
    };
  } catch (error) {
    console.error('Redis stats error:', error);
    return { keys: 0, hits: 0, misses: 0, hitRate: '0.0000' };
  }
}

export default redis;
```

**Verify:**
- [ ] File created at `server/src/lib/redis-cache.ts`
- [ ] No TypeScript errors

---

## Step 4: Update Narrative Service (30 min)

Update `server/src/services/narrative.ts`:

```typescript
import { getCached, setCached } from '../lib/redis-cache';
import { generateCacheKey } from '../lib/cache-utils';

// Add this to your existing getNarrative function
export async function getNarrative(request: NarrativeRequest): Promise<string> {
  // Generate cache key using existing function
  const cacheKey = generateCacheKey(request, {
    engineVersion: 'narrative@1.0.0',
    promptHash: 'abc123', // Use your actual prompt hash
  });

  // Check cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    console.log('Cache hit:', cacheKey);
    return cached;
  }

  console.log('Cache miss:', cacheKey);

  // Generate fresh narrative
  try {
    const result = await generateNarrative(request);
    const narrative = result.summary;

    // Store in cache (fire and forget)
    setCached(cacheKey, narrative).catch(err => 
      console.error('Cache set failed:', err)
    );

    return narrative;
  } catch (error) {
    console.error('Narrative generation failed:', error);
    // Return template fallback
    return generateTemplateFallback(request);
  }
}
```

**Verify:**
- [ ] `getCached` and `setCached` imported
- [ ] Cache check happens before generation
- [ ] Cache set happens after generation
- [ ] Errors don't break the flow

---

## Step 5: Add Optional Stats Endpoint (15 min)

Add to `server/src/routes/narrative.ts`:

```typescript
import { getCacheStats } from '../lib/redis-cache';

// Add this route
router.get('/narrative/stats', async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({
      ...stats,
      enabled: process.env.ENABLE_REDIS_CACHE === 'true',
      ttlDays: parseInt(process.env.CACHE_TTL_DAYS || '30'),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});
```

**Verify:**
- [ ] Route added to narrative router
- [ ] Endpoint accessible at `GET /api/narrative/stats`

---

## Step 6: Test Locally (30 min)

### Start Redis (if local)
```bash
redis-server
```

### Start Server
```bash
cd server
npm run dev
```

### Test Cache Flow

1. **First Request (Cache Miss)**
```bash
curl -X POST http://localhost:3000/api/narrative \
  -H "Content-Type: application/json" \
  -d '{
    "classification": "primary",
    "primary": "Arcturus",
    "percentages": {"Arcturus": 42, "Sirius": 18}
  }'
```

Check logs for: `Cache miss: narr:...`

2. **Second Request (Cache Hit)**

Run the same curl command again.

Check logs for: `Cache hit: narr:...`

3. **Check Stats**
```bash
curl http://localhost:3000/api/narrative/stats
```

Expected response:
```json
{
  "keys": 1,
  "hits": 1,
  "misses": 1,
  "hitRate": "0.5000",
  "enabled": true,
  "ttlDays": 30
}
```

**Verify:**
- [ ] First request generates narrative (slow)
- [ ] Second request returns instantly (fast)
- [ ] Stats show cache hits
- [ ] No errors in server logs

---

## Step 7: Deploy (30 min)

### Update Production Environment

Add to your hosting platform (Vercel/Netlify/Railway):

```bash
REDIS_URL=rediss://your-production-redis-url
ENABLE_REDIS_CACHE=true
CACHE_TTL_DAYS=30
```

### Deploy Code

```bash
git add .
git commit -m "Add Redis caching for narratives"
git push origin main
```

**Verify:**
- [ ] Environment variables set in production
- [ ] Deployment successful
- [ ] Production logs show Redis connection
- [ ] Test with production API

---

## Troubleshooting

### Redis Connection Fails

**Error:** `Redis connection error: ECONNREFUSED`

**Fix:**
- Check Redis is running: `redis-cli ping` (should return `PONG`)
- Verify `REDIS_URL` in `.env`
- For Upstash, check URL includes password

### Cache Not Working

**Error:** Requests always slow, no cache hits

**Fix:**
- Check `ENABLE_REDIS_CACHE=true` in `.env`
- Verify logs show "Cache miss" then "Cache hit" on repeat requests
- Check `generateCacheKey` returns consistent keys

### TypeScript Errors

**Error:** `Cannot find module 'ioredis'`

**Fix:**
```bash
cd server
npm install ioredis @types/ioredis
```

---

## Success Metrics

After implementation, you should see:

- ✅ First request: 2-5 seconds (GPT-4o call)
- ✅ Repeat request: <100ms (cache hit)
- ✅ Cache hit rate: ~60-70% after a few users
- ✅ API costs: ~70% reduction
- ✅ No user-facing errors

---

## What's Next?

Once this MVP is working, you can add:

1. **Stampede Protection** (Task 4) - Prevents duplicate API calls during concurrent requests
2. **Stale-While-Revalidate** (Task 5) - Serves cached content while refreshing in background
3. **Admin Dashboard** (Task 8) - Monitor cache performance
4. **Pre-warming** (Task 10) - Pre-generate common profiles

See `.kiro/specs/narrative-caching-production/tasks.md` for the full roadmap.

---

## Quick Reference

**Check Redis Status:**
```bash
redis-cli ping
```

**View Cached Keys:**
```bash
redis-cli KEYS "narr:*"
```

**Clear Cache:**
```bash
redis-cli FLUSHDB
```

**Monitor Cache:**
```bash
redis-cli MONITOR
```

**Check Stats:**
```bash
curl http://localhost:3000/api/narrative/stats
```

---

## Rollback Plan

If something goes wrong:

1. Set `ENABLE_REDIS_CACHE=false` in `.env`
2. Restart server
3. System falls back to direct GPT-4o calls (no caching)

No data loss, no user impact.

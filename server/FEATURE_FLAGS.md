# Feature Flags for Narrative Caching

This document explains the feature flags available for gradual rollout of the Redis-based narrative caching system.

## Available Feature Flags

All feature flags default to `false` for safe, gradual rollout. Set them to `true` in your `.env` file to enable.

### 1. ENABLE_REDIS_CACHE

**Default:** `false`

Enables Redis-based caching for narrative generation. When disabled, narratives are generated directly without caching.

```bash
ENABLE_REDIS_CACHE=true
```

**Impact:**
- Narratives are stored in Redis with 30-day TTL
- Subsequent requests for the same profile return cached results
- Reduces OpenAI API calls and improves response times

**Rollout Strategy:**
1. Start with `false` (direct generation)
2. Enable for 10% of traffic
3. Monitor cache hit rates and error rates
4. Gradually increase to 100%

### 2. ENABLE_SWR

**Default:** `false`

Enables Stale-While-Revalidate strategy. Serves cached content immediately while refreshing in the background.

```bash
ENABLE_SWR=true
```

**Requirements:**
- `ENABLE_REDIS_CACHE=true` (SWR requires Redis)

**Impact:**
- Stale content (>7 days old) is served immediately
- Background refresh updates the cache
- Users always get instant responses
- Reduces perceived latency

**Rollout Strategy:**
1. Enable after Redis cache is stable
2. Monitor background refresh success rates
3. Verify stale content is acceptable to users

### 3. ENABLE_STAMPEDE_PROTECTION

**Default:** `false`

Enables distributed locking to prevent cache stampedes. Multiple concurrent requests for the same uncached narrative will only trigger one API call.

```bash
ENABLE_STAMPEDE_PROTECTION=true
```

**Requirements:**
- `ENABLE_REDIS_CACHE=true` (uses Redis locks)

**Impact:**
- Prevents duplicate API calls during traffic spikes
- Reduces OpenAI API costs
- Improves system stability under load
- Adds small latency for lock acquisition (~10-50ms)

**Rollout Strategy:**
1. Enable after Redis cache is stable
2. Test with load testing tools (100+ concurrent requests)
3. Monitor lock contention metrics

### 4. ENABLE_NEGATIVE_CACHE

**Default:** `false`

Enables caching of validation errors. Invalid profiles are cached for 15 minutes to prevent repeated error processing.

```bash
ENABLE_NEGATIVE_CACHE=true
```

**Requirements:**
- `ENABLE_REDIS_CACHE=true` (uses Redis)

**Impact:**
- Prevents repeated processing of invalid inputs
- Reduces server load from malicious/buggy clients
- Improves error response times
- Caches errors for 15 minutes

**Rollout Strategy:**
1. Enable after Redis cache is stable
2. Monitor negative cache hit rates
3. Adjust TTL if needed (currently 15 minutes)

## Configuration Example

### Development (No Caching)
```bash
ENABLE_REDIS_CACHE=false
ENABLE_SWR=false
ENABLE_STAMPEDE_PROTECTION=false
ENABLE_NEGATIVE_CACHE=false
```

### Phase 1: Basic Caching
```bash
ENABLE_REDIS_CACHE=true
ENABLE_SWR=false
ENABLE_STAMPEDE_PROTECTION=false
ENABLE_NEGATIVE_CACHE=false
```

### Phase 2: Add SWR
```bash
ENABLE_REDIS_CACHE=true
ENABLE_SWR=true
ENABLE_STAMPEDE_PROTECTION=false
ENABLE_NEGATIVE_CACHE=false
```

### Phase 3: Add Stampede Protection
```bash
ENABLE_REDIS_CACHE=true
ENABLE_SWR=true
ENABLE_STAMPEDE_PROTECTION=true
ENABLE_NEGATIVE_CACHE=false
```

### Phase 4: Full Production
```bash
ENABLE_REDIS_CACHE=true
ENABLE_SWR=true
ENABLE_STAMPEDE_PROTECTION=true
ENABLE_NEGATIVE_CACHE=true
```

## Monitoring

When enabling feature flags, monitor these metrics:

### Redis Cache
- Cache hit rate (target: ≥90%)
- Cache miss rate
- Redis connection errors
- Memory usage

### SWR
- Stale cache hits
- Background refresh success rate
- Background refresh error rate
- Stale content age distribution

### Stampede Protection
- Lock acquisition success rate
- Lock contention (concurrent requests waiting)
- Lock timeout rate
- Average wait time for locks

### Negative Cache
- Negative cache hit rate
- Validation error types
- Negative cache TTL effectiveness

## Rollback

If issues arise, disable flags in reverse order:

1. Disable `ENABLE_NEGATIVE_CACHE=false`
2. Disable `ENABLE_STAMPEDE_PROTECTION=false`
3. Disable `ENABLE_SWR=false`
4. Disable `ENABLE_REDIS_CACHE=false` (falls back to direct generation)

The system is designed to gracefully degrade. Disabling Redis cache will fall back to direct narrative generation without caching.

## Testing

Run tests to verify feature flag behavior:

```bash
npm test cache-config.test.ts
```

This tests:
- Feature flag parsing (true/false values)
- Default values
- Configuration validation
- Environment variable handling

## Related Files

- `server/src/lib/cache-config.ts` - Feature flag parsing and validation
- `server/src/services/narrative.ts` - Feature flag usage in narrative service
- `server/.env.example` - Environment variable documentation
- `server/src/lib/cache-config.test.ts` - Feature flag tests

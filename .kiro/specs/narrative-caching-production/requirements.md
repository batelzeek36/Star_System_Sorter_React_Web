# Requirements Document

## Introduction

This specification defines the requirements for upgrading the Star System Sorter narrative caching system from in-memory (NodeCache) to production-ready Redis-based caching. The upgrade enables persistent caching across server restarts, distributed caching across multiple instances, cache stampede protection, and advanced analytics to optimize costs and performance at scale.

## Glossary

- **Narrative Cache**: A persistent storage system that caches GPT-4o-generated narrative summaries for star system classifications to reduce API costs and improve response times
- **Cache Key**: A deterministic hash derived from normalized classification data, engine version, and prompt hash
- **Cache Stampede**: A scenario where multiple concurrent requests for the same uncached item all trigger expensive API calls simultaneously
- **Stale-While-Revalidate (SWR)**: A caching strategy that serves stale cached content immediately while refreshing it in the background
- **Pre-warming**: The process of proactively generating and caching narratives for common user profiles before they are requested
- **Hit Rate**: The percentage of requests served from cache versus requiring new API calls
- **TTL (Time To Live)**: The duration a cached item remains valid before expiration
- **Redis**: An in-memory data structure store used as a distributed cache
- **Quantization**: The process of rounding percentage values to reduce cache key variations (e.g., 32.4% → 32%)

## Requirements

### Requirement 1: Redis-Based Persistent Cache

**User Story:** As a system operator, I want narrative cache to persist across server restarts, so that cache hit rates remain high and API costs stay low even after deployments.

#### Acceptance Criteria

1. WHEN THE System initializes, THE Narrative Cache SHALL establish a connection to a Redis instance using the REDIS_URL environment variable
2. WHEN a narrative is cached, THE Narrative Cache SHALL store the narrative in Redis with a 30-day TTL
3. WHEN a cached narrative is requested, THE Narrative Cache SHALL retrieve the narrative with p95 latency less than or equal to 10 milliseconds intra-region as measured at the application tier
4. WHEN THE server restarts, THE Narrative Cache SHALL retain all previously cached narratives that have not exceeded their TTL
5. WHERE multiple server instances are deployed, THE Narrative Cache SHALL share cached narratives across all instances

### Requirement 2: Cache Stampede Protection

**User Story:** As a system operator, I want to prevent multiple concurrent requests from generating the same narrative, so that API costs remain predictable during traffic spikes.

#### Acceptance Criteria

1. WHEN multiple concurrent requests arrive for the same uncached narrative, THE Narrative Cache SHALL allow only one request to generate the narrative by acquiring a Redis lock with key pattern lock:<cache_key> using SET with EX=30 and NX flags
2. WHILE a narrative is being generated, THE Narrative Cache SHALL hold the distributed lock with a 30-second timeout
3. WHEN other requests encounter a locked cache key, THE Narrative Cache SHALL use exponential backoff with jitter between 100 milliseconds and 1000 milliseconds with an overall wait cap of 5 seconds
4. WHEN a narrative generation completes, THE Narrative Cache SHALL release the lock and store the result
5. IF a lock expires before generation completes, THE Narrative Cache SHALL allow another request to acquire the lock and retry

### Requirement 3: Cache Statistics and Monitoring

**User Story:** As a system operator, I want to monitor cache performance metrics, so that I can optimize costs and identify performance issues.

#### Acceptance Criteria

1. THE Narrative Cache SHALL expose a statistics endpoint at GET /api/narrative/stats
2. THE statistics endpoint SHALL return the total number of cached keys
3. THE statistics endpoint SHALL return the cache hit rate as a decimal between 0 and 1
4. THE statistics endpoint SHALL return the memory used by the cache in human-readable format
5. THE statistics endpoint SHALL return the current engine version and prompt hash
6. THE statistics endpoint SHALL complete within 100 milliseconds

### Requirement 4: Graceful Fallback and Error Handling

**User Story:** As a user, I want to receive a narrative even when Redis is unavailable, so that the application remains functional during infrastructure issues.

#### Acceptance Criteria

1. WHEN Redis connection fails, THE Narrative Cache SHALL log the error and fall back to generating narratives without caching
2. WHEN Redis operations timeout, THE Narrative Cache SHALL proceed with narrative generation after 1 second
3. WHEN a cached narrative is corrupted, THE Narrative Cache SHALL regenerate the narrative and update the cache
4. THE Narrative Cache SHALL not expose Redis errors to end users
5. THE Narrative Cache SHALL continue serving requests even when Redis is completely unavailable

### Requirement 5: Stale-While-Revalidate Strategy

**User Story:** As a user, I want to receive narratives instantly, so that the application feels responsive even when cache entries are stale.

#### Acceptance Criteria

1. WHEN a cached narrative is older than 7 days, THE Narrative Cache SHALL serve the stale narrative immediately
2. WHILE serving a stale narrative, THE Narrative Cache SHALL trigger background regeneration of the narrative
3. WHEN background regeneration completes, THE Narrative Cache SHALL update the cached narrative with the fresh version
4. IF background regeneration fails, THE Narrative Cache SHALL retain the stale narrative and log the error
5. THE Narrative Cache SHALL include timestamp metadata with each cached narrative to determine staleness

### Requirement 6: Pre-Warming Capability

**User Story:** As a system operator, I want to pre-generate narratives for common profiles, so that cache hit rates approach 99% and API costs are minimized.

#### Acceptance Criteria

1. THE System SHALL provide a pre-warming script that accepts a list of common user profiles
2. WHEN the pre-warming script runs, THE System SHALL generate narratives for each profile that is not already cached
3. THE pre-warming script SHALL rate-limit generation to 1 request per second to avoid API throttling
4. THE pre-warming script SHALL log progress and errors for each profile processed
5. THE pre-warming script SHALL be executable via command line for integration with cron jobs

### Requirement 7: Cache Key Compatibility

**User Story:** As a system operator, I want cache keys to remain consistent with the existing implementation, so that the migration to Redis does not invalidate existing cached data.

#### Acceptance Criteria

1. THE Narrative Cache SHALL use the existing generateCacheKey function from cache-utils.ts
2. THE cache key format SHALL include normalized classification data, engine version, and prompt hash
3. WHEN classification percentages are quantized, THE Narrative Cache SHALL use 0.5% buckets
4. WHEN the engine version or prompt hash changes, THE Narrative Cache SHALL implicitly invalidate old cache entries by generating new keys and a weekly cleanup job MAY delete stale versions
5. THE cache key generation SHALL be deterministic such that identical inputs always produce identical keys

### Requirement 8: Environment Configuration

**User Story:** As a developer, I want to configure Redis connection via environment variables, so that I can use different Redis instances for development, staging, and production.

#### Acceptance Criteria

1. THE Narrative Cache SHALL read the Redis connection URL from the REDIS_URL environment variable
2. WHERE REDIS_URL is not provided, THE Narrative Cache SHALL default to redis://localhost:6379
3. THE Narrative Cache SHALL support Redis connection strings with authentication credentials
4. THE Narrative Cache SHALL support TLS-encrypted Redis connections (rediss:// protocol)
5. THE System SHALL document required environment variables in .env.example

### Requirement 9: User Data Deletion (GDPR/CCPA Compliance)

**User Story:** As a user, I want my cached data to be deletable upon request, so that the application complies with privacy regulations.

#### Acceptance Criteria

1. THE Narrative Cache SHALL provide a deletion endpoint at DELETE /api/narrative/user/:userId
2. THE cached narrative values SHALL contain no PII and SHALL NOT store userId
3. WHERE a user-to-keys index is maintained at key pattern idx:user:<userId>, THE deletion endpoint SHALL delete all cache entries referenced by the index
4. WHERE no user-to-keys index is maintained, THE deletion endpoint SHALL delete only analytics rows containing the userId and return deleted_cache_entries: 0 with rationale in the response
5. THE deletion endpoint SHALL complete within 5 seconds even for users with many cached entries

### Requirement 10: Analytics and Cost Tracking

**User Story:** As a system operator, I want to track narrative generation costs and cache effectiveness, so that I can optimize the system for cost efficiency.

#### Acceptance Criteria

1. THE Narrative Cache SHALL track the total number of narrative requests
2. THE Narrative Cache SHALL track the number of cache hits and cache misses separately
3. THE Narrative Cache SHALL track the most frequently requested star systems
4. THE Narrative Cache SHALL calculate estimated OpenAI API costs based on cache miss rate
5. THE System SHALL expose analytics data via GET /api/narrative/analytics endpoint

### Requirement 11: Key Schema and Namespacing

**User Story:** As an operator, I want deterministic, upgrade-safe keys so I can run multiple versions safely.

#### Acceptance Criteria

1. THE cache keys SHALL follow the pattern narr:v${MAJOR}:${engineVersion}:${promptHash}:${sha1(normalizedProfile)}
2. THE normalizedProfile SHALL include sorted fields and quantized percentages using 0.5% buckets
3. THE System SHALL support a keyPrefix environment variable for multi-tenant isolation
4. THE System SHALL provide a helper function to produce cache keys and no ad-hoc key construction SHALL occur elsewhere
5. THE cache key generation SHALL be deterministic such that identical inputs always produce identical keys

### Requirement 12: Value Schema and Metadata

**User Story:** As a developer, I want a stable value format to support SWR, analytics, and migrations.

#### Acceptance Criteria

1. THE cached value SHALL be JSON containing version, engine, prompt_hash, profile, narrative, and meta fields
2. THE meta field SHALL include created_at, refreshed_at, stale_after, ttl_seconds, size_bytes, and compression
3. WHERE cached values exceed 64 KB, THE Narrative Cache SHALL compress them using gzip and set compression field to gzip
4. THE Narrative Cache SHALL set stale_after to created_at plus 7 days
5. THE Narrative Cache SHALL set ttl_seconds to 2592000 (30 days)

### Requirement 13: Stale-While-Revalidate Behavior

**User Story:** As a user, I get instant responses even when refresh is needed.

#### Acceptance Criteria

1. WHEN the current time is greater than stale_after AND less than TTL expiration, THE Narrative Cache SHALL serve the cached value immediately
2. WHILE serving a stale cached value, THE Narrative Cache SHALL trigger a background refresh with a 10-second timeout
3. THE background refresh SHALL use exponential backoff with 100 millisecond base and jitter for up to 3 attempts
4. IF background refresh fails after all attempts, THE Narrative Cache SHALL keep the stale value and log an error
5. WHEN background refresh succeeds, THE Narrative Cache SHALL update the cached value with refreshed_at timestamp

### Requirement 14: Security and Rate Limiting

**User Story:** As a security-conscious operator, I want admin endpoints protected and secrets secured.

#### Acceptance Criteria

1. THE endpoints /api/narrative/stats and /api/narrative/analytics SHALL require admin authentication using JWT or role-based access control
2. THE admin endpoints SHALL be rate-limited to 10 requests per second with burst capacity of 20
3. THE admin endpoints SHALL log IP addresses for all requests
4. THE prompt hashes SHALL be returned only to authenticated admin users and SHALL NOT be exposed in public endpoints
5. THE Redis connections SHALL support TLS using rediss:// protocol and credentials SHALL only be provided via environment variables

### Requirement 15: Observability, SLOs and Alerts

**User Story:** As a system operator, I want clear service level objectives and alerts so I can maintain system reliability.

#### Acceptance Criteria

1. THE System SHALL maintain availability greater than or equal to 99.9%
2. THE System SHALL maintain p95 cache retrieval latency less than or equal to 10 milliseconds
3. THE System SHALL maintain cache hit rate greater than or equal to 0.90 after warm-up period
4. THE System SHALL export metrics for requests, hits, misses, lock_acquired, lock_contended, refresh_success, refresh_fail, and value_size_bytes histogram
5. THE System SHALL trigger alerts when hit rate drops below 0.90 for 10 minutes, when p95 latency exceeds 10 milliseconds for 10 minutes, or when refresh error rate exceeds 5% for 10 minutes

### Requirement 16: Pre-Warming Refinements

**User Story:** As a system operator, I want efficient pre-warming of common profiles to maximize cache hit rates.

#### Acceptance Criteria

1. THE pre-warming script SHALL accept concurrency parameter N and queries-per-second cap with defaults of N=3 and QPS=1
2. THE pre-warming script SHALL skip cache keys that are already present in Redis
3. THE pre-warming script SHALL log a concise summary including profiles processed, skipped, created, and failed
4. THE pre-warming script SHALL accept analytics-derived CSV or JSON input containing top profiles from rolling 7-day or 30-day windows
5. THE pre-warming script SHALL rate-limit narrative generation to avoid API throttling


## Open Questions

The following questions must be resolved before implementation to ensure cache keys remain stable:

1. **Locale/Language Variation**: Do narratives vary by locale or language? If yes, locale must be included in the cache key.

2. **Model and Temperature**: Do narratives vary by AI model or temperature parameter? If yes, these parameters must be included in the cache key.

3. **Personalization**: Are narratives shared across users with identical profiles, or is per-user personalization required? This affects whether userId should be part of the cache key.

4. **Maximum Narrative Size**: What is the maximum narrative size before compression? A cap should be established (e.g., 64-128 KB) to prevent memory issues.

5. **Multi-Region Deployment**: Will the system run in multiple regions? If yes, a strategy for Redis replication or regionalization must be defined.

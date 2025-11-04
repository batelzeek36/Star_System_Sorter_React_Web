# Implementation Plan

Convert the narrative caching production upgrade design into a series of incremental implementation tasks. Each task builds on previous tasks and ends with integration. Focus ONLY on tasks that involve writing, modifying, or testing code.

- [x] 1. Set up Redis infrastructure and configuration
  - Install ioredis package and type definitions
  - Create Redis connection module with environment configuration
  - Configure connection pooling, timeouts, and retry logic
  - Add REDIS_URL and CACHE_PREFIX to .env.example
  - _Requirements: 1.1, 8.1, 8.2, 8.3, 8.4_

- [x] 1.5 Add comprehensive cache configuration
  - Add STALE_DAYS, TTL_DAYS, CACHE_MAX_VALUE_BYTES, CACHE_COMPRESS_THRESHOLD to .env.example
  - Create config parser with sensible defaults (STALE_DAYS=7, TTL_DAYS=30, MAX_VALUE=131072, COMPRESS_THRESHOLD=65536)
  - Add CACHE_EVICTION_POLICY configuration option
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 1.6 Implement Redis eviction policy validation
  - Choose and document maxmemory-policy (recommend allkeys-lru)
  - Add startup script to assert Redis eviction policy using CONFIG GET
  - Add CONFIG SET capability for non-serverless deployments
  - Log warning if eviction policy doesn't match recommendation
  - _Requirements: 1.1, 8.1_

- [ ] 2. Implement core Redis cache layer
- [x] 2.1 Create redis-cache.ts module with basic operations
  - Implement getCached() function with error handling and timeouts
  - Implement setCached() function with TTL support and compression
  - Implement getCacheStats() function parsing Redis INFO command
  - Add circuit breaker class scoped to Redis operations only
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3_

- [ ] 2.2 Implement value schema and metadata handling
  - Create CachedNarrative interface with version, engine, prompt_hash, profile, narrative, and meta fields
  - Implement createCachedNarrative() helper to construct values with metadata
  - Add gzip compression for values >64KB with compression flag
  - Implement decompression logic in getCached()
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 2.3 Implement pattern-based deletion using SCAN
  - Create deleteByPattern() function using SCAN with MATCH
  - Ensure SCAN MATCH uses CACHE_PREFIX to avoid scanning entire keyspace
  - Process deletions in batches of 1000 keys
  - Add pipeline for efficient DEL operations
  - _Requirements: 9.3, 9.4, 9.5_

- [ ] 2.4 Write unit tests for redis-cache module
  - Test connection handling (success, failure, timeout)
  - Test value serialization with compression
  - Test values just under and over compression threshold (64KB)
  - Test compression flag round-trips correctly
  - Test pattern deletion with SCAN
  - Test circuit breaker scoped to Redis operations only (not model generation)
  - _Requirements: 1.1, 1.2, 1.3, 12.1, 12.2, 12.3_

- [ ] 3. Enhance cache key generation
- [x] 3.1 Update cache-utils.ts with versioning and namespacing
  - Update generateCacheKey() to include keyPrefix from env
  - Use 10-character lowercase prompt hash
  - Implement key format: narr:v${MAJOR}:${engineVersion}:${promptHash}:${profileHash}
  - Add generateLockKey() helper function
  - Add generateRefreshKey() helper function
  - _Requirements: 7.1, 7.2, 7.5, 11.1, 11.3, 11.4_

- [x] 3.2 Implement profile normalization and quantization
  - Sort all object keys alphabetically
  - Quantize percentages to 0.5% buckets
  - Remove undefined/null values
  - Generate deterministic SHA-1 hash
  - _Requirements: 7.3, 7.5, 11.2_

- [ ] 3.3 Write unit tests for cache key generation
  - Test key determinism (same input → same key)
  - Test normalization (sorting, quantization)
  - Test version bumping invalidates keys
  - Test keyPrefix isolation
  - _Requirements: 7.5, 11.4, 11.5_

- [ ] 3.3.1 Add key migration and collision tests
  - Test that old engineVersion/promptHash produce different keys
  - Test that different prompt hashes generate different keys
  - Test that lookups with old version don't return new version entries
  - Test 10-character prompt hash collision resistance
  - _Requirements: 7.4, 11.1_

- [ ] 4. Implement stampede protection with tokened locks
- [ ] 4.1 Create withStampedeProtection() function
  - Acquire Redis lock with unique token using SET NX EX
  - Implement exponential backoff with jitter (100ms-1000ms)
  - Add overall wait cap of 5 seconds
  - Generate narrative if lock acquired
  - _Requirements: 2.1, 2.3, 2.4_

- [ ] 4.2 Implement safe lock release with Lua script
  - Create safeUnlock() function using Lua script
  - Verify token matches before deleting lock
  - Handle lock expiration gracefully
  - _Requirements: 2.2, 2.4, 2.5_

- [ ] 4.2.1 Optimize Lua script performance
  - Preload Lua unlock script using SCRIPT LOAD at startup
  - Call via EVALSHA instead of EVAL to reduce latency under load
  - Add fallback to EVAL if EVALSHA returns NOSCRIPT error
  - _Requirements: 2.2, 2.4_

- [ ] 4.3 Write unit tests for stampede protection
  - Test lock acquisition and release
  - Test concurrent request handling
  - Test exponential backoff behavior
  - Test fallback when lock unavailable
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Implement stale-while-revalidate strategy
- [ ] 5.1 Create withStaleWhileRevalidate() function
  - Check cache and determine if stale (>7 days old)
  - Serve stale content immediately if present
  - Acquire refresh lock to prevent duplicate refreshes
  - Trigger background refresh with retry logic
  - _Requirements: 5.1, 5.2, 13.1, 13.2_

- [ ] 5.1.1 Add SWR refresh lock to prevent stampede
  - Acquire refresh:<key> lock with SET NX EX 30 before starting refresh
  - Skip refresh if lock cannot be acquired (another worker is refreshing)
  - Test that concurrent stale hits result in exactly one refresh
  - _Requirements: 5.2, 13.2_

- [ ] 5.2 Implement background refresh with retry
  - Use withRetry() helper with 3 attempts
  - Add 10-second timeout per attempt
  - Update refreshed_at and stale_after on success
  - Keep stale value on failure
  - _Requirements: 5.3, 5.4, 13.3, 13.4, 13.5_

- [ ] 5.2.1 Ensure SWR metadata correctness on refresh
  - Set refreshed_at = Date.now() on successful refresh
  - Set stale_after = refreshed_at + (STALE_DAYS * 24 * 60 * 60 * 1000)
  - Test that stale_after is recomputed correctly after refresh
  - _Requirements: 13.5_

- [ ] 5.3 Write unit tests for SWR behavior
  - Test fresh cache returns immediately
  - Test stale cache triggers background refresh
  - Test refresh lock prevents duplicate refreshes
  - Test stale_after updates on refresh
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 6. Implement negative caching
- [ ] 6.1 Create negative cache functions
  - Implement cacheNegativeResult() with 15-minute TTL
  - Implement getNegativeCacheEntry() to check for cached errors
  - Use neg: prefix for negative cache keys
  - Store error message and timestamp
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6.2 Integrate negative caching into narrative service
  - Check negative cache before generating narrative
  - Cache validation errors for 15 minutes
  - Return cached error immediately if present
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6.3 Write tests for negative cache in service path
  - Test that invalid profile triggers 15-minute negative cache
  - Test that negative cache hit prevents model calls
  - Test concurrent requests for invalid profile (stampede prevention)
  - Test negative cache expiration after TTL
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. Update narrative service integration
- [x] 7.1 Modify narrative.ts to use Redis cache
  - Update getNarrative() to use withStaleWhileRevalidate() as outer wrapper
  - Wrap stampede protection inside the SWR miss/refresh path (not at top level)
  - Add negative cache check before SWR
  - Maintain fallback to template on errors
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 4.4_

- [x] 7.2 Update narrative route to use new cache layer
  - Generate cache key with current engine version and prompt hash
  - Call updated getNarrative() function
  - Handle errors gracefully with fallback
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 7.3 Write integration tests for narrative service
  - Test end-to-end cache flow
  - Test concurrent request handling
  - Test background refresh behavior
  - Test fallback to direct generation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 8. Implement admin API endpoints

- [ ] 8.0 Create shared admin middleware
  - Implement requireAdmin() middleware with JWT or role-based authentication
  - Implement rateLimit() middleware (10 req/sec, burst 20)
  - Add IP logging for all admin requests
  - Write unit tests for unauthorized (401), non-admin (403), and over-limit (429) responses
  - _Requirements: 14.1, 14.2, 14.3_
- [ ] 8.1 Create GET /api/narrative/stats endpoint
  - Use requireAdmin() and rateLimit() middleware
  - Return cache statistics (keys, memory, hit rate)
  - Return engine version and prompt hash ONLY to authenticated admins
  - Test that prompt hash is not exposed in public endpoints
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 14.1, 14.2, 14.3, 14.4_

- [ ] 8.2 Create GET /api/narrative/analytics endpoint
  - Use requireAdmin() and rateLimit() middleware
  - Return detailed analytics (requests, hits, misses, top systems)
  - Calculate estimated costs
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 14.1, 14.2, 14.3_

- [ ] 8.3 Create DELETE /api/narrative/user/:userId endpoint
  - Use requireAdmin() and rateLimit() middleware
  - Delete analytics rows containing userId
  - Return deletion count and rationale
  - Complete within 5 seconds
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 14.1, 14.2_

- [ ] 8.5 Implement analytics storage sink
  - Create minimal schema or log file for analytics data
  - Store requests, hits, misses, duration_ms for each request
  - Add retention policy (e.g., 90 days)
  - Implement write path in narrative service
  - Write tests for counter increments and duration tracking
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 8.4 Write tests for admin endpoints
  - Test authentication requirements (401 for unauthorized)
  - Test authorization (403 for non-admin)
  - Test rate limiting behavior (429 for over-limit)
  - Test response formats
  - Test error handling
  - Test that prompt hash is only returned to admins
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 10.1, 10.2, 10.3, 10.4, 10.5, 14.1, 14.2, 14.3, 14.4_

- [ ] 9. Implement metrics and observability
- [ ] 9.1 Add metrics collection to cache operations
  - Track cache_hit_fresh, cache_hit_stale, cache_miss counters
  - Track lock_acquired, lock_contended counters
  - Track refresh_started, refresh_skipped_locked, refresh_success, refresh_fail counters
  - Add value_size_bytes histogram
  - Add locks_in_flight gauge
  - _Requirements: 15.4_

- [ ] 9.2 Implement SLO monitoring
  - Track availability (target ≥99.9%)
  - Track p95 latency (target ≤10ms)
  - Track hit rate (target ≥90% after warm-up)
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 9.3 Configure alerts
  - Alert when hit rate <90% for 10 minutes
  - Alert when p95 latency >10ms for 10 minutes
  - Alert when refresh error rate >5% for 10 minutes
  - _Requirements: 15.5_

- [ ] 9.4 Create load test scripts
  - Add k6 or Artillery scenario for 100 concurrent requests with same cache key (stampede test)
  - Add scenario for 1000 requests with distinct cache keys (throughput test)
  - Assert p95 latency ≤ 10ms for cache hits
  - Assert stampede convergence (only 1 API call for 100 concurrent requests)
  - Check load test scripts into repository for CI integration
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 10. Create pre-warming script
- [ ] 10.1 Implement prewarm-cache.ts script
  - Accept concurrency parameter N (default 3)
  - Accept QPS cap (default 1)
  - Accept CSV/JSON input of top profiles
  - Skip keys already present in Redis
  - _Requirements: 6.1, 6.2, 16.1, 16.2, 16.4_

- [ ] 10.2 Add progress logging and error handling
  - Log profiles processed, skipped, created, failed
  - Rate-limit generation to avoid API throttling
  - Handle errors gracefully and continue
  - _Requirements: 6.4, 16.3, 16.5_

- [ ] 10.3 Test pre-warming script
  - Test with sample profile list
  - Verify rate limiting
  - Verify skip logic for existing keys
  - Verify error handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 11. Add feature flags and configuration
- [x] 11.1 Create feature flag system
  - Add ENABLE_REDIS_CACHE flag (default false)
  - Add ENABLE_SWR flag (default false)
  - Add ENABLE_STAMPEDE_PROTECTION flag (default false)
  - Add ENABLE_NEGATIVE_CACHE flag (default false)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 11.2 Update environment configuration
  - Document all Redis-related env vars in .env.example
  - Add CACHE_PREFIX for multi-tenant isolation
  - Add ENGINE_VERSION and PROMPT_HASH
  - Add feature flag defaults
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12. Documentation and deployment preparation
- [ ] 12.1 Create deployment guide
  - Document Redis setup (Upstash, Redis Cloud, self-hosted)
  - Document environment variable configuration
  - Document feature flag rollout strategy
  - Document rollback procedures
  - _Requirements: 1.1, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12.2 Create monitoring dashboard
  - Set up cache performance dashboard
  - Set up cost dashboard
  - Configure alert rules
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 12.3 Create migration checklist
  - Pre-migration verification steps
  - Gradual rollout plan (10% → 50% → 100%)
  - Post-migration validation
  - Rollback triggers and procedures
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


## Implementation Notes

### Critical Additions Based on Production Review

The following enhancements were added to ensure production-readiness:

**Infrastructure & Configuration (Tasks 1.5, 1.6):**
- Comprehensive cache configuration with sensible defaults
- Redis eviction policy validation at startup
- Environment-based configuration for all cache parameters

**Security & Access Control (Task 8.0):**
- Shared admin middleware for authentication and authorization
- Rate limiting middleware to prevent abuse
- IP logging for audit trails
- Prompt hash protection (admin-only access)

**Performance Optimizations:**
- Lua script preloading with EVALSHA (Task 4.2.1)
- SWR refresh lock to prevent duplicate background refreshes (Task 5.1.1)
- SCAN with CACHE_PREFIX to avoid full keyspace scans (Task 2.3)

**Data Integrity:**
- SWR metadata correctness on refresh (Task 5.2.1)
- Key migration tests for version changes (Task 3.3.1)
- Compression threshold testing (Task 2.4)

**Observability & Testing:**
- Analytics storage sink with retention (Task 8.5)
- Load test scripts for stampede and throughput (Task 9.4)
- Negative cache concurrency tests (Task 6.3)

**Architecture Clarifications:**
- SWR as outer wrapper, stampede protection inside miss/refresh path (Task 7.1)
- Circuit breaker scoped to Redis operations only (Task 2.4)
- Proper wrapping order to avoid double-wrapping

### Execution Order

Follow the task sequence as written. Each major task builds on previous tasks:
1. Infrastructure setup (Tasks 1.x)
2. Core cache layer (Tasks 2.x)
3. Key generation (Tasks 3.x)
4. Stampede protection (Tasks 4.x)
5. SWR implementation (Tasks 5.x)
6. Negative caching (Tasks 6.x)
7. Service integration (Tasks 7.x)
8. Admin APIs (Tasks 8.x)
9. Observability (Tasks 9.x)
10. Pre-warming (Tasks 10.x)
11. Feature flags (Tasks 11.x)
12. Documentation (Tasks 12.x)

### Testing Strategy

All tasks include comprehensive testing:
- Unit tests for each module
- Integration tests for service paths
- Load tests for performance validation
- Security tests for admin endpoints
- Concurrency tests for stampede scenarios

### Success Criteria

Implementation is complete when:
- All 12 major tasks and 45+ sub-tasks are completed
- All tests pass (unit, integration, load)
- Cache hit rate ≥90% after warm-up
- p95 latency ≤10ms for cache hits
- Admin endpoints require authentication
- Stampede protection prevents duplicate API calls
- SWR serves stale content and refreshes in background
- Graceful fallback when Redis unavailable

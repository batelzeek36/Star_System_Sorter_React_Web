/**
 * Production-grade cache utilities
 * Based on GPT-5 recommendations for bulletproof caching
 */

import crypto from 'crypto';

/**
 * Stable JSON stringification (sorted keys)
 */
function stableStringify(obj: any): string {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(',')}]`;
  
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);
  return `{${pairs.join(',')}}`;
}

/**
 * Quantize percentage to reduce cache key explosion
 * 32.47% and 32.51% both become 32.5% (0.5% buckets)
 */
function quantize(value: number, step: number = 0.5): number {
  return Math.round(value / step) * step;
}

/**
 * Extract major version from engine version string
 * "narrative@1.2.3" -> "1"
 */
function extractMajorVersion(engineVersion: string): string {
  const match = engineVersion.match(/@(\d+)\./);
  return match ? match[1] : '1';
}

/**
 * Generate canonical cache key with versioning and namespacing
 * 
 * Key format: narr:v${MAJOR}:${engineVersion}:${promptHash}:${profileHash}
 * Example: narr:v1:narrative@1.0.0:a3f2c1b9d8:8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
 * 
 * Features:
 * - Namespace prefix (keyPrefix from env, default "narr")
 * - Major version for breaking changes
 * - Engine version for minor/patch changes
 * - 10-character lowercase prompt hash
 * - Normalized profile hash (sorted keys, quantized percentages)
 * - Deterministic (same input = same key)
 */
export function generateCacheKey(
  profile: {
    classification: string;
    primary?: string;
    hybrid?: [string, string];
    percentages: Record<string, number>;
    hdData: {
      type: string;
      authority: string;
      profile: string;
      centers: string[];
      gates: number[];
    };
  },
  options: {
    engineVersion: string;      // e.g. "narrative@1.0.0"
    promptHash: string;          // sha1 of system+user prompts (10 chars lowercase)
    keyPrefix?: string;          // namespace prefix (default "narr")
    quantizeStep?: number;       // percentage bucket size (default 0.5)
  }
): string {
  const { 
    engineVersion, 
    promptHash, 
    keyPrefix = 'narr',
    quantizeStep = 0.5 
  } = options;
  
  // Extract major version
  const majorVersion = extractMajorVersion(engineVersion);
  
  // Normalize percentages (quantize + sort)
  const normalizedPercentages = Object.fromEntries(
    Object.entries(profile.percentages)
      .map(([system, pct]) => [system, quantize(pct, quantizeStep)] as [string, number])
      .sort(([a], [b]) => (a as string).localeCompare(b as string))
  );
  
  // Normalize HD data (sort arrays, remove undefined/null)
  const normalizedHD = {
    type: profile.hdData.type,
    authority: profile.hdData.authority,
    profile: profile.hdData.profile,
    centers: [...profile.hdData.centers].sort(),
    gateCount: profile.hdData.gates.length, // Use count, not full array
  };
  
  // Build canonical object (sorted keys, no undefined/null)
  const canonical: Record<string, any> = {
    classification: profile.classification,
    percentages: normalizedPercentages,
    hdData: normalizedHD,
  };
  
  // Add optional fields only if defined
  if (profile.primary) {
    canonical.primary = profile.primary;
  }
  if (profile.hybrid) {
    canonical.hybrid = profile.hybrid;
  }
  
  // Generate profile hash
  const profileHash = crypto
    .createHash('sha1')
    .update(stableStringify(canonical))
    .digest('hex');
  
  // Ensure prompt hash is lowercase and 10 characters
  const normalizedPromptHash = promptHash.toLowerCase().substring(0, 10);
  
  // Build key: narr:v1:narrative@1.0.0:a3f2c1b9d8:8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
  return `${keyPrefix}:v${majorVersion}:${engineVersion}:${normalizedPromptHash}:${profileHash}`;
}

/**
 * Generate lock key for stampede protection
 * 
 * Lock keys are used to prevent multiple concurrent requests from generating
 * the same narrative. Format: lock:<cacheKey>
 */
export function generateLockKey(cacheKey: string): string {
  return `lock:${cacheKey}`;
}

/**
 * Generate refresh key for SWR background refresh coordination
 * 
 * Refresh keys are used to prevent multiple workers from refreshing the same
 * stale content simultaneously. Format: refresh:<cacheKey>
 */
export function generateRefreshKey(cacheKey: string): string {
  return `refresh:${cacheKey}`;
}

/**
 * Compute hash of prompt text (for cache invalidation)
 * Returns 10-character lowercase hex string
 */
export function hashPrompt(systemPrompt: string, userPromptTemplate: string): string {
  const combined = `${systemPrompt}\n---\n${userPromptTemplate}`;
  return crypto
    .createHash('sha1')
    .update(combined)
    .digest('hex')
    .toLowerCase()
    .substring(0, 10);
}

/**
 * Get current engine version from package.json
 */
export function getEngineVersion(): string {
  // In production, read from package.json
  // For now, hardcode
  return 'narrative@1.0.0';
}

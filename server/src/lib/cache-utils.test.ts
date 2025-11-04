/**
 * Tests for cache-utils.ts
 * Verifies key generation, normalization, and helper functions
 */

import { describe, it, expect } from 'vitest';
import { 
  generateCacheKey, 
  generateLockKey, 
  generateRefreshKey,
  hashPrompt 
} from './cache-utils.js';

describe('generateCacheKey', () => {
  const mockProfile = {
    classification: 'primary' as const,
    primary: 'Pleiades',
    percentages: {
      Pleiades: 42.3,
      Sirius: 18.7,
      Arcturus: 15.2,
    },
    hdData: {
      type: 'Generator',
      authority: 'Sacral',
      profile: '3/5',
      centers: ['Sacral', 'Root', 'Spleen'],
      gates: [1, 2, 3, 4, 5],
    },
  };

  it('generates key with correct format', () => {
    const key = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    // Should match format: narr:v1:narrative@1.0.0:a3f2c1b9d8:<hash>
    expect(key).toMatch(/^narr:v1:narrative@1\.0\.0:a3f2c1b9d8:[a-f0-9]{40}$/);
  });

  it('uses custom keyPrefix when provided', () => {
    const key = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
      keyPrefix: 'test',
    });

    expect(key).toMatch(/^test:v1:narrative@1\.0\.0:a3f2c1b9d8:[a-f0-9]{40}$/);
  });

  it('normalizes prompt hash to lowercase and 10 characters', () => {
    const key = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'ABCDEF1234567890', // 16 chars, uppercase
    });

    // Should be truncated to 10 chars and lowercased
    expect(key).toMatch(/^narr:v1:narrative@1\.0\.0:abcdef1234:[a-f0-9]{40}$/);
  });

  it('generates same key for same input (deterministic)', () => {
    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key1 = generateCacheKey(mockProfile, options);
    const key2 = generateCacheKey(mockProfile, options);

    expect(key1).toBe(key2);
  });

  it('generates different keys for different percentages', () => {
    const profile1 = { ...mockProfile };
    const profile2 = {
      ...mockProfile,
      percentages: {
        Pleiades: 50.0,
        Sirius: 20.0,
        Arcturus: 10.0,
      },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key1 = generateCacheKey(profile1, options);
    const key2 = generateCacheKey(profile2, options);

    expect(key1).not.toBe(key2);
  });

  it('quantizes percentages to 0.5% buckets by default', () => {
    const profile1 = {
      ...mockProfile,
      percentages: { Pleiades: 42.3, Sirius: 18.7 },
    };
    const profile2 = {
      ...mockProfile,
      percentages: { Pleiades: 42.4, Sirius: 18.6 },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key1 = generateCacheKey(profile1, options);
    const key2 = generateCacheKey(profile2, options);

    // Both should quantize to 42.5 and 18.5
    expect(key1).toBe(key2);
  });

  it('generates different keys when engine version changes', () => {
    const key1 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    const key2 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@2.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    expect(key1).not.toBe(key2);
  });

  it('generates different keys when prompt hash changes', () => {
    const key1 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    const key2 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'b4e3d2c1a0',
    });

    expect(key1).not.toBe(key2);
  });

  it('extracts major version correctly', () => {
    const key1 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@1.5.3',
      promptHash: 'a3f2c1b9d8',
    });

    const key2 = generateCacheKey(mockProfile, {
      engineVersion: 'narrative@2.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    expect(key1).toMatch(/^narr:v1:/);
    expect(key2).toMatch(/^narr:v2:/);
  });

  it('handles profiles without optional fields', () => {
    const minimalProfile = {
      classification: 'unresolved' as const,
      percentages: {
        Pleiades: 25.0,
        Sirius: 25.0,
        Arcturus: 25.0,
        Lyra: 25.0,
      },
      hdData: {
        type: 'Projector',
        authority: 'Emotional',
        profile: '1/3',
        centers: ['Throat'],
        gates: [10, 20],
      },
    };

    const key = generateCacheKey(minimalProfile, {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    });

    expect(key).toMatch(/^narr:v1:narrative@1\.0\.0:a3f2c1b9d8:[a-f0-9]{40}$/);
  });
});

describe('generateLockKey', () => {
  it('generates lock key with correct prefix', () => {
    const cacheKey = 'narr:v1:narrative@1.0.0:a3f2c1b9d8:abc123';
    const lockKey = generateLockKey(cacheKey);

    expect(lockKey).toBe('lock:narr:v1:narrative@1.0.0:a3f2c1b9d8:abc123');
  });
});

describe('generateRefreshKey', () => {
  it('generates refresh key with correct prefix', () => {
    const cacheKey = 'narr:v1:narrative@1.0.0:a3f2c1b9d8:abc123';
    const refreshKey = generateRefreshKey(cacheKey);

    expect(refreshKey).toBe('refresh:narr:v1:narrative@1.0.0:a3f2c1b9d8:abc123');
  });
});

describe('hashPrompt', () => {
  it('generates 10-character lowercase hex hash', () => {
    const hash = hashPrompt('system prompt', 'user prompt template');

    expect(hash).toMatch(/^[a-f0-9]{10}$/);
    expect(hash.length).toBe(10);
  });

  it('generates same hash for same input', () => {
    const hash1 = hashPrompt('system prompt', 'user prompt template');
    const hash2 = hashPrompt('system prompt', 'user prompt template');

    expect(hash1).toBe(hash2);
  });

  it('generates different hash for different input', () => {
    const hash1 = hashPrompt('system prompt 1', 'user prompt template');
    const hash2 = hashPrompt('system prompt 2', 'user prompt template');

    expect(hash1).not.toBe(hash2);
  });
});

describe('Profile Normalization (Task 3.2)', () => {
  it('sorts object keys alphabetically', () => {
    // Two profiles with same data but different key order
    const profile1 = {
      classification: 'primary' as const,
      primary: 'Pleiades',
      percentages: {
        Sirius: 20.0,
        Pleiades: 40.0,
        Arcturus: 15.0,
      },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Spleen', 'Root', 'Sacral'],
        gates: [1, 2, 3],
      },
    };

    const profile2 = {
      classification: 'primary' as const,
      primary: 'Pleiades',
      percentages: {
        Arcturus: 15.0,
        Pleiades: 40.0,
        Sirius: 20.0,
      },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Root', 'Sacral', 'Spleen'],
        gates: [1, 2, 3],
      },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key1 = generateCacheKey(profile1, options);
    const key2 = generateCacheKey(profile2, options);

    // Should generate same key despite different input order
    expect(key1).toBe(key2);
  });

  it('quantizes percentages to 0.5% buckets', () => {
    const testCases = [
      { input: 42.24, expected: 42.0 },
      { input: 42.25, expected: 42.5 },
      { input: 42.49, expected: 42.5 },
      { input: 42.50, expected: 42.5 },
      { input: 42.74, expected: 42.5 },
      { input: 42.75, expected: 43.0 },
    ];

    testCases.forEach(({ input, expected }) => {
      const profile1 = {
        classification: 'primary' as const,
        primary: 'Pleiades',
        percentages: { Pleiades: input },
        hdData: {
          type: 'Generator',
          authority: 'Sacral',
          profile: '3/5',
          centers: ['Sacral'],
          gates: [1],
        },
      };

      const profile2 = {
        classification: 'primary' as const,
        primary: 'Pleiades',
        percentages: { Pleiades: expected },
        hdData: {
          type: 'Generator',
          authority: 'Sacral',
          profile: '3/5',
          centers: ['Sacral'],
          gates: [1],
        },
      };

      const options = {
        engineVersion: 'narrative@1.0.0',
        promptHash: 'a3f2c1b9d8',
      };

      const key1 = generateCacheKey(profile1, options);
      const key2 = generateCacheKey(profile2, options);

      expect(key1).toBe(key2);
    });
  });

  it('removes undefined/null values', () => {
    const profileWithOptional = {
      classification: 'primary' as const,
      primary: 'Pleiades',
      percentages: { Pleiades: 40.0 },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        gates: [1],
      },
    };

    const profileWithoutOptional = {
      classification: 'primary' as const,
      percentages: { Pleiades: 40.0 },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        gates: [1],
      },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key1 = generateCacheKey(profileWithOptional, options);
    const key2 = generateCacheKey(profileWithoutOptional, options);

    // Should generate different keys because primary field is present vs absent
    expect(key1).not.toBe(key2);
  });

  it('generates deterministic SHA-1 hash', () => {
    const profile = {
      classification: 'primary' as const,
      primary: 'Pleiades',
      percentages: { Pleiades: 42.3, Sirius: 18.7 },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral', 'Root'],
        gates: [1, 2, 3],
      },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    // Generate key multiple times
    const keys = Array.from({ length: 10 }, () => 
      generateCacheKey(profile, options)
    );

    // All keys should be identical
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(1);

    // Key should contain a valid SHA-1 hash (40 hex chars)
    const key = keys[0];
    const hashPart = key.split(':').pop();
    expect(hashPart).toMatch(/^[a-f0-9]{40}$/);
  });

  it('handles hybrid classification correctly', () => {
    const profile = {
      classification: 'hybrid' as const,
      hybrid: ['Pleiades', 'Sirius'] as [string, string],
      percentages: { Pleiades: 35.0, Sirius: 33.0 },
      hdData: {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        gates: [1],
      },
    };

    const options = {
      engineVersion: 'narrative@1.0.0',
      promptHash: 'a3f2c1b9d8',
    };

    const key = generateCacheKey(profile, options);
    expect(key).toMatch(/^narr:v1:narrative@1\.0\.0:a3f2c1b9d8:[a-f0-9]{40}$/);
  });
});

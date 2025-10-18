/**
 * Lore Version Check Hook Tests
 * 
 * Tests for detecting lore rules_hash mismatches
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLoreVersionCheck } from './useLoreVersionCheck';
import { useBirthDataStore } from '../store/birthDataStore';
import { loreBundle } from '../lib/lore.bundle';
import type { ClassificationResult } from '../lib/schemas';

describe('useLoreVersionCheck', () => {
  beforeEach(() => {
    // Clear store before each test
    useBirthDataStore.getState().clear();
  });

  it('should return hasChanged: false when no classification exists', () => {
    const { result } = renderHook(() => useLoreVersionCheck());

    expect(result.current.hasChanged).toBe(false);
    expect(result.current.currentRulesHash).toBe(loreBundle.rules_hash);
    expect(result.current.currentVersion).toBe(loreBundle.lore_version);
    expect(result.current.persistedRulesHash).toBeNull();
  });

  it('should return hasChanged: false when rules_hash matches', () => {
    const mockClassification: ClassificationResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: {},
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
        rules_hash: loreBundle.rules_hash, // Same as current
      },
    };

    useBirthDataStore.getState().setClassification(mockClassification);

    const { result } = renderHook(() => useLoreVersionCheck());

    expect(result.current.hasChanged).toBe(false);
    expect(result.current.currentRulesHash).toBe(loreBundle.rules_hash);
    expect(result.current.persistedRulesHash).toBe(loreBundle.rules_hash);
  });

  it('should return hasChanged: true when rules_hash differs', () => {
    const oldRulesHash = 'old_hash_12345';
    
    const mockClassification: ClassificationResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: {},
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
        rules_hash: oldRulesHash, // Different from current
      },
    };

    useBirthDataStore.getState().setClassification(mockClassification);

    const { result } = renderHook(() => useLoreVersionCheck());

    expect(result.current.hasChanged).toBe(true);
    expect(result.current.currentRulesHash).toBe(loreBundle.rules_hash);
    expect(result.current.persistedRulesHash).toBe(oldRulesHash);
  });

  it('should return hasChanged: false when persistedRulesHash is null', () => {
    const mockClassification: ClassificationResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: {},
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
        // No rules_hash in meta
      },
    };

    useBirthDataStore.getState().setClassification(mockClassification);

    const { result } = renderHook(() => useLoreVersionCheck());

    expect(result.current.hasChanged).toBe(false);
    expect(result.current.persistedRulesHash).toBeNull();
  });
});

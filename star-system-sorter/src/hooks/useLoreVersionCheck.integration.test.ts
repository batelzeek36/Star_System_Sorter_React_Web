/**
 * Integration Test for Lore Version Check
 * 
 * Tests the complete flow of rules_hash persistence and detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLoreVersionCheck } from './useLoreVersionCheck';
import { useClassification } from './useClassification';
import { useBirthDataStore } from '../store/birthDataStore';
import { loreBundle } from '../lib/lore.bundle';
import type { HDExtract } from '../lib/schemas';

describe('Lore Version Check Integration', () => {
  beforeEach(() => {
    // Clear store before each test
    useBirthDataStore.getState().clear();
  });

  it('should persist rules_hash when classification is computed', async () => {
    const mockHDData: HDExtract = {
      type: 'Manifesting Generator',
      authority: 'Sacral',
      profile: '3/5',
      centers: ['Sacral', 'Root'],
      channels: [34, 20],
      gates: [1, 2, 3, 34, 20],
    };

    // Compute classification
    const { result: classificationResult } = renderHook(() => useClassification());
    
    await classificationResult.current.classify(mockHDData);

    // Wait for classification to complete
    await waitFor(() => {
      expect(classificationResult.current.result).not.toBeNull();
    });

    // Check that rules_hash was persisted
    const state = useBirthDataStore.getState();
    expect(state.persistedRulesHash).toBe(loreBundle.rules_hash);
    expect(state.classification?.meta.rules_hash).toBe(loreBundle.rules_hash);

    // Check lore version status
    const { result: versionResult } = renderHook(() => useLoreVersionCheck());
    expect(versionResult.current.hasChanged).toBe(false);
    expect(versionResult.current.persistedRulesHash).toBe(loreBundle.rules_hash);
  });

  it('should detect mismatch when rules_hash changes', async () => {
    // Simulate old classification with different rules_hash
    const oldRulesHash = 'old_hash_xyz';
    
    useBirthDataStore.getState().setClassification({
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: { Pleiades: 100 },
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
        rules_hash: oldRulesHash,
      },
    });

    // Check that mismatch is detected
    const { result } = renderHook(() => useLoreVersionCheck());
    
    expect(result.current.hasChanged).toBe(true);
    expect(result.current.persistedRulesHash).toBe(oldRulesHash);
    expect(result.current.currentRulesHash).toBe(loreBundle.rules_hash);
    expect(result.current.currentRulesHash).not.toBe(oldRulesHash);
  });
});

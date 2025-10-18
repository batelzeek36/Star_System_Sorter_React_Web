/**
 * Lore Version Check Hook
 * 
 * Detects when the persisted classification was computed with a different
 * version of the lore rules than the current lore bundle.
 */

import { useMemo } from 'react';
import { loreBundle } from '@/lib/lore.bundle';
import { useBirthDataStore } from '@/store/birthDataStore';

export interface LoreVersionStatus {
  /** Whether the lore rules have changed since classification */
  hasChanged: boolean;
  /** Current lore version */
  currentVersion: string;
  /** Current rules hash */
  currentRulesHash: string;
  /** Persisted rules hash (from last classification) */
  persistedRulesHash: string | null;
}

/**
 * Check if the lore rules have changed since the last classification
 * 
 * @returns Status object indicating if recomputation is needed
 */
export function useLoreVersionCheck(): LoreVersionStatus {
  const persistedRulesHash = useBirthDataStore((state) => state.persistedRulesHash);
  const classification = useBirthDataStore((state) => state.classification);

  const status = useMemo(() => {
    const currentRulesHash = loreBundle.rules_hash;
    const currentVersion = loreBundle.lore_version;

    // If no classification exists, no mismatch
    if (!classification) {
      return {
        hasChanged: false,
        currentVersion,
        currentRulesHash,
        persistedRulesHash: null,
      };
    }

    // Check if rules_hash has changed
    const hasChanged = persistedRulesHash !== null && 
                      persistedRulesHash !== currentRulesHash;

    return {
      hasChanged,
      currentVersion,
      currentRulesHash,
      persistedRulesHash,
    };
  }, [persistedRulesHash, classification]);

  return status;
}

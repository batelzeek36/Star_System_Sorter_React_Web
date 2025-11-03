/**
 * useClassification Hook
 * 
 * Custom hook for computing star system classification from HD data.
 * Integrates with birthDataStore for state management.
 * Includes loading state management with ≥200ms debounce.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useBirthDataStore } from '../store/birthDataStore';
import { computeScoresWithLore, computeScoresWithGateLines, classify } from '../lib/scorer';
import { getCanon } from '../lib/canon';
import { loadGateLineMap } from '../lib/gateline-map';
import type { HDExtract, ClassificationResult } from '../lib/schemas';
import type { GateLineMap } from '../lib/gateline-map';

// ============================================================================
// Types
// ============================================================================

interface UseClassificationReturn {
  result: ClassificationResult | null;
  loading: boolean;
  error: Error | null;
  classify: (hdData: HDExtract) => Promise<void>;
  recompute: (hdData: HDExtract) => Promise<void>;
  isLoading: boolean;
}

// ============================================================================
// Hook Implementation
// ============================================================================

const LOADING_DEBOUNCE_MS = 200;

export function useClassification(): UseClassificationReturn {
  const classification = useBirthDataStore((state) => state.classification);
  const setClassification = useBirthDataStore((state) => state.setClassification);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Track loading debounce timer
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const classifyHDData = useCallback(
    async (hdData: HDExtract) => {
      // Clear any previous error
      setError(null);
      
      // Set loading flag immediately
      isLoadingRef.current = true;
      
      // Debounce loading state to avoid flicker for fast computations
      loadingTimerRef.current = setTimeout(() => {
        if (isLoadingRef.current) {
          setLoading(true);
        }
      }, LOADING_DEBOUNCE_MS);

      try {
        // Load canon data (for backward compatibility)
        const canon = getCanon();
        
        // Try to load gate-line map for comprehensive scoring
        let gateLineMap: GateLineMap | null = null;
        try {
          gateLineMap = await loadGateLineMap();
        } catch (err) {
          console.warn('Gate-line map not available, falling back to lore bundle:', err);
        }
        
        // Compute scores using gate-line data if available, otherwise use lore bundle
        const scores = gateLineMap 
          ? computeScoresWithGateLines(hdData, gateLineMap)
          : computeScoresWithLore(hdData);
        
        // Classify based on scores (pass hdData for input hash computation)
        const result = classify(scores, canon, hdData);
        
        // Store in Zustand store (this will also persist rules_hash)
        setClassification(result);
        
      } catch (err) {
        // Handle errors
        const error = err instanceof Error 
          ? err 
          : new Error('Failed to compute classification');
        
        setError(error);
        throw error;
      } finally {
        // Clear loading state
        isLoadingRef.current = false;
        
        if (loadingTimerRef.current) {
          clearTimeout(loadingTimerRef.current);
          loadingTimerRef.current = null;
        }
        
        setLoading(false);
      }
    },
    [setClassification]
  );

  return {
    result: classification,
    loading,
    error,
    classify: classifyHDData,
    recompute: classifyHDData, // Alias for recomputing with new lore
    isLoading: loading,
  };
}

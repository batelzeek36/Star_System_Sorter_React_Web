/**
 * useClassification Hook
 * 
 * Custom hook for computing star system classification from HD data.
 * Integrates with birthDataStore for state management.
 * Includes loading state management with ≥200ms debounce.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useBirthDataStore } from '../store/birthDataStore';
import { computeScores, classify } from '../lib/scorer';
import { getCanon } from '../lib/canon';
import type { HDExtract, ClassificationResult } from '../lib/schemas';

// ============================================================================
// Types
// ============================================================================

interface UseClassificationReturn {
  result: ClassificationResult | null;
  loading: boolean;
  error: Error | null;
  classify: (hdData: HDExtract) => Promise<void>;
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
        // Load canon data
        const canon = getCanon();
        
        // Compute scores
        const scores = computeScores(hdData, canon);
        
        // Classify based on scores
        const result = classify(scores, canon);
        
        // Store in Zustand store
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
  };
}

/**
 * useHDData Hook
 * 
 * Custom hook for fetching Human Design data from the API.
 * Integrates with birthDataStore for state management.
 * Includes loading state management with ≥200ms debounce.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useBirthDataStore } from '../store/birthDataStore';
import { computeHDExtractWithCache, HDAPIError } from '../api/bodygraph-client';
import type { BirthDataAPIRequest, HDExtract } from '../lib/schemas';

// ============================================================================
// Types
// ============================================================================

interface UseHDDataReturn {
  data: HDExtract | null;
  loading: boolean;
  error: HDAPIError | null;
  fetchHDData: (request: BirthDataAPIRequest) => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

const LOADING_DEBOUNCE_MS = 200;

export function useHDData(): UseHDDataReturn {
  const hdData = useBirthDataStore((state) => state.hdData);
  const setHDData = useBirthDataStore((state) => state.setHDData);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HDAPIError | null>(null);
  
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

  const fetchHDData = useCallback(
    async (request: BirthDataAPIRequest) => {
      // Clear any previous error
      setError(null);
      
      // Set loading flag immediately
      isLoadingRef.current = true;
      
      // Debounce loading state to avoid flicker for fast responses
      loadingTimerRef.current = setTimeout(() => {
        if (isLoadingRef.current) {
          setLoading(true);
        }
      }, LOADING_DEBOUNCE_MS);

      try {
        const data = await computeHDExtractWithCache(request);
        
        // Store in Zustand store
        setHDData(data);
        
      } catch (err) {
        // Handle errors
        if (err instanceof HDAPIError) {
          setError(err);
        } else {
          setError(
            new HDAPIError(
              'UNKNOWN_ERROR',
              'An unexpected error occurred',
              err
            )
          );
        }
        throw err;
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
    [setHDData]
  );

  return {
    data: hdData,
    loading,
    error,
    fetchHDData,
  };
}

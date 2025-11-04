/**
 * useHDData Hook
 * 
 * Custom hook for fetching Human Design data from the API.
 * Integrates with birthDataStore for state management.
 * Includes loading state management with ≥200ms debounce.
 * 
 * Now uses GPT-4o for classification instead of deterministic scoring.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useBirthDataStore } from '../store/birthDataStore';
import { computeHDExtractWithCache, HDAPIError } from '../api/bodygraph-client';
import type { BirthDataAPIRequest, HDExtract } from '../lib/schemas';
import { useGPTClassification } from './useGPTClassification';

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
  const setClassification = useBirthDataStore((state) => state.setClassification);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HDAPIError | null>(null);
  
  // GPT classification hook
  const { classify: classifyWithGPT } = useGPTClassification();
  
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
        // Step 1: Fetch HD data from BodyGraph API
        const data = await computeHDExtractWithCache(request);
        
        // Store HD data in Zustand store
        setHDData(data);
        
        // Step 2: Classify using GPT-4o
        const classification = await classifyWithGPT(data);
        
        if (classification) {
          // Group contributors by system for the "Why" screen
          const contributorsBySystem: Record<string, Array<{ key: string; weight: number; label: string }>> = {};
          
          classification.contributors.forEach(contrib => {
            if (!contributorsBySystem[contrib.system]) {
              contributorsBySystem[contrib.system] = [];
            }
            contributorsBySystem[contrib.system].push({
              key: contrib.placement,
              weight: contrib.weight,
              label: `${contrib.placement}: ${contrib.why}`,
            });
          });
          
          // Convert GPT response to ClassificationResult format
          const classificationResult = {
            classification: classification.classification,
            primary: classification.primary,
            hybrid: classification.hybrid,
            allies: Object.entries(classification.percentages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([system, percentage]) => ({ system, percentage })),
            percentages: classification.percentages,
            contributorsPerSystem: Object.fromEntries(
              Object.entries(contributorsBySystem).map(([system, contribs]) => [
                system,
                contribs.map(c => c.label),
              ])
            ),
            contributorsWithWeights: contributorsBySystem,
            meta: {
              canonVersion: 'gpt-4o',
              canonChecksum: 'gpt-4o-classification',
              gpt_explanation: classification.explanation,
              gpt_reasoning: classification.reasoning,
            },
          };
          
          // Store classification in Zustand store
          setClassification(classificationResult);
        }
        
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
    [setHDData, setClassification, classifyWithGPT]
  );

  return {
    data: hdData,
    loading,
    error,
    fetchHDData,
  };
}

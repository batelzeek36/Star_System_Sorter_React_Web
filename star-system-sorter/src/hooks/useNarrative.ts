/**
 * Hook for fetching personalized star system narratives
 */

import { useState, useEffect, useMemo } from 'react';
import type { ClassificationResult } from '../lib/scorer';
import type { HDExtract } from '../lib/schemas';

export interface NarrativeResponse {
  summary: string;
  cached: boolean;
}

export interface UseNarrativeResult {
  narrative: string | null;
  loading: boolean;
  error: string | null;
  cached: boolean;
}

/**
 * Fetch narrative from API
 */
async function fetchNarrative(
  classification: ClassificationResult,
  hdData: HDExtract,
  bypassCache: boolean = false
): Promise<NarrativeResponse> {
  const response = await fetch('/api/narrative', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(bypassCache && { 'X-Bypass-Cache': 'true' }),
    },
    body: JSON.stringify({
      classification: classification.classification,
      primary: classification.primary,
      hybrid: classification.hybrid,
      percentages: classification.percentages,
      hdData: {
        type: hdData.type,
        authority: hdData.authority,
        profile: hdData.profile,
        centers: hdData.centers,
        gates: hdData.gates,
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch narrative: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Hook to fetch and manage narrative state
 */
export function useNarrative(
  classification: ClassificationResult | null,
  hdData: HDExtract | null,
  forceRefresh: number = 0
): UseNarrativeResult {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  
  // Create stable cache key from classification and hdData
  // This prevents re-fetching when objects are recreated with same values
  const cacheKey = useMemo(() => {
    if (!classification || !hdData) return null;
    
    return JSON.stringify({
      classification: classification.classification,
      primary: classification.primary,
      hybrid: classification.hybrid,
      // Round percentages to 1 decimal to avoid floating point issues
      percentages: Object.fromEntries(
        Object.entries(classification.percentages).map(([k, v]) => [k, Math.round(v * 10) / 10])
      ),
      type: hdData.type,
      authority: hdData.authority,
      profile: hdData.profile,
      centersCount: hdData.centers.length,
      gatesCount: hdData.gates.length,
      forceRefresh, // Include forceRefresh to trigger new generation
    });
  }, [classification, hdData, forceRefresh]);
  
  useEffect(() => {
    if (!cacheKey || !classification || !hdData) {
      setNarrative(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    let cancelled = false;
    
    const loadNarrative = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchNarrative(classification, hdData, forceRefresh > 0);
        
        if (!cancelled) {
          setNarrative(result.summary);
          setCached(result.cached);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load narrative');
          setLoading(false);
        }
      }
    };
    
    loadNarrative();
    
    return () => {
      cancelled = true;
    };
  }, [cacheKey]); // Only depend on the stable cache key, not the full objects
  
  return {
    narrative,
    loading,
    error,
    cached,
  };
}

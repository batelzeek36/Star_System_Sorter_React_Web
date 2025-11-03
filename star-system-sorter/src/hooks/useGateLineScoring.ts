/**
 * Hook for gate-line based scoring
 * 
 * Loads the comprehensive gate.line → star system mappings and provides
 * scoring functionality with line-level granularity.
 */

import { useState, useEffect } from 'react';
import { loadGateLineMap, type GateLineMap } from '../lib/gateline-map';
import { computeScoresWithGateLines, classify, type HDExtract, type ClassificationResult } from '../lib/scorer';

export function useGateLineScoring() {
  const [gateLineMap, setGateLineMap] = useState<GateLineMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGateLineMap()
      .then(map => {
        setGateLineMap(map);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load gate-line map:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const classifyWithGateLines = (extract: HDExtract): ClassificationResult | null => {
    if (!gateLineMap) {
      return null;
    }

    const scores = computeScoresWithGateLines(extract, gateLineMap);
    
    // Create a minimal canon object for the classify function
    const canon = {
      version: gateLineMap._meta?.version || '1.0',
      systems: {},
    };
    
    return classify(scores, canon, extract);
  };

  return {
    gateLineMap,
    loading,
    error,
    classifyWithGateLines,
  };
}

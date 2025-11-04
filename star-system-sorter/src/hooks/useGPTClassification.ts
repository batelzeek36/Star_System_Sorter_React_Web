/**
 * Hook for GPT-4o based classification
 * 
 * Replaces the deterministic scoring algorithm with AI-powered classification.
 */

import { useState } from 'react';
import type { HDExtract } from '../lib/scorer';

export interface GPTClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  percentages: Record<string, number>;
  explanation: string;
  reasoning: string;
}

export function useGPTClassification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = async (hdData: HDExtract): Promise<GPTClassificationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hdData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Classification failed');
      }

      const result = await response.json();
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Classification error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    classify,
    loading,
    error,
  };
}

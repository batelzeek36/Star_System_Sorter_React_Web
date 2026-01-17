/**
 * Comparison Store - Zustand State Management
 *
 * Manages multi-chart comparison state including both charts,
 * comparison results, and generated insights.
 * Persists to localStorage for session continuity.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HDExtract, ClassificationResult } from '../lib/schemas';
import type { ChartComparison } from '../lib/comparison';
import type { Insight } from '../lib/prompts/insight-templates';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Complete chart data for comparison
 * Includes both the HDExtract and ClassificationResult
 */
export interface ChartData {
  hdData: HDExtract;
  classification: ClassificationResult | null;
  name?: string;
  birthDate?: string;
  birthTime?: string;
  location?: string;
}

// ============================================================================
// State Interface
// ============================================================================

export interface ComparisonState {
  // Chart data
  chartA: ChartData | null;
  chartB: ChartData | null;

  // Comparison results
  comparison: ChartComparison | null;

  // Generated insights
  insights: Insight[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  setChartA: (chart: ChartData) => void;
  setChartB: (chart: ChartData) => void;
  setComparison: (comparison: ChartComparison) => void;
  setInsights: (insights: Insight[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChartB: () => void;
  clearComparison: () => void;
  clearInsights: () => void;
  clear: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  chartA: null,
  chartB: null,
  comparison: null,
  insights: [],
  isLoading: false,
  error: null,
};

// ============================================================================
// Store Implementation
// ============================================================================

const STORE_VERSION = 1; // Increment this when data structure changes

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      ...initialState,

      setChartA: (chart) => set({
        chartA: chart,
        // Clear comparison and insights when chart A changes
        comparison: null,
        insights: [],
        error: null,
      }),

      setChartB: (chart) => set({
        chartB: chart,
        // Clear comparison and insights when chart B changes
        comparison: null,
        insights: [],
        error: null,
      }),

      setComparison: (comparison) => set({ comparison }),

      setInsights: (insights) => set({ insights }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearChartB: () => set({
        chartB: null,
        comparison: null,
        insights: [],
        error: null,
      }),

      clearComparison: () => set({
        comparison: null,
        insights: [],
        error: null,
      }),

      clearInsights: () => set({
        insights: [],
        error: null,
      }),

      clear: () => set(initialState),
    }),
    {
      name: 'comparison-storage',
      version: STORE_VERSION,
      migrate: (persistedState: unknown, version: number) => {
        // Clear old data if version mismatch
        if (version < STORE_VERSION) {
          return initialState;
        }
        return persistedState as ComparisonState;
      },
    }
  )
);

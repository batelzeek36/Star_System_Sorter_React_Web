/**
 * Birth Data Store - Zustand State Management
 * 
 * Manages user birth data, HD data, and classification results.
 * Persists to localStorage for session continuity.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HDExtract, ClassificationResult } from '../lib/schemas';

// ============================================================================
// State Interface
// ============================================================================

export interface BirthDataState {
  // Birth data fields
  date: string;
  time: string;
  location: string;
  timeZone: string;
  
  // Computed data
  hdData: HDExtract | null;
  classification: ClassificationResult | null;
  
  // Lore version tracking
  persistedRulesHash: string | null;
  
  // Actions
  setData: (data: {
    date: string;
    time: string;
    location: string;
    timeZone: string;
  }) => void;
  setHDData: (hdData: HDExtract) => void;
  setClassification: (classification: ClassificationResult) => void;
  clear: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  date: '',
  time: '',
  location: '',
  timeZone: '',
  hdData: null,
  classification: null,
  persistedRulesHash: null,
};

// ============================================================================
// Store Implementation
// ============================================================================

const STORE_VERSION = 2; // Increment this when data structure changes

export const useBirthDataStore = create<BirthDataState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setData: (data) => set({
        date: data.date,
        time: data.time,
        location: data.location,
        timeZone: data.timeZone,
      }),
      
      setHDData: (hdData) => set({ hdData }),
      
      setClassification: (classification) => set({
        classification,
        // Persist rules_hash from classification meta
        persistedRulesHash: classification.meta?.rules_hash || null,
      }),
      
      clear: () => set(initialState),
    }),
    {
      name: 'birth-data-storage',
      version: STORE_VERSION,
      migrate: (persistedState: any, version: number) => {
        // Clear old data if version mismatch
        if (version < STORE_VERSION) {
          console.log(`Migrating store from v${version} to v${STORE_VERSION} - clearing old data`);
          return initialState;
        }
        return persistedState;
      },
    }
  )
);

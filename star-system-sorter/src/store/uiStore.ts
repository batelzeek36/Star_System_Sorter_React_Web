/**
 * UI Store - Zustand State Management
 * 
 * Manages user interface preferences for filtering and displaying
 * classification contributors and lore sources.
 * Persists to localStorage for consistent user experience.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// State Interface
// ============================================================================

export interface UIState {
  // Store version for future schema migrations
  version: number;
  
  // Filter preferences
  hideDisputed: boolean;
  minConfidence: 1 | 2 | 3 | 4 | 5;
  
  // Actions
  setHideDisputed: (value: boolean) => void;
  setMinConfidence: (value: 1 | 2 | 3 | 4 | 5) => void;
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  version: 1,
  hideDisputed: true,
  minConfidence: 2 as const,
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setHideDisputed: (value) => set({ hideDisputed: value }),
      
      setMinConfidence: (value) => set({ minConfidence: value }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'ui-preferences-storage',
      version: 1,
    }
  )
);

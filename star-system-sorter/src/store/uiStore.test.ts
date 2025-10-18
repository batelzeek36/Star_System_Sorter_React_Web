/**
 * UI Store Tests
 * 
 * Tests for UI preferences state management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useUIStore.getState().reset();
  });

  it('initializes with default values', () => {
    const state = useUIStore.getState();
    
    expect(state.version).toBe(1);
    expect(state.hideDisputed).toBe(true);
    expect(state.minConfidence).toBe(2);
  });

  it('updates hideDisputed preference', () => {
    const { setHideDisputed } = useUIStore.getState();
    
    setHideDisputed(false);
    expect(useUIStore.getState().hideDisputed).toBe(false);
    
    setHideDisputed(true);
    expect(useUIStore.getState().hideDisputed).toBe(true);
  });

  it('updates minConfidence preference', () => {
    const { setMinConfidence } = useUIStore.getState();
    
    setMinConfidence(5);
    expect(useUIStore.getState().minConfidence).toBe(5);
    
    setMinConfidence(1);
    expect(useUIStore.getState().minConfidence).toBe(1);
    
    setMinConfidence(3);
    expect(useUIStore.getState().minConfidence).toBe(3);
  });

  it('resets to initial state', () => {
    const { setHideDisputed, setMinConfidence, reset } = useUIStore.getState();
    
    // Change values
    setHideDisputed(false);
    setMinConfidence(5);
    
    expect(useUIStore.getState().hideDisputed).toBe(false);
    expect(useUIStore.getState().minConfidence).toBe(5);
    
    // Reset
    reset();
    
    expect(useUIStore.getState().version).toBe(1);
    expect(useUIStore.getState().hideDisputed).toBe(true);
    expect(useUIStore.getState().minConfidence).toBe(2);
  });

  it('maintains version number through updates', () => {
    const { setHideDisputed, setMinConfidence } = useUIStore.getState();
    
    setHideDisputed(false);
    expect(useUIStore.getState().version).toBe(1);
    
    setMinConfidence(4);
    expect(useUIStore.getState().version).toBe(1);
  });
});

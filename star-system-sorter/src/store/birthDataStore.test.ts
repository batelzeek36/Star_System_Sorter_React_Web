/**
 * Birth Data Store Tests
 * 
 * Tests for Zustand store functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useBirthDataStore } from './birthDataStore';
import type { HDExtract, ClassificationResult } from '../lib/schemas';

describe('birthDataStore', () => {
  beforeEach(() => {
    // Clear store before each test
    useBirthDataStore.getState().clear();
  });

  it('should initialize with empty state', () => {
    const state = useBirthDataStore.getState();
    expect(state.date).toBe('');
    expect(state.time).toBe('');
    expect(state.location).toBe('');
    expect(state.timeZone).toBe('');
    expect(state.hdData).toBeNull();
    expect(state.classification).toBeNull();
  });

  it('should set birth data', () => {
    const { setData } = useBirthDataStore.getState();

    setData({
      date: '10/03/1992',
      time: '12:03 AM',
      location: 'Attleboro, MA',
      timeZone: 'America/New_York',
    });

    const state = useBirthDataStore.getState();
    expect(state.date).toBe('10/03/1992');
    expect(state.time).toBe('12:03 AM');
    expect(state.location).toBe('Attleboro, MA');
    expect(state.timeZone).toBe('America/New_York');
  });

  it('should set HD data', () => {
    const { setHDData } = useBirthDataStore.getState();

    const mockHDData: HDExtract = {
      type: 'Manifesting Generator',
      authority: 'Sacral',
      profile: '3/5',
      centers: ['Sacral', 'Root'],
      channels: [34, 20],
      gates: [1, 2, 3],
    };

    setHDData(mockHDData);

    const state = useBirthDataStore.getState();
    expect(state.hdData).toEqual(mockHDData);
  });

  it('should set classification', () => {
    const { setClassification } = useBirthDataStore.getState();

    const mockClassification: ClassificationResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [
        { system: 'Sirius', percentage: 15.5 },
        { system: 'Lyra', percentage: 12.3 },
      ],
      percentages: {
        Pleiades: 25.8,
        Sirius: 15.5,
        Lyra: 12.3,
      },
      contributorsPerSystem: {
        Pleiades: ['Type: Manifesting Generator', 'Gate: 34'],
      },
      contributorsWithWeights: {
        Pleiades: [
          { key: 'type:manifesting-generator', weight: 10, label: 'Type: Manifesting Generator' },
          { key: 'gate:34', weight: 5, label: 'Gate: 34' },
        ],
      },
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
      },
    };

    setClassification(mockClassification);

    const state = useBirthDataStore.getState();
    expect(state.classification).toEqual(mockClassification);
  });

  it('should clear all data', () => {
    const { setData, setHDData, setClassification, clear } = useBirthDataStore.getState();

    // Set some data
    setData({
      date: '10/03/1992',
      time: '12:03 AM',
      location: 'Attleboro, MA',
      timeZone: 'America/New_York',
    });

    const mockHDData: HDExtract = {
      type: 'Manifesting Generator',
      authority: 'Sacral',
      profile: '3/5',
      centers: ['Sacral'],
      channels: [34],
      gates: [1],
    };
    setHDData(mockHDData);

    const mockClassification: ClassificationResult = {
      classification: 'primary',
      primary: 'Pleiades',
      allies: [],
      percentages: {},
      contributorsPerSystem: {},
      contributorsWithWeights: {},
      meta: {
        canonVersion: '1.0.0',
        canonChecksum: 'abc123',
      },
    };
    setClassification(mockClassification);

    // Clear everything
    clear();

    const state = useBirthDataStore.getState();
    expect(state.date).toBe('');
    expect(state.time).toBe('');
    expect(state.location).toBe('');
    expect(state.timeZone).toBe('');
    expect(state.hdData).toBeNull();
    expect(state.classification).toBeNull();
  });
});

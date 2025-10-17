/**
 * Unit tests for scoring algorithm with golden fixtures
 */

import { describe, it, expect } from 'vitest';
import { computeScores, classify } from './scorer';
import type { HDExtract, Canon } from './scorer';

// Mock canon data fixture
const mockCanon: Canon = {
  version: '0.1.0-test',
  systems: {
    Pleiades: {
      weights: {
        type_manifestor: 15,
        authority_emotional: 12,
        channel_34_57: 20,
        gate_1: 5,
      },
      why: 'Test Pleiades',
    },
    Sirius: {
      weights: {
        type_projector: 15,
        authority_splenic: 12,
        channel_18_58: 18,
        gate_2: 5,
      },
      why: 'Test Sirius',
    },
    Arcturus: {
      weights: {
        type_generator: 15,
        authority_sacral: 12,
        channel_5_15: 18,
        gate_3: 5,
      },
      why: 'Test Arcturus',
    },
  },
};

describe('computeScores', () => {
  it('should compute scores with known HD data and return expected percentages', () => {
    const hdData: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: ['Throat', 'Sacral'],
      channels: [34, 57],
      gates: [1, 2],
    };

    const scores = computeScores(hdData, mockCanon);

    expect(scores).toHaveLength(3);
    expect(scores[0].system).toBe('Pleiades');
    
    // Pleiades: 15 (type_manifestor) + 12 (authority_emotional) + 5 (gate_1) = 32
    // Note: channels are stored as separate gates (34, 57), not as channel_34_57
    // Sirius: 5 (gate_2) = 5
    // Arcturus: 0
    // Total: 37
    // Pleiades: 32/37 * 100 = 86.5%
    // Sirius: 5/37 * 100 = 13.5%
    // Arcturus: 0%
    
    expect(scores[0].rawScore).toBe(32);
    expect(scores[0].percentage).toBe(86.5);
    expect(scores[1].system).toBe('Sirius');
    expect(scores[1].rawScore).toBe(5);
    expect(scores[1].percentage).toBe(13.5);
    expect(scores[2].system).toBe('Arcturus');
    expect(scores[2].rawScore).toBe(0);
    expect(scores[2].percentage).toBe(0);
  });

  it('should handle HD data with no matching weights', () => {
    const hdData: HDExtract = {
      type: 'Reflector',
      authority: 'Lunar',
      profile: '6/3',
      centers: [],
      channels: [],
      gates: [],
    };

    const scores = computeScores(hdData, mockCanon);

    expect(scores).toHaveLength(3);
    scores.forEach(score => {
      expect(score.rawScore).toBe(0);
      expect(score.percentage).toBe(0);
    });
  });

  it('should include contributors with correct labels', () => {
    const hdData: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: [],
      channels: [5, 15],
      gates: [3],
    };

    const scores = computeScores(hdData, mockCanon);
    const arcturusScore = scores.find(s => s.system === 'Arcturus');

    expect(arcturusScore).toBeDefined();
    expect(arcturusScore!.contributors).toHaveLength(3);
    
    const labels = arcturusScore!.contributors.map(c => c.label);
    expect(labels).toContain('Type: Generator');
    expect(labels).toContain('Authority: Sacral');
    expect(labels).toContain('Gate: 3');
  });
});

describe('classify', () => {
  it('should classify as primary when top system has >6% lead', () => {
    const hdData: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: [],
      channels: [34, 57],
      gates: [1],
    };

    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);

    expect(result.classification).toBe('primary');
    expect(result.primary).toBe('Pleiades');
    expect(result.hybrid).toBeUndefined();
    expect(result.allies).toHaveLength(3);
    expect(result.allies[0].system).toBe('Pleiades');
  });

  it('should classify as hybrid when top two systems are within 6%', () => {
    const hdData: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: [],
      channels: [34, 57, 18, 58],
      gates: [],
    };

    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);

    // Pleiades: 15 + 12 + 20 = 47
    // Sirius: 18 = 18
    // Total: 65
    // Pleiades: 72.3%, Sirius: 27.7%
    // Difference: 44.6% (>6%, so primary)
    
    expect(result.classification).toBe('primary');
    expect(result.primary).toBe('Pleiades');
  });

  it('should classify as hybrid with balanced scores', () => {
    // Create a scenario where two systems are very close
    const customCanon: Canon = {
      version: '0.1.0-test',
      systems: {
        Pleiades: {
          weights: {
            type_manifestor: 10,
            gate_1: 5,
          },
          why: 'Test',
        },
        Sirius: {
          weights: {
            type_manifestor: 10,
            gate_2: 4,
          },
          why: 'Test',
        },
        Arcturus: {
          weights: {
            gate_3: 1,
          },
          why: 'Test',
        },
      },
    };

    const hdData: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: [],
      channels: [],
      gates: [1, 2],
    };

    const scores = computeScores(hdData, customCanon);
    const result = classify(scores, customCanon);

    // Pleiades: 10 + 5 = 15 (50%)
    // Sirius: 10 + 4 = 14 (46.7%)
    // Arcturus: 0
    // Difference: 3.3% (<6%, so hybrid)

    expect(result.classification).toBe('hybrid');
    expect(result.hybrid).toEqual(['Pleiades', 'Sirius']);
    expect(result.primary).toBeUndefined();
  });

  it('should include percentages for all systems', () => {
    const hdData: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: [],
      channels: [5, 15],
      gates: [3],
    };

    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);

    expect(result.percentages).toHaveProperty('Pleiades');
    expect(result.percentages).toHaveProperty('Sirius');
    expect(result.percentages).toHaveProperty('Arcturus');
    expect(result.percentages.Arcturus).toBeGreaterThan(0);
  });

  it('should include contributors per system', () => {
    const hdData: HDExtract = {
      type: 'Projector',
      authority: 'Splenic',
      profile: '2/4',
      centers: [],
      channels: [18, 58],
      gates: [2],
    };

    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);

    expect(result.contributorsPerSystem).toHaveProperty('Sirius');
    expect(result.contributorsPerSystem.Sirius).toContain('Type: Projector');
    expect(result.contributorsPerSystem.Sirius).toContain('Authority: Splenic');
    expect(result.contributorsPerSystem.Sirius).toContain('Gate: 2');
  });

  it('should include metadata with canon version', () => {
    const hdData: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: [],
      channels: [],
      gates: [],
    };

    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);

    expect(result.meta.canonVersion).toBe('0.1.0-test');
    expect(result.meta.canonChecksum).toBe('computed-at-runtime');
  });

  it('should throw error when no scores provided', () => {
    expect(() => classify([], mockCanon)).toThrow('No scores provided');
  });
});

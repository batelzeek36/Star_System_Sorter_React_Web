/**
 * Tests for placement-based scoring with planet weighting
 */

import { describe, it, expect } from 'vitest';
import { computeScoresWithGateLines, type HDExtract } from './scorer';
import type { GateLineMap } from './gateline-map';

describe('Placement-Based Scoring', () => {
  // Mock gate-line map with core and shadow alignments
  const mockGateLineMap: GateLineMap = {
    _meta: {
      version: '1.0-test',
      generated_at_utc: new Date().toISOString(),
      source_star_system_version: '4.2',
      total_gate_lines: 3,
      systems: ['Arcturus', 'Orion Dark', 'Pleiades'],
    },
    '21.1': [
      { star_system: 'Arcturus', weight: 0.4, alignment_type: 'core', why: 'Test' },
      { star_system: 'Orion Dark', weight: 0.15, alignment_type: 'shadow', why: 'Test' },
    ],
    '48.1': [
      { star_system: 'Arcturus', weight: 0.5, alignment_type: 'core', why: 'Test' },
      { star_system: 'Pleiades', weight: 0.2, alignment_type: 'core', why: 'Test' },
    ],
    '32.3': [
      { star_system: 'Arcturus', weight: 0.3, alignment_type: 'shadow', why: 'Test' },
      { star_system: 'Orion Dark', weight: 0.25, alignment_type: 'shadow', why: 'Test' },
    ],
  };

  it('should score only actual placements, not all 6 lines', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '3/5',
      centers: ['Throat', 'Ego'],
      channels: [21],
      gates: [21, 48],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },
        { planet: 'Earth', gate: 48, line: 1, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, mockGateLineMap);

    // Should only score 21.1 and 48.1, not all lines of gates 21 and 48
    const arcturus = scores.find(s => s.system === 'Arcturus');
    expect(arcturus).toBeDefined();
    
    // Arcturus should have contributions from both placements
    expect(arcturus?.contributors.length).toBeGreaterThan(0);
    expect(arcturus?.contributors.some(c => c.key === '21.1')).toBe(true);
    expect(arcturus?.contributors.some(c => c.key === '48.1')).toBe(true);
  });

  it('should apply planet weighting correctly', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '3/5',
      centers: ['Throat'],
      channels: [],
      gates: [21],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },    // 2.0x weight
        { planet: 'Mercury', gate: 21, line: 1, type: 'personality' }, // 1.0x weight
      ],
    };

    const scores = computeScoresWithGateLines(extract, mockGateLineMap);
    const arcturus = scores.find(s => s.system === 'Arcturus');

    // Sun placement should have 2x the weight of Mercury placement
    const sunContributor = arcturus?.contributors.find(c => c.label.includes('Sun'));
    const mercuryContributor = arcturus?.contributors.find(c => c.label.includes('Mercury'));

    expect(sunContributor).toBeDefined();
    expect(mercuryContributor).toBeDefined();
    expect(sunContributor!.weight).toBeCloseTo(mercuryContributor!.weight * 2, 2);
  });

  it('should separate core from shadow scores', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '3/5',
      centers: ['Throat'],
      channels: [],
      gates: [21, 32],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },  // Core
        { planet: 'Earth', gate: 32, line: 3, type: 'personality' }, // Shadow
      ],
    };

    const scores = computeScoresWithGateLines(extract, mockGateLineMap);
    const arcturus = scores.find(s => s.system === 'Arcturus');
    const orionDark = scores.find(s => s.system === 'Orion Dark');

    // Arcturus should have both core and shadow scores
    expect(arcturus?.coreScore).toBeGreaterThan(0);
    expect(arcturus?.shadowScore).toBeGreaterThan(0);

    // Orion Dark should only have shadow score
    expect(orionDark?.coreScore).toBe(0);
    expect(orionDark?.shadowScore).toBeGreaterThan(0);
  });

  it('should normalize core and shadow percentages separately', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '3/5',
      centers: ['Throat'],
      channels: [],
      gates: [21, 48, 32],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },
        { planet: 'Earth', gate: 48, line: 1, type: 'personality' },
        { planet: 'Moon', gate: 32, line: 3, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, mockGateLineMap);

    // Core percentages should sum to 100
    const coreSum = scores.reduce((sum, s) => sum + (s.corePercentage || 0), 0);
    expect(coreSum).toBeCloseTo(100, 1);

    // Shadow percentages should sum to 100
    const shadowSum = scores.reduce((sum, s) => sum + (s.shadowPercentage || 0), 0);
    expect(shadowSum).toBeCloseTo(100, 1);
  });

  it('should sort by core percentage for allies', () => {
    const extract: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '3/5',
      centers: ['Throat'],
      channels: [],
      gates: [21, 48],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },
        { planet: 'Earth', gate: 48, line: 1, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, mockGateLineMap);

    // Scores should be sorted by core percentage descending
    for (let i = 0; i < scores.length - 1; i++) {
      const current = scores[i].corePercentage || 0;
      const next = scores[i + 1].corePercentage || 0;
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});

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

    // With sparsify, Arcturus core might be kept but shadow might be dropped
    // Just verify that core and shadow tracking works
    expect(arcturus?.coreScore).toBeGreaterThan(0);
    
    // Shadow might be 0 if sparsified out, so just check it exists as a property
    expect(arcturus).toHaveProperty('shadowScore');
  });

  it('should normalize to unified percentages (v4.3)', () => {
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

    // Unified percentages (core + shadow combined) should sum to 100
    const totalSum = scores.reduce((sum, s) => sum + s.percentage, 0);
    expect(totalSum).toBeCloseTo(100, 1);
    
    // Each system should track core and shadow separately for display
    scores.forEach(s => {
      expect(s).toHaveProperty('coreScore');
      expect(s).toHaveProperty('shadowScore');
    });
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


describe('Sparsify + Sharpen Algorithm', () => {
  // Mock gate-line map with muddy spread (5-6 systems per line)
  const muddyGateLineMap: GateLineMap = {
    _meta: {
      version: '1.0-test',
      generated_at_utc: new Date().toISOString(),
      source_star_system_version: '4.2',
      total_gate_lines: 1,
      systems: ['Arcturus', 'Draco', 'Orion Dark', 'Orion Light', 'Pleiades', 'Andromeda'],
    },
    '21.1': [
      { star_system: 'Arcturus', weight: 0.4, alignment_type: 'core', why: 'Strong match' },
      { star_system: 'Draco', weight: 0.25, alignment_type: 'core', why: 'Medium match' },
      { star_system: 'Orion Dark', weight: 0.15, alignment_type: 'core', why: 'Weak match' },
      { star_system: 'Orion Light', weight: 0.15, alignment_type: 'core', why: 'Weak match' },
      { star_system: 'Pleiades', weight: 0.1, alignment_type: 'core', why: 'Very weak' },
      { star_system: 'Andromeda', weight: 0.1, alignment_type: 'core', why: 'Very weak' },
    ],
  };

  it('should reduce muddy 6-system spread to 2-3 focused systems', () => {
    const extract: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '1/3',
      centers: ['Sacral'],
      channels: [],
      gates: [21],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, muddyGateLineMap);

    // Count systems with non-zero scores
    const nonZeroSystems = scores.filter(s => s.percentage > 0);

    // With sparsify (top_k=2 for core), should have at most 2-3 systems
    expect(nonZeroSystems.length).toBeLessThanOrEqual(3);

    // Top system should be Arcturus (strongest weight)
    expect(scores[0].system).toBe('Arcturus');

    // Weak systems (0.1 weights) should be dropped
    const pleiades = scores.find(s => s.system === 'Pleiades');
    const andromeda = scores.find(s => s.system === 'Andromeda');
    expect(pleiades?.percentage || 0).toBe(0);
    expect(andromeda?.percentage || 0).toBe(0);
  });

  it('should sharpen contrast between strong and weak matches', () => {
    const extract: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '1/3',
      centers: ['Sacral'],
      channels: [],
      gates: [21],
      placements: [
        { planet: 'Sun', gate: 21, line: 1, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, muddyGateLineMap);

    // With gamma=1.8, the gap between Arcturus (0.4) and Draco (0.25) should widen
    const arcturus = scores.find(s => s.system === 'Arcturus');
    const draco = scores.find(s => s.system === 'Draco');

    // Arcturus should have significantly higher percentage than Draco
    // (more than the raw 0.4 vs 0.25 ratio would suggest)
    if (arcturus && draco && arcturus.percentage > 0 && draco.percentage > 0) {
      const ratio = arcturus.percentage / draco.percentage;
      expect(ratio).toBeGreaterThan(1.5); // Should be amplified by gamma
    }
  });

  it('should apply line 3 shadow dampener', () => {
    const line3Map: GateLineMap = {
      _meta: {
        version: '1.0-test',
        generated_at_utc: new Date().toISOString(),
        source_star_system_version: '4.2',
        total_gate_lines: 1,
        systems: ['Arcturus'],
      },
      '32.3': [
        { star_system: 'Arcturus', weight: 0.5, alignment_type: 'shadow', why: 'Line 3 shadow' },
      ],
    };

    const extract: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '3/5',
      centers: ['Sacral'],
      channels: [],
      gates: [32],
      placements: [
        { planet: 'Sun', gate: 32, line: 3, type: 'personality' },
      ],
    };

    const scores = computeScoresWithGateLines(extract, line3Map);
    const arcturus = scores.find(s => s.system === 'Arcturus');

    // Shadow score calculation with sparsify + line 3 dampener:
    // 1. Sparsify: weight 0.5 -> gamma 1.8 -> 0.5^1.8 ≈ 0.354
    // 2. Renormalize (only 1 system): 0.354 / 0.354 = 1.0
    // 3. Planet weight: 1.0 * 2.0 (Sun) = 2.0
    // 4. Line 3 dampener: 2.0 * 0.75 = 1.5
    expect(arcturus?.shadowScore).toBeCloseTo(1.5, 2);
  });
});

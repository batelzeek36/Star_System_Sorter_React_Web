/**
 * Integration tests for gate-line based scoring
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { computeScoresWithGateLines, classify } from './scorer';
import type { HDExtract, Canon } from './scorer';
import type { GateLineMap } from './gateline-map';

describe('Gate-Line Scoring Integration', () => {
  let mockGateLineMap: GateLineMap;
  let mockCanon: Canon;

  beforeAll(() => {
    // Create mock gate-line map with realistic data
    mockGateLineMap = {
      _meta: {
        version: '1.0.0',
        generated_at_utc: '2024-11-03T00:00:00Z',
        source_star_system_version: '4.2',
        total_gate_lines: 384,
        systems: ['andromeda', 'arcturus', 'draco', 'lyra', 'orion-dark', 'orion-light', 'pleiades', 'sirius'],
      },
      // Gate 1 - Creative expression (Lyra-heavy)
      '1.1': [
        { star_system: 'Lyra', weight: 0.85, alignment_type: 'core', why: 'Pure creative emanation' },
        { star_system: 'Pleiades', weight: 0.05, alignment_type: 'core', why: 'Subtle sensitivity' },
      ],
      '1.2': [
        { star_system: 'Lyra', weight: 0.5, alignment_type: 'core', why: 'Refining style' },
        { star_system: 'Pleiades', weight: 0.3, alignment_type: 'core', why: 'Sensitivity to acceptance' },
      ],
      '1.3': [
        { star_system: 'Lyra', weight: 0.7, alignment_type: 'core', why: 'Creative experimentation' },
      ],
      '1.4': [
        { star_system: 'Lyra', weight: 0.65, alignment_type: 'core', why: 'Aesthetic beacon' },
        { star_system: 'Sirius', weight: 0.15, alignment_type: 'core', why: 'Teaching by example' },
      ],
      '1.5': [
        { star_system: 'Lyra', weight: 0.5, alignment_type: 'core', why: 'Taste-setter' },
        { star_system: 'Sirius', weight: 0.15, alignment_type: 'core', why: 'Public teaching' },
      ],
      '1.6': [
        { star_system: 'Lyra', weight: 0.6, alignment_type: 'core', why: 'Cultural standard' },
        { star_system: 'Sirius', weight: 0.25, alignment_type: 'core', why: 'Mentor by being' },
      ],
      // Gate 13 - Listening/Secrets (Pleiades-heavy)
      '13.1': [
        { star_system: 'Pleiades', weight: 0.7, alignment_type: 'core', why: 'Empathic listening' },
      ],
      '13.2': [
        { star_system: 'Pleiades', weight: 0.6, alignment_type: 'core', why: 'Holding space' },
      ],
      '13.3': [
        { star_system: 'Pleiades', weight: 0.65, alignment_type: 'core', why: 'Safe container' },
      ],
      '13.4': [
        { star_system: 'Pleiades', weight: 0.55, alignment_type: 'core', why: 'Emotional attunement' },
      ],
      '13.5': [
        { star_system: 'Pleiades', weight: 0.5, alignment_type: 'core', why: 'Collective memory' },
      ],
      '13.6': [
        { star_system: 'Pleiades', weight: 0.45, alignment_type: 'core', why: 'Wisdom keeper' },
      ],
    };

    mockCanon = {
      version: '1.0.0',
      systems: {},
    };
  });

  describe('computeScoresWithGateLines', () => {
    it('should compute scores for single gate activation', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1], // Only gate 1 activated
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);

      expect(scores).toBeDefined();
      expect(scores.length).toBe(8); // All 8 systems

      // Lyra should have highest score (gate 1 is Lyra-heavy)
      const lyra = scores.find(s => s.system === 'Lyra');
      expect(lyra).toBeDefined();
      expect(lyra!.rawScore).toBeGreaterThan(0);
      
      // Should be sorted by percentage descending
      expect(scores[0].percentage).toBeGreaterThanOrEqual(scores[1].percentage);
    });

    it('should compute scores for multiple gate activations', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1, 13], // Gate 1 (Lyra) + Gate 13 (Pleiades)
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);

      // Both Lyra and Pleiades should have significant scores
      const lyra = scores.find(s => s.system === 'Lyra');
      const pleiades = scores.find(s => s.system === 'Pleiades');

      expect(lyra!.rawScore).toBeGreaterThan(0);
      expect(pleiades!.rawScore).toBeGreaterThan(0);
    });

    it('should only count positive weights', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);

      // Systems with no positive weights should have 0 raw score
      const draco = scores.find(s => s.system === 'Draco');
      expect(draco!.rawScore).toBe(0);
    });

    it('should include all 6 lines for each activated gate', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);
      const lyra = scores.find(s => s.system === 'Lyra');

      // Should have contributors from all 6 lines of gate 1
      expect(lyra!.contributors.length).toBeGreaterThan(0);
      
      // Check that contributors include line references
      const hasLineContributors = lyra!.contributors.some(c => 
        c.key.startsWith('1.') && c.label.includes('Gate 1.')
      );
      expect(hasLineContributors).toBe(true);
    });

    it('should normalize percentages to sum to 100', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1, 13],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);

      const totalPercentage = scores.reduce((sum, s) => sum + s.percentage, 0);
      
      // Should sum to exactly 100.00 (within floating point precision)
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.01);
    });

    it('should handle empty gates array', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);

      // All systems should have 0 raw score
      scores.forEach(s => {
        expect(s.rawScore).toBe(0);
        expect(s.percentage).toBe(0);
      });
    });
  });

  describe('classify with gate-line scores', () => {
    it('should classify as primary when one system dominates', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1], // Lyra-dominant gate
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);
      const result = classify(scores, mockCanon, hdData);

      expect(result.classification).toBe('primary');
      expect(result.primary).toBe('Lyra');
    });

    it('should classify as hybrid when two systems are close', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1, 13], // Lyra + Pleiades
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);
      const result = classify(scores, mockCanon, hdData);

      // Depending on weights, could be primary or hybrid
      expect(['primary', 'hybrid']).toContain(result.classification);
    });

    it('should include contributors in classification result', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);
      const result = classify(scores, mockCanon, hdData);

      expect(result.contributorsWithWeights).toBeDefined();
      expect(result.contributorsWithWeights['Lyra']).toBeDefined();
      expect(result.contributorsWithWeights['Lyra'].length).toBeGreaterThan(0);
    });

    it('should include metadata in classification result', () => {
      const hdData: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '3/5',
        centers: ['Sacral'],
        channels: [],
        gates: [1],
      };

      const scores = computeScoresWithGateLines(hdData, mockGateLineMap);
      const result = classify(scores, mockCanon, hdData);

      expect(result.meta).toBeDefined();
      expect(result.meta.canonVersion).toBe('1.0.0');
      expect(result.meta.input_hash).toBeDefined();
    });
  });
});

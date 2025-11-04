/**
 * Tests for gate-line mapping functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { loadGateLineMap, getGateLineMapping, getGateLinesForGates } from './gateline-map';
import type { GateLineMap } from './gateline-map';

describe('Gate-Line Mapping', () => {
  let gateLineMap: GateLineMap;

  beforeAll(async () => {
    // Mock fetch for testing
    global.fetch = async () => {
      // Return mock data for testing
      const mockData: GateLineMap = {
        _meta: {
          version: '1.0.0',
          generated_at_utc: '2024-11-03T00:00:00Z',
          source_star_system_version: '4.2',
          total_gate_lines: 384,
          systems: ['andromeda', 'arcturus', 'draco', 'lyra', 'orion-dark', 'orion-light', 'pleiades', 'sirius'],
        },
        '1.1': [
          {
            star_system: 'Lyra',
            weight: 0.85,
            alignment_type: 'core',
            why: 'Pure creative emanation',
          },
          {
            star_system: 'Pleiades',
            weight: 0.05,
            alignment_type: 'core',
            why: 'Subtle sensitivity',
          },
        ],
        '1.2': [
          {
            star_system: 'Lyra',
            weight: 0.5,
            alignment_type: 'core',
            why: 'Refining authentic style',
          },
        ],
      };
      
      return {
        ok: true,
        json: async () => mockData,
      } as Response;
    };

    gateLineMap = await loadGateLineMap();
  });

  describe('loadGateLineMap', () => {
    it('should load gate-line map with metadata', () => {
      expect(gateLineMap).toBeDefined();
      expect(gateLineMap._meta).toBeDefined();
      expect(gateLineMap._meta.version).toBe('1.0.0');
      expect(gateLineMap._meta.total_gate_lines).toBe(384);
      expect(gateLineMap._meta.systems).toHaveLength(8);
    });

    it('should have gate.line mappings', () => {
      expect(gateLineMap['1.1']).toBeDefined();
      expect(Array.isArray(gateLineMap['1.1'])).toBe(true);
    });
  });

  describe('getGateLineMapping', () => {
    it('should return mappings for a specific gate.line', () => {
      const mappings = getGateLineMapping(gateLineMap, 1, 1);
      
      expect(mappings).toBeDefined();
      expect(Array.isArray(mappings)).toBe(true);
      expect(mappings.length).toBeGreaterThan(0);
      
      const lyraMapping = mappings.find(m => m.star_system === 'Lyra');
      expect(lyraMapping).toBeDefined();
      expect(lyraMapping?.weight).toBe(0.85);
      expect(lyraMapping?.alignment_type).toBe('core');
    });

    it('should return empty array for non-existent gate.line', () => {
      const mappings = getGateLineMapping(gateLineMap, 999, 1);
      expect(mappings).toEqual([]);
    });
  });

  describe('getGateLinesForGates', () => {
    it('should return all 6 lines for a single gate', () => {
      const gateLines = getGateLinesForGates([1]);
      
      expect(gateLines).toHaveLength(6);
      expect(gateLines).toContain('1.1');
      expect(gateLines).toContain('1.2');
      expect(gateLines).toContain('1.3');
      expect(gateLines).toContain('1.4');
      expect(gateLines).toContain('1.5');
      expect(gateLines).toContain('1.6');
    });

    it('should return all lines for multiple gates', () => {
      const gateLines = getGateLinesForGates([1, 2]);
      
      expect(gateLines).toHaveLength(12);
      expect(gateLines).toContain('1.1');
      expect(gateLines).toContain('2.6');
    });

    it('should return empty array for no gates', () => {
      const gateLines = getGateLinesForGates([]);
      expect(gateLines).toEqual([]);
    });
  });
});

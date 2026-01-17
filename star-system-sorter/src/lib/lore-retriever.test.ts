/**
 * Unit tests for Lore Retriever - Chunked I Ching Data Fetching
 *
 * Tests verify:
 * - Only fetches gates present in input charts
 * - Context size stays under 15KB for typical chart pairs
 * - All 384 gate.lines can be retrieved individually
 * - Returns correct RelevantLore interface structure
 */

import { describe, it, expect } from 'vitest';
import type { HDExtract } from './schemas';
import {
  fetchGateLore,
  fetchMultipleGateLore,
  getChartLore,
  getRelevantLoreForCharts,
  isContextSizeValid,
  getHexagramInfo,
  getGatesWithStarMappings,
  type GateLine,
  type GateLore,
  type RelevantLore,
} from './lore-retriever';

// ============================================================================
// Test Fixtures
// ============================================================================

const mockChartA: HDExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '5/1',
  centers: ['Sacral', 'Throat'],
  channels: [],
  gates: [1, 13, 33, 48],
};

const mockChartB: HDExtract = {
  type: 'Projector',
  authority: 'Splenic',
  profile: '2/4',
  centers: ['Spleen', 'G'],
  channels: [],
  gates: [7, 13, 33, 54],
};

const mockChartWithManyGates: HDExtract = {
  type: 'Manifesting Generator',
  authority: 'Emotional',
  profile: '3/5',
  centers: ['Sacral', 'Throat', 'Solar Plexus'],
  channels: [],
  gates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
};

const mockEmptyChart: HDExtract = {
  type: 'Reflector',
  authority: 'Lunar',
  profile: '6/3',
  centers: [],
  channels: [],
  gates: [],
};

// ============================================================================
// fetchGateLore Tests
// ============================================================================

describe('fetchGateLore', () => {
  it('should fetch lore for a valid gate and line', () => {
    const lore = fetchGateLore(1, 1);

    expect(lore).toBeDefined();
    expect(lore.gate).toBe(1);
    expect(lore.line).toBe(1);
    expect(lore.hexagramName).toBe('The Creative');
    expect(lore.iChingMeaning).toContain('Pure creative force');
    expect(lore.iChingMeaning).toContain('Line 1');
  });

  it('should default to line 1 when not specified', () => {
    const lore = fetchGateLore(13);

    expect(lore.line).toBe(1);
    expect(lore.hexagramName).toBe('Fellowship');
  });

  it('should include star mappings from lore bundle', () => {
    // Gate 1 has star mappings for Andromeda
    const lore = fetchGateLore(1, 1);

    expect(Array.isArray(lore.starMappings)).toBe(true);
    // Gate 1 should have Andromeda mapping based on lore bundle
    const andromedaMapping = lore.starMappings.find(m => m.system === 'Andromeda');
    expect(andromedaMapping).toBeDefined();
    if (andromedaMapping) {
      expect(andromedaMapping.weight).toBeGreaterThan(0);
      expect(andromedaMapping.why).toBeDefined();
    }
  });

  it('should throw error for invalid gate number < 1', () => {
    expect(() => fetchGateLore(0, 1)).toThrow('Invalid gate number');
  });

  it('should throw error for invalid gate number > 64', () => {
    expect(() => fetchGateLore(65, 1)).toThrow('Invalid gate number');
  });

  it('should throw error for invalid line number < 1', () => {
    expect(() => fetchGateLore(1, 0)).toThrow('Invalid line number');
  });

  it('should throw error for invalid line number > 6', () => {
    expect(() => fetchGateLore(1, 7)).toThrow('Invalid line number');
  });

  it('should fetch all 64 gates successfully', () => {
    for (let gate = 1; gate <= 64; gate++) {
      const lore = fetchGateLore(gate, 1);
      expect(lore.gate).toBe(gate);
      expect(lore.hexagramName).toBeDefined();
      expect(lore.hexagramName.length).toBeGreaterThan(0);
    }
  });

  it('should fetch all 6 lines for each gate', () => {
    for (let line = 1; line <= 6; line++) {
      const lore = fetchGateLore(13, line);
      expect(lore.line).toBe(line);
      expect(lore.iChingMeaning).toContain(`Line ${line}`);
    }
  });

  it('should be able to retrieve all 384 gate.line combinations', () => {
    // Property test: all 384 combinations should work
    let count = 0;
    for (let gate = 1; gate <= 64; gate++) {
      for (let line = 1; line <= 6; line++) {
        const lore = fetchGateLore(gate, line);
        expect(lore).toBeDefined();
        expect(lore.gate).toBe(gate);
        expect(lore.line).toBe(line);
        count++;
      }
    }
    expect(count).toBe(384);
  });
});

// ============================================================================
// fetchMultipleGateLore Tests
// ============================================================================

describe('fetchMultipleGateLore', () => {
  it('should fetch lore for multiple gate.line pairs', () => {
    const gateLines: GateLine[] = [
      { gate: 1, line: 1 },
      { gate: 13, line: 3 },
      { gate: 33, line: 6 },
    ];

    const loreArray = fetchMultipleGateLore(gateLines);

    expect(loreArray).toHaveLength(3);
    expect(loreArray[0].gate).toBe(1);
    expect(loreArray[1].gate).toBe(13);
    expect(loreArray[2].gate).toBe(33);
  });

  it('should return empty array for empty input', () => {
    const loreArray = fetchMultipleGateLore([]);
    expect(loreArray).toHaveLength(0);
  });

  it('should preserve order of input gate.lines', () => {
    const gateLines: GateLine[] = [
      { gate: 64, line: 6 },
      { gate: 1, line: 1 },
      { gate: 33, line: 3 },
    ];

    const loreArray = fetchMultipleGateLore(gateLines);

    expect(loreArray[0].gate).toBe(64);
    expect(loreArray[1].gate).toBe(1);
    expect(loreArray[2].gate).toBe(33);
  });
});

// ============================================================================
// getChartLore Tests
// ============================================================================

describe('getChartLore', () => {
  it('should get lore for all gates in a chart', () => {
    const lore = getChartLore(mockChartA);

    expect(lore).toHaveLength(mockChartA.gates.length);

    const gates = lore.map(l => l.gate);
    expect(gates).toContain(1);
    expect(gates).toContain(13);
    expect(gates).toContain(33);
    expect(gates).toContain(48);
  });

  it('should return empty array for chart with no gates', () => {
    const lore = getChartLore(mockEmptyChart);
    expect(lore).toHaveLength(0);
  });

  it('should use provided gateLines when specified', () => {
    const gateLines: GateLine[] = [
      { gate: 1, line: 3 },
      { gate: 13, line: 5 },
    ];

    const lore = getChartLore(mockChartA, gateLines);

    expect(lore).toHaveLength(2);
    expect(lore[0].gate).toBe(1);
    expect(lore[0].line).toBe(3);
    expect(lore[1].gate).toBe(13);
    expect(lore[1].line).toBe(5);
  });

  it('should default to line 1 when only gate numbers provided', () => {
    const lore = getChartLore(mockChartA);

    lore.forEach(l => {
      expect(l.line).toBe(1);
    });
  });
});

// ============================================================================
// getRelevantLoreForCharts Tests
// ============================================================================

describe('getRelevantLoreForCharts', () => {
  it('should return lore for both charts', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    expect(relevantLore.chartAGates).toHaveLength(mockChartA.gates.length);
    expect(relevantLore.chartBGates).toHaveLength(mockChartB.gates.length);
  });

  it('should identify shared gates correctly', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    // Charts A and B share gates 13 and 33
    const sharedGateNumbers = relevantLore.sharedGates.map(g => g.gate);
    expect(sharedGateNumbers).toContain(13);
    expect(sharedGateNumbers).toContain(33);
  });

  it('should return empty sharedGates when no gates in common', () => {
    const chartWithNoOverlap: HDExtract = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: [],
      channels: [],
      gates: [2, 3, 4], // No overlap with mockChartA
    };

    const relevantLore = getRelevantLoreForCharts(mockChartA, chartWithNoOverlap);

    expect(relevantLore.sharedGates).toHaveLength(0);
  });

  it('should calculate totalContextSize in bytes', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    expect(typeof relevantLore.totalContextSize).toBe('number');
    expect(relevantLore.totalContextSize).toBeGreaterThan(0);
  });

  it('should keep context size under 15KB for typical charts', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    expect(relevantLore.totalContextSize).toBeLessThan(15 * 1024);
    expect(isContextSizeValid(relevantLore)).toBe(true);
  });

  it('should handle charts with many gates while staying under limit', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartWithManyGates, mockChartWithManyGates);

    // Even with 20 gates each, should stay under 15KB
    expect(relevantLore.totalContextSize).toBeLessThan(15 * 1024);
  });

  it('should handle empty charts gracefully', () => {
    const relevantLore = getRelevantLoreForCharts(mockEmptyChart, mockEmptyChart);

    expect(relevantLore.chartAGates).toHaveLength(0);
    expect(relevantLore.chartBGates).toHaveLength(0);
    expect(relevantLore.sharedGates).toHaveLength(0);
    expect(relevantLore.totalContextSize).toBeGreaterThan(0); // Empty array has some JSON overhead
  });

  it('should only fetch gates present in input charts', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    // Combine all gates from result
    const allFetchedGates = new Set([
      ...relevantLore.chartAGates.map(g => g.gate),
      ...relevantLore.chartBGates.map(g => g.gate),
    ]);

    // All input gates should be in result
    const allInputGates = new Set([...mockChartA.gates, ...mockChartB.gates]);

    allInputGates.forEach(gate => {
      expect(allFetchedGates.has(gate)).toBe(true);
    });

    // No extra gates should be present
    allFetchedGates.forEach(gate => {
      expect(allInputGates.has(gate)).toBe(true);
    });
  });

  it('should return correct interface structure', () => {
    const relevantLore = getRelevantLoreForCharts(mockChartA, mockChartB);

    // Verify interface structure
    expect(relevantLore).toHaveProperty('chartAGates');
    expect(relevantLore).toHaveProperty('chartBGates');
    expect(relevantLore).toHaveProperty('sharedGates');
    expect(relevantLore).toHaveProperty('totalContextSize');

    expect(Array.isArray(relevantLore.chartAGates)).toBe(true);
    expect(Array.isArray(relevantLore.chartBGates)).toBe(true);
    expect(Array.isArray(relevantLore.sharedGates)).toBe(true);
    expect(typeof relevantLore.totalContextSize).toBe('number');

    // Verify GateLore structure
    if (relevantLore.chartAGates.length > 0) {
      const firstGate = relevantLore.chartAGates[0];
      expect(firstGate).toHaveProperty('gate');
      expect(firstGate).toHaveProperty('line');
      expect(firstGate).toHaveProperty('hexagramName');
      expect(firstGate).toHaveProperty('iChingMeaning');
      expect(firstGate).toHaveProperty('starMappings');
    }
  });
});

// ============================================================================
// isContextSizeValid Tests
// ============================================================================

describe('isContextSizeValid', () => {
  it('should return true for small context', () => {
    const smallLore: RelevantLore = {
      chartAGates: [fetchGateLore(1, 1)],
      chartBGates: [fetchGateLore(2, 1)],
      sharedGates: [],
      totalContextSize: 1000,
    };

    expect(isContextSizeValid(smallLore)).toBe(true);
  });

  it('should return false for oversized context', () => {
    const largeLore: RelevantLore = {
      chartAGates: [],
      chartBGates: [],
      sharedGates: [],
      totalContextSize: 20 * 1024, // 20KB
    };

    expect(isContextSizeValid(largeLore)).toBe(false);
  });

  it('should respect custom maxSize parameter', () => {
    const lore: RelevantLore = {
      chartAGates: [],
      chartBGates: [],
      sharedGates: [],
      totalContextSize: 5000,
    };

    expect(isContextSizeValid(lore, 4000)).toBe(false);
    expect(isContextSizeValid(lore, 6000)).toBe(true);
  });
});

// ============================================================================
// getHexagramInfo Tests
// ============================================================================

describe('getHexagramInfo', () => {
  it('should return hexagram info for valid gate', () => {
    const info = getHexagramInfo(1);

    expect(info).not.toBeNull();
    expect(info?.name).toBe('The Creative');
    expect(info?.meaning).toContain('creative');
  });

  it('should return null for invalid gate < 1', () => {
    expect(getHexagramInfo(0)).toBeNull();
  });

  it('should return null for invalid gate > 64', () => {
    expect(getHexagramInfo(65)).toBeNull();
  });

  it('should return info for all 64 gates', () => {
    for (let gate = 1; gate <= 64; gate++) {
      const info = getHexagramInfo(gate);
      expect(info).not.toBeNull();
      expect(info?.name).toBeDefined();
      expect(info?.meaning).toBeDefined();
    }
  });
});

// ============================================================================
// getGatesWithStarMappings Tests
// ============================================================================

describe('getGatesWithStarMappings', () => {
  it('should return array of gate numbers', () => {
    const gates = getGatesWithStarMappings();

    expect(Array.isArray(gates)).toBe(true);
    expect(gates.length).toBeGreaterThan(0);
  });

  it('should return sorted array', () => {
    const gates = getGatesWithStarMappings();

    for (let i = 1; i < gates.length; i++) {
      expect(gates[i]).toBeGreaterThan(gates[i - 1]);
    }
  });

  it('should only contain valid gate numbers', () => {
    const gates = getGatesWithStarMappings();

    gates.forEach(gate => {
      expect(gate).toBeGreaterThanOrEqual(1);
      expect(gate).toBeLessThanOrEqual(64);
    });
  });
});

// ============================================================================
// Context Size Constraint Tests (Critical Acceptance Criteria)
// ============================================================================

describe('Context Size Constraints', () => {
  it('should stay under 15KB for typical chart pairs (8-15 gates each)', () => {
    // Simulate typical charts with 8-15 gates
    const typicalChartA: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: [],
      channels: [],
      gates: [1, 7, 13, 33, 48, 51, 59, 61, 62, 63],
    };

    const typicalChartB: HDExtract = {
      type: 'Projector',
      authority: 'Splenic',
      profile: '2/4',
      centers: [],
      channels: [],
      gates: [2, 7, 10, 13, 22, 33, 34, 44, 48, 54],
    };

    const relevantLore = getRelevantLoreForCharts(typicalChartA, typicalChartB);

    expect(relevantLore.totalContextSize).toBeLessThan(15 * 1024);
  });

  it('should stay under 15KB even with maximum typical gates (26 each)', () => {
    // Maximum typical chart with 26 gates
    const largeChartA: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: [],
      channels: [],
      gates: Array.from({ length: 26 }, (_, i) => i + 1),
    };

    const largeChartB: HDExtract = {
      type: 'Projector',
      authority: 'Splenic',
      profile: '2/4',
      centers: [],
      channels: [],
      gates: Array.from({ length: 26 }, (_, i) => i + 32),
    };

    const relevantLore = getRelevantLoreForCharts(largeChartA, largeChartB);

    // With 52 unique gates, should still be under 15KB
    expect(relevantLore.totalContextSize).toBeLessThan(15 * 1024);
  });

  it('property test: 100 random chart pairs should all stay under 15KB', () => {
    for (let i = 0; i < 100; i++) {
      // Generate random gates (5-20 gates per chart)
      const numGatesA = Math.floor(Math.random() * 16) + 5;
      const numGatesB = Math.floor(Math.random() * 16) + 5;

      const gatesA = Array.from(
        new Set(Array.from({ length: numGatesA }, () => Math.floor(Math.random() * 64) + 1))
      );
      const gatesB = Array.from(
        new Set(Array.from({ length: numGatesB }, () => Math.floor(Math.random() * 64) + 1))
      );

      const chartA: HDExtract = {
        type: 'Generator',
        authority: 'Sacral',
        profile: '5/1',
        centers: [],
        channels: [],
        gates: gatesA,
      };

      const chartB: HDExtract = {
        type: 'Projector',
        authority: 'Splenic',
        profile: '2/4',
        centers: [],
        channels: [],
        gates: gatesB,
      };

      const relevantLore = getRelevantLoreForCharts(chartA, chartB);

      expect(relevantLore.totalContextSize).toBeLessThan(15 * 1024);
    }
  });
});

// ============================================================================
// Star Mapping Integration Tests
// ============================================================================

describe('Star System Mapping Integration', () => {
  it('should include star mappings from lore bundle for mapped gates', () => {
    // Gate 48 has Arcturus mapping in lore bundle
    const lore = fetchGateLore(48, 1);

    expect(lore.starMappings.length).toBeGreaterThan(0);

    const arcturusMapping = lore.starMappings.find(m => m.system === 'Arcturus');
    expect(arcturusMapping).toBeDefined();
  });

  it('should return empty starMappings for unmapped gates', () => {
    // Find a gate that might not have direct mappings
    // Check a few gates that might not be in the lore rules
    const lore = fetchGateLore(5, 1);

    // Should at least return an array (might be empty)
    expect(Array.isArray(lore.starMappings)).toBe(true);
  });

  it('should include all star mapping fields', () => {
    const lore = fetchGateLore(1, 1);

    if (lore.starMappings.length > 0) {
      const mapping = lore.starMappings[0];
      expect(mapping).toHaveProperty('system');
      expect(mapping).toHaveProperty('weight');
      expect(mapping).toHaveProperty('why');

      expect(typeof mapping.system).toBe('string');
      expect(typeof mapping.weight).toBe('number');
      expect(typeof mapping.why).toBe('string');
    }
  });
});

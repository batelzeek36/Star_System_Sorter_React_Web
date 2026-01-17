/**
 * Unit tests for chart comparison algorithm
 */

import { describe, it, expect } from 'vitest';
import {
  compareCharts,
  compareSameChart,
  areChartsIdentical,
  findSharedGates,
  findSharedChannels,
  compareSharedCenters,
  getTypeDynamic,
  calculateStarSystemOverlap,
  calculateCompatibilityScores,
  ALL_CENTERS,
  CHANNEL_DEFINITIONS,
} from './comparison';
import type { SharedGate } from './comparison';
import type { HDExtract, ClassificationResult } from './schemas';
import type { GateLine } from './lore-retriever';

// ============================================================================
// Test Fixtures
// ============================================================================

const mockChartA: HDExtract = {
  type: 'Generator',
  authority: 'Sacral',
  profile: '5/1',
  centers: ['Throat', 'Sacral', 'Spleen'],
  channels: [],
  gates: [1, 2, 7, 13, 33, 48],
};

const mockChartB: HDExtract = {
  type: 'Projector',
  authority: 'Splenic',
  profile: '2/4',
  centers: ['Throat', 'Spleen', 'Ajna'],
  channels: [],
  gates: [2, 7, 16, 31, 48],
};

const mockGateLinesA: GateLine[] = [
  { gate: 1, line: 3 },
  { gate: 2, line: 5 },
  { gate: 7, line: 1 },
  { gate: 13, line: 4 },
  { gate: 33, line: 2 },
  { gate: 48, line: 6 },
];

const mockGateLinesB: GateLine[] = [
  { gate: 2, line: 2 },
  { gate: 7, line: 4 },
  { gate: 16, line: 3 },
  { gate: 31, line: 1 },
  { gate: 48, line: 6 },
];

const mockClassificationResultA: ClassificationResult = {
  classification: 'primary',
  primary: 'Pleiades',
  allies: [
    { system: 'Pleiades', percentage: 45 },
    { system: 'Sirius', percentage: 30 },
    { system: 'Arcturus', percentage: 25 },
  ],
  percentages: { Pleiades: 45, Sirius: 30, Arcturus: 25 },
  contributorsPerSystem: {},
  contributorsWithWeights: {},
  meta: { canonVersion: '1.0', canonChecksum: 'test' },
};

const mockClassificationResultB: ClassificationResult = {
  classification: 'primary',
  primary: 'Sirius',
  allies: [
    { system: 'Sirius', percentage: 50 },
    { system: 'Pleiades', percentage: 35 },
    { system: 'Orion', percentage: 15 },
  ],
  percentages: { Sirius: 50, Pleiades: 35, Orion: 15 },
  contributorsPerSystem: {},
  contributorsWithWeights: {},
  meta: { canonVersion: '1.0', canonChecksum: 'test' },
};

// ============================================================================
// findSharedGates Tests
// ============================================================================

describe('findSharedGates', () => {
  it('should find gates that appear in both charts', () => {
    const sharedGates = findSharedGates(mockGateLinesA, mockGateLinesB);

    expect(sharedGates).toHaveLength(3);
    expect(sharedGates.map(g => g.gate)).toContain(2);
    expect(sharedGates.map(g => g.gate)).toContain(7);
    expect(sharedGates.map(g => g.gate)).toContain(48);
  });

  it('should include line information for both charts', () => {
    const sharedGates = findSharedGates(mockGateLinesA, mockGateLinesB);

    const gate2 = sharedGates.find(g => g.gate === 2);
    expect(gate2).toBeDefined();
    expect(gate2!.lineA).toBe(5); // From chart A
    expect(gate2!.lineB).toBe(2); // From chart B
  });

  it('should return empty array when no shared gates', () => {
    const gateLinesA: GateLine[] = [{ gate: 1, line: 1 }, { gate: 3, line: 1 }];
    const gateLinesB: GateLine[] = [{ gate: 5, line: 1 }, { gate: 7, line: 1 }];

    const sharedGates = findSharedGates(gateLinesA, gateLinesB);
    expect(sharedGates).toHaveLength(0);
  });

  it('should sort results by gate number', () => {
    const sharedGates = findSharedGates(mockGateLinesA, mockGateLinesB);

    for (let i = 1; i < sharedGates.length; i++) {
      expect(sharedGates[i].gate).toBeGreaterThan(sharedGates[i - 1].gate);
    }
  });

  it('should handle identical line numbers', () => {
    const gateLinesA: GateLine[] = [{ gate: 10, line: 3 }];
    const gateLinesB: GateLine[] = [{ gate: 10, line: 3 }];

    const sharedGates = findSharedGates(gateLinesA, gateLinesB);
    expect(sharedGates).toHaveLength(1);
    expect(sharedGates[0].lineA).toBe(3);
    expect(sharedGates[0].lineB).toBe(3);
  });
});

// ============================================================================
// findSharedChannels Tests
// ============================================================================

describe('findSharedChannels', () => {
  it('should find channels complete in both charts', () => {
    // Both charts have gates 16 and 48 (channel 16-48)
    const gatesA = [16, 48, 1];
    const gatesB = [16, 48, 2];

    const channels = findSharedChannels(gatesA, gatesB);
    expect(channels).toContain('16-48');
  });

  it('should find electromagnetic channels between charts', () => {
    // Chart A has gate 7, Chart B has gate 31 (channel 7-31)
    const gatesA = [7];
    const gatesB = [31];

    const channels = findSharedChannels(gatesA, gatesB);
    expect(channels).toContain('7-31');
  });

  it('should return empty array when no channels formed', () => {
    const gatesA = [1, 3, 5];
    const gatesB = [2, 4, 6];

    const channels = findSharedChannels(gatesA, gatesB);
    expect(channels).toHaveLength(0);
  });

  it('should not duplicate channels', () => {
    // Channel present in both ways
    const gatesA = [13, 33];
    const gatesB = [13, 33];

    const channels = findSharedChannels(gatesA, gatesB);
    const channel13_33 = channels.filter(c => c === '13-33');
    expect(channel13_33.length).toBeLessThanOrEqual(1);
  });

  it('should use canonical channel format (lower gate first)', () => {
    const gatesA = [33, 13]; // Reverse order
    const gatesB = [13, 33];

    const channels = findSharedChannels(gatesA, gatesB);
    expect(channels).toContain('13-33');
    expect(channels).not.toContain('33-13');
  });

  it('should find multiple channels', () => {
    // Multiple channels: 13-33, 7-31
    const gatesA = [13, 33, 7];
    const gatesB = [13, 33, 31];

    const channels = findSharedChannels(gatesA, gatesB);
    expect(channels).toContain('13-33');
    expect(channels).toContain('7-31');
  });
});

// ============================================================================
// compareSharedCenters Tests
// ============================================================================

describe('compareSharedCenters', () => {
  it('should find centers defined in both charts', () => {
    const result = compareSharedCenters(
      ['Throat', 'Sacral', 'Spleen'],
      ['Throat', 'Spleen', 'Ajna']
    );

    expect(result.bothDefined).toContain('Throat');
    expect(result.bothDefined).toContain('Spleen');
    expect(result.bothDefined).not.toContain('Sacral');
    expect(result.bothDefined).not.toContain('Ajna');
  });

  it('should find centers undefined in both charts', () => {
    const result = compareSharedCenters(
      ['Throat'],
      ['Ajna']
    );

    // All centers except Throat and Ajna should be in bothUndefined
    expect(result.bothUndefined).toContain('Sacral');
    expect(result.bothUndefined).toContain('Root');
    expect(result.bothUndefined).toContain('Heart');
    expect(result.bothUndefined).not.toContain('Throat');
    expect(result.bothUndefined).not.toContain('Ajna');
  });

  it('should handle case-insensitive center names', () => {
    const result = compareSharedCenters(
      ['THROAT', 'sacral'],
      ['Throat', 'SACRAL']
    );

    expect(result.bothDefined).toContain('Throat');
    expect(result.bothDefined).toContain('Sacral');
  });

  it('should sort results alphabetically', () => {
    const result = compareSharedCenters(
      ['Sacral', 'Throat', 'Root'],
      ['Root', 'Throat', 'Sacral']
    );

    for (let i = 1; i < result.bothDefined.length; i++) {
      expect(result.bothDefined[i].localeCompare(result.bothDefined[i - 1])).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle empty center arrays', () => {
    const result = compareSharedCenters([], []);

    expect(result.bothDefined).toHaveLength(0);
    expect(result.bothUndefined).toHaveLength(9); // All 9 centers undefined
  });

  it('should include all nine centers in total', () => {
    // Compare arbitrary centers to ensure function executes
    compareSharedCenters(
      ['Throat', 'Sacral'],
      ['Ajna', 'Root']
    );

    // Verify ALL_CENTERS constant is correct
    expect(ALL_CENTERS.length).toBe(9);
  });
});

// ============================================================================
// getTypeDynamic Tests
// ============================================================================

describe('getTypeDynamic', () => {
  it('should return type dynamic for Generator + Projector', () => {
    const result = getTypeDynamic('Generator', 'Projector');

    expect(result.typeA).toBe('Generator');
    expect(result.typeB).toBe('Projector');
    expect(result.dynamic).toContain('Guidance');
  });

  it('should return same result regardless of type order', () => {
    const result1 = getTypeDynamic('Generator', 'Projector');
    const result2 = getTypeDynamic('Projector', 'Generator');

    // Dynamic description should be the same
    expect(result1.dynamic).toBe(result2.dynamic);
  });

  it('should handle same type combinations', () => {
    const result = getTypeDynamic('Generator', 'Generator');

    expect(result.typeA).toBe('Generator');
    expect(result.typeB).toBe('Generator');
    expect(result.dynamic).toBeTruthy();
    expect(result.dynamic.length).toBeGreaterThan(0);
  });

  it('should handle Manifesting Generator type', () => {
    const result = getTypeDynamic('Manifesting Generator', 'Projector');

    expect(result.typeA).toBe('Manifesting Generator');
    expect(result.typeB).toBe('Projector');
    expect(result.dynamic).toBeTruthy();
  });

  it('should handle Reflector type', () => {
    const result = getTypeDynamic('Reflector', 'Generator');

    expect(result.dynamic).toBeTruthy();
    expect(result.dynamic).toContain('Reflector');
  });

  it('should provide fallback for unknown type combinations', () => {
    const result = getTypeDynamic('UnknownType', 'AnotherUnknown');

    expect(result.dynamic).toBeTruthy();
    expect(result.dynamic).toContain('openness');
  });

  it('should describe all standard type combinations', () => {
    const types = ['Generator', 'Manifesting Generator', 'Manifestor', 'Projector', 'Reflector'];

    for (const typeA of types) {
      for (const typeB of types) {
        const result = getTypeDynamic(typeA, typeB);
        expect(result.dynamic).toBeTruthy();
        expect(result.dynamic.length).toBeGreaterThan(20);
      }
    }
  });
});

// ============================================================================
// calculateStarSystemOverlap Tests
// ============================================================================

describe('calculateStarSystemOverlap', () => {
  it('should find shared star systems', () => {
    const result = calculateStarSystemOverlap(
      mockClassificationResultA,
      mockClassificationResultB
    );

    // Both have Pleiades and Sirius above 10%
    expect(result.shared).toContain('Pleiades');
    expect(result.shared).toContain('Sirius');
  });

  it('should find divergent star systems', () => {
    const result = calculateStarSystemOverlap(
      mockClassificationResultA,
      mockClassificationResultB
    );

    // Arcturus is only significant in A, Orion only in B
    expect(result.divergent).toContain('Arcturus');
    expect(result.divergent).toContain('Orion');
  });

  it('should respect significance threshold', () => {
    const resultWithLowScores: ClassificationResult = {
      ...mockClassificationResultA,
      allies: [
        { system: 'Pleiades', percentage: 5 }, // Below threshold
        { system: 'Sirius', percentage: 3 },
      ],
    };

    const result = calculateStarSystemOverlap(
      resultWithLowScores,
      mockClassificationResultB
    );

    // Low percentage systems shouldn't be in shared
    expect(result.shared).not.toContain('Pleiades');
  });

  it('should sort results', () => {
    const result = calculateStarSystemOverlap(
      mockClassificationResultA,
      mockClassificationResultB
    );

    for (let i = 1; i < result.shared.length; i++) {
      expect(result.shared[i].localeCompare(result.shared[i - 1])).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle empty allies', () => {
    const emptyResult: ClassificationResult = {
      ...mockClassificationResultA,
      allies: [],
    };

    const result = calculateStarSystemOverlap(emptyResult, mockClassificationResultB);

    expect(result.shared).toHaveLength(0);
  });
});

// ============================================================================
// calculateCompatibilityScores Tests
// ============================================================================

describe('calculateCompatibilityScores', () => {
  it('should return scores between 0 and 100', () => {
    const result = calculateCompatibilityScores(
      [{ gate: 1, lineA: 1, lineB: 1 }],
      ['13-33'],
      { bothDefined: ['Throat'], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Projector', dynamic: 'test' },
      { shared: ['Pleiades'], divergent: [] }
    );

    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
    expect(result.communication).toBeGreaterThanOrEqual(0);
    expect(result.communication).toBeLessThanOrEqual(100);
    expect(result.energy).toBeGreaterThanOrEqual(0);
    expect(result.energy).toBeLessThanOrEqual(100);
  });

  it('should increase scores with shared gates', () => {
    const baseResult = calculateCompatibilityScores(
      [],
      [],
      { bothDefined: [], bothUndefined: ALL_CENTERS as unknown as string[] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    const withGates = calculateCompatibilityScores(
      [{ gate: 1, lineA: 1, lineB: 1 }, { gate: 2, lineA: 1, lineB: 1 }],
      [],
      { bothDefined: [], bothUndefined: ALL_CENTERS as unknown as string[] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    expect(withGates.overall).toBeGreaterThan(baseResult.overall);
  });

  it('should increase communication score with Throat center alignment', () => {
    const withoutThroat = calculateCompatibilityScores(
      [],
      [],
      { bothDefined: [], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    const withThroat = calculateCompatibilityScores(
      [],
      [],
      { bothDefined: ['Throat'], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    expect(withThroat.communication).toBeGreaterThan(withoutThroat.communication);
  });

  it('should increase energy score with Sacral center alignment', () => {
    const withoutSacral = calculateCompatibilityScores(
      [],
      [],
      { bothDefined: [], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    const withSacral = calculateCompatibilityScores(
      [],
      [],
      { bothDefined: ['Sacral'], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: [], divergent: [] }
    );

    expect(withSacral.energy).toBeGreaterThan(withoutSacral.energy);
  });

  it('should cap scores at 100', () => {
    // Create scenario with maximum bonuses
    const maxSharedGates: SharedGate[] = Array.from({ length: 20 }, (_, i) => ({
      gate: i + 1,
      lineA: 1,
      lineB: 1,
    }));

    const result = calculateCompatibilityScores(
      maxSharedGates,
      ['13-33', '7-31', '16-48', '1-8', '20-34'],
      { bothDefined: ALL_CENTERS as unknown as string[], bothUndefined: [] },
      { typeA: 'Generator', typeB: 'Generator', dynamic: 'test' },
      { shared: ['Pleiades', 'Sirius', 'Arcturus', 'Orion', 'Lyra'], divergent: [] }
    );

    expect(result.overall).toBe(100);
    expect(result.communication).toBeLessThanOrEqual(100);
    expect(result.energy).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// compareCharts Tests
// ============================================================================

describe('compareCharts', () => {
  it('should return all required fields', () => {
    const result = compareCharts(mockChartA, mockChartB);

    expect(result).toHaveProperty('sharedGates');
    expect(result).toHaveProperty('sharedChannels');
    expect(result).toHaveProperty('sharedCenters');
    expect(result).toHaveProperty('typeDynamic');
    expect(result).toHaveProperty('starSystemOverlap');
    expect(result).toHaveProperty('compatibilityScores');
  });

  it('should find shared gates when gate.lines not provided', () => {
    const result = compareCharts(mockChartA, mockChartB);

    // Both charts have gates 2, 7, and 48
    expect(result.sharedGates.map(g => g.gate)).toContain(2);
    expect(result.sharedGates.map(g => g.gate)).toContain(7);
    expect(result.sharedGates.map(g => g.gate)).toContain(48);
  });

  it('should use provided gate.lines', () => {
    const result = compareCharts(
      mockChartA,
      mockChartB,
      undefined,
      undefined,
      mockGateLinesA,
      mockGateLinesB
    );

    const gate2 = result.sharedGates.find(g => g.gate === 2);
    expect(gate2).toBeDefined();
    expect(gate2!.lineA).toBe(5);
    expect(gate2!.lineB).toBe(2);
  });

  it('should include classification results in star system overlap', () => {
    const result = compareCharts(
      mockChartA,
      mockChartB,
      mockClassificationResultA,
      mockClassificationResultB
    );

    expect(result.starSystemOverlap.shared.length).toBeGreaterThan(0);
  });

  it('should handle missing classification results', () => {
    const result = compareCharts(mockChartA, mockChartB);

    expect(result.starSystemOverlap.shared).toHaveLength(0);
    expect(result.starSystemOverlap.divergent).toHaveLength(0);
  });

  it('should correctly identify type dynamic', () => {
    const result = compareCharts(mockChartA, mockChartB);

    expect(result.typeDynamic.typeA).toBe('Generator');
    expect(result.typeDynamic.typeB).toBe('Projector');
    expect(result.typeDynamic.dynamic).toContain('Guidance');
  });
});

// ============================================================================
// compareSameChart Tests
// ============================================================================

describe('compareSameChart', () => {
  it('should return self-reflection dynamic', () => {
    const result = compareSameChart(mockChartA);

    expect(result.typeDynamic.typeA).toBe(mockChartA.type);
    expect(result.typeDynamic.typeB).toBe(mockChartA.type);
    expect(result.typeDynamic.dynamic).toContain('Self-reflection');
  });

  it('should have maximum shared elements', () => {
    const result = compareSameChart(mockChartA);

    // All gates should be shared
    expect(result.sharedGates.length).toBe(mockChartA.gates.length);

    // All defined centers should be in bothDefined
    expect(result.sharedCenters.bothDefined.length).toBe(mockChartA.centers.length);
  });

  it('should have identical line numbers for shared gates', () => {
    const result = compareSameChart(mockChartA);

    result.sharedGates.forEach(gate => {
      expect(gate.lineA).toBe(gate.lineB);
    });
  });
});

// ============================================================================
// areChartsIdentical Tests
// ============================================================================

describe('areChartsIdentical', () => {
  it('should return true for identical charts', () => {
    expect(areChartsIdentical(mockChartA, { ...mockChartA })).toBe(true);
  });

  it('should return false for different types', () => {
    const different = { ...mockChartA, type: 'Projector' };
    expect(areChartsIdentical(mockChartA, different)).toBe(false);
  });

  it('should return false for different gates', () => {
    const different = { ...mockChartA, gates: [1, 2, 3] };
    expect(areChartsIdentical(mockChartA, different)).toBe(false);
  });

  it('should return false for different centers', () => {
    const different = { ...mockChartA, centers: ['Throat'] };
    expect(areChartsIdentical(mockChartA, different)).toBe(false);
  });

  it('should return true regardless of array order', () => {
    const chartWithReorderedArrays: HDExtract = {
      ...mockChartA,
      centers: [...mockChartA.centers].reverse(),
      gates: [...mockChartA.gates].reverse(),
    };

    expect(areChartsIdentical(mockChartA, chartWithReorderedArrays)).toBe(true);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge Cases', () => {
  it('should handle charts with no gates', () => {
    const emptyChart: HDExtract = {
      type: 'Reflector',
      authority: 'Lunar',
      profile: '6/3',
      centers: [],
      channels: [],
      gates: [],
    };

    const result = compareCharts(emptyChart, mockChartA);

    expect(result.sharedGates).toHaveLength(0);
    expect(result.sharedChannels).toHaveLength(0);
  });

  it('should handle charts with no defined centers', () => {
    const nocentersChart: HDExtract = {
      type: 'Reflector',
      authority: 'Lunar',
      profile: '6/3',
      centers: [],
      channels: [],
      gates: [1, 2],
    };

    const result = compareCharts(nocentersChart, mockChartA);

    expect(result.sharedCenters.bothDefined).toHaveLength(0);
    expect(result.sharedCenters.bothUndefined.length).toBeGreaterThan(0);
  });

  it('should handle all gates being shared', () => {
    const result = compareCharts(mockChartA, mockChartA);

    expect(result.sharedGates.length).toBe(mockChartA.gates.length);
  });

  it('should handle large number of gates', () => {
    const manyGates: HDExtract = {
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: ['Throat', 'Sacral'],
      channels: [],
      gates: Array.from({ length: 26 }, (_, i) => i + 1),
    };

    const result = compareCharts(manyGates, mockChartA);

    expect(result.sharedGates.length).toBeGreaterThan(0);
    expect(result.compatibilityScores.overall).toBeGreaterThanOrEqual(50);
  });
});

// ============================================================================
// Channel Definition Tests
// ============================================================================

describe('Channel Definitions', () => {
  it('should have valid channel definitions', () => {
    for (const [_name, [gate1, gate2]] of Object.entries(CHANNEL_DEFINITIONS)) {
      expect(gate1).toBeGreaterThanOrEqual(1);
      expect(gate1).toBeLessThanOrEqual(64);
      expect(gate2).toBeGreaterThanOrEqual(1);
      expect(gate2).toBeLessThanOrEqual(64);
      expect(gate1).not.toBe(gate2);
    }
  });

  it('should include major channels', () => {
    // Check some well-known channels exist
    expect(CHANNEL_DEFINITIONS['13-33']).toBeDefined();
    expect(CHANNEL_DEFINITIONS['7-31']).toBeDefined();
    expect(CHANNEL_DEFINITIONS['34-57']).toBeDefined();
    expect(CHANNEL_DEFINITIONS['59-6']).toBeDefined();
  });
});

// ============================================================================
// Integration Test
// ============================================================================

describe('Integration', () => {
  it('should produce consistent results across multiple calls', () => {
    const result1 = compareCharts(mockChartA, mockChartB, mockClassificationResultA, mockClassificationResultB);
    const result2 = compareCharts(mockChartA, mockChartB, mockClassificationResultA, mockClassificationResultB);

    expect(result1.sharedGates).toEqual(result2.sharedGates);
    expect(result1.sharedChannels).toEqual(result2.sharedChannels);
    expect(result1.typeDynamic).toEqual(result2.typeDynamic);
    expect(result1.compatibilityScores).toEqual(result2.compatibilityScores);
  });

  it('should be symmetric for type dynamics', () => {
    const result1 = compareCharts(mockChartA, mockChartB);
    const result2 = compareCharts(mockChartB, mockChartA);

    expect(result1.typeDynamic.dynamic).toBe(result2.typeDynamic.dynamic);
  });
});

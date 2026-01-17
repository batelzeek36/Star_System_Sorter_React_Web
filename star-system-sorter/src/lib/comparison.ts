/**
 * Chart Comparison Algorithm
 *
 * Compares two Human Design charts to find shared attributes and calculate
 * relationship dynamics. This is used for generating relationship insights.
 *
 * The comparison identifies:
 * - Shared gates (same gate number, potentially different lines)
 * - Shared channels (electromagnetic connections)
 * - Shared/opposing centers (both defined or both undefined)
 * - Type dynamics (interaction patterns between HD types)
 * - Star system overlap (from classification results)
 * - Compatibility scores (overall, communication, energy)
 */

import { z } from 'zod';
import type { HDExtract, ClassificationResult } from './schemas';
import type { GateLine } from './lore-retriever';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Shared gate between two charts
 * Same gate number but potentially different line activations
 */
export interface SharedGate {
  gate: number;
  lineA: number;
  lineB: number;
}

/**
 * Centers comparison showing both defined and undefined matches
 */
export interface SharedCenters {
  bothDefined: string[];
  bothUndefined: string[];
}

/**
 * Type dynamic between two chart types
 */
export interface TypeDynamic {
  typeA: string;
  typeB: string;
  dynamic: string;
}

/**
 * Star system overlap between two charts
 */
export interface StarSystemOverlap {
  shared: string[];
  divergent: string[];
}

/**
 * Compatibility scores across different dimensions
 */
export interface CompatibilityScores {
  overall: number;
  communication: number;
  energy: number;
}

/**
 * Complete chart comparison result
 */
export interface ChartComparison {
  sharedGates: SharedGate[];
  sharedChannels: string[];
  sharedCenters: SharedCenters;
  typeDynamic: TypeDynamic;
  starSystemOverlap: StarSystemOverlap;
  compatibilityScores: CompatibilityScores;
}

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const SharedGateSchema = z.object({
  gate: z.number().int().min(1).max(64),
  lineA: z.number().int().min(1).max(6),
  lineB: z.number().int().min(1).max(6),
});

export const SharedCentersSchema = z.object({
  bothDefined: z.array(z.string()),
  bothUndefined: z.array(z.string()),
});

export const TypeDynamicSchema = z.object({
  typeA: z.string(),
  typeB: z.string(),
  dynamic: z.string(),
});

export const StarSystemOverlapSchema = z.object({
  shared: z.array(z.string()),
  divergent: z.array(z.string()),
});

export const CompatibilityScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
});

export const ChartComparisonSchema = z.object({
  sharedGates: z.array(SharedGateSchema),
  sharedChannels: z.array(z.string()),
  sharedCenters: SharedCentersSchema,
  typeDynamic: TypeDynamicSchema,
  starSystemOverlap: StarSystemOverlapSchema,
  compatibilityScores: CompatibilityScoresSchema,
});

// ============================================================================
// Constants
// ============================================================================

/**
 * All nine Human Design centers
 */
export const ALL_CENTERS = [
  'Head',
  'Ajna',
  'Throat',
  'G Center',
  'Heart',
  'Sacral',
  'Solar Plexus',
  'Spleen',
  'Root',
] as const;

/**
 * Complete channel definitions (gate pairs)
 * Each channel connects two gates between two centers
 */
export const CHANNEL_DEFINITIONS: Record<string, [number, number]> = {
  // Throat Channels
  '1-8': [1, 8],
  '7-31': [7, 31],
  '13-33': [13, 33],
  '16-48': [16, 48],
  '20-34': [20, 34],
  '20-57': [20, 57],
  '23-43': [23, 43],
  '35-36': [35, 36],
  '12-22': [12, 22],
  '45-21': [45, 21],
  '62-17': [62, 17],

  // G Center Channels
  '2-14': [2, 14],
  '10-34': [10, 34],
  '10-57': [10, 57],
  '10-20': [10, 20],
  '15-5': [15, 5],
  '25-51': [25, 51],
  '46-29': [46, 29],

  // Sacral Channels
  '3-60': [3, 60],
  '5-15': [5, 15],
  '9-52': [9, 52],
  '14-2': [14, 2],
  '27-50': [27, 50],
  '29-46': [29, 46],
  '34-10': [34, 10],
  '34-20': [34, 20],
  '34-57': [34, 57],
  '42-53': [42, 53],
  '59-6': [59, 6],

  // Solar Plexus Channels
  '6-59': [6, 59],
  '22-12': [22, 12],
  '30-41': [30, 41],
  '36-35': [36, 35],
  '37-40': [37, 40],
  '49-19': [49, 19],
  '55-39': [55, 39],

  // Heart Channels
  '21-45': [21, 45],
  '26-44': [26, 44],
  '40-37': [40, 37],
  '51-25': [51, 25],

  // Spleen Channels
  '18-58': [18, 58],
  '28-38': [28, 38],
  '32-54': [32, 54],
  '44-26': [44, 26],
  '48-16': [48, 16],
  '50-27': [50, 27],
  '57-10': [57, 10],
  '57-20': [57, 20],
  '57-34': [57, 34],

  // Root Channels
  '19-49': [19, 49],
  '38-28': [38, 28],
  '39-55': [39, 55],
  '41-30': [41, 30],
  '52-9': [52, 9],
  '53-42': [53, 42],
  '54-32': [54, 32],
  '58-18': [58, 18],
  '60-3': [60, 3],

  // Head/Ajna Channels
  '64-47': [64, 47],
  '61-24': [61, 24],
  '63-4': [63, 4],
  '47-64': [47, 64],
  '24-61': [24, 61],
  '4-63': [4, 63],
  '17-62': [17, 62],
  '43-23': [43, 23],
  '11-56': [11, 56],
};

/**
 * Type dynamics descriptions
 * Describes the interaction pattern between any two HD types
 */
const TYPE_DYNAMICS: Record<string, string> = {
  // Same type combinations
  'generator_generator': 'Mutual energy amplification; powerful when aligned on work, challenging when competing for projects',
  'manifestor_manifestor': 'Dual initiation power; effective when visions align, friction when paths conflict',
  'projector_projector': 'Mutual recognition dynamic; deep understanding possible, risk of waiting for each other',
  'reflector_reflector': 'Rare cosmic mirror; profound when environment supports, challenging in inconsistent settings',
  'manifesting-generator_manifesting-generator': 'High-speed collaboration; excellent multi-tasking together, risk of scattered energy',

  // Generator combinations
  'generator_manifesting-generator': 'Sustainable momentum; MG brings variety, Generator brings focus and endurance',
  'generator_manifestor': 'Initiation and response loop; Manifestor leads, Generator sustains with available energy',
  'generator_projector': 'Guidance dynamic; Projector directs Generator energy when recognized and invited',
  'generator_reflector': 'Sampling dynamic; Reflector mirrors Generator consistency, provides environmental wisdom',

  // Manifesting Generator combinations
  'manifesting-generator_manifestor': 'Fast-track collaboration; both move quickly, need to communicate to avoid collision',
  'manifesting-generator_projector': 'Efficient guidance; Projector helps MG focus scattered energy, MG energizes Projector',
  'manifesting-generator_reflector': 'Flexibility meets reflection; MG provides variety for Reflector to sample',

  // Manifestor combinations
  'manifestor_projector': 'Invitation-initiation balance; Manifestor informs, Projector waits for recognition',
  'manifestor_reflector': 'Impact and reflection; Manifestor initiates, Reflector reveals environmental impact',

  // Projector combinations
  'projector_reflector': 'Deep recognition; both non-energy types, mutual understanding of waiting and timing',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize type name for lookup
 */
function normalizeType(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get type dynamic key for two types (order-independent)
 */
function getTypeDynamicKey(typeA: string, typeB: string): string {
  const normalizedA = normalizeType(typeA);
  const normalizedB = normalizeType(typeB);

  // Sort alphabetically for consistent lookup
  const sorted = [normalizedA, normalizedB].sort();
  return `${sorted[0]}_${sorted[1]}`;
}

/**
 * Find channels present in a chart based on gates
 */
function findChannelsInChart(gates: number[]): string[] {
  const channels: string[] = [];
  const gateSet = new Set(gates);

  for (const [channelName, [gate1, gate2]] of Object.entries(CHANNEL_DEFINITIONS)) {
    if (gateSet.has(gate1) && gateSet.has(gate2)) {
      // Use canonical format (lower gate first)
      const canonicalName = gate1 < gate2 ? `${gate1}-${gate2}` : `${gate2}-${gate1}`;
      if (!channels.includes(canonicalName)) {
        channels.push(canonicalName);
      }
    }
  }

  return channels.sort();
}

/**
 * Find electromagnetic channels between two charts
 * An electromagnetic channel forms when one chart has one gate
 * and the other chart has the completing gate
 */
function findElectromagneticChannels(gatesA: number[], gatesB: number[]): string[] {
  const channels: string[] = [];
  const gateSetA = new Set(gatesA);
  const gateSetB = new Set(gatesB);

  for (const [channelName, [gate1, gate2]] of Object.entries(CHANNEL_DEFINITIONS)) {
    // Check if one gate is in A and the other in B (either direction)
    const aHasGate1 = gateSetA.has(gate1);
    const aHasGate2 = gateSetA.has(gate2);
    const bHasGate1 = gateSetB.has(gate1);
    const bHasGate2 = gateSetB.has(gate2);

    // Electromagnetic: A has one gate, B has the other (not both in same chart)
    const electromagnetic = (aHasGate1 && bHasGate2 && !aHasGate2 && !bHasGate1) ||
                           (aHasGate2 && bHasGate1 && !aHasGate1 && !bHasGate2);

    if (electromagnetic) {
      const canonicalName = gate1 < gate2 ? `${gate1}-${gate2}` : `${gate2}-${gate1}`;
      if (!channels.includes(canonicalName)) {
        channels.push(canonicalName);
      }
    }
  }

  return channels.sort();
}

// ============================================================================
// Core Comparison Functions
// ============================================================================

/**
 * Find shared gates between two charts
 * Returns gates that appear in both charts with their respective lines
 */
export function findSharedGates(
  gateLinesA: GateLine[],
  gateLinesB: GateLine[]
): SharedGate[] {
  const sharedGates: SharedGate[] = [];

  // Create map of gate -> line for chart B
  const gateBMap = new Map<number, number>();
  gateLinesB.forEach(gl => {
    gateBMap.set(gl.gate, gl.line);
  });

  // Find gates that appear in both charts
  gateLinesA.forEach(glA => {
    if (gateBMap.has(glA.gate)) {
      sharedGates.push({
        gate: glA.gate,
        lineA: glA.line,
        lineB: gateBMap.get(glA.gate)!,
      });
    }
  });

  // Sort by gate number for consistent output
  return sharedGates.sort((a, b) => a.gate - b.gate);
}

/**
 * Find shared channels between two charts
 * A channel is shared if both charts have both gates of the channel defined
 * Also finds electromagnetic connections where charts complement each other
 */
export function findSharedChannels(gatesA: number[], gatesB: number[]): string[] {
  // Find channels complete in chart A
  const channelsA = findChannelsInChart(gatesA);

  // Find channels complete in chart B
  const channelsB = findChannelsInChart(gatesB);

  // Find channels that are complete in both charts
  const bothComplete = channelsA.filter(ch => channelsB.includes(ch));

  // Find electromagnetic connections (one gate in each chart)
  const electromagnetic = findElectromagneticChannels(gatesA, gatesB);

  // Combine and deduplicate
  const allChannels = [...new Set([...bothComplete, ...electromagnetic])];

  return allChannels.sort();
}

/**
 * Compare defined centers between two charts
 */
export function compareSharedCenters(
  centersA: string[],
  centersB: string[]
): SharedCenters {
  const setA = new Set(centersA.map(c => c.toLowerCase()));
  const setB = new Set(centersB.map(c => c.toLowerCase()));
  const allCentersLower = ALL_CENTERS.map(c => c.toLowerCase());

  const bothDefined: string[] = [];
  const bothUndefined: string[] = [];

  allCentersLower.forEach((center, index) => {
    const aHas = setA.has(center);
    const bHas = setB.has(center);

    if (aHas && bHas) {
      bothDefined.push(ALL_CENTERS[index]);
    } else if (!aHas && !bHas) {
      bothUndefined.push(ALL_CENTERS[index]);
    }
  });

  return {
    bothDefined: bothDefined.sort(),
    bothUndefined: bothUndefined.sort(),
  };
}

/**
 * Get type dynamic description for two chart types
 */
export function getTypeDynamic(typeA: string, typeB: string): TypeDynamic {
  const key = getTypeDynamicKey(typeA, typeB);
  const dynamic = TYPE_DYNAMICS[key] || 'Unique interaction pattern; explore with openness and curiosity';

  return {
    typeA,
    typeB,
    dynamic,
  };
}

/**
 * Calculate star system overlap between two classification results
 */
export function calculateStarSystemOverlap(
  resultA: ClassificationResult,
  resultB: ClassificationResult
): StarSystemOverlap {
  // Get top systems from each chart (allies with significant percentage)
  const significantThreshold = 10; // Minimum percentage to be considered significant

  const topSystemsA = new Set(
    resultA.allies
      .filter(a => a.percentage >= significantThreshold)
      .map(a => a.system)
  );

  const topSystemsB = new Set(
    resultB.allies
      .filter(a => a.percentage >= significantThreshold)
      .map(a => a.system)
  );

  const shared: string[] = [];
  const divergent: string[] = [];

  // Find shared systems
  topSystemsA.forEach(system => {
    if (topSystemsB.has(system)) {
      shared.push(system);
    } else {
      divergent.push(system);
    }
  });

  // Add systems unique to B
  topSystemsB.forEach(system => {
    if (!topSystemsA.has(system) && !divergent.includes(system)) {
      divergent.push(system);
    }
  });

  return {
    shared: shared.sort(),
    divergent: divergent.sort(),
  };
}

/**
 * Calculate compatibility scores between two charts
 * Returns scores from 0-100 for overall, communication, and energy dimensions
 */
export function calculateCompatibilityScores(
  sharedGates: SharedGate[],
  sharedChannels: string[],
  sharedCenters: SharedCenters,
  typeDynamic: TypeDynamic,
  starOverlap: StarSystemOverlap
): CompatibilityScores {
  // Base scores
  let overall = 50;
  let communication = 50;
  let energy = 50;

  // Shared gates increase overall compatibility (max +20)
  const gateBonus = Math.min(sharedGates.length * 3, 20);
  overall += gateBonus;

  // Shared/electromagnetic channels significantly increase compatibility (max +15)
  const channelBonus = Math.min(sharedChannels.length * 5, 15);
  overall += channelBonus;
  energy += channelBonus;

  // Throat center alignment affects communication
  if (sharedCenters.bothDefined.includes('Throat')) {
    communication += 15;
  }

  // Ajna center alignment affects communication
  if (sharedCenters.bothDefined.includes('Ajna')) {
    communication += 10;
  }

  // G Center alignment affects overall connection
  if (sharedCenters.bothDefined.includes('G Center')) {
    overall += 10;
  }

  // Solar Plexus alignment affects emotional communication
  if (sharedCenters.bothDefined.includes('Solar Plexus')) {
    communication += 10;
    energy += 5;
  }

  // Sacral alignment affects energy
  if (sharedCenters.bothDefined.includes('Sacral')) {
    energy += 15;
  }

  // Star system overlap increases overall compatibility
  overall += starOverlap.shared.length * 5;

  // Type dynamics adjustment based on type combinations
  const typeKey = getTypeDynamicKey(typeDynamic.typeA, typeDynamic.typeB);

  // Energy types together have higher energy compatibility
  const energyTypes = ['generator', 'manifesting-generator', 'manifestor'];
  const typeANorm = normalizeType(typeDynamic.typeA);
  const typeBNorm = normalizeType(typeDynamic.typeB);

  if (energyTypes.includes(typeANorm) && energyTypes.includes(typeBNorm)) {
    energy += 10;
  }

  // Projector combinations have higher communication potential
  if (typeANorm === 'projector' || typeBNorm === 'projector') {
    communication += 10;
  }

  // Cap all scores at 100
  return {
    overall: Math.min(Math.max(overall, 0), 100),
    communication: Math.min(Math.max(communication, 0), 100),
    energy: Math.min(Math.max(energy, 0), 100),
  };
}

// ============================================================================
// Main Comparison Function
// ============================================================================

/**
 * Compare two HD charts and return a comprehensive comparison result
 *
 * @param extractA - First chart's HDExtract
 * @param extractB - Second chart's HDExtract
 * @param resultA - First chart's ClassificationResult (optional, for star system overlap)
 * @param resultB - Second chart's ClassificationResult (optional, for star system overlap)
 * @param gateLinesA - Optional specific gate.line pairs for chart A
 * @param gateLinesB - Optional specific gate.line pairs for chart B
 * @returns ChartComparison with all comparison dimensions
 */
export function compareCharts(
  extractA: HDExtract,
  extractB: HDExtract,
  resultA?: ClassificationResult,
  resultB?: ClassificationResult,
  gateLinesA?: GateLine[],
  gateLinesB?: GateLine[]
): ChartComparison {
  // Convert gates to gate.line format if not provided
  const gatesWithLinesA: GateLine[] = gateLinesA || extractA.gates.map(g => ({ gate: g, line: 1 }));
  const gatesWithLinesB: GateLine[] = gateLinesB || extractB.gates.map(g => ({ gate: g, line: 1 }));

  // Find shared gates
  const sharedGates = findSharedGates(gatesWithLinesA, gatesWithLinesB);

  // Find shared channels
  const sharedChannels = findSharedChannels(extractA.gates, extractB.gates);

  // Compare centers
  const sharedCenters = compareSharedCenters(extractA.centers, extractB.centers);

  // Get type dynamic
  const typeDynamic = getTypeDynamic(extractA.type, extractB.type);

  // Calculate star system overlap if classification results provided
  const starSystemOverlap: StarSystemOverlap = resultA && resultB
    ? calculateStarSystemOverlap(resultA, resultB)
    : { shared: [], divergent: [] };

  // Calculate compatibility scores
  const compatibilityScores = calculateCompatibilityScores(
    sharedGates,
    sharedChannels,
    sharedCenters,
    typeDynamic,
    starSystemOverlap
  );

  return {
    sharedGates,
    sharedChannels,
    sharedCenters,
    typeDynamic,
    starSystemOverlap,
    compatibilityScores,
  };
}

/**
 * Compare two charts when they are identical (self-reflection mode)
 * Returns a special comparison for same-person analysis
 */
export function compareSameChart(
  extract: HDExtract,
  result?: ClassificationResult,
  gateLines?: GateLine[]
): ChartComparison {
  const comparison = compareCharts(extract, extract, result, result, gateLines, gateLines);

  // Adjust the type dynamic for self-reflection
  comparison.typeDynamic = {
    typeA: extract.type,
    typeB: extract.type,
    dynamic: `Self-reflection: Understanding your own ${extract.type} nature more deeply; exploring inner patterns and potential`,
  };

  return comparison;
}

/**
 * Check if two charts are identical
 */
export function areChartsIdentical(extractA: HDExtract, extractB: HDExtract): boolean {
  return (
    extractA.type === extractB.type &&
    extractA.authority === extractB.authority &&
    extractA.profile === extractB.profile &&
    JSON.stringify([...extractA.centers].sort()) === JSON.stringify([...extractB.centers].sort()) &&
    JSON.stringify([...extractA.channels].sort((a, b) => a - b)) === JSON.stringify([...extractB.channels].sort((a, b) => a - b)) &&
    JSON.stringify([...extractA.gates].sort((a, b) => a - b)) === JSON.stringify([...extractB.gates].sort((a, b) => a - b))
  );
}

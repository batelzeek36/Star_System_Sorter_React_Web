/**
 * Lore Retriever - Chunked I Ching Data Fetching
 *
 * Fetches I Ching lore data for only the gates present in compared charts,
 * avoiding context explosion by loading ~5-10KB instead of 190KB.
 *
 * This module implements the chunked retrieval pattern to keep context
 * size under 15KB for typical chart pairs.
 */

import { z } from 'zod';
import { loreBundle } from './lore.bundle';
import type { HDExtract } from './schemas';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Gate/Line pair representing a specific position in a chart
 */
export interface GateLine {
  gate: number;
  line: number;
}

/**
 * Star system mapping for a gate
 */
export interface StarMapping {
  system: string;
  weight: number;
  why: string;
}

/**
 * Complete lore data for a single gate.line
 */
export interface GateLore {
  gate: number;
  line: number;
  hexagramName: string;
  iChingMeaning: string;
  starMappings: StarMapping[];
}

/**
 * Aggregated lore data for chart comparison
 */
export interface RelevantLore {
  chartAGates: GateLore[];
  chartBGates: GateLore[];
  sharedGates: GateLore[];
  totalContextSize: number; // bytes, should be <15KB
}

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const GateLineSchema = z.object({
  gate: z.number().int().min(1).max(64),
  line: z.number().int().min(1).max(6),
});

export const StarMappingSchema = z.object({
  system: z.string(),
  weight: z.number(),
  why: z.string(),
});

export const GateLoreSchema = z.object({
  gate: z.number().int().min(1).max(64),
  line: z.number().int().min(1).max(6),
  hexagramName: z.string(),
  iChingMeaning: z.string(),
  starMappings: z.array(StarMappingSchema),
});

export const RelevantLoreSchema = z.object({
  chartAGates: z.array(GateLoreSchema),
  chartBGates: z.array(GateLoreSchema),
  sharedGates: z.array(GateLoreSchema),
  totalContextSize: z.number().int().min(0),
});

// ============================================================================
// I Ching Hexagram Data (64 Gates)
// ============================================================================

/**
 * I Ching hexagram names and meanings
 * Each gate corresponds to one of the 64 hexagrams
 */
const HEXAGRAM_DATA: Record<number, { name: string; meaning: string }> = {
  1: { name: 'The Creative', meaning: 'Pure creative force; originality, self-expression, unique direction' },
  2: { name: 'The Receptive', meaning: 'Receptive guidance; direction through response, magnetic leadership' },
  3: { name: 'Difficulty at the Beginning', meaning: 'Initial struggle; ordering chaos, innovation through trial' },
  4: { name: 'Youthful Folly', meaning: 'Mental formulation; understanding through experience' },
  5: { name: 'Waiting', meaning: 'Fixed rhythms; patience, timing, natural pace' },
  6: { name: 'Conflict', meaning: 'Friction; emotional intimacy, boundaries, resolution' },
  7: { name: 'The Army', meaning: 'Self role in leadership; democratic influence, council' },
  8: { name: 'Holding Together', meaning: 'Contribution; unique expression, making a mark' },
  9: { name: 'Taming Power of the Small', meaning: 'Focus; detail attention, concentration' },
  10: { name: 'Treading', meaning: 'Self behavior; embodiment, walking the talk' },
  11: { name: 'Peace', meaning: 'Ideas; harmony, new perspectives, idealism' },
  12: { name: 'Standstill', meaning: 'Caution; stillness, retreat, circumspection' },
  13: { name: 'Fellowship', meaning: 'Listening; shared secrets, collective memory' },
  14: { name: 'Great Possession', meaning: 'Power skills; wealth creation, stewardship' },
  15: { name: 'Modesty', meaning: 'Extremes; magnetic pull, influence through humility' },
  16: { name: 'Enthusiasm', meaning: 'Skills; talent, enthusiasm, identification' },
  17: { name: 'Following', meaning: 'Opinions; following, service through agreement' },
  18: { name: 'Work on What Has Been Spoiled', meaning: 'Correction; judgment, fixing what is broken' },
  19: { name: 'Approach', meaning: 'Wanting; approach, need, sensitivity' },
  20: { name: 'Contemplation', meaning: 'The Now; presence, contemplation, awareness' },
  21: { name: 'Biting Through', meaning: 'Hunter/Huntress; control, enforcing boundaries' },
  22: { name: 'Grace', meaning: 'Openness; grace, charm, social presentation' },
  23: { name: 'Splitting Apart', meaning: 'Assimilation; breaking down, understanding complexity' },
  24: { name: 'Return', meaning: 'Rationalization; mental processing, return to truth' },
  25: { name: 'Innocence', meaning: 'Spirit of self; innocence, unconditional love' },
  26: { name: 'Taming Power of the Great', meaning: 'Egoist; memory, accumulation, storage' },
  27: { name: 'Nourishment', meaning: 'Caring; nourishment, sustenance, provision' },
  28: { name: 'Preponderance of the Great', meaning: 'Game player; struggle, transition, risk' },
  29: { name: 'The Abysmal', meaning: 'Perseverance; commitment, saying yes, devotion' },
  30: { name: 'The Clinging', meaning: 'Feelings; recognition, desire for attention' },
  31: { name: 'Influence', meaning: 'Leading; influence, democratic sharing' },
  32: { name: 'Duration', meaning: 'Continuity; endurance, adaptation, transformation' },
  33: { name: 'Retreat', meaning: 'Privacy; retreat, memory, consolidation' },
  34: { name: 'Great Power', meaning: 'Power; force, autonomy, assertion' },
  35: { name: 'Progress', meaning: 'Change; progress, advancement, evolution' },
  36: { name: 'Darkening of the Light', meaning: 'Crisis; experience through darkness, hidden light' },
  37: { name: 'The Family', meaning: 'Friendship; family, community, belonging' },
  38: { name: 'Opposition', meaning: 'Fighter; opposition, individual perspective' },
  39: { name: 'Obstruction', meaning: 'Provocation; obstruction, spirit ignition' },
  40: { name: 'Deliverance', meaning: 'Aloneness; liberation, delivery, release' },
  41: { name: 'Decrease', meaning: 'Contraction; limitation, fantasy, desire' },
  42: { name: 'Increase', meaning: 'Growth; increase, expansion, maturation' },
  43: { name: 'Breakthrough', meaning: 'Insight; breakthrough, determination, resolution' },
  44: { name: 'Coming to Meet', meaning: 'Alertness; patterns, instinct, vigilance' },
  45: { name: 'Gathering Together', meaning: 'Gatherer; community, gathering, synthesis' },
  46: { name: 'Pushing Upward', meaning: 'Determination of self; success, advancement' },
  47: { name: 'Oppression', meaning: 'Realization; mental oppression, breakthrough' },
  48: { name: 'The Well', meaning: 'Depth; resources, wisdom, depth of knowledge' },
  49: { name: 'Revolution', meaning: 'Principles; revolution, transformation, reform' },
  50: { name: 'The Cauldron', meaning: 'Values; preservation, nourishment of values' },
  51: { name: 'The Arousing', meaning: 'Shock; initiation, awakening, catalyst' },
  52: { name: 'Keeping Still', meaning: 'Stillness; concentration, mountain, restraint' },
  53: { name: 'Development', meaning: 'Beginnings; development, patience, process' },
  54: { name: 'The Marrying Maiden', meaning: 'Ambition; drive, aspiration, transformation' },
  55: { name: 'Abundance', meaning: 'Spirit; abundance, fullness, emotional depth' },
  56: { name: 'The Wanderer', meaning: 'Stimulation; seeking, wandering, experience' },
  57: { name: 'The Gentle', meaning: 'Intuition; penetration, gentleness, clarity' },
  58: { name: 'The Joyous', meaning: 'Aliveness; joy, vitality, stimulation' },
  59: { name: 'Dispersion', meaning: 'Intimacy; dissolution, breaking barriers, bonding' },
  60: { name: 'Limitation', meaning: 'Acceptance; limitation, structure, boundaries' },
  61: { name: 'Inner Truth', meaning: 'Mystery; inner truth, inspiration, knowing' },
  62: { name: 'Preponderance of the Small', meaning: 'Details; precision, expression of detail' },
  63: { name: 'After Completion', meaning: 'Doubt; skepticism, questioning, logic' },
  64: { name: 'Before Completion', meaning: 'Confusion; transitions, completion, resolution' },
};

/**
 * Line-specific modifiers for I Ching meanings
 * Each line adds nuance to the hexagram's base meaning
 */
const LINE_MODIFIERS: Record<number, string> = {
  1: 'foundational; investigative; establishing secure ground',
  2: 'natural; hermitic; projecting potential outward',
  3: 'adaptive; experimental; learning through trial',
  4: 'influential; network-oriented; externally focused',
  5: 'universal; heretical; projecting to the collective',
  6: 'transitional; role-model; transcendent wisdom',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get star system mappings for a specific gate from the lore bundle
 * Returns an array of systems that this gate contributes to
 */
function getStarMappingsForGate(gate: number): StarMapping[] {
  const mappings: StarMapping[] = [];

  loreBundle.rules.forEach(rule => {
    // Check if this rule applies to the gate
    if (rule.if.gatesAny && rule.if.gatesAny.includes(gate)) {
      rule.systems.forEach(systemWeight => {
        // Find the system label from systems array
        const system = loreBundle.systems.find(s => s.id === systemWeight.id);
        if (system) {
          mappings.push({
            system: system.label,
            weight: systemWeight.w,
            why: rule.rationale,
          });
        }
      });
    }
  });

  return mappings;
}

/**
 * Build GateLore object for a specific gate.line
 */
function buildGateLore(gate: number, line: number): GateLore {
  const hexagramInfo = HEXAGRAM_DATA[gate];
  const lineModifier = LINE_MODIFIERS[line];

  if (!hexagramInfo) {
    throw new Error(`Invalid gate number: ${gate}. Must be between 1 and 64.`);
  }

  if (!lineModifier) {
    throw new Error(`Invalid line number: ${line}. Must be between 1 and 6.`);
  }

  return {
    gate,
    line,
    hexagramName: hexagramInfo.name,
    iChingMeaning: `${hexagramInfo.meaning}. Line ${line}: ${lineModifier}`,
    starMappings: getStarMappingsForGate(gate),
  };
}

/**
 * Calculate the approximate size in bytes of the lore data
 */
function calculateContextSize(loreArray: GateLore[]): number {
  // Approximate size by stringifying and measuring length
  const jsonString = JSON.stringify(loreArray);
  // UTF-8 bytes (approximate)
  return new TextEncoder().encode(jsonString).length;
}

/**
 * Extract unique gates from an HDExtract
 * Since HDExtract.gates is just numbers without lines, we'll use line 1 as default
 * unless gateLines are explicitly provided
 */
function extractGateLines(extract: HDExtract, gateLines?: GateLine[]): GateLine[] {
  if (gateLines && gateLines.length > 0) {
    // Use provided gate.line pairs
    return gateLines.filter(gl => gl.gate >= 1 && gl.gate <= 64 && gl.line >= 1 && gl.line <= 6);
  }

  // Default: use gate numbers with line 1
  // In a real implementation, this would come from the chart data
  return extract.gates
    .filter(gate => gate >= 1 && gate <= 64)
    .map(gate => ({ gate, line: 1 }));
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Fetch lore data for a single gate.line
 *
 * @param gate - Gate number (1-64)
 * @param line - Line number (1-6)
 * @returns GateLore object with hexagram info and star mappings
 */
export function fetchGateLore(gate: number, line: number = 1): GateLore {
  if (gate < 1 || gate > 64) {
    throw new Error(`Invalid gate number: ${gate}. Must be between 1 and 64.`);
  }
  if (line < 1 || line > 6) {
    throw new Error(`Invalid line number: ${line}. Must be between 1 and 6.`);
  }
  return buildGateLore(gate, line);
}

/**
 * Fetch lore data for multiple gate.line pairs
 *
 * @param gateLines - Array of {gate, line} objects
 * @returns Array of GateLore objects
 */
export function fetchMultipleGateLore(gateLines: GateLine[]): GateLore[] {
  return gateLines.map(gl => fetchGateLore(gl.gate, gl.line));
}

/**
 * Get relevant lore for a single chart
 *
 * @param extract - HDExtract from the chart
 * @param gateLines - Optional array of specific gate.line pairs
 * @returns Array of GateLore for the chart's gates
 */
export function getChartLore(
  extract: HDExtract,
  gateLines?: GateLine[]
): GateLore[] {
  const extractedGateLines = extractGateLines(extract, gateLines);
  return fetchMultipleGateLore(extractedGateLines);
}

/**
 * Get relevant lore for comparing two charts
 *
 * This is the main function for chart comparison insight generation.
 * It fetches I Ching data for ONLY the gates present in both charts,
 * keeping context size under 15KB.
 *
 * @param chartA - First chart's HDExtract
 * @param chartB - Second chart's HDExtract
 * @param gateLinesA - Optional specific gate.line pairs for chart A
 * @param gateLinesB - Optional specific gate.line pairs for chart B
 * @returns RelevantLore object with categorized gate data
 */
export function getRelevantLoreForCharts(
  chartA: HDExtract,
  chartB: HDExtract,
  gateLinesA?: GateLine[],
  gateLinesB?: GateLine[]
): RelevantLore {
  // Extract gate.line pairs from both charts
  const chartAGateLines = extractGateLines(chartA, gateLinesA);
  const chartBGateLines = extractGateLines(chartB, gateLinesB);

  // Find shared gates (same gate number, regardless of line)
  const chartAGateNumbers = new Set(chartAGateLines.map(gl => gl.gate));
  const chartBGateNumbers = new Set(chartBGateLines.map(gl => gl.gate));

  const sharedGateNumbers = new Set<number>();
  chartAGateNumbers.forEach(gate => {
    if (chartBGateNumbers.has(gate)) {
      sharedGateNumbers.add(gate);
    }
  });

  // Build lore arrays
  const chartALoreArray = chartAGateLines.map(gl => fetchGateLore(gl.gate, gl.line));
  const chartBLoreArray = chartBGateLines.map(gl => fetchGateLore(gl.gate, gl.line));

  // For shared gates, we include both chart A and B versions to show line differences
  const sharedGatesLore: GateLore[] = [];
  sharedGateNumbers.forEach(gate => {
    const glA = chartAGateLines.find(gl => gl.gate === gate);
    const glB = chartBGateLines.find(gl => gl.gate === gate);

    if (glA) {
      // Add chart A's version of the shared gate
      sharedGatesLore.push(fetchGateLore(glA.gate, glA.line));
    }
    if (glB && glA && glB.line !== glA.line) {
      // Add chart B's version if the line is different
      sharedGatesLore.push(fetchGateLore(glB.gate, glB.line));
    }
  });

  // Calculate total context size
  const allLore = [...chartALoreArray, ...chartBLoreArray];
  const totalContextSize = calculateContextSize(allLore);

  return {
    chartAGates: chartALoreArray,
    chartBGates: chartBLoreArray,
    sharedGates: sharedGatesLore,
    totalContextSize,
  };
}

/**
 * Validate that context size is within acceptable limits
 *
 * @param lore - RelevantLore object to check
 * @param maxSize - Maximum allowed size in bytes (default: 15KB)
 * @returns true if within limits, false otherwise
 */
export function isContextSizeValid(lore: RelevantLore, maxSize: number = 15 * 1024): boolean {
  return lore.totalContextSize <= maxSize;
}

/**
 * Get hexagram info for a specific gate
 * Useful for quick lookups without full lore
 */
export function getHexagramInfo(gate: number): { name: string; meaning: string } | null {
  if (gate < 1 || gate > 64) {
    return null;
  }
  return HEXAGRAM_DATA[gate] || null;
}

/**
 * Get all gates that have star system mappings in the lore bundle
 * Useful for understanding which gates are "activated" in the lore
 */
export function getGatesWithStarMappings(): number[] {
  const gatesWithMappings = new Set<number>();

  loreBundle.rules.forEach(rule => {
    if (rule.if.gatesAny) {
      rule.if.gatesAny.forEach(gate => gatesWithMappings.add(gate));
    }
  });

  return Array.from(gatesWithMappings).sort((a, b) => a - b);
}

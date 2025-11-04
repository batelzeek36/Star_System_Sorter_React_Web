/**
 * Core Scoring Algorithm for React Web
 * 
 * Implements weighted scoring logic for star system classification.
 * This is the deterministic algorithm that classifies users into star systems
 * based on their Human Design birth chart data.
 */

import { loreBundle } from './lore.bundle';
import type { LoreRule } from './schemas';
import type { GateLineMap } from './gateline-map';
import { 
  DEFAULT_SPARSIFY_CONFIG, 
  sparsifyLine, 
  type SparsifyConfig,
  type MapEntry 
} from './scorer-config';

/**
 * Compute SHA-256 hash of a string
 * Returns first 16 characters for brevity
 */
function computeHash(input: string): string {
  // Use browser's SubtleCrypto API if available, otherwise use a simple hash
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // For browser environment, we'll use a synchronous fallback
    // since SubtleCrypto is async
    return simpleHash(input);
  }
  return simpleHash(input);
}

/**
 * Simple deterministic hash function for input data
 * Returns first 16 characters
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex and pad to 16 characters
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex).substring(0, 16);
}

/**
 * Compute input hash from normalized HD data
 * Normalizes by sorting arrays to ensure deterministic output
 */
function computeInputHash(extract: HDExtract): string {
  // Create normalized version with sorted arrays
  const normalized = {
    type: extract.type || '',
    authority: extract.authority || '',
    profile: extract.profile || '',
    centers: [...(extract.centers || [])].sort(),
    channels: [...(extract.channels || [])].sort((a, b) => a - b),
    gates: [...(extract.gates || [])].sort((a, b) => a - b),
  };
  
  // Convert to stable JSON string
  const jsonStr = JSON.stringify(normalized);
  
  // Compute hash
  return computeHash(jsonStr);
}

export interface Placement {
  planet: string;
  gate: number;
  line: number;
  type: 'personality' | 'design';
}

export interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
  placements: Placement[];
}

export interface Canon {
  version: string;
  systems: Record<string, {
    weights: Record<string, number>;
    why: string;
  }>;
}

export interface Contributor {
  key: string;
  weight: number;
  label: string;
}

/**
 * Enhanced Contributor with provenance metadata
 * Includes rule ID, rationale, sources, and confidence level
 */
export interface EnhancedContributor {
  ruleId: string;
  key: string;
  weight: number;
  label: string;
  rationale: string;
  sources: string[];  // source IDs
  confidence: 1 | 2 | 3 | 4 | 5;
}

export interface SystemScore {
  system: string;
  rawScore: number;
  percentage: number;
  contributors: Contributor[];
  enhancedContributors?: EnhancedContributor[];
  coreScore?: number;
  secondaryScore?: number;
  corePercentage?: number;
  secondaryPercentage?: number;
}

export interface ClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  allies: Array<{ system: string; percentage: number }>;
  secondaryTraits?: Array<{ system: string; percentage: number }>;
  percentages: Record<string, number>;
  corePercentages?: Record<string, number>;
  secondaryPercentages?: Record<string, number>;
  contributorsPerSystem: Record<string, string[]>;
  contributorsWithWeights: Record<string, Contributor[]>;
  enhancedContributorsWithWeights?: Record<string, EnhancedContributor[]>;
  meta: {
    canonVersion: string;
    canonChecksum: string;
    lore_version?: string;
    rules_hash?: string;
    input_hash?: string;
  };
}

/**
 * Match HD attributes to lore rules
 * Returns array of matched rules with their system weights
 */
function matchLoreRules(extract: HDExtract): Array<{
  rule: LoreRule;
  matchedAttribute: string;
  attributeType: string;
}> {
  const matches: Array<{
    rule: LoreRule;
    matchedAttribute: string;
    attributeType: string;
  }> = [];

  loreBundle.rules.forEach(rule => {
    // Check type match
    if (rule.if.typeAny && extract.type) {
      const normalizedType = extract.type;
      if (rule.if.typeAny.includes(normalizedType)) {
        matches.push({
          rule,
          matchedAttribute: normalizedType,
          attributeType: 'type',
        });
      }
    }

    // Check authority match
    if (rule.if.authorityAny && extract.authority) {
      const normalizedAuthority = extract.authority;
      if (rule.if.authorityAny.includes(normalizedAuthority)) {
        matches.push({
          rule,
          matchedAttribute: normalizedAuthority,
          attributeType: 'authority',
        });
      }
    }

    // Check profile match
    if (rule.if.profileAny && extract.profile) {
      if (rule.if.profileAny.includes(extract.profile)) {
        matches.push({
          rule,
          matchedAttribute: extract.profile,
          attributeType: 'profile',
        });
      }
    }

    // Check centers match
    if (rule.if.centersAny && extract.centers && extract.centers.length > 0) {
      rule.if.centersAny.forEach(ruleCenter => {
        if (extract.centers.includes(ruleCenter)) {
          matches.push({
            rule,
            matchedAttribute: ruleCenter,
            attributeType: 'center',
          });
        }
      });
    }

    // Check channels match
    if (rule.if.channelsAny && extract.channels && extract.channels.length > 0) {
      rule.if.channelsAny.forEach(ruleChannel => {
        // Parse channel string (e.g., "13-33") to check against numeric channels
        const channelParts = ruleChannel.split('-').map(Number);
        if (channelParts.length === 2) {
          const [gate1, gate2] = channelParts;
          // Check if both gates of the channel are present
          if (extract.gates.includes(gate1) && extract.gates.includes(gate2)) {
            matches.push({
              rule,
              matchedAttribute: ruleChannel,
              attributeType: 'channel',
            });
          }
        }
      });
    }

    // Check gates match
    if (rule.if.gatesAny && extract.gates && extract.gates.length > 0) {
      rule.if.gatesAny.forEach(ruleGate => {
        if (extract.gates.includes(ruleGate)) {
          matches.push({
            rule,
            matchedAttribute: String(ruleGate),
            attributeType: 'gate',
          });
        }
      });
    }
  });

  return matches;
}

/**
 * Generate attribute keys from HD extract
 */
function generateAttributeKeys(extract: HDExtract): string[] {
  const keys: string[] = [];

  if (extract.type) {
    keys.push(`type_${extract.type.toLowerCase().replace(/\s+/g, '_')}`);
  }

  if (extract.authority) {
    keys.push(`authority_${extract.authority.toLowerCase().replace(/\s+/g, '_')}`);
  }

  if (extract.profile) {
    keys.push(`profile_${extract.profile.replace('/', '_')}`);
  }

  if (extract.centers && extract.centers.length > 0) {
    extract.centers.forEach(center => {
      keys.push(`center_${center.toLowerCase().replace(/\s+/g, '_')}_defined`);
    });
  }

  if (extract.channels && extract.channels.length > 0) {
    extract.channels.forEach(channel => {
      keys.push(`channel_${channel}`);
    });
  }

  if (extract.gates && extract.gates.length > 0) {
    extract.gates.forEach(gate => {
      keys.push(`gate_${gate}`);
    });
  }

  return keys;
}

/**
 * Create human-readable label from attribute type and value
 */
function createLabelFromAttribute(attributeType: string, attributeValue: string): string {
  switch (attributeType) {
    case 'type':
      return `Type: ${attributeValue}`;
    case 'authority':
      return `Authority: ${attributeValue}`;
    case 'profile':
      return `Profile: ${attributeValue}`;
    case 'center':
      return `Center: ${attributeValue}`;
    case 'channel':
      return `Channel: ${attributeValue}`;
    case 'gate':
      return `Gate: ${attributeValue}`;
    default:
      return attributeValue;
  }
}

/**
 * Create human-readable label from attribute key
 */
function createLabel(key: string): string {
  if (key.startsWith('type_')) {
    const type = key.replace('type_', '').replace(/_/g, ' ');
    return `Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  if (key.startsWith('authority_')) {
    const auth = key.replace('authority_', '').replace(/_/g, ' ');
    return `Authority: ${auth.charAt(0).toUpperCase() + auth.slice(1)}`;
  }

  if (key.startsWith('profile_')) {
    const profile = key.replace('profile_', '').replace('_', '/');
    return `Profile: ${profile}`;
  }

  if (key.startsWith('center_')) {
    const center = key.replace('center_', '').replace('_defined', '').replace(/_/g, ' ');
    return `Center: ${center.charAt(0).toUpperCase() + center.slice(1)}`;
  }

  if (key.startsWith('channel_')) {
    return `Channel: ${key.replace('channel_', '')}`;
  }

  if (key.startsWith('gate_')) {
    return `Gate: ${key.replace('gate_', '')}`;
  }

  return key;
}

/**
 * Create enhanced contributors from matched lore rules
 * Maps each matched rule to contributors for each system it affects
 */
function createEnhancedContributors(
  matches: Array<{
    rule: LoreRule;
    matchedAttribute: string;
    attributeType: string;
  }>
): Record<string, EnhancedContributor[]> {
  const contributorsBySystem: Record<string, EnhancedContributor[]> = {};

  matches.forEach(({ rule, matchedAttribute, attributeType }) => {
    // Each rule can contribute to multiple systems
    rule.systems.forEach(systemWeight => {
      const systemId = systemWeight.id;
      
      if (!contributorsBySystem[systemId]) {
        contributorsBySystem[systemId] = [];
      }

      const contributor: EnhancedContributor = {
        ruleId: rule.id,
        key: `${attributeType}_${matchedAttribute}`,
        weight: systemWeight.w,
        label: createLabelFromAttribute(attributeType, matchedAttribute),
        rationale: rule.rationale,
        sources: rule.sources,
        confidence: rule.confidence,
      };

      contributorsBySystem[systemId].push(contributor);
    });
  });

  return contributorsBySystem;
}

/**
 * Compute raw score for a single system
 */
function computeSystemScore(
  systemWeights: Record<string, number>,
  attributeKeys: string[]
): { rawScore: number; contributors: Contributor[] } {
  let rawScore = 0;
  const contributors: Contributor[] = [];

  attributeKeys.forEach(key => {
    const weight = systemWeights[key];
    if (weight !== undefined && weight > 0) {
      rawScore += weight;
      contributors.push({ key, weight, label: createLabel(key) });
    }
  });

  return { rawScore, contributors };
}

/**
 * Normalize scores to percentages using largest remainder (Hamilton) method
 * Ensures percentages sum to exactly 100.00 with 2 decimal places
 */
function normalizeScores(
  scores: Array<{ system: string; rawScore: number }>
): Record<string, number> {
  const totalScore = scores.reduce((sum, s) => sum + s.rawScore, 0);

  if (totalScore === 0) {
    const percentages: Record<string, number> = {};
    scores.forEach(s => { percentages[s.system] = 0; });
    return percentages;
  }

  // Calculate exact percentages
  const exactPercentages = scores.map(s => ({
    system: s.system,
    exact: (s.rawScore / totalScore) * 100,
  }));

  // Floor to 2 decimal places and calculate remainders
  const floored = exactPercentages.map(p => {
    const flooredValue = Math.floor(p.exact * 100) / 100;
    const remainder = p.exact - flooredValue;
    return {
      system: p.system,
      floored: flooredValue,
      remainder,
    };
  });

  // Calculate how many 0.01 increments we need to distribute
  const currentSum = floored.reduce((sum, p) => sum + p.floored, 0);
  const roundedCurrentSum = Math.round(currentSum * 100) / 100;
  let incrementsNeeded = Math.round((100.00 - roundedCurrentSum) * 100);

  // Sort by remainder descending (largest remainder method)
  const sorted = [...floored].sort((a, b) => b.remainder - a.remainder);

  // Distribute increments to items with largest remainders
  const percentages: Record<string, number> = {};
  floored.forEach(p => {
    percentages[p.system] = p.floored;
  });

  for (let i = 0; i < incrementsNeeded && i < sorted.length; i++) {
    percentages[sorted[i].system] = Math.round((percentages[sorted[i].system] + 0.01) * 100) / 100;
  }

  return percentages;
}

/**
 * Compute scores using gate-line mappings with actual placements (v4.3 - November 2024)
 * 
 * CRITICAL FIX: This function now scores only the specific gate.line combinations
 * present in the chart (e.g., Sun in 21.4, Earth in 48.1), NOT all 6 lines of every gate.
 * 
 * Previous bug: Was scoring all 6 lines for every activated gate, resulting in 6x
 * inflated scores that washed out the actual chart signature.
 * 
 * Key features:
 * 1. Scores only actual placements from Personality and Design
 * 2. Applies SPARSIFY + SHARPEN algorithm to reduce muddy spread
 * 3. Applies planet weighting (Sun/Earth 2x, Moon/Nodes 1.5x, etc.)
 * 4. Separates core alignments from secondary expressions
 * 5. Normalizes to unified percentage (core + secondary combined)
 * 
 * @param extract - HD data including placements array
 * @param gateLineMap - Gate-line to star system mappings (384 combinations)
 * @param config - Optional sparsify configuration (defaults to DEFAULT_SPARSIFY_CONFIG)
 * @returns Array of system scores sorted by total percentage
 * 
 * See SCORING_UPGRADE_COMPLETE.md for full documentation.
 */
export function computeScoresWithGateLines(
  extract: HDExtract,
  gateLineMap: GateLineMap,
  config: SparsifyConfig = DEFAULT_SPARSIFY_CONFIG
): SystemScore[] {
  // Initialize scores for all systems
  const systemScores: Record<string, {
    coreScore: number;
    secondaryScore: number;
    coreContributors: Contributor[];
    secondaryContributors: Contributor[];
  }> = {};
  
  // System labels (canonical names)
  const systemLabels = [
    'Andromeda',
    'Arcturus',
    'Draco',
    'Lyra',
    'Orion Dark',
    'Orion Light',
    'Pleiades',
    'Sirius',
  ];
  
  // Initialize all systems
  systemLabels.forEach(label => {
    systemScores[label] = { 
      coreScore: 0, 
      secondaryScore: 0,
      coreContributors: [],
      secondaryContributors: [],
    };
  });
  
  // Consistency rescue: track which systems appear consistently across placements
  const consistencyCounts: Record<string, { core: number; secondary: number }> = {};
  const consistentSystems = new Set<string>();
  
  if (config.consistency_rescue && extract.placements && extract.placements.length > 0) {
    // First pass: count appearances before sparsification
    for (const placement of extract.placements) {
      const gateLineKey = `${placement.gate}.${placement.line}`;
      const mappings = gateLineMap[gateLineKey];
      
      if (!mappings || !Array.isArray(mappings)) continue;
      
      for (const mapping of mappings) {
        if (mapping.weight >= config.consistency_rescue.min_weight_before_sparsify) {
          if (!consistencyCounts[mapping.star_system]) {
            consistencyCounts[mapping.star_system] = { core: 0, secondary: 0 };
          }
          if (mapping.alignment_type === 'core') {
            consistencyCounts[mapping.star_system].core++;
          } else if (mapping.alignment_type === 'secondary') {
            consistencyCounts[mapping.star_system].secondary++;
          }
        }
      }
    }
    
    // Identify systems that qualify for rescue
    for (const [system, counts] of Object.entries(consistencyCounts)) {
      if (counts.core >= config.consistency_rescue.core_min_placements) {
        consistentSystems.add(system);
      }
    }
  }
  
  // Score each actual placement
  if (extract.placements && extract.placements.length > 0) {
    for (const placement of extract.placements) {
      const gateLineKey = `${placement.gate}.${placement.line}`;
      const mappings = gateLineMap[gateLineKey];
      
      if (!mappings || !Array.isArray(mappings)) {
        continue;
      }
      
      // Convert mappings to MapEntry format for sparsification
      const lineMap: Record<string, MapEntry> = {};
      for (const mapping of mappings) {
        if (mapping.weight > 0) {
          lineMap[mapping.star_system] = {
            weight: mapping.weight,
            alignment_type: mapping.alignment_type as 'core' | 'secondary',
          };
        }
      }
      
      // Apply sparsify + sharpen algorithm
      const sparsified = sparsifyLine(lineMap, config);
      
      // Consistency rescue: re-add systems that were dropped but qualify
      if (config.consistency_rescue && consistentSystems.size > 0) {
        for (const system of consistentSystems) {
          const original = lineMap[system];
          if (original && 
              original.alignment_type === 'core' &&
              original.weight >= config.consistency_rescue.min_weight_before_sparsify &&
              !sparsified.core.some(s => s.system === system)) {
            // System was dropped but qualifies for rescue - re-add it
            sparsified.core.push({ system, w: original.weight });
          }
        }
      }
      
      // Get planet weight
      const planetWeight = config.planet_weights[placement.planet] || 1.0;
      
      // Apply line 3 secondary dampener if configured
      const line3Multiplier = placement.line === 3 
        ? (config.line_secondary_multiplier['3'] || 1.0)
        : 1.0;
      
      // Score core systems
      for (const { system, w } of sparsified.core) {
        if (systemScores[system]) {
          const weightedScore = w * planetWeight;
          
          systemScores[system].coreScore += weightedScore;
          systemScores[system].coreContributors.push({
            key: gateLineKey,
            weight: weightedScore,
            label: `${placement.planet} ${placement.gate}.${placement.line} (core)`,
          });
        }
      }
      
      // Score secondary systems
      for (const { system, w } of sparsified.secondary) {
        if (systemScores[system]) {
          const weightedScore = w * planetWeight * line3Multiplier;
          
          systemScores[system].secondaryScore += weightedScore;
          systemScores[system].secondaryContributors.push({
            key: gateLineKey,
            weight: weightedScore,
            label: `${placement.planet} ${placement.gate}.${placement.line} (secondary)`,
          });
        }
      }
    }
  }
  
  // Convert to array - use COMBINED score (core + secondary) for single unified percentage
  const rawScores = Object.entries(systemScores).map(([system, data]) => ({
    system,
    coreScore: data.coreScore,
    secondaryScore: data.secondaryScore,
    totalScore: data.coreScore + data.secondaryScore,
    coreContributors: data.coreContributors,
    secondaryContributors: data.secondaryContributors,
  }));
  
  // Normalize TOTAL scores to 100% (not separate channels)
  const percentages = normalizeScores(rawScores.map(s => ({
    system: s.system,
    rawScore: s.totalScore,
  })));
  
  // Create system scores with unified percentage
  const scores: SystemScore[] = rawScores.map(s => {
    // Separate core and secondary contributors for display
    const coreContributors = s.coreContributors.sort((a, b) => b.weight - a.weight);
    const secondaryContributors = s.secondaryContributors.sort((a, b) => b.weight - a.weight);
    const allContributors = [...coreContributors, ...secondaryContributors];
    
    return {
      system: s.system,
      rawScore: s.totalScore,
      percentage: percentages[s.system],
      contributors: allContributors,
      coreScore: s.coreScore,
      secondaryScore: s.secondaryScore,
      coreContributors,
      secondaryContributors,
    };
  });
  
  // Sort by total percentage
  scores.sort((a, b) => b.percentage - a.percentage);
  return scores;
}

/**
 * Compute scores for all systems using lore bundle
 * Returns enhanced scores with provenance metadata
 */
export function computeScoresWithLore(extract: HDExtract): SystemScore[] {
  // Match HD attributes to lore rules
  const matches = matchLoreRules(extract);
  
  // Create enhanced contributors grouped by system
  const enhancedContributorsBySystem = createEnhancedContributors(matches);

  // Calculate raw scores for each system
  const rawScores: Array<{
    system: string;
    rawScore: number;
    enhancedContributors: EnhancedContributor[];
  }> = [];

  // Get all systems from lore bundle
  loreBundle.systems.forEach(system => {
    const systemId = system.id;
    const contributors = enhancedContributorsBySystem[systemId] || [];
    const rawScore = contributors.reduce((sum, c) => sum + c.weight, 0);
    
    rawScores.push({
      system: system.label,  // Use human-readable label
      rawScore,
      enhancedContributors: contributors,
    });
  });

  // Normalize to percentages
  const percentages = normalizeScores(rawScores.map(s => ({
    system: s.system,
    rawScore: s.rawScore,
  })));

  // Create system scores with both legacy and enhanced contributors
  const systemScores: SystemScore[] = rawScores.map(s => {
    // Convert enhanced contributors to legacy format for backward compatibility
    const legacyContributors: Contributor[] = s.enhancedContributors.map(ec => ({
      key: ec.key,
      weight: ec.weight,
      label: ec.label,
    }));

    return {
      system: s.system,
      rawScore: s.rawScore,
      percentage: percentages[s.system],
      contributors: legacyContributors,
      enhancedContributors: s.enhancedContributors,
    };
  });

  systemScores.sort((a, b) => b.percentage - a.percentage);
  return systemScores;
}

/**
 * Compute scores for all systems
 */
export function computeScores(extract: HDExtract, canon: Canon): SystemScore[] {
  const attributeKeys = generateAttributeKeys(extract);
  const rawScores: Array<{
    system: string;
    rawScore: number;
    contributors: Contributor[];
  }> = [];

  Object.entries(canon.systems).forEach(([systemName, systemData]) => {
    const { rawScore, contributors } = computeSystemScore(
      systemData.weights,
      attributeKeys
    );
    rawScores.push({ system: systemName, rawScore, contributors });
  });

  const percentages = normalizeScores(rawScores);

  const systemScores: SystemScore[] = rawScores.map(s => ({
    system: s.system,
    rawScore: s.rawScore,
    percentage: percentages[s.system],
    contributors: s.contributors,
  }));

  systemScores.sort((a, b) => b.percentage - a.percentage);
  return systemScores;
}

/**
 * Classify user into star system(s)
 * 
 * Classification rules:
 * - Primary: One system with lead > tieThresholdPct over second place
 * - Hybrid: Top two systems within tieThresholdPct of each other (|p1 - p2| ≤ tieThresholdPct)
 * - Unresolved: No clear classification
 */
export function classify(
  scores: SystemScore[],
  canon: Canon,
  extract?: HDExtract
): ClassificationResult {
  if (scores.length === 0) {
    throw new Error('No scores provided');
  }

  const [first, second] = scores;
  // Use tieThresholdPct from lore bundle for deterministic hybrid classification
  const tieThresholdPct = loreBundle.tieThresholdPct;

  let classification: 'primary' | 'hybrid' | 'unresolved';
  let primary: string | undefined;
  let hybrid: [string, string] | undefined;

  // Deterministic tie-breaking: |p1 - p2| ≤ tieThresholdPct qualifies as hybrid
  const percentageDiff = first.percentage - (second?.percentage ?? 0);
  
  if (!second || percentageDiff > tieThresholdPct) {
    classification = 'primary';
    primary = first.system;
  } else if (Math.abs(percentageDiff) <= tieThresholdPct) {
    classification = 'hybrid';
    hybrid = [first.system, second.system];
  } else {
    classification = 'unresolved';
  }

  // Top 3 systems by unified percentage
  const allies = scores.slice(0, 3).map(s => ({
    system: s.system,
    percentage: s.percentage,
  }));

  const percentages: Record<string, number> = {};
  const contributorsPerSystem: Record<string, string[]> = {};
  const contributorsWithWeights: Record<string, Contributor[]> = {};
  const enhancedContributorsWithWeights: Record<string, EnhancedContributor[]> = {};

  scores.forEach(s => {
    percentages[s.system] = s.percentage;
    
    // Sort contributors by weight descending
    const sortedContributors = [...s.contributors].sort((a, b) => b.weight - a.weight);
    contributorsPerSystem[s.system] = sortedContributors.map(c => c.label);
    contributorsWithWeights[s.system] = sortedContributors;
    
    // Include enhanced contributors if available (also sorted by weight)
    if (s.enhancedContributors) {
      const sortedEnhanced = [...s.enhancedContributors].sort((a, b) => b.weight - a.weight);
      enhancedContributorsWithWeights[s.system] = sortedEnhanced;
    }
  });

  // Check if we have enhanced contributors (from lore bundle)
  const hasEnhancedContributors = Object.keys(enhancedContributorsWithWeights).length > 0;

  // Compute input hash if extract is provided
  const inputHash = extract ? computeInputHash(extract) : undefined;

  return {
    classification,
    primary,
    hybrid,
    allies,
    percentages,
    contributorsPerSystem,
    contributorsWithWeights,
    ...(hasEnhancedContributors && { enhancedContributorsWithWeights }),
    meta: {
      canonVersion: canon.version,
      canonChecksum: 'computed-at-runtime',
      ...(hasEnhancedContributors && {
        lore_version: loreBundle.lore_version,
        rules_hash: loreBundle.rules_hash,
      }),
      ...(inputHash && { input_hash: inputHash }),
    },
  };
}

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
  shadowScore?: number;
  corePercentage?: number;
  shadowPercentage?: number;
}

export interface ClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  allies: Array<{ system: string; percentage: number }>;
  shadowWork: Array<{ system: string; percentage: number }>;
  percentages: Record<string, number>;
  corePercentages: Record<string, number>;
  shadowPercentages: Record<string, number>;
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
 * Planet weights for scoring (v4.3 - November 2024)
 * 
 * Based on standard Human Design interpretation hierarchy:
 * - Sun/Earth are foundational (conscious/unconscious design) - 2.0x
 * - Moon/Nodes are life path markers - 1.5x
 * - Outer planets are transpersonal/generational - 1.3x
 * - Inner planets are personality/surface traits - 1.0x
 * 
 * This weighting emphasizes core identity over surface-level traits.
 * See SCORING_UPGRADE_COMPLETE.md for full rationale.
 */
const PLANET_WEIGHTS: Record<string, number> = {
  'Sun': 2.0,
  'Earth': 2.0,
  'Moon': 1.5,
  'North Node': 1.5,
  'South Node': 1.5,
  'Pluto': 1.3,
  'Mars': 1.3,
  'Saturn': 1.3,
  'Jupiter': 1.3,
  'Mercury': 1.0,
  'Venus': 1.0,
  'Uranus': 1.0,
  'Neptune': 1.0,
};

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
 * 2. Applies planet weighting (Sun/Earth 2x, Moon/Nodes 1.5x, etc.)
 * 3. Separates core alignments from shadow expressions
 * 4. Normalizes core and shadow percentages independently
 * 
 * @param extract - HD data including placements array
 * @param gateLineMap - Gate-line to star system mappings (384 combinations)
 * @returns Array of system scores sorted by core percentage
 * 
 * See SCORING_UPGRADE_COMPLETE.md for full documentation.
 */
export function computeScoresWithGateLines(
  extract: HDExtract,
  gateLineMap: GateLineMap
): SystemScore[] {
  // Initialize scores for all systems
  const systemScores: Record<string, {
    coreScore: number;
    shadowScore: number;
    coreContributors: Contributor[];
    shadowContributors: Contributor[];
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
      shadowScore: 0,
      coreContributors: [],
      shadowContributors: [],
    };
  });
  
  // Score each actual placement
  if (extract.placements && extract.placements.length > 0) {
    for (const placement of extract.placements) {
      const gateLineKey = `${placement.gate}.${placement.line}`;
      const mappings = gateLineMap[gateLineKey];
      
      // Get planet weight
      const planetWeight = PLANET_WEIGHTS[placement.planet] || 1.0;
      
      if (mappings && Array.isArray(mappings)) {
        for (const mapping of mappings) {
          const system = mapping.star_system;
          const baseWeight = mapping.weight;
          const alignmentType = mapping.alignment_type;
          
          // Only include positive weights
          if (baseWeight > 0 && systemScores[system]) {
            // Apply planet weighting
            const weightedScore = baseWeight * planetWeight;
            
            const contributor: Contributor = {
              key: gateLineKey,
              weight: weightedScore,
              label: `${placement.planet} ${placement.gate}.${placement.line} (${alignmentType})`,
            };
            
            // Separate core from shadow
            if (alignmentType === 'core') {
              systemScores[system].coreScore += weightedScore;
              systemScores[system].coreContributors.push(contributor);
            } else if (alignmentType === 'shadow') {
              systemScores[system].shadowScore += weightedScore;
              systemScores[system].shadowContributors.push(contributor);
            }
          }
        }
      }
    }
  }
  
  // Convert to array and normalize separately for core and shadow
  const rawScores = Object.entries(systemScores).map(([system, data]) => ({
    system,
    coreScore: data.coreScore,
    shadowScore: data.shadowScore,
    coreContributors: data.coreContributors,
    shadowContributors: data.shadowContributors,
  }));
  
  // Normalize core scores
  const corePercentages = normalizeScores(rawScores.map(s => ({
    system: s.system,
    rawScore: s.coreScore,
  })));
  
  // Normalize shadow scores
  const shadowPercentages = normalizeScores(rawScores.map(s => ({
    system: s.system,
    rawScore: s.shadowScore,
  })));
  
  // Create system scores with both core and shadow data
  const scores: SystemScore[] = rawScores.map(s => {
    // Combined contributors for backward compatibility
    const allContributors = [
      ...s.coreContributors,
      ...s.shadowContributors,
    ].sort((a, b) => b.weight - a.weight);
    
    return {
      system: s.system,
      rawScore: s.coreScore + s.shadowScore,
      percentage: corePercentages[s.system], // Use core percentage for primary classification
      contributors: allContributors,
      coreScore: s.coreScore,
      shadowScore: s.shadowScore,
      corePercentage: corePercentages[s.system],
      shadowPercentage: shadowPercentages[s.system],
    };
  });
  
  // Sort by core percentage (allies are based on core, not shadow)
  scores.sort((a, b) => (b.corePercentage || 0) - (a.corePercentage || 0));
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

  // Allies are based on core percentages only (v4.3 - November 2024)
  // This ensures shadow expressions (like Orion-Dark) don't appear as "allies"
  const allies = scores.slice(0, 3).map(s => ({
    system: s.system,
    percentage: s.corePercentage || s.percentage,
  }));
  
  // Shadow work shows top shadow contributors separately
  // These are growth edges, not supportive alignments
  const shadowScores = [...scores].sort((a, b) => (b.shadowPercentage || 0) - (a.shadowPercentage || 0));
  const shadowWork = shadowScores.slice(0, 3).map(s => ({
    system: s.system,
    percentage: s.shadowPercentage || 0,
  }));

  const percentages: Record<string, number> = {};
  const corePercentages: Record<string, number> = {};
  const shadowPercentages: Record<string, number> = {};
  const contributorsPerSystem: Record<string, string[]> = {};
  const contributorsWithWeights: Record<string, Contributor[]> = {};
  const enhancedContributorsWithWeights: Record<string, EnhancedContributor[]> = {};

  scores.forEach(s => {
    percentages[s.system] = s.percentage;
    corePercentages[s.system] = s.corePercentage || s.percentage;
    shadowPercentages[s.system] = s.shadowPercentage || 0;
    
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
    shadowWork,
    percentages,
    corePercentages,
    shadowPercentages,
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

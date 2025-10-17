/**
 * Core Scoring Algorithm for React Web
 * 
 * Implements weighted scoring logic for star system classification.
 * This is the deterministic algorithm that classifies users into star systems
 * based on their Human Design birth chart data.
 */

export interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
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

export interface SystemScore {
  system: string;
  rawScore: number;
  percentage: number;
  contributors: Contributor[];
}

export interface ClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  allies: Array<{ system: string; percentage: number }>;
  percentages: Record<string, number>;
  contributorsPerSystem: Record<string, string[]>;
  meta: {
    canonVersion: string;
    canonChecksum: string;
  };
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
 * Normalize scores to percentages with 0.1% precision
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

  const percentages: Record<string, number> = {};
  scores.forEach(s => {
    const pct = (s.rawScore / totalScore) * 100;
    percentages[s.system] = Math.round(pct * 10) / 10;
  });

  return percentages;
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
 * - Primary: One system with >6% lead over second place
 * - Hybrid: Top two systems within 6% of each other
 * - Unresolved: No clear classification
 */
export function classify(
  scores: SystemScore[],
  canon: Canon
): ClassificationResult {
  if (scores.length === 0) {
    throw new Error('No scores provided');
  }

  const [first, second] = scores;
  const hybridWindowPct = 6.0;

  let classification: 'primary' | 'hybrid' | 'unresolved';
  let primary: string | undefined;
  let hybrid: [string, string] | undefined;

  if (!second || first.percentage - second.percentage > hybridWindowPct) {
    classification = 'primary';
    primary = first.system;
  } else if (first.percentage - second.percentage <= hybridWindowPct) {
    classification = 'hybrid';
    hybrid = [first.system, second.system];
  } else {
    classification = 'unresolved';
  }

  const allies = scores.slice(0, 3).map(s => ({
    system: s.system,
    percentage: s.percentage,
  }));

  const percentages: Record<string, number> = {};
  const contributorsPerSystem: Record<string, string[]> = {};

  scores.forEach(s => {
    percentages[s.system] = s.percentage;
    contributorsPerSystem[s.system] = s.contributors.map(c => c.label);
  });

  return {
    classification,
    primary,
    hybrid,
    allies,
    percentages,
    contributorsPerSystem,
    meta: {
      canonVersion: canon.version,
      canonChecksum: 'computed-at-runtime',
    },
  };
}

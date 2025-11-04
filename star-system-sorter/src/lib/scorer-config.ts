/**
 * Scoring Configuration (v4.3 - Sparsify + Sharpen)
 * 
 * Configuration for the sparsification and sharpening algorithm that
 * reduces muddy spread across systems while respecting research weights.
 */

export interface SparsifyConfig {
  gamma: number; // Sharpening exponent (>1 boosts peaks, <1 flattens)
  per_polarity: {
    core: PolarityConfig;
    secondary: PolarityConfig;
  };
  line_secondary_multiplier: Record<string, number>;
  planet_weights: Record<string, number>;
  normalize_per_channel: boolean;
  consistency_rescue?: {
    core_min_placements: number; // Minimum placements to qualify for rescue
    min_weight_before_sparsify: number; // Minimum weight threshold
  };
}

export interface PolarityConfig {
  top_k: number;      // Keep at most K systems per polarity
  top_p: number;      // Cumulative coverage threshold (0-1)
  min_abs: number;    // Absolute minimum weight
  rel_floor: number;  // Relative floor (fraction of max weight)
}

/**
 * Default configuration - gentler settings to preserve legitimate secondary systems
 * 
 * Gamma 1.35: Gentler sharpening preserves #2 and #3 systems
 * Core top_k=3: Each line credits at most 3 core systems
 * Secondary top_k=2: Each line credits at most 2 secondary systems
 * rel_floor=0.35: Keeps systems that are 35% of max (vs 55% before)
 * 
 * With these settings, #2 survives if it's ~46% of #1 (vs ~72% before)
 * This prevents legitimate blends from collapsing to a single dominant system
 */
export const DEFAULT_SPARSIFY_CONFIG: SparsifyConfig = {
  gamma: 1.35, // Was 1.8 - gentler sharpening
  per_polarity: {
    core: {
      top_k: 3, // Was 2 - allow credible third system
      top_p: 0.80, // Was 0.60 - capture more mass
      min_abs: 0.10, // Was 0.18 - lower floor
      rel_floor: 0.35, // Was 0.55 - much friendlier threshold
    },
    secondary: {
      top_k: 2, // Was 1 - allow secondary expression
      top_p: 0.75, // Was 0.55 - capture more mass
      min_abs: 0.10, // Was 0.18 - lower floor
      rel_floor: 0.35, // Was 0.60 - friendlier threshold
    },
  },
  line_secondary_multiplier: {
    '3': 0.75, // Line 3 is trial-and-error, reduce secondary emphasis
  },
  planet_weights: {
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
  },
  normalize_per_channel: true,
  
  // Consistency rescue: protect systems that appear consistently across placements
  consistency_rescue: {
    core_min_placements: 3, // Must appear in at least 3 placements
    min_weight_before_sparsify: 0.18, // With at least this weight pre-sparsify
  },
};

/**
 * Gate.line mapping entry from JSON
 */
export interface MapEntry {
  weight: number;
  alignment_type: "core" | "secondary";
}

/**
 * Sparsified line result
 */
export interface SparsifiedLine {
  core: Array<{ system: string; w: number }>;
  secondary: Array<{ system: string; w: number }>;
}

/**
 * Sparsify a single gate.line's mappings
 * 
 * Applies the sparsify + sharpen algorithm to reduce muddy spread:
 * 1. Sharpen: raise each weight to gamma power (boosts peaks)
 * 2. Filter: apply absolute and relative floors per polarity
 * 3. Prune: keep only top_k systems or until top_p coverage
 * 4. Normalize: renormalize within each polarity
 * 
 * @param lineMap - Raw mappings for this gate.line (system -> {weight, alignment_type})
 * @param cfg - Scoring configuration
 * @returns Pruned and normalized weights per polarity
 * 
 * @example
 * // Input: { Arcturus: {weight: 0.4, alignment_type: "core"}, 
 * //          Draco: {weight: 0.25, alignment_type: "core"},
 * //          Pleiades: {weight: 0.1, alignment_type: "core"} }
 * // Output with gamma=1.8, top_k=2, rel_floor=0.55:
 * // { core: [{system: "Arcturus", w: 0.65}, {system: "Draco", w: 0.35}], secondary: [] }
 */
export function sparsifyLine(
  lineMap: Record<string, MapEntry>,
  cfg: SparsifyConfig
): SparsifiedLine {
  const out: SparsifiedLine = { core: [], secondary: [] };

  // 1) Sharpen: raise each weight to gamma power
  const temp: { 
    core: Array<{ system: string; w: number }>; 
    secondary: Array<{ system: string; w: number }> 
  } = {
    core: [],
    secondary: [],
  };

  for (const [system, entry] of Object.entries(lineMap)) {
    const sharpened = Math.pow(entry.weight, cfg.gamma);
    temp[entry.alignment_type].push({ system, w: sharpened });
  }

  // 2) Per-polarity pruning
  for (const pol of ["core", "secondary"] as const) {
    let arr = temp[pol].sort((a, b) => b.w - a.w);

    if (!arr.length) {
      out[pol] = [];
      continue;
    }

    const max = arr[0].w;

    // Apply absolute + relative floors
    arr = arr.filter(
      (r) =>
        r.w >= cfg.per_polarity[pol].min_abs &&
        r.w >= max * cfg.per_polarity[pol].rel_floor
    );

    // Apply top_k and top_p
    const topK = cfg.per_polarity[pol].top_k ?? arr.length;
    const topP = cfg.per_polarity[pol].top_p ?? 1.0;
    const sumAll = arr.reduce((a, b) => a + b.w, 0) || 1;

    const kept: Array<{ system: string; w: number }> = [];
    let cum = 0;

    for (const r of arr) {
      if (kept.length >= topK) break;
      kept.push(r);
      cum += r.w;
      if (cum / sumAll >= topP) break;
    }

    // 3) Renormalize within polarity for this line
    const s = kept.reduce((a, b) => a + b.w, 0) || 1;
    out[pol] = kept.map((k) => ({ system: k.system, w: k.w / s }));
  }

  return out;
}

/**
 * Debug inspector for placement sparsification
 * 
 * Use in browser console to see what each placement kept/dropped:
 * 
 * @example
 * import { inspectPlacement } from './scorer-config';
 * const result = inspectPlacement(21, 1, gateLineMap, DEFAULT_SPARSIFY_CONFIG);
 * console.log('Kept core:', result.kept_core);
 * console.log('Dropped:', result.dropped);
 */
export function inspectPlacement(
  gate: number,
  line: number,
  mappings: Record<string, Record<string, MapEntry>>,
  cfg: SparsifyConfig
) {
  const key = `${gate}.${line}`;
  const lm = mappings[key];
  
  if (!lm) {
    return { error: `No mapping found for ${key}` };
  }

  const pruned = sparsifyLine(lm, cfg);

  return {
    gate,
    line,
    kept_core: pruned.core,
    kept_secondary: pruned.secondary,
    dropped: Object.entries(lm)
      .filter(
        ([sys]) =>
          !pruned.core.some((k) => k.system === sys) &&
          !pruned.secondary.some((k) => k.system === sys)
      )
      .map(([sys, entry]) => ({
        system: sys,
        w: entry.weight,
        pol: entry.alignment_type,
      })),
  };
}

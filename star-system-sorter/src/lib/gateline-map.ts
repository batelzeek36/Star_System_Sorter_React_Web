/**
 * Gate-Line to Star System Mapping
 * 
 * Loads the comprehensive gate.line → star system mappings from research data.
 * This provides line-level granularity (384 mappings) vs gate-level (64 mappings).
 */

export interface GateLineMapping {
  star_system: string;
  weight: number;
  alignment_type: 'core' | 'shadow' | 'none';
  why: string;
}

export interface GateLineMap {
  _meta: {
    version: string;
    generated_at_utc: string;
    source_star_system_version: string;
    total_gate_lines: number;
    systems: string[];
  };
  [gateLine: string]: GateLineMapping[] | any; // any for _meta
}

// This will be populated by the build script
let gateLineMapData: GateLineMap | null = null;

/**
 * Load gate-line map from JSON file
 * In production, this should be bundled at build time
 */
export async function loadGateLineMap(): Promise<GateLineMap> {
  if (gateLineMapData) {
    return gateLineMapData;
  }

  try {
    // Try to load from public directory
    const response = await fetch('/data/gateLine_star_map.json');
    if (!response.ok) {
      throw new Error(`Failed to load gate-line map: ${response.statusText}`);
    }
    const data = await response.json();
    gateLineMapData = data;
    return data;
  } catch (error) {
    console.error('Failed to load gate-line map:', error);
    // Return empty map as fallback
    return {
      _meta: {
        version: '0.0.0',
        generated_at_utc: new Date().toISOString(),
        source_star_system_version: 'unknown',
        total_gate_lines: 0,
        systems: [],
      },
    };
  }
}

/**
 * Get mappings for a specific gate.line
 */
export function getGateLineMapping(
  map: GateLineMap,
  gate: number,
  line: number
): GateLineMapping[] {
  const key = `${gate}.${line}`;
  const mappings = map[key];
  
  if (!mappings || !Array.isArray(mappings)) {
    return [];
  }
  
  return mappings;
}

/**
 * Get all gate.lines for a list of gates
 * Returns all 6 lines for each gate
 */
export function getGateLinesForGates(gates: number[]): string[] {
  const gateLines: string[] = [];
  
  for (const gate of gates) {
    for (let line = 1; line <= 6; line++) {
      gateLines.push(`${gate}.${line}`);
    }
  }
  
  return gateLines;
}

export default {
  loadGateLineMap,
  getGateLineMapping,
  getGateLinesForGates,
};

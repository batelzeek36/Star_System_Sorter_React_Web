/**
 * Canon Data Loader
 * 
 * Loads and parses the canon-data.yaml file containing star system weights.
 */

import canonDataYaml from '../data/canon-data.yaml?raw';
import { parse as parseYaml } from 'yaml';
import type { Canon } from './scorer';

let cachedCanon: Canon | null = null;

/**
 * Load and parse canon data from YAML
 */
export function loadCanon(): Canon {
  if (cachedCanon) {
    return cachedCanon;
  }

  try {
    const parsed = parseYaml(canonDataYaml) as Canon;
    
    if (!parsed.version || !parsed.systems) {
      throw new Error('Invalid canon data structure');
    }

    cachedCanon = parsed;
    return parsed;
  } catch (error) {
    console.error('Failed to load canon data:', error);
    throw new Error('Failed to load canon data');
  }
}

/**
 * Get canon data (cached)
 */
export function getCanon(): Canon {
  return loadCanon();
}

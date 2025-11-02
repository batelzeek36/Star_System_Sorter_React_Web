#!/usr/bin/env tsx
/**
 * Gate.Line Data Harvester for S³
 * 
 * Fetches all 384 gate.line combinations (64 gates × 6 lines) from the Bodygraph API
 * and generates two JSON files:
 * 1. gateLine_raw_source.json - Verbatim API data (private, for provenance)
 * 2. gateLine_traits_clean.json - Paraphrased, app-safe version (public)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = process.env.BODYGRAPH_API_KEY || '7aa0cf1a-5a70-4a1f-b9bd-bbf5877079f2';
const API_BASE_URL = 'https://api.bodygraphchart.com/v221006';
const DELAY_BETWEEN_CALLS = 500; // ms - adjust if rate limited
const OUTPUT_DIR = path.join(__dirname, '../research-outputs/gate-line-API-call');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface RawSourceEntry {
  gate: number;
  line: number;
  gate_line_key: string;
  official_name: string | null;
  raw_description: string | null;
  shadow_description: string | null;
  gift_description: string | null;
  mechanics_role: string | null;
  circuit: string | null;
  source_provider: string;
  citation_status: string;
  location_hint: string;
  captured_at_utc: string;
}

interface TraitsCleanEntry {
  keywords: string[];
  behavioral_axis: string;
  shadow_axis: string;
}

type RawSourceData = Record<string, RawSourceEntry>;
type TraitsCleanData = Record<string, TraitsCleanEntry>;

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch gate.line data from Bodygraph API
 */
async function fetchGateLine(gate: number, line: number): Promise<any> {
  const endpoint = `${API_BASE_URL}/gate/${gate}/line/${line}`;
  
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
    });
    
    const url = `${endpoint}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[ERROR] Gate ${gate}.${line}: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[ERROR] Gate ${gate}.${line}:`, error);
    return null;
  }
}

/**
 * Normalize API response into RawSourceEntry format
 */
function normalizeRawEntry(gate: number, line: number, apiData: any): RawSourceEntry {
  const key = `${gate}.${line}`;
  const timestamp = new Date().toISOString();
  
  if (!apiData) {
    return {
      gate,
      line,
      gate_line_key: key,
      official_name: null,
      raw_description: null,
      shadow_description: null,
      gift_description: null,
      mechanics_role: null,
      circuit: null,
      source_provider: 'Bodygraph API',
      citation_status: 'provisional',
      location_hint: `GET ${API_BASE_URL}/gate/${gate}/line/${line}`,
      captured_at_utc: timestamp,
    };
  }

  // Extract fields from API response (adapt based on actual API structure)
  const name = apiData.name || apiData.title || apiData.keynote || null;
  
  // Build raw_description from multiple fields
  let rawDesc = '';
  if (apiData.theme) rawDesc += `[THEME] ${apiData.theme}\n`;
  if (apiData.purpose) rawDesc += `[PURPOSE] ${apiData.purpose}\n`;
  if (apiData.essence) rawDesc += `[ESSENCE] ${apiData.essence}\n`;
  if (apiData.description) rawDesc += `[DESCRIPTION] ${apiData.description}\n`;
  if (apiData.lesson) rawDesc += `[LESSON] ${apiData.lesson}\n`;
  
  const shadowDesc = apiData.shadow || apiData.challenge || apiData.distortion || apiData.fear || null;
  const giftDesc = apiData.gift || apiData.higher_expression || apiData.siddhi || null;
  const mechanicsRole = apiData.mechanics_role || apiData.role || null;
  const circuit = apiData.circuit || apiData.circuitry || null;

  return {
    gate,
    line,
    gate_line_key: key,
    official_name: name,
    raw_description: rawDesc.trim() || null,
    shadow_description: shadowDesc,
    gift_description: giftDesc,
    mechanics_role: mechanicsRole,
    circuit: circuit,
    source_provider: 'Bodygraph API',
    citation_status: 'provisional',
    location_hint: `GET ${API_BASE_URL}/gate/${gate}/line/${line}`,
    captured_at_utc: timestamp,
  };
}

/**
 * Generate paraphrased traits entry (placeholder - requires AI/manual work)
 */
function generateTraitsEntry(rawEntry: RawSourceEntry): TraitsCleanEntry {
  // This is a placeholder - actual paraphrasing would require AI or manual work
  // For now, we'll create a basic structure that needs to be filled in
  
  return {
    keywords: [
      `gate-${rawEntry.gate}-trait-1`,
      `line-${rawEntry.line}-trait-2`,
      'placeholder-trait-3',
    ],
    behavioral_axis: `Behavioral pattern for gate ${rawEntry.gate} line ${rawEntry.line} (needs paraphrasing)`,
    shadow_axis: `Shadow pattern for gate ${rawEntry.gate} line ${rawEntry.line} (needs paraphrasing)`,
  };
}

/**
 * Main harvesting function
 */
async function harvestAllGateLines(): Promise<void> {
  console.log('🌟 Starting Gate.Line Data Harvest...\n');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log(`Total combinations to fetch: 384 (64 gates × 6 lines)\n`);

  const rawSourceData: RawSourceData = {};
  const traitsCleanData: TraitsCleanData = {};

  let successCount = 0;
  let failureCount = 0;

  // Iterate through all 64 gates and 6 lines
  for (let gate = 1; gate <= 64; gate++) {
    console.log(`\n📍 Processing Gate ${gate}...`);
    
    for (let line = 1; line <= 6; line++) {
      const key = `${gate}.${line}`;
      
      // Fetch from API
      const apiData = await fetchGateLine(gate, line);
      
      // Normalize raw entry
      const rawEntry = normalizeRawEntry(gate, line, apiData);
      rawSourceData[key] = rawEntry;
      
      // Generate traits entry
      const traitsEntry = generateTraitsEntry(rawEntry);
      traitsCleanData[key] = traitsEntry;
      
      if (apiData) {
        successCount++;
        console.log(`  ✓ ${key} - Success`);
      } else {
        failureCount++;
        console.log(`  ✗ ${key} - Failed (null entry created)`);
      }
      
      // Rate limiting delay
      await sleep(DELAY_BETWEEN_CALLS);
    }
  }

  console.log(`\n\n📊 Harvest Complete!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Failures: ${failureCount}`);
  console.log(`  Total: ${successCount + failureCount}\n`);

  // Write output files
  const rawSourcePath = path.join(OUTPUT_DIR, 'gateLine_raw_source.json');
  const traitsCleanPath = path.join(OUTPUT_DIR, 'gateLine_traits_clean.json');

  fs.writeFileSync(rawSourcePath, JSON.stringify(rawSourceData, null, 2), 'utf-8');
  console.log(`✅ Saved: ${rawSourcePath}`);

  fs.writeFileSync(traitsCleanPath, JSON.stringify(traitsCleanData, null, 2), 'utf-8');
  console.log(`✅ Saved: ${traitsCleanPath}`);

  console.log('\n🎉 All done!\n');
}

// Run the harvester
harvestAllGateLines().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

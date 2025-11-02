#!/usr/bin/env tsx
/**
 * Merge all 56 batch mapping files into a single master gate-line-to-star mapping
 * 
 * Input: lore-research/research-outputs/star-mapping-drafts/*-batch*.json (56 files)
 * Output: s3-data/associations/gate-line-to-star.v2.json
 * 
 * Structure:
 * {
 *   "1.1": {
 *     "pleiades": { "weight": 0, "alignment_type": "none", "why": "..." },
 *     "sirius": { "weight": 0.3, "alignment_type": "core", "why": "..." },
 *     ...all 8 systems
 *   },
 *   ...all 384 gate.lines
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STAR_SYSTEMS = [
  'andromeda',
  'arcturus',
  'draco',
  'lyra',
  'orion-dark',
  'orion-light',
  'pleiades',
  'sirius'
];

const BATCHES = [1, 2, 3, 4, 5, 6, 7];

const INPUT_DIR = path.join(__dirname, '../research-outputs/star-mapping-drafts');
const OUTPUT_PATH = path.join(__dirname, '../../s3-data/associations/gate-line-to-star.v2.json');

interface MappingEntry {
  weight: number;
  alignment_type: 'core' | 'shadow' | 'none';
  why: string;
}

type SystemMappings = Record<string, MappingEntry>;
type MasterMapping = Record<string, SystemMappings>;

/**
 * Load a single batch file
 */
function loadBatchFile(system: string, batch: number): Record<string, MappingEntry> {
  const filename = `${system}-batch${batch}.json`;
  const filepath = path.join(INPUT_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  Missing file: ${filename}`);
    return {};
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Validate that all 384 gate.lines are present
 */
function validateCompleteness(masterMapping: MasterMapping): { valid: boolean; missing: string[] } {
  const expectedGateLines: string[] = [];
  
  // Generate all 384 gate.line combinations
  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      expectedGateLines.push(`${gate}.${line}`);
    }
  }
  
  const missing: string[] = [];
  
  for (const gateLine of expectedGateLines) {
    if (!masterMapping[gateLine]) {
      missing.push(gateLine);
    } else {
      // Check that all 8 systems are present
      for (const system of STAR_SYSTEMS) {
        if (!masterMapping[gateLine][system]) {
          missing.push(`${gateLine} (missing ${system})`);
        }
      }
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Generate statistics about the mapping
 */
function generateStats(masterMapping: MasterMapping): void {
  console.log('\n📊 Mapping Statistics:\n');
  
  const systemStats: Record<string, { core: number; shadow: number; none: number; totalWeight: number }> = {};
  
  for (const system of STAR_SYSTEMS) {
    systemStats[system] = { core: 0, shadow: 0, none: 0, totalWeight: 0 };
  }
  
  let totalGateLines = 0;
  
  for (const [gateLine, systems] of Object.entries(masterMapping)) {
    totalGateLines++;
    
    for (const [system, mapping] of Object.entries(systems)) {
      if (mapping.alignment_type === 'core') {
        systemStats[system].core++;
      } else if (mapping.alignment_type === 'shadow') {
        systemStats[system].shadow++;
      } else {
        systemStats[system].none++;
      }
      
      systemStats[system].totalWeight += mapping.weight;
    }
  }
  
  console.log(`Total gate.lines: ${totalGateLines}`);
  console.log(`Expected: 384\n`);
  
  for (const system of STAR_SYSTEMS) {
    const stats = systemStats[system];
    const avgWeight = (stats.totalWeight / totalGateLines).toFixed(3);
    const matchCount = stats.core + stats.shadow;
    const matchPercent = ((matchCount / totalGateLines) * 100).toFixed(1);
    
    console.log(`${system.padEnd(15)} | Core: ${String(stats.core).padStart(3)} | Shadow: ${String(stats.shadow).padStart(3)} | None: ${String(stats.none).padStart(3)} | Matches: ${matchPercent}% | Avg Weight: ${avgWeight}`);
  }
}

/**
 * Main merge function
 */
function main() {
  console.log('🔗 Merging all batch mapping files into master mapping...\n');
  
  const masterMapping: MasterMapping = {};
  
  let filesProcessed = 0;
  let filesMissing = 0;
  
  // Process each system and batch
  for (const system of STAR_SYSTEMS) {
    console.log(`Processing ${system}...`);
    
    for (const batch of BATCHES) {
      const batchData = loadBatchFile(system, batch);
      
      if (Object.keys(batchData).length === 0) {
        filesMissing++;
        continue;
      }
      
      filesProcessed++;
      
      // Merge into master mapping
      for (const [gateLine, mapping] of Object.entries(batchData)) {
        if (!masterMapping[gateLine]) {
          masterMapping[gateLine] = {} as SystemMappings;
        }
        
        masterMapping[gateLine][system] = mapping;
      }
    }
  }
  
  console.log(`\n✓ Processed ${filesProcessed} batch files`);
  if (filesMissing > 0) {
    console.log(`⚠️  Missing ${filesMissing} batch files`);
  }
  
  // Validate completeness
  console.log('\n🔍 Validating completeness...');
  const validation = validateCompleteness(masterMapping);
  
  if (validation.valid) {
    console.log('✓ All 384 gate.lines present with all 8 systems');
  } else {
    console.error(`\n❌ Validation failed! Missing ${validation.missing.length} entries:`);
    validation.missing.slice(0, 20).forEach(m => console.error(`  - ${m}`));
    if (validation.missing.length > 20) {
      console.error(`  ... and ${validation.missing.length - 20} more`);
    }
    console.error('\nPlease fix missing batch files before proceeding.\n');
    process.exit(1);
  }
  
  // Generate statistics
  generateStats(masterMapping);
  
  // Write master mapping file
  console.log(`\n💾 Writing master mapping to: ${OUTPUT_PATH}`);
  
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const output = {
    version: '2.0',
    generated_at: new Date().toISOString(),
    source: 'Merged from 56 batch files (8 systems × 7 batches)',
    total_gate_lines: Object.keys(masterMapping).length,
    star_systems: STAR_SYSTEMS,
    mappings: masterMapping
  };
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log('✓ Master mapping file created successfully!\n');
  console.log('🎉 Merge complete!\n');
}

// Run the script
main();

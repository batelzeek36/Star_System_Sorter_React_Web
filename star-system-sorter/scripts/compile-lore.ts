#!/usr/bin/env tsx
/**
 * Lore Bundle Compiler
 * 
 * Compiles YAML lore files into a TypeScript module with validation and hashing.
 * 
 * Process:
 * 1. Read data/lore/*.yaml files
 * 2. Validate with Zod schemas
 * 3. Sort systems/sources/rules alphabetically by ID
 * 4. Compute rules_hash (SHA-256)
 * 5. Generate src/lib/lore.bundle.ts
 * 
 * Exit codes:
 * - 0: Success
 * - 1: Validation error or file system error
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import YAML from 'yaml';
import { LoreBundleSchema } from '../src/lib/schemas.js';
import type { LoreBundle, LoreSystem, LoreSource, LoreRule } from '../src/lib/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message: string) {
  console.error(`${colors.red}✗ ${message}${colors.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, 'green');
}

function info(message: string) {
  log(`ℹ ${message}`, 'cyan');
}

/**
 * Read and parse all YAML files from data/lore/
 */
function readLoreFiles(): any[] {
  const loreDir = join(projectRoot, 'data', 'lore');
  
  try {
    const files = readdirSync(loreDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    if (files.length === 0) {
      error('No YAML files found in data/lore/');
      process.exit(1);
    }
    
    info(`Found ${files.length} lore file(s): ${files.join(', ')}`);
    
    const parsed = files.map(file => {
      const filePath = join(loreDir, file);
      const content = readFileSync(filePath, 'utf-8');
      try {
        const result = YAML.parse(content);
        if (!result) {
          error(`Failed to parse ${file}: YAML.parse returned null or undefined`);
          process.exit(1);
        }
        return result;
      } catch (err) {
        error(`Failed to parse ${file}: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
    
    return parsed.filter(p => p !== null && p !== undefined);
  } catch (err) {
    error(`Failed to read lore directory: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

/**
 * Merge multiple lore files with duplicate ID detection
 */
function mergeLoreFiles(files: any[]): any {
  if (files.length === 1) {
    return files[0];
  }
  
  const merged: any = {
    lore_version: '',
    tieThresholdPct: 0,
    systems: [],
    sources: [],
    rules: [],
  };
  
  // Track IDs to detect duplicates
  const systemIds = new Set<string>();
  const sourceIds = new Set<string>();
  const ruleIds = new Set<string>();
  
  for (const file of files) {
    // Use first file's metadata
    if (!merged.lore_version) {
      merged.lore_version = file.lore_version;
      merged.tieThresholdPct = file.tieThresholdPct;
    }
    
    // Merge systems
    if (file.systems) {
      for (const system of file.systems) {
        if (systemIds.has(system.id)) {
          error(`Duplicate system ID found: ${system.id}`);
          process.exit(1);
        }
        systemIds.add(system.id);
        merged.systems.push(system);
      }
    }
    
    // Merge sources
    if (file.sources) {
      for (const source of file.sources) {
        if (sourceIds.has(source.id)) {
          error(`Duplicate source ID found: ${source.id}`);
          process.exit(1);
        }
        sourceIds.add(source.id);
        merged.sources.push(source);
      }
    }
    
    // Merge rules
    if (file.rules) {
      for (const rule of file.rules) {
        if (ruleIds.has(rule.id)) {
          error(`Duplicate rule ID found: ${rule.id}`);
          process.exit(1);
        }
        ruleIds.add(rule.id);
        merged.rules.push(rule);
      }
    }
  }
  
  return merged;
}

/**
 * Sort bundle data alphabetically by ID
 * Uses natural sort for proper numeric ordering (e.g., gate_1 before gate_10)
 */
function sortBundle(data: any): void {
  const naturalSort = (a: string, b: string): number => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };
  
  if (data.systems && Array.isArray(data.systems)) {
    data.systems.sort((a: LoreSystem, b: LoreSystem) => naturalSort(a.id, b.id));
  }
  if (data.sources && Array.isArray(data.sources)) {
    data.sources.sort((a: LoreSource, b: LoreSource) => naturalSort(a.id, b.id));
  }
  if (data.rules && Array.isArray(data.rules)) {
    data.rules.sort((a: LoreRule, b: LoreRule) => naturalSort(a.id, b.id));
  }
}

/**
 * Compute SHA-256 hash of rules array
 */
function computeRulesHash(rules: LoreRule[]): string {
  const rulesJson = JSON.stringify(rules, null, 0);
  const hash = createHash('sha256').update(rulesJson).digest('hex');
  return hash.slice(0, 16); // First 16 chars for brevity
}

/**
 * Validate bundle with Zod schema
 */
function validateBundle(data: any): LoreBundle {
  try {
    return LoreBundleSchema.parse(data);
  } catch (err: any) {
    error('Lore bundle validation failed:');
    if (err.errors) {
      err.errors.forEach((e: any) => {
        console.error(`  - ${e.path.join('.')}: ${e.message}`);
      });
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

/**
 * Generate TypeScript module content
 */
function generateTypeScriptModule(bundle: LoreBundle): string {
  return `/**
 * Lore Bundle - Auto-generated by compile-lore.ts
 * DO NOT EDIT THIS FILE MANUALLY
 * 
 * Generated: ${new Date().toISOString()}
 * Lore Version: ${bundle.lore_version}
 * Rules Hash: ${bundle.rules_hash}
 */

import type { LoreBundle } from './schemas';

export const loreBundle: LoreBundle = ${JSON.stringify(bundle, null, 2)} as const;

export default loreBundle;
`;
}

/**
 * Main compiler function
 */
function main() {
  log('\n🔮 Lore Bundle Compiler', 'blue');
  log('━'.repeat(50), 'blue');
  
  // Step 1: Read YAML files
  info('Reading lore files from data/lore/...');
  const files = readLoreFiles();
  
  // Step 2: Merge files
  info('Merging lore files...');
  const merged = mergeLoreFiles(files);
  
  // Step 3: Sort data
  info('Sorting systems, sources, and rules...');
  sortBundle(merged);
  
  // Step 4: Compute rules hash
  info('Computing rules hash...');
  const rulesHash = computeRulesHash(merged.rules);
  merged.rules_hash = rulesHash;
  success(`Rules hash: ${rulesHash}`);
  
  // Step 5: Validate
  info('Validating bundle structure...');
  const bundle = validateBundle(merged);
  success(`Validated ${bundle.systems.length} systems, ${bundle.sources.length} sources, ${bundle.rules.length} rules`);
  
  // Step 6: Generate TypeScript module
  info('Generating TypeScript module...');
  const tsContent = generateTypeScriptModule(bundle);
  const outputPath = join(projectRoot, 'src', 'lib', 'lore.bundle.ts');
  
  try {
    writeFileSync(outputPath, tsContent, 'utf-8');
    success(`Generated: src/lib/lore.bundle.ts`);
  } catch (err) {
    error(`Failed to write output file: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
  
  log('━'.repeat(50), 'green');
  success('Lore bundle compiled successfully!\n');
}

// Run compiler
main();

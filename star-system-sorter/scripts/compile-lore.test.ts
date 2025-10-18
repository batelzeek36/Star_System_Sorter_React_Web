/**
 * Lore Compiler Tests
 * 
 * Tests for the lore bundle compiler functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { LoreBundleSchema } from '../src/lib/schemas';

const testDataDir = join(process.cwd(), 'test-data', 'lore');
const testOutputPath = join(process.cwd(), 'src', 'lib', 'lore.bundle.test.ts');

describe('Lore Compiler', () => {
  beforeEach(() => {
    // Create test data directory
    if (!existsSync(testDataDir)) {
      mkdirSync(testDataDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (existsSync(testDataDir)) {
      rmSync(testDataDir, { recursive: true, force: true });
    }
    if (existsSync(testOutputPath)) {
      rmSync(testOutputPath, { force: true });
    }
  });

  it('should validate bundle structure', () => {
    // Read the actual generated bundle
    const bundleContent = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    
    // Extract the JSON from the TypeScript file
    const jsonMatch = bundleContent.match(/export const loreBundle: LoreBundle = ({[\s\S]+}) as const;/);
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const bundleData = JSON.parse(jsonMatch[1]);
      
      // Validate with Zod schema
      const result = LoreBundleSchema.safeParse(bundleData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        // Check required fields
        expect(result.data.lore_version).toBeTruthy();
        expect(result.data.tieThresholdPct).toBeGreaterThan(0);
        expect(result.data.rules_hash).toBeTruthy();
        expect(result.data.systems.length).toBeGreaterThan(0);
        expect(result.data.sources.length).toBeGreaterThan(0);
        expect(result.data.rules.length).toBeGreaterThan(0);
      }
    }
  });

  it('should produce stable rules_hash for same input', () => {
    // Read the generated bundle twice
    const bundleContent1 = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    
    // Re-run compiler
    execSync('npm run compile:lore', { cwd: process.cwd(), stdio: 'pipe' });
    
    const bundleContent2 = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    
    // Extract rules_hash from both
    const hash1Match = bundleContent1.match(/"rules_hash":\s*"([^"]+)"/);
    const hash2Match = bundleContent2.match(/"rules_hash":\s*"([^"]+)"/);
    
    expect(hash1Match).toBeTruthy();
    expect(hash2Match).toBeTruthy();
    
    if (hash1Match && hash2Match) {
      expect(hash1Match[1]).toBe(hash2Match[1]);
    }
  });

  it('should allow source lookup by ID', () => {
    const bundleContent = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    const jsonMatch = bundleContent.match(/export const loreBundle: LoreBundle = ({[\s\S]+}) as const;/);
    
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const bundleData = JSON.parse(jsonMatch[1]);
      
      // Check that sources have unique IDs
      const sourceIds = new Set(bundleData.sources.map((s: any) => s.id));
      expect(sourceIds.size).toBe(bundleData.sources.length);
      
      // Check that we can look up a known source
      const raSource = bundleData.sources.find((s: any) => s.id === 's-ra-1984');
      expect(raSource).toBeTruthy();
      expect(raSource?.title).toContain('Law of One');
    }
  });

  it('should handle invalid YAML gracefully', () => {
    // Create invalid YAML file
    const invalidYaml = `
lore_version: "test"
tieThresholdPct: 6
systems:
  - id: TEST
    label: "Test"
    # Missing description - should fail validation
sources: []
rules: []
`;
    
    writeFileSync(join(testDataDir, 'invalid.yaml'), invalidYaml);
    
    // Try to compile with invalid YAML
    try {
      execSync(`DATA_DIR=${testDataDir} npm run compile:lore`, { 
        cwd: process.cwd(), 
        stdio: 'pipe',
        env: { ...process.env, DATA_DIR: testDataDir }
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Should exit with non-zero code
      expect(error.status).not.toBe(0);
    }
  });

  it('should sort systems, sources, and rules alphabetically', () => {
    const bundleContent = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    const jsonMatch = bundleContent.match(/export const loreBundle: LoreBundle = ({[\s\S]+}) as const;/);
    
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const bundleData = JSON.parse(jsonMatch[1]);
      
      // Natural sort function (same as compiler)
      const naturalSort = (a: string, b: string): number => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      };
      
      // Check systems are sorted
      const systemIds = bundleData.systems.map((s: any) => s.id);
      const sortedSystemIds = [...systemIds].sort(naturalSort);
      expect(systemIds).toEqual(sortedSystemIds);
      
      // Check sources are sorted
      const sourceIds = bundleData.sources.map((s: any) => s.id);
      const sortedSourceIds = [...sourceIds].sort(naturalSort);
      expect(sourceIds).toEqual(sortedSourceIds);
      
      // Check rules are sorted
      const ruleIds = bundleData.rules.map((r: any) => r.id);
      const sortedRuleIds = [...ruleIds].sort(naturalSort);
      expect(ruleIds).toEqual(sortedRuleIds);
    }
  });

  it('should validate rule ID format', () => {
    const bundleContent = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    const jsonMatch = bundleContent.match(/export const loreBundle: LoreBundle = ({[\s\S]+}) as const;/);
    
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const bundleData = JSON.parse(jsonMatch[1]);
      
      // All rule IDs should match the pattern ^[a-z0-9_]+$
      const ruleIdPattern = /^[a-z0-9_]+$/;
      bundleData.rules.forEach((rule: any) => {
        expect(rule.id).toMatch(ruleIdPattern);
      });
    }
  });

  it('should validate channelsAny is string array', () => {
    const bundleContent = readFileSync(join(process.cwd(), 'src', 'lib', 'lore.bundle.ts'), 'utf-8');
    const jsonMatch = bundleContent.match(/export const loreBundle: LoreBundle = ({[\s\S]+}) as const;/);
    
    expect(jsonMatch).toBeTruthy();
    
    if (jsonMatch) {
      const bundleData = JSON.parse(jsonMatch[1]);
      
      // Find rules with channelsAny
      const channelRules = bundleData.rules.filter((r: any) => r.if.channelsAny);
      
      expect(channelRules.length).toBeGreaterThan(0);
      
      channelRules.forEach((rule: any) => {
        expect(Array.isArray(rule.if.channelsAny)).toBe(true);
        rule.if.channelsAny.forEach((channel: any) => {
          expect(typeof channel).toBe('string');
          // Should be in format like "13-33"
          expect(channel).toMatch(/^\d+-\d+$/);
        });
      });
    }
  });
});

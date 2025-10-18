/**
 * Zod Schemas - Single Source of Truth for Validation
 * 
 * All validation schemas for the Star System Sorter application.
 * Used for:
 * - Client-side form validation (react-hook-form)
 * - Server-side request/response validation
 * - Runtime type checking and parsing
 */

import { z } from 'zod';

// ============================================================================
// Client-Side Schemas (Forms & UI)
// ============================================================================

/**
 * Birth Data Form Schema
 * Used in InputScreen for user input validation
 */
export const BirthDataFormSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format')
    .refine((val) => {
      const [month, day, year] = val.split('/').map(Number);
      if (!month || !day || !year) return false;
      if (month < 1 || month > 12) return false;
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) return false;
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) return false;
      return true;
    }, 'Please enter a valid date'),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format')
    .refine((val) => {
      const match = val.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
      if (!match) return false;
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      if (hours < 1 || hours > 12) return false;
      if (minutes < 0 || minutes > 59) return false;
      return true;
    }, 'Please enter a valid time'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .refine((val) => /^[a-zA-Z\s,.-]+$/.test(val), 
      'Location should only contain letters, spaces, and basic punctuation'),
  timeZone: z.string().min(1, 'Time zone is required'),
});

export type BirthDataForm = z.infer<typeof BirthDataFormSchema>;

// ============================================================================
// API Schemas (Client ↔ Server Communication)
// ============================================================================

export const BirthDataAPIRequestSchema = z.object({
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  timeZone: z.string().min(1, 'Time zone is required'),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
});

export type BirthDataAPIRequest = z.infer<typeof BirthDataAPIRequestSchema>;

export const HDExtractSchema = z.object({
  type: z.string(),
  authority: z.string(),
  profile: z.string(),
  centers: z.array(z.string()),
  channels: z.array(z.number()),
  gates: z.array(z.number()),
});

export type HDExtract = z.infer<typeof HDExtractSchema>;

// ============================================================================
// Scorer Schemas (Classification System)
// ============================================================================

export const ContributorSchema = z.object({
  key: z.string(),
  weight: z.number(),
  label: z.string(),
});

export type Contributor = z.infer<typeof ContributorSchema>;

export const EnhancedContributorSchema = z.object({
  ruleId: z.string(),
  key: z.string(),
  weight: z.number(),
  label: z.string(),
  rationale: z.string(),
  sources: z.array(z.string()),
  confidence: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
});

export type EnhancedContributor = z.infer<typeof EnhancedContributorSchema>;

export const SystemScoreSchema = z.object({
  system: z.string(),
  rawScore: z.number(),
  percentage: z.number().min(0).max(100),
  contributors: z.array(ContributorSchema),
});

export type SystemScore = z.infer<typeof SystemScoreSchema>;

export const AllySchema = z.object({
  system: z.string(),
  percentage: z.number().min(0).max(100),
});

export type Ally = z.infer<typeof AllySchema>;

export const ClassificationResultSchema = z.object({
  classification: z.enum(['primary', 'hybrid', 'unresolved']),
  primary: z.string().optional(),
  hybrid: z.tuple([z.string(), z.string()]).optional(),
  allies: z.array(AllySchema),
  percentages: z.record(z.string(), z.number()),
  contributorsPerSystem: z.record(z.string(), z.array(z.string())),
  contributorsWithWeights: z.record(z.string(), z.array(ContributorSchema)),
  enhancedContributorsWithWeights: z.record(z.string(), z.array(EnhancedContributorSchema)).optional(),
  meta: z.object({
    canonVersion: z.string(),
    canonChecksum: z.string(),
    lore_version: z.string().optional(),
    rules_hash: z.string().optional(),
    input_hash: z.string().optional(),
  }),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (!result.success && context) {
    console.error(`[Schema Validation Error] ${context}:`, result.error.issues);
  }
  return result;
}

export function parse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError && context) {
      console.error(`[Schema Validation Error] ${context}:`, error.issues);
    }
    throw error;
  }
}

// ============================================================================
// Lore Bundle Schemas (Why 2.0 + Dossier)
// ============================================================================

/**
 * Lore System Schema
 * Represents a star system in the lore bundle
 */
export const LoreSystemSchema = z.object({
  id: z.string().regex(/^[A-Z_]+$/, 'System ID must be uppercase letters and underscores'),
  label: z.string().min(1, 'System label is required'),
  description: z.string().min(1, 'System description is required'),
});

export type LoreSystem = z.infer<typeof LoreSystemSchema>;

/**
 * Lore Source Schema
 * Represents a source citation in the lore bundle
 */
export const LoreSourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]+$/, 'Source ID must be lowercase letters, numbers, hyphens, and underscores'),
  title: z.string().min(1, 'Source title is required'),
  author: z.string().min(1, 'Source author is required'),
  year: z.number().int().min(1900).max(2100),
  disputed: z.boolean(),
  url: z.string().url().optional(),
});

export type LoreSource = z.infer<typeof LoreSourceSchema>;

/**
 * Lore Rule Schema
 * Represents a classification rule in the lore bundle
 */
export const LoreRuleSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'Rule ID must be lowercase letters, numbers, and underscores'),
  systems: z.array(z.object({
    id: z.string(),
    w: z.number().positive(),
  })).min(1, 'Rule must have at least one system'),
  if: z.object({
    typeAny: z.array(z.string()).optional(),
    authorityAny: z.array(z.string()).optional(),
    profileAny: z.array(z.string()).optional(),
    centersAny: z.array(z.string()).optional(),
    channelsAny: z.array(z.string()).optional(),
    gatesAny: z.array(z.number()).optional(),
  }),
  rationale: z.string().min(1, 'Rule rationale is required'),
  sources: z.array(z.string()).min(1, 'Rule must have at least one source'),
  confidence: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  synergy: z.boolean().optional(),
});

export type LoreRule = z.infer<typeof LoreRuleSchema>;

/**
 * Lore Bundle Schema
 * Complete compiled lore data structure
 */
export const LoreBundleSchema = z.object({
  lore_version: z.string().min(1, 'Lore version is required'),
  tieThresholdPct: z.number().positive(),
  rules_hash: z.string().min(1, 'Rules hash is required'),
  systems: z.array(LoreSystemSchema).min(1, 'Bundle must have at least one system'),
  sources: z.array(LoreSourceSchema).min(1, 'Bundle must have at least one source'),
  rules: z.array(LoreRuleSchema).min(1, 'Bundle must have at least one rule'),
});

export type LoreBundle = z.infer<typeof LoreBundleSchema>;

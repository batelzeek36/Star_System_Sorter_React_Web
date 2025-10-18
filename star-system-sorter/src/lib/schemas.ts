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
  meta: z.object({
    canonVersion: z.string(),
    canonChecksum: z.string(),
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

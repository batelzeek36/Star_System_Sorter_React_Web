/**
 * Insight Prompt Templates
 *
 * LLM prompt templates that combine chart comparison data with relevant I Ching lore
 * for generating relationship insights. Prompts are designed to:
 * - Stay under 20KB for LLM context limits
 * - Include all comparison data and relevant lore
 * - Instruct LLM to reference specific gates/channels/systems
 * - Forbid generic or vague language
 *
 * Templates follow the chunked retrieval pattern - only including lore for gates
 * present in the compared charts, keeping context minimal.
 */

import { z } from 'zod';
import type { ChartComparison, SharedGate, TypeDynamic, StarSystemOverlap, CompatibilityScores } from '../comparison';
import type { RelevantLore, GateLore } from '../lore-retriever';
import type { HDExtract } from '../schemas';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Insight type categories for generated insights
 */
export type InsightType = 'shared_resonance' | 'type_dynamic' | 'star_connection' | 'tension' | 'advice';

/**
 * Reference to a specific element (gate, channel, or star system)
 */
export interface InsightReference {
  type: 'gate' | 'channel' | 'system';
  value: string;
}

/**
 * A single generated insight
 */
export interface Insight {
  type: InsightType;
  title: string;
  content: string;
  references: InsightReference[];
}

/**
 * Complete insight generation request
 */
export interface InsightRequest {
  chartA: HDExtract;
  chartB: HDExtract;
  comparison: ChartComparison;
  lore: RelevantLore;
  nameA?: string;
  nameB?: string;
}

/**
 * Prompt generation result with metadata
 */
export interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
  totalSize: number; // bytes
  isWithinLimit: boolean;
}

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const InsightTypeSchema = z.enum([
  'shared_resonance',
  'type_dynamic',
  'star_connection',
  'tension',
  'advice',
]);

export const InsightReferenceSchema = z.object({
  type: z.enum(['gate', 'channel', 'system']),
  value: z.string().min(1),
});

export const InsightSchema = z.object({
  type: InsightTypeSchema,
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(1000),
  references: z.array(InsightReferenceSchema).min(1),
});

export const InsightArraySchema = z.array(InsightSchema).min(3).max(7);

// ============================================================================
// Constants
// ============================================================================

const MAX_PROMPT_SIZE = 20 * 1024; // 20KB limit
const MAX_LORE_ITEMS_PER_CHART = 15; // Limit lore items to control size

// ============================================================================
// Prompt Formatting Helpers
// ============================================================================

/**
 * Format a single gate lore entry for the prompt
 */
function formatGateLore(lore: GateLore): string {
  const starSystems = lore.starMappings.length > 0
    ? lore.starMappings.map(m => `${m.system} (weight: ${m.weight})`).join(', ')
    : 'No specific star system mapping';

  return `Gate ${lore.gate}.${lore.line} - ${lore.hexagramName}
  Meaning: ${lore.iChingMeaning}
  Star Systems: ${starSystems}`;
}

/**
 * Format shared gates for the prompt
 */
function formatSharedGates(sharedGates: SharedGate[]): string {
  if (sharedGates.length === 0) {
    return 'No shared gates between these charts.';
  }

  return sharedGates.map(sg =>
    `Gate ${sg.gate}: Person A has Line ${sg.lineA}, Person B has Line ${sg.lineB}${sg.lineA === sg.lineB ? ' (same line - deep resonance)' : ' (different lines - complementary perspectives)'}`
  ).join('\n');
}

/**
 * Format shared channels for the prompt
 */
function formatSharedChannels(channels: string[]): string {
  if (channels.length === 0) {
    return 'No electromagnetic or shared channels.';
  }

  return channels.map(ch => `Channel ${ch}`).join(', ');
}

/**
 * Format type dynamic for the prompt
 */
function formatTypeDynamic(typeDynamic: TypeDynamic): string {
  return `${typeDynamic.typeA} + ${typeDynamic.typeB}: ${typeDynamic.dynamic}`;
}

/**
 * Format star system overlap for the prompt
 */
function formatStarSystemOverlap(overlap: StarSystemOverlap): string {
  const parts: string[] = [];

  if (overlap.shared.length > 0) {
    parts.push(`Shared star systems: ${overlap.shared.join(', ')}`);
  }

  if (overlap.divergent.length > 0) {
    parts.push(`Divergent star systems: ${overlap.divergent.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'No significant star system overlap or divergence.';
}

/**
 * Format compatibility scores for the prompt
 */
function formatCompatibilityScores(scores: CompatibilityScores): string {
  return `Overall: ${scores.overall}%, Communication: ${scores.communication}%, Energy: ${scores.energy}%`;
}

/**
 * Truncate lore arrays to stay within size limits
 */
function truncateLoreArray(lore: GateLore[], maxItems: number): GateLore[] {
  return lore.slice(0, maxItems);
}

/**
 * Calculate the byte size of a string (UTF-8)
 */
function calculateByteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}

// ============================================================================
// System Prompt Template
// ============================================================================

/**
 * Generate the system prompt that defines the AI's role and output format
 */
export function generateSystemPrompt(): string {
  return `You are an expert Human Design and I Ching analyst specializing in relationship dynamics between two people. Your role is to analyze chart comparison data and generate meaningful, specific insights about their connection.

## Output Requirements

You MUST return a valid JSON array containing 3-5 insights. Each insight must have:
- type: One of "shared_resonance", "type_dynamic", "star_connection", "tension", or "advice"
- title: A concise, specific title (max 100 characters)
- content: Detailed insight text (min 50, max 500 characters)
- references: Array of specific references to gates, channels, or systems mentioned

## Insight Types

1. **shared_resonance**: Insights about gates, channels, or centers both people share
2. **type_dynamic**: Insights about how their Human Design types interact
3. **star_connection**: Insights about their shared or complementary star system alignments
4. **tension**: Potential friction points and how to navigate them
5. **advice**: Practical guidance for the relationship

## Critical Rules

1. **BE SPECIFIC**: Every insight MUST reference actual gate numbers, channel names, or star systems from the provided data
2. **NO GENERIC STATEMENTS**: Avoid vague phrases like "you complement each other" or "you have good chemistry" without specific references
3. **USE THE LORE**: Incorporate the I Ching meanings and hexagram names in your insights
4. **CITE REFERENCES**: Each insight must include at least one reference to a gate, channel, or system
5. **BALANCED PERSPECTIVE**: Include both harmonious aspects and potential challenges

## Output Format

Return ONLY a valid JSON array, no markdown formatting or explanations:

[
  {
    "type": "shared_resonance",
    "title": "Gate 13 Fellowship Connection",
    "content": "Both charts activate Gate 13 (The Listener/Fellowship). This creates a shared capacity for deep listening and holding space for secrets. Person A with Line 2 brings natural receptivity, while Person B with Line 5 adds a universal quality to their shared understanding.",
    "references": [
      {"type": "gate", "value": "13"},
      {"type": "gate", "value": "33"}
    ]
  }
]`;
}

// ============================================================================
// User Prompt Template
// ============================================================================

/**
 * Generate the user prompt with all comparison data and lore context
 */
export function generateUserPrompt(request: InsightRequest): string {
  const { chartA, chartB, comparison, lore, nameA = 'Person A', nameB = 'Person B' } = request;

  // Truncate lore to stay within size limits
  const chartALore = truncateLoreArray(lore.chartAGates, MAX_LORE_ITEMS_PER_CHART);
  const chartBLore = truncateLoreArray(lore.chartBGates, MAX_LORE_ITEMS_PER_CHART);
  const sharedLore = truncateLoreArray(lore.sharedGates, MAX_LORE_ITEMS_PER_CHART);

  return `## Chart Comparison Analysis Request

### Overview
Generate relationship insights for ${nameA} and ${nameB} based on their Human Design charts.

### Chart A (${nameA})
- Type: ${chartA.type}
- Authority: ${chartA.authority}
- Profile: ${chartA.profile}
- Defined Centers: ${chartA.centers.join(', ') || 'None'}
- Gates: ${chartA.gates.join(', ')}

### Chart B (${nameB})
- Type: ${chartB.type}
- Authority: ${chartB.authority}
- Profile: ${chartB.profile}
- Defined Centers: ${chartB.centers.join(', ') || 'None'}
- Gates: ${chartB.gates.join(', ')}

### Comparison Results

#### Type Dynamic
${formatTypeDynamic(comparison.typeDynamic)}

#### Shared Gates
${formatSharedGates(comparison.sharedGates)}

#### Shared/Electromagnetic Channels
${formatSharedChannels(comparison.sharedChannels)}

#### Shared Centers
- Both Defined: ${comparison.sharedCenters.bothDefined.join(', ') || 'None'}
- Both Undefined: ${comparison.sharedCenters.bothUndefined.join(', ') || 'None'}

#### Star System Alignment
${formatStarSystemOverlap(comparison.starSystemOverlap)}

#### Compatibility Scores
${formatCompatibilityScores(comparison.compatibilityScores)}

### I Ching Lore Context

#### ${nameA}'s Gate Meanings
${chartALore.map(formatGateLore).join('\n\n')}

#### ${nameB}'s Gate Meanings
${chartBLore.map(formatGateLore).join('\n\n')}

${sharedLore.length > 0 ? `#### Shared Gate Deep Dive
${sharedLore.map(formatGateLore).join('\n\n')}` : ''}

### Instructions
Using the above comparison data and I Ching lore, generate 3-5 specific insights about this relationship. Remember:
- Reference actual gate numbers, hexagram names, and star systems
- Use the I Ching meanings to add depth
- Include both harmonious aspects and potential tensions
- Be specific, not generic

Return your response as a JSON array only.`;
}

// ============================================================================
// Main Prompt Generation Function
// ============================================================================

/**
 * Generate the complete prompt for insight generation
 * Returns both system and user prompts with size validation
 */
export function generateInsightPrompt(request: InsightRequest): PromptResult {
  const systemPrompt = generateSystemPrompt();
  const userPrompt = generateUserPrompt(request);

  const totalSize = calculateByteSize(systemPrompt) + calculateByteSize(userPrompt);
  const isWithinLimit = totalSize <= MAX_PROMPT_SIZE;

  return {
    systemPrompt,
    userPrompt,
    totalSize,
    isWithinLimit,
  };
}

/**
 * Validate that a prompt result is within acceptable size limits
 */
export function isPromptSizeValid(result: PromptResult, maxSize: number = MAX_PROMPT_SIZE): boolean {
  return result.totalSize <= maxSize;
}

/**
 * Generate a combined prompt string for testing or single-prompt APIs
 */
export function generateCombinedPrompt(request: InsightRequest): string {
  const result = generateInsightPrompt(request);
  return `${result.systemPrompt}\n\n---\n\n${result.userPrompt}`;
}

// ============================================================================
// Response Parsing Functions
// ============================================================================

/**
 * Parse and validate LLM response into Insight array
 */
export function parseInsightResponse(response: string): Insight[] {
  // Try to extract JSON from response (handle markdown code blocks)
  let jsonString = response.trim();

  // Remove markdown code block if present
  const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1].trim();
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to parse LLM response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate with Zod schema
  const result = InsightArraySchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(`Invalid insight format: ${result.error.message}`);
  }

  return result.data;
}

/**
 * Safely parse insight response, returning empty array on failure
 */
export function safeParseInsightResponse(response: string): { success: true; data: Insight[] } | { success: false; error: string } {
  try {
    const insights = parseInsightResponse(response);
    return { success: true, data: insights };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

// ============================================================================
// Prompt Size Estimation Functions
// ============================================================================

/**
 * Estimate the prompt size before generating
 * Useful for pre-flight checks
 */
export function estimatePromptSize(
  chartA: HDExtract,
  chartB: HDExtract,
  loreContextSize: number
): number {
  // Base system prompt is approximately 2KB
  const systemPromptSize = 2 * 1024;

  // Chart data overhead (type, authority, profile, centers, gates lists)
  const chartAOverhead = JSON.stringify(chartA).length;
  const chartBOverhead = JSON.stringify(chartB).length;

  // Comparison data overhead (roughly 500-1000 bytes)
  const comparisonOverhead = 1000;

  // Static text in prompt template (roughly 1KB)
  const staticTextOverhead = 1024;

  return systemPromptSize + chartAOverhead + chartBOverhead + loreContextSize + comparisonOverhead + staticTextOverhead;
}

/**
 * Check if a request is likely to fit within prompt limits
 */
export function willPromptFitInLimit(
  chartA: HDExtract,
  chartB: HDExtract,
  loreContextSize: number,
  maxSize: number = MAX_PROMPT_SIZE
): boolean {
  const estimatedSize = estimatePromptSize(chartA, chartB, loreContextSize);
  return estimatedSize <= maxSize;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all gates referenced in an insight array
 */
export function extractGateReferences(insights: Insight[]): number[] {
  const gates = new Set<number>();

  insights.forEach(insight => {
    insight.references.forEach(ref => {
      if (ref.type === 'gate') {
        const gateNum = parseInt(ref.value, 10);
        if (!isNaN(gateNum) && gateNum >= 1 && gateNum <= 64) {
          gates.add(gateNum);
        }
      }
    });
  });

  return Array.from(gates).sort((a, b) => a - b);
}

/**
 * Get all systems referenced in an insight array
 */
export function extractSystemReferences(insights: Insight[]): string[] {
  const systems = new Set<string>();

  insights.forEach(insight => {
    insight.references.forEach(ref => {
      if (ref.type === 'system') {
        systems.add(ref.value);
      }
    });
  });

  return Array.from(systems).sort();
}

/**
 * Get all channels referenced in an insight array
 */
export function extractChannelReferences(insights: Insight[]): string[] {
  const channels = new Set<string>();

  insights.forEach(insight => {
    insight.references.forEach(ref => {
      if (ref.type === 'channel') {
        channels.add(ref.value);
      }
    });
  });

  return Array.from(channels).sort();
}

/**
 * Validate that insights reference gates from the actual charts
 */
export function validateInsightReferences(
  insights: Insight[],
  chartA: HDExtract,
  chartB: HDExtract
): { valid: boolean; invalidReferences: InsightReference[] } {
  const allValidGates = new Set([...chartA.gates, ...chartB.gates]);
  const invalidReferences: InsightReference[] = [];

  insights.forEach(insight => {
    insight.references.forEach(ref => {
      if (ref.type === 'gate') {
        const gateNum = parseInt(ref.value, 10);
        if (!allValidGates.has(gateNum)) {
          invalidReferences.push(ref);
        }
      }
    });
  });

  return {
    valid: invalidReferences.length === 0,
    invalidReferences,
  };
}

/**
 * Insight Generation Service
 *
 * Wires LLM prompts to OpenAI API and parses structured responses.
 * This service handles the backend insight generation for chart comparison.
 *
 * Features:
 * - Calls OpenAI with constructed prompts
 * - Parses responses with Zod schema validation
 * - Returns structured Insight[] array
 * - Handles API errors gracefully with fallback
 */

import OpenAI from 'openai';
import { z } from 'zod';

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
 * HD Extract - extracted Human Design chart data
 */
export interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
}

/**
 * Gate/Line pair representing a specific position in a chart
 */
export interface GateLine {
  gate: number;
  line: number;
}

/**
 * Shared gate between two charts
 */
export interface SharedGate {
  gate: number;
  lineA: number;
  lineB: number;
}

/**
 * Centers comparison
 */
export interface SharedCenters {
  bothDefined: string[];
  bothUndefined: string[];
}

/**
 * Type dynamic between two chart types
 */
export interface TypeDynamic {
  typeA: string;
  typeB: string;
  dynamic: string;
}

/**
 * Star system overlap between two charts
 */
export interface StarSystemOverlap {
  shared: string[];
  divergent: string[];
}

/**
 * Compatibility scores
 */
export interface CompatibilityScores {
  overall: number;
  communication: number;
  energy: number;
}

/**
 * Complete chart comparison result
 */
export interface ChartComparison {
  sharedGates: SharedGate[];
  sharedChannels: string[];
  sharedCenters: SharedCenters;
  typeDynamic: TypeDynamic;
  starSystemOverlap: StarSystemOverlap;
  compatibilityScores: CompatibilityScores;
}

/**
 * Star system mapping for a gate
 */
export interface StarMapping {
  system: string;
  weight: number;
  why: string;
}

/**
 * Complete lore data for a single gate.line
 */
export interface GateLore {
  gate: number;
  line: number;
  hexagramName: string;
  iChingMeaning: string;
  starMappings: StarMapping[];
}

/**
 * Aggregated lore data for chart comparison
 */
export interface RelevantLore {
  chartAGates: GateLore[];
  chartBGates: GateLore[];
  sharedGates: GateLore[];
  totalContextSize: number;
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
  totalSize: number;
  isWithinLimit: boolean;
}

/**
 * Insight generation result
 */
export interface InsightGenerationResult {
  success: true;
  insights: Insight[];
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Insight generation error result
 */
export interface InsightGenerationError {
  success: false;
  error: string;
  code: 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'UNKNOWN';
}

export type InsightGenerationResponse = InsightGenerationResult | InsightGenerationError;

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
const MAX_LORE_ITEMS_PER_CHART = 15;
const DEFAULT_MODEL = 'gpt-4o-mini';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.7;

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
// Prompt Generation
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

/**
 * Generate the complete prompt for insight generation
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

// ============================================================================
// Response Parsing
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
 * Safely parse insight response
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
// OpenAI Client
// ============================================================================

let openaiClient: OpenAI | null = null;

/**
 * Get or create the OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Reset the OpenAI client (useful for testing)
 */
export function resetOpenAIClient(): void {
  openaiClient = null;
}

/**
 * Set a custom OpenAI client (useful for testing with mocks)
 */
export function setOpenAIClient(client: OpenAI): void {
  openaiClient = client;
}

// ============================================================================
// Main Generation Function
// ============================================================================

/**
 * Generate insights for a chart comparison
 *
 * @param request - The insight request containing charts, comparison, and lore
 * @param options - Optional configuration for the generation
 * @returns InsightGenerationResponse with either insights or error
 */
export async function generateInsights(
  request: InsightRequest,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<InsightGenerationResponse> {
  const model = options?.model || DEFAULT_MODEL;
  const maxTokens = options?.maxTokens || MAX_TOKENS;
  const temperature = options?.temperature ?? TEMPERATURE;

  try {
    // Generate prompts
    const promptResult = generateInsightPrompt(request);

    if (!promptResult.isWithinLimit) {
      return {
        success: false,
        error: `Prompt exceeds size limit: ${promptResult.totalSize} bytes (max: ${MAX_PROMPT_SIZE})`,
        code: 'VALIDATION_ERROR',
      };
    }

    // Get OpenAI client
    const client = getOpenAIClient();

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: promptResult.systemPrompt },
        { role: 'user', content: promptResult.userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    // Extract response content
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return {
        success: false,
        error: 'No response content from OpenAI',
        code: 'API_ERROR',
      };
    }

    // Parse and validate response
    const parseResult = safeParseInsightResponse(responseContent);

    if (parseResult.success === false) {
      return {
        success: false,
        error: parseResult.error,
        code: 'PARSE_ERROR',
      };
    }

    return {
      success: true,
      insights: parseResult.data,
      tokenUsage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    };

  } catch (error) {
    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT',
        };
      }
      return {
        success: false,
        error: `OpenAI API error: ${error.message}`,
        code: 'API_ERROR',
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        code: 'UNKNOWN',
      };
    }

    return {
      success: false,
      error: 'An unknown error occurred',
      code: 'UNKNOWN',
    };
  }
}

// ============================================================================
// Fallback Insights
// ============================================================================

/**
 * Generate fallback insights when API fails
 * Uses chart data to create basic insights without LLM
 */
export function generateFallbackInsights(request: InsightRequest): Insight[] {
  const { chartA, chartB, comparison, nameA = 'Person A', nameB = 'Person B' } = request;
  const insights: Insight[] = [];

  // Type dynamic insight (always available)
  insights.push({
    type: 'type_dynamic',
    title: `${comparison.typeDynamic.typeA} and ${comparison.typeDynamic.typeB} Connection`,
    content: `${nameA} (${chartA.type}) and ${nameB} (${chartB.type}) bring ${comparison.typeDynamic.dynamic}. This creates a dynamic interplay of energies.`,
    references: [
      { type: 'system', value: chartA.type },
      { type: 'system', value: chartB.type },
    ],
  });

  // Shared gates insight (if any)
  if (comparison.sharedGates.length > 0) {
    const sharedGate = comparison.sharedGates[0];
    insights.push({
      type: 'shared_resonance',
      title: `Shared Gate ${sharedGate.gate} Activation`,
      content: `Both ${nameA} and ${nameB} have Gate ${sharedGate.gate} activated. ${nameA} expresses this through Line ${sharedGate.lineA}, while ${nameB} channels it through Line ${sharedGate.lineB}.`,
      references: [
        { type: 'gate', value: String(sharedGate.gate) },
      ],
    });
  }

  // Shared channels insight (if any)
  if (comparison.sharedChannels.length > 0) {
    const channel = comparison.sharedChannels[0];
    insights.push({
      type: 'shared_resonance',
      title: `Channel ${channel} Connection`,
      content: `The electromagnetic connection through Channel ${channel} creates a powerful energy exchange between ${nameA} and ${nameB}. This channel activates when they are together.`,
      references: [
        { type: 'channel', value: channel },
      ],
    });
  }

  // Star system insight (if overlap exists)
  if (comparison.starSystemOverlap.shared.length > 0) {
    const sharedSystem = comparison.starSystemOverlap.shared[0];
    insights.push({
      type: 'star_connection',
      title: `${sharedSystem} Star System Alignment`,
      content: `Both individuals share a connection to the ${sharedSystem} star system, suggesting aligned cosmic origins and compatible energetic frequencies.`,
      references: [
        { type: 'system', value: sharedSystem },
      ],
    });
  }

  // Ensure we have at least 3 insights by adding generic advice if needed
  if (insights.length < 3) {
    insights.push({
      type: 'advice',
      title: 'Honoring Each Other\'s Authority',
      content: `${nameA} operates with ${chartA.authority} authority, while ${nameB} uses ${chartB.authority}. Respect these different decision-making processes for a harmonious connection.`,
      references: [
        { type: 'system', value: chartA.authority },
        { type: 'system', value: chartB.authority },
      ],
    });
  }

  return insights;
}

/**
 * Generate insights with automatic fallback on failure
 */
export async function generateInsightsWithFallback(
  request: InsightRequest,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<InsightGenerationResult> {
  const result = await generateInsights(request, options);

  if (result.success) {
    return result;
  }

  // Return fallback insights on failure
  return {
    success: true,
    insights: generateFallbackInsights(request),
  };
}

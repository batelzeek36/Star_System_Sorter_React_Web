import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  generateInsights,
  generateFallbackInsights,
  InsightRequest,
  Insight,
  ChartComparison,
  HDExtract,
  RelevantLore,
} from '../services/insight-generator.js';

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const HDExtractSchema = z.object({
  type: z.string().min(1),
  authority: z.string().min(1),
  profile: z.string().min(1),
  centers: z.array(z.string()),
  channels: z.array(z.number()),
  gates: z.array(z.number()),
});

const StarMappingSchema = z.object({
  system: z.string().min(1),
  weight: z.number(),
  why: z.string(),
});

const GateLoreSchema = z.object({
  gate: z.number(),
  line: z.number(),
  hexagramName: z.string(),
  iChingMeaning: z.string(),
  starMappings: z.array(StarMappingSchema),
});

const RelevantLoreSchema = z.object({
  chartAGates: z.array(GateLoreSchema),
  chartBGates: z.array(GateLoreSchema),
  sharedGates: z.array(GateLoreSchema),
  totalContextSize: z.number(),
});

const SharedGateSchema = z.object({
  gate: z.number(),
  lineA: z.number(),
  lineB: z.number(),
});

const SharedCentersSchema = z.object({
  bothDefined: z.array(z.string()),
  bothUndefined: z.array(z.string()),
});

const TypeDynamicSchema = z.object({
  typeA: z.string(),
  typeB: z.string(),
  dynamic: z.string(),
});

const StarSystemOverlapSchema = z.object({
  shared: z.array(z.string()),
  divergent: z.array(z.string()),
});

const CompatibilityScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
});

const ChartComparisonSchema = z.object({
  sharedGates: z.array(SharedGateSchema),
  sharedChannels: z.array(z.string()),
  sharedCenters: SharedCentersSchema,
  typeDynamic: TypeDynamicSchema,
  starSystemOverlap: StarSystemOverlapSchema,
  compatibilityScores: CompatibilityScoresSchema,
});

const InsightsRequestSchema = z.object({
  chartA: HDExtractSchema,
  chartB: HDExtractSchema,
  comparison: ChartComparisonSchema,
  lore: RelevantLoreSchema,
  nameA: z.string().optional(),
  nameB: z.string().optional(),
  useFallback: z.boolean().optional().default(false),
});

type InsightsAPIRequest = z.infer<typeof InsightsRequestSchema>;

// ============================================================================
// Response Types
// ============================================================================

interface InsightsSuccessResponse {
  success: true;
  insights: Insight[];
  comparison: ChartComparison;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface InsightsErrorResponse {
  success: false;
  error: string;
  code: string;
  comparison?: ChartComparison;
  fallbackInsights?: Insight[];
}

type InsightsAPIResponse = InsightsSuccessResponse | InsightsErrorResponse;

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/insights
 * Generate relationship insights from two HD chart comparison
 *
 * Request body:
 * - chartA: HDExtract - First person's chart data
 * - chartB: HDExtract - Second person's chart data
 * - comparison: ChartComparison - Pre-computed comparison results
 * - lore: RelevantLore - Chunked I Ching lore for relevant gates
 * - nameA?: string - Optional name for first person
 * - nameB?: string - Optional name for second person
 * - useFallback?: boolean - If true, always use fallback insights (for testing)
 *
 * Response:
 * - success: boolean
 * - insights: Insight[] - Generated relationship insights
 * - comparison: ChartComparison - The comparison data (echoed back)
 * - tokenUsage?: { promptTokens, completionTokens, totalTokens }
 */
router.post('/insights', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = InsightsRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationResult.error.issues,
      } as InsightsErrorResponse & { details: z.ZodIssue[] });
    }

    const requestData = validationResult.data;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY && !requestData.useFallback) {
      console.error('[API Error] OPENAI_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: AI service not available',
        code: 'CONFIG_ERROR',
        comparison: requestData.comparison,
        fallbackInsights: generateFallbackInsights(requestData as InsightRequest),
      } as InsightsErrorResponse);
    }

    // Build insight request
    const insightRequest: InsightRequest = {
      chartA: requestData.chartA as HDExtract,
      chartB: requestData.chartB as HDExtract,
      comparison: requestData.comparison as ChartComparison,
      lore: requestData.lore as RelevantLore,
      nameA: requestData.nameA,
      nameB: requestData.nameB,
    };

    // Use fallback insights if requested (useful for testing without OpenAI)
    if (requestData.useFallback) {
      const fallbackInsights = generateFallbackInsights(insightRequest);
      return res.json({
        success: true,
        insights: fallbackInsights,
        comparison: requestData.comparison,
      } as InsightsSuccessResponse);
    }

    // Generate insights using OpenAI
    console.log('[API Call] Generating insights for chart comparison');
    const result = await generateInsights(insightRequest);

    if (!result.success) {
      console.error('[Insight Generation Error]', result.error, result.code);

      // Return error with fallback insights
      const fallbackInsights = generateFallbackInsights(insightRequest);

      return res.status(result.code === 'RATE_LIMIT' ? 429 : 500).json({
        success: false,
        error: result.error,
        code: result.code,
        comparison: requestData.comparison,
        fallbackInsights,
      } as InsightsErrorResponse);
    }

    // Success - return insights with comparison data
    console.log('[API Success] Generated', result.insights.length, 'insights');

    return res.json({
      success: true,
      insights: result.insights,
      comparison: requestData.comparison,
      tokenUsage: result.tokenUsage,
    } as InsightsSuccessResponse);

  } catch (error) {
    console.error('[Server Error]', error);

    // Try to provide fallback insights even on unexpected errors
    try {
      const validationResult = InsightsRequestSchema.safeParse(req.body);
      if (validationResult.success) {
        const fallbackInsights = generateFallbackInsights(validationResult.data as InsightRequest);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
          comparison: validationResult.data.comparison,
          fallbackInsights,
        } as InsightsErrorResponse);
      }
    } catch {
      // Ignore - we can't provide fallback
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    } as InsightsErrorResponse);
  }
});

/**
 * GET /api/insights/health
 * Health check for the insights service
 */
router.get('/insights/health', (_req: Request, res: Response) => {
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  res.json({
    status: 'ok',
    service: 'insights',
    openaiConfigured: hasOpenAIKey,
  });
});

export default router;

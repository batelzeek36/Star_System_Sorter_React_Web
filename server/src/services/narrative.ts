/**
 * Narrative Generation Service
 * 
 * Uses GPT-4o to generate personalized star system narratives
 * based on classification results and HD data.
 * 
 * Caching Architecture:
 * 1. Negative cache check (prevent repeated errors)
 * 2. SWR outer wrapper (serve stale immediately, refresh in background)
 * 3. Stampede protection inside miss/refresh path (prevent duplicate API calls)
 * 4. Fallback to template on errors
 */

import OpenAI from 'openai';
import {
  withStaleWhileRevalidate,
  withStampedeProtection,
  getNegativeCacheEntry,
  cacheNegativeResult,
  createCachedNarrative,
  setCached,
} from '../lib/redis-cache.js';
import {
  generateCacheKey,
  hashPrompt,
  getEngineVersion,
} from '../lib/cache-utils.js';
import { getCacheConfig } from '../lib/cache-config.js';

// Lazy-initialize OpenAI client to ensure env vars are loaded
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface NarrativeRequest {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  percentages: Record<string, number>;
  hdData: {
    type: string;
    authority: string;
    profile: string;
    centers: string[];
    gates: number[];
  };
}

export interface NarrativeResponse {
  summary: string;
  cached: boolean;
}

/**
 * Build system prompt for narrative generation
 * Exported for cache key hashing
 */
export function buildSystemPrompt(): string {
  return `You are a narrative generator for Star System Sorter, a digital humanities research project that maps Human Design birth charts to star system archetypes.

Your role is to create personalized, insightful summaries that:
1. Interpret the user's star system classification (primary or hybrid)
2. Explain what their specific blend means in practical, human terms
3. Reference their Human Design attributes (type, authority, profile) when relevant
4. Use evocative but grounded language - cosmic but not woo-woo
5. Keep it concise (2-4 paragraphs, ~150-250 words)

STAR SYSTEM ARCHETYPES (use these as reference):

**Pleiades**: Nervous system caretaking, emotional safety, nurturing bonds, attachment security, feeding/holding energy
**Sirius**: Initiation through ordeal, catalyzing transformation via crisis, rites of passage, ascension through challenge
**Lyra**: Creative expression, artistic innovation, beauty as medicine, harmonic resonance, cultural preservation
**Andromeda**: Liberation work, confronting exploitation, restoring sovereignty, anti-domination ethics, protective intervention
**Orion Light (Osirian)**: Mystery schools, sacred geometry, wisdom keeping, record keeping, Thoth/Hermes lineage
**Orion Dark**: Control, hierarchy, shadow work, power dynamics, often allied with Draco
**Arcturus**: Frequency repair, trauma field cleanup, energetic recalibration, clinical healing, system refinement
**Draco**: Predator scanning, resource control, loyalty enforcement, survival through dominance, access gatekeeping

TONE GUIDELINES:
- Confident but not arrogant
- Insightful but not prescriptive
- Cosmic but grounded in psychology/behavior
- Avoid: "scientifically proven", "predict your future", medical claims
- Use: "pattern recognition", "archetypal mapping", "resonance", "signature"

STRUCTURE:
1. Opening: State their classification clearly (primary or hybrid)
2. Core: Explain what their blend means behaviorally/psychologically
3. Integration: How their HD attributes (type/authority/profile) interact with their star system signature
4. Closing: Practical insight or invitation to explore further

Remember: This is comparative mythology research with academic rigor, not typical astrology. Frame insights as pattern recognition and archetypal resonance.`;
}

/**
 * Build user prompt from classification data
 * Exported for cache key hashing
 */
export function buildUserPrompt(request: NarrativeRequest): string {
  const { classification, primary, hybrid, percentages, hdData } = request;
  
  let classificationText = '';
  if (classification === 'primary' && primary) {
    classificationText = `Primary Classification: ${primary} (${percentages[primary]?.toFixed(1)}%)`;
  } else if (classification === 'hybrid' && hybrid) {
    const [sys1, sys2] = hybrid;
    classificationText = `Hybrid Classification: ${sys1} (${percentages[sys1]?.toFixed(1)}%) + ${sys2} (${percentages[sys2]?.toFixed(1)}%)`;
  } else {
    classificationText = 'Unresolved Classification';
  }
  
  // Get top 3 systems for context
  const topSystems = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([sys, pct]) => `${sys}: ${pct.toFixed(1)}%`)
    .join(', ');
  
  return `Generate a personalized narrative for this user:

${classificationText}

Top 3 Systems: ${topSystems}

Human Design Profile:
- Type: ${hdData.type}
- Authority: ${hdData.authority}
- Profile: ${hdData.profile}
- Defined Centers: ${hdData.centers.join(', ')}
- Active Gates: ${hdData.gates.length} gates

Create a compelling, insightful summary that explains what this specific combination means for them. Focus on the behavioral/psychological signature of their star system blend and how it manifests through their HD configuration.`;
}

/**
 * Generate narrative using GPT-4o
 */
export async function generateNarrative(
  request: NarrativeRequest
): Promise<NarrativeResponse> {
  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(request) },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const summary = completion.choices[0]?.message?.content || '';
    
    return {
      summary,
      cached: false,
    };
  } catch (error) {
    console.error('Error generating narrative:', error);
    throw new Error('Failed to generate narrative');
  }
}

/**
 * Generate fallback narrative (when API fails or key missing)
 */
export function generateFallbackNarrative(
  request: NarrativeRequest
): NarrativeResponse {
  const { classification, primary, hybrid, percentages } = request;
  
  let summary = '';
  
  if (classification === 'primary' && primary) {
    const pct = percentages[primary]?.toFixed(1) || '0.0';
    summary = `You are primarily aligned with the ${primary} star system (${pct}%). This signature reflects your core archetypal pattern and how you naturally engage with the world. Your Human Design configuration amplifies this resonance through your ${request.hdData.type} type and ${request.hdData.authority} authority.`;
  } else if (classification === 'hybrid' && hybrid) {
    const [sys1, sys2] = hybrid;
    const pct1 = percentages[sys1]?.toFixed(1) || '0.0';
    const pct2 = percentages[sys2]?.toFixed(1) || '0.0';
    summary = `You are a near-perfect dual blend of ${sys1} (${pct1}%) and ${sys2} (${pct2}%). This hybrid signature gives you access to both archetypal patterns, allowing you to navigate between different modes of being. Your ${request.hdData.type} type and ${request.hdData.authority} authority shape how you express this unique combination.`;
  } else {
    summary = `Your star system classification shows a distributed pattern across multiple systems. This suggests a versatile archetypal signature that draws from various sources. Your ${request.hdData.type} type and ${request.hdData.authority} authority provide the framework for how you integrate these diverse influences.`;
  }
  
  return {
    summary,
    cached: false,
  };
}

/**
 * Get narrative with Redis caching
 * 
 * Architecture:
 * 1. Check negative cache (prevent repeated errors) - if ENABLE_NEGATIVE_CACHE=true
 * 2. Use SWR as outer wrapper (serve stale immediately, refresh in background) - if ENABLE_SWR=true
 * 3. Stampede protection inside miss/refresh path (prevent duplicate API calls) - if ENABLE_STAMPEDE_PROTECTION=true
 * 4. Fallback to template on errors
 * 
 * Feature flags control which caching strategies are active.
 */
export async function getNarrative(
  request: NarrativeRequest,
  bypassCache: boolean = false
): Promise<NarrativeResponse> {
  const config = getCacheConfig();
  
  // If cache bypass is requested, generate fresh
  if (bypassCache) {
    try {
      return await generateNarrative(request);
    } catch (error) {
      console.error('Error generating narrative (bypass cache):', error);
      return generateFallbackNarrative(request);
    }
  }
  
  // If Redis cache is disabled, generate directly
  if (!config.enableRedisCache) {
    try {
      return await generateNarrative(request);
    } catch (error) {
      console.error('Error generating narrative (Redis disabled):', error);
      return generateFallbackNarrative(request);
    }
  }
  
  try {
    // Generate cache key
    const engineVersion = getEngineVersion();
    const promptHash = hashPrompt(buildSystemPrompt(), buildUserPrompt(request));
    
    const cacheKey = generateCacheKey(
      {
        classification: request.classification,
        primary: request.primary,
        hybrid: request.hybrid,
        percentages: request.percentages,
        hdData: request.hdData,
      },
      {
        engineVersion,
        promptHash,
        keyPrefix: process.env.CACHE_PREFIX || 'narr',
      }
    );
    
    // 1. Check negative cache first (if enabled)
    if (config.enableNegativeCache) {
      const negativeEntry = await getNegativeCacheEntry(cacheKey);
      if (negativeEntry) {
        console.log('Negative cache hit, returning cached error');
        throw new Error(negativeEntry.error);
      }
    }
    
    // Define the generation function
    const generateFn = async (): Promise<string> => {
      // Generate narrative
      const result = await generateNarrative(request);
      
      // Store in cache with metadata
      const profile = {
        classification: request.classification,
        primary: request.primary,
        hybrid: request.hybrid,
        percentages: request.percentages,
      };
      
      const cachedValue = createCachedNarrative(
        result.summary,
        profile,
        {
          engineVersion,
          promptHash,
        }
      );
      
      await setCached(cacheKey, cachedValue);
      
      return result.summary;
    };
    
    let summary: string;
    
    // 2. Apply SWR if enabled, otherwise use stampede protection or direct generation
    if (config.enableSWR) {
      summary = await withStaleWhileRevalidate(
        cacheKey,
        async () => {
          // 3. Apply stampede protection inside miss/refresh path (if enabled)
          if (config.enableStampedeProtection) {
            return await withStampedeProtection(cacheKey, generateFn);
          } else {
            return await generateFn();
          }
        }
      );
    } else if (config.enableStampedeProtection) {
      // Use stampede protection without SWR
      summary = await withStampedeProtection(cacheKey, generateFn);
    } else {
      // No SWR, no stampede protection - just generate
      summary = await generateFn();
    }
    
    return {
      summary,
      cached: true,
    };
    
  } catch (error) {
    console.error('Error in getNarrative:', error);
    
    // Cache validation errors for 15 minutes (if negative cache enabled)
    if (config.enableNegativeCache && error instanceof Error && error.message.includes('validation')) {
      const cacheKey = generateCacheKey(
        {
          classification: request.classification,
          primary: request.primary,
          hybrid: request.hybrid,
          percentages: request.percentages,
          hdData: request.hdData,
        },
        {
          engineVersion: getEngineVersion(),
          promptHash: hashPrompt(buildSystemPrompt(), buildUserPrompt(request)),
          keyPrefix: process.env.CACHE_PREFIX || 'narr',
        }
      );
      
      await cacheNegativeResult(cacheKey, error.message, 15);
    }
    
    // 4. Fallback to template on errors
    return generateFallbackNarrative(request);
  }
}

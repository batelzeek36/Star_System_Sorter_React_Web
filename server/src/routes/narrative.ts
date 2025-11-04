/**
 * Narrative Generation Route
 * 
 * POST /api/narrative - Generate personalized star system narrative
 * 
 * Uses Redis-backed caching with:
 * - Negative cache (prevent repeated errors)
 * - Stale-while-revalidate (serve stale immediately, refresh in background)
 * - Stampede protection (prevent duplicate API calls)
 * - Fallback to template on errors
 */

import express from 'express';
import { z } from 'zod';
import { getNarrative, type NarrativeRequest } from '../services/narrative.js';

const router = express.Router();

// Validation schema
const NarrativeRequestSchema = z.object({
  classification: z.enum(['primary', 'hybrid', 'unresolved']),
  primary: z.string().optional(),
  hybrid: z.tuple([z.string(), z.string()]).optional(),
  percentages: z.record(z.string(), z.number()),
  hdData: z.object({
    type: z.string(),
    authority: z.string(),
    profile: z.string(),
    centers: z.array(z.string()),
    gates: z.array(z.number()),
  }),
});

/**
 * POST /api/narrative
 * Generate personalized narrative from classification results
 * 
 * Uses Redis-backed getNarrative() which handles:
 * 1. Negative cache check (prevent repeated errors)
 * 2. SWR (serve stale immediately, refresh in background)
 * 3. Stampede protection (prevent duplicate API calls)
 * 4. Fallback to template on errors
 * 
 * Headers:
 * - X-Bypass-Cache: 'true' - Force fresh generation (for regenerate feature)
 */
router.post('/narrative', async (req, res) => {
  try {
    // Validate request
    const validationResult = NarrativeRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validationResult.error.issues,
      });
    }
    
    const request = validationResult.data as NarrativeRequest;
    
    // Check if cache bypass is requested (for regenerate feature)
    const bypassCache = req.headers['x-bypass-cache'] === 'true';
    
    // Generate narrative with Redis caching
    // getNarrative() handles all caching logic internally:
    // - Negative cache check
    // - SWR (serve stale, refresh in background)
    // - Stampede protection
    // - Fallback to template on errors
    const narrative = await getNarrative(request, bypassCache);
    
    return res.json(narrative);
    
  } catch (error) {
    console.error('Error in narrative endpoint:', error);
    return res.status(500).json({
      error: 'Failed to generate narrative',
    });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import NodeCache from 'node-cache';
import crypto from 'crypto';
import { z } from 'zod';

const router = Router();

// Initialize cache with 30-day TTL (in seconds)
const cache = new NodeCache({
  stdTTL: 30 * 24 * 60 * 60, // 30 days
  checkperiod: 60 * 60, // Check for expired keys every hour
});

// Validation schemas
const BirthDataAPIRequestSchema = z.object({
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  timeZone: z.string().min(1, 'Time zone is required'),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
});

const HDExtractSchema = z.object({
  type: z.string(),
  authority: z.string(),
  profile: z.string(),
  centers: z.array(z.string()),
  channels: z.array(z.number()),
  gates: z.array(z.number()),
});

type BirthDataAPIRequest = z.infer<typeof BirthDataAPIRequestSchema>;
type HDExtract = z.infer<typeof HDExtractSchema>;

/**
 * Generate a hashed cache key from birth data
 * Uses SHA-256 to hash the concatenated string for privacy
 */
function generateCacheKey(data: BirthDataAPIRequest): string {
  const keyString = `${data.dateISO}|${data.time}|${data.timeZone}`;
  return crypto.createHash('sha256').update(keyString).digest('hex');
}

/**
 * Extract HD data from BodyGraph API response
 */
function extractHDData(bodyGraphResponse: any): HDExtract {
  const props = bodyGraphResponse.Properties || {};
  
  return {
    type: props.Type?.option || '',
    authority: props.InnerAuthority?.option || '',
    profile: props.Profile?.option || '',
    centers: props.Centers?.list?.map((c: any) => c.option) || [],
    channels: props.Channels?.list?.map((c: any) => parseInt(c.option, 10)) || [],
    gates: props.Gates?.list?.map((g: any) => parseInt(g.option, 10)) || [],
  };
}

/**
 * POST /api/hd
 * Retrieve Human Design data from BodyGraph API with caching
 */
router.post('/hd', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = BirthDataAPIRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.issues,
      });
    }

    const birthData = validationResult.data;

    // Check if API key is configured
    if (!process.env.BODYGRAPH_API_KEY) {
      console.error('[API Error] BODYGRAPH_API_KEY not configured');
      return res.status(500).json({
        error: 'Server configuration error',
      });
    }

    // Generate cache key
    const cacheKey = generateCacheKey(birthData);

    // Check cache first
    const cachedData = cache.get<HDExtract>(cacheKey);
    if (cachedData) {
      console.log('[Cache Hit] Returning cached HD data');
      return res.json(cachedData);
    }

    // Call BodyGraph API
    console.log('[API Call] Fetching HD data from BodyGraph API');
    
    const bodyGraphUrl = 'https://api.bodygraphchart.com/v221006/hd-data';
    const response = await fetch(bodyGraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BODYGRAPH_API_KEY}`,
      },
      body: JSON.stringify({
        date: `${birthData.dateISO} ${birthData.time}`,
        timezone: birthData.timeZone,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[BodyGraph API Error]', response.status, errorText);
      
      return res.status(response.status === 401 ? 500 : response.status).json({
        error: 'Failed to retrieve chart data',
        message: response.status === 401 
          ? 'API authentication failed' 
          : 'External API error',
      });
    }

    const bodyGraphData = await response.json();

    // Extract HD data
    const hdExtract = extractHDData(bodyGraphData);

    // Validate extracted data
    const hdValidation = HDExtractSchema.safeParse(hdExtract);
    if (!hdValidation.success) {
      console.error('[Extraction Error] Invalid HD data structure', hdValidation.error.issues);
      return res.status(500).json({
        error: 'Failed to parse chart data',
      });
    }

    // Store in cache
    cache.set(cacheKey, hdExtract);
    console.log('[Cache Store] HD data cached successfully');

    // Return to client
    return res.json(hdExtract);

  } catch (error) {
    console.error('[Server Error]', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;

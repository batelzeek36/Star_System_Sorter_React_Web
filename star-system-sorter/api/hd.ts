import type { VercelRequest, VercelResponse } from '@vercel/node';
import NodeCache from 'node-cache';
import { z } from 'zod';

// Cache with 30-day TTL
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });

// Validation schema
const BirthDataAPIRequestSchema = z.object({
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timeZone: z.string(),
});

// Generate cache key (hashed for privacy)
function generateCacheKey(dateISO: string, time: string, timeZone: string): string {
  const data = `${dateISO}|${time}|${timeZone}`;
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hd_${Math.abs(hash).toString(36)}`;
}

// Extract HD data from BodyGraph API response
function extractHDData(bodyGraphResponse: any) {
  const props = bodyGraphResponse.Properties || {};
  
  return {
    type: props.Type?.option || '',
    authority: props.InnerAuthority?.option || '',
    profile: props.Profile?.option || '',
    centers: props.DefinedCenters?.list?.map((c: any) => c.option) || [],
    channels: props.Channels?.list?.map((c: any) => {
      // Channels are in format "13 - 33", extract first number
      const match = c.option.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : parseInt(c.option, 10);
    }) || [],
    gates: props.Gates?.list?.map((g: any) => parseInt(g.option, 10)) || [],
  };
}

// Fetch HD data from BodyGraph API
async function fetchHDData(dateISO: string, time: string, timeZone: string) {
  const apiKey = process.env.BODYGRAPH_API_KEY;
  if (!apiKey) {
    throw new Error('BODYGRAPH_API_KEY not configured');
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    date: `${dateISO} ${time}`,
    timezone: timeZone,
  });
  
  const bodyGraphUrl = `https://api.bodygraphchart.com/v221006/hd-data?${params.toString()}`;
  
  const response = await fetch(bodyGraphUrl, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[BodyGraph API Error]', response.status, errorText);
    throw new Error(`BodyGraph API error: ${response.status}`);
  }

  const bodyGraphData = await response.json();

  // Check for API error response
  if (bodyGraphData.error) {
    console.error('[BodyGraph API Error]', bodyGraphData.error);
    throw new Error(`BodyGraph API error: ${bodyGraphData.error}`);
  }

  // Extract HD data
  return extractHDData(bodyGraphData);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse and validate request body
    const validated = BirthDataAPIRequestSchema.parse(req.body);

    // Generate cache key
    const cacheKey = generateCacheKey(validated.dateISO, validated.time, validated.timeZone);

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit:', cacheKey);
      return res.status(200).json(cached);
    }

    // Fetch from API
    console.log('Cache miss, fetching from BodyGraph API');
    const hdData = await fetchHDData(validated.dateISO, validated.time, validated.timeZone);

    // Store in cache
    cache.set(cacheKey, hdData);

    return res.status(200).json(hdData);
  } catch (error) {
    console.error('Error processing request:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.issues });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

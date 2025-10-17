# BodyGraph API Integration Guide

## Overview

The Star System Sorter uses the BodyGraph Chart API to retrieve Human Design birth chart data. This guide covers the complete integration pattern.

## Architecture

```
React Web Client → Node.js Server → BodyGraph API
                   (POST /api/hd)
```

**Benefits:**
- API key never exposed in client bundle
- Centralized caching reduces API calls (30-day TTL)
- Consistent error handling
- Rate limiting control

## API Credentials

Get your API key from: https://bodygraphchart.com/api

Store in `.env`:
```bash
VITE_BODYGRAPH_API_KEY=your-api-key-here
```

## Client Implementation

```typescript
// src/api/bodygraph-client.ts

interface BirthData {
  dateISO: string;      // YYYY-MM-DD
  time: string;         // HH:mm (24-hour)
  timeZone: string;     // IANA timezone
  lat?: number;
  lon?: number;
}

interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
}

export async function computeHDExtract(data: BirthData): Promise<HDExtract> {
  const response = await fetch('/api/hd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to compute HD data');
  }

  return response.json();
}
```

## Server Implementation (Node.js/Express)

```typescript
// server/routes/hd.ts

import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 }); // 30 days

router.post('/api/hd', async (req, res) => {
  try {
    const { dateISO, time, timeZone, lat, lon } = req.body;

    // Create cache key
    const cacheKey = `${dateISO}T${time}:${timeZone}:${lat}:${lon}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Call BodyGraph API
    const response = await fetch('https://api.bodygraphchart.com/v221006/hd-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BODYGRAPH_API_KEY}`,
      },
      body: JSON.stringify({
        date: `${dateISO} ${time}`,
        timezone: timeZone,
      }),
    });

    if (!response.ok) {
      throw new Error('BodyGraph API request failed');
    }

    const data = await response.json();
    
    // Extract HD data
    const extract = {
      type: data.Properties?.Type?.option || 'Unknown',
      authority: data.Properties?.InnerAuthority?.option || 'Unknown',
      profile: data.Properties?.Profile?.option || 'Unknown',
      gates: data.Properties?.Gates?.list?.map((g: any) => g.option) || [],
      centers: [], // Derive from gates
      channels: [], // Derive from gates
    };

    // Cache result
    cache.set(cacheKey, extract);

    res.json(extract);
  } catch (error) {
    console.error('HD API Error:', error);
    res.status(500).json({ error: 'Failed to compute HD data' });
  }
});

export default router;
```

## Caching Strategy

### Two-Tier Caching

1. **Server-Side Cache (Node.js)**: 30-day in-memory cache
2. **Client-Side Cache (localStorage)**: Optional for offline support

```typescript
// Client-side caching example
const CACHE_KEY_PREFIX = 'hd_cache_';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

function getCacheKey(data: BirthData): string {
  return `${CACHE_KEY_PREFIX}${data.dateISO}_${data.time}_${data.timeZone}`;
}

export async function computeHDExtractWithCache(data: BirthData): Promise<HDExtract> {
  const cacheKey = getCacheKey(data);
  
  // Check localStorage
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data: cachedData, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return cachedData;
    }
  }

  // Fetch from server
  const result = await computeHDExtract(data);

  // Store in localStorage
  localStorage.setItem(cacheKey, JSON.stringify({
    data: result,
    timestamp: Date.now(),
  }));

  return result;
}
```

## Error Handling

```typescript
export class HDAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HDAPIError';
  }
}

export async function computeHDExtract(data: BirthData): Promise<HDExtract> {
  try {
    const response = await fetch('/api/hd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new HDAPIError(
        error.message || 'Failed to compute HD data',
        error.code || 'UNKNOWN_ERROR',
        error.details
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof HDAPIError) {
      throw error;
    }
    throw new HDAPIError(
      'Network error. Please check your connection.',
      'NETWORK_ERROR'
    );
  }
}
```

## Rate Limiting

The BodyGraph API has rate limits. Implement server-side rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const hdRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

router.post('/api/hd', hdRateLimiter, async (req, res) => {
  // ... handler code
});
```

## Testing

```typescript
// Mock for testing
export const mockHDExtract: HDExtract = {
  type: 'Manifesting Generator',
  authority: 'Sacral',
  profile: '1/3',
  centers: ['Sacral', 'Throat'],
  channels: [34, 20],
  gates: [1, 2, 13, 23, 43],
};

// Use in tests
jest.mock('@/api/bodygraph-client', () => ({
  computeHDExtract: jest.fn().mockResolvedValue(mockHDExtract),
}));
```

## Resources

- **BodyGraph API Docs**: https://bodygraph.com/help/human-design-api/
- **API Endpoint**: https://api.bodygraphchart.com/v221006/hd-data
- **IANA Timezones**: https://www.iana.org/time-zones

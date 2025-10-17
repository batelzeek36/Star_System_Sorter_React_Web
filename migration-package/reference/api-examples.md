# API Examples & Usage

## BodyGraph API Request

### Request Format

```http
POST https://api.bodygraphchart.com/v221006/hd-data
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "date": "1992-10-03 00:03",
  "timezone": "America/New_York"
}
```

### Response Format (Simplified)

```json
{
  "Properties": {
    "Type": {
      "option": "Manifesting Generator"
    },
    "InnerAuthority": {
      "option": "Sacral Authority"
    },
    "Profile": {
      "option": "1/3"
    },
    "Gates": {
      "list": [
        { "option": 1 },
        { "option": 2 },
        { "option": 13 },
        { "option": 23 },
        { "option": 43 }
      ]
    }
  }
}
```

## Your API Endpoints

### POST /api/hd

Compute Human Design data from birth information.

**Request:**

```json
{
  "dateISO": "1992-10-03",
  "time": "00:03",
  "timeZone": "America/New_York",
  "lat": 40.7128,
  "lon": -74.0060
}
```

**Response:**

```json
{
  "type": "Manifesting Generator",
  "authority": "Sacral",
  "profile": "1/3",
  "centers": ["Sacral", "Throat", "Spleen"],
  "channels": [34, 20],
  "gates": [1, 2, 13, 23, 43]
}
```

**Error Response:**

```json
{
  "error": "Invalid birth data",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "date",
    "message": "Date must be in YYYY-MM-DD format"
  }
}
```

## Client Usage Examples

### Basic Usage

```typescript
import { computeHDExtract } from '@api/bodygraph-client';

async function getHDData() {
  try {
    const result = await computeHDExtract({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });
    
    console.log('Type:', result.type);
    console.log('Authority:', result.authority);
    console.log('Profile:', result.profile);
    console.log('Gates:', result.gates);
  } catch (error) {
    console.error('Failed to compute HD data:', error);
  }
}
```

### With React Hook

```typescript
import { useState } from 'react';
import { computeHDExtract } from '@api/bodygraph-client';
import type { HDExtract } from '@lib/schemas';

export function useHDData() {
  const [data, setData] = useState<HDExtract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHDData = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await computeHDExtract(birthData);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchHDData };
}
```

### With Caching

```typescript
const CACHE_KEY_PREFIX = 'hd_cache_';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

function getCacheKey(data: BirthData): string {
  return `${CACHE_KEY_PREFIX}${data.dateISO}_${data.time}_${data.timeZone}`;
}

export async function computeHDExtractWithCache(
  data: BirthData
): Promise<HDExtract> {
  const cacheKey = getCacheKey(data);
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data: cachedData, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return cachedData;
    }
  }

  // Fetch from API
  const result = await computeHDExtract(data);

  // Store in cache
  localStorage.setItem(cacheKey, JSON.stringify({
    data: result,
    timestamp: Date.now(),
  }));

  return result;
}
```

## Scoring Examples

### Compute Scores

```typescript
import { computeScores, classify } from '@lib/scorer';
import { loadCanon } from '@lib/canon';

async function classifyUser(hdExtract: HDExtract) {
  // Load canon (star system definitions)
  const canon = await loadCanon();
  
  // Compute scores for all systems
  const scores = computeScores(hdExtract, canon);
  
  // Classify into primary/hybrid/unresolved
  const result = classify(scores, canon);
  
  console.log('Classification:', result.classification);
  console.log('Primary:', result.primary);
  console.log('Hybrid:', result.hybrid);
  console.log('Percentages:', result.percentages);
  
  return result;
}
```

### Display Results

```typescript
function ResultDisplay({ result }: { result: ClassificationResult }) {
  if (result.classification === 'primary') {
    return (
      <div>
        <h2>Your Star System: {result.primary}</h2>
        <p>Percentage: {result.percentages[result.primary!]}%</p>
      </div>
    );
  }
  
  if (result.classification === 'hybrid') {
    const [first, second] = result.hybrid!;
    return (
      <div>
        <h2>Hybrid Classification</h2>
        <p>{first}: {result.percentages[first]}%</p>
        <p>{second}: {result.percentages[second]}%</p>
      </div>
    );
  }
  
  return <div>Classification unresolved</div>;
}
```

## Form Validation Examples

### With React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BirthDataFormSchema } from '@lib/schemas';

function BirthDataForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BirthDataFormSchema),
  });

  const onSubmit = async (data: BirthDataForm) => {
    // Convert to API format
    const apiData = {
      dateISO: convertToISO(data.date),
      time: convertTo24Hour(data.time),
      timeZone: data.timeZone,
    };
    
    // Fetch HD data
    const hdData = await computeHDExtract(apiData);
    
    // Classify
    const result = await classifyUser(hdData);
    
    // Navigate to results
    navigate('/result', { state: result });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Date (MM/DD/YYYY)</label>
        <input {...register('date')} placeholder="10/03/1992" />
        {errors.date && <span>{errors.date.message}</span>}
      </div>
      
      <div>
        <label>Time</label>
        <input {...register('time')} placeholder="12:03 AM" />
        {errors.time && <span>{errors.time.message}</span>}
      </div>
      
      <div>
        <label>Location</label>
        <input {...register('location')} placeholder="New York, NY" />
        {errors.location && <span>{errors.location.message}</span>}
      </div>
      
      <div>
        <label>Time Zone</label>
        <select {...register('timeZone')}>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </select>
        {errors.timeZone && <span>{errors.timeZone.message}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Error Handling Examples

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

export async function computeHDExtract(
  data: BirthData
): Promise<HDExtract> {
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
    
    if (error instanceof TypeError) {
      throw new HDAPIError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR'
      );
    }
    
    throw new HDAPIError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
}
```

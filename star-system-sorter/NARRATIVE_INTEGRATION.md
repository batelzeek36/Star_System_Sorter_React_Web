# GPT-4o Narrative Integration

## Overview

Star System Sorter now includes AI-generated personalized narratives using GPT-4o. After users receive their star system classification, they get a custom summary that interprets their specific blend of star system archetypes and Human Design attributes.

## Features

- **Personalized Summaries**: GPT-4o generates unique narratives based on:
  - Star system classification (primary/hybrid)
  - Percentage distribution across all systems
  - Human Design type, authority, profile
  - Defined centers and active gates

- **Smart Caching**: Narratives are cached for 7 days to reduce API costs and improve performance

- **Graceful Fallback**: If OpenAI API is unavailable or not configured, uses template-based narratives

- **Academic Tone**: Prompts ensure narratives maintain the project's academic rigor and avoid pseudoscience claims

## Architecture

### Server-Side (Express)

**New Files:**
- `server/src/services/narrative.ts` - OpenAI integration and prompt engineering
- `server/src/routes/narrative.ts` - POST /api/narrative endpoint with caching

**Key Features:**
- System prompt emphasizes academic framing and behavioral psychology
- User prompt includes full classification context
- 7-day cache (vs 30-day for HD data)
- Fallback to template narratives if API fails

### Client-Side (React)

**New Files:**
- `star-system-sorter/src/hooks/useNarrative.ts` - Hook for fetching narratives
- `star-system-sorter/src/components/NarrativeSummary.tsx` - Display component

**Integration:**
- Added to `ResultScreen.tsx` between crest/percentage and ally systems
- Shows loading state while generating
- Displays error gracefully if generation fails

## Setup

### 1. Install Dependencies

```bash
cd server
npm install openai
```

### 2. Configure OpenAI API Key

Add to `server/.env`:

```bash
OPENAI_API_KEY=sk-proj-...your-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Start Server

```bash
cd server
npm run dev
```

The narrative endpoint will be available at `http://localhost:3000/api/narrative`

## API Reference

### POST /api/narrative

**Request Body:**
```typescript
{
  classification: 'primary' | 'hybrid' | 'unresolved',
  primary?: string,
  hybrid?: [string, string],
  percentages: Record<string, number>,
  hdData: {
    type: string,
    authority: string,
    profile: string,
    centers: string[],
    gates: number[]
  }
}
```

**Response:**
```typescript
{
  summary: string,
  cached: boolean
}
```

**Error Responses:**
- `400` - Invalid request data
- `500` - Failed to generate narrative

## Prompt Engineering

### System Prompt

The system prompt establishes:
- Role as narrative generator for academic research project
- All 8 star system archetypes with behavioral descriptions
- Tone guidelines (cosmic but grounded, confident but not arrogant)
- Structure requirements (2-4 paragraphs, ~150-250 words)
- Academic framing (pattern recognition, not prediction)

### User Prompt

Includes:
- Classification type and percentages
- Top 3 systems for context
- Full HD profile (type, authority, profile, centers, gate count)
- Request for behavioral/psychological interpretation

## Cost Considerations

**Per Request:**
- Model: GPT-4o
- Input tokens: ~800-1000 (system + user prompt)
- Output tokens: ~300-500 (narrative)
- Cost: ~$0.01-0.02 per generation

**With Caching:**
- 7-day TTL means most users see cached results
- Estimated cost: <$0.001 per user (assuming 95% cache hit rate)

**Monthly Estimate:**
- 1,000 unique users: ~$10-20/month
- 10,000 unique users: ~$100-200/month

## Fallback Behavior

If `OPENAI_API_KEY` is not configured or API fails:

1. Server logs warning
2. Generates template-based narrative using `generateFallbackNarrative()`
3. Returns structured summary based on classification type
4. User experience is seamless (no error shown)

**Fallback Quality:**
- Less personalized than GPT-4o
- Still includes classification details and HD attributes
- Maintains academic tone and structure

## Testing

### Manual Testing

1. Complete birth data form
2. View results screen
3. Narrative should appear below crest/percentage chart
4. Check browser console for cache status

### Test Different Classifications

- **Primary**: Single dominant system (>6% lead)
- **Hybrid**: Two systems within 6% of each other
- **Unresolved**: No clear winner

Each should generate appropriate narrative style.

### Test Caching

1. Generate narrative for a user
2. Refresh page or navigate away and back
3. Second load should be instant (cached)
4. Check response includes `"cached": true`

## Monitoring

### Server Logs

```bash
# Watch for narrative generation
cd server
npm run dev

# Look for:
# - "OPENAI_API_KEY not configured" (fallback mode)
# - "OpenAI API error" (API failure, using fallback)
# - Successful generations (no error logs)
```

### Cache Stats

Cache is in-memory (NodeCache), so stats reset on server restart.

To add cache monitoring, update `server/src/routes/narrative.ts`:

```typescript
// Add endpoint to check cache stats
router.get('/narrative/stats', (req, res) => {
  res.json({
    keys: narrativeCache.keys().length,
    stats: narrativeCache.getStats(),
  });
});
```

## Future Enhancements

### Phase 2 Improvements

1. **Personalization Depth**
   - Include specific gate.line interpretations
   - Reference research sources in narrative
   - Mention ally systems and their influence

2. **Narrative Variants**
   - Short version (1 paragraph) for mobile
   - Long version (4-5 paragraphs) for desktop
   - Technical version (includes HD jargon)
   - Beginner version (explains concepts)

3. **User Feedback**
   - "Was this helpful?" rating
   - Save favorite narratives
   - Request regeneration with different tone

4. **Advanced Caching**
   - Redis for distributed caching
   - Cache warming for common profiles
   - Analytics on cache hit rates

5. **Cost Optimization**
   - Use GPT-4o-mini for initial draft
   - Use GPT-4o for refinement only
   - Batch similar requests

## Troubleshooting

### Narrative Not Appearing

1. Check server is running: `http://localhost:3000/health`
2. Check browser console for errors
3. Verify `/api/narrative` endpoint is accessible
4. Check server logs for errors

### "Failed to generate narrative" Error

1. Check `OPENAI_API_KEY` is set in `server/.env`
2. Verify API key is valid (test at platform.openai.com)
3. Check OpenAI API status (status.openai.com)
4. Review server logs for specific error

### Fallback Narratives Always Used

1. Verify `OPENAI_API_KEY` is set (not commented out)
2. Check for typos in environment variable name
3. Restart server after adding key
4. Check server logs for "OPENAI_API_KEY not configured"

### Narratives Not Cached

1. Cache is in-memory, resets on server restart
2. Check cache key generation (should be deterministic)
3. Verify TTL is set correctly (7 days = 604800 seconds)
4. Test with same user data twice

## Security Considerations

- **API Key Protection**: `OPENAI_API_KEY` is server-side only (no `VITE_` prefix)
- **Rate Limiting**: Existing rate limiter (100 req/15min) applies to narrative endpoint
- **Input Validation**: Zod schema validates all request data
- **No PII in Prompts**: Only classification results and HD attributes sent to OpenAI
- **Cache Keys**: Hashed to prevent exposure of user data

## Compliance

- **Privacy**: No birth data or PII sent to OpenAI
- **Terms**: Ensure OpenAI API usage complies with their terms of service
- **Disclosure**: UI shows "Generated using GPT-4o" for transparency
- **Legal**: Maintains existing disclaimer ("For insight & entertainment")

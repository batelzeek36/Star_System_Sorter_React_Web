# GPT-4o Classification Migration

## Overview

The Star System Sorter now uses **GPT-4o for real-time classification** instead of the deterministic scoring algorithm. This change allows the AI to leverage all the gate.line data and star system lore that has been built into its knowledge base.

## What Changed

### 1. New GPT Classification Service (Server)

**File**: `server/src/services/gpt-classification.ts`

- Uses GPT-4o to analyze HD data and classify into star systems
- Includes comprehensive system prompt with all 8 star system archetypes
- Returns classification, percentages, explanation, and technical reasoning
- Temperature set to 0.3 for consistent classifications

**File**: `server/src/routes/classify.ts`

- New endpoint: `POST /api/classify`
- Validates HD data and calls GPT classification service
- Returns classification result with percentages and explanations

### 2. Frontend Integration

**File**: `star-system-sorter/src/hooks/useGPTClassification.ts`

- New hook for calling the GPT classification endpoint
- Handles loading states and errors
- Returns classification result

**File**: `star-system-sorter/src/hooks/useHDData.ts`

- Updated to call GPT classification after fetching HD data
- Converts GPT response to ClassificationResult format
- Stores both HD data and classification in Zustand store

### 3. Schema Updates

**File**: `star-system-sorter/src/lib/schemas.ts`

- Added `gpt_explanation` and `gpt_reasoning` to ClassificationResult meta
- These fields store the AI-generated explanation and technical reasoning

### 4. UI Updates

**File**: `star-system-sorter/src/components/NarrativeSummary.tsx`

- Now displays GPT explanation if available in classification meta
- Falls back to narrative generation service if no GPT explanation
- Shows "AI-powered classification" badge when using GPT

### 5. Deterministic Scorer (Disabled)

**File**: `star-system-sorter/src/lib/scorer.ts`

- Marked as deprecated with clear documentation
- Added feature flag: `VITE_USE_DETERMINISTIC_SCORING`
- Can be re-enabled if needed by setting env var to `true`
- All code preserved for reference

## How It Works

### Flow

1. User enters birth data in InputScreen
2. `useHDData` hook fetches HD data from BodyGraph API
3. `useHDData` automatically calls GPT classification with HD data
4. GPT-4o analyzes:
   - Gate.line placements (personality & design)
   - Type, authority, profile
   - Defined centers
   - Active gates and channels
5. GPT returns:
   - Classification (primary/hybrid/unresolved)
   - Percentages for all 8 systems (sum to 100%)
   - User-facing explanation
   - Technical reasoning
6. Result stored in Zustand and displayed in ResultScreen
7. NarrativeSummary shows GPT explanation

### GPT System Prompt

The system prompt includes:

- All 8 star system archetypes with behavioral descriptions
- Classification rules (primary, hybrid, unresolved)
- Gate.line interpretation guidelines
- Human Design attribute meanings
- Output format requirements
- Emphasis on behavioral patterns over lore

### Example Classification

```json
{
  "classification": "primary",
  "primary": "Pleiades",
  "percentages": {
    "Pleiades": 42.5,
    "Sirius": 18.3,
    "Lyra": 12.1,
    "Andromeda": 9.8,
    "Orion Light": 7.2,
    "Orion Dark": 4.6,
    "Arcturus": 3.1,
    "Draco": 2.4
  },
  "explanation": "You are primarily aligned with the Pleiades star system...",
  "reasoning": "Sun in 27.3 (Pleiades core: nurturing/caretaking)..."
}
```

## Benefits

### 1. Leverages Full Research

GPT-4o has access to all the gate.line mappings and star system lore that was painstakingly researched. It can make nuanced interpretations that would be difficult to encode in deterministic rules.

### 2. Natural Language Explanations

GPT provides human-readable explanations of why someone got their classification, making the results more meaningful and actionable.

### 3. Adaptive Intelligence

GPT can handle edge cases and ambiguous patterns more gracefully than rigid scoring rules.

### 4. Easier to Maintain

Instead of maintaining complex scoring algorithms and weight calibrations, we can refine the system prompt and let GPT handle the interpretation.

## Re-enabling Deterministic Scoring

If you need to switch back to deterministic scoring:

1. Set environment variable:
   ```bash
   VITE_USE_DETERMINISTIC_SCORING=true
   ```

2. Update `useHDData.ts` to check the feature flag:
   ```typescript
   import { USE_DETERMINISTIC_SCORING } from '../lib/scorer';
   
   if (USE_DETERMINISTIC_SCORING) {
     // Use old classification logic
   } else {
     // Use GPT classification
   }
   ```

3. All deterministic scoring code is preserved in:
   - `star-system-sorter/src/lib/scorer.ts`
   - `star-system-sorter/src/lib/scorer-config.ts`
   - `star-system-sorter/src/lib/gateline-map.ts`
   - `star-system-sorter/src/hooks/useGateLineScoring.ts`

## API Requirements

### Environment Variables

**Server** (`server/.env`):
```bash
OPENAI_API_KEY=sk-...
```

### Rate Limiting

The existing rate limiter (100 req/15min) applies to the classify endpoint.

### Caching

Currently no caching on classification endpoint. Could add Redis caching similar to narrative endpoint if needed.

## Testing

### Manual Testing

1. Start server: `cd server && npm run dev`
2. Start client: `cd star-system-sorter && npm run dev`
3. Enter birth data
4. Verify classification appears with GPT explanation
5. Check console for any errors

### API Testing

```bash
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Generator",
    "authority": "Sacral",
    "profile": "3/5",
    "centers": ["Sacral", "Throat"],
    "channels": [34, 20],
    "gates": [34, 20, 10, 57],
    "placements": [
      {"planet": "Sun", "gate": 34, "line": 3, "type": "personality"},
      {"planet": "Earth", "gate": 20, "line": 3, "type": "personality"}
    ]
  }'
```

## Future Enhancements

### 1. Caching

Add Redis caching for classifications to reduce API costs:
- Cache key: hash of HD data
- TTL: 30 days (same as HD data cache)
- Invalidation: manual or on prompt changes

### 2. Prompt Versioning

Track prompt versions in classification meta:
```typescript
meta: {
  canonVersion: 'gpt-4o',
  promptVersion: 'v1.0',
  promptHash: 'abc123...'
}
```

### 3. A/B Testing

Compare GPT classifications with deterministic scoring:
- Run both in parallel
- Log differences
- Analyze which users prefer

### 4. Fine-tuning

If we collect enough validated classifications, we could fine-tune GPT-4o specifically for star system classification.

## Troubleshooting

### "No response from GPT-4o"

- Check `OPENAI_API_KEY` is set in `server/.env`
- Verify API key is valid
- Check OpenAI API status

### "Classification failed"

- Check server logs for detailed error
- Verify HD data format is correct
- Ensure all required fields are present

### Percentages don't sum to 100

- GPT is instructed to ensure percentages sum to 100
- If this happens, it's a GPT error - regenerate or add validation

### Missing explanation

- Check `classification.meta.gpt_explanation` exists
- Verify GPT response includes explanation field
- Check for JSON parsing errors in server logs

## Migration Checklist

- [x] Create GPT classification service
- [x] Add classify endpoint to server
- [x] Create useGPTClassification hook
- [x] Update useHDData to call GPT classification
- [x] Update schemas to include GPT fields
- [x] Update NarrativeSummary to show GPT explanation
- [x] Add feature flag to scorer
- [x] Document changes
- [ ] Test with real birth data
- [ ] Monitor API costs
- [ ] Add caching if needed
- [ ] Collect user feedback

## Cost Considerations

### GPT-4o Pricing (as of Nov 2024)

- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

### Estimated Cost Per Classification

- System prompt: ~800 tokens
- User prompt: ~200 tokens
- Response: ~300 tokens
- **Total**: ~1,300 tokens = ~$0.004 per classification

### Monthly Estimates

- 1,000 users: ~$4
- 10,000 users: ~$40
- 100,000 users: ~$400

**Recommendation**: Add Redis caching to reduce costs by ~95% (same as narrative caching).

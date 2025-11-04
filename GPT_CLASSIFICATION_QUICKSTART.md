# GPT-4o Classification Quick Start

## Setup

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd star-system-sorter
npm install
```

### 2. Configure Environment

Create `server/.env`:

```bash
# Required for GPT classification
OPENAI_API_KEY=sk-proj-...

# Required for HD data
BODYGRAPH_API_KEY=your_bodygraph_key

# Optional
PORT=3000
NODE_ENV=development
```

### 3. Start Services

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd star-system-sorter
npm run dev
```

### 4. Test

1. Open http://localhost:5173
2. Click "Begin Sorting"
3. Enter birth data:
   - Date: 01/15/1990
   - Time: 02:30 PM
   - Location: New York, NY
   - Timezone: America/New_York
4. Click "Compute Chart"
5. Wait for classification (5-10 seconds)
6. View results with GPT explanation

## How It Works

### User Flow

```
User enters birth data
    ↓
Fetch HD data from BodyGraph API (cached 30 days)
    ↓
Send HD data to GPT-4o for classification
    ↓
GPT analyzes gate.lines, type, authority, profile
    ↓
Returns classification + percentages + explanation
    ↓
Display results with AI-generated narrative
```

### API Endpoints

**POST /api/hd** - Fetch Human Design data
- Input: Birth date, time, location, timezone
- Output: HD extract (type, authority, profile, gates, placements)
- Cached: 30 days

**POST /api/classify** - Classify with GPT-4o
- Input: HD extract
- Output: Classification result with percentages and explanation
- Not cached (yet)

**POST /api/narrative** - Generate narrative (optional)
- Input: Classification + HD data
- Output: Personalized narrative
- Cached: 30 days with Redis

## GPT Classification Details

### What GPT Receives

```json
{
  "type": "Generator",
  "authority": "Sacral",
  "profile": "3/5",
  "centers": ["Sacral", "Throat", "G"],
  "channels": [34, 20],
  "gates": [34, 20, 10, 57],
  "placements": [
    {"planet": "Sun", "gate": 34, "line": 3, "type": "personality"},
    {"planet": "Earth", "gate": 20, "line": 3, "type": "personality"},
    {"planet": "Moon", "gate": 10, "line": 5, "type": "personality"},
    ...
  ]
}
```

### What GPT Returns

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
  "explanation": "You are primarily aligned with the Pleiades star system (42.5%). This signature reflects a core pattern of nervous system caretaking and emotional safety. Your Generator type with Sacral authority amplifies this nurturing energy, giving you a reliable gut response for when to engage in caretaking activities. The 3/5 profile adds a layer of experiential learning and practical problem-solving to your Pleiadian nature...",
  "reasoning": "Sun in 34.3 shows Sacral power with emotional awareness (Pleiades secondary). Earth in 20.3 indicates present-moment awareness and voice activation (Lyra core). Moon in 10.5 suggests self-love and authentic behavior (Pleiades core). The combination of defined Sacral and Throat creates a consistent pattern of responsive nurturing communication..."
}
```

### Star Systems GPT Knows

1. **Pleiades** - Nervous system caretaking, emotional safety, nurturing
2. **Sirius** - Initiation through ordeal, transformation via crisis
3. **Lyra** - Creative expression, artistic innovation, beauty
4. **Andromeda** - Liberation work, confronting exploitation, sovereignty
5. **Orion Light** - Mystery schools, wisdom keeping, sacred geometry
6. **Orion Dark** - Control, hierarchy, shadow work, power dynamics
7. **Arcturus** - Frequency repair, trauma cleanup, energetic healing
8. **Draco** - Predator scanning, resource control, survival dominance

## Troubleshooting

### "Failed to classify"

**Check server logs:**
```bash
cd server
npm run dev
# Look for errors in console
```

**Common issues:**
- Missing `OPENAI_API_KEY` in `server/.env`
- Invalid API key
- OpenAI API rate limit
- Network issues

### "No response from GPT-4o"

**Verify API key:**
```bash
curl http://localhost:3000/debug/env
# Should show: hasOpenAIKey: true
```

**Test OpenAI directly:**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"test"}]}'
```

### Percentages don't sum to 100

This shouldn't happen - GPT is instructed to ensure percentages sum to 100. If it does:

1. Check server logs for GPT response
2. Verify JSON parsing is correct
3. Report as bug (GPT error)

### Classification seems wrong

GPT classifications are subjective. To debug:

1. Check `classification.meta.gpt_reasoning` for technical details
2. Compare with deterministic scorer (if enabled)
3. Review gate.line placements manually
4. Consider if user's chart is genuinely ambiguous

## Switching Back to Deterministic Scoring

If you need the old algorithm:

1. Set environment variable:
   ```bash
   # In star-system-sorter/.env
   VITE_USE_DETERMINISTIC_SCORING=true
   ```

2. Update `useHDData.ts`:
   ```typescript
   import { USE_DETERMINISTIC_SCORING } from '../lib/scorer';
   import { useGateLineScoring } from './useGateLineScoring';
   
   const { classifyWithGateLines } = useGateLineScoring();
   
   if (USE_DETERMINISTIC_SCORING) {
     const classification = classifyWithGateLines(data);
     setClassification(classification);
   } else {
     // Use GPT classification (current)
   }
   ```

3. Restart client

## Cost Monitoring

### Check Usage

OpenAI Dashboard: https://platform.openai.com/usage

### Estimated Costs

- ~$0.004 per classification
- 1,000 users/month = ~$4
- 10,000 users/month = ~$40

### Reduce Costs

Add Redis caching (similar to narrative caching):

```typescript
// In server/src/routes/classify.ts
import { getCached, setCached } from '../lib/redis-cache.js';

const cacheKey = generateCacheKey(hdData);
const cached = await getCached(cacheKey);
if (cached) return res.json(cached);

const result = await classifyWithGPT(hdData);
await setCached(cacheKey, result, 30 * 24 * 60 * 60); // 30 days
```

## Next Steps

1. **Test with real users** - Collect feedback on classification accuracy
2. **Add caching** - Reduce API costs by 95%
3. **Monitor costs** - Track OpenAI usage
4. **Refine prompt** - Improve classification quality based on feedback
5. **A/B test** - Compare GPT vs deterministic scoring
6. **Fine-tune** - Train custom model if we get enough data

## Support

- Check `GPT_CLASSIFICATION_MIGRATION.md` for detailed architecture
- Review server logs for errors
- Test API endpoints with curl
- Verify environment variables are set

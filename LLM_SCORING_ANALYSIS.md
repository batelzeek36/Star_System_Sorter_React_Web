# LLM-Based Star System Scoring Analysis

## Executive Summary

**Question:** Can we use an LLM to look at BodyGraph API data and score people to star systems based on keyword matching?

**Answer:** Yes, but with significant caveats. The BodyGraph API returns structural data (gates, lines, planets) but NOT the semantic meanings. We would need to provide extensive context to make LLM scoring work.

## What the BodyGraph API Returns

### Sample Response (Birth: Jan 15, 1990, 2:30 PM EST)

```json
{
  "type": "Generator",
  "authority": "Sacral",
  "profile": "5 / 2",
  "centers": ["Splenic", "Sacral", "Root", "G"],
  "channels": [10, 5, 3],
  "gates": [1, 3, 4, 5, 7, 10, 13, 15, 26, 38, 39, 47, 48, 49, 50, 53, 54, 57, 58, 60, 61, 62],
  "placements": [
    { "planet": "Sun", "gate": 61, "line": 5, "type": "personality" },
    { "planet": "Earth", "gate": 62, "line": 5, "type": "personality" },
    // ... 24 more placements (13 personality + 13 design)
  ]
}
```

### What's Included ✅

- **Type:** Generator, Manifestor, Projector, Reflector, Manifesting Generator
- **Authority:** Sacral, Emotional, Splenic, Ego, Self-Projected, Mental, Lunar
- **Profile:** 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3
- **Defined Centers:** Which of the 9 centers are "defined" (consistent energy)
- **Channels:** Which channels (connections between centers) are active
- **Gates:** Which of the 64 gates are activated
- **Placements:** Planet + Gate + Line combinations (26 total: 13 personality + 13 design)

### What's Missing ❌

- **Gate Meanings:** What each gate represents (e.g., Gate 61 = "Inner Truth")
- **Line Meanings:** What each line within a gate means (e.g., 61.5 = "Influence")
- **Planet Significance:** What each planet represents in HD context
- **Type/Authority Descriptions:** What it means to be a "Sacral Generator"
- **Center Themes:** What each defined center contributes to the person's energy

## What We Have in Our Data

### Gate Descriptions (s3-data/gates/*.json)

Example: Gate 61 (Inner Truth)

```json
{
  "id": "gate.61",
  "center": "Head",
  "circuit": "Individual / Knowing (Inspiration)",
  "themes": [
    "pressure to know the unknowable",
    "inner truth / mystery / 'my-story'",
    "acoustic inspiration (needs silence)"
  ],
  "lines": [
    {
      "id": "61.5",
      "classical": {
        "hd_title": "Influence",
        "hd_quote": "The enlightened father-figure whose recognized wisdom..."
      },
      "interpretation": {
        "keywords": ["projected authority", "collective teacher", "inspired leadership"],
        "behavioral_axis": "Others project 'you know' → potential to shape timelines."
      }
    }
  ]
}
```

### Star System Mappings (GPT-5/star-maps/*.json)

Pre-computed weights for each gate.line → star system:

```json
{
  "61.5": [
    {
      "star_system": "Sirius",
      "weight": 0.85,
      "role": "primary",
      "polarity": "core",
      "behavioral_match": "Wisdom transmission, teaching authority, collective influence",
      "keywords": ["wisdom keepers", "teachers", "enlightenment"]
    }
  ]
}
```

### Star System Baselines (lore-research/research-outputs/star-systems/v4.2/*.json)

Comprehensive characteristics with academic sources:

```json
{
  "star_system": "Sirius",
  "characteristics": [
    {
      "trait": "Wisdom keepers and teachers of advanced knowledge",
      "keywords": ["wisdom", "teaching", "sacred knowledge", "enlightenment"],
      "sources": [
        {
          "title": "The Sirius Mystery",
          "author": "Robert Temple",
          "year": 1976,
          "quote": "The Dogon describe Sirius as the source of all knowledge..."
        }
      ]
    }
  ]
}
```

## LLM Scoring Approaches

### Approach 1: Lightweight Keyword Matching (Feasible)

**What you'd send to the LLM:**

```
You are analyzing a Human Design chart to determine star system alignment.

CHART DATA:
- Type: Generator (consistent energy, responds to life)
- Authority: Sacral (gut-based decision making)
- Profile: 5/2 (projected leader / hermit)
- Key Placements:
  * Personality Sun in Gate 61, Line 5 (Inner Truth - Influence)
    → "Projected authority, collective teacher, inspired leadership"
  * Design Sun in Gate 50, Line 2 (Values - Determination)
    → "Stands for principles, guardian of tradition"

STAR SYSTEM KEYWORDS:
- Pleiades: nurturing, community, healing, emotional intelligence
- Sirius: wisdom keepers, teachers, enlightenment, sacred knowledge
- Lyra: artists, musicians, beauty, creative expression
- Andromeda: freedom fighters, rebels, independence
- Orion Light: mystery schools, sacred texts, esoteric knowledge
- Orion Dark: control, hierarchy, shadow work
- Arcturus: healers, energy workers, frequency, ascension
- Draco: ancient wisdom, primal power, transformation

TASK: Score this person's alignment to each star system (0-100).
```

**Pros:**
- Simple, fast, cheap
- Can run on any LLM (GPT-4, Claude, local models)
- Good for quick prototyping

**Cons:**
- Loses nuance of our research (862-1,656 hours of work)
- No access to I Ching cross-references
- Can't leverage our pre-computed weights
- Results may vary between LLM runs (non-deterministic)

### Approach 2: Full Context Scoring (Expensive but Accurate)

**What you'd send to the LLM:**

```
[Full gate descriptions for all 22 activated gates]
[Full line descriptions for all 26 placements]
[Complete star system baselines with sources]
[Type/Authority/Profile descriptions]
[Planet significance in HD]

TASK: Analyze this chart against all 8 star systems and provide:
1. Detailed reasoning for each alignment
2. Confidence scores (0-100) for each system
3. Primary vs secondary classifications
4. Supporting evidence from the chart
```

**Pros:**
- Most accurate LLM-based approach
- Can provide detailed reasoning
- Leverages our full research dataset

**Cons:**
- Very expensive (100K+ tokens per request)
- Slow (30-60 seconds per chart)
- Still non-deterministic
- Requires careful prompt engineering

### Approach 3: Hybrid (Current System + LLM Enhancement)

**Keep our current scorer.ts but add LLM for:**
- Narrative generation (already doing this)
- Explaining why someone got their classification
- Generating personalized insights
- Answering user questions about their chart

**Pros:**
- Deterministic scoring (same input = same output)
- Fast and cheap (pre-computed weights)
- LLM adds value where it's best (language generation)
- Maintains academic rigor of our research

**Cons:**
- Requires maintaining both systems
- More complex architecture

## Recommendation

### For MVP: Stick with Current Approach ✅

**Why:**
1. **Deterministic:** Same birth data always produces same classification
2. **Fast:** No API calls to LLM for scoring (only for narratives)
3. **Academically Rigorous:** Preserves 862-1,656 hours of research
4. **Cost-Effective:** Pre-computed weights = no per-request LLM costs
5. **Proven:** Our gate-line scoring system is already validated

### For Future Enhancement: LLM-Powered Features 🚀

**Good uses of LLM:**
- ✅ Narrative generation (already implemented)
- ✅ Personalized insights and explanations
- ✅ Answering user questions ("Why am I Sirius?")
- ✅ Generating compatibility reports
- ✅ Creating custom meditations/affirmations

**Bad uses of LLM:**
- ❌ Primary classification scoring (loses determinism)
- ❌ Replacing our research-backed weights
- ❌ Gate/line interpretation (we have better data)

## Technical Implementation Notes

### If You Want to Try LLM Scoring Anyway

1. **Load gate descriptions:**
   ```typescript
   import gate61 from '@/data/gates/61.json';
   const line5 = gate61.lines.find(l => l.line_number === 5);
   ```

2. **Load star system baselines:**
   ```typescript
   import sirius from '@/data/star-systems/sirius-baseline-4.2.json';
   const keywords = sirius.characteristics.flatMap(c => c.keywords);
   ```

3. **Build prompt:**
   ```typescript
   const prompt = `
   Analyze this HD chart:
   ${JSON.stringify(hdData, null, 2)}
   
   Gate meanings:
   ${gateDescriptions}
   
   Star system keywords:
   ${starSystemKeywords}
   
   Score alignment (0-100) for each system.
   `;
   ```

4. **Call LLM:**
   ```typescript
   const response = await openai.chat.completions.create({
     model: "gpt-4",
     messages: [{ role: "user", content: prompt }],
     temperature: 0.3, // Lower = more consistent
   });
   ```

### Cost Estimate

- **Input tokens:** ~50K (full context)
- **Output tokens:** ~2K (scores + reasoning)
- **Cost per request:** ~$0.50-1.00 (GPT-4)
- **For 1,000 users:** $500-1,000

Compare to current system:
- **Pre-computed weights:** $0.00 per classification
- **Narrative generation:** ~$0.10 per user (optional)

## Conclusion

The BodyGraph API provides excellent structural data, but you'd need to add significant semantic context (gate meanings, line descriptions, star system characteristics) for LLM-based scoring to work.

**Our current approach is better because:**
1. It's deterministic and fast
2. It preserves our academic research
3. It's cost-effective at scale
4. We can still use LLMs for narrative enhancement

**If you want to experiment with LLM scoring:**
- Start with Approach 1 (lightweight keywords)
- Test on 10-20 sample charts
- Compare results to our current scorer
- Measure cost, speed, and accuracy
- Decide if the tradeoff is worth it

The data is there, the API works great, but I'd recommend keeping our research-backed scoring system and using LLMs for what they do best: generating personalized, human-readable insights.

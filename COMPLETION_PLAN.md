# Star System Sorter - Completion Plan

## Current State (Updated)

- **App Status**: 85% complete, deployed to production
- **Core Classification**: ✅ Working with 384 gate.line mappings via `computeScoresWithGateLines()`
- **Research Data**: ✅ `gateLine_star_map.json` (92KB) IS integrated into scorer
- **I Ching Data**: `gates.json` (190KB) exists but NOT used for insight generation
- **Multi-Chart Comparison**: ❌ Not built
- **Insight Generation**: ❌ OpenAI route exists, not wired to UI

## The Goal

> "Use birth data to calculate chart's relationship to star system lore, categorize to star systems, and make correlations between multiple people's charts to generate 'aha' moments for better decision-making."

## What's NOT Needed

- Custom-trained AI model
- Deep learning on esoteric data
- Years of ML engineering
- Dumping all lore into one context window (this is what broke Kiro)

## What IS Needed

Two main components (data integration is DONE):

### Component 1: Research Data Integration - ✅ COMPLETE

**Already working:**
- `gateLine_star_map.json` loaded via `loadGateLineMap()` in `gateline-map.ts`
- `computeScoresWithGateLines()` in `scorer.ts` uses all 384 mappings
- Each mapping has `star_system`, `weight`, `alignment_type`, and `why`

**What's NOT being used yet (for insight generation):**
- `lore-research/research-outputs/line-companion/gates.json` (190KB I Ching text)
- Full hexagram meanings and line-by-line interpretations
- This data should be fetched ON DEMAND for specific gates, not loaded all at once

**Effort**: 0 days (scoring done), 1-2 days to wire I Ching data for insights

---

### The Context Problem (Why Kiro Failed)

**What you tried:** Feed all lore (I Ching + HD + star systems) into one prompt
**Why it failed:** 190KB+ of data exceeds context limits, and most of it is irrelevant to the specific charts

**The Solution: Chunked Retrieval**

Instead of loading everything, fetch ONLY what's relevant to the charts being analyzed:

```typescript
// BAD: Load all 64 hexagrams + 384 lines
const allLore = await loadEntireLoreDatabase(); // 💀 Context explosion

// GOOD: Load only the gates present in both charts
async function getRelevantLore(chartA: HDExtract, chartB: HDExtract) {
  const relevantGates = new Set([
    ...chartA.gates.map(g => g.gate),
    ...chartB.gates.map(g => g.gate)
  ]);

  // Maybe 8-15 gates total instead of 64
  const loreChunks = await Promise.all(
    [...relevantGates].map(gate => fetchGateLore(gate))
  );

  return loreChunks; // Small, focused context
}
```

**Data retrieval strategy:**
1. Get both charts' gates (typically 10-26 gates each)
2. Find shared gates (the comparison sweet spot)
3. Fetch I Ching data for ONLY those gates
4. Fetch star system "why" from gateLine_star_map.json for those gate.lines
5. Compose focused prompt with ~5-10KB of relevant context instead of 190KB

**File to create:** `src/lib/lore-retriever.ts`

```typescript
interface RelevantLore {
  gate: number;
  line: number;
  hexagramName: string;
  hexagramMeaning: string;
  lineMeaning: string;
  starSystemMappings: Array<{
    system: string;
    weight: number;
    why: string;
  }>;
}

export async function getRelevantLoreForCharts(
  chartA: HDExtract,
  chartB: HDExtract
): Promise<{
  chartALore: RelevantLore[];
  chartBLore: RelevantLore[];
  sharedGatesLore: RelevantLore[];
}> {
  // Implementation fetches only what's needed
}
```

---

### Component 2: Chart Comparison Algorithm

**Status**: Not started

**Input**: Two (or more) HD chart extracts

**Output**: Structured comparison object

```typescript
interface ChartComparison {
  // Shared elements
  sharedGates: Array<{
    gate: number;
    lines: [number, number]; // User A line, User B line
    starSystemResonance: string[];
  }>;
  sharedChannels: Array<{
    channel: string;
    meaning: string;
  }>;
  sharedCenters: {
    bothDefined: string[];
    bothUndefined: string[];
  };

  // Complementary elements
  complementaryTypes: {
    typeA: string;
    typeB: string;
    dynamic: string; // e.g., "Generator + Projector = natural guidance dynamic"
  };

  // Tension points
  opposingGates: Array<{
    gateA: number;
    gateB: number;
    tensionType: string;
  }>;

  // Star system alignment
  systemOverlap: {
    sharedPrimary: boolean;
    sharedAllies: string[];
    divergentSystems: string[];
  };

  // Summary scores
  compatibility: {
    overall: number; // 0-100
    communication: number;
    energy: number;
    purpose: number;
  };
}
```

**Implementation location**: `src/lib/comparison.ts` (new file)

**Effort**: 2-3 days

---

### Component 3: Insight Generation via LLM

**Status**: Backend route exists (`/api/narrative`), not integrated

**Approach**: Structured prompting with lore context, NOT custom training

**Prompt Template Structure**:

```typescript
const insightPrompt = `
You are an expert in Human Design and star system lore. Given the following
chart comparison data, generate meaningful insights that help users understand
their dynamic.

## Chart A (${userA.name})
- Type: ${userA.type}
- Authority: ${userA.authority}
- Profile: ${userA.profile}
- Primary Star System: ${userA.primarySystem}
- Key Gates: ${userA.gates.join(', ')}

## Chart B (${userB.name})
- Type: ${userB.type}
- Authority: ${userB.authority}
- Profile: ${userB.profile}
- Primary Star System: ${userB.primarySystem}
- Key Gates: ${userB.gates.join(', ')}

## Comparison Data
${JSON.stringify(comparisonResult, null, 2)}

## Lore Context
${relevantLoreRules}

## Instructions
Generate 3-5 "aha moment" insights that:
1. Explain what shared elements mean for their connection
2. Highlight complementary strengths
3. Note potential friction points and how to navigate them
4. Connect their star system alignment to practical dynamics
5. Suggest decision-making considerations based on their combined chart

Keep insights specific and actionable, not generic. Reference their actual
gates, channels, and star systems by name.
`;
```

**Key insight types to generate**:
- "You both have Gate 19, which means..." (shared resonance)
- "Your Generator energy + their Projector guidance creates..." (type dynamics)
- "Both Andromedan-aligned, you share..." (star system connection)
- "Watch for tension around Gate X vs Gate Y..." (friction awareness)
- "When making decisions together, consider..." (practical advice)

**Implementation**:
1. Create prompt templates in `src/lib/prompts/` (new folder)
2. Wire comparison data → prompt → OpenAI route
3. Display insights in new `InsightsScreen.tsx` or enhance existing results

**Effort**: 2-3 days

---

## Implementation Sequence (Revised)

### ~~Week 1: Data Integration~~ ✅ ALREADY DONE

The `gateLine_star_map.json` is already integrated into the scorer. Skip to Week 2.

### Week 1 (Actual): Lore Retrieval + Comparison

| Day | Task |
|-----|------|
| 1 | Build `src/lib/lore-retriever.ts` - chunked I Ching data fetcher |
| 2 | Build `src/lib/comparison.ts` - chart comparison algorithm |
| 3 | Add UI for entering second chart (InputScreen variant or modal) |
| 4 | Test comparison with real chart pairs, verify shared gates detected |

### Week 2: Insight Generation + Polish

| Day | Task |
|-----|------|
| 1 | Create prompt templates in `src/lib/prompts/` |
| 2 | Wire: comparison data + relevant lore → OpenAI route → response |
| 3 | Build `InsightsScreen.tsx` to display generated insights |
| 4 | Polish UI, add loading states, error handling |
| 5 | Test end-to-end with various chart combinations |

### Total: ~8-10 days instead of 2 weeks (data work already done)

---

## Files to Create/Modify

### New Files
- `src/lib/lore-retriever.ts` - chunked lore fetcher (avoids context explosion)
- `src/lib/comparison.ts` - chart comparison algorithm
- `src/lib/prompts/insight-templates.ts` - LLM prompt templates
- `src/screens/ComparisonScreen.tsx` - multi-chart input UI
- `src/screens/InsightsScreen.tsx` - display generated insights

### Modified Files
- `src/App.tsx` - add routes for new screens
- `server/src/routes/narrative.ts` - enhance for comparison context + lore injection

### Already Done (No Changes Needed)
- ~~`src/lib/scorer.ts`~~ - already uses gate.line granularity ✅
- ~~`src/lib/gateline-map.ts`~~ - already loads 384 mappings ✅
- ~~`data/gateLine_star_map.json`~~ - already exists with full data ✅

---

## Success Criteria

1. **Data Integration**: Classification uses all 384 gate.line mappings
2. **Comparison**: Can compare 2+ charts and get structured output
3. **Insights**: LLM generates specific, non-generic insights referencing actual chart data
4. **UX**: User can enter multiple charts and see meaningful relationship insights

---

## Why This Works Without Custom AI

| Traditional Approach | Our Approach |
|---------------------|--------------|
| Train model on esoteric data | Encode knowledge as structured rules |
| Need thousands of examples | Need your 384 mappings (already done) |
| Model learns patterns | Algorithm applies patterns |
| Black box insights | Explainable: "because you both have Gate 19" |
| Expensive, slow | Fast, cheap, deterministic |

The "AI" part (GPT/Claude) handles natural language synthesis - turning structured comparison data into readable insights. It doesn't need to "understand" star systems; it just needs to articulate the patterns your rules already define.

---

## Questions to Resolve

1. **Multi-chart storage**: Save charts to user profile? Allow anonymous comparisons?
2. **Insight caching**: Cache generated insights or regenerate each time?
3. **Comparison types**: Romantic, business, family, friendship - different prompts?
4. **Depth levels**: Quick insight vs deep dive analysis?

---

## Testing Strategy

See **[TESTING_PLAN.md](./TESTING_PLAN.md)** for full testing strategy including:
- Unit tests for deterministic functions
- Schema validation for LLM outputs
- Golden set testing with known chart pairs
- E2E tests with Playwright

---

## Task List for Auto-Claude

### TASK 1: Lore Retriever
**File**: `src/lib/lore-retriever.ts`
**Dependencies**: None
**Tests**: `src/lib/lore-retriever.test.ts`

Create a function that:
1. Takes two HDExtract objects as input
2. Extracts all unique gate numbers from both charts
3. Loads I Ching data from `/data/gates.json` for ONLY those gates
4. Loads star system mappings from `gateLine_star_map.json` for those gate.lines
5. Returns a `RelevantLore` object with focused context

```typescript
interface RelevantLore {
  chartAGates: GateLore[];
  chartBGates: GateLore[];
  sharedGates: GateLore[];
  totalContextSize: number; // bytes, should be <15KB
}

interface GateLore {
  gate: number;
  line: number;
  hexagramName: string;
  iChingMeaning: string;
  starMappings: Array<{ system: string; weight: number; why: string }>;
}
```

**Acceptance criteria**:
- [ ] Only fetches gates present in input charts
- [ ] Context size stays under 15KB for typical chart pairs
- [ ] All 384 gate.lines can be retrieved individually
- [ ] Unit tests pass with 90%+ coverage

---

### TASK 2: Chart Comparison Algorithm
**File**: `src/lib/comparison.ts`
**Dependencies**: None (can run parallel with Task 1)
**Tests**: `src/lib/comparison.test.ts`

Create a function that compares two HD charts:

```typescript
interface ChartComparison {
  sharedGates: Array<{ gate: number; lineA: number; lineB: number }>;
  sharedChannels: string[];
  sharedCenters: { bothDefined: string[]; bothUndefined: string[] };
  typeDynamic: { typeA: string; typeB: string; dynamic: string };
  starSystemOverlap: { shared: string[]; divergent: string[] };
  compatibilityScores: { overall: number; communication: number; energy: number };
}

export function compareCharts(chartA: HDExtract, chartB: HDExtract): ChartComparison;
```

**Acceptance criteria**:
- [ ] Correctly identifies shared gates (same gate number, any line)
- [ ] Correctly identifies shared channels
- [ ] Type dynamics have descriptions (e.g., "Generator + Projector = guidance dynamic")
- [ ] Star system overlap uses classification results
- [ ] Unit tests with known chart pairs

---

### TASK 3: Prompt Templates
**File**: `src/lib/prompts/insight-templates.ts`
**Dependencies**: Task 1 (RelevantLore type), Task 2 (ChartComparison type)
**Tests**: `src/lib/prompts/insight-templates.test.ts`

Create prompt templates for insight generation:

```typescript
export function buildInsightPrompt(
  comparison: ChartComparison,
  lore: RelevantLore,
  options?: { depth: 'quick' | 'deep'; relationshipType?: string }
): string;
```

**Acceptance criteria**:
- [ ] Template includes all comparison data
- [ ] Template includes relevant lore context
- [ ] Output prompt is <20KB (fits in context)
- [ ] Template instructs LLM to reference specific gates/systems
- [ ] Template forbids generic/vague language

---

### TASK 4: Insight Generation Service
**File**: `server/src/services/insight-generator.ts`
**Dependencies**: Task 3
**Tests**: `server/src/services/insight-generator.test.ts`

Wire the prompt to OpenAI and parse response:

```typescript
export async function generateInsights(
  comparison: ChartComparison,
  lore: RelevantLore
): Promise<Insight[]>;
```

**Acceptance criteria**:
- [ ] Calls OpenAI with constructed prompt
- [ ] Parses response with Zod schema validation
- [ ] Returns structured insights array
- [ ] Handles API errors gracefully
- [ ] Schema validation tests pass

---

### TASK 5: API Route Enhancement
**File**: `server/src/routes/narrative.ts` (modify existing)
**Dependencies**: Task 4
**Tests**: E2E tests

Enhance the existing narrative route:

```typescript
// POST /api/insights
// Body: { chartA: HDExtract, chartB: HDExtract, options?: InsightOptions }
// Response: { insights: Insight[], comparison: ChartComparison }
```

**Acceptance criteria**:
- [ ] Accepts two charts in request body
- [ ] Returns insights + comparison data
- [ ] Rate limited appropriately
- [ ] Error responses are informative

---

### TASK 6: Comparison Input UI
**File**: `src/screens/ComparisonScreen.tsx`
**Dependencies**: None (can run parallel)
**Tests**: E2E with Playwright

Create UI for entering second chart:
- Reuse InputScreen form components
- Add "Compare with another chart" button to ResultScreen
- Store both charts in state
- Navigate to InsightsScreen on submit

**Acceptance criteria**:
- [ ] Can enter second person's birth data
- [ ] Validates input same as main InputScreen
- [ ] Shows loading state during API call
- [ ] Handles errors gracefully

---

### TASK 7: Insights Display UI
**File**: `src/screens/InsightsScreen.tsx`
**Dependencies**: Task 5 (API), Task 6 (navigation)
**Tests**: E2E with Playwright

Display generated insights:
- Card-based layout for each insight
- Show insight type badge (shared resonance, tension, etc.)
- Reference links to specific gates/systems
- "Regenerate" button for new insights

**Acceptance criteria**:
- [ ] Displays all insights from API
- [ ] Visual distinction between insight types
- [ ] References are clickable/highlighted
- [ ] Loading and error states handled

---

## Next Action

**Data merge is DONE.** Start with the lore retriever:

```bash
cd /Users/kingkamehameha/Documents/Kiro/Star_System_Sorter_React_Web/star-system-sorter

# Create the lore retriever that fetches only relevant gates
touch src/lib/lore-retriever.ts
```

**First implementation task:**
Build `lore-retriever.ts` that:
1. Takes two chart extracts as input
2. Identifies all unique gates between them
3. Fetches I Ching data from `gates.json` for ONLY those gates
4. Fetches star system mappings from `gateLine_star_map.json` for those gate.lines
5. Returns a focused context object (~5-10KB instead of 190KB)

This solves the Kiro context problem and enables insight generation.

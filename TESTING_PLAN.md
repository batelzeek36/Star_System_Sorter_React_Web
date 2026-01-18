# Star System Sorter - Testing Plan

## Overview

Testing strategy for the insight generation system. The challenge: LLM outputs are non-deterministic, but we can still validate structure and content references.

---

## What CAN Be Unit Tested (Deterministic)

| Component | Test Type | What to Assert |
|-----------|-----------|----------------|
| `lore-retriever.ts` | Unit | Returns only gates present in input charts |
| `lore-retriever.ts` | Unit | Returns correct I Ching text for each gate |
| `lore-retriever.ts` | Unit | Returns correct star system mappings |
| `comparison.ts` | Unit | Correctly identifies shared gates |
| `comparison.ts` | Unit | Correctly identifies shared channels |
| `comparison.ts` | Unit | Type dynamics are correct (Generator + Projector = X) |
| `comparison.ts` | Unit | Star system overlap calculated correctly |
| Prompt templates | Unit | Template renders with all required fields |
| Prompt templates | Unit | Context size stays under limit (e.g., <15KB) |

---

## What Needs Schema Validation (LLM Output)

```typescript
// Define expected insight structure
const InsightSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['shared_resonance', 'complementary', 'tension', 'decision_guidance']),
    title: z.string().min(10),
    body: z.string().min(50),
    references: z.object({
      gates: z.array(z.number()).optional(),
      channels: z.array(z.string()).optional(),
      starSystems: z.array(z.string()).optional(),
    }),
  })).min(3).max(7),
});

// Test: LLM output parses successfully
expect(() => InsightSchema.parse(llmResponse)).not.toThrow();
```

---

## What Needs Content Validation (LLM Output)

```typescript
// Test: Insights reference actual chart data
it('should reference gates from input charts', () => {
  const chartA = { gates: [19, 48, 32] };
  const chartB = { gates: [19, 55, 39] };
  const sharedGate = 19;

  const insights = await generateInsights(chartA, chartB);

  // At least one insight should mention the shared gate
  const mentionsSharedGate = insights.some(i =>
    i.body.includes('Gate 19') ||
    i.references.gates?.includes(19)
  );
  expect(mentionsSharedGate).toBe(true);
});

// Test: Insights reference correct star systems
it('should reference star systems from gate mappings', () => {
  // If Gate 19.3 maps to Pleiades, insights should mention Pleiades
  const insights = await generateInsights(chartWithGate19_3, chartB);
  const mentionsSystem = insights.some(i =>
    i.body.toLowerCase().includes('pleiades') ||
    i.references.starSystems?.includes('Pleiades')
  );
  expect(mentionsSystem).toBe(true);
});
```

---

## Golden Set Testing

Create 5-10 "known good" chart pairs with expected insights:

```typescript
// fixtures/golden-chart-pairs.json
{
  "pairs": [
    {
      "id": "test-pair-1",
      "chartA": { /* HD extract */ },
      "chartB": { /* HD extract */ },
      "expectedElements": {
        "mustMentionGates": [19, 48],
        "mustMentionSystems": ["Pleiades", "Arcturus"],
        "mustIncludeInsightTypes": ["shared_resonance", "tension"],
        "mustNotContain": ["generic", "anyone", "everybody"] // No vague language
      }
    }
  ]
}
```

---

## Test Commands

```bash
# Unit tests for deterministic functions
npm run test -- --grep "lore-retriever|comparison"

# Schema validation tests
npm run test -- --grep "insight-schema"

# Golden set validation (slower, calls LLM)
npm run test:golden -- --timeout 30000

# Full E2E with real charts
npm run test:e2e -- --grep "insight-generation"
```

---

## Task List for Auto-Claude (Testing)

### TEST TASK 1: Lore Retriever Tests
**File**: `src/lib/lore-retriever.test.ts`
**Dependencies**: Implementation of `lore-retriever.ts`

```typescript
describe('lore-retriever', () => {
  describe('getRelevantLoreForCharts', () => {
    it('should return only gates present in input charts');
    it('should return I Ching text for each gate');
    it('should return star system mappings for each gate.line');
    it('should identify shared gates between charts');
    it('should keep total context size under 15KB');
    it('should handle charts with no shared gates');
    it('should handle single chart input (comparison with self)');
  });
});
```

**Acceptance criteria**:
- [ ] 90%+ code coverage on lore-retriever.ts
- [ ] Edge cases covered (empty gates, all gates shared, etc.)
- [ ] Performance test: retrieval completes in <100ms

---

### TEST TASK 2: Chart Comparison Tests
**File**: `src/lib/comparison.test.ts`
**Dependencies**: Implementation of `comparison.ts`

```typescript
describe('comparison', () => {
  describe('compareCharts', () => {
    it('should identify shared gates correctly');
    it('should identify shared channels correctly');
    it('should identify shared defined centers');
    it('should identify shared undefined centers');
    it('should generate correct type dynamic descriptions');
    it('should calculate star system overlap');
    it('should calculate compatibility scores');
  });

  describe('type dynamics', () => {
    it('Generator + Projector = guidance dynamic');
    it('Generator + Generator = sustainable energy');
    it('Manifestor + Projector = initiated guidance');
    it('Reflector + any = mirror dynamic');
    // All 25 type combinations
  });
});
```

**Acceptance criteria**:
- [ ] All type combinations have defined dynamics
- [ ] Known chart pairs produce expected comparisons
- [ ] Edge cases: identical charts, completely different charts

---

### TEST TASK 3: Prompt Template Tests
**File**: `src/lib/prompts/insight-templates.test.ts`
**Dependencies**: Implementation of `insight-templates.ts`

```typescript
describe('insight-templates', () => {
  describe('buildInsightPrompt', () => {
    it('should include all comparison data in prompt');
    it('should include relevant lore context');
    it('should stay under 20KB total size');
    it('should include instructions to reference specific gates');
    it('should include instructions to avoid generic language');
    it('should handle quick vs deep depth option');
    it('should handle different relationship types');
  });
});
```

**Acceptance criteria**:
- [ ] Template output is valid string
- [ ] All required sections present
- [ ] Size limits enforced

---

### TEST TASK 4: Insight Schema Tests
**File**: `src/lib/schemas/insight.test.ts`
**Dependencies**: Insight Zod schema

```typescript
describe('InsightSchema', () => {
  it('should accept valid insight structure');
  it('should reject missing type field');
  it('should reject title under 10 chars');
  it('should reject body under 50 chars');
  it('should accept optional references');
  it('should reject invalid insight types');
  it('should require 3-7 insights in array');
});
```

**Acceptance criteria**:
- [ ] Schema validates correctly
- [ ] Error messages are descriptive
- [ ] All edge cases covered

---

### TEST TASK 5: Insight Generation Integration Tests
**File**: `server/src/services/insight-generator.test.ts`
**Dependencies**: Full implementation stack

```typescript
describe('insight-generator', () => {
  describe('generateInsights', () => {
    it('should return valid insight array');
    it('should reference gates from input charts');
    it('should reference star systems from mappings');
    it('should handle API errors gracefully');
    it('should retry on transient failures');
    it('should timeout after 30 seconds');
  });
});
```

**Acceptance criteria**:
- [ ] Mocked OpenAI responses for unit tests
- [ ] Real API tests marked as integration (skip in CI)
- [ ] Error handling verified

---

### TEST TASK 6: Golden Set Fixtures
**File**: `tests/fixtures/golden-chart-pairs.json`
**Dependencies**: None

Create 5-10 chart pairs with known characteristics:

1. **High compatibility pair**: Many shared gates, same primary system
2. **Low compatibility pair**: Few shared gates, opposing systems
3. **Same type pair**: Both Generators
4. **Opposite type pair**: Manifestor + Reflector
5. **Channel completion pair**: One has Gate X, other has Gate Y (completing channel)
6. **Identical charts**: Same person compared with self
7. **No shared gates**: Completely different charts
8. **Maximum shared gates**: Charts with high overlap

Each fixture includes:
- Full HDExtract for both charts
- Expected shared gates
- Expected star systems
- Required insight types
- Forbidden phrases

**Acceptance criteria**:
- [ ] Fixtures are valid HDExtract objects
- [ ] Expected elements are verifiable
- [ ] Covers edge cases

---

### TEST TASK 7: Golden Set Validation Tests
**File**: `tests/golden/insight-validation.test.ts`
**Dependencies**: Tasks 1-6 complete

```typescript
describe('golden set validation', () => {
  const goldenPairs = loadGoldenPairs();

  goldenPairs.forEach(pair => {
    describe(`pair: ${pair.id}`, () => {
      it('should generate valid insights', async () => {
        const insights = await generateInsights(pair.chartA, pair.chartB);
        expect(InsightSchema.parse({ insights })).toBeDefined();
      });

      it('should mention required gates', async () => {
        const insights = await generateInsights(pair.chartA, pair.chartB);
        pair.expectedElements.mustMentionGates.forEach(gate => {
          const mentioned = insights.some(i =>
            i.body.includes(`Gate ${gate}`) ||
            i.references.gates?.includes(gate)
          );
          expect(mentioned).toBe(true);
        });
      });

      it('should mention required star systems', async () => {
        const insights = await generateInsights(pair.chartA, pair.chartB);
        pair.expectedElements.mustMentionSystems.forEach(system => {
          const mentioned = insights.some(i =>
            i.body.toLowerCase().includes(system.toLowerCase()) ||
            i.references.starSystems?.includes(system)
          );
          expect(mentioned).toBe(true);
        });
      });

      it('should not contain forbidden phrases', async () => {
        const insights = await generateInsights(pair.chartA, pair.chartB);
        const allText = insights.map(i => i.body).join(' ').toLowerCase();
        pair.expectedElements.mustNotContain.forEach(phrase => {
          expect(allText).not.toContain(phrase.toLowerCase());
        });
      });
    });
  });
});
```

**Acceptance criteria**:
- [ ] All golden pairs pass
- [ ] Test runs in <60 seconds (with caching)
- [ ] Failures are descriptive

---

### TEST TASK 8: E2E Tests
**File**: `tests/e2e/insight-flow.spec.ts`
**Dependencies**: Full app running

```typescript
import { test, expect } from '@playwright/test';

test.describe('insight generation flow', () => {
  test('complete flow: input → result → compare → insights', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    await page.click('[data-testid="google-login"]');

    // 2. Enter first chart
    await page.fill('[data-testid="birth-date"]', '01/15/1990');
    await page.fill('[data-testid="birth-time"]', '10:30 AM');
    await page.fill('[data-testid="birth-location"]', 'New York, NY');
    await page.click('[data-testid="submit"]');

    // 3. Wait for results
    await expect(page.locator('[data-testid="result-screen"]')).toBeVisible();

    // 4. Click compare
    await page.click('[data-testid="compare-button"]');

    // 5. Enter second chart
    await page.fill('[data-testid="birth-date-2"]', '06/20/1988');
    await page.fill('[data-testid="birth-time-2"]', '3:45 PM');
    await page.fill('[data-testid="birth-location-2"]', 'Los Angeles, CA');
    await page.click('[data-testid="generate-insights"]');

    // 6. Verify insights displayed
    await expect(page.locator('[data-testid="insights-screen"]')).toBeVisible();
    await expect(page.locator('[data-testid="insight-card"]')).toHaveCount({ min: 3 });
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/insights', route => route.abort());

    // ... navigate to insights
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

**Acceptance criteria**:
- [ ] Happy path works
- [ ] Error states handled
- [ ] Loading states visible
- [ ] Responsive on mobile viewport

---

## Test Configuration

### vitest.config.ts additions

```typescript
export default defineConfig({
  test: {
    // Existing config...
    testTimeout: 10000,
    hookTimeout: 10000,

    // Golden set tests need longer timeout
    include: ['**/*.test.ts'],
    exclude: ['**/golden/**'],
  },
});

// Separate config for golden tests
export const goldenConfig = defineConfig({
  test: {
    include: ['**/golden/**/*.test.ts'],
    testTimeout: 60000,
    maxConcurrency: 1, // Avoid rate limits
  },
});
```

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:golden": "vitest run --config vitest.golden.config.ts",
    "test:e2e": "playwright test",
    "test:all": "npm run test && npm run test:golden && npm run test:e2e"
  }
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Unit test coverage | >90% on new files |
| Schema validation | 100% pass |
| Golden set pass rate | 100% |
| E2E pass rate | 100% |
| Golden test duration | <60s |
| E2E test duration | <120s |

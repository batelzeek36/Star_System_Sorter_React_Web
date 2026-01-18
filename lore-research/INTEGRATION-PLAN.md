# Data Integration Plan: Tying It All Together

## Current State Assessment

### ✅ COMPLETE
- **s3-data/hexagrams/** (64 files) - I Ching hexagram data with exact quotes
- **Star mapping drafts** - All 8 systems × 7 batches = 56 files complete
- **Star system baselines v4.2** - All 8 systems with mapping_digest
- **gate-line-API-call/** - All 64 gates with behavioral/shadow axes

### 🟡 PARTIAL (Paraphrased, needs exact quotes)
- **s3-data/gates/** (64 files) - Has structure but needs Line Companion exact quotes
- **s3-data/channels/** (36 files) - Has Line Companion pulls but paraphrased
- **s3-data/centers/** (9 files) - Paraphrased descriptions

### ❌ TODO
- **s3-data/circuits/** - Needs completion
- **Master gate-line-to-star mapping** - Merge all 56 batch files
- **Validation scripts** - Ensure data integrity across all sources

---

## Data Flow Architecture

```
Line Companion (source text)
    ↓
s3-data/gates/*.json (exact quotes per line)
    ↓
gate-line-API-call/gate-line-*.json (behavioral interpretation)
    ↓
star-mapping-drafts/*-batch*.json (star system weights)
    ↓
s3-data/associations/gate-line-to-star.v2.json (MASTER MAPPING)
    ↓
Star System Sorter App (scoring algorithm)
```

---

## Task Breakdown

### Phase 1: Extract Exact Quotes from Line Companion

**Goal**: Replace paraphrased content with exact Ra Uru Hu quotes

#### 1.1 Parse Line Companion Text
- Input: `s3-data/Line Companion_djvu.txt`
- Output: Structured JSON with exact quotes per gate.line
- Script: `lore-research/scripts/parse-line-companion.ts`

**Structure needed:**
```typescript
{
  "1.1": {
    "title": "Creation is independent of will",
    "quote": "Creation is independent of will. Right away you have this keynote...",
    "exaltation": "The Moon exalted as the symbol of adaptation. Time is everything.",
    "detriment": "Uranus in detriment. Instability leads to distortion.",
    "page": 1
  }
  // ... all 384 gate.lines
}
```

#### 1.2 Update s3-data/gates/*.json
- Replace `classical.hd_quote` with exact Line Companion quotes (not paraphrased)
- Keep `interpretation` section (behavioral mapping) as-is
- Add `provenance.line_companion_page` for citation
- Script: `lore-research/scripts/update-gates-with-quotes.ts`

#### 1.3 Update s3-data/channels/*.json
- Extract exact channel-level quotes from Line Companion
- Replace paraphrased "Line Companion pulls" with exact quotes
- Script: `lore-research/scripts/update-channels-with-quotes.ts`

#### 1.4 Update s3-data/centers/*.json
- Extract exact center descriptions from Line Companion or Rave I'Ching
- Replace paraphrased content
- Script: `lore-research/scripts/update-centers-with-quotes.ts`

---

### Phase 2: Complete Missing Data

#### 2.1 Complete s3-data/circuits/*.json
- Define all 5 circuits: Individual, Tribal, Collective (Abstract, Logic), Integration
- Include exact quotes about circuit mechanics
- Reference: Rave I'Ching circuit descriptions

**Structure:**
```json
{
  "id": "circuit.individual",
  "streams": ["stream.knowing", "stream.centering"],
  "gates": [1, 2, 7, 10, 13, 25, 27, 28, 29, 31, 33, 43, 46, 49, 51, 55, 59],
  "keynotes": ["mutation", "empowerment", "melancholy"],
  "quote": "Exact Ra quote about individual circuit",
  "provenance": "Rave I'Ching, page X"
}
```

---

### Phase 3: Merge Star Mapping Batches

#### 3.1 Validate All Batch Files
- Check all 56 batch files for completeness
- Ensure every gate.line has weight, alignment_type, why
- Flag any missing or malformed entries
- Script: `lore-research/scripts/validate-batch-files.ts`

#### 3.2 Merge into Master Mapping
- Combine all 56 batch files into single master file
- Structure: `{ "1.1": { "pleiades": {...}, "andromeda": {...}, ... } }`
- Output: `s3-data/associations/gate-line-to-star.v2.json`
- Script: `lore-research/scripts/merge-star-mappings.ts`

**Master structure:**
```json
{
  "1.1": {
    "pleiades": { "weight": 0, "alignment_type": "none", "why": "..." },
    "sirius": { "weight": 0.3, "alignment_type": "core", "why": "..." },
    "lyra": { "weight": 0, "alignment_type": "none", "why": "..." },
    "andromeda": { "weight": 0, "alignment_type": "none", "why": "..." },
    "orion_light": { "weight": 0.5, "alignment_type": "core", "why": "..." },
    "orion_dark": { "weight": 0, "alignment_type": "none", "why": "..." },
    "arcturus": { "weight": 0, "alignment_type": "none", "why": "..." },
    "draco": { "weight": 0, "alignment_type": "none", "why": "..." }
  }
  // ... all 384 gate.lines
}
```

---

### Phase 4: Build Scoring Algorithm

#### 4.1 Create Scoring Library
- Input: User's HD chart (activated gates/lines)
- Process: Look up each gate.line in master mapping
- Calculate weighted scores for all 8 star systems
- Output: Ranked star systems with percentages
- Location: `star-system-sorter/src/lib/scorer.ts`

**Algorithm:**
```typescript
function computeClassification(hdData: HDExtract): ClassificationResult {
  const scores = initializeScores(); // 8 systems at 0
  
  // Score activated gates/lines
  for (const gateLine of hdData.activatedGateLines) {
    const mapping = masterMapping[gateLine];
    for (const system in mapping) {
      scores[system] += mapping[system].weight;
    }
  }
  
  // Normalize to percentages
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const percentages = normalizeScores(scores, total);
  
  // Determine classification type
  const sorted = sortByScore(percentages);
  const [first, second] = sorted;
  
  if (first.score - second.score > 6) {
    return { type: 'primary', primary: first.system, percentages };
  } else if (first.score - second.score <= 6) {
    return { type: 'hybrid', primary: first.system, secondary: second.system, percentages };
  } else {
    return { type: 'unresolved', percentages };
  }
}
```

#### 4.2 Add Validation Tests
- Test with known HD charts
- Verify deterministic results (same input = same output)
- Check edge cases (no activations, all activations, etc.)
- Location: `star-system-sorter/tests/lib/scorer.test.ts`

---

### Phase 5: Data Integrity & Provenance

#### 5.1 Add Provenance Tracking
- Every quote must cite source + page number
- Track version history for all data files
- Document transformation pipeline

#### 5.2 Create Data Registry
- Central manifest of all data files
- Version numbers, last updated, status
- Location: `s3-data/sources/registry.json`

#### 5.3 Build Validation Suite
- Cross-reference gates ↔ hexagrams ↔ channels
- Verify all 384 gate.lines exist in all systems
- Check for orphaned references
- Script: `lore-research/scripts/validate-data-integrity.ts`

---

## Scripts to Build

1. **parse-line-companion.ts** - Extract structured data from Line Companion text
2. **update-gates-with-quotes.ts** - Replace paraphrased quotes with exact text
3. **update-channels-with-quotes.ts** - Update channel files with exact quotes
4. **update-centers-with-quotes.ts** - Update center files with exact quotes
5. **validate-batch-files.ts** - Check all 56 batch files for completeness
6. **merge-star-mappings.ts** - Combine batches into master mapping
7. **validate-data-integrity.ts** - Cross-reference all data sources
8. **generate-scorer-fixtures.ts** - Create test data for scoring algorithm

---

## Priority Order

### Immediate (Week 1)
1. Parse Line Companion text → structured JSON
2. Update s3-data/gates/ with exact quotes
3. Validate all 56 batch files

### Short-term (Week 2)
4. Merge batch files into master mapping
5. Build scoring algorithm
6. Create test fixtures

### Medium-term (Week 3-4)
7. Update channels/centers with exact quotes
8. Complete circuits data
9. Build validation suite
10. Add provenance tracking

---

## Questions to Resolve

1. **Line Companion parsing**: Should we use the djvu.txt or parse the PDF/EPUB directly?
2. **Quote length**: How much context to include? Full paragraph or just key sentence?
3. **Exaltation/Detriment**: Do we need planetary data in gates/*.json?
4. **Circuits**: Which source is authoritative for circuit descriptions?
5. **Master mapping format**: JSON or YAML? Single file or split by system?

---

## Success Criteria

- [ ] All 384 gate.lines have exact Line Companion quotes
- [ ] All 56 batch files validated and merged
- [ ] Master gate-line-to-star mapping complete
- [ ] Scoring algorithm produces deterministic results
- [ ] All data has provenance (source + page)
- [ ] Validation suite passes 100%
- [ ] App can classify any HD chart input

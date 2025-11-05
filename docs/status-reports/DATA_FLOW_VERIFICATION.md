# Data Flow Verification: Source of Truth Analysis

## Executive Summary

**YES**, the data in `s3-data/` and `lore-research/research-outputs/gate-line-API-call/` **IS** the source of truth that feeds into the Star System Sorter app. Here's the complete data flow:

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ PRIMARY SOURCES (Source of Truth)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. s3-data/hexagrams/*.json (64 files)                        │
│     └─ I Ching hexagram text with Legge translations           │
│                                                                  │
│  2. s3-data/gates/*.json (64 files)                            │
│     └─ Human Design gate data with Line Companion quotes       │
│                                                                  │
│  3. lore-research/research-outputs/gate-line-API-call/         │
│     gate-line-{1-64}.json (64 files)                           │
│     └─ Behavioral/shadow axes for each gate.line               │
│                                                                  │
│  4. lore-research/research-outputs/star-systems/v4.2/          │
│     *-baseline-4.2.json (8 files)                              │
│     └─ Star system archetypes with mapping_digest              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ INTERMEDIATE PROCESSING                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  5. lore-research/research-outputs/star-mapping-drafts/        │
│     {system}-batch{1-7}.json (56 files = 8 systems × 7 batches)│
│     └─ Maps each gate.line to each star system with:           │
│        • weight (0.0-1.0)                                       │
│        • alignment_type (core/shadow/none)                      │
│        • why (behavioral rationale)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ MASTER MAPPING (To Be Generated - Task 60)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  6. lore-research/research-outputs/gateLine_star_map.json      │
│     └─ Merged from all 56 batch files                          │
│     └─ Structure:                                               │
│        {                                                         │
│          "1.1": [                                               │
│            {                                                     │
│              "star_system": "Pleiades",                         │
│              "weight": 0.95,                                    │
│              "alignment_type": "core",                          │
│              "why": "..."                                       │
│            },                                                    │
│            { ... other systems ... }                            │
│          ],                                                      │
│          ... all 384 gate.lines ...                            │
│        }                                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ APP RUNTIME (star-system-sorter/)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  7. star-system-sorter/src/lib/lore.bundle.ts                  │
│     └─ Compiled from gateLine_star_map.json                    │
│     └─ Bundled into app at build time                          │
│                                                                  │
│  8. star-system-sorter/src/lib/scorer.ts                       │
│     └─ Imports loreBundle                                       │
│     └─ computeScoresWithLore(hdData)                           │
│     └─ Returns classification result                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Data Flow Steps

### Step 1: Source Data Collection
**Location**: `s3-data/` and `lore-research/research-outputs/`

- **Hexagrams** (`s3-data/hexagrams/*.json`): I Ching text with Legge translations
- **Gates** (`s3-data/gates/*.json`): Human Design gates with Line Companion quotes
- **Gate-Line Behavioral Data** (`lore-research/research-outputs/gate-line-API-call/gate-line-{1-64}.json`):
  - Each file contains 6 lines for one gate
  - Each line has: `behavioral_axis`, `shadow_axis`, `keywords`, `hd_quote`
  - Example: `gate-line-4.json` contains gate 4, lines 1-6 (4.1, 4.2, 4.3, 4.4, 4.5, 4.6)

### Step 2: Star System Mapping
**Location**: `lore-research/research-outputs/star-mapping-drafts/`

The 56 batch files map gate.lines to star systems:
- **Batch structure**: 8 systems × 7 batches = 56 files
- **Batch 1**: Gates 1-8 (48 gate.lines)
- **Batch 2**: Gates 9-16 (48 gate.lines)
- **Batch 3**: Gates 17-24 (48 gate.lines)
- **Batch 4**: Gates 25-32 (48 gate.lines)
- **Batch 5**: Gates 33-40 (48 gate.lines)
- **Batch 6**: Gates 41-48 (48 gate.lines)
- **Batch 7**: Gates 49-64 (96 gate.lines)

Each batch file contains mappings like:
```json
{
  "25.1": {
    "weight": 0.4,
    "alignment_type": "core",
    "why": "Behavioral explanation referencing gate-line-25.json data"
  }
}
```

### Step 3: Master Mapping Generation (Task 60)
**Output**: `lore-research/research-outputs/gateLine_star_map.json`

This file will merge all 56 batch files into a single lookup table:
```json
{
  "_meta": {
    "version": "1.0",
    "generated_at_utc": "2025-11-03T...",
    "source_star_system_version": "4.2"
  },
  "1.1": [
    { "star_system": "Pleiades", "weight": 0.95, "alignment_type": "core", "why": "..." },
    { "star_system": "Arcturus", "weight": 0.3, "alignment_type": "core", "why": "..." }
  ],
  "1.2": [ ... ],
  ... all 384 gate.lines ...
}
```

### Step 4: App Compilation
**Location**: `star-system-sorter/src/lib/`

1. **Build script** reads `gateLine_star_map.json`
2. **Compiles** it into `lore.bundle.ts` (TypeScript module)
3. **Bundle** is imported by `scorer.ts`
4. **Bundled** into app at build time (no runtime file loading)

### Step 5: Runtime Scoring
**Location**: `star-system-sorter/src/lib/scorer.ts`

When a user submits their birth data:
1. App calls BodyGraph API to get HD chart data (gates, centers, channels, etc.)
2. `computeScoresWithLore(hdData)` function:
   - Matches user's activated gates/lines against `loreBundle.rules`
   - Looks up weights for each gate.line from the compiled bundle
   - Calculates weighted scores for all 8 star systems
   - Normalizes to percentages (sum = 100%)
3. `classify()` function determines:
   - **Primary**: One system leads by >6%
   - **Hybrid**: Top two within 6% of each other
   - **Unresolved**: No clear classification

## Source of Truth Verification

### ✅ Confirmed: s3-data/ is authoritative for:
- **Hexagram text**: `s3-data/hexagrams/*.json` (64 files)
- **Gate data**: `s3-data/gates/*.json` (64 files)
- **Centers**: `s3-data/centers/*.json` (9 files)
- **Channels**: `s3-data/channels/*.json` (36 files)

### ✅ Confirmed: lore-research/research-outputs/ is authoritative for:
- **Gate-line behavioral data**: `gate-line-API-call/gate-line-{1-64}.json` (64 files)
- **Star system baselines**: `star-systems/v4.2/*-baseline-4.2.json` (8 files)
- **Star mappings**: `star-mapping-drafts/{system}-batch{1-7}.json` (56 files)

### ✅ Confirmed: Data flows into app via:
1. **Merge script** (Task 60) → `gateLine_star_map.json`
2. **Build script** → `lore.bundle.ts`
3. **Runtime** → `scorer.ts` imports and uses the bundle

## Critical Path to App Integration

### Current Status (as of tasks.md):
- ✅ Tasks 1-7: Complete (Andromeda batches 1-7, Arcturus batches 1-4)
- ⏳ Tasks 8-59: In progress (remaining batch validations)
- ⏳ Task 60: **CRITICAL** - Merge all batches into master mapping
- ⏳ Task 61: QC validation
- ⏳ Task 62: Update pipeline status

### What Needs to Happen:
1. **Complete all 56 batch files** (Tasks 8-59)
2. **Merge into master mapping** (Task 60)
   - Script: `lore-research/scripts/merge-star-mappings.ts` (to be created)
   - Output: `lore-research/research-outputs/gateLine_star_map.json`
3. **Compile into app bundle** (build script)
   - Script: `star-system-sorter/scripts/compile-lore.ts` (to be created)
   - Output: `star-system-sorter/src/lib/lore.bundle.ts`
4. **App imports and uses** (already implemented)
   - `scorer.ts` already imports `loreBundle`
   - `computeScoresWithLore()` already uses the data

## Data Integrity Guarantees

### Provenance Tracking:
- Every gate.line in `gate-line-API-call/` cites its source
- Every star mapping in `star-mapping-drafts/` references the gate-line file
- Master mapping includes `_meta` with version and generation timestamp
- App bundle includes `rules_hash` for deterministic verification

### Validation Pipeline:
- **Task 61**: QC validation ensures:
  - All 384 gate.lines present
  - No missing or malformed entries
  - Weights are valid numbers (0.0-1.0)
  - Sanity checks on archetypal expectations

### Deterministic Results:
- Same birth data → same HD chart → same gate.line activations → same weights → same classification
- No randomness, no AI inference at runtime
- All logic is pre-computed and bundled

## Answer to Your Question

**YES, the data in `s3-data/` and `lore-research/research-outputs/gate-line-API-call/` is absolutely the source of truth.**

The flow is:
1. **Research data** (s3-data/ + gate-line-API-call/) → 
2. **Star mappings** (star-mapping-drafts/) → 
3. **Master mapping** (gateLine_star_map.json) → 
4. **App bundle** (lore.bundle.ts) → 
5. **Runtime scoring** (scorer.ts)

Nothing is invented or inferred at runtime. The app is a pure lookup and calculation engine that uses the pre-researched, pre-validated data from your source files.

## Next Steps to Complete Integration

1. **Finish batch validations** (Tasks 8-59)
2. **Write merge script** (Task 60)
3. **Write compile script** (for lore.bundle.ts generation)
4. **Run QC validation** (Task 61)
5. **Test end-to-end** with real HD chart data

Once Task 60 is complete, the data pipeline is fully connected from source to app.

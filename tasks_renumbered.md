# Gate.Line → Star System Mapping Pipeline

> **Purpose**: Generate `gateLine_star_map.json`, which links every Human Design gate.line to star system archetypes with weights and behavioral rationale. This map powers the Star System Sorter (S³) app's scoring mechanism.

## Overview

This pipeline transforms behavioral research data into a machine-readable scoring matrix while maintaining strict separation between:
- **Machine Layer**: Clean scoring data (`gateLine_star_map.json`)
- **Provenance Layer**: Academic citations, disputed points, methodology (star system baseline JSONs)

## Data Sources

### Input Files

**Gate-Line Batches** (384 total gate.lines across 7 files):
```
lore-research/research-outputs/gate-line-API-call/
├── gate-line-1.json  (Gates 1-8, 6 lines each = 48 gate.lines)
├── gate-line-2.json  (Gates 9-16, 6 lines each = 48 gate.lines)
├── gate-line-3.json  (Gates 17-24, 6 lines each = 48 gate.lines)
├── gate-line-4.json  (Gates 25-32, 6 lines each = 48 gate.lines)
├── gate-line-5.json  (Gates 33-40, 6 lines each = 48 gate.lines)
├── gate-line-6.json  (Gates 41-48, 6 lines each = 48 gate.lines)
└── gate-line-7.json  (Gates 49-64, 6 lines each = 96 gate.lines)
```

Each gate.line entry contains:
- `keywords`: Array of behavioral descriptors
- `behavioral_axis`: Healthy/gift expression (one sentence)
- `shadow_axis`: Distorted/control expression (one sentence)

**Star System Baselines** (8 systems at version 4.2):
```
lore-research/research-outputs/star-systems/v4.2/
├── andromeda-baseline-4.2.json
├── arcturus-baseline-4.2.json
├── draco-baseline-4.2.json
├── lyra-baseline-4.2.json
├── orion-dark-baseline-4.2.json
├── orion-light-baseline-4.2.json
├── pleiades-baseline-4.2.json
└── sirius-baseline-4.2.json
```

Each baseline contains:
- `characteristics`: Traits with consensus levels, ancient support, polarity
- `disputed_points`: Claims with supporting/counter evidence
- `bibliography`: Academic citations with ISBNs, translators, publishers
- `methodology`: Research framework and source standards

### Output Files

**Intermediate Outputs** (56 files):
```
lore-research/research-outputs/star-mapping-drafts/
├── andromeda-batch1.json ... andromeda-batch7.json
├── arcturus-batch1.json ... arcturus-batch7.json
├── draco-batch1.json ... draco-batch7.json
├── lyra-batch1.json ... lyra-batch7.json
├── orion-dark-batch1.json ... orion-dark-batch7.json
├── orion-light-batch1.json ... orion-light-batch7.json
├── pleiades-batch1.json ... pleiades-batch7.json
└── sirius-batch1.json ... sirius-batch7.json
```

**Final Output**:
```
lore-research/research-outputs/gateLine_star_map.json
```

## Mapping Digest Concept

The `mapping_digest` is a behavioral fingerprint added to each star system baseline JSON for programmatic comparison. It enables the scoring algorithm to match gate.line behaviors against star system archetypes without loading full academic provenance.

### Structure

```json
{
  "mapping_digest": {
    "core_themes": [
      "Behavioral pattern 1 (healthy/gift expression)",
      "Behavioral pattern 2 (functional role)",
      "Behavioral pattern 3 (relational style)"
    ],
    "shadow_themes": [
      "Distorted pattern 1 (control/fear expression)",
      "Distorted pattern 2 (survival mechanism)"
    ],
    "quick_rules": [
      "If gate.line shows X behavior, this is a strong match",
      "If gate.line shows Y behavior, that's [other system], not this one",
      "Disambiguation: Z pattern distinguishes this from [similar system]"
    ]
  }
}
```

### Content Guidelines

**DO include**:
- Psychological motivations (fear, desire, need)
- Relational patterns (bonding, hierarchy, collaboration)
- Functional roles (caretaker, enforcer, initiator, healer)
- Behavioral verbs (scanning, soothing, enforcing, transmitting)

**DO NOT include**:
- Cosmogenesis lore (Atlantis, Lemuria, galactic wars)
- Channeled text quotes
- Copyrighted long passages
- Mystical jargon without behavioral translation

### Disambiguation Examples

**Pleiades vs Draco**:
- Pleiades: Emotional co-regulation, nervous system soothing, caretaking panic
- Draco: Predator scanning, loyalty enforcement, survival through dominance

**Sirius vs Orion-Light**:
- Sirius: Spiritual initiation, sacred knowledge transmission, high-order liberation
- Orion-Light: Honorable trial, mystery schools, wisdom keepers, ascending through ordeal

**Orion-Light vs Orion-Dark**:
- Orion-Light: Honorable trial, spiritual/warrior initiation, ascending through ordeal in service to higher code
- Orion-Dark: Empire management, coercive control structures, obedience enforcement, psychological pressure at scale

## Scoring Protocol

### Weight Assignment (0.0–1.0)

- **0.9–1.0**: Extremely strong match (core archetype, unmistakable alignment)
- **0.7–0.8**: Strong match (clear behavioral overlap)
- **0.5–0.6**: Moderate match (partial alignment, secondary theme)
- **0.3–0.4**: Weak match (minor overlap, tangential connection)
- **0.1–0.2**: Minimal match (barely relevant)
- **0.0**: No match (omit from output)

### Alignment Type

- **"core"**: Matches healthy/gift expression (`behavioral_axis` → `core_themes`)
- **"shadow"**: Matches distorted expression (`shadow_axis` → `shadow_themes`)
- **"none"**: No significant match (weight < 0.3)

### Behavioral Rationale ("why")

One-sentence explanation using behavioral language:
- ✅ "Extreme need-sensitivity and bond-maintenance panic maps to Pleiadian nurturing/safety behavior."
- ✅ "Predator scanning, loyalty enforcement, and access control align with Draco survival-through-dominance."
- ❌ "The royal lodge of Sirius transmitted this frequency during Atlantis."
- ❌ "Gate 19 channels the divine feminine from the Pleiadian star mothers."

## Scoring Algorithm

### Step 1: Core Alignment Check
1. Load star system's `mapping_digest.core_themes`
2. Compare gate.line `behavioral_axis` + `keywords` to `core_themes`
3. Look for semantic overlap in behavioral patterns
4. Assign weight:
   - 0.7–1.0 for strong match
   - 0.4–0.6 for moderate match
   - 0.0–0.3 for weak/no match

### Step 2: Shadow Alignment Check
1. Load star system's `mapping_digest.shadow_themes`
2. Compare gate.line `shadow_axis` + `keywords` to `shadow_themes`
3. Identify distorted/control expressions
4. Assign weight using same scale as core check

### Step 3: Disambiguation via Quick Rules
1. Apply `mapping_digest.quick_rules` to break ties
2. Prevent cross-system contamination
3. Adjust weight down if quick_rules indicate mismatch
4. Example: If gate.line shows "emotional caregiving" but you're scoring Draco, quick_rules should flag "that's Pleiades, not Draco" and reduce weight to 0.0

### Step 4: Alignment Type Assignment
- If match is via `behavioral_axis` → `core_themes`: `alignment_type = "core"`
- If match is via `shadow_axis` → `shadow_themes`: `alignment_type = "shadow"`
- If weight < 0.3: `alignment_type = "none"`

## Merge Rules

### Aggregation Logic
1. Initialize empty object: `finalMap = {}`
2. For each of 56 per-batch mapping files:
   - Extract `star_system` from filename (e.g., "draco-batch4.json" → "Draco")
   - Parse JSON
   - For each gate.line in file:
     - If `weight > 0.0`:
       - Append entry to `finalMap[gateLineId]` array:
         ```json
         {
           "star_system": "Draco",
           "weight": 0.85,
           "alignment_type": "core",
           "why": "Behavioral rationale here"
         }
         ```
3. For each gate.line's array:
   - Sort by `weight` descending
   - Omit entries with `weight === 0.0`

### Final Structure
```json
{
  "_meta": {
    "version": "1.0",
    "generated_at_utc": "2025-10-27T00:00:00Z",
    "source_star_system_version": "4.2"
  },
  "19.1": [
    {
      "star_system": "Pleiades",
      "weight": 0.95,
      "alignment_type": "core",
      "why": "Need sensitivity and bonding panic strongly align with Pleiades caretaking archetype."
    },
    {
      "star_system": "Arcturus",
      "weight": 0.30,
      "alignment_type": "core",
      "why": "Energetic sensitivity has minor overlap with Arcturus frequency calibration."
    }
  ],
  "44.4": [
    {
      "star_system": "Draco",
      "weight": 0.85,
      "alignment_type": "core",
      "why": "Loyalty enforcement and access control align with Draco's survival-through-dominance archetype."
    }
  ]
}
```

## QC Checklist

### Coverage Check
- **Expected**: 384 gate.lines (64 gates × 6 lines)
- **Verify**: Every gate.line from gate-line-1.json through gate-line-7.json appears in `gateLine_star_map.json`
- **Action**: List any missing gate.lines

### Consistency Check
- **Verify**: Every gate.line has a non-empty array
- **Verify**: All weights are numbers between 0 and 1
- **Verify**: All `alignment_type` values are "core", "shadow", or "none"
- **Verify**: `gateLine_star_map.json` parses as valid JSON (no trailing commas, proper syntax)

### Sanity Check: Archetypal Expectations

**Gate 19.x** (Need sensitivity, bonding, caretaking panic):
- ✅ Expected: Pleiades core (high weight 0.8–1.0)
- ✅ Acceptable: Arcturus core (moderate weight 0.3–0.6) for healing/regulation signal
- ❌ Red flag: Draco core (high weight) — this is misattribution

**Gate 27.x** (Caregiver, feeding, "keep everyone alive"):
- ✅ Expected: Pleiades core (high weight)
- ✅ Acceptable: Arcturus core (moderate weight)
- ❌ Red flag: Draco core — caretaking is NOT dominance hierarchy

**Gate 32.x** (Loyalty, preserving the line, survival continuity, fear of collapse):
- ✅ Expected: Draco core (high weight)
- ✅ Acceptable: Orion-Dark core (moderate weight) for hierarchical continuity / empire survival framing
- ❌ Red flag: Pleiades core (high weight) — this is about dominance, not nurturing

**Gate 44.x** (Loyalty enforcement, predator scanning, access control):
- ✅ Expected: Draco core (high weight)
- ✅ Acceptable: Orion-Dark shadow (moderate weight)
- ❌ Red flag: Pleiades core — predator scanning is NOT emotional caregiving

**Gate 54.x** (Ambition through ordeal, spiritual ascent):
- ✅ Expected: Orion-Light core (high weight) OR Sirius core (high weight)
- ✅ Acceptable: Draco shadow (moderate weight) if it's "status climb at any cost"
- ❌ Red flag: Pleiades core (high weight) — initiation through trial is NOT nurturing

**Gate 36.x** (Initiation via emotional crisis / catalytic ordeal):
- ✅ Expected: Sirius core (high weight) OR Orion-Light core (high weight)
- ✅ Acceptable: Pleiades shadow (low-moderate weight) if it's "crisis-for-attachment / emotional escalation as bonding strategy"
- ❌ Red flag: Draco core (high weight) unless it's explicitly about power/control through crisis

### QC Documentation Requirements

After running QC, append results to this file under "QC Results" section:
- Coverage status (complete / missing which IDs)
- Consistency status (invalid weights? parsing errors?)
- Sanity notes on 19.x / 27.x / 32.x / 36.x / 44.x / 54.x
- Any weird cross-system bleed that needs manual review
- If unresolved issues exist, mark QC as **incomplete** and list blockers

## Pipeline Phases

### Phase 1: Documentation ✘
- Create this `tasks.md` file
- Document all concepts, protocols, and expectations

### Phase 2: Behavioral Fingerprinting ✘
- Generate `mapping_digest` for all 8 star systems
- Inject into baseline JSONs while preserving provenance
- Validate structure and content

### Phase 3: Per-Batch Scoring ✘
- Generate 56 mapping files (8 systems × 7 batches)
- Apply scoring algorithm to each [system, batch] pair
- Validate JSON syntax and weight ranges

### Phase 4: Merge ✘
- Aggregate all 56 files into `gateLine_star_map.json`
- Add `_meta` section with version and timestamp
- Sort each gate.line's array by weight descending

### Phase 5: QC Validation ✘
- Run coverage, consistency, and sanity checks
- Document results in this file
- Flag any blockers for manual review

## Two-Layer Architecture

### Machine Layer
**File**: `lore-research/research-outputs/gateLine_star_map.json`
- Clean, behavioral, programmatic scoring data
- Optimized for runtime performance
- No citations, no disputed points, no methodology
- Single canonical lookup file

### Provenance Layer
**Files**: `lore-research/research-outputs/star-systems/v4.2/*-baseline-4.2.json`
- Academic citations with ISBNs, page numbers, translators
- Disputed points and consensus levels
- Methodology documentation
- Bibliography references
- Preserved alongside machine layer

### Integration
The S³ app UI will merge both layers when presenting results to users:
- Show scores from machine layer
- Display academic backing from provenance layer
- Maintain credibility without sacrificing performance

## Status

**Last Updated**: [To be filled by agent]

| Phase | Status | Notes |
|-------|--------|-------|
| Documentation | ✘ | This file |
| Mapping Digest Injection | ✘ | 8 star systems |
| Per-Batch Drafts | ✘ | 56 files (8×7) |
| Merge to gateLine_star_map.json | ✘ | With _meta |
| QC Complete | ✘ | Coverage/consistency/sanity |
| Ready for S³ Runtime | ✘ | Final validation |

**Source Star System Version**: 4.2  
**Target gateLine_star_map Version**: 1.0  
**Generation Timestamp (UTC)**: [To be filled by agent]

---

## QC Results

[To be filled by agent after Phase 5]

### Coverage
- Total gate.lines expected: 384
- Total gate.lines found: [TBD]
- Missing gate.lines: [TBD]

### Consistency
- All weights numeric and 0.0–1.0: [TBD]
- All alignment_type valid: [TBD]
- Valid JSON syntax: [TBD]
- No empty arrays: [TBD]

### Sanity Checks
- Gate 19.x → Pleiades: [TBD]
- Gate 27.x → Pleiades: [TBD]
- Gate 32.x → Draco: [TBD]
- Gate 44.x → Draco: [TBD]
- Gate 54.x → Orion-Light/Sirius: [TBD]
- Gate 36.x → Sirius/Orion-Light: [TBD]

### Issues & Blockers
[TBD]

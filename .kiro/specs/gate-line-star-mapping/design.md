# Design Document

## Overview

The gate.line → star system mapping pipeline is a multi-stage data transformation system that converts behavioral research data into a machine-readable scoring matrix. The pipeline maintains strict separation between the machine layer (clean scoring data) and provenance layer (academic citations), enabling both programmatic efficiency and academic credibility.

## Architecture

### Two-Layer Architecture

**Machine Layer (gateLine_star_map.json)**
- Clean, behavioral, programmatic scoring data
- Optimized for runtime performance
- No citations, no disputed points, no methodology
- Single canonical lookup file

**Provenance Layer (star system baseline JSONs)**
- Academic citations with ISBNs, page numbers, translators
- Disputed points and consensus levels
- Methodology documentation
- Bibliography references
- Preserved in star-systems/v4.2/*.json files

**Integration Point**: The app UI will merge both layers when presenting results to users, showing scores from the machine layer with academic backing from the provenance layer.

### Pipeline Stages

```
Stage 1: Documentation
├─ Create tasks.md with full pipeline spec
└─ Define scoring protocol and QC expectations

Stage 2: Behavioral Fingerprinting
├─ Load each star system baseline JSON
├─ Generate mapping_digest (core_themes, shadow_themes, quick_rules)
├─ Inject mapping_digest into baseline JSON
└─ Preserve all existing provenance fields

Stage 3: Per-Batch Scoring
├─ For each star system (8 systems)
│  └─ For each gate-line batch (7 batches)
│     ├─ Load mapping_digest
│     ├─ Load gate-line batch
│     ├─ Compare behavioral_axis + keywords → core_themes
│     ├─ Compare shadow_axis + keywords → shadow_themes
│     ├─ Apply quick_rules for disambiguation
│     ├─ Assign weight (0.0-1.0), alignment_type, why
│     └─ Write <system>-batch<i>.json to star-mapping-drafts/
└─ Output: 56 mapping files (8 systems × 7 batches)

Stage 4: Merge
├─ Load all 56 per-batch mapping files
├─ Aggregate by gate.line ID
├─ Filter out weight 0.0 entries
└─ Write gateLine_star_map.json

Stage 5: QC Validation
├─ Coverage check (all gate.lines present)
├─ Consistency check (valid JSON, numeric weights)
├─ Sanity check (archetypal expectations)
└─ Document results in tasks.md
```

## Components and Interfaces

### Input Data Structures

**Gate-Line Batch File** (`gate-line-1.json` through `gate-line-7.json`)
```json
{
  "44.4": {
    "keywords": ["loyalty", "enforcement", "access control"],
    "behavioral_axis": "Strategic gatekeeping for group survival",
    "shadow_axis": "Paranoid loyalty testing and exclusion"
  }
}
```

**Star System Baseline File** (`*-baseline-4.2.json`)
```json
{
  "version": "4.2",
  "star_system": "Draco",
  "characteristics": {
    "traits": [...],
    "polarity": "...",
    "consensus_level": "..."
  },
  "disputed_points": [...],
  "bibliography": [...]
}
```

### Intermediate Data Structures

**Mapping Digest** (added to star system baseline)
```json
{
  "mapping_digest": {
    "core_themes": [
      "Survival through dominance hierarchy",
      "Loyalty enforcement and predator scanning",
      "Strategic resource control"
    ],
    "shadow_themes": [
      "Paranoid control and power hoarding",
      "Ruthless elimination of threats"
    ],
    "quick_rules": [
      "If gate.line involves predator scanning, loyalty enforcement, or survival through dominance, this is a strong match.",
      "If gate.line involves emotional safety, nervous system soothing, or caretaking, that's Pleiades, not Draco.",
      "If gate.line involves spiritual initiation or sacred knowledge transmission, that's Sirius, not Draco."
    ]
  }
}
```

**Per-Batch Mapping File** (`draco-batch4.json`)
```json
{
  "44.4": {
    "weight": 0.85,
    "alignment_type": "core",
    "why": "Loyalty enforcement and access control align with Draco's survival-through-dominance archetype."
  },
  "44.5": {
    "weight": 0.20,
    "alignment_type": "none",
    "why": "Collaborative resource sharing does not match Draco's hierarchical control pattern."
  }
}
```

### Output Data Structure

**Final Mapping File** (`gateLine_star_map.json`)
```json
{
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

## Data Models

### Scoring Algorithm

**Input**: Gate.line behavioral data + Star system mapping_digest

**Process**:
1. **Core Alignment Check**
   - Compare gate.line `behavioral_axis` + `keywords` to star system `core_themes`
   - Look for semantic overlap in behavioral patterns
   - Weight: 0.7-1.0 for strong match, 0.4-0.6 for moderate, 0.0-0.3 for weak

2. **Shadow Alignment Check**
   - Compare gate.line `shadow_axis` + `keywords` to star system `shadow_themes`
   - Identify distorted/control expressions
   - Weight: 0.7-1.0 for strong match, 0.4-0.6 for moderate, 0.0-0.3 for weak

3. **Disambiguation via Quick Rules**
   - Apply `quick_rules` to break ties
   - Prevent cross-system contamination
   - Adjust weight down if quick_rules indicate mismatch

4. **Alignment Type Assignment**
   - "core": Matches healthy/gift expression (behavioral_axis → core_themes)
   - "shadow": Matches distorted expression (shadow_axis → shadow_themes)
   - "none": No significant match (weight < 0.3)

**Output**: Weight (0.0-1.0), alignment_type, behavioral rationale

### Merge Algorithm

**Input**: 56 per-batch mapping files (8 systems × 7 batches)

**Process**:
1. Initialize empty object: `finalMap = {}`
2. For each mapping file:
   - Extract star_system from filename
   - Parse JSON
   - For each gate.line in file:
     - If weight > 0.0:
       - Append to `finalMap[gateLineId]` array
3. Sort each gate.line's array by weight (descending)
4. Write pretty-printed JSON

**Output**: `gateLine_star_map.json`

## Error Handling

### File I/O Errors
- **Missing input file**: Log error, skip that batch, document in tasks.md
- **Invalid JSON**: Log parse error, skip file, document in tasks.md
- **Write failure**: Retry once, then fail with clear error message

### Data Validation Errors
- **Missing required field**: Log warning, use empty array/default value
- **Invalid weight**: Clamp to 0.0-1.0 range, log warning
- **Duplicate gate.line**: Keep first occurrence, log warning

### QC Failures
- **Missing gate.lines**: List missing IDs in tasks.md, mark QC as incomplete
- **Empty arrays**: List gate.lines with no alignments, investigate manually
- **Invalid weights**: List offending entries, fix before merge

## Testing Strategy

### Unit Testing (Manual Validation)

**Test 1: Mapping Digest Generation**
- Input: Draco baseline JSON
- Expected: mapping_digest with core_themes including "dominance hierarchy", shadow_themes including "paranoid control", quick_rules differentiating from Pleiades/Sirius
- Validation: Manual review of generated mapping_digest

**Test 2: Per-Batch Scoring**
- Input: Draco mapping_digest + gate-line-1.json
- Expected: Gate 19.x (caretaking) → low weight, Gate 32.x (survival continuity) → high weight
- Validation: Spot-check 5-10 gate.lines per batch

**Test 3: Merge Logic**
- Input: 2 sample batch files (draco-batch1.json, pleiades-batch1.json)
- Expected: Each gate.line has array with both systems (if weight > 0)
- Validation: Verify structure and no duplicates

### Integration Testing

**Test 4: End-to-End Pipeline**
- Input: All 8 star system baselines + all 7 gate-line batches
- Expected: gateLine_star_map.json with 384 gate.lines (64 gates × 6 lines)
- Validation: QC checklist (coverage, consistency, sanity checks)

### Sanity Checks (Archetypal Expectations)

**Gate 19.x** (Need sensitivity, bonding, caretaking panic)
- Expected: Pleiades core (high weight), Arcturus core (moderate), Draco core (low/none)

**Gate 44.x** (Loyalty enforcement, predator scanning, access control)
- Expected: Draco core (high weight), Orion-Dark shadow (moderate), Pleiades core (low/none)

**Gate 54.x** (Ambition through ordeal, spiritual ascent)
- Expected: Orion-Light core (high), Sirius core (high), Draco shadow (moderate if power-climb)

**Gate 27.x** (Caregiver, feeding, keeping everyone alive)
- Expected: Pleiades core (high), Arcturus core (moderate), Draco core (low/none)

**Gate 32.x** (Loyalty, preserving the line, survival continuity, fear of collapse)
- Expected: Draco core (high), Orion-Dark core (moderate), Pleiades shadow (low)

## Implementation Notes

### Automation Strategy

This pipeline will be executed as a single autonomous agent run. The agent will:
1. Create tasks.md
2. Generate mapping_digest for all 8 star systems
3. Generate 56 per-batch mapping files
4. Merge into gateLine_star_map.json
5. Run QC validation
6. Update tasks.md with STATUS

### Behavioral Language Guidelines

**DO use**:
- Psychological motivations (fear, desire, need)
- Relational patterns (bonding, hierarchy, collaboration)
- Functional roles (caretaker, enforcer, initiator, healer)
- Behavioral verbs (scanning, soothing, enforcing, transmitting)

**DO NOT use**:
- Cosmogenesis lore (Atlantis, Lemuria, galactic wars)
- Channeled text quotes
- Copyrighted long passages
- Mystical/esoteric jargon without behavioral translation

### Disambiguation Logic

**Pleiades vs Arcturus**
- Pleiades: Emotional co-regulation, nervous system soothing, caretaking
- Arcturus: Energetic calibration, frequency tuning, healing modalities

**Draco vs Orion-Dark**
- Draco: Survival through dominance, predator scanning, loyalty enforcement
- Orion-Dark: Empire control, hierarchical power structures, shadow work

**Sirius vs Orion-Light**
- Sirius: Spiritual initiation, sacred knowledge transmission, high-order liberation
- Orion-Light: Honorable trial, mystery schools, wisdom keepers

### File Organization

```
lore-research/research-outputs/
├── star-systems/v4.2/
│   ├── andromeda-baseline-4.2.json (updated with mapping_digest)
│   ├── arcturus-baseline-4.2.json (updated)
│   ├── draco-baseline-4.2.json (updated)
│   ├── lyra-baseline-4.2.json (updated)
│   ├── orion-dark-baseline-4.2.json (updated)
│   ├── orion-light-baseline-4.2.json (updated)
│   ├── pleiades-baseline-4.2.json (updated)
│   └── sirius-baseline-4.2.json (updated)
├── gate-line-API-call/
│   ├── gate-line-1.json (input)
│   ├── gate-line-2.json (input)
│   ├── gate-line-3.json (input)
│   ├── gate-line-4.json (input)
│   ├── gate-line-5.json (input)
│   ├── gate-line-6.json (input)
│   └── gate-line-7.json (input)
├── star-mapping-drafts/ (new directory)
│   ├── andromeda-batch1.json
│   ├── andromeda-batch2.json
│   ├── ... (56 files total)
│   └── sirius-batch7.json
└── gateLine_star_map.json (final output)
```

### Performance Considerations

- **File count**: 56 intermediate files + 1 final file
- **JSON size**: gateLine_star_map.json estimated at 200-400 KB
- **Processing time**: Estimated 5-10 minutes for full pipeline
- **Memory**: All files fit in memory (< 10 MB total)

### Versioning Strategy

- Star system baselines remain at v4.2
- gateLine_star_map.json is v1.0 (first generation)
- Future updates will increment version in filename (gateLine_star_map_v1.1.json)
- tasks.md documents version and generation timestamp

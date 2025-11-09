# Gate/Hexagram Star System Scoring - Requirements v1.1

## Overview

Generate deterministic star system weights for all 384 gate.line combinations (64 gates × 6 lines) by scoring Human Design Line Companion text and I Ching Legge text against 8 star system baselines.

## Goals

1. **Deterministic Scoring**: Same inputs always produce same weights (locked with baseline checksum)
2. **Academic Rigor**: Evidence-based weights with proper source citations
3. **Full Context**: Score using complete text, not compressed summaries
4. **Audit Trail**: Evidence files show "receipts" for scoring decisions
5. **Runtime Ready**: Output format matches existing scorer expectations
6. **Mechanical Precision**: Hard invariants prevent model drift and ensure reproducibility

## Inputs

### Source Files (Per Gate)
- `claude/Full Pass/gate-{N}-full.json` - Complete Line Companion text for all 6 lines
- `claude/I-Ching-Full-Pass/hexagram-{N}.json` - Complete Legge I Ching text for all 6 lines
- `claude/combined-baselines-4.2.json` - 8 star system baselines with themes + quick_rules

### Baseline Systems (8 Total)
1. Pleiades - Emotional co-regulation, caretaking, nervous system soothing
2. Sirius - Spiritual initiation, liberation teaching, sacred instruction
3. Lyra - Artistic creation, aesthetic power, beauty/enchantment
4. Andromeda - Breaking chains, freeing captives, anti-domination
5. Orion Light - Honorable trial, warrior initiation, mystery schools
6. Orion Dark - Empire control, coercive structures, obedience enforcement
7. Arcturus - Frequency healing, vibrational calibration, energetic repair
8. Draco - Predator scanning, loyalty enforcement, survival through dominance

## Outputs

### Per Gate (2 Files)

#### 1. Weights File: `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`

**Schema**:
```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "8485865f",
    "gate": "01",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5",
    "sum_unorm": 1.87
  },
  "01.1": [
    {
      "star_system": "Lyra",
      "weight": 0.78,
      "alignment_type": "core",
      "confidence": 5,
      "keywords": ["waits", "incubates", "doesn't force"],
      "behavioral_match": "Patient timing; private incubation; no premature display.",
      "why": "Lyra core — creative expression held until ripe (quick_rule: artistic creation, aesthetic power)."
    }
  ],
  "01.2": [
    {
      "star_system": "Orion Light",
      "weight": 0.75,
      "alignment_type": "core",
      "confidence": 5,
      "keywords": ["called out", "meets ally", "shows work"],
      "behavioral_match": "Emerges to meet worthy mentor; accepts guidance.",
      "why": "Orion-Light core — honorable initiation through ordeal/mentor (quick_rule: trial/initiation)."
    },
    {
      "star_system": "Sirius",
      "weight": 0.25,
      "alignment_type": "secondary",
      "confidence": 3,
      "keywords": ["teacher", "instruction"],
      "behavioral_match": "Touches sacred instruction aspect.",
      "why": "Sirius secondary — liberation via teaching (quick_rule: sacred knowledge transmission)."
    }
  ]
}
```

**Requirements**:
- `_meta` block with baseline_beacon (sha256 first 8 chars of combined-baselines-4.2.json)
- Max 2 systems per line (top-2 only, rest must be 0.0)
- Weights are multiples of 0.01
- Unnormalized weights (scorer handles normalization)
- Keys sorted ascending ("01.1", "01.2", ...)
- Systems within each line sorted by weight desc

#### 2. Evidence File: `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`

**Schema**:
```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "8485865f",
    "gate": "01",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5"
  },
  "01.2": [
    {
      "star_system": "Orion Light",
      "sources": {
        "legge1899": {
          "quote": "the dragon appearing in the field; it will be advantageous to see the great man",
          "locator": "Hex 1, Line 2",
          "attribution": "Legge 1899"
        },
        "line_companion": {
          "quote": "Time is everything. You have to wait for it.",
          "locator": "Gate 1, Line 1",
          "attribution": "Ra Uru Hu (LC)"
        }
      },
      "atoms": {
        "hd_keywords": ["answers a call", "meets ally", "shows work"],
        "ic_atoms": ["appearing", "meeting the great man"]
      },
      "why_cited": "Emergence + meeting the great one = initiation/ordeal pattern (Orion-Light quick_rule).",
      "alignment_type": "core"
    }
  ]
}
```

**Requirements**:
- Only includes lines with weight >0.0
- All quotes verbatim, ≤25 words
- Keys sorted ascending

## Scoring Rules

### Weight Ranges
- **Strong**: 0.70-0.95 (clear, direct match to core themes)
- **Moderate**: 0.40-0.65 (partial match or secondary alignment)
- **Minor**: 0.20-0.35 (tangential connection)
- **None**: 0.0 (no match)
- **Precision**: Weights must be multiples of 0.01

### Top-2 Constraint
**HARD RULE**: Maximum 2 systems with weight >0.0 per line.
- All other systems must be exactly 0.0
- Forces model to make clear choices
- Prevents "mud" (everything scores a little)

### Alignment Types
- **core**: Healthy expression of star system archetype
- **shadow**: Distorted/unhealthy expression
- **secondary**: Weaker/supporting alignment (for 2nd system in top-2)

### Pairwise Exclusion Rules (HARD INVARIANTS)

These are mechanical rules the model MUST obey:

1. **Pleiades ⊕ Draco**: If Pleiades >0 then Draco =0 (unless text clearly shows BOTH care+enforcement; if both, keep ONE >0 using quick_rules)
2. **Sirius vs Orion-Light**: If Sirius >0.6 then Orion-Light ≤0.35 (teaching vs ordeal)
3. **Andromeda ⊕ Orion-Dark**: If Andromeda >0.6 then Orion-Dark =0 (liberator vs captor)
4. **Arcturus ⊕ Pleiades**: If Arcturus >0 then Pleiades =0 (frequency medicine ≠ emotional mothering)
5. **Lyra ⊕ Draco**: If Lyra >0 then Draco =0 (aesthetic prestige ≠ dominance enforcement)
6. **Orion-Light vs Orion-Dark**: If both match, down-rank one to ≤0.35 or set to 0 using quick_rules

### Disambiguation Rules (from quick_rules)
- Pleiades: emotional care, caretaking, nervous system soothing
- Draco: predator scanning, loyalty enforcement, survival dominance
- Sirius: liberation teaching, sacred instruction, spiritual initiation
- Orion-Light: honorable trial, warrior ordeal, mystery schools
- Andromeda: chain-breaking, freeing captives, anti-domination
- Orion-Dark: empire control, coercive structures, obedience enforcement
- Arcturus: frequency healing, vibrational calibration, energetic repair
- Lyra: artistic creation, aesthetic power, beauty/enchantment

## Critical Constraints

### Semantic Ordering
**MUST score using full text BEFORE extracting evidence**
- Phase 1: Read complete Line Companion + Legge text → assign weights
- Phase 2: Extract quotes/keywords that justify Phase 1 weights
- Evidence explains the decision, does not constrain it

### Evidence Gating (MECHANICAL RULE)
- Any weight **>0.50** MUST have a Legge quote for that same line
- If no Legge quote exists, cap weight at **0.50**
- This prevents over-scoring without textual support

### No Invented Text
- All quotes must be verbatim from source files
- No paraphrasing, summarizing, or "close enough" quotes
- Quotes must be ≤25 words (HARD LIMIT)

### Academic Standards
- Every weight >0.0 must cite specific baseline theme or quick_rule
- "why" field must include exact quick_rule phrase in quotes (paraphrase rest)
- Confidence levels (1-5) based on text clarity:
  - 5: Direct match of multiple core themes + exact quick_rule + Legge imagery
  - 4: Strong match of ≥1 core theme + clear Legge support
  - 3: Partial alignment; one core theme or two minor motifs
  - 2: Weak; mostly adjacent language
  - 1: Speculative (avoid emitting >0 with confidence 1-2)
- Source attribution for all quotes

### Determinism & Locking
- Every output file MUST include `_meta` block with:
  - `baseline_beacon`: sha256 first 8 chars of combined-baselines-4.2.json
  - `version`: "4.2"
  - `gate`: zero-padded gate number
  - `generated_at`: ISO8601 timestamp
  - `generator`: "GPT-5" or "Claude"
  - `sum_unorm`: sum of unnormalized weights (optional but recommended)
- CI MUST fail if baseline_beacon doesn't match locked value

### Sorting & Stability
- Keys must be "NN.L" format, sorted ascending
- For each line, sort systems by weight desc, then by canonical order to break ties
- Canonical system order: ["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]

## Failure Conditions (ABORT IMMEDIATELY)

The model MUST abort with error message if:

1. **Missing Files**: Any required file missing or baseline doesn't include all 8 systems
   - Output: `"AUDIT FAILED: {reason}"`
2. **Quote Length**: Any quote >25 words
   - Output: `"ERROR: Quote exceeds 25 words in {gate}.{line}"`
3. **Top-2 Violation**: More than 2 systems have weight >0 for any line
   - Output: `"ERROR: More than 2 systems scored for {gate}.{line}"`
4. **Pairwise Violation**: Exclusion rules violated
   - Output: `"ERROR: Pairwise exclusion violated: {system1} and {system2} in {gate}.{line}"`
5. **Missing Legge Quote**: Weight >0.50 without Legge quote
   - Output: `"ERROR: Weight >0.50 requires Legge quote for {gate}.{line}"`

## Success Criteria

1. All 64 gates processed (384 lines total)
2. All files include valid `_meta` block with correct baseline_beacon
3. Max 2 systems per line with weight >0.0
4. All pairwise exclusion rules enforced
5. Evidence files provide audit trail for all non-zero weights
6. Weights are reproducible (same inputs → same outputs)
7. No invented quotes or unsupported claims
8. All quotes ≤25 words
9. Keys sorted ascending, systems sorted by weight desc

## Runtime Interface

The runtime `scorer.ts` will:
- Verify `_meta.baseline_beacon` matches expected value
- Enforce top-2 & thresholds (should already be true from generation)
- Normalize weights to sum ≤1.0
- Log any violations (CI fail)

## Non-Goals (Out of Scope)

- Weight normalization (handled by runtime scorer)
- Threshold enforcement (handled by runtime scorer)
- Planetary weighting & house/angle multipliers (handled in chart-scorer phase)
- Merging into master file (separate task)
- UI integration (separate task)
- Validation scripts (separate task)

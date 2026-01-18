# Design Document

## Overview

The Gate/Hexagram Star System Scoring system generates deterministic, evidence-based weights mapping 384 gate.line combinations to 8 star system archetypes. The design follows a three-phase process within a single LLM call: (1) score using complete texts, (2) extract evidence to justify scores, and (3) generate structured output files. This approach ensures academic rigor while maintaining computational efficiency.

## Architecture

### Three-Phase Processing Pipeline

```
Input Files → Phase 1: Weight Assignment → Phase 2: Evidence Extraction → Phase 3: Output Generation
```

**Key Architectural Principle**: Score first using full context, then extract evidence. Evidence explains decisions but does not constrain them.

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Input Layer                              │
│  • combined-baselines-4.2.json (8 star systems)             │
│  • gate-{N}-full.json (Line Companion text)                 │
│  • hexagram-{N}.json (Legge I Ching text)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Phase 1: Scoring Engine                     │
│  • Read complete texts for all 6 lines                      │
│  • Match behaviors against 8 system baselines               │
│  • Apply pairwise exclusion rules                           │
│  • Select top-2 systems per line                            │
│  • Assign weights (0.0-0.95, multiples of 0.01)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Phase 2: Evidence Extractor                     │
│  • Extract verbatim quotes (≤25 words)                      │
│  • Identify keywords from sources                           │
│  • Assign confidence levels (1-5)                           │
│  • Generate justification text                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Phase 3: Output Generator                       │
│  • Format weight files with _meta block                     │
│  • Format evidence files with source citations             │
│  • Validate against schemas                                 │
│  • Write to GPT-5/star-maps/ and GPT-5/evidence/           │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Phase 1: Weight Assignment Engine

**Inputs:**
- Complete Line Companion text for lines N.1 through N.6
- Complete Legge I Ching text for lines N.1 through N.6
- 8 star system baselines (core_themes, shadow_themes, quick_rules)

**Processing Logic:**
```
For each line (N.1 through N.6):
  Initialize scores array for 8 systems
  
  For each star system:
    1. Match line behaviors against core_themes
    2. Match shadow behaviors against shadow_themes
    3. Apply quick_rules for disambiguation
    4. Assign preliminary weight (0.0-0.95)
    5. Determine role (primary for highest weight, secondary for second system)
    6. Determine polarity (core for healthy signature, shadow for growth-edge/under stress)
    7. Generate "why" text citing baseline themes
  
  After scoring all 8 systems:
    7. Sort systems by weight descending
    8. Keep top 1-2 systems with weight >0
    9. Set all other systems to exactly 0.00
    10. Verify pairwise exclusion rules
    11. Adjust weights if rules violated
```

**Weight Calibration Scale:**
- **0.85-0.95**: Direct quote from source matches core theme verbatim
- **0.70-0.80**: Clear behavioral match to core theme
- **0.55-0.65**: Moderate match, some interpretation required
- **0.40-0.50**: Weak match, tangential connection
- **0.25-0.35**: Very minor connection
- **0.0**: No match

**Outputs:**
- Weight assignments for each line (stored in memory for Phase 2)
- Role assignments (primary/secondary) indicating priority/strength
- Polarity assignments (core/shadow) indicating expression/valence
- Preliminary "why" justifications

### Phase 2: Evidence Extraction Engine

**Inputs:**
- Weight assignments from Phase 1
- Original source texts (Line Companion, Legge)

**Processing Logic:**
```
For each line with non-zero weights:
  For each system with weight >0:
    1. Locate supporting text in Legge source (MUST be from same line number)
    2. Extract verbatim quote (≤25 words)
    3. Locate supporting text in Line Companion (may be from any line in gate)
    4. Extract verbatim quote (≤25 words)
    5. Identify 2-4 keywords from each source
    6. Assign confidence level (1-5)
    7. Verify Legge quote exists from same line if weight >0.50
```

**Quote Selection Criteria:**
- Must be verbatim (no paraphrasing)
- Must be ≤25 words
- Must directly support assigned weight
- Prefer quotes matching baseline themes
- If no suitable quote exists, select different sentence

**Confidence Level Assignment:**
- **5**: Direct textual match to baseline theme + Legge imagery
- **4**: Clear behavioral match with strong textual support
- **3**: Moderate match, some interpretation needed
- **2**: Weak match, requires inference
- **1**: Very tenuous connection (avoid emitting)

**Outputs:**
- Verbatim quotes with source attribution
- Keywords arrays
- Confidence levels
- Enhanced "why" justifications

### Phase 3: Output Generation Engine

**Inputs:**
- Weight assignments from Phase 1
- Evidence data from Phase 2
- Baseline beacon (SHA256 hash)

**Processing Logic:**
```
1. Compute baseline_beacon from combined-baselines-4.2.json
2. Generate _meta block with:
   - version: "4.2"
   - baseline_beacon: computed hash
   - gate: zero-padded gate number
   - generated_at: ISO8601 timestamp
   - generator: "GPT-5" or "Claude"
   - sum_unorm: sum of all weights
3. Format weight file:
   - Sort lines ascending ("01.1", "01.2", ...)
   - Sort systems by weight descending within each line
   - Use canonical system names
4. Format evidence file:
   - Include only lines with weight >0
   - Provide source citations
   - Include keywords and confidence
5. Validate against schemas
6. Write files to disk
```

**Outputs:**
- `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
- `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`

## Data Models

### Weight File Schema

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "${BEACON}",
    "gate": "01",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5",
    "sum_unorm": 1.87
  },
  "01.1": [
    {
      "star_system": "Lyra",
      "weight": 0.78,
      "role": "primary",
      "polarity": "core",
      "confidence": 5,
      "behavioral_match": "Patient timing; private incubation; no premature display.",
      "keywords": ["waits", "incubates", "doesn't force"],
      "why": "Lyra core — creative expression held until ripe (quick_rule: 'artistic creation, aesthetic power')."
    }
  ],
  "01.2": [
    {
      "star_system": "Orion Light",
      "weight": 0.75,
      "role": "primary",
      "polarity": "core",
      "confidence": 5,
      "behavioral_match": "Emerges to meet worthy mentor; accepts guidance.",
      "keywords": ["called out", "meets ally", "shows work"],
      "why": "Orion-Light core — honorable initiation through ordeal/mentor (quick_rule: 'trial/initiation')."
    },
    {
      "star_system": "Sirius",
      "weight": 0.25,
      "role": "secondary",
      "polarity": "core",
      "confidence": 3,
      "behavioral_match": "Touches sacred instruction aspect.",
      "keywords": ["teacher", "instruction"],
      "why": "Sirius secondary — liberation via teaching (quick_rule: 'sacred knowledge transmission')."
    }
  ]
}
```

### Evidence File Schema

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
      "polarity": "core",
      "confidence": 5
    }
  ]
}
```

### Pairwise Exclusion Rules

**Implementation as Decision Matrix:**

| System A | System B | Rule | Action |
|----------|----------|------|--------|
| Pleiades | Draco | Mutual exclusion | If Pleiades >0 then Draco =0 |
| Sirius | Orion Light | Threshold cap | If Sirius ≥0.60 then Orion Light ≤0.35 |
| Andromeda | Orion Dark | Mutual exclusion | If Andromeda ≥0.60 then Orion Dark =0 |
| Arcturus | Pleiades | Mutual exclusion | If Arcturus >0 then Pleiades =0 |
| Lyra | Draco | Mutual exclusion | If Lyra >0 then Draco =0 |
| Orion Light | Orion Dark | Down-rank | If both match, down-rank one to ≤0.35 or set to 0 |

**Disambiguation Quick Rules:**

- **Pleiades**: Emotional co-regulation, caretaking, nervous system soothing
- **Sirius**: Spiritual initiation, liberation teaching, sacred instruction
- **Lyra**: Artistic creation, aesthetic power, beauty/enchantment
- **Andromeda**: Breaking chains, freeing captives, anti-domination
- **Orion Light**: Honorable trial, warrior initiation, mystery schools
- **Orion Dark**: Empire control, coercive structures, obedience enforcement
- **Arcturus**: Frequency healing, vibrational calibration, energetic repair
- **Draco**: Predator scanning, loyalty enforcement, survival through dominance

## Error Handling

### Pre-Flight Validation

**Before processing any gate:**
1. Verify `combined-baselines-4.2.json` exists and contains 8 systems
2. Verify `gate-{N}-full.json` exists
3. Verify `hexagram-{N}.json` exists
4. Compute baseline_beacon and store for output

**Failure Actions:**
- Abort with error message: `"AUDIT FAILED: {reason}"`
- Do not proceed to scoring

### Runtime Validation

**During Phase 1 (Scoring):**
- If more than 2 systems have weight >0: Apply top-2 constraint
- If pairwise exclusion violated: Adjust weights per rules
- If weight >0.95: Cap at 0.95
- If weight <0: Set to 0.0

**During Phase 2 (Evidence):**
- If quote >25 words: Select different sentence
- If no Legge quote and weight >0.50: Cap weight at 0.50
- If quote not verbatim: Reject and select different quote
- If no suitable quote exists: Note in evidence file

**During Phase 3 (Output):**
- Validate JSON structure against schemas
- Verify baseline_beacon matches computed value
- Verify all keys sorted correctly
- Verify canonical system names used

### Post-Generation Validation

**Automated checks (via validation scripts):**
1. JSON schema validation
2. Top-2 constraint enforcement
3. Pairwise exclusion rule compliance
4. Weight range and precision validation
5. Quote length validation (≤25 words)
6. Baseline beacon verification
7. Key sorting validation
8. System name canonicalization
9. Legge quote gating (weight >0.50 requires Legge quote)

**Failure Actions:**
- Fail with specific error message
- Include gate.line and system in error
- Prevent merge to master files

## Testing Strategy

### Unit Testing

**Validation Scripts:**
- `validate_gate_outputs.py`: Schema and constraint validation
- `verify_quotes.py`: Quote verbatim checking and length validation
- `fuzz_invariants.py`: Pairwise exclusion rule testing
- `compute_beacon.py`: Baseline hash computation

**Test Coverage:**
- All pairwise exclusion rules
- Top-2 constraint enforcement
- Weight range and precision
- Quote length limits
- Baseline beacon matching
- Key sorting
- System name canonicalization

### Integration Testing

**Batch Validation:**
- Process gates in batches of 8
- Generate batch validation reports
- Verify non-determinism (same input → same output hash)
- Check cross-gate consistency

**End-to-End Testing:**
- Process Gate 1 as reference
- Compare against existing mappings
- Verify runtime scorer integration
- Test merge script with all 64 gates

### Acceptance Testing

**Success Criteria:**
1. All 64 gates processed without errors
2. All 384 lines have valid weights
3. All validation scripts pass
4. Master files generated successfully
5. Statistics report shows expected distributions
6. CI pipeline passes all checks

## Performance Considerations

### Token Budget per Gate

- **Input tokens**: ~8,000 (baselines + gate text + hexagram text)
- **Output tokens**: ~6,000 (weights + evidence for 6 lines)
- **Total**: ~14,000 tokens per gate
- **Well within limits**: GPT-5 (128K), Claude (200K)

### Processing Efficiency

**Single LLM Call per Gate:**
- Processes all 6 lines in one call
- Maintains context across lines
- Reduces API costs (6x fewer calls)
- Faster than sequential line processing

**Batch Processing:**
- 8 gates per batch
- ~2 hours per batch
- Total: ~16 hours for all 64 gates
- Parallelizable across multiple API keys

### Caching Strategy

**Baseline Caching:**
- Load `combined-baselines-4.2.json` once
- Compute beacon once
- Reuse across all gates

**Validation Caching:**
- Cache schema validators
- Reuse quote verification logic
- Batch validation checks

## File Organization

```
GPT-5/
├── star-maps/
│   ├── gateLine_star_map_Gate01.json
│   ├── gateLine_star_map_Gate02.json
│   └── ... (64 total)
├── evidence/
│   ├── gateLine_evidence_Gate01.json
│   ├── gateLine_evidence_Gate02.json
│   └── ... (64 total)
├── prompts/
│   ├── gate-scoring-prompt-template.md
│   └── gates/
│       ├── gate-01-prompt.md
│       └── ... (64 total)
├── scripts/
│   ├── generate_gate_prompts.py
│   ├── pack_scoring_input.py
│   ├── validate_gate_outputs.py
│   ├── verify_quotes.py
│   ├── fuzz_invariants.py
│   ├── merge_gate_mappings.py
│   └── compute_beacon.py
├── batches/
│   ├── batch-1-validation-report.md
│   └── ... (8 total)
├── schemas/
│   ├── weights.schema.json
│   └── evidence.schema.json
├── combined-baselines-4.2.json
├── gateLine_star_map_MASTER.json
├── gateLine_evidence_MASTER.json
├── VALIDATION_REPORT.md
├── STATISTICS_REPORT.md
├── COMPARISON_REPORT.md
├── README.md
├── METHODOLOGY.md
└── PROMPT_GUIDE.md
```

## Canonical System Names

**EXACT NAMES (case-sensitive):**
```
["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]
```

**Note:** "Orion Light" and "Orion Dark" use **space**, not hyphen. This is enforced in all output files - prose may use hyphens for readability, but JSON outputs must use the canonical names with spaces.

**Canonical Sort Order (for tie-breaking):**
1. Pleiades
2. Sirius
3. Lyra
4. Andromeda
5. Orion Light
6. Orion Dark
7. Arcturus
8. Draco

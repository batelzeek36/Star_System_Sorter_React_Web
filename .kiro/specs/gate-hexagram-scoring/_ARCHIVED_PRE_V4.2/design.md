# Gate/Hexagram Star System Scoring - Design

## Architecture

### Three-Phase Process (Single LLM Call)

```
Input Files → Phase 1: Score → Phase 2: Extract Evidence → Phase 3: Write Outputs
```

**Key Principle**: Score using full text, then extract evidence to justify scores.

## Phase 1: Weight Assignment

### Process
1. Read COMPLETE Line Companion text for line N.L
2. Read COMPLETE Legge I Ching text for line N.L
3. Read all 8 star system baselines (core_themes, shadow_themes, quick_rules)
4. Score each system 0.0-0.95 based on behavioral/thematic match
5. **Keep only top 1-2 systems with weight >0**, set rest to exactly 0.00
6. Store weights in memory for Phase 2

### Scoring Logic
```
For each line (N.1 through N.6):
  For each star system (8 total):
    1. Match line behaviors against system's core_themes
    2. Match line shadow behaviors against system's shadow_themes
    3. Apply quick_rules to prevent confusion
    4. Assign weight based on match strength
    5. Determine alignment_type (core/shadow/secondary)
    6. Write "why" citing specific baseline theme (include exact quick_rule phrase)
  
  After scoring all 8:
    7. Select top 1-2 systems by weight
    8. Set all other systems to exactly 0.00
    9. Verify pairwise exclusion rules
```

### Weight Calibration
- **0.85-0.95**: Direct quote from source matches core theme verbatim
- **0.70-0.80**: Clear behavioral match to core theme
- **0.55-0.65**: Moderate match, some interpretation required
- **0.40-0.50**: Weak match, tangential connection
- **0.25-0.35**: Very minor connection
- **0.0**: No match
- **Precision**: Weights must be multiples of 0.01

### Pairwise Exclusion Rules (HARD INVARIANTS)

These are mechanical rules that MUST be enforced:

1. **Pleiades ⊕ Draco**: If Pleiades >0 then Draco =0 (unless text clearly shows BOTH care+enforcement; if both present, keep ONE >0 using quick_rules)
2. **Sirius vs Orion-Light**: If Sirius ≥0.60 then Orion-Light ≤0.35
3. **Andromeda ⊕ Orion-Dark**: If Andromeda ≥0.60 then Orion-Dark =0
4. **Arcturus ⊕ Pleiades**: If Arcturus >0 then Pleiades =0
5. **Lyra ⊕ Draco**: If Lyra >0 then Draco =0
6. **Orion-Light vs Orion-Dark**: If both match, down-rank one to ≤0.35 or set to 0

### Disambiguation Matrix

| If Text Shows... | Primary System | Apply Rule |
|-----------------|----------------|------------|
| Emotional co-regulation, caretaking | Pleiades | Exclude Draco, Arcturus |
| Spiritual initiation, liberation teaching | Sirius | If ≥0.60, cap Orion-Light at 0.35 |
| Honorable trial, warrior ordeal | Orion-Light | If ≥0.60, exclude Orion-Dark |
| Empire control, coercive structures | Orion-Dark | Exclude Andromeda, Orion-Light |
| Breaking chains, freeing captives | Andromeda | If ≥0.60, exclude Orion-Dark |
| Frequency healing, vibrational work | Arcturus | Exclude Pleiades |
| Artistic creation, aesthetic power | Lyra | Exclude Draco |
| Predator scanning, loyalty enforcement | Draco | Exclude Pleiades, Lyra |

## Phase 2: Evidence Extraction

### Process
1. For each line with weights from Phase 1
2. For each system with weight >0.0:
   - Extract ONE ≤25-word Legge quote supporting the weight
   - Extract ONE ≤25-word Line Companion quote if available
   - Extract 2-4 keywords from each source
   - Assign confidence level (1-5)
3. For systems with weight=0.0: no evidence needed

### Quote Selection Criteria
- Must be verbatim from source (no paraphrasing)
- Must directly support the assigned weight
- Prefer quotes that match baseline themes
- If no quote exists, note in evidence file

### Confidence Levels
- **5**: Direct textual match to baseline theme
- **4**: Clear behavioral match with strong support
- **3**: Moderate match, some interpretation
- **2**: Weak match, requires inference
- **1**: Very tenuous connection

## Phase 3: Output Generation

### Weights File Schema
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
      "behavioral_match": "Patient timing; private incubation; no premature display.",
      "keywords": ["waits", "incubates", "doesn't force"],
      "why": "Lyra core — creative expression held until ripe (quick_rule: 'artistic creation, aesthetic power')."
    }
  ],
  "01.2": [
    {
      "star_system": "Orion Light",
      "weight": 0.75,
      "alignment_type": "core",
      "confidence": 5,
      "behavioral_match": "Emerges to meet worthy mentor; accepts guidance.",
      "keywords": ["called out", "meets ally", "shows work"],
      "why": "Orion-Light core — honorable initiation through ordeal/mentor (quick_rule: 'trial/initiation')."
    },
    {
      "star_system": "Sirius",
      "weight": 0.25,
      "alignment_type": "secondary",
      "confidence": 3,
      "behavioral_match": "Touches sacred instruction aspect.",
      "keywords": ["teacher", "instruction"],
      "why": "Sirius secondary — liberation via teaching (quick_rule: 'sacred knowledge transmission')."
    }
  ],
  ... (6 lines total)
}
```

**Key Changes from Previous Format**:
- `_meta` block at top with baseline_beacon for determinism
- Array format (not object) - only includes top 1-2 systems per line
- System names use proper case: "Orion Light" (not "orion-light")
- Keys are zero-padded: "01.1" (not "1.1")
- Systems sorted by weight desc within each line
- `sum_unorm`: sum of all unnormalized weights across all lines

### Evidence File Schema
```json
[
  {
    "id": "01.1",
    "weighted_systems": {
      "lyra": {
        "weight": 0.85,
        "alignment_type": "core",
        "sources": {
          "legge1899": {
            "quote": "the dragon lying hid (in the deep)",
            "locator": "Hex 1, Line 1",
            "keywords": ["dragon", "hidden", "potential"]
          },
          "line_companion": {
            "quote": "Creation is independent of will",
            "locator": "Gate 1, Line 1",
            "keywords": ["creation", "independent", "unique"]
          }
        },
        "confidence": 5,
        "why": "Pure creative emanation matches 'aesthetic power and artistic enchantment' (Lyra core)."
      },
      "sirius": {
        "weight": 0.15,
        "alignment_type": "core",
        "sources": {
          "legge1899": {
            "quote": "It is not the time for active doing",
            "locator": "Hex 1, Line 1",
            "keywords": ["timing", "waiting", "patience"]
          },
          "line_companion": {
            "quote": "Time is everything. You have to wait for it.",
            "locator": "Gate 1, Line 1",
            "keywords": ["time", "wait", "patience"]
          }
        },
        "confidence": 4,
        "why": "Waiting for right timing aligns with 'timing signal for collective renewal' (Sirius core)."
      }
    },
    "zero_weight_systems": ["pleiades", "andromeda", "orion-light", "orion-dark", "arcturus", "draco"]
  },
  ... (6 lines total)
]
```

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
├── combined-baselines-4.2.json (reference copy)
└── prompts/
    └── gate-scoring-prompt-template.md
```

## Canonical System Names

**EXACT NAMES** (case-sensitive):
```
["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]
```

Note: "Orion Light" and "Orion Dark" use **space**, not hyphen.

## Quality Gates

### Pre-Flight Checks
- Verify all 3 input files exist
- Confirm 8 systems in baselines
- Validate JSON structure

### Post-Generation Checks
- All 6 lines present per gate
- All 8 systems scored per line
- No weights >0.95 or <0.0
- All non-zero weights have evidence
- All quotes are ≤25 words
- No invented text in quotes

## Error Handling

### Missing Source Text
- If Line Companion text missing: use Legge only, note in evidence
- If Legge text missing: FAIL (I Ching is canonical anchor)
- If baseline missing: FAIL (cannot score)

### Ambiguous Matches
- If multiple systems match: keep the best **two** only
- Apply pairwise exclusion rules to break ties
- If no clear match: assign weight=0.0 to all systems (line has no top-2)

### Quote Extraction Failures
- If no suitable quote found: select a different ≤25-word sentence
- If no quote exists at all: cap weight at 0.50
- If quote >25 words: **DO NOT truncate** - select a shorter sentence/phrase instead
- If text is paraphrased: REJECT, must be verbatim

## Validation Strategy

### Automated Checks
1. JSON schema validation
2. `_meta.baseline_beacon` present and correct
3. Weight range validation (0.0-0.95, multiples of 0.01)
4. **Top-2 constraint**: No more than 2 systems with weight >0 per line
5. Quote length validation (≤25 words)
6. System name validation (exact match to canonical names with proper case)
7. Line count validation (exactly 6 per gate)
8. Keys sorted ascending ("01.1", "01.2", ...)
9. Systems sorted by weight desc within each line
10. Pairwise exclusion invariants satisfied
11. `sum_unorm` computed and >0 if any non-zero weights
12. All weights >0.50 have Legge quotes

### Manual Spot Checks
1. Review Gate 1 output against existing `gate-1.json`
2. Verify quick_rules properly prevent confusion
3. Check evidence quotes are verbatim
4. Confirm "why" fields cite baseline themes

## Performance Considerations

### Single LLM Call Per Gate
- Processes all 6 lines in one call
- Reduces API costs
- Maintains context across lines
- Faster than 6 separate calls

### Token Budget
- Input: ~8K tokens (baselines + gate + hexagram)
- Output: ~6K tokens (weights + evidence)
- Total: ~14K tokens per gate
- Well within GPT-5/Claude limits

## Extensibility

### Future Enhancements
- Add line archetype scoring (1-6 themes)
- Include exaltation/detriment planet data
- Cross-reference channel connections
- Add gate-level summary scores
- Generate disagreement reports for ambiguous cases

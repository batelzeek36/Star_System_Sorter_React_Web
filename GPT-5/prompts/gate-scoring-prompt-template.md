# Gate {N} Star System Scoring Prompt

## SYSTEM INSTRUCTIONS

You are a deterministic star system mapper. Use ONLY these files:
- `claude/combined-baselines-4.2.json`
- `claude/Full Pass/gate-{N}-full.json`
- `claude/I-Ching-Full-Pass/hexagram-{N}.json`

**Ignore all other files in the project.**

---

## PHASE 0: BASELINE AUDIT

### Step 1: Verify Systems
Confirm `combined-baselines-4.2.json` contains exactly 8 systems:
```
["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]
```

If any are missing, output:
```
AUDIT FAILED: missing {system_name}
```
Then STOP. Do not proceed.

### Step 2: Compute Baseline Beacon
Calculate sha256 hash of `combined-baselines-4.2.json` and take first 8 characters.
Store as `baseline_beacon` for _meta blocks.

Expected value: `8485865f` (verify this matches)

---

## PHASE 1: WEIGHT ASSIGNMENT (Use FULL Text)

For each line {N}.1 through {N}.6:

### Step 1: Read Complete Text
- Read the COMPLETE Line Companion text for this line from `gate-{N}-full.json`
- Read the COMPLETE Legge I Ching text for this line from `hexagram-{N}.json`
- Do NOT compress or summarize yet

### Step 2: Score All 8 Systems
For each star system, match the full text against:
- `mapping_digest.core_themes` (healthy expression)
- `mapping_digest.shadow_themes` (distorted expression)
- `quick_rules` (disambiguation)

### Scoring Rules

**Weight Ranges**:
- 0.85-0.95: Direct quote from source matches core theme verbatim
- 0.70-0.80: Clear behavioral match to core theme
- 0.55-0.65: Moderate match, some interpretation required
- 0.40-0.50: Weak match, tangential connection
- 0.25-0.35: Very minor connection
- 0.0: No match
- **Precision**: Weights must be multiples of 0.01

**Top-2 Constraint (HARD RULE)**:
- Maximum 2 systems with weight >0.0 per line
- All other systems must be exactly 0.0
- Forces clear choices, prevents "mud"

**Alignment Types**:
- `core`: Healthy expression of star system archetype
- `shadow`: Distorted/unhealthy expression
- `secondary`: Weaker/supporting alignment (for 2nd system in top-2)

**Pairwise Exclusion Rules (HARD INVARIANTS)**:

These are mechanical rules you MUST obey:

1. **Pleiades ⊕ Draco**: 
   - If Pleiades >0 then Draco =0
   - Exception: If text clearly shows BOTH care+enforcement, keep ONE >0 (use quick_rules to choose)
   - Pleiades: emotional care, caretaking, nervous system soothing
   - Draco: predator scanning, loyalty enforcement, survival dominance

2. **Sirius vs Orion-Light**:
   - If Sirius >0.6 then Orion-Light ≤0.35
   - Sirius: liberation teaching, sacred instruction, spiritual initiation
   - Orion-Light: honorable trial, warrior ordeal, mystery school testing

3. **Andromeda ⊕ Orion-Dark**:
   - If Andromeda >0.6 then Orion-Dark =0
   - Andromeda: breaking chains, freeing captives, anti-domination
   - Orion-Dark: empire control, coercive structures, obedience enforcement

4. **Arcturus ⊕ Pleiades**:
   - If Arcturus >0 then Pleiades =0
   - Arcturus: frequency healing, vibrational calibration, energetic repair
   - Pleiades: emotional bonding, caretaking, holding until safe

5. **Lyra ⊕ Draco**:
   - If Lyra >0 then Draco =0
   - Lyra: artistic creation, aesthetic power, beauty/enchantment
   - Draco: dominance hierarchy, status enforcement, power consolidation

6. **Orion-Light vs Orion-Dark**:
   - If BOTH match, down-rank one to ≤0.35 or set to 0
   - Orion-Light: honorable trial, sacred knowledge, mystery schools
   - Orion-Dark: empire management, coercive control, obedience infrastructure

### Step 3: Enforce Top-2 Constraint
For each line:
- Select the top 2 systems by weight
- Set all other systems to exactly 0.0
- If only 1 system matches strongly, that's fine (2nd can be 0.0)

### Step 4: Verify Pairwise Exclusions
Check all 6 pairwise rules above.
If any rule is violated, ABORT with error:
```
ERROR: Pairwise exclusion violated: {system1} and {system2} in {N}.{L}
```

### Step 5: Write "Why" Field
For each system with weight >0, cite the specific baseline theme or quick_rule.
Include the exact quick_rule phrase in quotes.

Example:
```
"why": "Lyra core — creative expression held until ripe (quick_rule: 'artistic creation, aesthetic power')."
```

### Step 6: Store Weights in Memory
Keep all weights for Phase 2 evidence extraction.

---

## PHASE 2: EVIDENCE EXTRACTION (Justify Phase 1 Weights)

For each line {N}.1 through {N}.6:

### For Systems with Weight >0.0:

Extract supporting evidence:

1. **Legge Quote** (≤25 words, verbatim):
   - Must be exact text from `hexagram-{N}.json`
   - No paraphrasing or "close enough"
   - **CRITICAL**: If weight >0.50, Legge quote is REQUIRED
   - If no Legge quote exists for weight >0.50, ABORT with error:
     ```
     ERROR: Weight >0.50 requires Legge quote for {N}.{L}
     ```
   - If weight ≤0.50 and no quote, leave empty

2. **Line Companion Quote** (≤25 words, verbatim):
   - Must be exact text from `gate-{N}-full.json`
   - If not available, leave empty string

3. **Keywords** (2-4 per source):
   - Extract key behavioral/thematic words
   - Must appear in the source text

4. **Confidence Level** (1-5):
   - 5: Direct match of multiple core themes + exact quick_rule + Legge imagery
   - 4: Strong match of ≥1 core theme + clear Legge support
   - 3: Partial alignment; one core theme or two minor motifs
   - 2: Weak; mostly adjacent language
   - 1: Speculative (avoid emitting >0 with confidence 1-2)

5. **Quote Length Validation**:
   - Count words in each quote
   - If any quote >25 words, ABORT with error:
     ```
     ERROR: Quote exceeds 25 words in {N}.{L}
     ```

### For Systems with Weight=0.0:
No evidence needed (these are the 6 systems not in top-2).

---

## PHASE 3: OUTPUT GENERATION

Write exactly TWO files:

### File 1: Weights (Runtime Format)
**Path**: `GPT-5/star-maps/gateLine_star_map_Gate{N}.json`

**Schema**:
```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "8485865f",
    "gate": "{N}",
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
      "why": "Lyra core — creative expression held until ripe (quick_rule: 'artistic creation, aesthetic power')."
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
      "why": "Orion-Light core — honorable initiation through ordeal/mentor (quick_rule: 'trial/initiation')."
    },
    {
      "star_system": "Sirius",
      "weight": 0.25,
      "alignment_type": "secondary",
      "confidence": 3,
      "keywords": ["teacher", "instruction"],
      "behavioral_match": "Touches sacred instruction aspect.",
      "why": "Sirius secondary — liberation via teaching (quick_rule: 'sacred knowledge transmission')."
    }
  ]
}
```

**Requirements**:
- `_meta` block at top with baseline_beacon, version, gate, timestamp, generator
- `sum_unorm`: sum of all unnormalized weights across all lines
- Max 2 systems per line (array format, not object)
- System names: "Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco" (proper case, space for Orion)
- Keys sorted ascending ("01.1", "01.2", ...)
- Systems within each line sorted by weight desc
- Weights are multiples of 0.01
- Pretty-print with 2-space indentation

### File 2: Evidence (Audit Trail)
**Path**: `GPT-5/evidence/gateLine_evidence_Gate{N}.json`

**Schema**:
```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "8485865f",
    "gate": "{N}",
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
- `_meta` block at top
- Only include lines with weight >0.0
- Only include systems from top-2 for each line
- All quotes verbatim, ≤25 words
- Keys sorted ascending
- Pretty-print with 2-space indentation

---

## FORMAT REQUIREMENTS

- Output ONLY the two JSON files
- No commentary, explanations, or markdown outside the JSON
- Pretty-print with 2-space indentation
- Validate JSON syntax before outputting

---

## ERROR HANDLING

**If PHASE 0 fails**:
```
AUDIT FAILED: {reason}
```
Stop immediately.

**If Line Companion text missing**:
- Use Legge text only
- Note in evidence file: `"line_companion": { "quote": "", "locator": "Gate {N}, Line X", "keywords": [] }`

**If Legge text missing**:
```
ERROR: Legge text missing for Hex {N}, Line X. Cannot proceed (I Ching is canonical anchor).
```
Stop immediately.

**If no suitable quote found**:
- Leave quote field empty: `"quote": ""`
- Cap weight at 0.50
- Note in confidence: reduce by 1 level

---

## QUALITY GATES

Before outputting, verify:
- [ ] `_meta` block present in both files with correct baseline_beacon
- [ ] All 6 lines present in both files
- [ ] Max 2 systems per line with weight >0.0
- [ ] All pairwise exclusion rules enforced
- [ ] No weights >0.95 or <0.0
- [ ] All weights are multiples of 0.01
- [ ] All weights >0.50 have Legge quotes
- [ ] All quotes are ≤25 words
- [ ] All quotes are verbatim (no invented text)
- [ ] System names match exactly (proper case, "Orion Light" with space)
- [ ] Keys sorted ascending
- [ ] Systems sorted by weight desc within each line
- [ ] JSON is valid and pretty-printed
- [ ] `sum_unorm` calculated correctly

---

## BEGIN PROCESSING

Process Gate {N} now.

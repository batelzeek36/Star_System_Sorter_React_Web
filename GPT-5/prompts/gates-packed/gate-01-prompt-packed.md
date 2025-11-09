# Gate 1 Star System Scoring Prompt

## SYSTEM INSTRUCTIONS

You are a deterministic star system mapper generating academically rigorous, evidence-based weights for Human Design gate.line combinations.

**Input Files (REQUIRED)**:
- `GPT-5/combined-baselines-4.2.json` - 8 star system baselines with core_themes, shadow_themes, and quick_rules
- `claude/Full Pass/gate-1-full.json` - Complete Line Companion text for all 6 lines (non-padded)
- `claude/I-Ching-Full-Pass/hexagram-01.json` - Complete Legge I Ching text for all 6 lines (zero-padded)

**Critical Rules**:
- Use ONLY these three files for scoring
- Process all 6 lines in a single pass
- Generate both weight and evidence files
- Enforce all constraints mechanically (no exceptions)

---

## PHASE 0: PRE-FLIGHT VALIDATION

### Step 1: Verify Input Files Exist
Confirm all three required files are present:
- [ ] `GPT-5/combined-baselines-4.2.json`
- [ ] `claude/Full Pass/gate-1-full.json` (non-padded gate number)
- [ ] `claude/I-Ching-Full-Pass/hexagram-01.json` (zero-padded hexagram number)

**If ANY file is missing**:
```
AUDIT FAILED: Missing required file {filename}
```
**STOP. Do not proceed.**

### Step 2: Verify System Completeness
Confirm `combined-baselines-4.2.json` contains exactly 8 systems in this order:
```json
["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]
```

**If any system is missing or misspelled**:
```
AUDIT FAILED: System list incomplete or incorrect
```
**STOP. Do not proceed.**

### Step 3: Compute Baseline Beacon
Calculate SHA256 hash of `GPT-5/combined-baselines-4.2.json` and extract first 8 characters.
Store as `baseline_beacon` for use in _meta blocks.

**Current expected value**: `59bfc617`

**Note**: Use the computed beacon value in all output files. If the baseline file has been updated, the beacon will change - this is expected and correct. The beacon serves as a version fingerprint to ensure all gates use the same baseline version.

---

## PHASE 1: WEIGHT ASSIGNMENT

**Objective**: Score all 8 star systems against complete source texts for lines 1.1 through 1.6, then select top-2 systems per line.

### Step 1: Read Complete Source Texts
For each line 1.1 through 1.6:
- Read the **COMPLETE** Line Companion text from `gate-1-full.json`
- Read the **COMPLETE** Legge I Ching text from `hexagram-01.json`
- Do NOT summarize or compress at this stage
- Keep full context in working memory for scoring

### Step 2: Score All 8 Systems Against Full Text
For each line, evaluate all 8 star systems by matching behaviors against:
- `mapping_digest.core_themes` - Healthy/aligned expression of archetype
- `mapping_digest.shadow_themes` - Distorted/unhealthy expression of archetype
- `quick_rules` - Disambiguation rules for edge cases and overlaps

**Weight Calibration Scale**:
- **0.85-0.95**: Direct verbatim quote from source matches core theme exactly
- **0.70-0.80**: Clear behavioral match to core theme with strong textual support
- **0.55-0.65**: Moderate match requiring some interpretation
- **0.40-0.50**: Weak match with tangential connection
- **0.25-0.35**: Very minor connection or adjacent theme
- **0.00**: No match or explicitly contradicts system archetype

**Precision Requirement**: All weights MUST be multiples of 0.01 (e.g., 0.75, 0.62, 0.48)

### Step 3: Assign Role and Polarity
For each system with preliminary weight >0:

**Role** (indicates strength/priority):
- `primary`: Highest weight system for this line (strongest match)
- `secondary`: Second-highest weight system (supporting/complementary match)

**Polarity** (indicates expression/valence):
- `core`: Healthy, aligned expression of the star system archetype
- `shadow`: Distorted, unhealthy, or growth-edge expression of the archetype

**IMPORTANT**: Role and polarity are independent:
- A system can be `role: "secondary"` with `polarity: "core"` (2nd-ranked, healthy expression)
- A system can be `role: "secondary"` with `polarity: "shadow"` (2nd-ranked, distorted expression)
- The "why" field should always reference the **polarity** (e.g., "Sirius core —" or "Draco shadow —"), NOT the role

### Step 4: Enforce Top-2 Constraint (HARD RULE)
**CRITICAL**: Maximum 2 systems with weight >0.0 per line.

For each line:
1. Sort all 8 systems by weight (descending)
2. Keep top 2 systems (or top 1 if only one strong match)
3. Set all other systems to exactly **0.00**
4. If weights are tied, use canonical system order to break ties:
   ```
   1. Pleiades
   2. Sirius
   3. Lyra
   4. Andromeda
   5. Orion Light
   6. Orion Dark
   7. Arcturus
   8. Draco
   ```

**This constraint is NON-NEGOTIABLE**. It prevents "mud" (everything scores a little) and forces clear archetypal distinctions.

### Step 5: Apply Pairwise Exclusion Rules (HARD INVARIANTS)

**These rules are MECHANICAL and MANDATORY**. They prevent archetypal contradictions.

Apply in order after selecting top-2 systems:

#### Rule 1: Pleiades ⊕ Draco (Mutual Exclusion)
```
IF Pleiades weight >0 THEN Draco weight = 0
```
**Rationale**: Pleiades = emotional care/nurturing; Draco = dominance/enforcement. Archetypally incompatible.

**Exception**: If text clearly shows BOTH care AND enforcement, use quick_rules to choose ONE. Keep only the stronger match.

**Quick Rule Disambiguation**:
- Pleiades: "emotional co-regulation, nervous system soothing, caretaking panic, feeding/nurturing"
- Draco: "predator scanning, loyalty enforcement, survival through dominance"

#### Rule 2: Sirius vs Orion Light (Threshold Cap)
```
IF Sirius weight ≥0.60 THEN Orion Light weight ≤0.35
```
**Rationale**: Both involve spiritual teaching, but Sirius = liberation/freedom, Orion Light = ordeal/testing. High Sirius dominates.

**Quick Rule Disambiguation**:
- Sirius: "liberation teaching, sacred instruction, spiritual initiation, path to freedom"
- Orion Light: "honorable trial, warrior ordeal, mystery school testing, earning rank through courage"

#### Rule 3: Andromeda ⊕ Orion Dark (Mutual Exclusion)
```
IF Andromeda weight ≥0.60 THEN Orion Dark weight = 0
```
**Rationale**: Andromeda = anti-domination/liberation; Orion Dark = empire control/coercion. Direct opposites.

**Quick Rule Disambiguation**:
- Andromeda: "breaking chains, freeing captives, anti-domination intervention"
- Orion Dark: "empire control, coercive structures, obedience enforcement, psychological pressure at scale"

#### Rule 4: Arcturus ⊕ Pleiades (Mutual Exclusion)
```
IF Arcturus weight >0 THEN Pleiades weight = 0
```
**Rationale**: Arcturus = frequency/vibrational healing (technical); Pleiades = emotional bonding/nurturing (relational). Different healing modalities.

**Quick Rule Disambiguation**:
- Arcturus: "frequency calibration, vibrational recalibration, energetic repair, dimensional tuning"
- Pleiades: "emotional co-regulation, nervous system soothing, caretaking, holding until safe"

#### Rule 5: Lyra ⊕ Draco (Mutual Exclusion)
```
IF Lyra weight >0 THEN Draco weight = 0
```
**Rationale**: Lyra = artistic creation/beauty; Draco = dominance hierarchy/power. Incompatible value systems.

**Quick Rule Disambiguation**:
- Lyra: "artistic creation, aesthetic power, beauty/enchantment, creative expression"
- Draco: "dominance hierarchy, status enforcement, power consolidation, loyalty control"

#### Rule 6: Orion Light vs Orion Dark (Down-Rank or Exclude)
```
IF BOTH Orion Light >0 AND Orion Dark >0 THEN down-rank one to ≤0.35 OR set to 0
```
**Rationale**: Both are Orion factions but opposite polarities. Rarely co-occur in same line.

**Quick Rule Disambiguation**:
- Orion Light: "honorable trial, sacred knowledge, mystery schools, warrior initiation"
- Orion Dark: "empire management, coercive control, obedience infrastructure, service-to-self"

**Use quick_rules to determine which Orion faction is stronger match, then down-rank or eliminate the other.**

### Step 6: Verify Pairwise Exclusion Compliance
After applying all 6 rules, verify no violations remain.

**If any rule is violated**:
```
ERROR: Pairwise exclusion violated: {system1} and {system2} in line 1.{L}
Rule: {rule_description}
```
**STOP. Do not proceed to Phase 2.**

### Step 7: Generate "Why" Justifications
For each system with weight >0, write a concise justification citing:
- Specific baseline theme (core or shadow)
- Relevant quick_rule (in quotes)
- Brief behavioral match description

**Format**:
```
"{System} {polarity} — {behavioral_match} (quick_rule: '{exact_quick_rule_phrase}')."
```

**Example**:
```
"Lyra core — creative expression held until ripe (quick_rule: 'artistic creation, aesthetic power')."
```

### Step 8: Store Weights in Memory
Retain all weight assignments, roles, polarities, and justifications for Phase 2 evidence extraction.

---

## PHASE 2: EVIDENCE EXTRACTION

**Objective**: Extract verbatim quotes and supporting evidence to justify Phase 1 weight assignments.

**Scope**: Only extract evidence for systems with weight >0 (top-2 per line). Systems with weight=0 require no evidence.

### For Each Line with Non-Zero Weights:

#### Step 1: Extract Legge I Ching Quote (≤25 words, verbatim)
**Source**: `hexagram-01.json`, same line number as gate.line

**Requirements**:
- Must be **exact verbatim text** (no paraphrasing, no "close enough")
- Must be **≤25 words** (count carefully)
- Must be from the **same line number** (e.g., for gate 01.3, use hexagram 1, line 3)

**CRITICAL GATING RULE**:
```
IF weight >0.50 THEN Legge quote from same line is REQUIRED
```

**If weight >0.50 and no suitable Legge quote exists**:
- Cap the weight to exactly **0.50**
- Add a note in the "why" field: "(capped: no Legge anchor)"
- Continue processing remaining systems
- Do NOT stop the entire gate processing

**If weight ≤0.50 and no suitable quote**: Leave quote field empty (`""`)

#### Step 2: Extract Line Companion Quote (≤25 words, verbatim)
**Source**: `gate-1-full.json`, any line within the gate (line-agnostic)

**Requirements**:
- Must be **exact verbatim text** (no paraphrasing)
- Must be **≤25 words**
- May be from **any line** within the gate (not restricted to same line number)

**If no suitable quote exists**: Leave quote field empty (`""`)

#### Step 3: Extract Keywords (2-4 by default; up to 6 when warranted)
**From Legge text**: Identify 2-4 key thematic/behavioral words (up to 6 if the text contains distinct, verbatim-supported motifs)
**From Line Companion text**: Identify 2-4 key thematic/behavioral words (up to 6 if the text contains distinct, verbatim-supported motifs)

**Requirements**:
- Keywords must **actually appear** in the source text (no invented terms)
- Focus on behavioral descriptors, archetypal themes, or action verbs
- Avoid generic words like "the", "and", "is"
- **Default to 2-4 keywords** for focused signal
- **Use 5-6 keywords only when** the source text contains multiple distinct motifs that each warrant inclusion
- Prioritize quality over quantity

#### Step 4: Assign Confidence Level (1-5)
Rate the strength of textual evidence supporting the weight:

- **5**: Direct match of multiple core themes + exact quick_rule + strong Legge imagery
- **4**: Strong match of ≥1 core theme + clear Legge support
- **3**: Partial alignment; one core theme or two minor motifs
- **2**: Weak; mostly adjacent language or inference required
- **1**: Speculative (avoid assigning weight >0 with confidence 1-2)

#### Step 5: Validate Quote Lengths
For each extracted quote:
1. Count words (split on whitespace)
2. If any quote >25 words:
   ```
   ERROR: Quote exceeds 25 words in 1.{L} for {system}
   Quote: "{quote_text}"
   Word count: {count}
   ```
   **STOP. Do not proceed.**

#### Step 6: Verify Quote Verbatim Accuracy
- Compare extracted quotes character-by-character against source files
- No paraphrasing, summarizing, or "close enough" matches
- If quote is not verbatim, select a different sentence or leave empty

### For Systems with Weight=0.0:
**No evidence extraction needed**. These are the 6 systems excluded by top-2 constraint.

---

## PHASE 3: OUTPUT GENERATION

**Objective**: Generate two JSON files with proper structure, metadata, and formatting.

### File 1: Weight File (Runtime Scorer Format)
**Path**: `GPT-5/star-maps/gateLine_star_map_Gate01.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
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
      "why": "Orion Light core — honorable initiation through ordeal/mentor (quick_rule: 'trial/initiation')."
    },
    {
      "star_system": "Sirius",
      "weight": 0.25,
      "role": "secondary",
      "polarity": "core",
      "confidence": 3,
      "behavioral_match": "Touches sacred instruction aspect.",
      "keywords": ["teacher", "instruction"],
      "why": "Sirius core — liberation via teaching (quick_rule: 'sacred knowledge transmission')."
    }
  ]
}
```

#### Metadata Block Requirements:
- **version**: Always `"4.2"`
- **baseline_beacon**: Use the computed value from Phase 0, Step 3 (currently `"59bfc617"`)
- **gate**: Zero-padded gate number as string (e.g., `"01"`, `"09"`, `"42"`)
- **generated_at**: ISO8601 timestamp (e.g., `"2025-01-15T10:30:00Z"`)
- **generator**: `"GPT-5"` or `"Claude"` (identify which LLM generated this)
- **sum_unorm**: Sum of ALL weights across ALL 6 lines (e.g., if line 1 has 0.78, line 2 has 0.75+0.25, etc., sum them all)

#### Line Entry Requirements:
- **Keys**: Sorted ascending (`"01.1"`, `"01.2"`, ..., `"01.6"`)
- **Format**: Zero-padded gate number + dot + line number
- **Value**: Array of system objects (max 2 per line)
- **System order within line**: Sorted by weight descending (highest first)

#### System Object Fields:
- **star_system**: Canonical name (see below)
- **weight**: Float, multiple of 0.01, range 0.00-0.95
- **role**: `"primary"` (highest weight) or `"secondary"` (second weight)
- **polarity**: `"core"` (healthy) or `"shadow"` (distorted)
- **confidence**: Integer 1-5
- **behavioral_match**: Brief description of line behavior
- **keywords**: Array of 2-4 strings from source texts
- **why**: Justification citing baseline theme and quick_rule

#### Canonical System Names (EXACT CASE AND SPACING):
```
"Pleiades"
"Sirius"
"Lyra"
"Andromeda"
"Orion Light"    ← Note: SPACE, not hyphen
"Orion Dark"     ← Note: SPACE, not hyphen
"Arcturus"
"Draco"
```

**CRITICAL**: Use space for Orion factions, not hyphen. `"Orion Light"` not `"Orion-Light"`.

#### Formatting:
- Pretty-print with 2-space indentation
- Valid JSON syntax
- No trailing commas

### File 2: Evidence File (Audit Trail)
**Path**: `GPT-5/evidence/gateLine_evidence_Gate01.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
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
      "why_cited": "Emergence + meeting the great one = initiation/ordeal pattern (Orion Light quick_rule).",
      "polarity": "core",
      "confidence": 5
    }
  ]
}
```

#### Metadata Block Requirements:
- **version**: Always `"4.2"`
- **baseline_beacon**: Use the computed value from Phase 0, Step 3 (currently `"59bfc617"`)
- **gate**: Zero-padded gate number as string (e.g., `"01"`, `"09"`, `"42"`)
- **generated_at**: ISO8601 timestamp (must match weight file)
- **generator**: `"GPT-5"` or `"Claude"` (must match weight file)

#### Line Entry Requirements:
- **Scope**: Only include lines with weight >0 (skip lines where all systems = 0)
- **Keys**: Sorted ascending (`"01.1"`, `"01.2"`, etc.)
- **Value**: Array of evidence objects (max 2 per line, matching top-2 from weight file)

#### Evidence Object Fields:

**star_system**: Canonical name (must match weight file exactly)

**sources**: Object with two sub-objects:
- **legge1899**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Hex 1, Line {L}"` (e.g., `"Hex 1, Line 2"`)
  - `attribution`: Always `"Legge 1899"`
  
- **line_companion**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Gate 1, Line {L}"` (may be different line than gate.line being scored)
  - `attribution`: Always `"Ra Uru Hu (LC)"`

**atoms**: Object with keyword arrays:
- **hd_keywords**: Array of 2-4 keywords from Line Companion text
- **ic_atoms**: Array of 2-4 keywords from Legge I Ching text

**why_cited**: Brief justification citing baseline theme and quick_rule (similar to "why" in weight file)

**polarity**: `"core"` or `"shadow"` (must match weight file)

**confidence**: Integer 1-5 (must match weight file)

#### Quote Requirements:
- **Verbatim**: Exact text from source, no paraphrasing
- **Length**: ≤25 words (count carefully)
- **Legge same-line rule**: For weight >0.50, Legge quote MUST be from same line number
- **Line Companion line-agnostic**: May be from any line within the gate
- **Empty quotes**: Use `""` if no suitable quote exists (not `null`)

#### Formatting:
- Pretty-print with 2-space indentation
- Valid JSON syntax
- No trailing commas
- Keys sorted ascending

---

## OUTPUT FORMAT REQUIREMENTS

### What to Output:
- **ONLY** the two JSON files (weight file and evidence file)
- **NO** commentary, explanations, or markdown outside the JSON
- **NO** code blocks or formatting markers (just raw JSON)

### JSON Formatting:
- Pretty-print with 2-space indentation
- Valid JSON syntax (no trailing commas, proper escaping)
- UTF-8 encoding

---

## ERROR HANDLING

### Phase 0 Failures (Pre-Flight):

**If any input file is missing**:
```
AUDIT FAILED: Missing required file {filename}
```
**STOP. Do not proceed.**

**If system list is incomplete**:
```
AUDIT FAILED: System list incomplete or incorrect
Expected: ["Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"]
Found: {actual_list}
```
**STOP. Do not proceed.**

**If baseline beacon mismatch**:
```
AUDIT FAILED: Baseline beacon mismatch
Expected: 59bfc617
Computed: {actual_hash}
```
**STOP. Do not proceed.**

### Phase 1 Failures (Scoring):

**If pairwise exclusion rule violated**:
```
ERROR: Pairwise exclusion violated in line 1.{L}
Systems: {system1} (weight {w1}) and {system2} (weight {w2})
Rule: {rule_description}
```
**STOP. Do not proceed.**

**If more than 2 systems have weight >0**:
```
ERROR: Top-2 constraint violated in line 1.{L}
Found {count} systems with weight >0
```
**STOP. Do not proceed.**

### Phase 2 Failures (Evidence):

**If weight >0.50 lacks Legge quote from same line**:
- Cap the weight to exactly **0.50**
- Add a note in the "why" field: "(capped: no Legge anchor)"
- Continue processing remaining systems
- Do NOT stop the entire gate processing

**If quote exceeds 25 words**:
```
ERROR: Quote exceeds 25 words
Line: 1.{L}
System: {system}
Source: {legge1899 or line_companion}
Quote: "{quote_text}"
Word count: {count}
```
**STOP. Do not proceed.**

**If quote is not verbatim**:
```
ERROR: Quote is not verbatim from source
Line: 1.{L}
System: {system}
Source: {source_file}
Extracted: "{extracted_quote}"
```
**STOP. Do not proceed.**

### Graceful Degradation:

**If Line Companion text missing for a line**:
- Use Legge text only for scoring
- In evidence file: `"line_companion": { "quote": "", "locator": "Gate 1, Line {L}", "attribution": "Ra Uru Hu (LC)" }`
- Reduce confidence by 1 level

**If Legge text missing for a line**:
```
ERROR: Legge text missing for Hex 1, Line {L}
Cannot proceed (I Ching is canonical anchor for Human Design gates)
```
**STOP. Do not proceed.**

**If no suitable quote found (weight ≤0.50)**:
- Leave quote field empty: `"quote": ""`
- Reduce confidence by 1 level
- Continue processing

---

## QUALITY GATES (Pre-Output Checklist)

Before generating output files, verify ALL of the following:

### Schema Validation:
- [ ] Weight file conforms to `GPT-5/schemas/weights.schema.json`
- [ ] Evidence file conforms to `GPT-5/schemas/evidence.schema.json`
- [ ] Run validation: `python GPT-5/scripts/validate_schemas.py --weights GPT-5/star-maps/gateLine_star_map_Gate01.json --evidence GPT-5/evidence/gateLine_evidence_Gate01.json`

### Metadata:
- [ ] `_meta` block present in both files
- [ ] `baseline_beacon` matches computed value from Phase 0, Step 3
- [ ] `version` is `"4.2"`
- [ ] `gate` is zero-padded (e.g., `"01"`, not `"1"`)
- [ ] `generated_at` is valid ISO8601 timestamp
- [ ] `generator` is `"GPT-5"` or `"Claude"`
- [ ] `sum_unorm` calculated correctly (weight file only)

### Structure:
- [ ] All 6 lines present in weight file (`"01.1"` through `"01.6"`)
- [ ] Only lines with weight >0 present in evidence file
- [ ] Keys sorted ascending in both files
- [ ] Max 2 systems per line in both files

### Constraints:
- [ ] Top-2 constraint enforced (max 2 systems with weight >0 per line)
- [ ] All 6 pairwise exclusion rules verified
- [ ] No weights >0.95 or <0.0
- [ ] All weights are multiples of 0.01
- [ ] All weights >0.50 have Legge quotes from same line

### Content:
- [ ] All quotes are ≤25 words
- [ ] All quotes are verbatim (no paraphrasing)
- [ ] System names use canonical format (`"Orion Light"` with space)
- [ ] Systems sorted by weight descending within each line
- [ ] Role assignments correct (`"primary"` for highest, `"secondary"` for second)
- [ ] Polarity assignments present (`"core"` or `"shadow"`)
- [ ] Confidence levels assigned (1-5)
- [ ] Keywords extracted from actual source text
- [ ] "Why" justifications cite baseline themes and quick_rules

### Formatting:
- [ ] Valid JSON syntax (no trailing commas, proper escaping)
- [ ] Pretty-printed with 2-space indentation
- [ ] UTF-8 encoding
- [ ] No commentary or markdown outside JSON

**If ANY checklist item fails, STOP and report the specific failure.**

---


---

## INLINED CONTEXT DATA

**The following three files are inlined below for your reference.**

### File 1: GPT-5/combined-baselines-4.2.json

```json
{
  "version": "4.2",
  "source": "auto-combined from separate v4.2 baselines",
  "systems": [
    {
      "name": "Pleiades",
      "source_file": "pleiades-baseline-4.2.json",
      "beacon": "16039d44",
      "mapping_digest": {
        "core_themes": [
          "Emotional co-regulation and nervous system soothing",
          "Caretaking and feeding/nurturing behavior",
          "Bonding panic and need-sensitivity",
          "Maternal protection and keeping everyone alive",
          "Compassion training and emotional healing",
          "Collective nurturing and sisterhood unity",
          "Stewarding seasonal cycles of care and making sure the group has what it needs to survive and recover together"
        ],
        "shadow_themes": [
          "Caretaking panic and anxious attachment",
          "Emotional enmeshment and boundary dissolution",
          "Martyrdom through over-giving",
          "Crisis-for-attachment and emotional escalation as bonding strategy"
        ],
        "quick_rules": [
          "If the behavior is emotional co-regulation, nervous system soothing, caretaking panic, feeding/nurturing, or keeping everyone alive through bonding, that's Pleiades.",
          "If the behavior is predator scanning, hierarchical enforcement, loyalty control, or survival through dominance, that's Draco, not Pleiades.",
          "If the behavior is spiritual initiation through ordeal or sacred instruction, that's Sirius or Orion-Light, not Pleiades.",
          "If the behavior is frequency healing or vibrational recalibration, that's Arcturus, not Pleiades.",
          "If the behavior is empire management or coercive control, that's Orion-Dark, not Pleiades.",
          "If the behavior is liberation from captivity or anti-domination intervention, that's Andromeda, not Pleiades.",
          "Pleiades is about emotional safety and nurturing, not about power hierarchies, spiritual ordeals, frequency work, or liberation struggles."
        ],
        "notes_for_alignment": "Score Pleiades high (0.7–1.0) when the gate.line is about keeping others emotionally safe, feeding/protecting the group, tending to need, calming nervous systems, or maternal bonding to ensure survival. Score Pleiades shadow (0.4–0.6) when it's anxious caretaking, guilt-binding love, emotional enmeshment, or escalating emotional crisis to hold closeness. Give Pleiades ~0 when the behavior is enforcement, loyalty testing, rank control, or domination through fear (that's Draco/Orion-Dark), hierarchical initiation or sacred trial (that's Sirius/Orion-Light), frequency calibration (that's Arcturus), or liberation from captivity (that's Andromeda)."
      },
      "counts": {
        "core": 7,
        "shadow": 4
      }
    },
    {
      "name": "Sirius",
      "source_file": "sirius-baseline-4.2.json",
      "beacon": "c2f00380",
      "mapping_digest": {
        "core_themes": [
          "Spiritual initiation and liberation current",
          "Sacred knowledge transmission and cosmic law teaching",
          "Royal resurrection and pharaonic renewal (Isis-Sothis-Osiris)",
          "Path to freedom through higher initiation",
          "Love-wisdom transmission and spiritual hierarchy guidance",
          "Acts as a timing signal for collective renewal and rebirth rituals ('this is when we begin again, re-consecrate, or restore life to the group')",
          "Teachers and bringers of sacred instruction"
        ],
        "shadow_themes": [
          "Initiatory elitism and spiritual gatekeeping",
          "Dogmatic adherence to cosmic law without compassion",
          "Spiritual hierarchy as power structure"
        ],
        "quick_rules": [
          "If the behavior is spiritual initiation, liberation through higher teaching, sacred instruction, cosmic law transmission, royal resurrection current, or path to freedom through advanced knowledge, that's Sirius.",
          "If the behavior is honorable trial or warrior initiation through ordeal, that's Orion-Light, not Sirius (Sirius is about liberation and teaching, Orion-Light is about ordeal and mystery schools).",
          "If the behavior is predator scanning or loyalty enforcement, that's Draco, not Sirius.",
          "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Sirius.",
          "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Sirius.",
          "If the behavior is empire management or coercive control, that's Orion-Dark, not Sirius.",
          "Sirius is about liberation through sacred teaching and spiritual initiation, not about dominance, emotional bonding, frequency work, or empire control."
        ],
        "notes_for_alignment": "Score Sirius high (0.7–1.0) when the gate.line is about spiritual initiation, liberation through higher teaching, sacred instruction, cosmic law transmission, royal resurrection current, or path to freedom through advanced knowledge. Score Sirius shadow (0.4–0.6) when it's initiatory elitism, spiritual gatekeeping, dogmatic adherence to cosmic law without compassion, or spiritual hierarchy as power structure. Give Sirius ~0 when the behavior is honorable trial through ordeal (that's Orion-Light—Sirius liberates, Orion-Light tests), predator scanning or loyalty control (that's Draco), emotional caretaking (that's Pleiades), frequency healing (that's Arcturus), or empire management (that's Orion-Dark)."
      },
      "counts": {
        "core": 7,
        "shadow": 3
      }
    },
    {
      "name": "Lyra",
      "source_file": "lyra-baseline-4.2.json",
      "beacon": "0d6cc0c0",
      "mapping_digest": {
        "core_themes": [
          "Musical and artistic enchantment",
          "Creative expression and aesthetic power",
          "Progenitor consciousness and genetic seeding (modern)",
          "Unity through artistic collaboration and harmonic co-creation",
          "Immortalization through beauty and art",
          "Volunteer soul missions and incarnational assistance"
        ],
        "shadow_themes": [
          "Artistic elitism and aesthetic superiority",
          "Grief and mourning that becomes identity",
          "Progenitor pride and genetic supremacy narratives"
        ],
        "quick_rules": [
          "If the behavior is about musical enchantment, artistic creation, aesthetic power, creative collaboration, or immortalization through beauty, that's Lyra.",
          "If the behavior is predator scanning, loyalty enforcement, or survival through dominance, that's Draco, not Lyra.",
          "If the behavior is emotional caretaking, nervous system soothing, or feeding/nurturing, that's Pleiades, not Lyra.",
          "If the behavior is liberation through sacred instruction, cosmic law, or higher teaching that frees the captive, that's Sirius, not Lyra.",
          "If the behavior is honorable trial, ordeal, warrior initiation, or earning rank through courage and discipline, that's Orion-Light, not Lyra.",
          "If the behavior is frequency calibration or vibrational healing, that's Arcturus, not Lyra.",
          "If the behavior is liberation from captivity or anti-domination intervention, that's Andromeda, not Lyra.",
          "If the behavior is empire management, coercive control, obedience enforcement, psychological pressure at scale, or genetic manipulation to dominate and enslave, that's Orion-Dark, not Lyra (Lyra may talk about ancestry or seeding, but not about controlling you through it).",
          "Lyra is about artistic expression and creative power, not about dominance hierarchies, emotional bonding, spiritual ordeals, or liberation struggles."
        ],
        "notes_for_alignment": "Score Lyra high (0.7–1.0) when the gate.line is about musical enchantment, artistic creation, aesthetic power, creative collaboration, or immortalization through beauty and art. Score Lyra shadow (0.4–0.6) when it's artistic elitism, aesthetic superiority, grief that becomes identity, or progenitor pride. Give Lyra ~0 when the behavior is predator scanning or loyalty control (that's Draco), emotional mothering or caretaking/collective nervous system soothing/keeping everyone emotionally safe (that's Pleiades—Lyra unity is artistic/harmonic co-creation, not crisis caregiving), honorable trial/warrior initiation/ordeal path (that's Orion-Light), liberation-through-teaching/sacred instruction/cosmic law for freedom (that's Sirius), frequency healing (that's Arcturus), or liberation from captivity (that's Andromeda), or empire-scale coercive control/obedience infrastructure/psychological pressure systems/genetic manipulation to enforce hierarchy (that's Orion-Dark—Lyra origin/seeding stories talk about ancestry and creative lineage, not active domination), or Note: 'I incarnated on Earth to help/I'm here on mission as a volunteer soul' can score Lyra high (0.7–1.0) under the modern volunteer/mission thread."
      },
      "counts": {
        "core": 6,
        "shadow": 3
      }
    },
    {
      "name": "Andromeda",
      "source_file": "andromeda-baseline-4.2.json",
      "beacon": "b2ff02d2",
      "mapping_digest": {
        "core_themes": [
          "Liberation from captivity and unjust bondage",
          "Intervention to free the bound and restore sovereignty",
          "Anti-domination ethics and non-hierarchical council governance",
          "Cosmic justice alignment and restoration of balance",
          "Extragalactic perspective and separate civilization consciousness"
        ],
        "shadow_themes": [
          "Passive victimhood and waiting for rescue",
          "Martyrdom complex and self-sacrifice without agency",
          "Idealistic council structures that avoid direct action"
        ],
        "quick_rules": [
          "If the behavior is breaking chains, freeing captives, interrupting abuse, challenging domination, or restoring sovereignty to someone who was claimed/owned, that's Andromeda.",
          "If the behavior is predator scanning, loyalty enforcement, territorial control, or survival-through-dominance inside a threatened group, that's Draco, not Andromeda. Draco protects by controlling access; Andromeda liberates by removing the captor.",
          "If the behavior is empire management, obedience infrastructure, psychological pressure at scale, or 'the many must submit to the few,' that's Orion-Dark, not Andromeda. Orion-Dark builds domination systems; Andromeda dismantles them.",
          "If the behavior is emotional co-regulation, nervous system soothing, feeding, tending, holding someone until they feel safe, that's Pleiades, not Andromeda. Pleiades heals through nurture; Andromeda rescues through intervention.",
          "If the behavior is clinical/vibrational healing, frequency calibration, energetic repair, clearing trauma residue after harm, or running people through light/sound chambers, that's Arcturus, not Andromeda. Arcturus is post-liberation stabilization.",
          "If the behavior is honorable ordeal, spiritual trial, warrior initiation, rank earned through suffering for a sacred code, that's Orion-Light, not Andromeda.",
          "If the behavior is sacred-law liberation from ownership ('you are not property under cosmic law') and proclamation of inherent freedom as a teaching, that's Sirius, not Andromeda. Sirius is liberation doctrine; Andromeda is physical/structural rescue.",
          "If the behavior is aesthetic legacy, mythic artistry, immortalizing beauty, cultural refinement, or 'our lineage is the original creative template,' that's Lyra, not Andromeda. Lyra elevates through art and mythic prestige; Andromeda intervenes against captivity.",
          "Andromeda is about anti-domination action and sovereignty restoration, not territorial dominance, emotional caretaking, vibrational medicine, aesthetic immortality, ordeal-initiation, or empire control."
        ],
        "notes_for_alignment": "Score Andromeda high (0.7–1.0) when the gate.line is about liberating the captive, disrupting an abuser/controller, restoring sovereignty to someone treated as property, or openly defying unjust hierarchy/power capture. Score Andromeda shadow (0.4–0.6) when it slips into martyr fantasy ('I'm the sacrifice'), helpless damsel expectation ('someone will save me because I'm pure'), or purely performative council rhetoric ('we condemn domination' with no action). Give Andromeda ~0 when the behavior is predator scanning, loyalty enforcement, resource hoarding, 'obey or get exiled' (Draco), empire-scale obedience engineering or planetary takeover (Orion-Dark), emotional mothering / nervous-system soothing / feeding (Pleiades), frequency medicine, vibrational recalibration, trauma field repair after the rescue (Arcturus), warrior ordeal / rank earned through trials (Orion-Light), proclamation of cosmic law that nullifies ownership, 'you are not property in the eyes of Source' (Sirius), or immortalizing beauty, mythic art, aesthetic superiority or 'we are the original lineage' (Lyra)."
      },
      "counts": {
        "core": 5,
        "shadow": 3
      }
    },
    {
      "name": "Orion Light",
      "source_file": "orion-light-baseline-4.2.json",
      "beacon": "bc4b7689",
      "mapping_digest": {
        "core_themes": [
          "Honorable trial and spiritual warrior initiation",
          "Ascending through ordeal in service to a higher code",
          "Mystery school preservation and sacred knowledge transmission",
          "Ritual death-and-rebirth initiation that grants rightful leadership duty and moral authority",
          "Embedding cosmic law and the initiation path into physical systems, oaths, or institutions so future generations stay aligned",
          "Thoth-Hermes lineage as divine scribe and cosmic law transmitter",
          "Record keeping and preservation of primordial knowledge"
        ],
        "shadow_themes": [
          "Initiatory elitism and gatekeeping of sacred knowledge",
          "Ordeal fetishization and unnecessary suffering",
          "Spiritual pride in having 'passed the test'"
        ],
        "quick_rules": [
          "If the behavior is honorable trial, spiritual/warrior initiation, ascending through ordeal in service to a higher code, mystery school transmission, sacred knowledge preservation, or earning rank through courage and integrity, that's Orion-Light.",
          "If the behavior is empire management, coercive control structures, obedience enforcement, or psychological pressure at scale, that's Orion-Dark, not Orion-Light.",
          "If the behavior is predator scanning and loyalty enforcement at the tribal level, that's Draco, not Orion-Light.",
          "If the behavior is emotional co-regulation or caretaking, that's Pleiades, not Orion-Light.",
          "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Orion-Light.",
          "If the behavior is liberation teaching or spiritual instruction for freedom, that's Sirius, not Orion-Light (Sirius is about liberation, Orion-Light is about ordeal and mystery schools).",
          "If the behavior is rescuing the captive, breaking chains of exploitation, or intervening against unjust domination, that's Andromeda, not Orion-Light (Andromeda breaks chains, Orion-Light tests worthiness through ordeal).",
          "Orion-Light is about initiation through ordeal and sacred teaching, not about empire control, emotional bonding, or liberation struggles."
        ],
        "notes_for_alignment": "Score Orion-Light high (0.7–1.0) when the gate.line is about honorable trial, spiritual warrior initiation, ascending through ordeal in service to a higher code, mystery school preservation, sacred knowledge transmission, or earning rank through courage and integrity. Score Orion-Light shadow (0.4–0.6) when it's initiatory elitism, gatekeeping of sacred knowledge, ordeal fetishization, or spiritual pride in having 'passed the test'. Give Orion-Light ~0 when the behavior is empire management or coercive control (that's Orion-Dark), tribal predator scanning (that's Draco), emotional caretaking (that's Pleiades), frequency healing (that's Arcturus), or liberation teaching (that's Sirius—Sirius liberates, Orion-Light initiates through ordeal), or direct intervention to free someone from captivity/exploitation (that's Andromeda—Andromeda breaks chains, Orion-Light tests worthiness through ordeal)."
      },
      "counts": {
        "core": 7,
        "shadow": 3
      }
    },
    {
      "name": "Orion Dark",
      "source_file": "orion-dark-baseline-4.2.json",
      "beacon": "65a9cf2f",
      "mapping_digest": {
        "core_themes": [
          "Empire management and coercive control structures",
          "Hierarchical power consolidation through obedience enforcement",
          "Bureaucratic psychological pressure and population-scale manipulation infrastructure",
          "Genetic engineering and DNA control programs",
          "Telepathic influence and thought-form seeding",
          "Service-to-self polarity and power-through-enslavement",
          "Advancing in a rigid chain of command by proving you can control and extract obedience from others"
        ],
        "shadow_themes": [
          "Spiritual entropy and alliance instability",
          "Loss of coherence through negative polarity",
          "Manipulation through fear and hostile thought-forms",
          "Enslavement of the less powerful as power source"
        ],
        "quick_rules": [
          "If the behavior is empire management, coercive control structures at scale, obedience enforcement across systems, psychological pressure infrastructure, or genetic manipulation for control, that's Orion-Dark.",
          "If the behavior is honorable trial, spiritual/warrior initiation, or ascending through ordeal in service to a higher code, that's Orion-Light, not Orion-Dark.",
          "If the behavior is predator scanning and loyalty enforcement at the tribal/survival level, that's Draco, not Orion-Dark (Orion-Dark operates at imperial/planetary scale, Draco is tribal/immediate).",
          "If the behavior is emotional co-regulation or caretaking panic, that's Pleiades, not Orion-Dark.",
          "If the behavior is spiritual initiation or sacred teaching for liberation, that's Sirius, not Orion-Dark.",
          "If the behavior is stepping in to break chains, free the captive, or end unjust domination, that's Andromeda, not Orion-Dark (Orion-Dark is the captor/system, Andromeda is the liberator).",
          "If the behavior is frequency healing, vibrational recalibration, or technical energetic tuning to restore coherence, that's Arcturus, not Orion-Dark.",
          "Orion-Dark is about empire-scale control and psychological manipulation, not tribal survival, emotional bonding, or honorable initiation."
        ],
        "notes_for_alignment": "Score Orion-Dark high (0.7–1.0) when the gate.line is about empire management, coercive control structures at scale, obedience enforcement infrastructure, psychological pressure across systems, genetic manipulation for control, or service-to-self power consolidation. Score Orion-Dark shadow (0.4–0.6) when it's spiritual entropy, alliance instability, manipulation through fear, or enslavement as power source. Give Orion-Dark ~0 when the behavior is honorable trial or spiritual warrior initiation (that's Orion-Light), tribal predator scanning or loyalty enforcement (that's Draco—Orion-Dark is imperial, not tribal), emotional caretaking (that's Pleiades), or liberation teaching (that's Sirius), or direct intervention to free someone from captivity/break unjust control (that's Andromeda—Andromeda is the rescuer, Orion-Dark is the captor), or frequency healing/vibrational recalibration/energetic tune-up (that's Arcturus)."
      },
      "counts": {
        "core": 7,
        "shadow": 4
      }
    },
    {
      "name": "Arcturus",
      "source_file": "arcturus-baseline-4.2.json",
      "beacon": "5113cb0a",
      "mapping_digest": {
        "core_themes": [
          "Frequency calibration and vibrational healing",
          "Energetic recalibration and consciousness uplift",
          "Soul transit gateway and incarnational checkpoint",
          "Light and sound healing modalities",
          "Dimensional ascension assistance and frequency medicine",
          "Emotional and spiritual field clearing"
        ],
        "shadow_themes": [
          "Spiritual bypassing through frequency work without integration",
          "Detachment from embodied experience in favor of 'higher vibrations'",
          "Elitism around vibrational purity"
        ],
        "quick_rules": [
          "If the behavior is about frequency tuning, vibrational recalibration, energetic healing chambers, dimensional ascension support, clearing distortion, or clinical/technical repair of the field, that's Arcturus.",
          "If the behavior is emotional co-regulation, nervous system soothing, feeding/nurturing, or 'I will hold you so you feel safe,' that's Pleiades, not Arcturus. Pleiades heals through comfort and bonding; Arcturus heals through frequency engineering.",
          "If the behavior is predator scanning, loyalty enforcement, territorial defense, resource/energy hoarding, or survival through dominance hierarchy, that's Draco, not Arcturus. Draco protects by controlling access; Arcturus heals by recalibrating.",
          "If the behavior is honorable trial, warrior initiation, rank earned through ordeal, or passing tests under a sacred code, that's Orion-Light, not Arcturus.",
          "If the behavior is liberation teaching — freeing captives, dissolving domination structures, invoking sacred law that says 'you are not property' — that's Sirius, not Arcturus.",
          "If the behavior is breaking chains, overthrowing captors, insisting on absolute freedom and 'no one owns me/us,' that's Andromeda, not Arcturus. Andromeda is liberation impulse; Arcturus is post-liberation healing/calibration.",
          "If the behavior is aesthetic power, artistic enchantment, legacy beauty, cultural refinement, or 'we are the original template' pride, that's Lyra, not Arcturus. Lyra elevates through art and lineage; Arcturus elevates through energetic medicine.",
          "If the behavior is empire management, obedience infrastructure across populations, psychological control at scale, or enforced hierarchy for planetary takeover, that's Orion-Dark, not Arcturus. Orion-Dark restructures by domination; Arcturus stabilizes by healing.",
          "Arcturus is about frequency healing, vibrational recalibration, and transit support — not emotional caretaking, territorial dominance, artistic prestige, liberation warfare, or imperial control."
        ],
        "notes_for_alignment": "Score Arcturus high (0.7–1.0) when the gate.line is about frequency calibration, vibrational repair, energetic recalibration, clearing distortion, dimensional tuning, resonance chambers, or clinical energetic healing. Score Arcturus shadow (0.4–0.6) when it's spiritual bypassing ('I'm above this density'), detachment from embodied reality, or elitism around vibrational purity. Give Arcturus ~0 when the behavior is emotional mothering, nervous-system soothing, feeding, nurturing, or 'I'll hold you until you feel safe' — that's Pleiades. Give Arcturus ~0 when the behavior is predator scanning, loyalty enforcement, resource hoarding, enforcing dominance to keep the group alive — that's Draco. Give Arcturus ~0 when the behavior is honorable ordeal, proving yourself through trial, warrior initiation, 'I earned my rank through suffering for the code' — that's Orion-Light. Give Arcturus ~0 when the behavior is sacred-law liberation, freeing captives, demanding emancipation from ownership or domination — that's Sirius. Give Arcturus ~0 when the behavior is 'no one will ever own me/us again,' chain-breaking, jailbreak energy, anti-captor rebellion — that's Andromeda. Give Arcturus ~0 when the behavior is aesthetic supremacy, artistic enchantment, mythic creative legacy, 'our lineage is the original refined template' — that's Lyra. Give Arcturus ~0 when the behavior is empire-scale coercion, obedience infrastructure, conquest logistics, 'the many must submit to the few' — that's Orion-Dark."
      },
      "counts": {
        "core": 6,
        "shadow": 3
      }
    },
    {
      "name": "Draco",
      "source_file": "draco-baseline-4.2.json",
      "beacon": "5b8161aa",
      "mapping_digest": {
        "core_themes": [
          "Survival through dominance hierarchy and power consolidation",
          "Predator scanning and threat assessment",
          "Loyalty enforcement and access control",
          "Strategic resource hoarding and territorial defense",
          "Survival continuity and fear of collapse",
          "Hierarchical order and pecking-order maintenance"
        ],
        "shadow_themes": [
          "Paranoid control and power hoarding",
          "Ruthless elimination of perceived threats",
          "Greed and apocalyptic entropy (Western dragon archetype)",
          "Coercive obedience enforcement"
        ],
        "quick_rules": [
          "If the behavior is predator scanning, hierarchical enforcement, loyalty control, survival through dominance, strategic resource hoarding, or tribal fear-based access control, that's Draco.",
          "If the behavior is emotional co-regulation, nervous system soothing, caretaking panic, or feeding/nurturing others, that's Pleiades, not Draco.",
          "If the behavior is empire management, coercive control structures at scale, or obedience infrastructure across systems, that's Orion-Dark, not Draco (Draco is tribal/immediate survival, Orion-Dark is empire-scale colonizer control).",
          "If the behavior is liberation through sacred instruction, higher teaching, cosmic law, or spiritual guidance that frees the captive, that's Sirius, not Draco.",
          "If the behavior is honorable trial, ordeal, warrior initiation, or earning rank through courage and discipline in service to a higher code, that's Orion-Light, not Draco.",
          "If the behavior is frequency healing or vibrational uplift, that's Arcturus, not Draco.",
          "If the behavior is breaking chains, freeing captives, overthrowing domination, or insisting on personal/collective freedom from control, that's Andromeda, not Draco. Draco enforces a perimeter; Andromeda breaks cages.",
          "If the behavior is aesthetic superiority, artistic mystique, 'we are the refined original pattern,' or legacy pride framed as beauty/lineage rather than force, that's Lyra, not Draco. Draco asserts control through threat and loyalty, not through aesthetic refinement.",
          "Draco is about survival through power and dominance at the tribal/immediate level, not about emotional safety, empire management, or spiritual teaching."
        ],
        "notes_for_alignment": "Score Draco high (0.7–1.0) when the gate.line is about predator scanning, threat assessment, loyalty enforcement, survival through dominance hierarchy, resource hoarding, or fear-based access control at the tribal/immediate level. Score Draco shadow (0.4–0.6) when it's paranoid control, ruthless elimination of threats, greed, or coercive obedience enforcement. Give Draco ~0 when the behavior is emotional caretaking or bonding panic (that's Pleiades), empire-scale coercive control or obedience infrastructure (that's Orion-Dark—Draco is tribal, not imperial), or frequency healing (that's Arcturus). Give Draco ~0 when the line is about liberation from captivity, breaking chains, or insisting no one should be owned — that's Andromeda (freedom impulse), not Draco (territorial control). Give Draco ~0 when the line is about artistic prestige, beauty lineage, 'our blood is the original template,' or creative/aesthetic superiority — that's Lyra. Draco status is enforced through fear and loyalty, not through aesthetic refinement. When the line is 'I came here on a mission to help humanity evolve / I volunteered to incarnate to stabilize Earth,' that usually goes to Lyra (or sometimes Pleiades/Arcturus depending on tone), not Draco. Draco does not present as 'volunteer healer' or 'missioned helper'; Draco presents as 'protector/enforcer.' If the line is about soothing, feeding, holding, or co-regulating ('you're safe with me, I'll take care of you'), score Pleiades, not Draco. Draco safety is territorial enforcement, not emotional nurture. If the line is 'obey or be crushed, entire civilizations bow to us,' that's Orion-Dark, not Draco. Draco is about clan-level control, not galaxy-scale imperial logistics. For spiritual challenge language: If it's honorable trial / warrior initiation / surviving an ordeal to earn rank → Orion-Light. If it's liberation-through-teaching / cosmic law that frees slaves or dissolves domination → Sirius. Either way, score Draco ~0. If it scales to 'galactic empire, mass obedience, planetary subjugation, engineered bloodlines to rule entire civilizations', score ~0 for Draco and high for Orion-Dark. Draco does clan/den control, not interstellar fascist bureaucracy."
      },
      "counts": {
        "core": 6,
        "shadow": 4
      }
    }
  ]
}
```

### File 2: claude/Full Pass/gate-1-full.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Line Companion text verbatim into 'full_text' - no summarization, no trimming",
    "Copy line title verbatim into 'hd_title'",
    "Return exactly six lines (1–6)"
  ],
  "gate": 1,
  "gate_name": "Self-Expression",
  "source": "Line Companion (Ra Uru Hu)",
  "lines": [
    {
      "line": 1,
      "hd_title": "Creation is independent of will",
      "full_text": "The first line always speaks for the nature of the hexagram. Here we have the relationship between the self and the ego. The first thing we hear is that Creation is independent of will. Right away you have this keynote that says: look, this is not about what your ego is doing. This is not about your ego claiming that it is a creative font. The ego is just a motor. Unique direction is not about willpower: \"I'll do something nobody else has ever done.\" Only somebody collective can say something dumb like that because to do something that nobody else has ever done is a mutation and it can only happen. We cannot create it. It is independent of will.\n\nThe Moon exalted as the symbol of adaptation. Time is everything. This is so important to understand about mutation. It follows its own law. You have to wait for it and there is nothing that you can do. Remember that this is a first line. It is not transpersonal. It does not know that there is an 8th gate on the other side that is ready to make a contribution. It does not know that it can make that contribution. There is just this deep impulse to express one's uniqueness. Time is everything.\n\nUranus in detriment. Instability leads to distortion. Here, patience is a virtue and revolution a vice. In the white book, the Uranus in detriment is: Creative instability unless there is patience. That is much more clearly stated there. In other words, you can't be an example right away. So many individuals go through life trying to be like the collective until that moment of mutation. You have to be patient. If you are, it will come. The moment you try to control it, the moment you try to drive it with willpower, then you become unstable.\n\nI have been creative all of my life. Every time my big ego tried to tell me that it was time to create, I would end up with enormous frustration. In those moments where the last thing on earth I want to do is to create anything, I will be driven to do it because that is the mechanism. You learn in time. Patience is a great teacher. Revolution, the desire out of the ego to express creativity, and to do it when you want to do it, leads to distortion. I have my South Node there. Time is everything. I had to wait nearly 40 years."
    },
    {
      "line": 2,
      "hd_title": "Love is light",
      "full_text": "With individuality, we are dealing with a number of things. First of all, we are dealing with people that are not designed to be interfered with. In individual gates, you do not allow anybody to interfere. We are in the lower trigram here, so the individual here does not even expect that there is somebody that is going to interfere.\n\nThe other thing is that all individuality suffers from the chemistry of melancholy. All individuality is rooted in a happy and a sad cycle. Unique, individual expression or mutation is not something that happens all the time, every day. There is a process built into the foundation that says that this is something that has to be waited for and, in waiting, there can be a great deal of turmoil.\n\nWhen you come to the second line, it is very much involved in itself and in being what it is: being different. Somebody looks inside and sees that difference. In seeing it, the second line can be interfered with and brought out of their individual process.\n\nHere we have Love is light. What a lovely line. Venus exalted as a symbol of beauty. Remember, so much about direction has to do with beauty. There is a joke in this. Everybody knows that beauty is in the eye of the beholder. One person's rose is another person's cow-pie. That is the way things are. So we have this subjectivity that we are all looking for. What is beauty? What is the beautiful way? What appears to be the beautiful way for some is not necessarily the way for others.\n\nThe required harmony between established values and ideals that enriches inspiration. The established value is simply to be oneself without interference and to fulfill one's life. The ideal is to maintain that capacity for individual expression. However, the 1.2's don't know that like the naturals in the 2.2. They just live that until somebody interferes because that will always happen to them.\n\nOn the other side, the Mars side, again we have the presence of the ego force trying to step in. Desires and passions have their place but not at the expense of Creation. In other words, desire and passion have their place. Save desire and passion for your lover or for whatever it is, but to desire to be unique or to put all your passion in being unique is misplaced and always moody.\n\nIn the white book: Self expression conditioned by ideals and values; or Self expression limited by desires and passions. In both cases, please understand something: the way in which this line will work is deeply connected to who this being will meet in their life because there are those people that will deeply interfere with that process. After all, this is a very powerful force. It is a penetrating force. There are those people that love to take that penetrating force and manifest it, bring it out. The second line, because it does not know that it is unique, is subject to being cranked up, to being pumped up, to having the ego built up: \"You are really unique. You are really terrific. You have to put your desire and passion to this.\" They are being interfered with instead of being left alone inside their lit room. Whenever you are dealing with individuality, the more you let these people alone and do not interfere, the better it is going to be.\n\nLook at your own design, at any individual gate or channel you have. That is the, one place in your life where nobody has a right to interfere. The moment you let them interfere, a very important quality of what you are as a being gets lost. Individuality is not here to be interfered with. The collective is about sharing. Individuality is about ultimate empowerment."
    },
    {
      "line": 3,
      "hd_title": "The energy to sustain creative work",
      "full_text": "If you were a bookmaker and you were doing some gambling on who was going to be a mutative success and you had all the examples of the first gate and the various lines, the first thing to recognize is that there is a joke. The second and the fifth line normally are lines that can be very successful: the second because its quality is seen by others and therefore it is recognized, and the fifth because others will always project the best possibilities onto the fifth, at least at the beginning. Under normal circumstances one would think that the second and the fifth line of the first hexagram would in fact be the ones that are the most mutative. It is not true. They are deeply handicapped because they, more than any of the other lines, bring interference into their lives. If you are going to make a bet, you can bet on the first, third and fourth. Sixth lines, we never know. In the first, third or fourth, there is always the possibility for mutation because they are much better equipped to keep the outside from interfering.\n\nThe third line is called: The energy to sustain creative work. Mars exalted as the symbol of a profound need for self-expression. Because what happens to these people is the trial and error process and because they do not know what is on the other side, they learn about interference. Because they have the capacity to adapt, they can learn from that interference. They have the Martian energy to keep pushing through and they will not let the interference get in the way. This is the first side.\n\nWhen you come to the other side, to the Earth in detriment: Material forces can disrupt creativity and lead to overambition. These are people who are actually very talented and who never get to fulfill the potential of their real talent because they get pulled into commercial possibilities, i.e. somebody who is struggling to be a legitimate painter who needs money, gets a job as a graphic artist and ends up being caught up in the world buying televisions, cars, mortgages, vacations and so on, and sells out their uniqueness to the mundane plane. This is the other side. Material forces can disrupt creativity and lead to over-ambition.\n\nSo, in the third line, the exalted side can get past the interference even though it meets it and, in meeting it, it learns a lot because it learns to recognize what happens to its creative process when it is interfered with. Because of the Martian quality, it can keep on moving through. But on the other side, materialism disrupts creativity. The moment that you give a young painter 100 dollars for a canvas, you instantaneously change the way they produce their art because the materialism, if they have the detriment, is just going to pull them away from continuing their unique mutative process.\n\nOne of the most common scenarios in our Western world is to have so many young, creative people that have been totally fucked up by money. It is amazing how many careers have been destroyed by easy money. Whether we talk about artists, actors or rock n' roll stars. This is part of the theme of direction, to wait for the right timing.\n\nThe second and the third lines have similar problems in dealing with the outside, but the third is better equipped because it can adapt. The lower trigram in and of itself has a great deal of difficulty with trying to keep interference away. By the way, there is such a thing as positive interference. This is not to say that all interference is negative, like what the third line learns from being interfered with. There is a Chinese saying: good news, bad news, who knows? The person that interferes with you may turn you onto a different track where mutation can take place. We have strange allies in life but interference is the main theme here."
    },
    {
      "line": 4,
      "hd_title": "Aloneness as the medium of creativity",
      "full_text": "When we come to the upper trigram, we come to a very special fourth line. The fourth line has a harmony to the first line and what we learned in the first line is that creation is independent of will, not only the will of the artist but the will of others and their interference as well. Here we have the transpersonal harmony to that. In other words, what you have in the fourth line is the recognition that there is an 8th gate at the other end and that the contribution can be made. The recognition of what is on the other side, something very deep, is at work here.\n\nThis line is called: Aloneness as the medium of creativity, not 'interference as the medium of creativity'. The fourth line will externalize that in a one-tracked way. Fourth lines can be so very successful and can bring mutation into the world because they are one-tracked in recognizing the value of aloneness. The line says: aloneness as the medium of creativity, not as the medium for contribution, just for the creativity. It is clear that when one has to be creative, one needs to be alone. That does not mean that one has to be alone one's entire life. It means that only the creativity can not be interfered with.\n\nThe tension of inner light. That is the overview. Think about what the real creative process is. The real creative process is to build that tension over a life-time. It is an inner tension because the creative process requires tension and because you have to wait for those moments in which the mutation really works.\n\nThe Earth exalted as a symbol of a personal perspective manifested outside of influence. Jupiter in detriment. Where the potential magic of inspiration is diluted. This is a very bizarre line because as far as I can tell, there are only two lines in the whole book, 1.4 and 1.6, where you have Jupiter in detriment and there is no explanation given. Nothing.\n\nThe first thing to realize in the aloneness: creativity must develop outside of influence. What happens in the detriment is not that these people give up the aloneness for their creativity, what happens is that once they have the mutation, they become fixed on externalizing it and they give up further possibilities of mutation. An example: let's say there is somebody who has written something and it is really good and they want to get it out in the world. They will stop writing and they will spend their time, their creative energy, trying to get somebody to recognize it and to be very fixed on getting it out into the world. Or they write other books following the same recipe, the same theme, endlessly.\n\nIn the white book there is an explanation of it: The need to influence that abandons aloneness and limits creativity. Please understand, it does not mean that they are different than the exalted in terms of not allowing people to influence them. They don't. They end up getting influenced in trying to bring out into the world what they have, not the creativity itself. They get caught up in marketing, in trying to get things out and they lose their creative feel. In order for them to get back to their creativity they have to go back into their aloneness."
    },
    {
      "line": 5,
      "hd_title": "The energy to attract society",
      "full_text": "This is one of these fifth lines that are very difficult, as I mentioned earlier. Here you have the projection that is coming from everyone: this is the talented one. The moment that there is this constant projection, there is all kinds of interference. \"You are so talented. Why don't you do something?\" Fifth lines always present this possibility. In other words, fifth lines can be an enormous advantage in life. If you look at your own fifth lines, you realize that this is where people are projecting on you. You will always get the positive projection before you get the negative. That is true of all fifth lines. Everybody looks at a fifth line and is hoping for the best out of that fifth line. When they get disappointed, then they project the other way but you are always given the benefit with a fifth line.\n\nIn the fifth line of the first hexagram, this assumption that one is creative is very attractive to society. Society likes to know that there are those creative, mutative forces around. It is not necessarily conducive to creativity because it is always pulling interference.\n\nMars exalted for its powerful ego endurance. The only thing that is left in the fifth line is that everybody is coming to the fifth line saying, \"You have such talent\" and they end up just riding this ego field. When you see these people you see them on television, on game shows. These are the kind of people that did something once, long ago, that everybody at the time projected was really talented and they never did a bloody thing ever again, but they made a living of being considered creative ever since. Television is full of these people. Life is too, by the way.\n\nThe other side is the Uranus in detriment, where eccentricity can handicap endurance. This is the example of Oscar Wilde. He did not give his energy to his talent, but to his life. (The actual quote is: \"I gave my talent to my life, not my art.\") We are dealing with a freak circuit here. We are dealing with individuality; we are dealing with the outsider and what happens to these people is that they try to just live what the outside world wants, which is to be like a creative person. Society has created the illusion of what a creative person is. Usually they are poor drunks or have terrible problems with women, beat their children, steal money or take drugs but do manage to produce every once in a while things of beauty that everyone appreciates. If you do not really have the depth or the skills, you can still play the role. It is a role gate, after all.\n\nThese people with the 1.5 in detriment are out there playing the creative role and everybody is accepting that, except that they get more and more eccentric to get the attention. All individuality is seeking attention. The more eccentric they become, the sooner the whole game will crash. Then they are famous has-beens. They used to be creative; they are not anymore. The endurance is that they put up with the interference. They have no choice. They attract society. They can be very valuable in the sense that, because they attract society, they can get mutation out into the world. Unfortunately for them, that attraction comes so quickly in life that they rarely get a chance to mature as creative forces. So what they end up doing is just being able to handle through the ego those forces that are constantly trying to interfere with them.\n\nThere is a famous writer in America named Truman Capote. He wrote 'In Cold Blood' which made a couple of million dollars for him. He was a very bizarre homosexual with very funny habits. He made all this money and could not write anymore. He kept on telling people that he was working on a novel and he did that for 22 years until he died. When he died and they went through all of his papers, that book did not exist, but he had an incredible endurance.\n\nThere is a famous story about him. He wrote the screen play for the film 'African Queen' with Humphrey Bogart and in those days, when they made the film, he literally had to change the script every single day so that they all had to work together, the writers and the actors. Bogart was somebody who was very crude. Capote had a funny little voice, a kind of squeaky, high pitched voice. He really sounded hilarious when you heard him speak."
    },
    {
      "line": 6,
      "hd_title": "Objectivity",
      "full_text": "This leads us to the dilemma of the 1.6 because the 1.6 knows that. It sits up there on top of the house of creativity and it looks across to the 43.1 which says, \"Hey, patience.\" All resistance has to be eliminated. This has to get out into the world. The mutation has to take its place. It takes a long, long time. You will never live long enough to appreciate the impact of that mutation. I know that. I live that. What I share with you, what we work with in Human Design. There is no possible way that I can see what that is going to be because the perspective on that will take place long after I'm gone. 300 years from now or 400 years from now, somebody may be able to look back on that perspective and see the mutative value and beauty in all this. It can't be judged now. It can only be lived as a mutation now, nothing else.\n\nThe 1.6 is a question of Objectivity. Clear assessment of creative value. But how do you know? What we consider to be high art today, what will it be tomorrow? We don't know that. There are millions and millions of pieces of creativity that are garbage, long forgotten. Not everything can be mutative. So this question of what is of creative value becomes an enormous dilemma for the 1.6. It looks out and says, \"Yes, okay. I look at it now. It seems to be okay, but how will this stand the test of time?\" Go out in the street and look at one of these new buildings. It may be attractive today in our consciousness, maybe. What will it look like from the next phase looking back? Will it still have a place? Will we be pleased to see those buildings survive? I doubt it. Clear assessment of creative value. That is the point.\n\nThe Earth exalted with no explanation; it does not say anything about this. This clear assessment is a lifelong process and, at the end of your life, it can only be comparative and you still do not know. We are talking about mutation. Human beings are so damn selfish. They want everything in their time. We are a species and our species operates beyond generational borderlines. It is a movement. Mutation is a movement and it goes far beyond a single lifetime. Any mutation that is of value travels hundreds of generations. This is something that can only be judged in time by looking back.\n\nPluto in detriment. The risk that subjective appraisal will result in disappointment and creative frustration. Well, you are not going to get a lot of creative expression out of a 1.6 because they recognize clearly what really will be mutative. What happens in the detriment is that there is this subjectivity that comes in and it only comes early in life that pulls them saying, \"Yes, this is it.\" That is the person who says, \"This is the most beautiful thing.\" This subjective appraisal leads to disappointment because time just passes it by and five years later nobody is interested in it because it is just a fad. It was not really of creative value and it did not really bring a mutation. Then the 1.6 stands back and says, \"Okay.\"\n\nIn the white book, the Earth is given its value. Clarity in creative expression. Remember the relationship between the sixth line and wisdom. Though the 1.6 is not involved on a moment by moment basis with trying to assert its creative uniqueness, it has a much greater process going on. That process can flower in the end. That is the perspective that really sees clearly whether the mutation is something that will have that generational transcendent power to it. Nobody can recognize that better than a 1.6, sitting on the roof of the house, looking at the creative impulse of the world. It has the capability of objectively saying, \"That mutation will take hold. That will go. I bet that 400 years from now, everyone is doing that.\"\n\nThat is the possibility that lies there as wisdom. It is about time. The nature of bringing love into the world is not about loving your neighbor; it is about loving yourself. (This is something that I get to when I talk about the vessel of love.) The important thing about bringing real true creative mutation into the world is simply about these individual forces being themselves, nothing more and nothing less."
    }
  ],
  "aliases": [
    "The Gate of Self-Expression",
    "The Creative"
  ]
}
```

### File 3: claude/I-Ching-Full-Pass/hexagram-01.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Legge text verbatim into `full_text` (Judgment + Lines + Xiang if present).",
    "Each `lines[i].legge_line_text` is copied verbatim.",
    "Return exactly six lines (1–6).",
    "Do not invent or alter punctuation/romanization.",
    "Legge 1899 only (public domain)."
  ],
  "hexagram": 1,
  "hexagram_name_legge": "Khien",
  "source": {
    "work": "I Ching",
    "translator": "James Legge",
    "edition_year": 1899,
    "public_domain": true
  },
  "judgment_text": "Khien (represents) what is great and originating, penetrating, advantageous, correct and firm,",
  "image_text": null,
  "addendum": {
    "type": "supernumerary_line",
    "text": "(The lines of this hexagram are all strong and undivided, as appears from) the use of the number nine. If the host of dragons (thus) appearing were to divest themselves of their heads, there would be good fortune."
  },
  "full_text": "I. The Khien Hexagram.\n\nExplanation of the entire figure by king Wan.\n\nKhien (represents) what is great and originating, penetrating, advantageous, correct and firm,\n\nExplanation of the separate lines by the duke of Wau.\n\n1. In the first (or lowest) line, undivided, (we see its subject as) the dragon lying hid (in the deep). It is not the time for active doing.\n\n2. In the second line, undivided, (we see its subject as) the dragon appearing in the field. It will be advantageous to meet with the great man.\n\n3. In the third line, undivided, (we see its subject as) the superior man active and vigilant all the day, and in the evening still careful and apprehensive. (The position is) dangerous, but there will be no mistake.\n\n4. In the fourth line, undivided, (we see its subject as the dragon looking) as if he were leaping up, but still in the deep. There will be no mistake.\n\n5. In the fifth line, undivided, (we see its subject as) the dragon on the wing in the sky. It will be advantageous to meet with the great man.\n\n6. In the sixth (or topmost) line, undivided, (we see its subject as) the dragon exceeding the proper limits. There will be occasion for repentance.\n\n7. (The lines of this hexagram are all strong and undivided, as appears from) the use of the number nine. If the host of dragons (thus) appearing were to divest themselves of their heads, there would be good fortune.",
  "lines": [
    {
      "line": 1,
      "legge_line_text": "In the first (or lowest) line, undivided, (we see its subject as) the dragon lying hid (in the deep). It is not the time for active doing."
    },
    {
      "line": 2,
      "legge_line_text": "In the second line, undivided, (we see its subject as) the dragon appearing in the field. It will be advantageous to meet with the great man."
    },
    {
      "line": 3,
      "legge_line_text": "In the third line, undivided, (we see its subject as) the superior man active and vigilant all the day, and in the evening still careful and apprehensive. (The position is) dangerous, but there will be no mistake."
    },
    {
      "line": 4,
      "legge_line_text": "In the fourth line, undivided, (we see its subject as the dragon looking) as if he were leaping up, but still in the deep. There will be no mistake."
    },
    {
      "line": 5,
      "legge_line_text": "In the fifth line, undivided, (we see its subject as) the dragon on the wing in the sky. It will be advantageous to meet with the great man."
    },
    {
      "line": 6,
      "legge_line_text": "In the sixth (or topmost) line, undivided, (we see its subject as) the dragon exceeding the proper limits. There will be occasion for repentance."
    }
  ],
  "notes": [
    "The Text under each hexagram consists of one paragraph by king Wan, explaining the figure as a whole, and of six (in the case of hexagrams 1 and 2, of seven) paragraphs by the duke of Zau, explaining the individual lines.",
    "Each hexagram consists of two of the trigrams of Fu-hsi, the lower being called 'the inner,' and the one above 'the outer.' The lines, however, are numbered from one to six, commencing with the lowest.",
    "'The dragon' is the symbol employed by the duke of Zau to represent 'the superior man' and especially 'the great man,' exhibiting the virtues or attributes characteristic of heaven. The creature's proper home is in the water, but it can disport itself on the land, and also fly and soar aloft. It has been from the earliest time the emblem with the Chinese of the highest dignity and wisdom, of sovereignty and sagehood, the combination of which constitutes 'the great man.'",
    "The dragon appears in the sixth line as going beyond the proper limits. The ruling-sage has gone through all the sphere in which he is called on to display his attributes; it is time for him to relax. The line should not be always pulled tight; the bow should not be always kept drawn. The unchanging use of force will give occasion for repentance. The moral meaning found in the line is that 'the high shall be abased.'",
    "The meaning given to the supernumerary paragraph is the opposite of that of paragraph 6. The 'host of dragons without their heads' would give us the next hexagram, or Khwan, made up of six divided lines. Force would have given place to submission, and haughtiness to humility; and the result would be good fortune."
  ]
}
```

---

## BEGIN PROCESSING

You are now ready to process Gate 1.

**Instructions**:
1. Execute Phase 0 (Pre-Flight Validation)
2. Execute Phase 1 (Weight Assignment)
3. Execute Phase 2 (Evidence Extraction)
4. Execute Phase 3 (Output Generation)
5. Run Quality Gates checklist
6. Output the two JSON files

**Remember**: This is deterministic scoring. Same inputs MUST produce identical outputs across multiple runs.

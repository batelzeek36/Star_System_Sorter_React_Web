# Gate 2 Star System Scoring Prompt

## SYSTEM INSTRUCTIONS

You are a deterministic star system mapper generating academically rigorous, evidence-based weights for Human Design gate.line combinations.

**Input Files (REQUIRED)**:
- `GPT-5/combined-baselines-4.2.json` - 8 star system baselines with core_themes, shadow_themes, and quick_rules
- `claude/Full Pass/gate-2-full.json` - Complete Line Companion text for all 6 lines (non-padded)
- `claude/I-Ching-Full-Pass/hexagram-02.json` - Complete Legge I Ching text for all 6 lines (zero-padded)

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
- [ ] `claude/Full Pass/gate-2-full.json` (non-padded gate number)
- [ ] `claude/I-Ching-Full-Pass/hexagram-02.json` (zero-padded hexagram number)

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

**Objective**: Score all 8 star systems against complete source texts for lines 2.1 through 2.6, then select top-2 systems per line.

### Step 1: Read Complete Source Texts
For each line 2.1 through 2.6:
- Read the **COMPLETE** Line Companion text from `gate-2-full.json`
- Read the **COMPLETE** Legge I Ching text from `hexagram-02.json`
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
ERROR: Pairwise exclusion violated: {system1} and {system2} in line 2.{L}
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
**Source**: `hexagram-02.json`, same line number as gate.line

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
**Source**: `gate-2-full.json`, any line within the gate (line-agnostic)

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
   ERROR: Quote exceeds 25 words in 2.{L} for {system}
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
**Path**: `GPT-5/star-maps/gateLine_star_map_Gate02.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "02",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5",
    "sum_unorm": 1.87
  },
  "02.1": [
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
  "02.2": [
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
- **Keys**: Sorted ascending (`"02.1"`, `"02.2"`, ..., `"02.6"`)
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
**Path**: `GPT-5/evidence/gateLine_evidence_Gate02.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "02",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5"
  },
  "02.2": [
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
- **Keys**: Sorted ascending (`"02.1"`, `"02.2"`, etc.)
- **Value**: Array of evidence objects (max 2 per line, matching top-2 from weight file)

#### Evidence Object Fields:

**star_system**: Canonical name (must match weight file exactly)

**sources**: Object with two sub-objects:
- **legge1899**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Hex 2, Line {L}"` (e.g., `"Hex 1, Line 2"`)
  - `attribution`: Always `"Legge 1899"`
  
- **line_companion**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Gate 2, Line {L}"` (may be different line than gate.line being scored)
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
ERROR: Pairwise exclusion violated in line 2.{L}
Systems: {system1} (weight {w1}) and {system2} (weight {w2})
Rule: {rule_description}
```
**STOP. Do not proceed.**

**If more than 2 systems have weight >0**:
```
ERROR: Top-2 constraint violated in line 2.{L}
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
Line: 2.{L}
System: {system}
Source: {legge1899 or line_companion}
Quote: "{quote_text}"
Word count: {count}
```
**STOP. Do not proceed.**

**If quote is not verbatim**:
```
ERROR: Quote is not verbatim from source
Line: 2.{L}
System: {system}
Source: {source_file}
Extracted: "{extracted_quote}"
```
**STOP. Do not proceed.**

### Graceful Degradation:

**If Line Companion text missing for a line**:
- Use Legge text only for scoring
- In evidence file: `"line_companion": { "quote": "", "locator": "Gate 2, Line {L}", "attribution": "Ra Uru Hu (LC)" }`
- Reduce confidence by 1 level

**If Legge text missing for a line**:
```
ERROR: Legge text missing for Hex 2, Line {L}
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
- [ ] Run validation: `python GPT-5/scripts/validate_schemas.py --weights GPT-5/star-maps/gateLine_star_map_Gate02.json --evidence GPT-5/evidence/gateLine_evidence_Gate02.json`

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

### File 2: claude/Full Pass/gate-2-full.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Line Companion text verbatim into 'full_text' - no summarization, no trimming",
    "Copy line title verbatim into 'hd_title'",
    "Return exactly six lines (1–6)"
  ],
  "gate": 2,
  "gate_name": "Direction of the Self",
  "source": "Line Companion (Ra Uru Hu)",
  "lines": [
    {
      "line": 1,
      "hd_title": "Intuition",
      "full_text": "The first line always gives you the basis. It is called Intuition here. It says, as an overview: Sensitivity to disharmony and atrophy. This is very important.\n\nVenus exalted. The importance of aesthetics, whether inborn or acquired. What is direction? One of the things that pleased me the most about Human Design was that it was pretty. It has to do with aesthetics. It sounds poetic, but it is true that our direction is about trying to find the most beautiful way. It really is our direction. We are trying to find a way to avoid ugliness and disharmony, so the importance of aesthetics, whether inborn or acquired.\n\nMars in detriment. The assertion of ego in spite of wisdom. Look, this is a first line. It tries to figure out what the direction is. What is the direction and how does that direction work?\n\nIn the white book: Higher knowing through aesthetics. The thing to recognize about our direction is that what we are trying to find, what everybody is looking for, what people call paradise, happiness, bliss, is a direction that brings us pleasure and that brings us beauty and harmony in this life. It is not such a bad thing to know that humanity, at its foundation, in terms of the direction it is moving towards, is looking for beauty and harmony. It does not mean that it is going to get it. However, it is a very nice place to go.\n\nThe other thing is that ego, willpower, is not what direction is all about. It is not the ego that dictates whether you go this way or that way. Direction is not something we control. Direction is a mutative force.\n\nThe detriment here is: The urge for action that will ignore the wisdom of the Higher Self. The wisdom of the higher self says: the direction is already there. Do not impose will on this. People who have the first line in detriment will try many times in their life to alter direction by willpower only to discover that it is disastrous for them. Our direction is towards beauty and harmony. This is the Sphinx after all, and part of the great mystery of what the Sphinx is. Not bad; let's keep working at it. (It is my North Node.)\n\nYou will notice that in three of the six lines, the word 'ego' is mentioned. In the other three lines, where ego is not mentioned, it is implied. The great dilemma of the self is that ego is a motor and it always claims direction in this gate. The ego wants to be able to say, \"I am in charge of the direction\", rather than seeing that the driver simply drives and the passenger sits in the back seat. Whenever you see the ego applied here, understand that this is the basic conflict that always exists between G center gates and heart gates. The ego wants to make claims on the self."
    },
    {
      "line": 2,
      "hd_title": "Genius",
      "full_text": "The second line is Genius. It is a very special line when you think about what second lines are: the light in the room where people look in from the outside. Everybody looks at the 2.2 and says, \"They know where they are going.\" The person that has that second line, they do not know that they know where they are going. They may be deeply confused about where they are going. They may have no idea that they are in the right direction, but everybody is looking inside and saying, \"They know where they are going.\"\n\nUnconscious and unlearnable alignment of stimulus and response. The natural. That is somebody who is naturally going along in the right direction, not because they have the talent or the skills, but simply because that is what they are meant to do. The gift of all second lines is that they do not know how to interfere with themselves. That is a blessing because it just comes out. What happens, though, is that other people jump in and it is their interference that creates dilemmas. Others jump in and say, \"Do you realize that you are going in the right direction? That is terrificl\" Those others are pumping up their ego, trying to get that second line to think, \"Yes, it is me.\"\n\nThe natural. Saturn exalted. The inner strength to focus and realize. Just to be in your direction, without even knowing that this is a direction, means just to be in your life.\n\nWhen you come to the Mars in detriment, you have: Genius as madness. Knowledge exclusively as power for the enhancement of the ego. This is the moment where somebody steps in and looks inside, sees the 2 and their direction and says, \"Wow, you have really done it,\" and they say \"Yes, and I'll tell you how I did it.\" Then they really get into trouble. These are people that are always claiming that they have achieved power out of knowledge.\n\nIn the white book: A natural gift for unlearnable knowing; or The delusion that knowledge is power. This is the delusion that your direction is the result of your genius, your hard work, or of you being marvelous. Paper tigers. They will get a terrible surprise.\n\nThe driver in the lower trigram does not even know that there is a gas pedal at the other end and therefore, you can't expect that the capacity to drive is something that necessarily happens. They are always surprised that there is a gas pedal because they do not expect it to be there. They are basically just reading maps. The first line is looking at all the various maps that are around, and the second line has a map that is just wired into its brain. It is just there, but it does not mean that they go anywhere unless they get access to energy. Nor does it mean that they know how to handle the energy when it is there. It is one thing to be a good driver but if you don't know how to use the gas pedal, you can end up smashing into a tree simply because you are out of control or because you cannot handle the fuel. This is still lower trigram."
    },
    {
      "line": 3,
      "hd_title": "Patience",
      "full_text": "As you see when we discuss the gates of the G center, their lines are often very special in comparison to other lines of the same kind. This is particularly true for the 2.3. We know third lines represent an adaptation process. These are lines of trial and error. This is a highly exalted third line. Mutation is a matter of trial and error. This is something that we know. Mutative processes are going on all the time and they are trial and error until the right and most successful mutation takes place, takes hold and gains its strength. The other mutations just disappear because they were not productive. What that means is that the mutative process at its very best is exemplified through the third and the sixth lines. The third line provides, in the mutative process, just the right mix: trial and error to find the right mutation.\n\nSo here we have Patience. The teacher that never stops being a student. This is the trial and error. Everyone who carries the second gate is a teacher in life in the sense that they are always providing direction, whether they want to or not. That is what 'teacher' means in this sense, but they can never stop being a student in life. In other words, they think that they are in the right direction and something happens and they try something else, until they finally get it.\n\nJupiter exalted. Dedication to a lifetime of receptivity with the maturity to accept that the process never ends. Mutation is not going to stop. It is an ongoing process. We must never lose our vigilance and we must realize that all kinds of mutative possibilities are in the world at the same time looking for supremacy. In the same way that our genetic material is constantly in competition for which genes will dominate in the global gene pool, this is an ongoing process that we are involved in.\n\nWhen you get to the Uranus in detriment though, you get: For the revolutionary, patience is a vice. This is the pull of the ego again that says, \"Oh, not another change. This direction is the right one, and I will stay with it. I can't afford to go to another one.\" Or it is the opposite of that, which is jumping from one thing to the next rapidly, constantly breaking the bonds. This is very destabilizing. It is important to see that those people that have the 2.3 have to be aware that for them to have many directions in life is not only natural but healthy. It is healthy for them to break the bonds of direction and try another one until you finally see what really works in that sense.\n\nIn the white book: The recognition that receptivity is a lifelong process. For these people, it is an ongoing process of seeking out the mutative way. By the way, though it is a process that never ends, it does not mean to change direction until the end. They can mature into this process and simply become those that provide others with a guide to the best and the most mutative directions in life.\n\nOn the other side: Higher knowing that cannot wait and demands expression. The reason that this third line learns so much is that it does not know that there is a gas pedal and gets to meet it regularly. Because it is adaptive, every time that it gets a new fuel, it experiments with a new direction. People often misunderstand what that means: you may be the driver but the fact of the matter is that the driver alone does not control the direction. He can't. The driver cannot control the direction without the gas pedal and the fuel. An example: I am a carnivore. If I want food, I will look for a place that has meat. JOrgen is a vegetarian. If he wants to find food, he will go for a place that is vegetarian. We may both go in the same direction (we need to feed ourselves) but we will actually take a different course because the fuels are different.\n\nSo what happens to the third line is that it experiments with all the different fuels that it meets until it finds the fuel that works. What you have learned in terms of hexagram structure, resonance and harmonies, you can see right away what will happen to the third line: when it meets a 14.3 or a 14.6, it will find the kind of fuel that it can really work with. But it will still have to go through the dissonances, the difficulties of matching up with fuels that do not necessarily work. It is a learning process. But this is a very mutative line."
    },
    {
      "line": 4,
      "hd_title": "Secretiveness",
      "full_text": "When you get to the upper trigram, things change, obviously. You come to a transpersonal line that knows that there is something on the other side. All fourth lines are rooted in opportunism. Opportunism exists in all fourth lines and waits for the opportunity. Fourth lines are one -tracked and unidirectional. They are there to externalize.\n\nHere we have Secretiveness. More than modesty, the ability to preserve harmony through discretion. It is so important for a 2.4 to externalize the very foundation. In doing that, it has to be very careful about not letting other people interfere with the direction. This is an individual gate. Individuals, particularly in highly mutative gates, are not around to be influenced by anyone else. The whole business of direction carries with it a lot of weight. If a 2.4 is driving a car and you are driving with them and you both know where you think you are going, that 2.4 is not going to tell you until they make that funny left turn that they are going on their own direction. They have another way to get there. If they tell you beforehand, you are going to interfere, which will result in a problem.\n\nVenus exalted. The higher goal transcends personal acclaim. The team player, acknowledged as the leader but never the captain. Nobody wants a mutative person as their captain because they are unreliable, but they can be great leaders. In other words, the turning of the wheel in that direction may annoy the captain, but it may turn out to be good advice and good leadership and the captain will go along with it. The whole thing for 2.4's is to recognize the importance of secrecy in their life. Don't let other people in on the direction. Just do your thing. After all, individuals are here to be examples. They are not here to lead. They are not here to be witnesses. They are just here to be examples. This mutative direction is all about living it out as an example.\n\nWhen you come to the Mars in detriment: Loose lips sink ships. The unquenchable fire of the ego engenders enmity. This is the ego saying, \"I know that you are over there but I will make a left turn now, okay? I want to take a different way.\" Everybody else gets upset and the 2.4 says, \"I want to go this way and I know this way.\"\n\nIn the white book: Where higher knowing does not have to be expressed to be recognized; and the other side: The inability to keep silent when the opportunity arises for expression. This is what happens to the self the moment that the ego comes in: it creates all kinds of difficulties. It takes away the value of the possibility of spiritual recognition. Direction is something that is given to us and not something that we can claim.\n\nWhen I was a teenager in Canada, we had all kinds of movies that showed groups of three or four boys and one of them would be the acknowledged leader but this one would not have a driver's license. So, somebody would have to drive the car and the one who would do this would be the 2.4. If they kept it secret, they could enjoy being in charge of everybody by driving that car, even though the leader was sitting in the car. That is the exalted side, but the moment they say, \"Hey, we are going my way because it is my car,\" is the moment they get into trouble. That is the detriment."
    },
    {
      "line": 5,
      "hd_title": "Intelligent application",
      "full_text": "Fifth lines are the way society wants to see direction. The people with the 2.5 get projected on that they are the ones that know the direction, that they are the ones that have the way. The line is called: Intelligent application. The strategist. It is about developing a strategy of how to deal with that projection. If people project on you that you know the way, well, what do you do with that? Do you really know the way?\n\nThere are two sides to this. One side is the Mercury exalted. The strategist. Reasoned management of resources. After all, the 2.5 is at its very best; gas pedals are always recognizing them. Gas pedals always come up to them and say, \"You are the one that has the direction. Do you want my fuel?\" The whole thing for a 2.5 is to learn how to manage those resources because they do not have the resources themselves. That is inherent in the gate, but how it operates is dependent on the design. They are always looking for the resources from others that come to them and they manage those resources to be able to maintain their direction.\n\nThe other side, the Earth in detriment. The inability to share responsibility or recognize the abilities of others. Again, you can feel the flavor of the ego coming into this. The ego has always tainted the self in this way. This whole business about the inability to share responsibility: this is an individual gate, after all, which will take fuel but that does not mean that it is also taking somebody else's telling it where to go. It will not. The 2.5, even though it gets projected on that it is the one that knows the way, the moment that it refuses to take you, it gets projected on that it does not know the way or that the way it does know is the wrong way. This is the other side of the coin.\n\nIn the white book: Higher knowing as an exclusively individual and selfish process. What happens to these detriment people is that everybody is projecting on them that they have the direction and they push everybody away because they do not want to be interfered with and they keep their direction for themselves. \"You are going up into the mountains? Can I join you?\" \"No, I don't want you to tell me which way to go up the mountain. Do not dare to tell me. I am smart enough to go up into the mountains with somebody who is giving me the energy, but is not going to bug me. If I don't have it myself, I'll wait for a transit to get the fuel.\"\n\nThe 2.5 is always projected on that they have the direction and that they should be the driver. If you have a party and a couple of people are drunk, it is the 2.5 that everybody goes over to and says, \"Could you drive them home?\" Others think that the 2.5's know where these people live. If you are lost on a street and you end up asking somebody for direction, the person you think is the one that can tell you the way, whether or not they really can tell you, is probably a 2.5. You have this sense of, \"Ahal They know the way.\" They may or may not. If they do, you think they are wonderful and their reputation grows. If not, they run into problems.\n\nIf you project on them that they know the way and they get involved with the ego in that, they also run into problems. Individuality is not here to be best. Individuals go to hell the moment they try to be best at anything.\n\nThere is only individual connection of the ego that goes directly into the self, in order to be worked out in that case. It is one of the things about projection and the confusion between the self and the ego always to keep in mind. These people that get projected on, it is not because they know the direction. They are the direction. If you have the second gate, you are the direction."
    },
    {
      "line": 6,
      "hd_title": "Fixation",
      "full_text": "Sixth lines are always different than their hexagram because they are outside of the process. Here you have a line called Fixation with an overview that says: Unable or unwilling to see the whole picture. The first thing to recognize about this is that all sixth lines are desperate to see the whole picture. That is what a sixth line is all about. It sits on the roof and tries to get the best perspective that it possibly can to take everything in, and here is this sixth line and we have: unable, unwilling, to see the whole picture. Think about what mutation is all about. We absolutely must have mutation. It is essential for our evolutionary process. Society, humanity, the totality is dependent on direction, on this mutative force and then you have these sixth lines that do not want to mutate. Their not wanting to mutate is not of benefit to the totality; however, this is not about moral distinction. It is negative in this sense. That is why the negative is there. It is negative because it is denying mutative possibilities.\n\nThink about the 24.6 which is about the possibility of being deaf when opportunity knocks. This is very true of the 2.6. In other words, it is unable to see the whole picture, so it is not ready to mutate and, as such, may miss the opportunity for mutation and direction in its life. These people don't seem to be going anywhere, at least, not to themselves.\n\nMercury exalted. Less negative, though the intellect becomes absorbed in constant rationalization. I put you back to the 24.6 because it is the language of it. It takes you into what that process is all about: the possibility, literally, of not taking the opportunity to mutate because, if you are the 2.6 sitting there on top of the roof, you don't really see all the different roads that could be driven because you are limited in that way.\n\nIn the Saturn in detriment: The need for security may distort awareness to its ultimate perversion, destructiveness. This line is rarely understood. It resonates deeply with the 28.6, which is also part of the individual process: Blaze of glory, also a sixth line.\n\nRemember, our theme throughout this hexagram is the conflict between the exalted self and the ego in detriment. This is not about good or bad. That is simply the conflict that is inherent there. What happens in this part is that, unable to see or unwilling to see the whole picture, they get fixed, and what they get fixed on is mundane direction. They get fixed on dealing with what is on the other side (the 14), which is all about security and making money and bringing rewards into your life because the 14 is all about resources. It is about filling up your wagon. So, what happens to the 2.6 is that they get fixed on the mundane and in doing so, everything becomes their ego and, in that, becomes destructive of them. They don't mutate and, because of that, they go through all kinds of problems and they suffer because it is not up to their ego in that sense.\n\nIn the white book: Higher knowing that is extremely narrow in its receptivity. Even at the exalted level, chances are that you are not going to get mutation out of these forces but, as withh all sixth lines, it is possible. Like all sixth lines, there is the possibility to come down from the roof the moment there really is something that is of value, and the moment that one can see from that sixth line perspective that fulfillment can take place, whatever the circuitry dictates.\n\nIndividual circuitry, the knowing, centering and integration circuits, is enormously complex. In order for that 2.6 to decide on a direction, it has to deal with that whole circuitry. It is vast and so, it is deeply limited in that sense. However, the mutations that do come out of the 2.6 are very powerful because they are very selective mutations. They can be good for us and bad.\n\nThe joke is that before the 2.1, is the 24.6. In other words, the individuality in the 24.6 leads to the 2.1, and when you get to the 2.6, this leads to the 23.1, Prose !ytization, which is about the ability to explain yourself. That is why you have the limitation here. The limitation is this sense of, \"Wow, it is not just a direction. It is that I have to be able to explain the direction,\" and this is very difficult because this is always the dilemma for the individual process, to be able to explain knowing. The 2.6 is looking out and saying, \"Oh, boy. I have to explain this because otherwise, I will not get other people onto this direction and if I can't get them onto this direction, it is not mutative and it will not work. \"\n\nThat is why the 2.6 is rationalizing. That is why intellect is mentioned in this line. The mind is constantly trying to figure out: what is a direction that I can actually explain? Because that really is the key."
    }
  ],
  "aliases": [
    "The Gate of the Direction of the Self",
    "The Receptive"
  ]
}
```

### File 3: claude/I-Ching-Full-Pass/hexagram-02.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Legge text verbatim into `full_text` (Judgment + Lines + Xiang if present).",
    "Each `lines[i].legge_line_text` is copied verbatim.",
    "Return exactly six lines (1–6).",
    "Do not invent or alter punctuation/romanization.",
    "Legge 1899 only (public domain)."
  ],
  "hexagram": 2,
  "hexagram_name_legge": "Khwan",
  "source": {
    "work": "I Ching",
    "translator": "James Legge",
    "edition_year": 1899,
    "public_domain": true
  },
  "judgment_text": "Khwan (represents) what is great and originating, penetrating, advantageous, correct and having the firmness of a mare. When the superior man (here intended) has to make any movement, if he take the initiative, he will go astray; if he follow, he will find his (proper) lord. The advantageousness will be seen in his getting friends in the south-west, and losing friends in the north-east. If he rest in correctness and firmness, there will be good fortune.",
  "image_text": null,
  "addendum": {
    "type": "supplementary_line",
    "text": "(The lines of this hexagram are all weak and divided, as appears from) the use of the number six. If those (who are thus represented) be perpetually correct and firm, advantage will arise."
  },
  "full_text": "Khwan (represents) what is great and originating, penetrating, advantageous, correct and having the firmness of a mare. When the superior man (here intended) has to make any movement, if he take the initiative, he will go astray; if he follow, he will find his (proper) lord. The advantageousness will be seen in his getting friends in the south-west, and losing friends in the north-east. If he rest in correctness and firmness, there will be good fortune.\n\n1. In the first line, divided, (we see its subject) treading on hoarfrost. The strong ice will come (by and by).\n\n2. The second line, divided, (shows the attribute of) being straight, square, and great. (Its operation), without repeated efforts, will be in every respect advantageous.\n\n3. The third line, divided, (shows its subject) keeping his excellence under restraint, but firmly maintaining it. If he should have occasion to engage in the king's service, though he will not claim the success (for himself), he will bring affairs to a good issue.\n\n4. The fourth line, divided, (shows the symbol of) a sack tied up. There will be no ground for blame or for praise.\n\n5. The fifth line, divided, (shows) the yellow lower garment. There will be great good fortune.\n\n6. The sixth line, divided, (shows) dragons fighting in the wild. Their blood is purple and yellow.\n\n7. (The lines of this hexagram are all weak and divided, as appears from) the use of the number six. If those (who are thus represented) be perpetually correct and firm, advantage will arise.",
  "lines": [
    {
      "line": 1,
      "legge_line_text": "In the first line, divided, (we see its subject) treading on hoarfrost. The strong ice will come (by and by)."
    },
    {
      "line": 2,
      "legge_line_text": "The second line, divided, (shows the attribute of) being straight, square, and great. (Its operation), without repeated efforts, will be in every respect advantageous."
    },
    {
      "line": 3,
      "legge_line_text": "The third line, divided, (shows its subject) keeping his excellence under restraint, but firmly maintaining it. If he should have occasion to engage in the king's service, though he will not claim the success (for himself), he will bring affairs to a good issue."
    },
    {
      "line": 4,
      "legge_line_text": "The fourth line, divided, (shows the symbol of) a sack tied up. There will be no ground for blame or for praise."
    },
    {
      "line": 5,
      "legge_line_text": "The fifth line, divided, (shows) the yellow lower garment. There will be great good fortune."
    },
    {
      "line": 6,
      "legge_line_text": "The sixth line, divided, (shows) dragons fighting in the wild. Their blood is purple and yellow."
    }
  ],
  "notes": [
    "Hexagram Khwan represents receptivity, submission, and the earth principle in contrast to Hexagram 1 (Ch'ien/Qian) which represents creativity and heaven.",
    "All six lines are divided (yin) lines, symbolizing complete receptivity and yielding.",
    "The imagery of the mare emphasizes docility combined with strength in service.",
    "Line 7 is a supplementary statement about using the number six, characteristic of this hexagram's all-yin nature."
  ]
}
```

---

## BEGIN PROCESSING

You are now ready to process Gate 2.

**Instructions**:
1. Execute Phase 0 (Pre-Flight Validation)
2. Execute Phase 1 (Weight Assignment)
3. Execute Phase 2 (Evidence Extraction)
4. Execute Phase 3 (Output Generation)
5. Run Quality Gates checklist
6. Output the two JSON files

**Remember**: This is deterministic scoring. Same inputs MUST produce identical outputs across multiple runs.

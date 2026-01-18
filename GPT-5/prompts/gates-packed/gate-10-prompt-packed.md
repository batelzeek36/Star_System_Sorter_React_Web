# Gate 10 Star System Scoring Prompt

## SYSTEM INSTRUCTIONS

You are a deterministic star system mapper generating academically rigorous, evidence-based weights for Human Design gate.line combinations.

**Input Files (REQUIRED)**:
- `GPT-5/combined-baselines-4.2.json` - 8 star system baselines with core_themes, shadow_themes, and quick_rules
- `claude/Full Pass/gate-10-full.json` - Complete Line Companion text for all 6 lines (non-padded)
- `claude/I-Ching-Full-Pass/hexagram-10.json` - Complete Legge I Ching text for all 6 lines (zero-padded)

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
- [ ] `claude/Full Pass/gate-10-full.json` (non-padded gate number)
- [ ] `claude/I-Ching-Full-Pass/hexagram-10.json` (zero-padded hexagram number)

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

**Objective**: Score all 8 star systems against complete source texts for lines 10.1 through 10.6, then select top-2 systems per line.

### Step 1: Read Complete Source Texts
For each line 10.1 through 10.6:
- Read the **COMPLETE** Line Companion text from `gate-10-full.json`
- Read the **COMPLETE** Legge I Ching text from `hexagram-10.json`
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
ERROR: Pairwise exclusion violated: {system1} and {system2} in line 10.{L}
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
**Source**: `hexagram-10.json`, same line number as gate.line

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
**Source**: `gate-10-full.json`, any line within the gate (line-agnostic)

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
   ERROR: Quote exceeds 25 words in 10.{L} for {system}
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
**Path**: `GPT-5/star-maps/gateLine_star_map_Gate10.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "10",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5",
    "sum_unorm": 1.87
  },
  "10.1": [
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
  "10.2": [
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
- **Keys**: Sorted ascending (`"10.1"`, `"10.2"`, ..., `"10.6"`)
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
**Path**: `GPT-5/evidence/gateLine_evidence_Gate10.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "10",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5"
  },
  "10.2": [
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
- **Keys**: Sorted ascending (`"10.1"`, `"10.2"`, etc.)
- **Value**: Array of evidence objects (max 2 per line, matching top-2 from weight file)

#### Evidence Object Fields:

**star_system**: Canonical name (must match weight file exactly)

**sources**: Object with two sub-objects:
- **legge1899**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Hex 10, Line {L}"` (e.g., `"Hex 1, Line 2"`)
  - `attribution`: Always `"Legge 1899"`
  
- **line_companion**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Gate 10, Line {L}"` (may be different line than gate.line being scored)
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
ERROR: Pairwise exclusion violated in line 10.{L}
Systems: {system1} (weight {w1}) and {system2} (weight {w2})
Rule: {rule_description}
```
**STOP. Do not proceed.**

**If more than 2 systems have weight >0**:
```
ERROR: Top-2 constraint violated in line 10.{L}
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
Line: 10.{L}
System: {system}
Source: {legge1899 or line_companion}
Quote: "{quote_text}"
Word count: {count}
```
**STOP. Do not proceed.**

**If quote is not verbatim**:
```
ERROR: Quote is not verbatim from source
Line: 10.{L}
System: {system}
Source: {source_file}
Extracted: "{extracted_quote}"
```
**STOP. Do not proceed.**

### Graceful Degradation:

**If Line Companion text missing for a line**:
- Use Legge text only for scoring
- In evidence file: `"line_companion": { "quote": "", "locator": "Gate 10, Line {L}", "attribution": "Ra Uru Hu (LC)" }`
- Reduce confidence by 1 level

**If Legge text missing for a line**:
```
ERROR: Legge text missing for Hex 10, Line {L}
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
- [ ] Run validation: `python GPT-5/scripts/validate_schemas.py --weights GPT-5/star-maps/gateLine_star_map_Gate10.json --evidence GPT-5/evidence/gateLine_evidence_Gate10.json`

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

### File 2: claude/Full Pass/gate-10-full.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Line Companion text verbatim into 'full_text' - no summarization, no trimming",
    "Copy line title verbatim into 'hd_title'",
    "Return exactly six lines (1–6)"
  ],
  "gate": 10,
  "gate_name": "Behavior of the Self",
  "source": "Line Companion (Ra Uru Hu)",
  "lines": [
    {
      "line": 1,
      "hd_title": "Modesty",
      "full_text": "The line is called Modesty. I have a nickname for this line. I call this line the line of the chameleon. Think of the nature of genetic continuity as it applies to the 10.1.\n\nThe line is called Modesty. I have a nickname for this line. I call this line the line of the chameleon. Always. The moment that you try to tell them that they are not acting correctly, you deeply offend them and they suffer from hurt feelings, of course, because inside of them, genetically, they know (this is all about knowing) that their behavior is correct.\n\nIn the white book. The ability to know one's place and how to act despite circumstances. This is the answer to having a second class ticket. So what? Sit in second class, so what? I get on airplanes across the Atlantic Ocean and there are all those people in first class. I have a second class ticket. What to do? I will not complain and whine that I don't have a first class ticket. I have a second class ticket. Sit in second class. Accept your place. It is hard for human beings to just accept what the gods have dished out for them. It is the only way. This is the correct behavior and it is the foundation of all behavior. It is the foundation of the behavior that creates perfected form. It is the foundation of the behavior for the perfection of conviction. It is the foundation of the behavior to be awake. Accept your place."
    },
    {
      "line": 2,
      "hd_title": "The Hermit",
      "full_text": "Here in the 10th gate you have a theme of behavior, a code of behavior for all second lines which is being The Hermit. The overview says: The successful side-stepping of behavioral requirements... ('Behavioral requirements' is conditioning.) ...through isolation. We have seen in our work together that all second lines tend to suffer from the fact that they don't know that there is somebody who will burst in on them and see them and try to condition them because they can see into them. The hermit is the correct behavior: withdraw rather than accept conditioning away from what is your nature.\n\nMercury exalted. Mental functions enrich aloneness. Mars in detriment. The angry exile. Whichever way that comes out, it is better to withdraw than to accept the conditioning. To be the hermit is so important. The other thing is: in the genetic continuity, as in the 12.2 Purification, The Hermit is somebody who has to rigorously withdraw from negative forces. That is the role of the behavior of the hermit: it is not simply to withdraw, but to withdraw from negative forces, not from all forces. Negative forces are those forces that apply conditioning and try to change the nature of the hermit, to bring the hermit out of his isolation.\n\nIn the white book: Independent behavior through isolation, or Isolation to preserve independent behavior in the face of conditioning. That is the most important aspect of it because that is the real key to all second lines. The moment that somebody is trying to break in on your second line and condition you, withdraw. It is better for you to withdraw and be in your own process because this is what is healthy and it is the only way in which you are going to find love for yourself.\n\nThink about that. What happens is that when people recognize you for something and they pull on you, you tend to confuse that with love. It is not; nor should it be. That is, those people that can look into you and try to pull you, they try to pull you by getting you to recognize your nature and turn it into something motivated. They try to pump you up. This has nothing to do with the role of the hermit. The role of the hermit is to avoid such conditioning in order to have an opportunity to be awake."
    },
    {
      "line": 3,
      "hd_title": "The Martyr",
      "full_text": "We come to the story of the third line which is about martyrs. Think about the nature of what the third line is. It is always in a situation (lower trigram) in which it tries to get out of its process, only to be confronted by the outside. In the moment of being confronted by the outside, it is being forced to adapt because it was not prepared for what was there on the outside. In the nature of behavior, when you come to the third line, you come to trial and error in the process of behavior. Now, remember that third lines can lead to the sixth line of wisdom. That trial and error in behavior can be something that is of enormous value to humanity, but, at the same time, it is a trial and error process. What may be discovered by living out that trial and error is something else. It may turn out to be something that is of value.\n\nThe Martyr overview line: The futile rejection of standards based on a just awareness. Futile rejection: it does not do any good to reject it. Here are human beings who, without choice, have a genetic code for behavior and that code of behavior, because it is trial and error, will often be in conflict with the behavior of those that surround it and meet it. No matter how much they live out their own nature, they are constantly going to meet resistance from those around them. Of course, it is not easy for them to give up that nature. It is, after all, what they are.\n\nThe Earth exalted. The martyr as an enduring example whose behavior is ultimately enshrined. When a human being is living out their own nature, whether anybody likes it or not in the now, that has nothing to do with whether or not it is truly of value. The 10th gate is individual and deeply related in that sense to the first gate in the self, to its individuality. It speaks about this process of time, that as a creative process, to have different behavior than other people is not something that is recognized in your own time necessarily as a possible variation that others can follow. It simply may be seen as disruptive, anti-social, freakish and a threat, most of all. After all, behavior is the most important conditioning we get. It can be very threatening to have somebody whose behavior has impact on others and who becomes a role model (sixth line).\n\nThe other thing is that, being individual, this is a behavior that can be mutative and can bring about change and most of all, individuals and individual aspects are always seeking attention. Therefore, the behavior of the 10 and the 10.3 is always getting attention: \"You should not act like that, Johnny.\" \"Stop picking your nose, Johnny.\" He may do it for the rest of his life until somebody slaps him in the face, until his behavior so violates the standards or the norms that somebody resists it. Remember, all of these gates of the self are always dependent on what they meet as beings on the other side.\n\nThe Moon in detriment. The martyr complex. The active pursuit of martyrdom for personal aggrandizement. Here the ego is touched. These are people who make a living from their behavior. The way these people act in the world attracts attention and because of that, they maintain that behavior in order to continue to maintain that attention.\n\nIn the white book: Behavior that is ultimately challenged by others. I tell all 10.3's when someone challenges them: \"If it is your nature, martyr away because the more people resist you the better you know that you are living yourself.\" So many of these people have very thin skins and they are so easily upset by what other people say or comment on about the nature of their behavior.\n\nOften their reaction is going to the other side: Behavior as a way to attract attention. \"If you don't like my behavior, watch me because I will not change it,\" and they use it to their advantage to attract attention. They can, they do, and they will. Then you see the impact on the self of having other forces come and impose on them and condition them."
    },
    {
      "line": 4,
      "hd_title": "The Opportunist",
      "full_text": "Dealing with the upper trigram, we have a different process at work because the fourth and fifth lines are rather gifted in the sense that they are going to recognize not only that there is one other source of conditioning, but that they are going to come to grips with all three other sources. In other words, the fourth and fifth lines of the 10th hexagram have deep transpersonal skills because they do have recognition of the impact of the other.\n\nThe fourth line as a behavior is a code for all fourth lines for this one-tracked-ness, the fixedness. Its behavioral code is The Opportunist. The acceptance of norms until a successful transformation can be engendered. It is very important to understand that. The whole thing about the nature of the behavior in the fourth line is that it has to wait for its opportunity, which means that it cannot give up behavior until there is a place to go with that behavior.\n\nMy analogy for this is: if you have a job and you are a 10.4 and you want a new job, you cannot quit your job until you have a new one. This is opportunism. You stay with the nature of your fixedness until there is an opportunity or you wait simply for that opportunity to externalize your fixedness. Again, there is always the possibility that the opportunist has enormous influence: to be able to wait for the right moment to act can often lead to a great deal of good fortune or success.\n\nWe have this overview and so it takes time: the acceptance of norms until a successful transformation can be engendered. Accept the nature of your behavior until the behavior can really change. Somebody who has the 10.4 and is deeply conditioned and they come to Human Design. They are not going to be able to change their nature. They will not be able to change their nature until that opportunity is really there for them. That opportunity has to be there. For example, you are a generator and you are a 10.4. You cannot just suddenly become a generator. You have to wait for that opportunity when somebody says to you, \"Excuse me, could you help me?\" and you go, \"Uh-huh.\" Then you can jump into that behavior: to wait for the opportunity.\n\nUranus exalted. Transformation that is transcendence to a higher code. The whole thing about the opportunist is that you are looking for the opportunity to externalize your nature and that is the highest possible code. There is nothing higher.\n\nMercury in detriment. Opportunism as a game and/or mental exercise. Most of that is because the 10th gate has no guarantee that it is going to have access to a motor in order to manifest. So often it is speculating on those moments of opportunity when they may not arrive, or they are the kind of people who think, \"Here is a perfect opportunity to make a million dollars,\" but never do it because it is a game, and because they do not have within themselves, within the nature of their design, the real opportunity to live out that opportunism.\n\nIn the white book: The maintaining of behavioral patterns until the right moment and opportunity for transformation. It is so important for 10.4's just to sit back and wait for that moment to live out their nature. The other side: Altering one's behavioral patterns in order to take advantage of opportunities. It is the same thing, just on the other side but it is also speculative. It is waiting for those opportunities and they may not be ready to do that at that moment. Remember, not everybody who has the 10.4 is going to be a manifestor or a generator. They may not have the opportunity to act it out and then it becomes something game4ike or speculative."
    },
    {
      "line": 5,
      "hd_title": "The Heretic",
      "full_text": "The 10.5 has enormous impact on society. After all, the 10 is part of Integration and Integration is the backbone of being in the body, of being individuated. The 10.5 is where society projects onto behavior and onto how it wants to see behavior. Society sees the behavior at its most interesting as being heretical. It is society that sees if your behavior is unique and individual and it in fact may be dangerous to the whole. All fifth lines are at one time exciting and at another time a threat to society because it is the source of society's projections and, therefore, can be the source of society's disappointment if those projections fail.\n\nWhen you come to the fifth line, you come to The Heretic. As an overview line it says: Direct and overt challenge to norms. One of the things to realize about the 10.5 is the need of society for a heretic, for a behavior that will challenge the norms. It is society that creates The Heretic, that creates The General, that creates all of these roles: The Savior, The Saint, all of these figures. It is society that creates it out of its own needs and its owi4 projections. The heretic is created by society because they project onto the behavior of the 10.5 that it is either very exciting or very threatening.\n\nJupiter exalted. The ability to succeed through the understanding and expression of higher principles. Mars in detriment. The burning 0~ie stake. What exactly is the difference? There is a profound difference. Remember that the fifth line is there to challenge the norms of society. In the white book: Principled behavior which directly challenges tradition. This is not a challenge to the way an individual acts in the world. This is not going up to somebody who has a rooster haircut and picking on them because they have a rooster haircut. This is not dealing with tradition. This is just dealing with unusual behavior. When you look at the other side, the Mars side: Behavior which directly challenges behavior and is eventually punished. If you go up to the punk and say, \"This is ridiculous, nobody should walk around like this\", don't be surprised if they rearrange your face.\n\nThe fact of the matter is that the heretic is at its greatest when they attack the framework of behavior that has to be changed. Because the 10.5 is the vanguard of changing behavior, if they just attack the behavior on the surface they are the ones that suffer. They get burned at the stake because it becomes very personal. They are here to try to challenge the underlying tradition. If they do that, ultimately, they can be regarded as a very special force in the world.\n\nHow they are going to react is again subject to the conditioning that they receive themselves. The 10.5 that has no fuel and no access to awareness or no access to manifestation is always going to be conditioned by others. A 10.5 being conditioned by somebody else's awareness may end up attacking somebody's behavior and being punished for it simply because they were conditioned that way, rather than that being the most natural and healthy way for them. It is a very important line because, again, society has been calling for this. It is calling for a heretic that will challenge tradition and, in challenging tradition, provide mutation for behavior.\n\nVery interesting is the genetic continuity here, particularly because the genetic continuity as seen through the mystical process is the relationship between the 10.5 and the 49.5. The 49th gate is a gate of being the sacrificer and the sacrificed. It is the gate of emotional principles and the fifth line in its exalted form is about providing practical provisions for revolutionary times, in the same way that the heretic really brings something very practical when they deal with the tradition itself. That is what they are equipped to do: to look at the tradition and to see whether or not a tradition deserves to stand or whether or not it is time for mutation of behavior.\n\nPractical provisions: in the detriment of the 49.5 you have the same Mars in detriment, which is all about power. The moment that you make things personal is the moment that you get into a power trip with people. For example, you say to them, \"Your behavior stinks,\" and they return, \"Your behavior stinks.\" Nothing productive will come out of that. In order to change the behavior of society, what has to be dealt with and challenged is the underlying tradition out of which that behavior has risen. Practical provisions; otherwise expect to be sacrificed."
    },
    {
      "line": 6,
      "hd_title": "The Role Model",
      "full_text": "If you will look in this life for people that are the most self-conscious, you will find them in the 10.6. They are constantly under pressure, constantly self-concerned about the nature of their behavior. Built into them is the understanding that behavior can be hypocritical. They recognize that. The line is called The Role Model.\n\nA very powerful line: The perfect expression of the norms through action rather than words. They learn their self-consciousness well with their harmony to the 20.3, Self-awareness, or through the 57.3, Acuteness. They learn to recognize very quickly in their life that it is possible to say things but not necessarily possible to live them out. They see that very early. They recognize within themselves that their behavior is very important. But no matter how much they want to be able to behave perfectly, they always run into obstacles because they end up being conditioned by the people around them that they are dependent on. Even the words can only come out if there is a connection to the 20 and the awareness can only guide it if there is a 57 and the energy is only there if there is a 34.\n\nRemember that sixth lines look to the whole circuit, but the first thing a 10.6 looks at is Integration. It says, \"How can I maintain the holiness of myself. How can I guarantee my survival in the world? How can I be me? How can I do what is right for me to do in the world?\" All of that ends up being dependent on so many other beings.\n\nPluto exalted. The constant example that refocuses the complacent on the basic integrity of set behavior. They know how important behavior is. If you have a 10.6 parent, you will discover that, while they are picking their nose, they tell you, \"Don't pick yours: bad behavior.\" 10.6's recognize that correct behavior is very important. What is frustrating is that, because they know that better than anybody else and because so often they can't live it out, they would rather not be seen. They would rather sit on the roof and not be anybody's example because, even though they can be hypocritical, they suffer a great deal from their own hypocrisies.\n\nThe other side of this is Saturn in detriment. The hypocrite. Do as I say, not as I do. We have seen this as a gift in all sixth lines: the 40.6 that sits on top of the house and looks to its family and says, \"I see who is messing things up here,\" and can easily point it out. The 10.6 has this deep capacity to point out to you what is the correct behavior. By the way, I tell these people: go ahead. Tell other people how to behave. It is part of your gift and don't feel self-conscious because you yourself can't act the way you tell other people to act. Everybody has to accept their limitation, whatever it happens to be. This 10.6 leads to the 20.6, to the line of wisdom. There is an enormous potential here to be awake to the beauty of self, but this is not an easy process.\n\nIn the white book: The enduring value of expression of the Self through action rather than words. In the end it all comes down to the same thing. It comes down to how you live in the world. The only action that matters, whether it is action that you generate or manifest or whether it is action that is conditioned as manifestation or generation in your life, it that you cannot be taken away from your nature. As long as you are not taken away from your nature, you are an example for others. This is the great value of the 10th gate and, as an example for others, you are a source of wisdom for them in their lives.\n\nOf all the sixth lines that we have looked at, none makes a more beautiful turn than the 10.6 because the 10.6 goes to the 58.1. It goes to The Joyous and it goes to the most beautiful line of the 384: the line of Love of life. In the end, the 10.6 must find for itself love of life and the vitality that comes from loving life. It is not the vitality that creates the love of life. It is the love of life that creabs the vitality. Th., 10.6 sits up there and knows the correct behavior but it also knows that that behavior is what brings about the love - life and out of that love of life comes the power to correct the collective, comes the power to establish new patterns, comes the power to release the example in the world. Good luck.\n\nIt always brings me back to where I started 1 1 years ago. When we go through this process of looking at the G center, it brings me back to my own mantra: You are unique. You have no choice. Love yourself. There is nothing else. There really is nothing else."
    }
  ],
  "aliases": [
    "The Gate of Behavior of the Self",
    "Treading"
  ]
}
```

### File 3: claude/I-Ching-Full-Pass/hexagram-10.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Legge text verbatim into `full_text` (Judgment + Lines + Xiang if present).",
    "Each `lines[i].legge_line_text` is copied verbatim.",
    "Return exactly six lines (1–6).",
    "Do not invent or alter punctuation/romanization.",
    "Legge 1899 only (public domain)."
  ],
  "hexagram": 10,
  "hexagram_name_legge": "Lî",
  "source": {
    "work": "I Ching",
    "translator": "James Legge",
    "edition_year": 1899,
    "public_domain": true
  },
  "judgment_text": "(Lî suggests the idea of) one treading on the tail of a tiger, which does not bite him. There will be progress and success.",
  "image_text": null,
  "addendum": {
    "type": null,
    "text": null
  },
  "full_text": "X. The Lî Hexagram.\n\n(Lî suggests the idea of) one treading on the tail of a tiger, which does not bite him. There will be progress and success.\n\n1. The first line, undivided, shows its subject treading his accustomed path. If he go forward, there will be no error.\n\n2. The second line, undivided, shows its subject treading the path that is level and easy;—a quiet and solitary man, to whom, if he be firm and correct, there will be good fortune.\n\n3. The third line, divided, shows a one-eyed man (who thinks he) can see; a lame man (who thinks he) can walk well; one who treads on the tail of a tiger and is bitten. (All this indicates) ill fortune. We have a (mere) bravo acting the part of a great ruler.\n\n4. The fourth line, undivided, shows its subject treading on the tail of a tiger. He becomes full of apprehensive caution, and in the end there will be good fortune.\n\n5. The fifth line, undivided, shows the resolute tread of its subject. Though he be firm and correct, there will be peril.\n\n6. The sixth line, undivided, tells us to look at (the whole course) that is trodden, and examine the presage which that gives. If it be complete and without failure, there will be great good fortune.",
  "lines": [
    {
      "line": 1,
      "legge_line_text": "The first line, undivided, shows its subject treading his accustomed path. If he go forward, there will be no error."
    },
    {
      "line": 2,
      "legge_line_text": "The second line, undivided, shows its subject treading the path that is level and easy;—a quiet and solitary man, to whom, if he be firm and correct, there will be good fortune."
    },
    {
      "line": 3,
      "legge_line_text": "The third line, divided, shows a one-eyed man (who thinks he) can see; a lame man (who thinks he) can walk well; one who treads on the tail of a tiger and is bitten. (All this indicates) ill fortune. We have a (mere) bravo acting the part of a great ruler."
    },
    {
      "line": 4,
      "legge_line_text": "The fourth line, undivided, shows its subject treading on the tail of a tiger. He becomes full of apprehensive caution, and in the end there will be good fortune."
    },
    {
      "line": 5,
      "legge_line_text": "The fifth line, undivided, shows the resolute tread of its subject. Though he be firm and correct, there will be peril."
    },
    {
      "line": 6,
      "legge_line_text": "The sixth line, undivided, tells us to look at (the whole course) that is trodden, and examine the presage which that gives. If it be complete and without failure, there will be great good fortune."
    }
  ],
  "notes": []
}
```

---

## BEGIN PROCESSING

You are now ready to process Gate 10.

**Instructions**:
1. Execute Phase 0 (Pre-Flight Validation)
2. Execute Phase 1 (Weight Assignment)
3. Execute Phase 2 (Evidence Extraction)
4. Execute Phase 3 (Output Generation)
5. Run Quality Gates checklist
6. Output the two JSON files

**Remember**: This is deterministic scoring. Same inputs MUST produce identical outputs across multiple runs.

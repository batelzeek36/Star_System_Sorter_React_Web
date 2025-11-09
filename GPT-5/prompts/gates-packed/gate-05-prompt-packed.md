# Gate 5 Star System Scoring Prompt

## SYSTEM INSTRUCTIONS

You are a deterministic star system mapper generating academically rigorous, evidence-based weights for Human Design gate.line combinations.

**Input Files (REQUIRED)**:
- `GPT-5/combined-baselines-4.2.json` - 8 star system baselines with core_themes, shadow_themes, and quick_rules
- `claude/Full Pass/gate-5-full.json` - Complete Line Companion text for all 6 lines (non-padded)
- `claude/I-Ching-Full-Pass/hexagram-05.json` - Complete Legge I Ching text for all 6 lines (zero-padded)

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
- [ ] `claude/Full Pass/gate-5-full.json` (non-padded gate number)
- [ ] `claude/I-Ching-Full-Pass/hexagram-05.json` (zero-padded hexagram number)

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

**Objective**: Score all 8 star systems against complete source texts for lines 5.1 through 5.6, then select top-2 systems per line.

### Step 1: Read Complete Source Texts
For each line 5.1 through 5.6:
- Read the **COMPLETE** Line Companion text from `gate-5-full.json`
- Read the **COMPLETE** Legge I Ching text from `hexagram-05.json`
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
ERROR: Pairwise exclusion violated: {system1} and {system2} in line 5.{L}
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
**Source**: `hexagram-05.json`, same line number as gate.line

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
**Source**: `gate-5-full.json`, any line within the gate (line-agnostic)

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
   ERROR: Quote exceeds 25 words in 5.{L} for {system}
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
**Path**: `GPT-5/star-maps/gateLine_star_map_Gate05.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "05",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5",
    "sum_unorm": 1.87
  },
  "05.1": [
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
  "05.2": [
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
- **Keys**: Sorted ascending (`"05.1"`, `"05.2"`, ..., `"05.6"`)
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
**Path**: `GPT-5/evidence/gateLine_evidence_Gate05.json`

**Note**: Use zero-padded gate number (e.g., `Gate01`, `Gate09`, `Gate42`)

#### Structure:

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "gate": "05",
    "generated_at": "2025-01-15T10:30:00Z",
    "generator": "GPT-5"
  },
  "05.2": [
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
- **Keys**: Sorted ascending (`"05.1"`, `"05.2"`, etc.)
- **Value**: Array of evidence objects (max 2 per line, matching top-2 from weight file)

#### Evidence Object Fields:

**star_system**: Canonical name (must match weight file exactly)

**sources**: Object with two sub-objects:
- **legge1899**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Hex 5, Line {L}"` (e.g., `"Hex 1, Line 2"`)
  - `attribution`: Always `"Legge 1899"`
  
- **line_companion**:
  - `quote`: Verbatim text ≤25 words (or `""` if none)
  - `locator`: `"Gate 5, Line {L}"` (may be different line than gate.line being scored)
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
ERROR: Pairwise exclusion violated in line 5.{L}
Systems: {system1} (weight {w1}) and {system2} (weight {w2})
Rule: {rule_description}
```
**STOP. Do not proceed.**

**If more than 2 systems have weight >0**:
```
ERROR: Top-2 constraint violated in line 5.{L}
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
Line: 5.{L}
System: {system}
Source: {legge1899 or line_companion}
Quote: "{quote_text}"
Word count: {count}
```
**STOP. Do not proceed.**

**If quote is not verbatim**:
```
ERROR: Quote is not verbatim from source
Line: 5.{L}
System: {system}
Source: {source_file}
Extracted: "{extracted_quote}"
```
**STOP. Do not proceed.**

### Graceful Degradation:

**If Line Companion text missing for a line**:
- Use Legge text only for scoring
- In evidence file: `"line_companion": { "quote": "", "locator": "Gate 5, Line {L}", "attribution": "Ra Uru Hu (LC)" }`
- Reduce confidence by 1 level

**If Legge text missing for a line**:
```
ERROR: Legge text missing for Hex 5, Line {L}
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
- [ ] Run validation: `python GPT-5/scripts/validate_schemas.py --weights GPT-5/star-maps/gateLine_star_map_Gate05.json --evidence GPT-5/evidence/gateLine_evidence_Gate05.json`

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

### File 2: claude/Full Pass/gate-5-full.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Line Companion text verbatim into 'full_text' - no summarization, no trimming",
    "Copy line title verbatim into 'hd_title'",
    "Return exactly six lines (1–6)"
  ],
  "gate": 5,
  "gate_name": "Fixed Rhythms",
  "source": "Line Companion (Ra Uru Hu)",
  "lines": [
    {
      "line": 1,
      "hd_title": "Perseverance",
      "full_text": "The first line always speaks for the essence of a hexagram and the first line is Perseverance. If the captain must, he goes down with the ship. Understand what that means: if you notice that every day at four o'clock you are fatigued, then you need to rest. You fix this as a ritual in your life. Nobody is allowed to telephone you. Nobody is allowed to come and visit you. Nobody is allowed to disturb you. You are in your nice apartment building on the 39th floor and, all of a sudden, you hear a fire alarm while you are lying there on your sofa during your ritualized, fixed time. If the captain must, he goes down with the ship. Don't break your ritual. You may die in the fire, but 99 times out of a hundred you won't. Everybody else will have burnt apartments, but you will be fine and they will say, \"Why didn't you come out?\" You answer, \"I was just lying down having my nap.\"\n\nIf the captain must, he goes down with the ship. Don't let anybody interfere with your fixed rhythm and your ritual. If you need to eat at 8 o'clock in the morning and your lover says, \"I eat at 11 o'clock,\" let your lover eat alone. Eat at 8 o'clock in the morning. This is the nature of this line.\n\nMars exalted. Here again, the loveliness of what Mars can be. Courage in the face of adversity. \"I am not going to respond. I stay here in my ritual no matter what, and nobody will take me out of it.\" This is the power that lies in this fifth gate.\n\nThe Earth in detriment. The premature and often disastrous urge to cut one's losses. This is the moment in which, because there is no awareness (we are dealing with energy here), the ritual can be given up. \"I will leave the apartment.\n\nIt is okay if it burns but I want to save my life.\" They will die and the apartment won't burn. This is the irony of these things.\n\nThe power to maintain one's own rhythm; or Weakness in maintaining one's rhythm when challenged. That is why Mars is so powerful in the exalted. Understand the basis of what this hexagram is saying; it is so important. No logical process can be a success without a fixed rhythm. You can't just study 24 hours and then go and pass an exam. If you study 20 minutes a day for two weeks, you might. You have to establish the proper rhythm and fix what works for you. This is what logic demands and it is also what leadership demands: rituals. Wte have flags and people who salute. We have all these rituals of state. Wte need all these fixed rituals; otherwise, the understanding process does not work."
    },
    {
      "line": 2,
      "hd_title": "Inner Peace",
      "full_text": "The second line has such a nice name, Inner Peace. The second and the fifth line both have Pluto in detriment. That Pluto experience is coming up in 2000 to 2002. We will have a lot of children coming into the world who will carry this energy deep inside of them, and there is going to be an explosion of discomfort out of that.\n\nSecond lines are always projecting outwards. This line is projecting outwards that they have their fixed rhythm. \"I have my natural fixed rhythm.\" That is what they are projecting out into the world. It may or may not be true. The ability to ignore the temptation to take premature action. These people project outwards the ability that they will not take premature action and that they live out their natural rhythm. They are projecting out that natural rhythm to others.\n\nVenus exalted. The gift of maintaining composure through idealizing tranquility. Pluto in detriment. Inner peace experienced as stagnation. It may be one thing to say \"This is my natural rhythm,\" but that rhythm in itself may not be producing anything. So many people that have the 5 and the 15 have to spend so much time in their life doing nothing. This is all about being in the flow. Being in the flow does not mean that you are always moving. It means that you move, you rest, you move, you rest.... People who have the 5 and people who have the 15 go through periods where they can't move; there is nothing to do. They suffer because of that and then they run around like crazy and then they suffer because of that. There is nothing to do and then they suffer because of that and then.\n\nIn the white book, we have: The power to be comfortable with one's rhythm. This is what is being projected outwards: this comfort. Also: The drive for power that is constrained by a fixed rhythm. In the moment that the fixed rhythm does not feel good, they do not really know whether that is their natural rhythm or if they are living out a projected rhythm which they take for their natural rhythm, but it is stagnating because it does not take them anywhere. They do not feel like it is productive and in that moment, they may start looking for some other kind of rhythm and break their ritual. \"Yes, I used to have a nap everyday at four o'clock but one day my apartment was on fire and I ran out.\" Now, I don't nap anymore because it is bad luck.\n\nThey break from what they were projecting as their natural rhythm, and suddenly you find out that is not what they are at all. That is the child that says, \"Every night from 7 o'clock to 8 o'clock I do my studies.\" One day you go over there and you open the door; you find the window open and they have been gone for hours because that fixed rhythm was leading to stagnation. Of course, they don't know underneath whether it is really their natural rhythm; there is this temptation to break that and try something else, with predictable results."
    },
    {
      "line": 3,
      "hd_title": "Compulsiveness",
      "full_text": "When we get to the third line, it has a very intense name, Compulsiveness. We know that this third line is about trial and error. One of the things to recognize about that is everybody who has the 5.3 is always convinced that their rhythm is a mistake. If they are lying flat on their back and they cannot move a muscle, they are sure that it is a mistake. They are sure that they should do something. If they are running around like mad and they cannot stop running around, they are convinced that it is a mistake because they are sure that they should be on vacation somewhere, lying flat on their back and doing nothing. They have a great deal of difficulty in accepting what their natural rhythm is because there is always this sense that there is something wrong with it.\n\nThe fear engendered by the sense of helplessness resulting in unnecessary stress and activity. This sense of helplessness: \"I have this rhythm and I am stuck with it, and I don't really like it. I want to be able to be busy or I am out being busy and I want to rest. I don't really like this.\"\n\nNeptune exalted. Compulsiveness can be limited in its negative effects through Nights of imagination. This is the best therapy for somebody that has the 5.3. (I hate the word 'therapy; I'd rather say 'methodology'.) In those moments, where they assume that their fixed rhythm is not correct, that it is a mistake. I always tell them the same thing, \"Well, imagine what it would be like to do something else.\" This can be deeply imaginative. There is a great power in this: while they are flat on their back, they can dream, or while they are running around being busy, they can dream about another fixed rhythm. It is better for them to imagine the vacation while they are running around instead of taking it. Better for them to imagine being busy when they are lying down instead of doing it. That is much healthier for them.\n\nUnderstand that logic requires an enormous amount of imagination. Logic, after all, is rooted in the talent process. Without imagination logic can never work. So much of the logic that we process in our lives, we process at the imaginative level, making imaginative constructs in our mind to see within our imagination whether logic resonates for us, or not.\n\nThis is an opportunity for these people, in that moment of seeing that their rhythm is not correct for them or is a mistake, to allow that simply to work out. It is the rhythm. Don't change it, but go in your imagination to wherever you want to go. This is the healthy side of this process.\n\nUnderneath is: Unable to surrender and at odds with one's own rhythm. The Moon cannot stand still. What happens to these people is that they will constantly break their rhythm, discover that it is not good for them either, and they will eventually come back in their process after repeating the mistakes over and over again about breaking their rhythm. They will go back to their natural rhythm and they will suffer with it. With the third line, there is always inside of it this sense of, \"Is this really what it is? Or is this a mistake? I don't like this rhythm, I want to change it.\""
    },
    {
      "line": 4,
      "hd_title": "The Hunter",
      "full_text": "When you get to the upper trigram and you get to the fourth line, this is a line of externalization and we know that it is the resonance to the first line, where the captain must go down with the ship. Here you have what is called The Hunter. Waiting as a guarantee of survival. Having your natural rhythm or fixing your natural rhythm is a guarantee of survival. There are very few guarantees in this life. Here is one. The guarantee is that if you live by your fixed rhythm, your natural fixed rhythm, it is a guarantee for survival.\n\nUranus exalted. The creative genius to transform the most passive experience into active achievement. This goes back to something very basic about understanding how wonderful our form is. It goes back to the fact that we don't have to do anything. It is built in. This is genetics, after all. If you are not struggling with your own rhythm, not trying to change it, not succumbing to group pressure, this is the opportunity for a deep creative process to really see what comes out of you in your natural rhythm because it is you. Out of that natural rhythm comes the pure logical process that belongs to you and it is a guarantee that you will survive, and not because of somebody else.\n\nSun in detriment. The vanity of a personality so strong that, unwilling to hide behind a blind, threatens its very survival. This is the other side of the captain that goes down with the ship. This is just cuffing your losses and off you go. Remember that this line knows that there is another side. This is not the love of the body; this is the love of humanity. \"I need to serve humanity,\" The fourth, fifth and sixth lines of the 5th hexagram are there to serve humanity. In that externalization in the fourth line, you have this fixed process where it says, \"I don't want to wait. I want to serve humanity now. I don't want to accept this rhythm.\" The moment that they don't accept that rhythm, their very survival is threatened. There are so many people who, out of impatience and pressure, will break their natural rhythm and try to live another rhythm and become very ill. They become unhealthy because it is not for them.\n\nIllness has its manifestation in many ways. It is not just simply chronic obvious illness. It is deeper: psychological things and all kinds of emotional damage that can be done to them and the crushing of the ego. All of that has a root in this line. One of the things to recognize about the fourth line is that it really needs to be able to express that fixed rhythm as a contribution to the totality, as a contribution to humanity.\n\nThe Hunter, in the white book: The power to make the best of one's fixed rhythm. This is the genius. On the other side: The drive to deny one's own rhythm with predictable costs. If you go against your own rhythm, you will pay a price. Always. By the way, my advice or information for these people with this detriment is: they must make sure that there is nobody around them who is trying to pull them away from their rhythm because they will succumb. Mechanics protects you by giving you a way to work with that mechanical information.\n\nIf you have an aspect that can bring you into a detrimental field which is not healthy for you, you have to make sure that there are not those forces around you that will automatically do that. If you have the 21.3 and you are powerless with superior forces, then don't work for superior forces because you will be powerless. If you don't want to be pulled away from your fixed rhythm, because that tendency is always in you if you have this detriment, don't allow anybody to do that. Don't allow people around you who do not accept your rhythm. Mechanics is a great teacher that way."
    },
    {
      "line": 5,
      "hd_title": "Joy",
      "full_text": "I love this line. It is a lot of fun for me. V know what the fifth line is all about. Wye know that this is universalization and we know that everyone who carries the fifth line is going to be projected on. Everything about the logic process is about the repetitive process. To repeat over and over again in your fixed rhythm, concentrated in order to produce out of that a corrective process to eventually, through experimentation, come to a point where after many years, mastery is the result. In the second line, we had a projected field of inner peace going out and when we get to the fifth line, we have a projected field going onto the fifth line person and that projected field is called Joy.\n\nIt says: Waiting as an aspect of enlightenment. There are only two out of the 384 lines that mention the word enlightenment: the 54.4 which is Enlightenment/Endarkenment, which is another thing entirely, but here we have the aspect that we call enlightenment. Please understand something: enlightenment is a projection of those from the outside onto somebody else. Please understand that. Be very clear about that. Be very clear about something else, too: when Pluto comes roaring through into this fifth line and it hits the detriment, we are going to have a collapsing of this concept of enlightenment in terms of the nature of the so-called Master. Please understand that enlightenment is a projection. It is the outside turning on the light and focusing it on somebody else and projecting that light onto them. They may or may not be the master of what is being projected onto them, but it can look like that.\n\nWaiting as an aspect of enlightenment. What they are projecting onto these people is that they have this fixed rhythm and, because of that, they seem so calm. The apartment building is burning down and you are lying there on the sofa and somebody comes racing in and says, \"Don't you hear all these fire alarms? This place is burning down,\" and you look at them very calmly and you say, \"Please, don't disturb me. I am having my rest. Close the door, will you?\" Do you know what that does to your reputation later? They say, \"That was unbelievable. This one really knew.\"\n\nTo remain calm as the ultimate aesthetic... This is about beauty. This is not about truth.. ..and thus recognize the inner meaning of being. And when you get to that point you should get the joke: Pluto in detriment. Joy dismissed as an illusion, waiting as a failure. We will have a huge generation of children born with this line. Millions and millions of them will be born in the beginning of this new century carrying something that has not been in humanity for 156 years, bringing this energy out. It is the beginning of what people call the movement towards Aquarian knowledge, that projection is not enough. After all, this is all about logic.\n\nIn the white book: The power to be calm and to find one's place in the flow, or Disillusionment with recognizing one's place in the flow. Remember, because it is projected on these people that they are calm and at peace within themselves or enlightened, they'd better not make any mistakes."
    },
    {
      "line": 6,
      "hd_title": "Yielding",
      "full_text": "When we get to the sixth line, we find a very unusual sixth line here because it has no polarity. We only have exaltation, so it is being fixed in a very special way. It is called Yielding. Waiting is never free from pressure, physical or mental, and is often punctuated by the unexpected. This takes us back to the irony of logical energy: that it is suffused with faith and belief. There is all this faith built in underneath because nobody really knows whether the solution can ever be achieved and whether the leadership can ever take place.\n\nIt says that 'waiting is never free from pressure' and that it 'is often punctuated by the unexpected'. The unexpected is illogical. This can be very disturbing sometimes. \"I was doing step one, two, three, four, and all of a sudden something happened, something out of context.\" That 'out of context' allows for the unfolding of the whole process. There is always this sense inside, and this makes logical people even more determined to find out why the unexpected happened, so that they can make sure that it always fits into logic. It is like people who talk about coincidences instead of recognizing geometries. The geometry is clear: you know that these things are meeting each other.\n\nAccepting that in one's fixed rhythm despite the pressures, growth will be empowered, and often through the unexpected. Built into it is that through the fixed rhythm there will be growth, but, Neptune exalted. The growth of awareness that comes with bending to the universal flow. It is still a sixth line. It does not really mean that they are going to give their energy to humanity. They can, but that does not mean that they will. Again, they are looking at the whole circuit which means that this line is looking to the 31st gate at the end that says \"I lead with this formula that we have experimented with and proven. It is a value for us and reliable in the future.\"\n\nYou don't know that in the fifth gate. You can't because it is just an energy. It has no identity. It knows that there is much more and because of that, it does not want to give its energy to anything that it cannot lead. That is a key for it. In other words, \"Will I be really able to take this energy and go down this road. Can I actually do it?\"\n\nThese are people that are pulled into the flow unexpectedly. They can be standing on the sideline watching the river flow and everything is fine and all of a sudden a boat goes by and catches them. Unexpectedly, they find themselves in the flow. The logic process: they would love to kidnap all these people that have these energy gates for logic and hold on to them and keep them in the cupboard somewhere, so that they can really activate this logical process. It is very hard for the 5.6 to escape the demands of society. Society comes along and says, \"Excuse me. I know that you do not want to get involved but we will take you along with us.\"\n\nWhen you look at the logical process, you see that it does not involve the ego. There is no ego in logic. When you get to this sixth line, you get to this uncertainty about whether one can really lead or whether one can really go through this logical process and get to the solution and be able to do something about it. The very next hexagram, the very first line is the 26.1, which is tribal. It says: A bird in the hand. The ego has a lesson for logic: be satisfied with what it is that you have and, by the way, if you can't be satisfied about it, lie."
    }
  ],
  "aliases": [
    "The Gate of Fixed Rhythms",
    "Waiting"
  ]
}
```

### File 3: claude/I-Ching-Full-Pass/hexagram-05.json

```json
{
  "_INSTRUCTIONS": [
    "Copy COMPLETE Legge text verbatim into `full_text` (Judgment + Lines + Xiang if present).",
    "Each `lines[i].legge_line_text` is copied verbatim.",
    "Return exactly six lines (1–6).",
    "Do not invent or alter punctuation/romanization.",
    "Legge 1899 only (public domain)."
  ],
  "hexagram": 5,
  "hexagram_name_legge": "Hsü",
  "source": {
    "work": "I Ching",
    "translator": "James Legge",
    "edition_year": 1899,
    "public_domain": true
  },
  "judgment_text": "Hsü intimates that, with the sincerity which is declared in it, there will be brilliant success. With firmness there will be good fortune; and it will be advantageous to cross the great stream.",
  "image_text": "Clouds have risen up to heaven, (forming the symbolism of) Hsü. The superior man, in accordance with this, eats and drinks, feasts and enjoys himself (as if there were nothing else to employ him).",
  "addendum": {
    "type": null,
    "text": null
  },
  "full_text": "V. The Hsü Hexagram.\n\nHsü intimates that, with the sincerity which is declared in it, there will be brilliant success. With firmness there will be good fortune; and it will be advantageous to cross the great stream.\n\n1. The first line, undivided, shows its subject waiting in the distant border. It will be well for him constantly to maintain (the purpose thus shown), in which case there will be no error.\n\n2. The second line, undivided, shows its subject waiting on the sand (of the mountain stream). He will (suffer) the small (injury of) being spoken (against), but in the end there will be good fortune.\n\n3. The third line, undivided, shows its subject in the mud (close by the stream). He thereby invites the approach of injury.\n\n4. The fourth line, divided, shows its subject waiting in (the place of) blood. But he will get out of the cavern.\n\n5. The fifth line, undivided, shows its subject waiting amidst the appliances of a feast. Through his firmness and correctness there will be good fortune.\n\n6. The topmost line, divided, shows its subject entered into the cavern. (But) there are three guests coming, without being urged, (to his help). If he receive them respectfully, there will be good fortune in the end.",
  "lines": [
    {
      "line": 1,
      "legge_line_text": "The first line, undivided, shows its subject waiting in the distant border. It will be well for him constantly to maintain (the purpose thus shown), in which case there will be no error."
    },
    {
      "line": 2,
      "legge_line_text": "The second line, undivided, shows its subject waiting on the sand (of the mountain stream). He will (suffer) the small (injury of) being spoken (against), but in the end there will be good fortune."
    },
    {
      "line": 3,
      "legge_line_text": "The third line, undivided, shows its subject in the mud (close by the stream). He thereby invites the approach of injury."
    },
    {
      "line": 4,
      "legge_line_text": "The fourth line, divided, shows its subject waiting in (the place of) blood. But he will get out of the cavern."
    },
    {
      "line": 5,
      "legge_line_text": "The fifth line, undivided, shows its subject waiting amidst the appliances of a feast. Through his firmness and correctness there will be good fortune."
    },
    {
      "line": 6,
      "legge_line_text": "The topmost line, divided, shows its subject entered into the cavern. (But) there are three guests coming, without being urged, (to his help). If he receive them respectfully, there will be good fortune in the end."
    }
  ],
  "notes": []
}
```

---

## BEGIN PROCESSING

You are now ready to process Gate 5.

**Instructions**:
1. Execute Phase 0 (Pre-Flight Validation)
2. Execute Phase 1 (Weight Assignment)
3. Execute Phase 2 (Evidence Extraction)
4. Execute Phase 3 (Output Generation)
5. Run Quality Gates checklist
6. Output the two JSON files

**Remember**: This is deterministic scoring. Same inputs MUST produce identical outputs across multiple runs.

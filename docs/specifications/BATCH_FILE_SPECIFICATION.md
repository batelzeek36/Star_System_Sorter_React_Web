# Star Mapping Batch File Specification

## Purpose

Each batch file maps gate.lines to a specific star system with weights and behavioral rationale. These files are the source of truth for the scoring algorithm.

## File Format

### File Naming Convention
```
{system}-batch{number}.json
```

Where:
- `system` = andromeda | arcturus | draco | lyra | orion-dark | orion-light | pleiades | sirius
- `number` = 1-7

### Batch Coverage
- **Batch 1**: Gates 1-8 (48 gate.lines: 1.1-1.6, 2.1-2.6, ..., 8.1-8.6)
- **Batch 2**: Gates 9-16 (48 gate.lines)
- **Batch 3**: Gates 17-24 (48 gate.lines)
- **Batch 4**: Gates 25-32 (48 gate.lines)
- **Batch 5**: Gates 33-40 (48 gate.lines)
- **Batch 6**: Gates 41-48 (48 gate.lines)
- **Batch 7**: Gates 49-64 (96 gate.lines)

## JSON Structure

### Complete Example
```json
{
  "19.1": {
    "weight": 0.85,
    "alignment_type": "core",
    "why": "Extreme need-sensitivity and bond-maintenance panic maps to Pleiadian nurturing/safety behavior.",
    "confidence": 4,
    "sources": ["gate-line-19.json", "pleiades-baseline-4.2.json"],
    "behavioral_match": "nervous system regulation, attachment safety, caretaking panic",
    "keywords": ["bonding", "safety", "nurture", "panic-soothing"]
  },
  "19.2": {
    "weight": 0,
    "alignment_type": "none",
    "why": "Hermit energy that resists being needed; opposite of Pleiadian caretaking drive.",
    "confidence": 5,
    "sources": ["gate-line-19.json", "pleiades-baseline-4.2.json"],
    "behavioral_match": "none",
    "keywords": []
  }
}
```

## Required Fields

### 1. `weight` (number, 0.0-1.0)
**Purpose**: Numeric strength of the mapping

**Guidelines**:
- `0.0` = No match to this star system
- `0.1-0.25` = Weak/partial match (secondary flavor)
- `0.3-0.5` = Clear match (situational or moderate)
- `0.6-0.8` = Strong match (explicit, unmistakable)
- `0.9-1.0` = Flagship/archetypal match (textbook example)

**Rules**:
- Most gate.lines will be 0 for most systems (that's expected!)
- Only assign nonzero if there's a real behavioral match
- Don't give "sympathy points" - be rigorous

### 2. `alignment_type` (string)
**Purpose**: Whether this is healthy or distorted expression

**Valid Values**:
- `"core"` = Healthy/gift expression of the star system
- `"shadow"` = Distorted/wounded expression of the star system
- `"none"` = Not this star system (weight must be 0)

**Rules**:
- If `weight` is 0, `alignment_type` MUST be `"none"`
- If `weight` > 0, `alignment_type` MUST be `"core"` or `"shadow"`
- Shadow expressions still count as alignment (they're still that system)

### 3. `why` (string)
**Purpose**: One-sentence behavioral explanation

**Requirements**:
- Describe the gate.line's actual behavior in human terms
- Explain why it does/doesn't match this star system
- Use behavioral language, not lore/cosmology
- Be specific to THIS gate.line (no generic boilerplate)

**Good Examples**:
- ✅ "Soothes emotional panic and keeps everyone bonded through nurture, which is Pleiadian nervous-system caretaking."
- ✅ "Scans for threat and enforces loyalty to protect survival, which is Draco predator-guard behavior."
- ✅ "Confronts exploitation and restores sovereignty, which is Andromeda liberation work."

**Bad Examples**:
- ❌ "This is not about X" (too generic)
- ❌ "Carries the ancient frequency of..." (lore, not behavior)
- ❌ "This line deals with..." (vague, no star system connection)

### 4. `confidence` (number, 1-5)
**Purpose**: How certain you are about this mapping

**Scale**:
- `1` = Speculative/uncertain
- `2` = Probable but needs review
- `3` = Reasonably confident
- `4` = Very confident
- `5` = Absolutely certain

### 5. `sources` (array of strings)
**Purpose**: Which files you used to determine this mapping

**Format**:
```json
"sources": [
  "gate-line-{N}.json",
  "{system}-baseline-4.2.json"
]
```

**Examples**:
```json
"sources": ["gate-line-19.json", "pleiades-baseline-4.2.json"]
"sources": ["gate-line-44.json", "draco-baseline-4.2.json"]
```

### 6. `behavioral_match` (string)
**Purpose**: Short phrase describing the behavioral overlap

**Examples**:
- `"nervous system regulation, attachment safety"`
- `"predator scanning, loyalty enforcement"`
- `"sovereignty restoration, anti-exploitation"`
- `"frequency repair, trauma field cleanup"`
- `"none"` (if weight is 0)

### 7. `keywords` (array of strings)
**Purpose**: 3-5 keywords that capture the essence

**Examples**:
```json
"keywords": ["bonding", "safety", "nurture", "panic-soothing"]
"keywords": ["threat-scan", "loyalty", "dominance", "survival"]
"keywords": ["liberation", "sovereignty", "anti-control"]
"keywords": []  // if weight is 0
```

## Source Files to Reference

### For Each Gate.Line:
1. **Behavioral Data**: `lore-research/research-outputs/gate-line-API-call/gate-line-{N}.json`
   - Contains: `behavioral_axis`, `shadow_axis`, `keywords`, `hd_quote`
   - Use this to understand what the gate.line DOES behaviorally

2. **Star System Baseline**: `lore-research/research-outputs/star-systems/v4.2/{system}-baseline-4.2.json`
   - Contains: `mapping_digest` with `core_themes`, `shadow_themes`, `quick_rules`
   - Use this to understand what the star system IS

### Example Workflow:

For `pleiades-batch1.json`, gate.line 19.1:

1. **Read gate-line-19.json**:
   ```json
   "19.1": {
     "behavioral_axis": "Extreme need-sensitivity; becomes the one who feeds/soothes/bonds",
     "shadow_axis": "Panic when needs aren't met; codependent caretaking",
     "keywords": ["need", "sensitivity", "bonding", "caretaking"]
   }
   ```

2. **Read pleiades-baseline-4.2.json** `mapping_digest`:
   ```json
   "core_themes": [
     "Nervous system regulation and attachment safety",
     "Nurturing, feeding, bonding, caretaking",
     "Emotional co-regulation"
   ]
   ```

3. **Compare**: Does 19.1's behavior match Pleiades core themes?
   - YES: Need-sensitivity + caretaking + bonding = Pleiades core
   - Assign: `weight: 0.85`, `alignment_type: "core"`

4. **Write why**: "Extreme need-sensitivity and bond-maintenance panic maps to Pleiadian nurturing/safety behavior."

## Star System Quick Reference

### Pleiades
- **Core**: Nurture, feed, bond, soothe, regulate nervous system, attachment safety
- **Shadow**: Codependency, panic-attachment, smothering, self-erasure for closeness

### Arcturus
- **Core**: Frequency repair, trauma field cleanup, pattern correction, energetic recalibration
- **Shadow**: Cold detachment, treating people like energy problems, sterilizing vs healing

### Andromeda
- **Core**: Confront exploitation, restore sovereignty, challenge abusive control, liberation
- **Shadow**: Martyr witness, passive suffering, righteous blame without intervention

### Draco
- **Core**: Predator scanning, loyalty enforcement, access control, survival through dominance
- **Shadow**: Coercive loyalty, domination for status, weaponized access, "obey or you're out"

### Sirius
- **Core**: Initiation through ordeal, catalyze growth via crisis, rites of passage, sacred teaching
- **Shadow**: Forcing tests on others, spiritualizing suffering, power ladders disguised as growth

### Orion Light
- **Core**: Honorable trial, spiritual/warrior initiation, ascending through ordeal, sacred code
- **Shadow**: Elitism, "prove yourself worthy," gatekeeping wisdom, hierarchical ascent

### Orion Dark
- **Core**: Empire management, strategic control structures, large-scale coordination
- **Shadow**: Coercive control, obedience enforcement, psychological pressure, exploitation

### Lyra
- **Core**: Primordial instinct, survival wisdom, courage, sovereignty, primal knowing
- **Shadow**: Paranoia, isolation, "trust no one," survival at all costs

## Validation Rules

### Must Pass:
1. ✅ All gate.lines in the batch are present (48 for batches 1-6, 96 for batch 7)
2. ✅ Every entry has all 7 required fields
3. ✅ `weight` is a number between 0.0 and 1.0
4. ✅ `alignment_type` is "core", "shadow", or "none"
5. ✅ If `weight` is 0, `alignment_type` is "none"
6. ✅ If `weight` > 0, `alignment_type` is "core" or "shadow"
7. ✅ `why` is specific to this gate.line (not generic)
8. ✅ `confidence` is 1-5
9. ✅ `sources` includes at least the gate-line file and star system baseline
10. ✅ Valid JSON (no trailing commas, proper quotes)

### Expected Patterns:
- Most gate.lines will have `weight: 0` (that's normal!)
- Each system should have 30-100 nonzero mappings across all batches
- Strong matches (0.6+) should be rare (5-10% of nonzero mappings)
- Each batch should have 5-20 nonzero mappings (not 0, not 48)

## Common Mistakes to Avoid

1. ❌ **Generic "why" statements**: "This is not about X" repeated for every line
2. ❌ **Lore instead of behavior**: "Carries ancient frequency" vs "Soothes panic"
3. ❌ **Sympathy weights**: Giving 0.1 to everything "just in case"
4. ❌ **Missing fields**: Forgetting confidence, sources, keywords
5. ❌ **Wrong alignment**: weight=0 but alignment_type="core"
6. ❌ **Cross-contamination**: Pleiades behavior marked as Draco
7. ❌ **No redirects**: When weight=0, don't say which system it IS

## Template for ChatGPT/Claude

```
I need you to fill out a star mapping batch file for {SYSTEM} batch {NUMBER}.

This batch covers gates {START}-{END} (all 6 lines per gate).

For each gate.line, you need to:
1. Read the behavioral data from gate-line-{N}.json
2. Compare it to {SYSTEM}-baseline-4.2.json mapping_digest
3. Determine if it matches (weight 0-1, alignment_type, why)
4. Fill out all 7 required fields

Required fields:
- weight (0.0-1.0)
- alignment_type ("core" | "shadow" | "none")
- why (one sentence, behavioral, specific)
- confidence (1-5)
- sources (array of file names)
- behavioral_match (short phrase or "none")
- keywords (array of 3-5 words, or empty if weight=0)

Rules:
- Most will be weight=0 (that's expected!)
- Only assign nonzero if there's a real behavioral match
- Be specific in "why" - no generic boilerplate
- If weight=0, alignment_type must be "none"

Output format: Valid JSON with all gate.lines from {START}.1 to {END}.6
```

## After Completion

1. **Validate JSON**: `cat file.json | jq .`
2. **Check coverage**: All gate.lines present?
3. **Check nonzero count**: 5-20 per batch is normal
4. **Re-merge**: `python3 lore-research/scripts/11-merge-star-mappings.py`
5. **Copy to app**: `cp lore-research/research-outputs/gateLine_star_map.json star-system-sorter/public/data/`
6. **Test**: Restart app and verify results

## Priority Order

Complete in this order for maximum impact:

1. **sirius-batch{1-7}** (currently 0-1 mappings each)
2. **orion-dark-batch{1-3}** (currently 0 mappings each)
3. **andromeda-batch6, arcturus-batch6** (currently 0 mappings)
4. **Sparse batches** (< 10% coverage)

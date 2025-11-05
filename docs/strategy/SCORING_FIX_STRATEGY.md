# Scoring Fix Strategy: Two-Phase Approach

**Date:** November 2024  
**Status:** 🔴 Critical - Research weights not matching baseline standards  
**Credit:** Issue identified by GPT-5-Codex analysis

---

## Executive Summary

The scoring system feels meaningless because **gate-line weights are 3-7x lower than prescribed by v4.2 baseline files**. Your research intent (Andromeda liberation = 0.7-1.0) is being expressed as weak signals (0.1-0.3), causing Lyra to dominate and other systems to be under-represented.

**Root Cause:** Data problem, not code problem.

---

## The Problem

### What v4.2 Baselines Prescribe

All baseline files in `lore-research/research-outputs/star-systems/v4.2/` specify:

```
Core behaviors: 0.7–1.0  ("Score [System] high (0.7–1.0) when...")
Shadow behaviors: 0.4–0.6
Weak flavors: 0.1–0.3
Non-matches: ~0
```

**Example from `andromeda-baseline-4.2.json` (line 315):**
> "Score Andromeda high (0.7–1.0) when the gate.line is about liberating the captive, disrupting an abuser/controller, restoring sovereignty..."

**Example from `arcturus-baseline-4.2.json` (line 309):**
> "Score Arcturus high (0.7–1.0) when the gate.line is about frequency calibration, vibrational repair, energetic recalibration..."

### What Gate-Line Files Actually Use

Files in `lore-research/research-outputs/star-mapping-by-gate/` use:

```
Highest weights: 0.1–0.5 (except Lyra)
Typical core: 0.1–0.3
Lyra exception: 0.85 (gate-1.json line 19)
```

**Specific Examples:**

| System | Prescribed Range | Actual Max Found | File Reference |
|--------|-----------------|------------------|----------------|
| Andromeda | 0.7–1.0 (liberation) | 0.15 | `gate-49.json` line 42 |
| Arcturus | 0.7–1.0 (frequency repair) | 0.5 | `gate-2.json` line 55 |
| Sirius | 0.7–1.0 (sacred instruction) | 0.45 | `gate-49.json` line 223, `gate-57.json` line 223 |
| Lyra | 0.7–1.0 (aesthetic) | 0.85 ✓ | `gate-1.json` line 19 |


### Impact on Scoring

1. **Signal Compression:** All systems except Lyra compressed into 0.0-0.5 range
2. **Lyra Dominance:** Lyra's correct 0.85 weights make it 2-3x stronger than everything else
3. **Lost Distinctions:** "This is DEFINITELY Andromeda" → weight says "meh, 15%"
4. **Sparsify Amplifies Problem:** Gamma^1.35 on already-compressed weights crushes them further
5. **Wrong Themes:** Arcturus scoring 0.4-0.5 for "protocol/checklist" (wrong theme per baseline)

---

## Phase 1: Fix the Data (PRIMARY - Do This First)

### Goal
Recalibrate all gate-line weights to match v4.2 baseline prescriptions.

### Files to Modify
- **Source:** `lore-research/research-outputs/star-mapping-by-gate/gate-*.json` (64 files)
- **Reference:** `lore-research/research-outputs/star-systems/v4.2/*-baseline-4.2.json` (8 files)
- **Output:** Updated gate files + regenerated `star-system-sorter/public/data/gateLine_star_map.json`

### Step 1.1: Create Audit Script

**File:** `lore-research/scripts/18-audit-weight-calibration.py`

**Purpose:** Scan all gate files and report violations of v4.2 weight standards.

**Output:** `lore-research/research-outputs/WEIGHT_CALIBRATION_AUDIT.md`

**Report Format:**
```markdown
## Andromeda Violations

### Under-weighted Core Behaviors (should be 0.7-1.0)
- Gate 49.2: weight=0.15, why="Refuses coercive bonds..." → SHOULD BE 0.7+
- Gate 59.3: weight=0.2, why="Breaks isolation patterns..." → SHOULD BE 0.7+

### Over-weighted Non-Matches (should be ~0)
- Gate 10.5: weight=0.05, alignment="core" → Behavior doesn't match Andromeda

## Arcturus Violations

### Wrong Theme (scoring non-Arcturan behavior)
- Gate 58.2: weight=0.4, why="Sets protocol/checklist" → NOT frequency repair
- Gate 62.4: weight=0.5, why="Bureaucratic governance" → NOT vibrational healing
```


### Step 1.1b: Theme Audit (Optional Enhancement)

**File:** `lore-research/scripts/18b-audit-themes.py`

**Purpose:** Flag potential theme mismatches using keyword scanning from baselines.

**Logic:**
- Extract theme keywords from each baseline file
- Scan gate files for high-weight entries (>0.4) with missing keywords
- Flag for human review (won't catch everything, but surfaces obvious cases)

**Example:**
```python
arcturus_keywords = ["frequency", "vibrational", "calibration", "energetic", "repair"]
if system == "arcturus" and weight > 0.4:
    if not any(kw in why.lower() for kw in arcturus_keywords):
        flag_as_potential_theme_mismatch()
```

**Note:** This is a lightweight semantic check. It won't replace human judgment but helps surface cases like "Arcturus 0.5 on 'sets protocol/checklist'" for review.

### Step 1.2: Review Audit Results

**Scope Reality Check:** 64 gates × 6 lines × 8 systems = 3,072 weight decisions. Manual review of everything is impractical and error-prone.

**Hybrid Approach:**
- Script surfaces violations (quantitative patterns)
- Human reviews flagged items (qualitative judgment)
- Script applies corrections (consistent execution)

**Action:** Manually review `WEIGHT_CALIBRATION_AUDIT.md` to verify:
1. Which violations are genuine calibration errors
2. Which are intentional (e.g., subtle Pleiadian tone = 0.05 is correct)
3. Which represent wrong behavioral themes (Arcturus on non-frequency work)

**Annotation Format:**
Add decisions directly in the audit markdown:

```markdown
**49.2** - core
- Weight: 0.15
- Why: Refuses coercive bonds...
- Issue: Core behavior but weight=0.15 (should be 0.7-1.0)
- **DECISION: RECALIBRATE → 0.75** ✓
- **REASON: Clear Andromeda liberation theme**

**10.5** - core  
- Weight: 0.05
- Why: Subtle attunement to timing...
- Issue: Core behavior but weight=0.05 (should be 0.7-1.0)
- **DECISION: KEEP AS-IS** ✓
- **REASON: Intentionally subtle Pleiadian flavor**
```

**Decision Points:**
- Core match but low weight → Recalibrate to 0.7-1.0
- Shadow match but low weight → Recalibrate to 0.4-0.6
- Wrong theme entirely → Recalibrate to 0.0 and reassign to correct system
- Intentionally subtle → Keep as-is, document in audit

**Quick Win Strategy:** Start with one system (Andromeda - most under-weighted) to validate workflow before scaling to all 8 systems.

### Step 1.3: Batch Recalibration

**File:** `lore-research/scripts/19-recalibrate-weights.py`

**Purpose:** Apply weight corrections based on audit review.

**Input:** 
- `lore-research/research-outputs/WEIGHT_CALIBRATION_AUDIT.md` (with manual annotations)
- `lore-research/research-outputs/star-mapping-by-gate/gate-*.json`

**Process:**
1. Read audit file with correction decisions
2. For each flagged gate.line:
   - If core match: scale weight to 0.7-1.0 range
   - If shadow match: scale weight to 0.4-0.6 range
   - If wrong theme: set to 0.0 or reassign
3. Preserve "why" text (behavioral description)
4. Write updated gate files

**Output:** 
- Updated `lore-research/research-outputs/star-mapping-by-gate/gate-*.json`
- `lore-research/research-outputs/RECALIBRATION_REPORT.md` (summary of changes)

### Step 1.4: Regenerate Merged Map

**Command:**
```bash
cd lore-research/scripts
python 14-merge-gate-mappings.py
```

**Output:** `star-system-sorter/public/data/gateLine_star_map.json`

**Verify:** Check that merged file reflects new weight ranges.


### Step 1.5: Test with Raw Weights

**File:** `star-system-sorter/src/lib/scorer-config.ts`

**Temporary Change:** Disable sparsify/gamma to see pure research signal:

```typescript
export const TEST_RAW_WEIGHTS_CONFIG: SparsifyConfig = {
  gamma: 1.0,  // No sharpening
  per_polarity: {
    core: {
      top_k: 8,        // Keep all systems
      top_p: 1.0,      // No pruning
      min_abs: 0.0,    // No floor
      rel_floor: 0.0,  // No relative floor
    },
    secondary: {
      top_k: 8,
      top_p: 1.0,
      min_abs: 0.0,
      rel_floor: 0.0,
    },
  },
  line_secondary_multiplier: {},
  planet_weights: { /* keep existing */ },
  normalize_per_channel: true,
};
```

**Test:** Generate a chart and verify:
- Andromeda/Sirius/Arcturus now show appropriate strength
- Lyra no longer dominates everything
- Systems with 0.7+ weights clearly lead their charts
- Behavioral themes match baseline descriptions

### Step 1.6: Add Data Invariants (CI Guardrails)

**File:** `lore-research/scripts/20-validate-invariants.py`

**Purpose:** Automated checks that fail if data violates v4.2 rules. Prevents regression after recalibration.

**Checks:**

1. **Range Validation:**
   - Core weights: must be 0 OR 0.7-1.0 (no in-between)
   - Shadow weights: must be 0 OR 0.4-0.6
   - Weak flavors: 0.1-0.3 (if intentional)

2. **Sparsity Check:**
   - Max 2 core systems per line with weight ≥0.7
   - Prevents "muddy" lines where everything scores high

3. **Polarity Sanity:**
   - No system appears as BOTH core AND shadow with weight ≥0.3 on same line
   - Catches logical contradictions

4. **Theme Keywords (Lightweight):**
   - High-weight entries (≥0.7) should contain system keywords
   - Arcturus ≥0.7 → must mention "frequency", "vibrational", "calibration", etc.
   - Flags obvious theme mismatches for review

5. **Determinism:**
   - Same gate files → same merged map hash
   - Catches non-deterministic generation bugs

**Run:** After every recalibration, before merging:

```bash
cd lore-research/scripts
python 20-validate-invariants.py
# Exit code 0 = pass, non-zero = violations found
```

**Output:** `lore-research/research-outputs/INVARIANT_VIOLATIONS.md` (if any)

### Step 1.7: Create Golden Chart Tests

**File:** `star-system-sorter/src/lib/scorer-golden.test.ts`

**Purpose:** Regression tests with frozen expected results. Catches unintended changes to scoring logic or data.

**Test Cases (6-10 charts):**

1. **Your Own Chart** - Personal validation
2. **Clear Andromeda** - Liberation/sovereignty theme (should score 0.7+ Andromeda)
3. **Clear Arcturus** - Frequency repair theme (should score 0.7+ Arcturus)
4. **Clear Sirius** - Sacred instruction theme (should score 0.7+ Sirius)
5. **Hybrid Case** - Two systems within 6% (should classify as hybrid)
6. **Edge Case** - Minimal placements (should handle gracefully)
7. **Lyra Dominant** - Creative/aesthetic theme (should score 0.7+ Lyra)
8. **Shadow Heavy** - Multiple shadow expressions (should separate from allies)

**Test Format:**

```typescript
describe('Golden Chart Regression Tests', () => {
  it('should classify clear Andromeda liberation chart', () => {
    const extract: HDExtract = {
      // ... frozen chart data
      placements: [
        { planet: 'Sun', gate: 49, line: 2, type: 'personality' },
        // ... other placements
      ],
    };
    
    const result = classifyWithGateLines(extract);
    
    // Exact match on primary system
    expect(result.primary).toBe('Andromeda');
    
    // Tolerance ±2% on percentages
    expect(result.percentages['Andromeda']).toBeGreaterThan(28);
    expect(result.percentages['Andromeda']).toBeLessThan(32);
  });
  
  // ... more golden tests
});
```

**Maintenance:** Update golden expectations only when intentionally changing scoring logic or data.

---

## Phase 2: Simplify the Algorithm (SECONDARY - After Data Fix)

### Goal
Once weights correctly express research intent, simplify scoring to trust the data.

### Files to Modify
- `star-system-sorter/src/lib/scorer-config.ts`
- `star-system-sorter/src/lib/scorer.ts`

### Step 2.1: Remove Gamma Sharpening

**File:** `star-system-sorter/src/lib/scorer-config.ts`

**Change:**
```typescript
export const DEFAULT_SPARSIFY_CONFIG: SparsifyConfig = {
  gamma: 1.0,  // Was 1.35 - trust research ratios
  // ... rest unchanged
};
```

**Rationale:** Your research already assigned precise ratios (0.85 vs 0.5 vs 0.25). Gamma distorts these non-linearly.


### Step 2.2: Gentler Sparsify

**File:** `star-system-sorter/src/lib/scorer-config.ts`

**Change:**
```typescript
export const DEFAULT_SPARSIFY_CONFIG: SparsifyConfig = {
  gamma: 1.0,
  per_polarity: {
    core: {
      top_k: 5,        // Was 3 - allow more legitimate systems
      top_p: 0.90,     // Was 0.80 - capture more mass
      min_abs: 0.05,   // Was 0.10 - only drop true noise
      rel_floor: 0.20, // Was 0.35 - gentler threshold
    },
    secondary: {
      top_k: 3,        // Was 2
      top_p: 0.85,     // Was 0.75
      min_abs: 0.05,   // Was 0.10
      rel_floor: 0.20, // Was 0.35
    },
  },
  // ... rest unchanged
};
```

**Rationale:** 
- With correct weights (0.7-1.0), you don't need aggressive filtering
- Only drop weights < 0.05 (true noise, not intentional research)
- Preserve subtle distinctions (0.05-0.15 range)

### Step 2.3: Fix Alignment Type Terminology

**Issue:** Gate files use `"shadow"` but code expects `"secondary"`.

**Files to Check:**
- `lore-research/research-outputs/star-mapping-by-gate/gate-*.json`
- `star-system-sorter/src/lib/scorer.ts` (line ~450)

**Decision Needed:**
1. **Option A:** Rename all `"shadow"` → `"secondary"` in gate files
2. **Option B:** Update scorer.ts to recognize `"shadow"` as valid alignment type

**Recommendation:** Option B - your research uses "shadow" terminology consistently with v4.2 baselines.

**Change in `scorer.ts`:**
```typescript
// Line ~450
if (mapping.alignment_type === 'core') {
  systemScores[system].coreScore += weightedScore;
} else if (mapping.alignment_type === 'secondary' || mapping.alignment_type === 'shadow') {
  systemScores[system].secondaryScore += weightedScore;
}
```


### Step 2.4: Keep Planet Weighting

**File:** `star-system-sorter/src/lib/scorer-config.ts`

**No Change Needed:** Planet weighting (Sun/Earth 2x, Moon/Nodes 1.5x) is working correctly.

**Rationale:** This amplifies core identity placements appropriately.

---

## Implementation Checklist

### Phase 1: Data Recalibration

**Quick Win: Start with Andromeda Only**
- [ ] **1.0** Run audit on all systems to see full scope
- [ ] **1.1** Focus on Andromeda violations first (~50-100 entries)
- [ ] **1.2** Add DECISION annotations for Andromeda
- [ ] **1.3** Create recalibration script (`19-recalibrate-weights.py`)
- [ ] **1.4** Apply Andromeda corrections only
- [ ] **1.5** Regenerate merged map, test results
- [ ] **1.6** Validate workflow, refine process
- [ ] **1.7** Scale to remaining 7 systems

**Full Recalibration:**
- [ ] **1.1** Create audit script (`18-audit-weight-calibration.py`) ✓ DONE
- [ ] **1.1b** (Optional) Create theme audit script (`18b-audit-themes.py`)
- [ ] **1.2** Run audit, review violations with annotations
- [ ] **1.3** Create recalibration script (`19-recalibrate-weights.py`)
- [ ] **1.4** Run recalibration, verify changes
- [ ] **1.5** Regenerate merged map (`14-merge-gate-mappings.py`)
- [ ] **1.6** Create data invariants script (`20-validate-invariants.py`) 🔒 CRITICAL
- [ ] **1.7** Create golden chart tests (`scorer-golden.test.ts`) 🔒 CRITICAL
- [ ] **1.8** Test with raw weights config (no sparsify)
- [ ] **1.9** Verify Andromeda/Sirius/Arcturus now show appropriate strength

### Phase 2: Algorithm Simplification

- [ ] **2.1** Set gamma to 1.0 (remove sharpening)
- [ ] **2.2** Adjust sparsify thresholds (gentler filtering)
- [ ] **2.3** Fix alignment_type to recognize "shadow" 🔒 CRITICAL
- [ ] **2.4** Test with real charts
- [ ] **2.5** Compare before/after results
- [ ] **2.6** Run invariants + golden tests (should still pass)
- [ ] **2.7** Document final config in `SCORING_V4.4_COMPLETE.md`

---

## File Reference Map

### Source Data (v4.2 Baselines)
```
lore-research/research-outputs/star-systems/v4.2/
├── andromeda-baseline-4.2.json    (line 315: weight standards)
├── arcturus-baseline-4.2.json     (line 309: weight standards)
├── sirius-baseline-4.2.json       (line 498: weight standards)
├── draco-baseline-4.2.json
├── lyra-baseline-4.2.json
├── orion-dark-baseline-4.2.json
├── orion-light-baseline-4.2.json
└── pleiades-baseline-4.2.json
```

### Gate-Line Mappings (To Be Recalibrated)
```
lore-research/research-outputs/star-mapping-by-gate/
├── gate-1.json through gate-64.json  (384 gate.line combinations)
```

### Scripts
```
lore-research/scripts/
├── 18-audit-weight-calibration.py     (✓ DONE - audit violations)
├── 18b-audit-themes.py                (OPTIONAL - keyword checks)
├── 19-recalibrate-weights.py          (NEW - apply corrections)
├── 20-validate-invariants.py          (NEW - CI guardrails) 🔒
└── 14-merge-gate-mappings.py          (existing - rerun after recalibration)
```


### Scoring Code
```
star-system-sorter/src/lib/
├── scorer-config.ts               (sparsify settings - Phase 2)
├── scorer.ts                      (alignment_type fix - Phase 2) 🔒
├── scorer-placement.test.ts       (update tests after changes)
└── scorer-golden.test.ts          (NEW - regression tests) 🔒
```

### Output Files
```
lore-research/research-outputs/
├── WEIGHT_CALIBRATION_AUDIT.md    (NEW - audit report)
├── RECALIBRATION_REPORT.md        (NEW - changes summary)
└── INVARIANT_VIOLATIONS.md        (NEW - CI failures if any) 🔒

star-system-sorter/public/data/
└── gateLine_star_map.json         (regenerate after recalibration)
```

---

## Expected Outcomes

### After Phase 1 (Data Fix)
- Andromeda liberation behaviors score 0.7-1.0 (not 0.15)
- Arcturus frequency repair scores 0.7-1.0 (not 0.4 on wrong themes)
- Sirius sacred instruction scores 0.7-1.0 (not 0.45)
- All systems use consistent weight ranges per v4.2 standards
- Lyra no longer dominates by default

### After Phase 2 (Algorithm Simplification)
- Scoring trusts research weights without distortion
- Subtle distinctions preserved (0.05-0.15 intentional flavors)
- Only true noise (< 0.05) gets filtered
- Shadow expressions properly recognized
- Results feel meaningful and aligned with research

---

## Rollback Plan

### If Phase 1 Causes Issues
```bash
cd lore-research/research-outputs/star-mapping-by-gate
git checkout HEAD -- gate-*.json
cd ../../../star-system-sorter/public/data
git checkout HEAD -- gateLine_star_map.json
```

### If Phase 2 Causes Issues
```bash
cd star-system-sorter/src/lib
git checkout HEAD -- scorer-config.ts scorer.ts
```

---

## Success Criteria

### Quantitative
- [ ] 80%+ of core behaviors use 0.7-1.0 range
- [ ] 80%+ of shadow behaviors use 0.4-0.6 range
- [ ] No system dominates by default (all within 2x of each other)
- [ ] Behavioral themes match baseline descriptions
- [ ] **All data invariants pass** (no violations) 🔒
- [ ] **All golden chart tests pass** (±2% tolerance) 🔒

### Qualitative
- [ ] Results "feel right" - match research intent
- [ ] Andromeda shows up for liberation themes
- [ ] Arcturus shows up for frequency repair (not bureaucracy)
- [ ] Sirius shows up for sacred instruction
- [ ] Subtle flavors preserved (not crushed by sparsify)
- [ ] **Scoring is deterministic** (same input → same output) 🔒

---

## Timeline Estimate

**Quick Win (Andromeda Only):**
- **Audit + Review:** 1-2 hours
- **Script + Apply:** 1-2 hours
- **Test + Validate:** 1 hour
- **Subtotal:** 3-5 hours

**Full Recalibration (All 8 Systems):**
- **Phase 1.1-1.2** (Audit): 2-4 hours
- **Phase 1.3-1.5** (Recalibration): 4-8 hours
- **Phase 1.6-1.7** (Testing): 2-4 hours
- **Phase 2** (Algorithm): 2-4 hours
- **Total:** 10-20 hours

**Recommendation:** Start with quick win to validate workflow, then scale.

---

## Questions to Resolve

1. **Alignment Type:** Use "shadow" or "secondary" terminology? → **RESOLVED: Accept both in scorer**
2. **Intentional Subtlety:** Which 0.05-0.15 weights are intentional vs under-calibrated?
3. **Theme Reassignment:** When Arcturus scores on wrong theme, which system should own it?
4. **Sparsify Necessity:** After data fix, do we need sparsify at all?
5. **Golden Chart Selection:** Which 6-10 charts best represent the scoring space?

---

## Limitations & Constraints

### What the Audit Script Can Detect
- Weight vs alignment_type mismatches (core < 0.7, shadow outside 0.4-0.6)
- Numeric violations of v4.2 standards
- Statistical patterns across systems

### What It Cannot Detect
- Wrong behavioral themes (requires semantic understanding)
- Behavioral descriptions that don't match system intent
- Semantic drift from baseline narratives
- Nuanced research decisions (intentional subtlety vs error)

**These require human review or enhanced semantic analysis.**

### Pragmatic Approach
Given 3,072 weight decisions, attempting manual review of everything would:
- Take weeks of focused work
- Introduce inconsistency
- Risk missing systematic patterns
- Lead to burnout

**Solution:** Hybrid workflow where scripts surface problems, humans make judgment calls, scripts apply fixes consistently.

---

## Immediate Next Steps

**Ready to Execute:**

```bash
# Step 1: Run the audit
cd lore-research/scripts
python 18-audit-weight-calibration.py

# Step 2: Review the report
open ../research-outputs/WEIGHT_CALIBRATION_AUDIT.md

# Step 3: Focus on Andromeda section first
# Add DECISION annotations for 20-30 violations

# Step 4: Build recalibration script based on annotation format
# (Will help with this after seeing audit results)
```

---

**Next Action:** Run `18-audit-weight-calibration.py` to quantify the problem scope and see actual violation patterns.

---

## Future Enhancements (Phase 3+)

**Credit:** GPT-5 Codex feedback on making the system "bulletproof"

### Exclusive Projection Layer (Deferred)

**When:** Only if results still feel muddy after Phase 1 & 2

**Concept:** Keep "wide" research data, derive "tight" UI display
- Per gate.line: pick ≤1 core + ≤1 shadow using decisive thresholds
- If not decisive → label "None" (don't force it)
- UI shows exclusive chips, details drawer shows wide rationale

**Thresholds:**
```typescript
min_abs_core >= 0.7      // Must be strong match
min_margin >= 0.08       // Must beat #2 by 8%
min_ratio >= 1.2         // Must be 20% stronger than #2
```

**Example:** Gate 2.6 has Arcturus 0.75, Sirius 0.25, Pleiades 0.15
- Exclusive: Arcturus (core) only
- Wide: All three with rationale

**Benefit:** Crisp "this line is X" experience while preserving research nuance

### Calibrated Buckets/Tiers (Deferred)

**When:** Only if weight drift becomes a problem after 6+ months

**Concept:** Tag weights as tiers instead of free-floating numbers
```typescript
"tier": "primary_core" | "shadow_core" | "flavor" | "none"
// Maps to: 0.9, 0.5, 0.15, 0
```

**Benefit:** Ends subtle drift forever, makes audits trivial

**Cost:** Adds abstraction, might obscure research intent

### Four Vectors (Pers/Des × Core/Shadow) (Deferred)

**When:** Phase 2+ UX feature, after user research

**Concept:** Show different blends for different contexts
- Identity view: 60/40 (Personality/Design)
- Decisions view: 40/60 (emphasize Design)
- Relationships view: 50/50
- Shadow Work view: 40/60

**Benefit:** Contextual relevance

**Cost:** Complexity, needs validation that users want this

---

## Why Phased Adoption?

**Adopt Immediately (Phase 1):**
- Data invariants (prevents regression)
- Golden tests (catches unintended changes)
- Alignment type fix (critical bug)

**Defer to Phase 3:**
- Exclusive projection (adds complexity, might not be needed)
- Tier system (premature optimization)
- Four vectors (UX research needed first)

**Rationale:** Fix the data first, see if that solves the problem. Add complexity only if needed.


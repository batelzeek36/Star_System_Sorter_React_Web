# Precision Fixes Applied

Based on GPT-5 feedback, the following 7 precision issues have been addressed:

## 1. Baseline Beacon - Runtime Computation

**Issue**: Examples hard-coded `"8485865f"` which could be confusing.

**Fix**: 
- Changed all examples to use `"${BEACON}"` placeholder
- Added note that beacon is computed at runtime via `compute_beacon.py`
- Task 0 remains single source of truth for beacon computation

**Files Updated**: requirements.md, design.md

## 2. sum_unorm Meaning - File-Level Scope

**Issue**: Ambiguity about whether `sum_unorm` is per-line or per-file.

**Fix**:
- Clarified that `sum_unorm` is the **sum of all non-zero weights across all 6 lines in the file**
- Updated acceptance criteria in requirements.md
- Added note in design.md data models section

**Files Updated**: requirements.md, design.md

## 3. Sparse vs Dense Format - Sparse (Runtime Expectation)

**Issue**: Requirements say "set to 0.0" but examples show sparse format (only non-zero entries).

**Fix**:
- Confirmed **sparse format** (only non-zero weights included)
- Added explicit note: "Missing systems are treated as weight 0.00 by runtime scorer"
- Updated schema examples to clarify sparse format
- Validation scripts will enforce sparse format

**Files Updated**: requirements.md, design.md

## 4. Role + Polarity Separation (v4.2 Update)

**Issue**: Original spec used `alignment_type` which conflated priority (primary/secondary) with expression (core/shadow).

**Fix (v4.2)**:
- Replaced `alignment_type` with two separate fields:
  - `role`: "primary" | "secondary" (indicates priority/strength)
  - `polarity`: "core" | "shadow" (indicates expression/valence)
- This separation allows proper enforcement of top-2 constraint while maintaining polarity information

**Previous Issue**: One place mentioned "none" as alignment_type, but spec defined only `core | shadow | secondary`.

**Previous Fix**:
- Removed any reference to "none" alignment type
- Clarified that weight=0.00 implies no alignment (no entry in output)
- Updated Phase 1 processing logic in design.md

**Files Updated**: design.md

## 5. Canonical Names - Output Enforcement

**Issue**: Prose sometimes used "Orion-Light" but outputs must use "Orion Light".

**Fix**:
- Added explicit note in requirements.md glossary
- Reinforced in design.md canonical names section
- Validation scripts will enforce exact canonical names with proper case and spacing

**Files Updated**: requirements.md, design.md

## 6. Legge Same-Line Gating - Line Companion Flexibility

**Issue**: Unclear whether Line Companion quotes must be from same line.

**Fix**:
- Clarified that **Legge quotes must be from the same line number** when weight >0.50
- Clarified that **Line Companion quotes may be from any line** within the gate (line-agnostic)
- Updated requirements.md acceptance criteria
- Updated design.md Phase 2 processing logic

**Files Updated**: requirements.md, design.md

## 7. Tie-Breaking Order - Validator Enforcement

**Issue**: Canonical sort order mentioned but not enforced in validation.

**Fix**:
- Added explicit requirement in tasks.md for validation script
- Canonical order: Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco
- When weights are equal, sort by this canonical order
- Validation script will check this ordering

**Files Updated**: tasks.md, design.md

---

## Summary

All 7 precision issues identified by GPT-5 have been addressed. The spec is now at 100% precision with:
- Clear runtime computation expectations
- Unambiguous data model definitions
- Explicit format requirements (sparse)
- Standardized vocabulary
- Proper source quote flexibility rules
- Enforced canonical ordering

These fixes prevent implementation confusion and ensure deterministic, reproducible outputs.

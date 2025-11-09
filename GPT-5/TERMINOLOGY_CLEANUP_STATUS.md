# Terminology Cleanup Status - Role vs Polarity

**Date**: 2025-11-09  
**Status**: Documentation archived, data migration pending

## What Was Fixed

### ✅ Archived Pre-v4.2 Documentation

All files using the old `alignment_type: "core" | "secondary" | "none"` model have been archived:

1. **`.kiro/specs/gate-hexagram-scoring/`** → Moved to `_ARCHIVED_PRE_V4.2/`
   - Added README explaining deprecation
   - Points to v2 spec as source of truth

2. **`claude/claude-projects-upload/gate-line-standard.md`** → Moved to `_ARCHIVED_PRE_V4.2/`
   - Added README explaining deprecation
   - Points to GPT-5 prompt template

3. **`docs/strategy/SCORING_FIX_STRATEGY.md`** → Moved to `_ARCHIVED_PRE_V4.2/`
   - Added README explaining deprecation

4. **`docs/specifications/SHADOW_AS_DISTORTION_NOT_OPPOSITION.md`** → Moved to `_ARCHIVED_PRE_V4.2/`
   - Added README explaining deprecation

### ✅ Updated Current Documentation

1. **`GPT-5/prompts/gate-scoring-prompt-template.md`**
   - Fixed example "why" string (line 350): "Sirius secondary" → "Sirius core"
   - Added clarification section explaining role vs polarity independence

2. **`GPT-5/scripts/README.md`**
   - Added "Important: Role vs Polarity" section with clear definitions

3. **`GPT-5/star-maps/gateLine_star_map_Gate01.json`**
   - Fixed 3 "why" strings to use polarity instead of role:
     - Line 41 (01.2): "Sirius secondary" → "Sirius core"
     - Line 87 (01.4): "Draco secondary" → "Draco shadow"
     - Line 109 (01.6): "Sirius secondary" → "Sirius core"

## What's Left To Do

### ✅ Priority 2: Data Migration - COMPLETE

**Status**: Evidence files already use correct `polarity` field, no migration needed.

All 64 evidence files in `GPT-5/evidence/` already use the v4.2 `polarity` field correctly. No instances of legacy `alignment_type: "secondary"` found.

### Priority 3: Minor Cleanup (Nice to Have)

**Issue**: Some narrative docs use "Orion-Light" (hyphenated) instead of "Orion Light" (space)

**Files affected**: Various status reports and narrative docs

**Impact**: Low - JSON outputs already use correct format

**Recommendation**: Low priority, can be addressed during next doc review pass

## v4.2 Model Summary

The v4.2 model uses two **independent** fields:

### `role` (ranking/priority)
- `"primary"`: Highest weight system for this line (1st place)
- `"secondary"`: Second-highest weight system (2nd place)

### `polarity` (behavioral quality)
- `"core"`: Healthy, aligned expression of the star system archetype
- `"shadow"`: Distorted, unhealthy, or growth-edge expression

### Key Rules
- A system can be `role: "secondary"` with `polarity: "core"` (2nd-ranked, healthy)
- A system can be `role: "secondary"` with `polarity: "shadow"` (2nd-ranked, distorted)
- The "why" field should always reference the **polarity**, not the role
- Example: "Sirius core —" or "Draco shadow —", NOT "Sirius secondary —"

## Source of Truth

**Current v4.2 specifications**: `.kiro/specs/gate-hexagram-scoring-v2/`

All new work should reference this spec, not the archived pre-v4.2 files.

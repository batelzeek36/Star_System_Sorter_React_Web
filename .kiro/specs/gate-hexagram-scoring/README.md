# DEPRECATED - Pre-v4.2 Spec

**⚠️ This spec is DEPRECATED and uses outdated terminology.**

## What Changed in v4.2

The v4.2 model separates two independent concepts:
- **`role`**: Ranking/priority (`"primary"` = 1st place, `"secondary"` = 2nd place by weight)
- **`polarity`**: Behavioral quality (`"core"` = healthy, `"shadow"` = distorted)

The old model used `alignment_type` which conflated these concepts.

## Use This Instead

**Current spec**: `.kiro/specs/gate-hexagram-scoring-v2/`

The v2 spec uses the correct `role` + `polarity` separation and is the source of truth for all v4.2 work.

## Archived Files

Original files moved to `_ARCHIVED_PRE_V4.2/` for reference only.

# Claude Projects Upload - DEPRECATED

**⚠️ The files in this directory use pre-v4.2 terminology and are DEPRECATED.**

## What Changed in v4.2

The v4.2 model separates two independent concepts:
- **`role`**: Ranking/priority (`"primary"` = 1st place, `"secondary"` = 2nd place by weight)
- **`polarity`**: Behavioral quality (`"core"` = healthy, `"shadow"` = distorted)

The old model used `alignment_type: "core" | "secondary" | "none"` which conflated ranking with behavioral quality.

## Use This Instead

**Current prompt template**: `GPT-5/prompts/gate-scoring-prompt-template.md`

This template uses the correct v4.2 `role` + `polarity` separation.

## Archived Files

Original files moved to `_ARCHIVED_PRE_V4.2/` for reference only. Do not use these for new work.

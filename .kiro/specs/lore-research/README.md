# Lore Research Spec

Research all 64 Human Design gates and map them to star system archetypes using Perplexity Comet.

## Goal

Create a comprehensive lore database connecting Human Design gates to:
1. Ancient wisdom traditions (Egyptian, Chinese, Vedic, Indigenous, Greek, Sumerian)
2. Star system archetypes (Sirius, Pleiades, Orion Light, Arcturus, Andromeda, Lyra)

## Approach

**Template-based workflow** with automation scripts:
- 3 research passes per gate (A: HD/Gene Keys, B: Ancient wisdom, C: Star systems)
- Strict citation requirements (page numbers, quotes, editions, URLs)
- Organized by Human Design center (G Center → Throat → Solar Plexus → etc.)

## Status

- ✅ Templates created
- ✅ Automation scripts ready
- ✅ Gate 1 complete (baseline)
- ⏳ 63 gates remaining

## Quick Start

```bash
cd lore-research

# Check progress
./scripts/check-progress.sh

# Generate prompts for next gate
./scripts/generate-gate-prompts.sh X "archetype keywords"

# Research in Perplexity Comet, save JSON responses
```

See `tasks.md` for detailed workflow and checklist.

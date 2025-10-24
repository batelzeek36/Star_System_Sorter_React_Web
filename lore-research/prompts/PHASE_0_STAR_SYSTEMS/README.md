# Phase 0: Star System Baseline Research

## Overview

This directory contains 8 individual prompts for establishing the foundational characteristics of each star system. These baselines are CRITICAL - they provide the scholarly grounding that makes all gate-to-star-system mappings defensible.

## Why This Matters

**Without Phase 0, gate research is premature.** We need documented star system characteristics BEFORE we can map HD gates to them. Otherwise, we're just guessing.

## The 9 Prompts

Each prompt is designed to be copy-pasted directly into Perplexity Comet:

1. **SIRIUS_BASELINE.txt** - Teachers, guardians, wisdom keepers
2. **PLEIADES_BASELINE.txt** - Nurturers, artists, empaths
3. **ORION_LIGHT_BASELINE.txt** - Historians, strategists, mystery schools (Osirian faction)
4. **ORION_DARK_BASELINE.txt** - Control, hierarchy, shadow work (separate from Orion Light)
5. **ANDROMEDA_BASELINE.txt** - Freedom seekers, explorers, sovereignty
6. **LYRA_BASELINE.txt** - Primordial root race, builders
7. **ARCTURUS_BASELINE.txt** - Healers, engineers, frequency workers
8. **DRACO_BASELINE.txt** - Power, hierarchy, dragon archetype (separate from Orion Dark but often allied)
9. **ZETA_RETICULI_BASELINE.txt** - Analysts, experimenters, detachment

## How to Use

### Step 1: Copy Prompt
Open the star system file (e.g., `SIRIUS_BASELINE.txt`) and copy the entire contents.

### Step 2: Paste into Comet
Go to Perplexity Comet and paste the prompt. Comet will research and return JSON.

### Step 3: Save Response
Save the JSON response as:
```
lore-research/research-outputs/star-systems/[name]-baseline.json
```

### Step 4: Validate Quality
Use the checklist in each prompt to verify:
- ✅ 3+ sources per characteristic (5+ preferred)
- ✅ Specific page numbers/locations
- ✅ Actual quotes ≤25 words
- ✅ Edition information
- ✅ URLs where available
- ✅ Source types labeled
- ✅ Disputed claims noted with counter-evidence

### Step 5: Reject if Weak
If citations are missing or vague, re-prompt with stricter requirements. Do NOT accept "unknown" fields unless genuinely unavailable.

### Step 6: Compile Results
After all 8 are validated, compile into:
```
lore-research/star-systems/COMPILED_BASELINES.yaml
```

## Quality Standards

### ACCEPTABLE Citation
```json
{
  "title": "The Sirius Mystery: New Scientific Evidence",
  "author": "Robert K. G. Temple",
  "edition": "50th Anniversary Edition",
  "year": 2019,
  "page": "Chapter 3, pp. 67-69",
  "quote": "The Nommo came from Sirius to teach humanity.",
  "url": "https://www.sirius-mystery.com",
  "source_type": "research"
}
```

### UNACCEPTABLE Citation
```json
{
  "title": "The Sirius Mystery",
  "author": "Temple",
  "page": "unknown",
  "quote": "Discusses Sirius teachings",
  "source_type": "research"
}
```

## Expected Timeline

- **Per star system**: 2-3 hours (Comet research + validation)
- **Total for 8 systems**: 16-24 hours
- **Compilation**: 2-4 hours
- **Grand total**: ~20-28 hours

## Critical Success Factors

✅ **Mix of source types** - Not all channeled, not all modern
✅ **Ancient support noted** - Separate historical depth from modern overlay
✅ **Disputes documented** - Include counter-evidence where applicable
✅ **Consensus justified** - HIGH/MEDIUM/LOW based on actual evidence
✅ **Full citations** - No "unknown" fields unless unavoidable

## Red Flags

Reject responses that have:
❌ Missing page numbers
❌ Vague quotes or summaries instead of direct quotes
❌ Missing edition information
❌ All sources from one type (e.g., all channeled)
❌ Disputed claims without counter-evidence
❌ "Unknown" fields that could be researched

## After Phase 0 is Complete

Only then can you proceed to:
1. **Phase 1**: Gate research (Pass A/B/C templates)
2. **Phase 2**: BEAM validation
3. **Phase 3**: Compilation into lore.yaml

**Do not skip Phase 0. It's the foundation for everything else.**

## Document Status

- ✅ SIRIUS_BASELINE.txt - Complete
- ✅ PLEIADES_BASELINE.txt - Complete
- ✅ ORION_LIGHT_BASELINE.txt - Complete
- ✅ ORION_DARK_BASELINE.txt - Complete
- ✅ ANDROMEDA_BASELINE.txt - Complete
- ✅ LYRA_BASELINE.txt - Complete
- ✅ ARCTURUS_BASELINE.txt - Complete
- ✅ DRACO_BASELINE.txt - Complete
- ✅ ZETA_RETICULI_BASELINE.txt - Complete
- ✅ QUICK_START.md - Complete

## Questions?

Refer to:
- `STAR_SYSTEM_BASELINE_RESEARCH.md` - Why this matters
- `BASELINE_SYNTHESIS.md` - Expected characteristics
- `CITATION_QUALITY_STANDARDS.md` - Citation requirements
- `!ESOTERIC_SOURCE_LIBRARY.md` - Reference library

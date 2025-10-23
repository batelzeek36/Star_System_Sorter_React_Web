# Lore Research Documentation

This folder contains all documentation and prompts for researching Human Design gates and their star system alignments using Perplexity Comet.

## Folder Structure

```
lore-research/
├── prompts/              # Copy-paste ready Comet prompts
├── documentation/        # Workflow guides and strategies
├── reference/            # Background information and source lists
└── README.md            # This file
```

## 🚀 Quick Start (Updated Workflow)

```bash
# 1. Check progress
./scripts/check-progress.sh

# 2. Generate prompts for next gate (look up archetype in GATE_ARCHETYPES.md)
./scripts/generate-gate-prompts.sh 3 "innovation through difficulty, mutation, new beginnings from chaos"

# 3. Research in Perplexity Comet
# - Paste prompts/gate-3/COMET_PASS_A_GATE_3.txt → save JSON to research-outputs/gate-3-pass-a.json
# - Paste prompts/gate-3/COMET_PASS_B_GATE_3.txt → save JSON to research-outputs/gate-3-pass-b.json
# - Paste prompts/gate-3/COMET_PASS_C_GATE_3.txt → save JSON to research-outputs/gate-3-pass-c.json

# 4. Validate against CITATION_QUALITY_STANDARDS.md
```

**See [TASKS.md](./TASKS.md) for detailed workflow, checklist, and progress tracking.**

### Read This First

Start with `TASKS.md` for organized workflow, then `documentation/COMET_WORKFLOW_GUIDE.md` for detailed instructions.

## Files Overview

### `/prompts/` - Ready to Use

- **COMET_PASS_A_GATE_1.txt** - HD/Gene Keys/I Ching foundation
- **COMET_PASS_B_GATE_1.txt** - Ancient wisdom parallels
- **COMET_PASS_C_GATE_1.txt** - Star system alignments
- **COMET_SINGLE_SHOT_GATE_1.txt** - All-in-one fast version
- **GATE_1_COMET_PROMPT.txt** - Original comprehensive prompt

### `/documentation/` - How-To Guides

- **COMET_WORKFLOW_GUIDE.md** - Complete workflow with examples ⭐ START HERE
- **LOGIC_DEVELOPMENT_PLAN.md** - Overall strategy and timeline
- **LORE_GENERATION_STRATEGY.md** - Different approaches compared
- **GPT-5-Comet-Passes.md** - GPT-5's multi-pass recommendation

### `/reference/` - Background Info

- **ANCIENT_WISDOM_SOURCES.md** - 39 ancient texts and sources
- **STAR_SYSTEM_CLARIFICATIONS.md** - Star system definitions and search terms
- **COMET_PROMPTS.md** - Original prompt templates
- **FINAL_COMET_PROMPT.md** - Comprehensive single prompt (pre-GPT-5 feedback)

## Workflow Summary

### Multi-Pass (Recommended for Quality)
1. **Pass A:** Get HD/Gene Keys/I Ching foundation (2-3 min)
2. **Pass B:** Find ancient wisdom parallels (3-4 min)
3. **Pass C:** Map to star systems (3-4 min)
4. **Merge:** Claude combines all 3 JSONs → YAML rules

**Total:** 10-15 minutes per gate  
**Quality:** Excellent citations, fewer hallucinations

### Single-Shot (Faster)
1. **One Prompt:** Get everything at once (4-5 min)
2. **Convert:** Claude converts JSON → YAML rules

**Total:** 5-7 minutes per gate  
**Quality:** Good citations, solid research

## CRITICAL: Research Order

**⚠️ PHASE 0 REQUIRED FIRST:** `STAR_SYSTEM_BASELINE_RESEARCH.md`

Before researching any gates, we MUST establish documented characteristics for all 8 star systems. This is the foundation that makes gate-to-star-system mappings defensible.

**Research Order:**
1. **Phase 0:** Star system baseline research (8 systems, ~20 hours)
2. **Phase 1:** Gate research (64 gates, ~7-16 hours)

**Why this matters:** We need to prove "Pleiades = artistic/nurturing" BEFORE we can say "Gate 1 matches Pleiades." Otherwise it's just confirmation bias.

## Citation Quality Standards

**READ THIS SECOND:** `CITATION_QUALITY_STANDARDS.md`

All Comet responses MUST meet strict citation requirements:
- ✅ Specific page numbers or sections (not "unknown")
- ✅ Actual quotes ≤25 words (not "unknown")
- ✅ Edition/translation information (not "unknown")
- ✅ Working URLs where available
- ❌ Zero tolerance for weak citations

If Comet returns "unknown" for page numbers, quotes, or editions, **the response is REJECTED** and must be re-researched.

## Next Steps

1. **Read Citation Standards** - Review `CITATION_QUALITY_STANDARDS.md`
2. **Test with Gate 1** - Try multi-pass to see quality
3. **Reject Weak Responses** - Don't accept "unknown" citations
4. **Choose Strategy** - Multi-pass for all, single-shot for all, or hybrid
5. **Scale to 64 Gates** - Repeat process for remaining gates
6. **Build Lore Database** - Accumulate 500+ rules with full provenance

## Tools Needed

- **Perplexity Pro** - For Comet research with citations
- **Claude** (me) - For JSON → YAML conversion
- **Lore Compiler** - For validation (`npm run compile:lore`)

## Output Location

Research JSON files go in:
```
research/inputs/gates/
├── gate-1-pass-a.json
├── gate-1-pass-b.json
├── gate-1-pass-c.json
└── gate-1.research.json (single-shot)
```

Final YAML rules go in:
```
data/lore/lore.yaml
```

## Questions?

See `documentation/COMET_WORKFLOW_GUIDE.md` for detailed instructions and examples.

---

**Status:** Ready to start with Gate 1  
**Branch:** `implementing-logic`  
**Next Action:** Copy a prompt from `/prompts/` and paste into Comet

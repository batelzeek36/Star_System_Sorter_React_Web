# Phase 0 Quick Start Guide

## What You're About To Do

You're establishing the scholarly foundation for the entire Star System Sorter project. These 8 baseline research prompts will give you properly cited characteristics for each star system, which you'll then use to map Human Design gates.

## The Process (Simple Version)

1. **Copy a prompt** (start with SIRIUS_BASELINE.txt)
2. **Paste into Perplexity Comet**
3. **Wait for JSON response** (2-5 minutes)
4. **Validate quality** (use checklist below)
5. **Save response** as `lore-research/research-outputs/star-systems/[name]-baseline.json`
6. **Repeat for all 8 star systems**

## Recommended Order

Do them in this sequence (easiest to hardest):

1. **SIRIUS** - Lots of ancient + modern sources (easiest)
2. **PLEIADES** - Cross-cultural Seven Sisters pattern (easy)
3. **ORION_LIGHT** - Egyptian sources are solid (medium)
4. **DRACO** - Ancient dragon myths abundant (medium, but controversial modern material)
5. **ARCTURUS** - Modern-only, but consistent (medium)
6. **ANDROMEDA** - Mostly modern contactee material (harder)
7. **LYRA** - Modern-only, some inconsistencies (harder)
8. **ORION_DARK** - Modern channeled, needs Light/Draco distinction (harder)
9. **ZETA_RETICULI** - UFO lore, disputed claims (hardest)

## Quick Validation Checklist

After Comet returns JSON, check:

✅ **3+ sources per characteristic** (5+ is better)
✅ **Specific page numbers** (not "unknown")
✅ **Actual quotes ≤25 words** (not summaries)
✅ **Edition information** (e.g., "50th Anniversary Edition")
✅ **URLs included** where available
✅ **Source types labeled** (ancient|research|channeled|indigenous|controversial)
✅ **Disputed claims noted** with counter-evidence (Dogon, Hill star map, Icke)

### If Response is Weak

**Don't accept it.** Re-prompt with:

```
Your previous response had incomplete citations. Please research again with:
- SPECIFIC page numbers (not "unknown")
- ACTUAL quotes from sources (not summaries)
- EDITION information for all books
- URLs where available

I need 5+ sources per characteristic with FULL metadata.
```

## Expected Time Investment

- **Per star system**: 2-3 hours (research + validation)
- **Total**: 16-24 hours
- **Compilation**: 2-4 hours
- **Grand total**: ~20-28 hours

## What Success Looks Like

After Phase 0, you'll have:

✅ 8 JSON files with fully cited star system characteristics
✅ Mix of ancient, modern, and channeled sources
✅ Disputed claims documented with counter-evidence
✅ Consensus levels justified by evidence
✅ Ancient support levels noted
✅ A solid foundation for gate research

## What Failure Looks Like

❌ Vague citations ("page unknown", "discusses Sirius")
❌ All sources from one type (e.g., all channeled)
❌ Disputed claims without counter-evidence
❌ Missing edition information
❌ No URLs when sources are available online

## After You're Done

1. **Compile results** into `COMPILED_BASELINES.yaml`
2. **Cross-check** against `BASELINE_SYNTHESIS.md`
3. **Validate** using `CITATION_QUALITY_STANDARDS.md`
4. **THEN** proceed to Phase 1 (gate research)

## Pro Tips

- **Start with Sirius** - It's the easiest and will teach you what good citations look like
- **Reject weak responses** - It's faster to re-prompt than to fix bad data later
- **Save as you go** - Don't lose work if Comet times out
- **Take breaks** - This is intensive research, pace yourself
- **Document gaps** - If sources don't exist, note that explicitly

## Questions?

- **"What if Comet can't find page numbers?"** - Re-prompt with stricter requirements. If genuinely unavailable, note as "Page numbers not accessible in available editions"
- **"What if all sources are channeled?"** - That's okay for some systems (Arcturus, Lyra) but note `ancient_support: "low"` or `"unknown"`
- **"What if sources contradict?"** - Document both sides, mark as `disputed: true`, note consensus level as LOW
- **"How do I know if I'm done?"** - When all 8 systems have 3-5 characteristics each with 5+ fully cited sources

## Ready?

Start with `SIRIUS_BASELINE.txt` - copy the entire file and paste into Perplexity Comet.

Good luck! This is the foundation that makes everything else defensible.

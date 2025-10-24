# Prompt Generation Guide

Quick reference for generating research prompts for gates.

## TL;DR

```bash
cd lore-research
./scripts/generate-prompts-for-gate.sh <gate_number>
```

That's it! The script will:
1. Look up the archetype from `GATE_ARCHETYPES.md`
2. Generate all 3 prompts (A, B, C) with variables filled in
3. Save them to `prompts/gate-<N>/` ready to copy/paste

## Example

```bash
# Generate prompts for Gate 7
./scripts/generate-prompts-for-gate.sh 7

# Output:
# ✅ Created COMET_PASS_A_GATE_7.txt
# ✅ Created COMET_PASS_B_GATE_7.txt
# ✅ Created COMET_PASS_C_GATE_7.txt
```

## What Gets Generated

### Pass A: HD/Gene Keys/I Ching
- Ra Uru Hu's meaning
- Gene Keys (shadow, gift, siddhi)
- I Ching Hexagram parallel
- All with citations and page numbers

### Pass B: Ancient Wisdom Connections
- Egyptian/Thothian sources
- Chinese/Taoist sources
- Vedic/Hindu sources
- Indigenous traditions
- Greek/Mystery Schools
- Sumerian/Mesopotamian sources

**NEW:** Includes explicit guidance to use your ancient text library!

### Pass C: Star System Alignments
- Maps gate archetype to star systems
- Sirius, Pleiades, Orion, Arcturus, Andromeda, Lyra, etc.
- Confidence levels and evidence types
- Weight suggestions

**NEW:** Includes ancient text priority section with:
- Specific sources to search for each star system
- Confidence calibration based on ancient support
- Research strategy by star system
- Good/bad source combination examples

## Research Workflow

1. **Generate prompts:**
   ```bash
   ./scripts/generate-prompts-for-gate.sh 5
   ```

2. **Run Pass A in Perplexity Comet:**
   - Copy `prompts/gate-5/COMET_PASS_A_GATE_5.txt`
   - Paste into Perplexity with Comet browser enabled
   - Save JSON response to `research-outputs/gate-5/gate-5-pass-a.json`

3. **Run Pass B in Perplexity Comet:**
   - Copy `prompts/gate-5/COMET_PASS_B_GATE_5.txt`
   - Paste into Perplexity with Comet browser enabled
   - Save JSON response to `research-outputs/gate-5/gate-5-pass-b.json`

4. **Run Pass C in Perplexity Comet:**
   - Copy `prompts/gate-5/COMET_PASS_C_GATE_5.txt`
   - Paste into Perplexity with Comet browser enabled
   - Save JSON response to `research-outputs/gate-5/gate-5-pass-c.json`

5. **Validate responses:**
   - Check against `CITATION_QUALITY_STANDARDS.md`
   - Verify all citations have page numbers
   - Ensure no blog sources
   - Confirm ancient text support in Pass C

## What's New (January 23, 2025)

### Template C Updates

Added comprehensive ancient text priority section:

✅ **Ancient Source Library Reference**
- Egyptian/Kemetic (Pyramid Texts, Coffin Texts, Book of the Dead)
- Mesopotamian/Sumerian (MUL.APIN, Enuma Elish, cuneiform tablets)
- Vedic/Hindu (Rig Veda, Atharva Veda, Surya Siddhanta)
- Chinese/Taoist (I Ching, Needham's star catalogs)
- Greek/Hermetic (Corpus Hermeticum, Orphic Hymns, Greek Magical Papyri)
- Indigenous (Cherokee, Pawnee, Navajo, Māori, Dogon, Aboriginal)
- Theosophical (Blavatsky, Bailey, Leadbeater, Steiner)

✅ **Star System Research Strategies**
- Specific sources to prioritize for each star system
- Warnings for systems with limited ancient sources (Andromeda, Lyra)
- Clear hierarchy: ancient texts → established esoteric → modern channeled

✅ **Confidence Calibration**
- HIGH requires ancient text support + modern convergence
- MEDIUM for single ancient text + modern support
- LOW for modern channeled sources only
- SPECULATIVE for no ancient support

✅ **Source Combination Examples**
- Shows what STRONG vs WEAK sourcing looks like
- Demonstrates proper citation format
- Clarifies what's acceptable vs unacceptable

## Files Reference

- **Templates:** `prompts/TEMPLATE_PASS_A.txt`, `TEMPLATE_PASS_B.txt`, `TEMPLATE_PASS_C.txt`
- **Archetypes:** `GATE_ARCHETYPES.md`
- **Scripts:** `scripts/generate-prompts-for-gate.sh`, `scripts/generate-gate-prompts.sh`
- **Standards:** `CITATION_QUALITY_STANDARDS.md`
- **Ancient Sources:** `source-mining/!CONSOLIDATED.md`, `source-mining/!ESOTERIC_SOURCE_LIBRARY.md`

## Troubleshooting

**Script not executable:**
```bash
chmod +x scripts/generate-prompts-for-gate.sh
```

**Gate archetype not found:**
- Check `GATE_ARCHETYPES.md` has entry for that gate
- Ensure gate number is between 1-64

**Variables not replaced:**
- Check template files have `{{GATE_NUMBER}}` and `{{GATE_ARCHETYPE}}` placeholders
- Verify sed command in script is working

## Manual Generation (if needed)

If you need to manually specify the archetype:

```bash
./scripts/generate-gate-prompts.sh 7 "leadership, direction, democracy, role of the self"
```

This is useful if:
- You want to test different archetype phrasings
- The archetype in GATE_ARCHETYPES.md needs updating
- You're generating prompts for a custom gate

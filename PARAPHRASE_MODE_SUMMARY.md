# Paraphrase Mode Implementation Summary

## What Changed

The quote extraction pipeline now supports **"paraphrase mode"** to ship quickly using paraphrased Legge text from `s3-data/hexagrams/*.json`, with easy switching to verified Legge later.

## Files Updated

### 1. `.kiro/specs/quote-extraction/tasks.md`
- Added prominent **"CURRENT MODE: LEGGE PARAPHRASE (BETA)"** section at top
- Updated relevant tasks (2.5, 5.1-5.3, 6.1-6.3, 7.2, 8.1, 8.3) with **PARAPHRASE MODE** notes
- Added comprehensive **"Reversibility & Mode Switching"** section at end with:
  - Why paraphrase mode exists
  - Config flags explanation
  - What changes vs what stays the same
  - Command-line examples for running in paraphrase mode
  - UI rendering guidance (BETA badge)
  - Step-by-step instructions for switching back to verified mode
  - Safety guarantees (feature flags, provenance, idempotency)

### 2. `lore-research/scripts/config.py`
- Added new section: **"LEGGE MODE CONFIGURATION"**
- New config flags:
  - `LEGGE_MODE = "paraphrase"` (can be "verified" | "paraphrase" | "repaired")
  - `LEGGE_PARAPHRASE_DIR` - points to `s3-data/hexagrams/`
  - `ALLOW_PARAPHRASE_FALLBACK = False` - controls whether Legge fills LC gaps
  - `REQUIRE_PAGE_LOCATOR_FOR_LEGGE = False` - relaxed in paraphrase mode
  - `LEGGE_NORMALIZED`, `LEGGE_HX_INDEX`, `LEGGE_HX_REPAIRED` - paths for verified modes
  - `LEGGE_PAGE_MAP` - page number mapping file
- Added helper function: `get_legge_index_path()` - returns correct index based on mode

## How It Works

### Current State (Paraphrase Mode)
1. **Both LC and Legge paraphrase are extracted as parallel sources** (not fallback)
2. Each gate.line gets BOTH `classical.line_companion` AND `classical.legge` blocks
3. Cross-check stages run in "record-only" mode (no strict match/conflict grading)
4. Page/leaf locators optional for Legge
5. All Legge quotes stamped with `"status": "beta"` and `"source": "legge-paraphrase"`
6. UI shows both sources side-by-side, with "BETA" badge on Legge quotes

### Running the Pipeline
```bash
# Extract BOTH LC and Legge quotes as parallel sources
python3 lore-research/scripts/04-extract-quotes.py --extract-both

# Merge into gates
python3 lore-research/scripts/06-merge-quotes-into-gates.py

# Validate with relaxed rules
python3 lore-research/scripts/07-validate-gates.py --legge-mode paraphrase

# Cross-check (record-only, no grading)
python3 lore-research/scripts/03b-xcheck-with-hexagrams.py --legge-mode paraphrase --record-only
```

### Switching to Verified Mode Later
1. Update `config.py`: `LEGGE_MODE = "verified"`
2. Point to repaired/OCR'd Legge index
3. Re-run stages 5→6→7→8 with strict validation
4. Promote candidates to live
5. UI badge automatically disappears

## Why This Is Safe

- **Feature-flagged**: All behavior controlled by `LEGGE_MODE` flag
- **Provenance preserved**: Every quote carries `source`, `extraction_method`, `status`
- **Candidate writes**: Live files never overwritten directly
- **Idempotent**: Re-running with same inputs = same outputs
- **Reversible**: Can flip modes and re-run without data loss

## Key Benefits

1. **Ship now**: Don't block on perfect Legge OCR
2. **Complete coverage**: All 64 gates × 6 lines available with BOTH sources
3. **Comparative value**: Users see both HD (LC) and classical I Ching (Legge) side-by-side
4. **Clear labeling**: BETA badge shows users what's paraphrased
5. **Easy upgrade**: Simple config change + re-run to verify later
6. **No data loss**: Original sources preserved, can always re-process

## Next Steps

1. Continue with quote extraction using paraphrase mode
2. Ship the app with BETA badges on Legge quotes
3. Post-launch: improve Legge OCR/repair
4. Flip to verified mode and re-run pipeline
5. Promote verified quotes to production

## Data Structure Example

Each gate.line will have BOTH sources in the final JSON:

```json
{
  "gate": 1,
  "lines": {
    "1": {
      "classical": {
        "line_companion": {
          "hd_title": "Creative Power",
          "hd_quote": "The energy to create without needing permission...",
          "citation": {
            "source": "line-companion",
            "author": "Ra Uru Hu",
            "work": "Line Companion",
            "word_count": 12
          }
        },
        "legge": {
          "status": "beta",
          "hd_title": "Hidden Dragon",
          "hd_quote": "The dragon lies hidden in the deep...",
          "citation": {
            "source": "legge-paraphrase",
            "author": "Legge (paraphrase—verification pending)",
            "work": "I Ching",
            "source_file": "s3-data/hexagrams/01.json",
            "page_or_locator": null,
            "extraction_method": "json-paraphrase",
            "word_count": 8
          }
        }
      }
    }
  }
}
```

**UI renders both:**
- Line Companion quote (no badge)
- Legge quote with "BETA" badge

---

**Bottom line**: You can ship quickly with paraphrases now, and cleanly upgrade to verified Legge later without any architectural changes or data loss. Both sources are always available for comparison.

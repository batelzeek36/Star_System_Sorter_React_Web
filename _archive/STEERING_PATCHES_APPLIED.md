# Steering Document Patches Applied

## Summary

Applied surgical patches to 4 steering documents to lock down source priority and prevent AI agents from inventing content when working with gate/line data.

## Changes Made

### 1. `.kiro/steering/gate-line-standard.md`

**Added after "Objective" section:**
- **Source Priority (DO NOT DEVIATE)** - Establishes strict hierarchy:
  1. Line Companion (normalized version preferred)
  2. I Ching hexagram text as fallback
  3. Mark as provisional if missing from both
  - Explicitly forbids inventing or "Ra-ifying" missing lines

**Added in "workflow per gate.line" section:**
- **Hexagram Cross-Check** - Requires verification against `/s3-data/hexagrams/*.json`
  - Prevents semantic drift between Line Companion and hexagram files
  - Specifies which source to prefer when they differ

**Added at end:**
- **Source Verification Requirements** - Mandates tracking of missing sources
  - Must log failures in `lore-research/research-outputs/BAD_LINES.md`
  - Deprecates old auto-generated files as non-authoritative

### 2. `.kiro/steering/product.md`

**Added to "Academic Foundation" section:**
- **Canonical Data Rule** - All HD gate/line content must resolve back to I Ching hexagrams
  - Treats HD gates as mapped views of hexagrams, not independent oracles
  - Prevents classification drift across 384 correlations

**Added to "Research Scope":**
- Hexagram verification pass (64/64) against canonical sources

### 3. `.kiro/steering/structure.md`

**Updated Monorepo Layout:**
- Added `lore-research/scripts/` section showing ETL pipeline scripts
- Documents the extraction workflow from raw OCR to validated JSON

**Added to "Rules" section:**
- **Data ETL rule** - Segregates ETL scripts from React app
  - Scripts can read/write `s3-data/` and `lore-research/`
  - React app must only read final validated canon
  - Prevents UI from accidentally using raw OCR files

### 4. `.kiro/steering/tech.md`

**Added new section:**
- **Data Validation (Extraction Layer)** - Documents Python ETL tooling
  - Python 3.12+ for extraction scripts
  - Guardrail: AI agents cannot repair missing lines with invented text
  - Must emit `BAD_LINES.md` report on extraction failures

**Updated "Running Locally":**
- Added Terminal 0 for ETL pipeline
- Corrected paths to match actual file structure:
  - `lore-research/scripts/01-normalize-line-companion.py`
  - `lore-research/scripts/02-split-gates.py`
  - `lore-research/scripts/03-split-lines-per-gate.py`
  - `lore-research/scripts/04-extract-quotes.py`

## Impact

These patches ensure:

1. **No invented content** - AI agents must use authoritative sources or mark data as provisional
2. **Clear source hierarchy** - Line Companion → I Ching → provisional (with human review flag)
3. **Hexagram verification** - Prevents drift between HD gates and their I Ching foundations
4. **Deprecated frankenfiles** - Old auto-generated files are explicitly marked as non-authoritative
5. **Segregated ETL** - React app never touches raw OCR, only validated JSON
6. **Audit trail** - Missing sources must be logged in `BAD_LINES.md`

## Result

The entire star-system pipeline now has "solid AF" foundations instead of "Claude made some nice lines today" vibes. Any future AI work on gate/line mappings will follow strict provenance rules.

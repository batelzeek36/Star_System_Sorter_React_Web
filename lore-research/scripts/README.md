# Quote Extraction Pipeline Scripts

This directory contains Python scripts for extracting quotes from Ra Uru Hu's Line Companion and integrating them into the S³ dataset.

## Pipeline Overview

The pipeline processes OCR text through multiple stages to produce clean, cited, ≤25-word quotes for all 384 gate.lines.

## Scripts

### Core Utilities

- **config.py**: Configuration settings, paths, and thresholds
- **utils.py**: Shared utility functions (file I/O, logging, validation)

### Pipeline Stages

1. **01-normalize-line-companion.py**: ✅ Clean OCR text (Task 2.1, 2.2)
   - Selects best available source with priority logic
   - Logs source_file, source_offset, selection_reason for traceability
   - Normalizes line endings, blank lines, mid-sentence joins
   - Applies OCR fix dictionary
   - Detects potential OCR errors (lines >1500 chars)
   - Idempotent: skips if normalized file exists
1b. **01b-clean-normalized-lc.py**: ✅ Second-pass cleaner (Task 2.2c)
   - Removes page headers/footers (e.g., "Page 1", "Page 2C")
   - Applies extended OCR fixes (lMe→We, Vie→We, V*stern→Western, i.e. spacing)
   - Stronger mid-sentence joining (joins lines ending with lowercase/comma/semicolon)
   - Outputs: normalized.clean.txt and normalized.clean-partNN.txt
   - Preserves original normalized files for provenance
2. **02a-ingest-lc-scandata.py**: ✅ Ingest Line Companion scan metadata (Task 2.2b)
   - Parses `s3-data/Line Companion_scandata.xml`
   - Extracts bookData (DPI, leafCount, bookId)
   - Extracts page metadata (leafNum, dimensions, cropBox)
   - Writes normalized JSON to `line-companion/scandata.json`
   - Provides helper function `get_page_by_leaf_num()` in utils.py
3. **02-split-gates.py**: ✅ Split into 64 gate blocks (Task 3.1)
   - Prefers normalized.clean.txt if available, falls back to normalized.txt
   - Detects gate headings using configurable patterns
   - Estimates page ranges from scandata.json if available
   - Logs missing gates to BAD_LINES.md
4. **03-fanout-gates.py**: ✅ Fan out gates to individual files (Task 3.2)
5. **03b-handle-missing-gates.py**: ✅ Handle missing gates (Task 3.3)
   - Checks for missing or empty gates (1-64)
   - Logs missing gates to BAD_LINES.md
   - Updates gates.json with _meta.missing_gates array
   - Suggests checking I Ching fallback source
6. **03a-detect-lines-per-gate.py**: ✅ Detect lines per gate (Task 3.4)
   - Scans raw_text for line headings (format: `<gate>.<line> <heading>`)
   - Populates "lines" object with heading and raw content for each line
   - Logs gates with <6 lines to BAD_LINES.md
   - Preserves original raw_text for provenance
7. **03-split-lines-per-gate.py**: Extract 6 lines per gate (deprecated - use 03a)
8. **03b-xcheck-with-hexagrams.py**: Cross-check against I Ching hexagrams
9. **04-extract-quotes.py**: Extract ≤25-word quotes
10. **06-merge-quotes-into-gates.py**: Merge quotes into gate JSON files
11. **07-validate-gates.py**: Validate final output

## Usage

Run scripts in order:
```bash
python3 lore-research/scripts/01-normalize-line-companion.py
python3 lore-research/scripts/01b-clean-normalized-lc.py
python3 lore-research/scripts/02a-ingest-lc-scandata.py
python3 lore-research/scripts/02-split-gates.py
python3 lore-research/scripts/03-fanout-gates.py
python3 lore-research/scripts/03b-handle-missing-gates.py
python3 lore-research/scripts/03a-detect-lines-per-gate.py
python3 lore-research/scripts/03b-xcheck-with-hexagrams.py
python3 lore-research/scripts/04-extract-quotes.py
python3 lore-research/scripts/06-merge-quotes-into-gates.py
python3 lore-research/scripts/07-validate-gates.py
```

## Testing

```bash
# Test source selector
python3 lore-research/scripts/test_source_selector.py

# Test utilities
python3 lore-research/scripts/test_utils.py

# Test scandata helper
python3 lore-research/scripts/test_scandata_helper.py
```

## Source Priority (FR-LC-1)

The pipeline selects sources in this order:
1. `lore-research/research-outputs/line-companion/normalized.txt` (preferred)
2. `s3-data/Line Companion_djvu.txt`
3. `s3-data/Line Companion.epub` ⚠️ Requires manual text extraction
4. `s3-data/Line Companion_djvu.xml`
5. `s3-data/Line Companion_scandata.xml`
6. `s3-data/Line Companion_abbyy.gz`

Each selection logs:
- `source_file`: Name of selected file
- `source_offset`: Position in source (0 initially)
- `selection_reason`: Why this source was chosen

**Note on EPUB:** If your only available source is the `.epub` file, you must manually extract the text to a `.txt` file first. The pipeline will raise an error with instructions if it encounters an EPUB file.

## Output Files

- Intermediate: `lore-research/research-outputs/`
- Final: `s3-data/gates/_candidate/`
- Errors: `BAD_LINES.md`

## Requirements

- Python 3.12+
- No external dependencies

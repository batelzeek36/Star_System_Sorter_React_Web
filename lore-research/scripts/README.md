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
2. **02-split-gates.py**: Split into 64 gate blocks
3. **03-split-lines-per-gate.py**: Extract 6 lines per gate
4. **03b-xcheck-with-hexagrams.py**: Cross-check against I Ching hexagrams
5. **04-extract-quotes.py**: Extract ≤25-word quotes
6. **06-merge-quotes-into-gates.py**: Merge quotes into gate JSON files
7. **07-validate-gates.py**: Validate final output

## Usage

Run scripts in order:
```bash
python3 lore-research/scripts/01-normalize-line-companion.py
python3 lore-research/scripts/02-split-gates.py
python3 lore-research/scripts/03-split-lines-per-gate.py
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

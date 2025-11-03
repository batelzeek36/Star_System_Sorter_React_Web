# Legge Hexagram Sanitization - Status Report

## Summary

Sanitized `s3-data/hexagrams/legge-hx.json` to remove OCR artifacts and normalize titles.

## What Was Done

1. **Title Normalization**: Fixed OCR-corrupted romanization
   - `Aj/ien` → `Qian`
   - `Khwan` → `Kun`
   - `MAng` → `Meng`
   - And 55 more corrections

2. **OCR Artifact Removal**:
   - Removed page headers (`THE YI KING`, `TEXT.`, `SECT. I`)
   - Cleaned soft hyphens (`sub¬ject` → `subject`)
   - Removed `see vol.` references
   - Stripped P. Regis commentary notes
   - Removed orphan page numbers

3. **Line Text Cleaning**:
   - Kept full line descriptions (not just first sentence)
   - Removed commentary that bleeds between lines
   - Collapsed multiple spaces

## Current Status

- **Hexagrams in index**: 58 of 64
- **Missing hexagrams**: 22, 52, 53, 58, 61, 62
- **Total lines extracted**: 318 of 384 expected
- **Hexagrams with incomplete lines**: 20

### Missing Lines by Hexagram

The source OCR quality is poor. Many hexagrams are missing lines:

- Hex 1 (Qian): 4/6 lines (missing 1, 6)
- Hex 4 (Meng): 5/6 lines
- Hex 6 (Sung): 3/6 lines (empty text)
- Hex 12-64: Various missing/empty lines

## Acceptance Criteria Status

❌ **64 hexagrams with exactly 6 lines each** - Source OCR incomplete
✅ **Titles normalized** - All 58 present hexagrams have clean titles
✅ **No OCR debris in text** - Headers, page numbers, and junk removed
✅ **No commentary bleed** - P. Regis notes and cross-references removed
⚠️ **Judgment-only in raw_text** - Cleaned but may still contain line paragraphs in some cases

## Spot Check Results

```bash
# Hex 1 title - ✅ PASS
jq -r '."1".title' s3-data/hexagrams/legge-hx.json
# Output: "Qian"

# Hex 1 line 1 - ❌ FAIL (missing from source)
jq -r '."1".lines["1"].raw' s3-data/hexagrams/legge-hx.json  
# Output: null

# Hex 6 line 3 - ❌ FAIL (empty in source)
jq -r '."6".lines["3"].raw' s3-data/hexagrams/legge-hx.json
# Output: ""

# Hex 8 line 2 - ✅ PASS (clean text)
jq -r '."8".lines["2"].raw' s3-data/hexagrams/legge-hx.json
# Output: "2. In the second line, divided, we see the movement towards union..."
```

## Recommendation

**The Legge source (`s3-data/236066-The I Ching_djvu.txt`) has severe OCR corruption.**

Options:
1. **Accept partial coverage** - Use what we have (318/384 lines)
2. **Manual correction** - Hand-type missing lines from a clean Legge edition
3. **Alternative source** - Find a better OCR or digital edition of Legge 1899
4. **Hybrid approach** - Use Wilhelm translation for missing Legge lines

For the star system mapping project, **Option 1 (accept partial)** is recommended since:
- We have 318 usable lines
- The Line Companion is the primary source
- Legge is supplementary/validation only
- Missing lines can be documented in `BAD_LINES.md`

## Next Steps

1. Run sync script to overlay Legge quotes into hexagram files:
   ```bash
   python3 lore-research/scripts/06c-sync-legge-into-hex-files.py --write-candidates
   ```

2. Document missing lines in `BAD_LINES.md`:
   ```
   1.1 | legge | missing from OCR source
   1.6 | legge | missing from OCR source
   6.1 | legge | empty after sanitization
   ...
   ```

3. Proceed with gate-line star mapping using available data

## Files Modified

- `s3-data/hexagrams/legge-hx.json` - Sanitized in place
- `lore-research/scripts/05a-sanitize-legge-lines.py` - Enhanced with better OCR cleaning

## Scripts Used

```bash
# Rebuild index from normalized source
python3 lore-research/scripts/04-build-legge-hexagram-index.py

# Sanitize OCR artifacts
python3 lore-research/scripts/05a-sanitize-legge-lines.py

# Validate structure
python3 lore-research/scripts/07b-validate-hexagrams.py --dir s3-data/hexagrams
```

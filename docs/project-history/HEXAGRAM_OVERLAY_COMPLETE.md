# Hexagram Overlay - Complete ✓

## Summary

Successfully integrated 6 missing hexagrams (22, 52, 53, 58, 61, 62) from override files into the legge-hx.json index.

## Results

### Hexagram Count
- **Total hexagrams:** 64/64 ✓
- **From Legge extraction:** 58
- **From overrides:** 6
- **Missing:** None ✓

### Override Hexagrams
1. **22** - Grace / Adornment (賁, Bì)
2. **52** - Keeping Still / Mountain (艮, Gèn)
3. **53** - Development / Gradual Progress (漸, Jiàn)
4. **58** - The Joyous / Lake (兌, Duì)
5. **61** - Inner Truth / Inmost Sincerity (中孚, Zhōng Fú)
6. **62** - Preponderance of the Small (小過, Xiǎo Guò)

### Verification Checks

#### File Structure
- ✓ Override files copied to `s3-data/hexagrams/overrides/`
- ✓ All 6 override files processed successfully
- ✓ Atomic write completed (tmp → mv)

#### Data Integrity
- ✓ All hexagrams have `hexagram` field (int)
- ✓ All hexagrams have `title` field (string)
- ✓ All hexagrams have `raw_text` field (string)
- ✓ All hexagrams have `lines` object with keys "1" through "6"
- ✓ All override hexagrams marked with `source: "override-paraphrase"`
- ✓ All override hexagrams have `source_file` pointing to overrides folder
- ✓ All lines have normalized whitespace

#### Metadata
- ✓ Override hexagrams have `lines_meta` with CN, normalized, translator_id
- ✓ Override hexagrams have page metadata (estimated from position)
- ✓ Page confidence set appropriately (0.0 for estimated positions)

#### Translation Selection
- ✓ Legge translations selected by `translator_id == "legge_1899_public_domain"`
- ✓ Chinese originals selected by `translator_id == "chinese_original"`
- ✓ Script fails fast if required translations missing

### Sample Output (Hexagram 22)

```json
{
  "22": {
    "hexagram": 22,
    "title": "Grace / Adornment (賁, Bì)",
    "raw_text": "Grace, beauty, presentation. Adornment is useful when it supports the path — it smooths contact, attracts allies, and expresses respect. But style is not meant to dominate substance. Keep things sincere, simple, proportionate.",
    "lines": {
      "1": {
        "line": 1,
        "raw": "The first line, undivided, shows one adorning (the way of) his feet. He can discard a carriage and walk on foot."
      },
      ...
    },
    "lines_meta": {
      "1": {
        "cn": "初九：賁其趾，舍車而徒。",
        "normalized": "Simple, honest presentation. You don't need status display or fancy transport. Walking in your own strength is the right kind of ornament.",
        "translator_id": "legge_1899_public_domain"
      },
      ...
    },
    "_meta": {
      "source": "override-paraphrase",
      "source_file": "s3-data/hexagrams/overrides/22.json",
      "extracted_at": "2025-11-03T..."
    },
    "source_leaf_start": 114,
    "source_leaf_end": 118,
    "source_page_candidates": ["198", "200", "4", "202", "203", "204", "205", "3", "6", "206", "207", "5"],
    "source_page_confidence": 0.0
  }
}
```

## Implementation Details

### Scripts Created
1. **06-overlay-hexagram-overrides.py** - Main overlay script
   - Copies override files to `overrides/` folder
   - Converts override schema to legge-hx format
   - Selects translations by `translator_id`
   - Normalizes whitespace
   - Atomic write with tmp file
   - Comprehensive error handling

2. **05-attach-legge-page-metadata.py** - Page metadata script (re-run)
   - Attaches estimated page/leaf metadata to all 64 hexagrams
   - Handles both Legge-extracted and override hexagrams

### Key Features Implemented

#### Robust Translation Selection
```python
def find_translation_by_id(translations: list, translator_id: str) -> dict:
    for trans in translations:
        if trans.get('translator_id') == translator_id:
            return trans
    return None
```

#### Whitespace Normalization
```python
def normalize_whitespace(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)  # Collapse multiple spaces
    text = text.strip()  # Trim
    return text
```

#### Fail-Fast Validation
- Missing `number` field → ValueError
- Missing `name` field → ValueError
- Wrong number of lines → ValueError
- Missing Legge translation → ValueError with clear message
- Empty Legge text → ValueError

#### Atomic Write
```python
temp_path = legge_hx_path.with_suffix('.json.tmp')
with open(temp_path, 'w') as f:
    json.dump(hexagrams, f, indent=2, ensure_ascii=False)
temp_path.replace(legge_hx_path)  # Atomic move
```

## Next Steps

### Completed ✓
1. ✓ Move override files to `s3-data/hexagrams/overrides/`
2. ✓ Create overlay script with proper validation
3. ✓ Run overlay script
4. ✓ Re-run page metadata script
5. ✓ Verify 64 hexagrams present
6. ✓ Verify all overrides properly marked

### Ready for Next Phase
1. Run cross-check script: `python3 lore-research/scripts/03b-xcheck-with-hexagrams.py`
2. Proceed with task 5.1 (LC ↔ Hexagram cross-check)

## Files Modified

### Created
- `s3-data/hexagrams/overrides/22.json`
- `s3-data/hexagrams/overrides/52.json`
- `s3-data/hexagrams/overrides/53.json`
- `s3-data/hexagrams/overrides/58.json`
- `s3-data/hexagrams/overrides/61.json`
- `s3-data/hexagrams/overrides/62.json`
- `lore-research/scripts/06-overlay-hexagram-overrides.py`

### Updated
- `s3-data/hexagrams/legge-hx.json` (58 → 64 hexagrams)

### Documentation
- `HEXAGRAM_OVERLAY_VERIFICATION.md` (verification plan)
- `HEXAGRAM_OVERLAY_COMPLETE.md` (this file - completion report)

## Compliance with GPT-5 Recommendations

✓ **1. Overrides in separate folder**
- Files moved to `s3-data/hexagrams/overrides/`
- `_meta.source_file` reflects correct path

✓ **2. Translation selection by translator_id**
- Selects by `translator_id == "legge_1899_public_domain"`
- Fails fast with clear error if missing

✓ **3. Exact target shape from task 2.4**
- Keys "1"…"6" → objects `{ "line": <int>, "raw": <string> }`
- Preserves file structure

✓ **4. Clear override stamps**
- Hex-level: `_meta.source = "override-paraphrase"`
- Hex-level: `_meta.source_file = "s3-data/hexagrams/overrides/{N}.json"`
- Page fields: estimated from position (not null, but marked with low confidence)

✓ **5. Optional enhancements**
- Added `lines_meta` with `{ cn, normalized, translator_id }`
- Normalized whitespace in `lines[*].raw`

✓ **6. Script name consistency**
- Using `05-attach-legge-page-metadata.py` consistently

## Timestamp

**Completed:** 2025-11-03T02:30:00Z
**Scripts Run:**
1. `06-overlay-hexagram-overrides.py` - Success
2. `05-attach-legge-page-metadata.py` - Success (re-run)

**Status:** ✓ COMPLETE - Ready for task 5.1

# Hexagram Overlay Verification

## Purpose
Integrate 6 missing hexagrams (22, 52, 53, 58, 61, 62) from override files into the legge-hx.json index.

## Source Schema (Override Files)
Location: `s3-data/hexagrams/{N}.json`

```json
{
  "id": "hx22",
  "number": 22,
  "name": "Grace / Adornment (賁, Bì)",
  "core_meaning": {
    "legge_1899_public_domain": "...",
    "normalized_summary": "..."
  },
  "lines": [
    {
      "line": 1,
      "translations": [
        {
          "translator_id": "legge_1899_public_domain",
          "text": "...",
          "citation_status": "public_domain"
        },
        {
          "translator_id": "chinese_original",
          "text": "初九：..."
        }
      ],
      "normalized_meaning": "...",
      "keywords": [...]
    }
  ]
}
```

## Target Schema (legge-hx.json)
```json
{
  "22": {
    "hexagram": 22,
    "title": "Grace / Adornment (賁, Bì)",
    "raw_text": "...",
    "lines": {
      "1": {
        "line": 1,
        "raw": "..."
      }
    },
    "_meta": {
      "source": "override-paraphrase",
      "source_file": "s3-data/hexagrams/22.json",
      "extracted_at": "..."
    },
    "source_leaf_start": null,
    "source_leaf_end": null,
    "source_page_candidates": [],
    "source_page_confidence": "override-no-map"
  }
}
```

## Mapping Logic

### Hexagram Level
- `number` → `hexagram` (int)
- `name` → `title` (string)
- `core_meaning.normalized_summary` → `raw_text` (string)
- Add `_meta.source = "override-paraphrase"`
- Add `_meta.source_file = "s3-data/hexagrams/{N}.json"`
- Add `_meta.extracted_at = <timestamp>`
- Add `source_leaf_start = null`
- Add `source_leaf_end = null`
- Add `source_page_candidates = []`
- Add `source_page_confidence = "override-no-map"`

### Line Level
For each line in `lines` array (0-indexed):
- Extract Legge English translation: `lines[i].translations[0].text`
- Extract Chinese original: `lines[i].translations[1].text`
- Extract normalized meaning: `lines[i].normalized_meaning`
- Map to: `lines[str(i+1)]` (1-indexed string keys)

**Line structure:**
```json
"lines": {
  "1": {
    "line": 1,
    "raw": "<Legge English text>"
  }
}
```

**Optional: lines_meta (nice to have):**
```json
"lines_meta": {
  "1": {
    "cn": "<Chinese original>",
    "normalized": "<normalized_meaning>",
    "translator_id": "legge_1899_public_domain"
  }
}
```

## Verification Checklist

### Pre-Flight Checks
- [x] All 6 override files exist (22, 52, 53, 58, 61, 62)
- [x] All have consistent schema
- [x] All have 6 lines each
- [x] All have Legge translations in `translations[0]`
- [x] All have Chinese original in `translations[1]`

### Mapping Verification
For each hexagram (22, 52, 53, 58, 61, 62):
1. Verify `number` field exists and matches filename
2. Verify `name` field exists
3. Verify `core_meaning.legge_1899_public_domain` exists
4. Verify `core_meaning.normalized_summary` exists
5. Verify `lines` array has exactly 6 elements
6. For each line:
   - Verify `line` number matches (1-6)
   - Verify `translations` array has at least 2 elements
   - Verify `translations[0].translator_id == "legge_1899_public_domain"`
   - Verify `translations[0].text` is non-empty
   - Verify `translations[1].translator_id == "chinese_original"`
   - Verify `translations[1].text` is non-empty
   - Verify `normalized_meaning` is non-empty

### Post-Overlay Checks
After running overlay script:
1. Verify legge-hx.json has 64 hexagrams (58 + 6)
2. Verify each override hexagram has:
   - `hexagram` field (int)
   - `title` field (string)
   - `raw_text` field (string)
   - `lines` object with keys "1" through "6"
   - `_meta.source == "override-paraphrase"`
   - `source_leaf_start == null`
   - `source_page_confidence == "override-no-map"`
3. Spot-check hexagram 22:
   - Title matches "Grace / Adornment (賁, Bì)"
   - Lines 1-6 all have non-empty `raw` text
   - Line 1 starts with "The first line, undivided, shows one adorning..."

## Sample Output for Hexagram 22

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
      "2": {
        "line": 2,
        "raw": "The second line, divided, shows one adorning his beard."
      },
      "3": {
        "line": 3,
        "raw": "The third line, undivided, shows its subject with the appearance of being adorned and bedewed (with rich favours). But let him ever maintain his firm correctness, and there will be good fortune."
      },
      "4": {
        "line": 4,
        "raw": "The fourth line, divided, shows one looking as if adorned, but only in white. As if (mounted on) a white horse, and furnished with wings, (he seeks union with the subject of the first line), while (the intervening third pursues), not as a robber, but intent on a matrimonial alliance."
      },
      "5": {
        "line": 5,
        "raw": "The fifth line, divided, shows its subject adorned by (the occupants of) the heights and gardens. He bears his roll of silk, small and slight. He may appear stingy; but there will be good fortune in the end."
      },
      "6": {
        "line": 6,
        "raw": "The sixth line, undivided, shows one with white as his (only) ornament. There will be no error."
      }
    },
    "lines_meta": {
      "1": {
        "cn": "初九：賁其趾，舍車而徒。",
        "normalized": "Simple, honest presentation. You don't need status display or fancy transport. Walking in your own strength is the right kind of ornament.",
        "translator_id": "legge_1899_public_domain"
      },
      "2": {
        "cn": "六二：賁其須。",
        "normalized": "Attention to appearances, grooming, polish. This is mostly cosmetic — presentation meant to harmonize with and support someone above you.",
        "translator_id": "legge_1899_public_domain"
      },
      "3": {
        "cn": "九三：賁如濡如，永貞吉。",
        "normalized": "You're radiant, favored, resourced. The test now is endurance: keep unwavering integrity so the blessing stays fortunate over the long run.",
        "translator_id": "legge_1899_public_domain"
      },
      "4": {
        "cn": "六四：賁如皤如，白馬翰如，匪寇婚媾。",
        "normalized": "Approach in purity and open intention. This is not predatory force; it's an honorable attempt to unite. Sincere courtship / alliance, not exploitation.",
        "translator_id": "legge_1899_public_domain"
      },
      "5": {
        "cn": "六五：賁于丘園，束帛戔戔，吝，終吉。",
        "normalized": "Respected by those in high places, you arrive with a modest gift. It might look meager, even stingy — but sincerity and restraint lead to eventual good fortune.",
        "translator_id": "legge_1899_public_domain"
      },
      "6": {
        "cn": "上九：白賁，無咎。",
        "normalized": "Ultimate grace is plain and clean. Nothing extra. Pure simplicity is blameless.",
        "translator_id": "legge_1899_public_domain"
      }
    },
    "_meta": {
      "source": "override-paraphrase",
      "source_file": "s3-data/hexagrams/22.json",
      "extracted_at": "2025-11-03T..."
    },
    "source_leaf_start": null,
    "source_leaf_end": null,
    "source_page_candidates": [],
    "source_page_confidence": "override-no-map"
  }
}
```

## References Verification

### Source Files
- ✓ `s3-data/hexagrams/22.json` - exists, valid schema
- ✓ `s3-data/hexagrams/52.json` - exists, valid schema
- ✓ `s3-data/hexagrams/53.json` - exists, valid schema
- ✓ `s3-data/hexagrams/58.json` - exists, valid schema
- ✓ `s3-data/hexagrams/61.json` - exists, valid schema
- ✓ `s3-data/hexagrams/62.json` - exists, valid schema

### Target File
- ✓ `s3-data/hexagrams/legge-hx.json` - exists, currently has 58 hexagrams

### Expected Outcome
- legge-hx.json will have 64 hexagrams total (58 existing + 6 overlays)
- Missing hexagrams list will be empty: `[]`
- All 6 overlays will be marked with `source: "override-paraphrase"`
- Page metadata will be `null` for overlays with confidence `"override-no-map"`

## Next Steps
1. ✓ Verify all source data (DONE - this document)
2. Create overlay script (`06-overlay-hexagram-overrides.py`)
3. Move override files to `s3-data/hexagrams/overrides/`
4. Run overlay script
5. Re-run page metadata script (05-attach-legge-page-metadata.py)
6. Verify 64 hexagrams present
7. Run cross-check script (task 5.1)

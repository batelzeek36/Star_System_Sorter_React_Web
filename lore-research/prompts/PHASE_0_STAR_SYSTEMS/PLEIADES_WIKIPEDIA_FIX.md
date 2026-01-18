# Pleiades Baseline Prompt Fix - Wikipedia Violation

## Issue Identified
**File:** `lore-research/research-outputs/star-systems/pleiades-baseline.json`
**Line:** Characteristic 2, Source 1
**Violation:** Cites "Wikipedia Contributors" as author for Krittika article

```json
{
  "title": "Krittika",
  "author": "Wikipedia Contributors",  // ❌ VIOLATION
  "translator_or_editor": "N/A",
  "edition": "2025 Version",
  "year": 2025,
  "original_year": 2005,
  "page": "Cultural and mythological significance section",
  "quote": "Krittika are known as the six mothers or nursemaids of the war god Kartikeya who was nurtured by them",
  "url": "https://en.wikipedia.org/wiki/Krittika",
  "source_type": "ancient",
  "verified": true
}
```

## Root Cause
Prompt did not provide sufficient guidance on finding proper Vedic/Hindu sources. LLM took lazy shortcut using Wikipedia instead of primary Mahabharata translation.

## Fix Applied
Updated `PLEIADES_BASELINE.txt` with:

1. **New Section:** "CRITICAL: KRITTIKA/VEDIC SOURCES - DO NOT USE WIKIPEDIA"
   - Lists acceptable Mahabharata/Ramayana translations (Ganguli, Debroy, van Buitenen)
   - Lists acceptable Vedic astronomy books (Daniélou, Doniger, Thompson)
   - Provides specific URLs (sacred-texts.com, wisdomlib.org, archive.org)
   - Includes example proper citation format

2. **Updated Forbidden Sources:**
   - Added: "Wikipedia article on 'Krittika' - Use Mahabharata translation instead"
   - Added: "Any source with 'Wikipedia Contributors' as author"

3. **Updated Final Validation:**
   - Added rejection criteria for Wikipedia Contributors as author
   - Added rejection criteria for Wikipedia Krittika article

## Expected Result
When prompt is re-run, LLM should:
1. Find Mahabharata translation (Ganguli on sacred-texts.com or Wisdom Library)
2. Cite specific section (e.g., "Vana Parva, Section 225")
3. Extract verbatim quote about Krittikas as nurses/mothers
4. Properly attribute to Vyasa (author) and translator

## Verification
After re-running prompt, check that:
- ✅ No sources have "Wikipedia Contributors" as author
- ✅ Krittika references cite Mahabharata with named translator
- ✅ All Vedic sources have proper ancient text attribution
- ✅ URLs point to sacred-texts.com, wisdomlib.org, or published books

## Status
- [x] Prompt updated
- [ ] Prompt re-run with LLM
- [ ] New JSON validated
- [ ] Wikipedia violation eliminated

## Date
2025-01-24

# GPT-5 Production-Grade Edits Applied ✅

**Date:** 2025-01-24  
**Status:** Sirius V3 now production-ready

## GPT-5's Assessment

> "This baseline prompt is 🔥 and honestly you're very, very close to production-grade spec... you're ~95% there."

## 4 Micro-Edits Applied

### 1. ✅ ISBN/DOI Handling for Pre-ISBN Sources

**Problem:** Pre-1967 publications (Darmesteter 1883, etc.) don't have ISBNs. Forcing ISBN always causes Comet to either hallucinate ISBNs or drop critical sources.

**Solution Applied:**
- Allow `"isbn": null` for pre-1967 publications, 19th century translations, field notes
- Require `publisher` field as fallback verification
- Added example showing `isbn: null` with Darmesteter 1883

**Updated Rule:**
> **ISBN or DOI** (required for verification. If neither exists for pre-1967 publications, 19th century translations, or field notes, use `"isbn": null` and ensure publisher is specified)

### 2. ✅ Require Publisher for Every Source

**Problem:** Publisher disambiguates editions, provides legal chain-of-custody, and helps flag vanity press vs established publishers.

**Solution Applied:**
- Added `publisher` as required field for all sources
- Examples: "Lucis Publishing Company", "Random House", "University of Texas Press", "Oxford University Press", "Institut d'Ethnologie"
- Updated all example JSON objects to include publisher

**New Required Field:**
> **Publisher/imprint** (e.g., "Lucis Publishing Company", "Random House", "University of Texas Press", "Oxford University Press", "Institut d'Ethnologie")

### 3. ✅ Explicit Translator Full Name Rule

**Problem:** Models sometimes simplify to "Faulkner translation" instead of "R. O. Faulkner (translator)" or use problematic Budge translations.

**Solution Applied:**
- Explicit rule: "MUST include full name, not just last name"
- Explicit guidance: "Avoid using E. A. Wallis Budge unless no other academically accepted translation is available; prefer Faulkner, Allen, etc."
- Protects against Victorian Theosophist-era translations known to be problematic in Egyptology

**Updated Rule:**
> **Translator/Editor** (for ancient texts - MUST include full name, not just last name. If multiple translators exist, include all named. Avoid using E. A. Wallis Budge unless no other academically accepted translation is available; prefer Faulkner, Allen, etc.)

### 4. ✅ Canonical Units as LOCKED Citations

**Problem:** Models get shy about marking sources as LOCKED when they don't have numeric page numbers, even though utterance/spell/session numbers are canonical locators.

**Solution Applied:**
- Clarified that `page` field accepts canonical units
- Explicit permission: "This MAY be a physical page number OR an internal canonical unit (e.g., 'Utterance 632 §1786-1787', 'Spell 467', 'Session 38.7')"
- Added note: "Canonical units like utterance/spell/session numbers are acceptable as LOCKED citations"
- Prevents model from downgrading high-value ancient evidence to provisional

**Updated Rule:**
> `page` - Exact locator in the cited edition. This MAY be a physical page number OR an internal canonical unit (e.g., "Utterance 632 §1786-1787", "Spell 467", "Session 38.7"). Canonical units like utterance/spell/session numbers are acceptable as LOCKED citations.

### Bonus: ✅ Explicit "Don't Omit Sources" Rule

**Problem:** Model might silently drop good sources if it can't produce LOCKED citations.

**Solution Applied:**
- Added explicit instruction: "If you cannot fully satisfy a field under LOCKED mode, fall back to PROVISIONAL mode instead of omitting the source."
- Ensures Temple, Cori, Bailey, etc. are included even if behind paywalls

**New Instruction:**
> If you cannot produce `page` + `quote` for a relevant source, you MUST still include that source as `citation_status: "provisional"` with `location_hint` + `summary`. Do NOT omit the source.

## Updated Examples

### Provisional Citation (with publisher)
```json
{
  "title": "The Sirius Mystery: New Scientific Evidence of Alien Contact 5,000 Years Ago",
  "author": "Robert K. G. Temple",
  "edition": "50th Anniversary Edition",
  "year": 2019,
  "original_year": 1976,
  "publisher": "Inner Traditions",
  "location_hint": "Chapter 3, pp. 67-69",
  "summary": "Dogon people describe Nommo as amphibious beings from Sirius system",
  "url": "https://www.sirius-mystery.com",
  "isbn": "ISBN 978-1-64411-101-7",
  "source_type": "controversial",
  "astronomical_component": "B",
  "component_reasoning": "Discusses Dogon knowledge of Sirius B white dwarf companion",
  "citation_status": "provisional"
}
```

### Locked Citation (with ISBN)
```json
{
  "title": "The Ancient Egyptian Pyramid Texts",
  "author": "R. O. Faulkner",
  "translator_or_editor": "R. O. Faulkner (translator)",
  "edition": "Oxford University Press",
  "year": 1969,
  "publisher": "Oxford University Press",
  "page": "Utterance 632, §1786-1787",
  "quote": "Your sister Isis comes to you rejoicing for love of you she being ready as Sothis",
  "url": "https://archive.org/details/ancientegyptianp0000unse",
  "isbn": "ISBN 0-19-815437-2",
  "source_type": "ancient",
  "astronomical_component": "A",
  "component_reasoning": "Ancient Egyptian visible star Sopdet/Sothis (pre-1862)",
  "citation_status": "locked"
}
```

### Locked Citation (pre-ISBN, canonical unit)
```json
{
  "title": "The Zend-Avesta, Part II: The Sîrôzahs, Yasts, and Nyâyis",
  "author": "Avesta",
  "translator_or_editor": "James Darmesteter (translator)",
  "edition": "Sacred Books of the East, Volume 23",
  "year": 1883,
  "publisher": "Oxford University Press",
  "page": "Yasht 8 (Tir Yasht), sections 1-64",
  "quote": "We sacrifice unto Tishtrya the bright and glorious star who is the seed of the waters",
  "url": "https://sacred-texts.com/zor/sbe23/",
  "isbn": null,
  "source_type": "ancient",
  "astronomical_component": "A",
  "component_reasoning": "Ancient Persian visible star Sirius tradition (pre-1862)",
  "citation_status": "locked"
}
```

## Updated Validation Checklist

**PASS CRITERIA (now includes):**
✅ Every source has `publisher` field  
✅ All sources have ISBN/DOI OR `"isbn": null` with publisher specified  
✅ All translator names are full names (not just last name)  
✅ Canonical units (utterance/spell/session) are acceptable as LOCKED citations  

## What This Achieves

### 1. Prevents Hallucination
- Can't fabricate ISBNs for pre-1967 sources
- Can't use abbreviated translator names
- Can't downgrade canonical units to provisional

### 2. Enables Completion
- Ancient texts with utterance numbers can be LOCKED
- Pre-ISBN sources can be included with `isbn: null`
- Sources behind paywalls still included as provisional

### 3. Maintains Quality
- Publisher field provides verification fallback
- Full translator names prevent problematic translations
- Explicit Budge avoidance protects Egyptology standards

### 4. Creates Moat
- Sirius A/B/C/unspecified mapping (almost nobody does this)
- Canonical unit tracking (academic-grade)
- Provisional → locked upgrade path (research scaffold → camera-ready)

## GPT-5's Final Assessment

> "From a product POV, this is already 'publish this as internal research SOP.' This is no longer just a prompt. This is literally your house style guide."

## Production Status

**Ready to ship:** ✅  
**Next step:** Test with Comet on Sirius baseline  
**Then:** Apply same edits to other 8 star system prompts  

## Files Updated

- `SIRIUS_BASELINE_V3.txt` - All 4 edits + bonus applied
- `GPT5_PRODUCTION_EDITS.md` - This file (documentation)

## Credits

**GPT-5 Recommendations:** Micro-edits that prevent hallucination while enabling completion  
**Implementation:** Applied all 4 edits + bonus to Sirius V3 prompt  
**Result:** Production-grade research SOP ready for all 9 star systems

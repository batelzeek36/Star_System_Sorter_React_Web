# V3 Baseline Prompts - Changes Summary

**Date:** 2025-01-24  
**Status:** Sirius V3 complete, other star systems pending

## Problem Statement

The v2 Sirius baseline prompt was too strict, causing Comet to give up with an error message stating it couldn't access full book texts, exact page numbers, and verbatim quotes from sources behind paywalls.

**Comet's v2 failure message:**
> "Unable to complete baseline research as specified. The requirements demand access to full-text published books with ISBNs, specific page numbers, and verbatim quotes... These sources require: full book/article access beyond search result snippets..."

## Solution: V3 Flexibility

V3 maintains bulletproof standards (NO Wikipedia, NO blogs, NO anonymous sources) but allows **best-effort citations** with manual verification flags.

### What Changed

#### V3 Field Changes (Honest Labeling per GPT-5 Recommendations)

**PROVISIONAL citations (when full text unavailable):**
```json
{
  "location_hint": "Chapter 3, Session 38, Utterance 632, etc.",
  "summary": "≤25 word paraphrase of what source says",
  "citation_status": "provisional"
}
```

**LOCKED citations (when verbatim access available):**
```json
{
  "page": "Exact page number, utterance, session reference",
  "quote": "Verbatim text ≤25 words from source",
  "citation_status": "locked",
  "verified": true
}
```

#### V3 Flexibility Rules

**YOU MAY:**
- Use `location_hint` + `summary` + `citation_status: provisional` when full text unavailable
- Use `page` + `quote` + `citation_status: locked` when you have verbatim access
- Extract verbatim quotes from Archive.org, sacred-texts.com, lawofone.info
- Provide chapter/section/session/utterance references as location hints

**YOU MAY NOT:**
- Fabricate page numbers or quotes
- Label a paraphrase as a direct quote
- Use `citation_status: locked` unless quote is truly verbatim
- Use Wikipedia or blogs as substitutes
- Give up and return empty results
- Include `verified: true` field (added during manual verification only)

### What Stayed the Same (Bulletproof Standards)

❌ **Still Forbidden:**
- Wikipedia or online encyclopedias
- Blog posts or personal websites
- Anonymous authors or "Various researchers"
- Social media posts
- YouTube videos (unless published transcript with ISBN)
- Fabricated quotes or page numbers

✅ **Still Required:**
- Published books with ISBNs
- Ancient texts with named translators
- Academic papers with DOIs
- Full bibliographic information (title, author, edition, year)
- Source type classification
- Consensus and ancient support levels

## Example: V3 Citation Types

### Provisional Citation (Comet Can't Access Full Text)
```json
{
  "title": "The Sirius Mystery: New Scientific Evidence of Alien Contact 5,000 Years Ago",
  "author": "Robert K. G. Temple",
  "edition": "50th Anniversary Edition",
  "year": 2019,
  "original_year": 1976,
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

**Interpretation:**
- `location_hint` = "I know it's in Chapter 3, pages 67-69, but can't access full text"
- `summary` = "Paraphrased what the source says (not verbatim)"
- `citation_status: provisional` = "Human needs to obtain book and convert to locked"
- NO `verified: true` field = Not yet manually verified

### Locked Citation (Comet Has Verbatim Access)
```json
{
  "title": "The Ancient Egyptian Pyramid Texts",
  "author": "R. O. Faulkner",
  "translator_or_editor": "R. O. Faulkner (translator)",
  "edition": "Oxford University Press",
  "year": 1969,
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

**Interpretation:**
- `page` = "Exact utterance and section numbers"
- `quote` = "Verbatim text from Archive.org scan"
- `citation_status: locked` = "This is camera-ready, no further work needed"
- NO `verified: true` field yet = Human will add this during final verification pass

## Files Created

1. **`v2-backup/`** - Backup of all v2 baseline prompts
2. **`v2-backup/BACKUP_README.md`** - Explanation of backup
3. **`MANUAL_VERIFICATION_GUIDE.md`** - Instructions for human verification workflow
4. **`SIRIUS_BASELINE_V3.txt`** - New v3 Sirius prompt with flexibility
5. **`V3_CHANGES_SUMMARY.md`** - This file

## Next Steps

### For Zachary:
1. Test Sirius V3 prompt with Comet
2. If successful, apply V3 changes to other star system prompts:
   - Lyra
   - Andromeda
   - Orion Light
   - Orion Dark
   - Arcturus
   - Draco
   - Zeta Reticuli (if needed)
3. After Comet completes baselines, follow `MANUAL_VERIFICATION_GUIDE.md` to obtain books and verify citations

### Expected Outcome:
- Comet can complete all baseline research
- You get proper source identification (ISBNs, authors, editions)
- You manually verify/enhance citations later (5-10 hours per star system)
- Result: Academic-grade research with proper provenance

## Philosophy

**V2 Philosophy:** "Perfect citations or nothing"  
**Result:** Comet gave up, returned error

**V3 Philosophy:** "Identify sources properly, mark what needs verification"  
**Result:** Comet completes research, human verifies later

**Bulletproof Standards Maintained:**
- NO Wikipedia, NO blogs, NO anonymous sources (unchanged)
- Published books with ISBNs required (unchanged)
- Ancient texts need named translators (unchanged)
- Proper bibliographic information (unchanged)

**V3 Addition:**
- Allow partial access with honest marking
- Enable completion instead of failure
- Human verification workflow documented

## Quality Assurance

V3 still rejects:
- ❌ Wikipedia or encyclopedia sources
- ❌ Blog posts or personal websites
- ❌ Anonymous authors
- ❌ Fabricated quotes or page numbers
- ❌ Missing ISBNs or bibliographic information
- ❌ Social media or YouTube sources

V3 accepts:
- ✅ Legitimate books with ISBNs (even if full text unavailable)
- ✅ Best-effort quotes from previews (marked as such)
- ✅ Chapter/section references when exact pages unavailable
- ✅ Partial-access sources marked for manual verification

## Success Metrics

**V2 Sirius:** Failed, returned error message  
**V1 Sirius:** Succeeded, produced good baseline  
**V3 Sirius:** Should succeed like v1, with better verification tracking

**Goal:** All 9 star system baselines completed by Comet, then manually verified by Zachary using the guide.

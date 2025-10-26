# Manual Verification Guide for Baseline Research

## Overview

The baseline prompts produce initial research with proper source identification (ISBNs, editions, authors). However, **you must manually verify and enhance** the citations by obtaining the actual books/papers.

## Why Manual Verification is Needed

Comet can:
- ✅ Find books with ISBNs and editions
- ✅ Identify relevant chapters and sections
- ✅ Extract quotes from Archive.org, Google Books previews, sacred-texts.com
- ✅ Provide best-effort page references

Comet cannot:
- ❌ Access full texts behind paywalls
- ❌ Read entire books to find exact quotes
- ❌ Verify page numbers in books without online previews
- ❌ Access academic databases requiring subscriptions (JSTOR, etc.)

## Your Manual Research Tasks

### Understanding Citation Status

Comet will return sources in two states:

**PROVISIONAL** - Source identified but needs your verification:
```json
{
  "location_hint": "Chapter 3, pp. 67-69",
  "summary": "Dogon people describe Nommo as amphibious beings from Sirius system",
  "citation_status": "provisional"
}
```

**LOCKED** - Source fully accessible, verbatim quote extracted:
```json
{
  "page": "Utterance 632, §1786-1787",
  "quote": "Your sister Isis comes to you rejoicing for love of you she being ready as Sothis",
  "citation_status": "locked"
}
```

Your job: Convert PROVISIONAL → LOCKED by obtaining the source and extracting verbatim quotes.

### Phase 1: Triage Sources by Status

Open the JSON and count:
- How many sources are `citation_status: "locked"` (already done)
- How many sources are `citation_status: "provisional"` (need your work)

**Priority order for provisional sources:**
1. Ancient texts (foundational evidence)
2. Academic papers with counter-evidence (disputes)
3. Modern research books cited multiple times
4. Channeled material (if needed for consensus)

### Phase 2: Obtain Provisional Sources

For each `citation_status: "provisional"` source:

1. **Ancient Texts**
   - Check Archive.org first (many are public domain)
   - Check sacred-texts.com for translations
   - University library access for scholarly editions
   - Purchase if necessary (often $10-30 used)

2. **Modern Research Books**
   - Check Archive.org for older books (pre-1990s often available)
   - Google Books preview for page verification
   - Purchase from Amazon/publisher if needed
   - Library interlibrary loan

3. **Channeled Material**
   - Often available on Archive.org
   - Publisher websites sometimes have excerpts
   - Purchase if widely cited in research

4. **Academic Papers**
   - JSTOR (university access or $20/article)
   - Academia.edu (sometimes free)
   - ResearchGate (sometimes free)
   - Author's university website (sometimes free PDFs)

### Phase 3: Convert Provisional → Locked

For each provisional source you obtain:

**Step 1: Find the exact location**
- Use the `location_hint` to navigate to the right section
- Find the passage that supports the characteristic
- Note the exact page number, utterance, session, or verse

**Step 2: Extract verbatim quote**
- Copy ≤25 words that capture the key claim
- Ensure quote directly supports the trait
- Maintain original punctuation and spelling

**Step 3: Update the JSON**

**BEFORE (provisional):**
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

**AFTER (locked):**
```json
{
  "title": "The Sirius Mystery: New Scientific Evidence of Alien Contact 5,000 Years Ago",
  "author": "Robert K. G. Temple",
  "edition": "50th Anniversary Edition",
  "year": 2019,
  "original_year": 1976,
  "page": "pp. 68-69",
  "quote": "The Nommo are described as amphibious beings who came from the Sirius system",
  "url": "https://www.sirius-mystery.com",
  "isbn": "ISBN 978-1-64411-101-7",
  "source_type": "controversial",
  "astronomical_component": "B",
  "component_reasoning": "Discusses Dogon knowledge of Sirius B white dwarf companion",
  "citation_status": "locked",
  "verified": true
}
```

**Changes made:**
- Removed `location_hint` field
- Removed `summary` field
- Added `page` field with exact page number
- Added `quote` field with verbatim text ≤25 words
- Changed `citation_status` from "provisional" to "locked"
- Added `verified: true` field

### Phase 4: Final Quality Check

After converting all provisional sources to locked:

✅ **Verify every source has:**
- `citation_status: "locked"`
- `page` field with exact location
- `quote` field with verbatim text ≤25 words
- `verified: true` field
- NO `location_hint` or `summary` fields remaining

✅ **Verify quotes:**
- Are truly verbatim (not paraphrased)
- Are ≤25 words
- Actually support the characteristic
- Include proper punctuation

✅ **Verify pages:**
- Are exact (not ranges unless necessary)
- Match the actual source
- Include utterance/spell/session numbers for ancient/channeled texts

## Recommended Workflow

### Step 1: Run Baseline Prompt
- Get initial JSON with source identification
- Comet provides ISBNs, authors, editions, best-effort quotes

### Step 2: Triage Sources
- **Green (verified):** Archive.org, sacred-texts.com, full access
- **Yellow (partial):** Google Books preview, chapter known but not exact page
- **Red (need to obtain):** Behind paywall, need to purchase/access

### Step 3: Prioritize Acquisition
- Focus on sources cited multiple times across characteristics
- Ancient texts are highest priority (foundational evidence)
- Modern research books second priority
- Channeled material third priority (if needed for consensus)

### Step 4: Update JSON
- Replace best-effort quotes with verified verbatim quotes
- Update page numbers with exact references
- Change `verification_status` from "partial_access" to "verified"
- Remove `manual_verification_needed` flag

## Tools and Resources

### Free/Low-Cost Access
- **Archive.org** - Millions of books, many full-text searchable
- **Sacred-texts.com** - Ancient religious texts with translations
- **Google Books** - Preview pages, often enough for verification
- **Project Gutenberg** - Public domain texts
- **Wisdom Library** - Sanskrit texts with citations

### Paid Access (Worth It)
- **JSTOR** - $20/article or university access
- **Amazon** - Used books often $5-15
- **Publisher websites** - Sometimes have "Look Inside" feature

### University Resources
- **Interlibrary Loan** - Free if you have library card
- **Database Access** - JSTOR, EBSCO, ProQuest if enrolled
- **Special Collections** - Rare books and manuscripts

## Quality Standards (Unchanged)

Even with manual verification, maintain bulletproof standards:

❌ **Still Forbidden:**
- Wikipedia or online encyclopedias
- Blog posts or personal websites
- Anonymous authors
- Social media posts
- YouTube videos (unless published transcript with ISBN)

✅ **Still Required:**
- Published books with ISBNs
- Ancient texts with named translators
- Academic papers with DOIs
- Verbatim quotes ≤25 words
- Specific page/section references

## Time Estimates

Per star system baseline:
- **Initial Comet research:** 5-10 minutes (automated)
- **Source acquisition:** 2-4 hours (library, purchases, downloads)
- **Manual verification:** 3-6 hours (reading, extracting quotes, updating JSON)
- **Total per baseline:** 5-10 hours of human work

For 9 star systems: **45-90 hours of manual verification work**

This is expected and normal for academic-grade research. The baseline prompts save you 80% of the work by identifying the right sources and providing initial structure.

## Complete Example: Provisional → Locked Workflow

### Step 1: Comet Returns Provisional Citation
```json
{
  "title": "The Ancient Egyptian Pyramid Texts",
  "author": "R. O. Faulkner",
  "translator_or_editor": "R. O. Faulkner (translator)",
  "edition": "Oxford University Press",
  "year": 1969,
  "location_hint": "Utterance 632",
  "summary": "Isis identified as Sothis/Sopdet, associated with Nile flood and renewal",
  "url": "https://archive.org/details/ancientegyptianp0000unse",
  "isbn": "ISBN 0-19-815437-2",
  "source_type": "ancient",
  "astronomical_component": "A",
  "component_reasoning": "Ancient Egyptian visible star Sopdet/Sothis (pre-1862)",
  "citation_status": "provisional"
}
```

### Step 2: You Obtain the Source
- Go to Archive.org link
- Navigate to Utterance 632
- Find the exact passage about Isis/Sothis
- Note the specific section numbers (§1786-1787)

### Step 3: You Extract Verbatim Quote
- Copy exact text: "Your sister Isis comes to you rejoicing for love of you she being ready as Sothis"
- Verify it's ≤25 words (this is 17 words)
- Confirm it supports the characteristic

### Step 4: You Update the JSON
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
  "citation_status": "locked",
  "verified": true
}
```

**What changed:**
- ❌ Removed `location_hint` field
- ❌ Removed `summary` field
- ✅ Added `page` field with exact utterance and section numbers
- ✅ Added `quote` field with verbatim text
- ✅ Changed `citation_status` from "provisional" to "locked"
- ✅ Added `verified: true` field

## JSON Field Reference

### Fields That Stay the Same (Both Provisional and Locked)
- `title` - Full book/article title
- `author` - Full author name(s)
- `translator_or_editor` - For ancient texts
- `edition` - Specific edition information
- `year` - Publication year
- `original_year` - Original publication if different
- `url` - Link to source if available
- `isbn` or `doi` - Identifier for verification
- `source_type` - ancient|research|channeled|indigenous|controversial
- `astronomical_component` - A|B|C|unspecified (for Sirius)
- `component_reasoning` - Explanation of component assignment

### Fields for Provisional Citations (Comet Provides)
- `location_hint` - Chapter, section, session, utterance reference
- `summary` - ≤25 word paraphrase of what source says
- `citation_status: "provisional"` - Marks as needing verification

### Fields for Locked Citations (You Add)
- `page` - Exact page number, utterance, session, verse
- `quote` - Verbatim text ≤25 words from source
- `citation_status: "locked"` - Marks as verified
- `verified: true` - Confirms you verified the citation

### Conversion Checklist

When converting provisional → locked:

✅ **Remove these fields:**
- `location_hint`
- `summary`

✅ **Add these fields:**
- `page` (exact location)
- `quote` (verbatim text)
- `verified: true`

✅ **Change this field:**
- `citation_status: "provisional"` → `citation_status: "locked"`

## Tracking Your Progress

### Create a Verification Log

For each star system, track your progress:

```markdown
# Sirius Baseline Verification Log

**Total Sources:** 42
**Locked (Comet):** 18 (43%)
**Provisional (Need Work):** 24 (57%)

## Provisional Sources by Priority

### High Priority (Ancient Texts)
- [ ] Faulkner Pyramid Texts - Utterance 366 (Archive.org)
- [ ] Mercer Pyramid Texts - Utterance 632 (Archive.org)
- [ ] Faulkner Coffin Texts - Spell 467 (Need to obtain)

### Medium Priority (Counter-Evidence)
- [ ] van Beek "Dogon Restudied" (JSTOR access needed)
- [ ] Sagan "Broca's Brain" (Library)

### Lower Priority (Channeled Material)
- [ ] Temple "Sirius Mystery" Ch. 3 (Purchase needed)
- [ ] Cori "Cosmos of Soul" Intro (Purchase needed)

## Completed
- [x] Law of One Session 38 (lawofone.info - was already locked)
- [x] Darmesteter Tir Yasht (sacred-texts.com - was already locked)
```

### Batch Processing Strategy

**Week 1: Ancient Texts**
- Focus on Archive.org and sacred-texts.com sources
- These are often already accessible
- Convert 5-10 provisional → locked per day

**Week 2: Academic Papers**
- JSTOR access for counter-evidence
- University library for rare papers
- Convert 3-5 provisional → locked per day

**Week 3: Modern Books**
- Purchase or borrow key books
- Focus on sources cited multiple times
- Convert 3-5 provisional → locked per day

**Week 4: Final Cleanup**
- Verify all locked citations are correct
- Ensure no provisional sources remain
- Add `verified: true` to all sources
- Final quality check

## Bottom Line

**Comet identifies the sources. You lock them down.**

This division of labor is efficient:
- Comet does the broad research and source discovery (fast, 5-10 min per star system)
- You do the deep verification and quote extraction (slow but necessary, 5-10 hours per star system)
- Result: Academic-grade citations with proper provenance

**V3 Advantage:** Clear separation between provisional (research scaffold) and locked (camera-ready) citations. You always know what still needs work.

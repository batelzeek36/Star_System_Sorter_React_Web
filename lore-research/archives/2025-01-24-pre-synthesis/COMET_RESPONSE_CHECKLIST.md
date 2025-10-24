# Comet Response Quality Checklist

Use this checklist to quickly evaluate if a Comet response meets quality standards.

## Quick Rejection Criteria

**REJECT immediately if you see:**
- ❌ `"page_or_section": "unknown"`
- ❌ `"quote": "unknown"`
- ❌ `"edition": "unknown"`
- ❌ URLs dumped outside the JSON structure
- ❌ Vague references like "various pages", "throughout", "somewhere in the book"
- ❌ Missing sources (Pass C needs 2-3 sources per alignment)

## Pass A Checklist (HD/Gene Keys/I Ching)

**Primary Citation (Ra Uru Hu):**
- [ ] Has specific gate section and page numbers (e.g., "Gate 1, pp. 23-25")
- [ ] Has actual quote ≤25 words
- [ ] Has edition information (e.g., "2nd Edition")
- [ ] Has working URL (if available)

**Secondary Citation (Gene Keys):**
- [ ] Has specific gene key section and page numbers (e.g., "Gene Key 1, pp. 112-118")
- [ ] Has actual quote ≤25 words
- [ ] Has edition information (e.g., "1st Edition")
- [ ] Has working URL (if available)

**I Ching Parallel:**
- [ ] Has hexagram number and name
- [ ] Has translation information (e.g., "Wilhelm/Baynes")
- [ ] Explains relevance to gate

**Overall:**
- [ ] All fields have real data (not "unknown")
- [ ] No URLs dumped outside JSON
- [ ] JSON is properly formatted

**Result:** ✅ ACCEPT / ❌ REJECT

---

## Pass B Checklist (Ancient Wisdom)

**For Each Connection (1-6 total):**
- [ ] Has specific verse/tablet/chapter numbers (e.g., "Hexagram 1, Line 1", "Verse 10.129")
- [ ] Has actual quote ≤25 words
- [ ] Has translation/edition info (e.g., "Wilhelm/Baynes translation, 3rd Edition")
- [ ] Has working URL (if available)
- [ ] Connection is clearly explained (≤2 sentences)

**Overall:**
- [ ] 1-6 solid connections (quality over quantity)
- [ ] No forced connections without textual support
- [ ] All fields have real data (not "unknown")
- [ ] No URLs dumped outside JSON
- [ ] JSON is properly formatted

**Result:** ✅ ACCEPT / ❌ REJECT

---

## Pass C Checklist (Star System Alignments)

**For Each Alignment (3-5 total):**
- [ ] Has 2-3 sources with FULL metadata
- [ ] Each source has specific page numbers (e.g., "Chapter 5, pp. 78-80")
- [ ] Each source has actual quote ≤25 words
- [ ] Each source has edition information
- [ ] Each source has working URL (if available)
- [ ] Has confidence level (high/medium/low/speculative)
- [ ] Has evidence type (explicit/thematic/cross_cultural/inferred)
- [ ] Has clear rationale (2-3 sentences)

**Overall:**
- [ ] 3-5 alignments total
- [ ] Each alignment has 2-3 sources minimum
- [ ] All sources have full metadata
- [ ] No URLs dumped outside JSON
- [ ] JSON is properly formatted

**Result:** ✅ ACCEPT / ❌ REJECT

---

## What to Do if REJECTED

### Option 1: Re-prompt Comet with More Specificity
```
Your previous response was rejected for weak citations.

REQUIRED:
- Exact page numbers (e.g., "pp. 23-25", not "unknown")
- Actual quotes ≤25 words (not "unknown")
- Edition information (e.g., "2nd Edition", not "unknown")
- Working URLs where available

Search specifically for:
- "The Rave I'Ching" by Ra Uru Hu, Gate 1 section
- "Gene Keys" by Richard Rudd, Gene Key 1 section
- Wilhelm/Baynes translation of I Ching Hexagram 1

Try again with FULL metadata.
```

### Option 2: Break Down the Request
Instead of asking for everything at once, ask for one citation at a time:
1. "Find Ra Uru Hu's 'The Rave I'Ching' Gate 1 section with page numbers and quote"
2. "Find Richard Rudd's 'Gene Keys' Gene Key 1 section with page numbers and quote"
3. "Find Wilhelm/Baynes I Ching Hexagram 1 with verse numbers and quote"

### Option 3: Provide Specific URLs
Give Comet the exact URL to search:
```
Go to https://jovianarchive.com/rave-iching and extract:
- Gate 1 page numbers
- A quote ≤25 words about Gate 1
- Edition information
```

### Option 4: Manual Research (Last Resort)
If Comet truly can't find it after multiple attempts, you may need to manually look up the citation. But this should be rare.

---

## Example: Evaluating a Real Response

**Comet Returns:**
```json
{
  "citations": {
    "primary": [{
      "title": "The Rave I'Ching",
      "author": "Ra Uru Hu",
      "edition": "unknown",  // ❌ FAIL
      "year": 1994,
      "page_or_section": "unknown",  // ❌ FAIL
      "url": "unknown",
      "quote": "unknown"  // ❌ FAIL
    }]
  }
}
```

**Evaluation:**
- ❌ Missing edition
- ❌ Missing page numbers
- ❌ Missing quote
- ❌ Missing URL

**Result:** REJECTED - Re-prompt Comet with more specific instructions

---

## Summary

**Accept only if:**
- ✅ All page numbers are specific
- ✅ All quotes are actual text (≤25 words)
- ✅ All editions are specified
- ✅ URLs are included where available
- ✅ No "unknown" in critical fields

**Reject if:**
- ❌ Any "unknown" in page_or_section, quote, or edition fields
- ❌ Vague references
- ❌ URLs dumped outside JSON
- ❌ Missing sources (Pass C needs 2-3 per alignment)

**Zero tolerance for weak citations.**

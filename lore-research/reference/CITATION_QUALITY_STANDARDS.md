# Citation Quality Standards for Comet Research

## Overview

These standards ensure that all lore research has verifiable provenance and can be traced back to authoritative sources. **No exceptions.**

## What Makes a STRONG Citation

### ✅ ACCEPTABLE Examples

**Primary Source (Human Design):**
```json
{
  "title": "The Rave I'Ching",
  "author": "Ra Uru Hu",
  "edition": "2nd Edition",
  "year": 1994,
  "page_or_section": "Gate 1, Lines 1-6, pp. 23-25",
  "url": "https://jovianarchive.com/rave-iching",
  "quote": "Gate 1 embodies the creative force seeking expression through individual direction."
}
```

**Secondary Source (Gene Keys):**
```json
{
  "title": "Gene Keys: Unlocking the Higher Purpose Hidden in Your DNA",
  "author": "Richard Rudd",
  "edition": "1st Edition",
  "year": 2009,
  "page_or_section": "Gene Key 1: The Art of Entropy, pp. 112-118",
  "url": "https://genekeys.com/gene-key-1/",
  "quote": "From Entropy through Freshness to Beauty, the first key unlocks creative potential."
}
```

**Ancient Wisdom (I Ching):**
```json
{
  "source_type": "chinese",
  "text": "I Ching (Book of Changes)",
  "author": "Richard Wilhelm (translator)",
  "edition": "Wilhelm/Baynes translation, 3rd Edition",
  "year": 1967,
  "connection": "Hexagram 1 (Qian/The Creative) represents pure yang creative force.",
  "quote": "The Creative works sublime success, furthering through perseverance.",
  "page_or_section": "Hexagram 1, The Judgment, p. 4",
  "url": "https://archive.org/details/iching_wilhelm"
}
```

**Star System Alignment:**
```json
{
  "title": "The Sirius Mystery",
  "author": "Robert Temple",
  "edition": "50th Anniversary Edition",
  "year": 2019,
  "source_type": "research",
  "quote": "Sirius represents the divine creative spark transmitted to humanity.",
  "page": "Chapter 3, pp. 67-69",
  "url": "https://www.siriusmystery.com",
  "disputed": false
}
```

## What Makes a WEAK Citation (REJECTED)

### ❌ UNACCEPTABLE Examples

**Missing Page Numbers:**
```json
{
  "title": "The Rave I'Ching",
  "author": "Ra Uru Hu",
  "edition": "unknown",  // ❌ REJECTED
  "year": 1994,
  "page_or_section": "unknown",  // ❌ REJECTED
  "url": "unknown",
  "quote": "unknown"  // ❌ REJECTED
}
```

**Vague References:**
```json
{
  "page_or_section": "somewhere in the book",  // ❌ REJECTED
  "page_or_section": "various pages",  // ❌ REJECTED
  "page_or_section": "throughout",  // ❌ REJECTED
}
```

**Missing Quotes:**
```json
{
  "quote": "unknown"  // ❌ REJECTED (unless source is truly inaccessible)
}
```

**URLs Dumped Outside JSON:**
```
// ❌ REJECTED - URLs must be parsed into citations array
https://source1.com
https://source2.com
https://source3.com
```

## Specific Requirements by Pass

### Pass A: HD/Gene Keys/I Ching Foundation

**MUST HAVE:**
- Ra Uru Hu citation with specific gate section and page numbers
- Gene Keys citation with specific gene key section and page numbers
- I Ching citation with hexagram number and translation details
- Actual quotes from each source (≤25 words)
- Edition information for all sources
- Working URLs where available

**CANNOT HAVE:**
- "unknown" in page_or_section fields (unless source is genuinely unavailable)
- "unknown" in quote fields (unless source is genuinely unavailable)
- "unknown" in edition fields (unless source is genuinely unavailable)
- URLs dumped outside the JSON structure

### Pass B: Ancient Wisdom Parallels

**MUST HAVE:**
- Specific verse numbers, tablet numbers, or chapter/page references
- Translation/edition information (e.g., "Wilhelm/Baynes", "Penguin Classics 1987")
- Actual quotes from ancient texts (≤25 words)
- Working URLs to translations or archives
- 1-6 solid connections (quality over quantity)

**CANNOT HAVE:**
- Forced connections without clear textual support
- Generic references like "various verses"
- Missing translation information
- Quotes without specific location in text

### Pass C: Star System Alignments

**MUST HAVE:**
- 2-3 sources per alignment with FULL metadata
- Specific page numbers or chapters for every source
- Actual quotes from each source (≤25 words)
- Edition/publication information
- Mix of ancient + modern esoteric sources when possible
- Confidence levels (high/medium/low/speculative)
- Evidence types (explicit/thematic/cross_cultural/inferred)

**CANNOT HAVE:**
- Single-source alignments (need 2-3 sources minimum)
- Sources without page numbers
- Sources without quotes
- URLs without accompanying metadata
- Vague rationales without textual support

## When "unknown" is Acceptable

**ONLY in these cases:**
1. Source is out of print and not digitally available
2. Source is in a private collection or restricted archive
3. Source is oral tradition without written record
4. You've exhausted all research avenues (rare)

**NOT acceptable:**
- You didn't look hard enough
- The source exists but you couldn't access it quickly
- You found the source but didn't extract the metadata
- You found URLs but didn't parse them into the JSON

## Quality Checklist

Before submitting ANY Comet response, verify:

- [ ] All citations have specific page numbers or sections
- [ ] All citations have actual quotes (not "unknown")
- [ ] All citations have edition/translation information
- [ ] All URLs are included where available
- [ ] No URLs are dumped outside the JSON structure
- [ ] All sources have full metadata (title, author, year, edition, page, quote, URL)
- [ ] Quotes are ≤25 words
- [ ] All arrays are present (can be empty [])

**If ANY checkbox is unchecked, the response is REJECTED.**

## How to Handle Comet Failures

If Comet returns weak citations:

1. **Try again with more specific guidance:**
   - "Search for 'The Rave I'Ching' by Ra Uru Hu, specifically Gate 1 section"
   - "Find the Wilhelm/Baynes translation of I Ching Hexagram 1"
   - "Look for Robert Temple's 'The Sirius Mystery' 50th Anniversary Edition"

2. **Break it down further:**
   - Ask for just the Ra Uru Hu citation first
   - Then ask for just the Gene Keys citation
   - Then ask for just the I Ching citation

3. **Provide specific URLs:**
   - Give Comet the exact URL to search
   - Ask it to extract metadata from that specific page

4. **Manual research as last resort:**
   - If Comet truly can't find it, you may need to manually look up the citation
   - But this should be rare - most sources are digitally available

## Examples of Good vs Bad Responses

### GOOD Response (Pass A):
```json
{
  "gate": 1,
  "gate_name": "The Creative / Self-Expression",
  "hd_meaning": "Gate 1 embodies creative self-expression and individual direction.",
  "gene_keys": {
    "shadow": "Entropy",
    "gift": "Freshness",
    "siddhi": "Beauty"
  },
  "i_ching_parallel": {
    "hexagram": 1,
    "name": "Qian (The Creative)",
    "meaning": "Pure yang creative force, heaven, strong creative action.",
    "relevance": "Maps directly to Gate 1 as both embody initiating creative principle."
  },
  "citations": {
    "primary": [{
      "title": "The Rave I'Ching",
      "author": "Ra Uru Hu",
      "edition": "2nd Edition",
      "year": 1994,
      "page_or_section": "Gate 1, Lines 1-6, pp. 23-25",
      "url": "https://jovianarchive.com/rave-iching",
      "quote": "Gate 1 is the creative force seeking expression through individual direction."
    }],
    "secondary": [{
      "title": "Gene Keys",
      "author": "Richard Rudd",
      "edition": "1st Edition",
      "year": 2009,
      "page_or_section": "Gene Key 1: The Art of Entropy, pp. 112-118",
      "url": "https://genekeys.com/gene-key-1/",
      "quote": "From Entropy through Freshness to Beauty, unlocking creative potential."
    }]
  },
  "notes": "Gate 1 in G-Center, connects to Gate 8 via Channel of Inspiration."
}
```

### BAD Response (Pass A) - REJECTED:
```json
{
  "gate": 1,
  "gate_name": "The Creative / Self-Expression",
  "hd_meaning": "Gate 1 embodies creative self-expression.",
  "gene_keys": {
    "shadow": "Entropy",
    "gift": "Freshness",
    "siddhi": "Beauty"
  },
  "i_ching_parallel": {
    "hexagram": 1,
    "name": "Qian (The Creative)",
    "meaning": "Pure yang creative force.",
    "relevance": "Maps to Gate 1."
  },
  "citations": {
    "primary": [{
      "title": "The Rave I'Ching",
      "author": "Ra Uru Hu",
      "edition": "unknown",  // ❌ REJECTED
      "year": 1994,
      "page_or_section": "unknown",  // ❌ REJECTED
      "url": "unknown",
      "quote": "unknown"  // ❌ REJECTED
    }],
    "secondary": [{
      "title": "Gene Keys",
      "author": "Richard Rudd",
      "edition": "unknown",  // ❌ REJECTED
      "year": 2009,
      "page_or_section": "unknown",  // ❌ REJECTED
      "url": "unknown",
      "quote": "unknown"  // ❌ REJECTED
    }]
  },
  "notes": "unknown"
}
```

## Summary

**Zero tolerance for weak citations.** Every source must have:
1. Specific page/section/verse numbers
2. Actual quotes (≤25 words)
3. Edition/translation information
4. Working URLs where available

If Comet can't provide this level of detail, the response is rejected and must be re-researched.

This is non-negotiable for building a trustworthy lore database with full provenance.

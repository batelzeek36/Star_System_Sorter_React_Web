# V3 Fixes Applied to All Remaining Baseline Prompts

## Date: 2025-01-24

## Prompts Updated

✅ **ANDROMEDA_BASELINE.txt**
✅ **ARCTURUS_BASELINE.txt**
✅ **DRACO_BASELINE.txt**
✅ **LYRA_BASELINE.txt**
✅ **ORION_DARK_BASELINE.txt**

## Changes Applied

### 1. Strengthened Encyclopedia Ban

**Before:**
```
Wikipedia, online encyclopedias, and similar aggregator sites are 
**NOT ACCEPTABLE** as primary sources.
```

**After:**
```
Wikipedia, Encyclopedia.com, Britannica.com, and ALL online 
encyclopedia/aggregator sites are **COMPLETELY FORBIDDEN** - 
not as primary sources, not as secondary sources, not at all.
```

### 2. Added Explicit Forbidden Domain Lists

**Added to each prompt:**
```
FORBIDDEN ENCYCLOPEDIA SITES (NEVER USE):
❌ Wikipedia.org
❌ Encyclopedia.com
❌ Britannica.com / Encyclopaedia Britannica
❌ Ancient.eu / WorldHistory.org
❌ Mythopedia.com
❌ Any site with "encyclopedia", "wiki", or "pedia" in the domain

FORBIDDEN BLOG/PERSONAL SITES (NEVER USE):
❌ WordPress blogs (*.wordpress.com)
❌ Tripod sites (*.tripod.com)
❌ Personal domains (crystalinks, preterhuman.net, etc.)
❌ Goodreads.com (book review site, not primary source)
```

### 3. Added Acceptable Sources List

**Added to each prompt:**
```
ACCEPTABLE SOURCES - USE THESE:
✅ Archive.org - Full book scans with page numbers
✅ Sacred-texts.com - Proper ancient text translations
✅ Publisher websites - Book excerpts with ISBNs
✅ Academic databases - JSTOR, academia.edu, university repositories
✅ Google Books - Preview pages with actual page numbers
```

### 4. Added "WHERE TO FIND VERIFIED SOURCES" Section

**Added before OUTPUT FORMAT section in each prompt:**
```
═══════════════════════════════════════════════════════════════════════════════
WHERE TO FIND VERIFIED SOURCES (USE THESE LOCATIONS)
═══════════════════════════════════════════════════════════════════════════════

Archive.org - Search for these books:
[Star system specific guidance]

Sacred-texts.com - Use for:
[Star system specific guidance]

Other Acceptable Sources:
- Publisher websites (Penguin, Oxford, Cambridge)
- University .edu domains for academic papers
- Lawofone.info for Law of One material

ABSOLUTELY FORBIDDEN - CHECK EVERY URL:
❌ britannica.com, encyclopedia.com, wikipedia.org
❌ wordpress.com, blogspot.com, medium.com, tripod.com
❌ goodreads.com, theosophy trust articles, crystalinks
❌ Any domain with "encyclopedia", "wiki", or "pedia"

SOURCE QUALITY IS NON-NEGOTIABLE. Use archive.org and sacred-texts.com first.
```

## What Was NOT Added

❌ **"INFERENCE AND SYNTHESIS ARE REQUIRED"** section - This backfired in Orion Light V2
❌ **"STOP OVERTHINKING"** section - This caused the AI to lower standards
❌ **"CONCRETE EXAMPLE"** section - Added noise without benefit

## Rationale

Based on Orion Light testing:
- **V1:** Ambiguous wording → 1 violation (Encyclopedia.com)
- **V2:** Added encouraging language → 7+ violations (Britannica, WordPress, Tripod, etc.)
- **V3:** Strict, direct tone with specific locations → 8/10 success

**Key insight:** Encouraging language backfires. The AI needs:
1. Clear, absolute prohibitions ("COMPLETELY FORBIDDEN")
2. Specific locations to find sources (archive.org, sacred-texts.com)
3. Strict, direct tone (not encouraging or flexible)

## Expected Results

With these fixes, all remaining prompts should:
- ✅ Avoid encyclopedias (Wikipedia, Britannica, Encyclopedia.com)
- ✅ Avoid blogs (WordPress, Tripod, personal sites)
- ✅ Use archive.org for book scans
- ✅ Use sacred-texts.com for ancient texts
- ✅ Maintain source quality standards

## Next Steps

1. Run research for remaining star systems using updated prompts
2. Monitor for any encyclopedia/blog violations
3. If violations occur, escalate to full V3 treatment (add "EVIDENCE TYPE vs SOURCE QUALITY" section)

## Comparison to Working Prompts

| Feature | Sirius (Worked) | Pleiades (Worked) | Orion Light V3 (Worked) | Updated Prompts |
|---------|-----------------|-------------------|-------------------------|-----------------|
| Encyclopedia ban | ✅ (ambiguous) | ✅ (ambiguous) | ✅ (explicit) | ✅ (explicit) |
| Forbidden domain list | ❌ | ❌ | ✅ | ✅ |
| Archive.org mentioned | ✅ | ✅ | ✅ | ✅ |
| Sacred-texts.com mentioned | ✅ | ✅ | ✅ | ✅ |
| "WHERE TO FIND" section | ❌ | ✅ (brief) | ✅ (detailed) | ✅ (detailed) |
| Encouraging language | ❌ | ❌ | ❌ | ❌ |

All updated prompts now match or exceed the features of the working prompts.

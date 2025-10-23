# Prompts Updated with Strict Citation Requirements

## Date: October 22, 2025

All Comet prompts have been updated with **zero-tolerance citation quality standards**.

## Files Updated

### ✅ Pass A (HD/Gene Keys/I Ching Foundation)
**File:** `prompts/COMET_PASS_A_GATE_1.txt`

**New Requirements:**
- Exact page numbers or sections (e.g., "Gate 1, pp. 23-25")
- Actual quotes ≤25 words from sources
- Edition information (e.g., "2nd Edition")
- Working URLs where available
- Quality checklist at end of prompt

### ✅ Pass B (Ancient Wisdom Parallels)
**File:** `prompts/COMET_PASS_B_GATE_1.txt`

**New Requirements:**
- Specific verse/tablet/chapter numbers (e.g., "Hexagram 1, Line 1")
- Actual quotes ≤25 words from ancient texts
- Translation/edition info (e.g., "Wilhelm/Baynes translation, 3rd Edition")
- Working URLs where available
- Quality checklist at end of prompt

### ✅ Pass C (Star System Alignments)
**File:** `prompts/COMET_PASS_C_GATE_1.txt`

**New Requirements:**
- 2-3 sources per alignment with FULL metadata
- Specific page numbers or chapters for every source
- Actual quotes ≤25 words from each source
- Edition/publication information
- Working URLs where available
- Quality checklist at end of prompt

### ✅ Single-Shot (Fast Mode)
**File:** `prompts/COMET_SINGLE_SHOT_GATE_1.txt`

**New Requirements:**
- All Pass A, B, C requirements combined
- FULL citations for HD/Gene Keys/I Ching
- FULL citations for ancient wisdom connections
- 2-3 sources per star system alignment with FULL metadata
- Quality checklist at end of prompt

### ✅ Comprehensive Prompt (Original)
**File:** `prompts/GATE_1_COMET_PROMPT.txt`

**New Requirements:**
- Critical citation requirements section added at top
- Updated all source templates with "MUST BE SPECIFIC" guidance
- Added edition field to all source objects
- Updated critical rules to mandate full metadata
- Added quality checklist before final instruction

## What Changed

### Before (WEAK - REJECTED):
```json
{
  "title": "The Rave I'Ching",
  "author": "Ra Uru Hu",
  "edition": "unknown",  // ❌
  "year": 1994,
  "page_or_section": "unknown",  // ❌
  "url": "unknown",
  "quote": "unknown"  // ❌
}
```

### After (STRONG - ACCEPTED):
```json
{
  "title": "The Rave I'Ching",
  "author": "Ra Uru Hu",
  "edition": "2nd Edition",  // ✅
  "year": 1994,
  "page_or_section": "Gate 1, Lines 1-6, pp. 23-25",  // ✅
  "url": "https://jovianarchive.com/rave-iching",  // ✅
  "quote": "Gate 1 embodies creative self-expression through individual direction."  // ✅
}
```

## Key Mandates

1. **No "unknown" in critical fields** - Only acceptable if source is genuinely inaccessible
2. **Specific page numbers** - Not "various pages" or "throughout"
3. **Actual quotes** - Must be extracted from source material (≤25 words)
4. **Edition information** - Must specify which edition/translation
5. **URLs included** - When available, must be in JSON structure
6. **No URL dumps** - All URLs must be parsed into citations/sources arrays with full metadata
7. **Quality checklist** - Each prompt ends with verification checklist

## Supporting Documentation

### New Files Created:
- `CITATION_QUALITY_STANDARDS.md` - Comprehensive quality standards with examples
- `COMET_RESPONSE_CHECKLIST.md` - Quick evaluation checklist for responses
- `PROMPTS_UPDATED.md` - This file

### Updated Files:
- `README.md` - Added citation quality standards section
- `documentation/COMET_WORKFLOW_GUIDE.md` - Added quality standards and rejection handling

## How to Use

1. **Copy prompt** from updated file
2. **Paste into Comet** (Perplexity Pro)
3. **Evaluate response** using `COMET_RESPONSE_CHECKLIST.md`
4. **Reject if weak** - Re-prompt with more specificity
5. **Accept only if** all quality checks pass

## What to Do if Comet Returns Weak Citations

### Option 1: Re-prompt with More Specificity
```
Your previous response was rejected for weak citations.

REQUIRED:
- Exact page numbers (e.g., "pp. 23-25", not "unknown")
- Actual quotes ≤25 words (not "unknown")
- Edition information (e.g., "2nd Edition", not "unknown")
- Working URLs where available

Try again with FULL metadata.
```

### Option 2: Break Down the Request
Ask for one citation at a time instead of all at once.

### Option 3: Provide Specific URLs
Give Comet the exact URL to search and extract from.

## Zero Tolerance Policy

**We do not accept:**
- ❌ "unknown" in page_or_section fields
- ❌ "unknown" in quote fields
- ❌ "unknown" in edition fields
- ❌ Vague references like "various pages"
- ❌ URLs dumped outside JSON structure
- ❌ Sources without full metadata

**We only accept:**
- ✅ Specific page numbers or sections
- ✅ Actual quotes from sources
- ✅ Edition/translation information
- ✅ URLs in proper JSON structure
- ✅ Full metadata for every source

## Summary

All prompts now mandate **production-quality citations with full provenance**. This ensures the lore database is trustworthy, verifiable, and meets academic standards for source attribution.

**No exceptions. No weak citations. No "unknown" in critical fields.**

---

**Status:** All prompts updated and ready for use  
**Next Action:** Test with Gate 1 using updated prompts  
**Expected Result:** High-quality citations with full metadata

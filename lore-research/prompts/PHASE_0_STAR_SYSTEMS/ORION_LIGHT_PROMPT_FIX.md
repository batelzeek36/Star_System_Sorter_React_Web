# Orion Light Prompt Fix - Encyclopedia.com Issue

## Problem Identified

The Orion Light baseline research output included an **Encyclopedia.com** source, which violates the "no wiki-style aggregator sites" rule.

**Violation:**
```json
{
  "title": "Egyptian Mystery Schools",
  "author": "Encyclopedia.com",
  "source_type": "research",
  "url": "https://www.encyclopedia.com/science/encyclopedias-almanacs-transcripts-and-maps/egyptian-mystery-schools"
}
```

## Root Cause

The original prompt said:
> "Wiki-style sites **without citations**" - UNACCEPTABLE

The AI interpreted this as: "Encyclopedia.com has citations at the bottom of articles, so it's acceptable."

## Solution Applied

### 1. Made Encyclopedia Ban Explicit and Absolute

**Before:**
```
⚠️ WIKIPEDIA & ONLINE ENCYCLOPEDIAS:
Wikipedia, online encyclopedias, and similar aggregator sites are NOT ACCEPTABLE as primary sources.
```

**After:**
```
⚠️ WIKIPEDIA & ONLINE ENCYCLOPEDIAS:
Wikipedia, Encyclopedia.com, Britannica.com, and ALL online encyclopedia/aggregator sites are 
COMPLETELY FORBIDDEN - not as primary sources, not as secondary sources, not at all.

FORBIDDEN ENCYCLOPEDIA SITES (NEVER USE):
❌ Wikipedia.org
❌ Encyclopedia.com
❌ Britannica.com
❌ Ancient.eu / WorldHistory.org
❌ Mythopedia.com
❌ Any site with "encyclopedia", "wiki", or "pedia" in the domain
```

### 2. Updated TIER 3 Forbidden Sources

**Before:**
```
❌ Wiki-style sites without citations
```

**After:**
```
❌ ALL wiki-style sites (with or without citations)
❌ ALL online encyclopedias (Wikipedia, Encyclopedia.com, Britannica.com, etc.)
❌ Any aggregator site that compiles information from other sources
```

### 3. Added to Validation Checklist

Added explicit encyclopedia check to final validation:
```
❌ ANY online encyclopedias (Wikipedia, Encyclopedia.com, Britannica.com, Ancient.eu, etc.)
❌ ANY wiki-style or aggregator sites
```

### 4. Provided Better Mystery School Sources

Added specific examples of what to use INSTEAD of Encyclopedia.com:
```
9. Plutarch - "Isis and Osiris" (De Iside et Osiride)
10. Iamblichus - "On the Mysteries" (De Mysteriis)
11. Apuleius - "The Golden Ass" (Metamorphoses)
```

## Why This Matters

**Encyclopedia sites are aggregators** - they compile information from other sources. For lore-grade research, we need:
- **Primary sources**: Ancient texts, published books, academic papers
- **Not secondary aggregators**: Sites that summarize other people's research

**The fix ensures:**
1. No ambiguity - "with or without citations" makes it clear
2. Explicit domain names - AI can't misinterpret
3. Better alternatives provided - Shows what to use instead
4. Multiple enforcement points - Mentioned in 4 different sections

## Testing Recommendation

Re-run the Orion Light baseline research with the updated prompt to verify:
1. No Encyclopedia.com sources
2. Mystery school trait has 3+ legitimate sources (Plutarch, Iamblichus, Apuleius, or Manly P. Hall)
3. All other quality standards maintained

## Lessons for Other Prompts

This same fix should be applied to:
- Orion Dark baseline
- Draco baseline
- Any future star system prompts

The key insight: **Be explicit about domain names and remove all ambiguity about "with/without citations"**

# CRITICAL ISSUE: Star System Classification Accuracy

**Status:** BLOCKING
**Date Identified:** 2026-01-17
**Affects:** Core app functionality

---

## The Problem

The star system classification algorithm produces **unpredictable/inaccurate results**. Users who know their star system affiliation (through personal research) are being classified incorrectly.

**Example:** User confirmed as Osirian/Arcturian is being classified as Orion.

---

## Root Cause

There is **no authoritative source** that definitively maps Human Design gates/lines to star systems. The current approach of using AI to interpret I Ching meanings and match them to star system characteristics produces inconsistent results.

- 64 gates × 6 lines = 384 combinations to map
- Multiple star systems with overlapping themes
- Different metaphysical sources contradict each other
- LLM interpretations vary between sessions

**Prompt engineering cannot solve this.** The mappings are inherently subjective.

---

## Attempted Solutions (Failed)

1. **AI-assisted mapping sessions** - Had Claude analyze I Ching meanings and propose star system mappings. Results were unpredictable across sessions.

2. **Chunked workflow** - Breaking into star-system-by-star-system sessions. Still produced inconsistent mappings.

---

## Potential Solution: Empirical Data-Driven Approach

Instead of reasoning mappings into existence, **derive them from ground truth data**:

1. Collect HD charts from people who **definitively know** their star system affiliation
2. Analyze which gates/channels/centers correlate with each star system
3. Let patterns emerge from real data (supervised learning)
4. Build confidence weights based on frequency of correlation

**Requirement:** A dataset of verified charts (people who know their star system + their HD data)

---

## Impact

Until this is resolved:
- Classification results cannot be trusted
- The "Why" explanations are based on potentially incorrect mappings
- Comparison insights may reference wrong star system affiliations

---

## Files Affected

- `star-system-sorter/src/lib/scorer.ts` - Scoring algorithm
- `star-system-sorter/src/lib/lore.bundle.ts` - Gate/star system mapping rules
- `star-system-sorter/src/lib/classifier.ts` - Classification logic

---

## Next Steps

1. Build or source a dataset of verified star system + HD chart pairs
2. Analyze for empirical correlations
3. Replace interpretive mappings with data-derived weights

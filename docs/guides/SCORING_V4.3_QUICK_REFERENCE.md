# Scoring System v4.3 - Quick Reference

**Date:** November 2024  
**Status:** ✅ Complete & Ready for Testing

---

## What Changed

### 🐛 Critical Bug Fix
**Before:** Scoring all 6 lines for every gate (6x inflated)  
**After:** Scoring only actual placements from the chart  
**Impact:** Massive - this was the #1 issue washing out chart signatures

### 🎯 Core vs Shadow Separation
**Before:** Shadow expressions mixed with allies  
**After:** Two independent channels with separate normalization  
**Impact:** Orion-Dark no longer shows as an "ally"

### ⚖️ Planet Weighting
**New:** Sun/Earth 2.0x, Moon/Nodes 1.5x, Outer 1.3x, Inner 1.0x  
**Impact:** Emphasizes core identity over personality traits

---

## Documentation Locations

| Document | Purpose |
|----------|---------|
| `SCORING_UPGRADE_COMPLETE.md` | Full technical documentation |
| `SCORING_V4.3_QUICK_REFERENCE.md` | This file - quick lookup |
| Code comments in `scorer.ts` | Inline documentation with version tags |
| Code comments in `hd.ts` | API extraction documentation |
| `scorer-placement.test.ts` | Unit tests demonstrating new behavior |

---

## Key Files Modified

### Server
- `server/src/routes/hd.ts`
  - Added `extractPlacements()` function
  - Extracts planet data from Personality and Design objects
  - Returns array of `Placement` objects

### Client
- `star-system-sorter/src/lib/scorer.ts`
  - Added `PLANET_WEIGHTS` constant
  - Refactored `computeScoresWithGateLines()` to use placements
  - Separated core/shadow scoring channels
  - Added dual normalization

- `star-system-sorter/src/lib/schemas.ts`
  - Added `PlacementSchema` and `Placement` type
  - Updated `HDExtractSchema` to include placements array
  - Updated `ClassificationResultSchema` for shadowWork

- `star-system-sorter/src/screens/ResultScreen.tsx`
  - Added "Shadow Work Areas" section
  - Separated display of allies vs shadow

- `star-system-sorter/src/components/figma/Chip.tsx`
  - Added `warning` variant (amber color for shadow work)

---

## Data Structures

### Placement
```typescript
interface Placement {
  planet: string;      // "Sun", "Earth", "Moon", etc.
  gate: number;        // 1-64
  line: number;        // 1-6
  type: 'personality' | 'design';
}
```

### HDExtract (Updated)
```typescript
interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
  placements: Placement[];  // NEW in v4.3
}
```

### ClassificationResult (Updated)
```typescript
interface ClassificationResult {
  // ... existing fields
  allies: Array<{ system: string; percentage: number }>;
  shadowWork: Array<{ system: string; percentage: number }>;  // NEW
  corePercentages: Record<string, number>;  // NEW
  shadowPercentages: Record<string, number>;  // NEW
}
```

---

## Planet Weights Reference

| Planet | Weight | Rationale |
|--------|--------|-----------|
| Sun | 2.0 | Conscious design (core identity) |
| Earth | 2.0 | Unconscious design (grounding) |
| Moon | 1.5 | Emotional/life path |
| North Node | 1.5 | Life direction |
| South Node | 1.5 | Past patterns |
| Pluto | 1.3 | Transpersonal transformation |
| Mars | 1.3 | Drive/action |
| Saturn | 1.3 | Structure/discipline |
| Jupiter | 1.3 | Expansion/growth |
| Mercury | 1.0 | Communication (personality) |
| Venus | 1.0 | Values (personality) |
| Uranus | 1.0 | Generational |
| Neptune | 1.0 | Generational |

---

## Scoring Algorithm (Simplified)

```typescript
for each placement in chart:
  gateLineKey = `${gate}.${line}`  // e.g., "21.4"
  mappings = gateLineMap[gateLineKey]
  planetWeight = PLANET_WEIGHTS[planet] || 1.0
  
  for each mapping:
    weightedScore = mapping.weight * planetWeight
    
    if mapping.alignment_type === 'core':
      coreScore += weightedScore
    else if mapping.alignment_type === 'shadow':
      shadowScore += weightedScore

// Normalize core and shadow separately to 100%
corePercentages = normalize(coreScores)
shadowPercentages = normalize(shadowScores)
```

---

## UI Changes

### Result Screen

**Before:**
```
Ally Star Systems
- Arcturus 32%
- Orion Dark 18%  ← WRONG (shadow showing as ally)
- Pleiades 15%
```

**After:**
```
Ally Star Systems (Core)
- Arcturus 32%
- Orion Light 24%
- Pleiades 15%

Shadow Work Areas
- Orion Dark 8%  ← Correctly labeled as growth edge
- Draco 5%
```

---

## Testing Checklist

When BodyGraph API is active:

- [ ] Generate a chart with your birth data
- [ ] Open browser console and verify placements are extracted
- [ ] Confirm "Allies" section shows only core alignments
- [ ] Confirm "Shadow Work" section shows shadow alignments
- [ ] Verify Sun/Earth placements have more visual impact
- [ ] Check that percentages sum to 100% in each section
- [ ] Verify Orion-Dark appears in Shadow Work, not Allies

---

## Rollback Plan

If issues arise, the old scoring logic is preserved in git history:
```bash
git log --oneline -- star-system-sorter/src/lib/scorer.ts
```

To rollback:
```bash
git revert <commit-hash>
```

---

## Future Enhancements (Optional)

### Phase 2 (If Needed)
1. **Line 3 Shadow Dampener**
   - Apply 0.75x multiplier to Line 3 shadow weights
   - Make it a config option
   - Only if shadow scores feel inflated

2. **Personality vs Design Weighting**
   - Weight personality placements differently from design
   - Personality = conscious, Design = unconscious

3. **Channel Activation Bonus**
   - Extra weight when both gates of a channel are activated
   - Channels are more powerful than individual gates

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v4.2 | Oct 2024 | Gate-line scoring with all 6 lines (buggy) |
| v4.3 | Nov 2024 | Placement-based scoring + core/shadow separation |

---

## Support

For questions or issues:
1. Check `SCORING_UPGRADE_COMPLETE.md` for detailed explanation
2. Review inline code comments (search for "v4.3")
3. Run unit tests: `npm test scorer-placement.test.ts`
4. Check git history for implementation details

---

**Last Updated:** November 2024  
**Maintained By:** Development Team  
**Status:** Production Ready (pending BodyGraph API subscription)

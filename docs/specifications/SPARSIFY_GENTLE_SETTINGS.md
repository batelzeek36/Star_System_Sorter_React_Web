# Sparsify Algorithm - Gentle Settings Applied

## Problem Solved

The original aggressive sparsify settings (gamma=1.8, rel_floor=0.55, top_k=2) were eliminating legitimate secondary systems like Orion Light, causing results to collapse to a single dominant system (Arcturus 88%).

## New Gentle Settings

```typescript
{
  gamma: 1.35,  // Was 1.8 - gentler sharpening
  per_polarity: {
    core: {
      top_k: 3,        // Was 2 - allow credible third system
      top_p: 0.80,     // Was 0.60 - capture more mass
      min_abs: 0.10,   // Was 0.18 - lower floor
      rel_floor: 0.35, // Was 0.55 - much friendlier threshold
    },
    shadow: {
      top_k: 2,        // Was 1 - allow secondary shadow
      top_p: 0.75,     // Was 0.55 - capture more mass
      min_abs: 0.10,   // Was 0.18 - lower floor
      rel_floor: 0.35, // Was 0.60 - friendlier threshold
    },
  },
  consistency_rescue: {
    core_min_placements: 3,
    min_weight_before_sparsify: 0.18,
  },
}
```

## Why These Settings Work

### 1. Lower Gamma (1.35 vs 1.8)
- Less aggressive sharpening preserves the gap between #1 and #2
- Prevents legitimate secondary systems from being amplified away

### 2. Lower rel_floor (0.35 vs 0.55)
- **Math**: With gamma=1.35, #2 survives if it's ~46% of #1
- **Before**: With gamma=1.8, #2 needed to be ~72% of #1
- This is the key change that brings back Orion Light

### 3. Higher top_k (3 vs 2 for core)
- Allows a credible third system through when it carries real weight
- Prevents artificial collapse to 1-2 systems

### 4. Higher top_p (0.80 vs 0.60)
- Captures 80% of the total mass before stopping
- Ensures legitimate contributors aren't cut off prematurely

### 5. Consistency Rescue (NEW)
- **Problem**: A system might not be #1 on any single placement, but if it's consistently #2 or #3 across many placements, that pattern is meaningful
- **Solution**: Track which systems appear with weight ≥0.18 in 3+ placements
- **Action**: Force-keep those systems even if local per-placement filters would drop them
- **Result**: Orion Light (consistently #2) won't vanish even if it never wins a single placement

## Implementation Details

### Two-Pass Algorithm

**Pass 1: Consistency Tracking**
```typescript
for each placement:
  for each system with weight ≥ 0.18:
    increment count[system][polarity]

identify systems with core count ≥ 3 as "consistent"
```

**Pass 2: Scoring with Rescue**
```typescript
for each placement:
  sparsify normally
  
  if system is "consistent" AND was dropped:
    re-add it with original weight
  
  apply planet weighting and accumulate scores
```

### Example Scenario

**Before (aggressive settings):**
- Placement 1: Arcturus 0.4, Orion Light 0.2 → Orion Light dropped (< 55% of max)
- Placement 2: Arcturus 0.35, Orion Light 0.25 → Orion Light dropped
- Placement 3: Arcturus 0.3, Orion Light 0.22 → Orion Light dropped
- **Result**: Orion Light = 0%

**After (gentle settings + rescue):**
- Placement 1: Arcturus 0.4, Orion Light 0.2 → Both kept (0.2 is 50% of 0.4, > 46% threshold)
- Placement 2: Arcturus 0.35, Orion Light 0.25 → Both kept
- Placement 3: Arcturus 0.3, Orion Light 0.22 → Both kept
- **Consistency rescue**: Orion Light appears in 3+ placements → protected
- **Result**: Orion Light = 15-25% (legitimate blend)

## Expected Results

### Before
```
Arcturus: 88.1%
Sirius: 11.9%
Orion Light: 0%
```
❌ Single dominant system, no blend

### After
```
Arcturus: 45-55%
Orion Light: 20-30%
Sirius: 15-25%
Pleiades: 5-10%
```
✅ Legitimate blend preserved, still focused (not muddy 6-system chaos)

## Tuning Knobs

If results are still too concentrated:
- Lower gamma to 1.2
- Lower rel_floor to 0.30
- Increase top_k.core to 4

If results are too muddy:
- Raise gamma to 1.5
- Raise rel_floor to 0.40
- Decrease top_k.core to 2

## Testing

All 8 tests pass:
- ✅ Placement-based scoring
- ✅ Planet weighting
- ✅ Core/shadow separation
- ✅ Unified percentage normalization
- ✅ Sparsify reduces spread
- ✅ Sharpening amplifies contrast
- ✅ Line 3 shadow dampener

## Credits

Settings recommended by GPT-5 based on diagnosis of the aggressive filter problem.

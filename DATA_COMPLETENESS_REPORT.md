# Data Completeness Report

## Summary

✅ **Merge Successful**: All 384 gate.lines are present in `gateLine_star_map.json`
❌ **Data Incomplete**: 144 gate.lines (37.5%) have NO mappings to ANY star system

## Statistics

### Overall Coverage:
- **240 gate.lines** (62.5%) have at least one star system mapping ✅
- **144 gate.lines** (37.5%) have ZERO mappings to all systems ❌

### Mappings Per System:
```
System          Nonzero Mappings    Percentage
─────────────────────────────────────────────
Arcturus        106/384             27.6%
Pleiades        100/384             26.0%
Andromeda        48/384             12.5%
Lyra             45/384             11.7%
Draco            42/384             10.9%
Orion Light      32/384              8.3%
Orion Dark       12/384              3.1%
Sirius            1/384              0.3%  ⚠️
─────────────────────────────────────────────
TOTAL           386/3072            12.6%
```

### Critical Issues:

1. **Sirius**: Only 1 mapping out of 384! (0.3%)
2. **Orion Dark**: Only 12 mappings (3.1%)
3. **144 gate.lines** have no mapping to any system

## Completely Unmapped Gates

These gates have ALL 6 lines unmapped:
- **Gate 26**: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6
- **Gate 52**: 52.1, 52.2, 52.3, 52.4, 52.5, 52.6
- **Gate 54**: 54.1, 54.2, 54.3, 54.4, 54.5, 54.6
- **Gate 56**: 56.1, 56.2, 56.3, 56.4, 56.5, 56.6
- **Gate 58**: 58.1, 58.2, 58.3, 58.4, 58.5, 58.6
- **Gate 62**: 62.1, 62.2, 62.3, 62.4, 62.5, 62.6

## Mostly Unmapped Gates

These gates have 5 out of 6 lines unmapped:
- **Gate 8**: Only 8.1 mapped
- **Gate 14**: Only 14.1 mapped
- **Gate 16**: Only 16.1 mapped
- **Gate 31**: Only 31.1 mapped
- **Gate 46**: Only 46.6 mapped
- **Gate 47**: Only 47.1 mapped
- **Gate 48**: Only 48.6 mapped

## Root Cause

The batch files in `lore-research/research-outputs/star-mapping-drafts/` have marked most gate.lines as:
```json
{
  "weight": 0,
  "alignment_type": "none",
  "why": "..."
}
```

This is either:
1. **Intentional**: The research determined these gate.lines don't map to these systems
2. **Incomplete**: The batch files haven't been fully completed yet

## Impact on App

### What Works:
- ✅ App loads and runs
- ✅ Scoring algorithm works
- ✅ 240 gate.lines have valid mappings
- ✅ Users with those gate.lines will get accurate classifications

### What's Limited:
- ❌ Users with unmapped gate.lines will get incomplete scores
- ❌ Some star systems (Sirius, Orion Dark) are severely underrepresented
- ❌ 37.5% of possible gate.line data is missing

### Example Impact:
If a user has gates 26, 52, 54, 56, 58, or 62 activated, those gates will contribute ZERO to their star system score because all their lines are unmapped.

## Recommendations

### Option 1: Complete the Batch Files (Recommended)
Go through tasks 8-59 in `.kiro/specs/gate-line-star-mapping/tasks.md` and ensure each gate.line is properly evaluated against each star system. Many are currently marked as "none" but may actually have valid mappings.

### Option 2: Use Default Weights
For unmapped gate.lines, assign a small default weight (e.g., 0.1) to the most likely system based on gate-level data.

### Option 3: Accept Partial Data
Document that the system currently has 62.5% coverage and will improve as more research is completed.

## Verification Commands

### Check a specific gate.line across all systems:
```bash
python3 << 'EOF'
import json
from pathlib import Path

gate_line = "26.1"  # Change this
systems = ["andromeda", "arcturus", "draco", "lyra", "orion-dark", "orion-light", "pleiades", "sirius"]

for system in systems:
    for batch in range(1, 8):
        filepath = Path(f"lore-research/research-outputs/star-mapping-drafts/{system}-batch{batch}.json")
        if filepath.exists():
            with open(filepath) as f:
                data = json.load(f)
                if gate_line in data:
                    print(f"{system:15} weight={data[gate_line]['weight']:.2f} type={data[gate_line]['alignment_type']}")
                    break
EOF
```

### Count unmapped gate.lines:
```bash
python3 << 'EOF'
import json
with open('lore-research/research-outputs/gateLine_star_map.json') as f:
    data = json.load(f)
unmapped = sum(1 for k, v in data.items() if k != '_meta' and (not v or len(v) == 0))
print(f"Unmapped gate.lines: {unmapped}/384")
EOF
```

## Next Steps

1. **Review batch files**: Check if weight=0 assignments are intentional or need revision
2. **Complete Sirius mappings**: Only 1 mapping is suspiciously low
3. **Complete Orion Dark mappings**: Only 12 mappings may be too few
4. **Validate unmapped gates**: Especially gates 26, 52, 54, 56, 58, 62 (all lines unmapped)

## Current Status

The app is **functional but incomplete**. It will work for users whose activated gates fall within the 240 mapped gate.lines, but will give incomplete results for users with unmapped gate.lines.

**Recommendation**: Continue with tasks 8-59 to complete the star-mapping batch files before considering the integration "done".

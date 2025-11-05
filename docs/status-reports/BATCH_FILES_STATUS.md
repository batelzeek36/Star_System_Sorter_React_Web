# Batch Files Status Report

## Summary

- **Total batch files**: 56 (8 systems × 7 batches)
- **Complete**: 45 files with meaningful mappings
- **Need work**: 11 files with all-zero or very sparse mappings

## Files Needing Completion

### Critical (All Zero Weights):

These files exist but have NO positive weights - all gate.lines are marked as "none":

1. **andromeda-batch6.json** - Gates 41-48 (48 lines, 0 non-zero)
2. **arcturus-batch6.json** - Gates 41-48 (48 lines, 0 non-zero)
3. **orion-dark-batch1.json** - Gates 1-8 (48 lines, 0 non-zero)
4. **orion-dark-batch2.json** - Gates 9-16 (48 lines, 0 non-zero)
5. **orion-dark-batch3.json** - Gates 17-24 (48 lines, 0 non-zero)
6. **sirius-batch1.json** - Gates 1-8 (48 lines, 0 non-zero)
7. **sirius-batch2.json** - Gates 9-16 (48 lines, 0 non-zero)
8. **sirius-batch3.json** - Gates 17-24 (48 lines, 0 non-zero)
9. **sirius-batch4.json** - Gates 25-32 (48 lines, 0 non-zero)
10. **sirius-batch5.json** - Gates 33-40 (48 lines, 0 non-zero)
11. **sirius-batch7.json** - Gates 49-64 (96 lines, 0 non-zero)

### Sparse (Very Few Mappings):

These files have some mappings but are very sparse (< 10% have weights):

- **andromeda-batch1.json** - 1 out of 48 (2%)
- **draco-batch1.json** - 1 out of 48 (2%)
- **draco-batch2.json** - 1 out of 48 (2%)
- **draco-batch3.json** - 2 out of 48 (4%)
- **lyra-batch2.json** - 4 out of 48 (8%)
- **lyra-batch7.json** - 8 out of 96 (8%)
- **orion-dark-batch4.json** - 1 out of 48 (2%)
- **orion-dark-batch5.json** - 2 out of 48 (4%)
- **orion-dark-batch6.json** - 1 out of 48 (2%)
- **orion-dark-batch7.json** - 8 out of 96 (8%)
- **orion-light-batch1.json** - 3 out of 48 (6%)
- **orion-light-batch2.json** - 3 out of 48 (6%)
- **orion-light-batch3.json** - 2 out of 48 (4%)
- **orion-light-batch6.json** - 1 out of 48 (2%)
- **orion-light-batch7.json** - 9 out of 96 (9%)
- **pleiades-batch6.json** - 4 out of 48 (8%)
- **sirius-batch6.json** - 1 out of 48 (2%)

## Impact on App

### Current State:
The app IS working and using your data, but:

- **Sirius** will score very low (almost all batches are empty)
- **Orion Dark** will score very low (first 3 batches empty, rest sparse)
- **Orion Light** will score moderately (sparse but some data)
- **Andromeda, Arcturus, Pleiades, Lyra, Draco** will score normally (most batches complete)

### What This Means:
Users will get classifications, but they'll be biased toward the systems with complete data:
- **Pleiades**: 100 mappings (good coverage)
- **Arcturus**: 106 mappings (good coverage)
- **Andromeda**: 48 mappings (moderate)
- **Lyra**: 45 mappings (moderate)
- **Draco**: 42 mappings (moderate)
- **Orion Light**: 32 mappings (sparse)
- **Orion Dark**: 12 mappings (very sparse)
- **Sirius**: 1 mapping (essentially non-functional)

## Recommended Action

### Priority 1 (Critical):
Complete these 11 all-zero batch files first:
- sirius-batch{1,2,3,4,5,7} (6 files)
- orion-dark-batch{1,2,3} (3 files)
- andromeda-batch6, arcturus-batch6 (2 files)

### Priority 2 (Important):
Review and enhance sparse batches:
- orion-dark-batch{4,5,6,7}
- orion-light-batch{1,2,3,6,7}
- draco-batch{1,2,3}

### How to Complete:

Each batch file needs to be reviewed against:
1. **Source**: `lore-research/research-outputs/gate-line-API-call/gate-line-{N}.json`
2. **Star system baseline**: `lore-research/research-outputs/star-systems/v4.2/{system}-baseline-4.2.json`
3. **Mapping digest**: Use the `mapping_digest` in each baseline to determine weights

Follow the process in `.kiro/steering/gate-line-standard.md` for each gate.line.

## Files Location

All batch files are in:
```
lore-research/research-outputs/star-mapping-drafts/
```

Pattern:
```
{system}-batch{1-7}.json
```

Where system is one of:
- andromeda
- arcturus
- draco
- lyra
- orion-dark
- orion-light
- pleiades
- sirius

## Next Steps

1. **Test the app now** - It works, but results will be biased
2. **Complete Priority 1 files** - Get Sirius and Orion Dark functional
3. **Re-run merge script** - After updating files:
   ```bash
   python3 lore-research/scripts/11-merge-star-mappings.py
   cp lore-research/research-outputs/gateLine_star_map.json star-system-sorter/public/data/
   ```
4. **Test again** - Verify all systems can appear in results

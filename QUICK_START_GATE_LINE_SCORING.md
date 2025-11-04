# Quick Start: Gate-Line Scoring

## TL;DR

The app now uses 384 gate.line mappings (instead of 64 gate mappings) for much more accurate star system classification.

## How It Works

1. **User enters birth data** → HD chart with activated gates
2. **For each activated gate** → Score all 6 lines (e.g., 1.1, 1.2, 1.3, 1.4, 1.5, 1.6)
3. **For each line** → Add weights to each star system
4. **Normalize** → Convert to percentages (sum = 100%)
5. **Classify** → Primary/Hybrid/Unresolved based on top scores

## Data Location

```
lore-research/research-outputs/star-mapping-by-gate/
  ├── gate-1.json   (6 lines × 8 systems)
  ├── gate-2.json
  ├── ...
  └── gate-64.json

         ↓ [merge script]

star-system-sorter/public/data/gateLine_star_map.json
  (610 KB, 384 gate.lines, 3072 mappings)
```

## Update Workflow

```bash
# 1. Edit research data
vim lore-research/research-outputs/star-mapping-by-gate/gate-X.json

# 2. Regenerate consolidated map
python3 lore-research/scripts/14-merge-gate-mappings.py

# 3. Verify integrity
python3 lore-research/scripts/15-verify-gate-mappings.py

# 4. Test
npm test --prefix star-system-sorter -- gateline --run

# 5. Done! App loads new data automatically (no rebuild needed)
```

## Key Scripts

| Script | Purpose |
|--------|---------|
| `14-merge-gate-mappings.py` | Merge 64 gate files → 1 consolidated JSON |
| `15-verify-gate-mappings.py` | Verify data integrity (384 gate.lines, 8 systems) |

## Key Files

| File | Purpose |
|------|---------|
| `star-system-sorter/public/data/gateLine_star_map.json` | Consolidated data (610 KB) |
| `star-system-sorter/src/lib/gateline-map.ts` | Data loader |
| `star-system-sorter/src/lib/scorer.ts` | Scoring algorithm |
| `star-system-sorter/src/hooks/useClassification.ts` | React hook |

## Testing

```bash
# Test data loading
npm test --prefix star-system-sorter -- gateline-map.test.ts --run

# Test scoring integration
npm test --prefix star-system-sorter -- scorer-gateline.test.ts --run

# Test everything
npm test --prefix star-system-sorter -- --run
```

## Data Format

Each gate.line maps to 8 star systems:

```json
{
  "1.1": [
    {
      "star_system": "Lyra",
      "weight": 0.85,
      "alignment_type": "core",
      "why": "Pure creative emanation..."
    },
    {
      "star_system": "Pleiades",
      "weight": 0.05,
      "alignment_type": "core",
      "why": "Subtle sensitivity..."
    },
    ...
  ]
}
```

## Stats

- **Total gate.lines**: 384 (64 gates × 6 lines)
- **Total mappings**: 3,072 (384 gate.lines × 8 systems)
- **Positive weights**: 2,678 (~87% of mappings have weight > 0)
- **Average positive weights per gate.line**: 7.0
- **File size**: 610 KB (uncompressed), ~100 KB (gzipped)

## Fallback

If gate-line map fails to load:
- Falls back to lore bundle (less granular)
- Logs warning to console
- Classification still works

## Documentation

- **Integration guide**: `star-system-sorter/GATE_LINE_INTEGRATION.md`
- **Completion summary**: `GATE_LINE_INTEGRATION_COMPLETE.md`
- **This quick start**: `QUICK_START_GATE_LINE_SCORING.md`

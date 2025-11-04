# Gate-Line Star Mapping Integration

## Overview

The Star System Sorter now uses comprehensive gate-line level mappings (384 gate.lines) for scoring, providing much more granular and accurate classifications than the previous gate-level (64 gates) approach.

## Data Flow

```
lore-research/research-outputs/star-mapping-by-gate/
  ├── gate-1.json (6 lines × 8 systems)
  ├── gate-2.json
  ├── ...
  └── gate-64.json
         ↓
  [14-merge-gate-mappings.py]
         ↓
star-system-sorter/public/data/gateLine_star_map.json
         ↓
  [loadGateLineMap() in gateline-map.ts]
         ↓
  [computeScoresWithGateLines() in scorer.ts]
         ↓
  [useClassification() hook]
         ↓
  ResultScreen displays classification
```

## Key Files

### Research Data
- **Source**: `lore-research/research-outputs/star-mapping-by-gate/gate-{1-64}.json`
  - 64 files, one per gate
  - Each file contains 6 lines
  - Each line maps to 8 star systems with weights and alignment types

### Build Script
- **Script**: `lore-research/scripts/14-merge-gate-mappings.py`
  - Merges all 64 gate files into a single consolidated JSON
  - Converts from system-keyed format to array format
  - Adds metadata (version, timestamp, system list)
  - Output: `star-system-sorter/public/data/gateLine_star_map.json`

### App Integration
- **Loader**: `star-system-sorter/src/lib/gateline-map.ts`
  - `loadGateLineMap()`: Fetches the consolidated JSON from `/data/`
  - `getGateLineMapping()`: Gets mappings for a specific gate.line
  - `getGateLinesForGates()`: Generates all gate.line keys for a list of gates

- **Scorer**: `star-system-sorter/src/lib/scorer.ts`
  - `computeScoresWithGateLines()`: Scores all 6 lines for each activated gate
  - Only counts positive weights (weight > 0)
  - Normalizes to percentages that sum to exactly 100.00

- **Hook**: `star-system-sorter/src/hooks/useClassification.ts`
  - Automatically tries to load gate-line map
  - Falls back to lore bundle if gate-line map unavailable
  - Stores classification result in Zustand store

## Data Format

### Input Format (gate-{N}.json)
```json
{
  "1.1": {
    "andromeda": {
      "weight": 0,
      "alignment_type": "none",
      "why": "..."
    },
    "lyra": {
      "weight": 0.85,
      "alignment_type": "core",
      "why": "Pure creative emanation..."
    },
    ...
  }
}
```

### Output Format (gateLine_star_map.json)
```json
{
  "_meta": {
    "version": "1.0.0",
    "generated_at_utc": "2024-11-03T...",
    "source_star_system_version": "4.2",
    "total_gate_lines": 384,
    "systems": ["andromeda", "arcturus", ...]
  },
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
    }
  ]
}
```

## Scoring Algorithm

For each activated gate in the user's HD chart:
1. Look up all 6 lines for that gate (e.g., 1.1, 1.2, 1.3, 1.4, 1.5, 1.6)
2. For each line, get all star system mappings
3. Add positive weights to each system's raw score
4. Track contributors (gate.line + weight + alignment type)
5. Normalize raw scores to percentages (sum = 100.00)
6. Sort systems by percentage descending
7. Classify as primary/hybrid/unresolved based on top scores

## Updating the Data

When you update the research data in `star-mapping-by-gate/`:

```bash
# 1. Regenerate the consolidated map
python3 lore-research/scripts/14-merge-gate-mappings.py

# 2. The app will automatically pick up the new data on next load
# (No rebuild needed - data is loaded at runtime from /public/data/)
```

## Testing

```bash
# Test gate-line map loading
npm test --prefix star-system-sorter -- gateline-map.test.ts --run

# Test gate-line scoring integration
npm test --prefix star-system-sorter -- scorer-gateline.test.ts --run

# Run all tests
npm test --prefix star-system-sorter -- --run
```

## Fallback Behavior

If the gate-line map fails to load (e.g., file not found, network error):
- The app falls back to `computeScoresWithLore()` using the lore bundle
- A warning is logged to console
- Classification still works, just with less granular data

## Performance

- **File size**: ~610 KB (384 gate.lines × 8 systems)
- **Load time**: <100ms on typical connection
- **Computation**: <10ms for typical HD chart (10-20 gates)
- **Caching**: Loaded once per session, cached in memory

## Future Enhancements

- [ ] Add confidence scores to classification results
- [ ] Include behavioral_match and keywords in UI
- [ ] Show alignment_type (core/shadow) in contributor details
- [ ] Add provenance tracking (sources, citations)
- [ ] Implement version checking and auto-update

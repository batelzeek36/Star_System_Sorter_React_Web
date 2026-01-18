# Star System Baseline Research Outputs

## Purpose

This directory stores the JSON responses from Perplexity Comet for Phase 0 baseline research.

## Expected Files

After completing Phase 0, you should have:

```
sirius-baseline.json
pleiades-baseline.json
orion-light-baseline.json
orion-dark-baseline.json
andromeda-baseline.json
lyra-baseline.json
arcturus-baseline.json
draco-baseline.json
zeta-reticuli-baseline.json
```

## File Format

Each file should be valid JSON with this structure:

```json
{
  "star_system": "Sirius",
  "characteristics": [
    {
      "trait": "Teachers and wisdom keepers",
      "consensus_level": "high",
      "ancient_support": "high",
      "evidence_type": "direct",
      "disputed": false,
      "sources": [
        {
          "title": "Full Title",
          "author": "Full Name",
          "edition": "Edition Info",
          "year": 1984,
          "page": "Specific Location",
          "quote": "Actual quote ≤25 words",
          "url": "URL if available",
          "source_type": "ancient|research|channeled|indigenous|controversial"
        }
      ]
    }
  ],
  "disputed_points": [],
  "research_notes": "Summary of findings"
}
```

## Validation

Before considering a file "complete", verify:

✅ 3-5 characteristics documented
✅ Each characteristic has 5+ sources
✅ All sources have specific page numbers
✅ All sources have actual quotes ≤25 words
✅ All sources have edition information
✅ URLs included where available
✅ Source types labeled
✅ Disputed claims noted with counter-evidence
✅ Consensus levels justified
✅ Ancient support levels noted

## Next Steps

After all 8 files are validated:

1. Compile into `../../star-systems/COMPILED_BASELINES.yaml`
2. Cross-check against `../../star-systems/BASELINE_SYNTHESIS.md`
3. Proceed to Phase 1 (gate research)

## Status

- ⏳ sirius-baseline.json - Pending
- ⏳ pleiades-baseline.json - Pending
- ⏳ orion-light-baseline.json - Pending
- ⏳ orion-dark-baseline.json - Pending
- ⏳ andromeda-baseline.json - Pending
- ⏳ lyra-baseline.json - Pending
- ⏳ arcturus-baseline.json - Pending
- ⏳ draco-baseline.json - Pending
- ⏳ zeta-reticuli-baseline.json - Pending

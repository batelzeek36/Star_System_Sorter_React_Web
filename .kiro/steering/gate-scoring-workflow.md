# Gate Scoring Workflow

This document defines the standard workflow for analyzing and scoring gates 1-64 for star system classification. Follow this process for each gate to ensure consistency and quality.

## Overview

Each gate analysis involves:
1. Reading source data (baselines, gate, hexagram)
2. Analyzing all 6 lines individually against 8 star systems
3. Assigning weights (0.0-1.0) and extracting evidence (sparse format)
4. Generating output files (star-maps and evidence)
5. Running validation scripts
6. Documenting difficult decisions

## Step-by-Step Workflow

### 1. Read Source Data

For Gate N, read these three files:

```bash
# Star system baselines (all 8 systems)
GPT-5/combined-baselines-4.2.json

# Gate data (Human Design + Line Companion)
s3-data/gates/{N:02d}.json

# Hexagram data (I Ching - Legge translation)
s3-data/hexagrams/{N:02d}.json
```

**Key principle:** The I Ching hexagram is the canonical anchor. Human Design gates are mapped views of hexagrams, not independent oracles.

### 2. Analyze Each Line

For each of the 6 lines in the gate:

**a) Read the line content from all sources:**
- Human Design gate description
- Line Companion text
- I Ching hexagram line text (Legge)

**b) Compare against all 8 star systems:**
- Pleiades
- Sirius
- Lyra
- Andromeda
- Orion Light
- Orion Dark
- Arcturus
- Draco

**c) Assign weights (0.0-1.0):**
- `1.0` = Strong, direct alignment
- `0.7-0.9` = Clear alignment with some nuance
- `0.4-0.6` = Moderate alignment or symbolic connection
- `0.1-0.3` = Weak or tangential connection
- `0.0` = No alignment (omit from output - sparse format)

**d) Extract evidence (sparse format only):**
- Only include evidence for weights > 0.0
- Use direct quotes from source texts
- Cite source (HD, LC, or Legge)
- Keep reasoning concise (1-2 sentences)

### 3. Generate Output Files

Create two JSON files:

**Star Map:** `GPT-5/star-maps/gateLine_star_map_Gate{N:02d}.json`
```json
{
  "gate": N,
  "lines": {
    "1": {
      "Pleiades": 0.8,
      "Sirius": 0.3
    },
    "2": { ... }
  }
}
```

**Evidence:** `GPT-5/evidence/gateLine_evidence_Gate{N:02d}.json`
```json
{
  "gate": N,
  "lines": {
    "1": {
      "Pleiades": {
        "weight": 0.8,
        "evidence": "Direct quote from source",
        "source": "HD|LC|Legge",
        "reasoning": "Brief explanation"
      }
    }
  }
}
```

### 4. Run Validation Scripts

**Validation 7.1 - Schema & Structure:**
```bash
cd GPT-5/scripts
python validate_gate_outputs.py N
```

This checks:
- JSON schema compliance
- Weight ranges (0.0-1.0)
- Sparse format (no 0.0 weights)
- File structure
- Required fields

**Validation 7.2 - Quote Verification:**
```bash
cd GPT-5/scripts
python verify_quotes.py N
```

This checks:
- Evidence quotes exist in source files
- Source citations are accurate
- No hallucinated quotes
- Proper attribution

**Both scripts must pass before proceeding.**

### 5. Document Difficult Decisions

If you encounter ambiguous cases, document them:

**Create:** `GPT-5/notes/gate-{N:02d}-notes.md`

Include:
- Which line(s) were difficult
- What made them ambiguous
- How you resolved it
- Alternative interpretations considered

## Quality Standards

### Sparse Format Rule
**Never include weights of 0.0 in output files.** If a line has no alignment with a star system, omit that star system entirely from the output.

### Evidence Requirements
- Must be direct quotes from source texts
- Must be verifiable by validation scripts
- Must cite correct source (HD, LC, or Legge)
- Reasoning should explain the connection, not repeat the quote

### Weight Calibration
- Be consistent across gates
- Use the full range (0.0-1.0)
- Don't inflate weights - be honest about weak connections
- When in doubt, err on the side of lower weights

### I Ching Primacy
The I Ching hexagram text (Legge translation) is the canonical anchor. If Human Design or Line Companion content conflicts with the I Ching, the I Ching takes precedence.

## Common Pitfalls

❌ **Don't:**
- Include 0.0 weights in output (violates sparse format)
- Invent quotes or paraphrase without citation
- Assign high weights to weak symbolic connections
- Ignore the I Ching text in favor of HD/LC only
- Rush through lines without careful analysis

✅ **Do:**
- Read all three sources for each line
- Compare systematically against all 8 star systems
- Use direct quotes for evidence
- Run both validation scripts
- Document ambiguous cases
- Maintain consistency with previous gates

## Validation Quick Reference

**Pass criteria:**
- ✅ Both validation scripts pass (7.1 + 7.2)
- ✅ All weights in range 0.0-1.0
- ✅ No 0.0 weights in output (sparse format)
- ✅ All evidence quotes verified in source files
- ✅ Proper JSON schema compliance

**If validation fails:**
1. Read the error message carefully
2. Check the specific line/star system mentioned
3. Fix the issue (quote, weight, format)
4. Re-run validation
5. Repeat until both scripts pass

## Resources

- **Validation docs:** `GPT-5/scripts/README_VALIDATION.md`
- **Quote verification docs:** `GPT-5/scripts/README_QUOTE_VERIFICATION.md`
- **Quick reference:** `GPT-5/scripts/VALIDATION_QUICK_REFERENCE.md`
- **Schema files:** `GPT-5/schemas/weights.schema.json`, `GPT-5/schemas/evidence.schema.json`
- **Gate 1 example:** `GPT-5/star-maps/gateLine_star_map_Gate01.json`, `GPT-5/evidence/gateLine_evidence_Gate01.json`

## Time Estimate

Per gate: 30-60 minutes
- Reading sources: 5-10 min
- Analyzing 6 lines: 15-30 min
- Generating outputs: 5-10 min
- Running validation: 2-5 min
- Fixing issues: 5-10 min

Total for 64 gates: 32-64 hours

## Support

If you encounter issues:
1. Check validation error messages
2. Review Gate 1 as reference implementation
3. Consult the schema files
4. Document the issue in gate-specific notes
5. Ask for clarification if needed

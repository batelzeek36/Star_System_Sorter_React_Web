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

For Gate N, read these files **in order**:

```bash
# Star system baselines (all 8 systems)
GPT-5/combined-baselines-4.2.json

# Human Design Line Companion (primary narrative + quotes)
claude/Full Pass/gate-{N}-full.json

# Legge I Ching lines (cross-reference quotes)
claude/I-Ching-Full-Pass/hexagram-{N:02d}.json

# Optional structured metadata (NOT for quote extraction)
s3-data/gates/{N:02d}.json
s3-data/hexagrams/{N:02d}.json
```

- Line Companion is the **primary** interpretive lens; treat HD as the source of record.
- Legge I Ching provides the **cross-reference** to find the shared thread or tension; it anchors high-confidence (>0.50) weights.
- The `s3-data/` files are helpful for metadata lookup (center, circuitry, etc.) but are not used for verbatim quoting.

### 2. Analyze Each Line

For each of the 6 lines in the gate:

**a) Read the line content from both primary + cross-reference sources:**
- Start with the Line Companion text in `claude/Full Pass/gate-{N}-full.json` (HD/LC is primary).
- Then read the matching Legge line in `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json` to spot overlaps/differences.
- Capture the common archetypal thread emerging from both.

**b) Compare the blended insight against all 8 star systems:**
- Pleiades
- Sirius
- Lyra
- Andromeda
- Orion Light
- Orion Dark
- Arcturus
- Draco

**c) Assign weights (0.00-0.95, increments of 0.01):**
- `0.85-0.95` → direct, explicit match in both LC + Legge.
- `0.65-0.80` → strong alignment primarily grounded in HD text.
- `0.45-0.60` → moderate resonance; some interpretation needed.
- `0.30-0.40` → secondary/supporting flavor.
- `0.00` → no alignment (omit entirely from sparse output).

**d) Enforce mechanical constraints per line:**
- **Top-2 constraint:** Max two systems with weight >0; exactly one `role: "primary"`, optional one `role: "secondary"`.
- **Pairwise exclusion rules:** Apply all six invariants (Pleiades↔Draco, Sirius↔Orion Light cap, Andromeda↔Orion Dark, Arcturus↔Pleiades, Lyra↔Draco, Orion Light↔Orion Dark). Re-check after any weight edits.
- **Tie-breaker:** If weights tie, order by canonical list (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco).
- **Polarity:** Required when weight ≥0.40 (core vs shadow). Ensure `why` cites the polarity (“Sirius core —”).
- **Precision:** All weights multiples of 0.01; cap at 0.95.

**e) Extract evidence (sparse format only):**
- Provide entries only for systems with weight >0.0.
- **Line Companion quote**: Preferred evidence; may come from any line within the same gate.
- **Legge quote**: Cross-reference support; **if weight >0.50 the Legge quote must come from the same line number (Option A)**. If no same-line quote exists, reduce the weight to ≤0.50.
- Quotes must be verbatim, ≤25 words, with correct locators (`"Gate {N}, Line {L}"`, `"Hex {NN}, Line {L}"`).
- Populate `hd_keywords` (2-6 terms) from the LC text and `ic_atoms` (2-6 terms) from the Legge text.
- Keep `behavioral_match`, `why`, and `why_cited` concise (1-2 sentences referencing quick_rules).

### 3. Generate Output Files

Create two JSON files (Gate 01 is the canonical example):

1. **Star Map** – `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
   - Structure:
     ```json
     {
       "_meta": {
         "version": "4.2",
         "baseline_beacon": "59bfc617",
         "gate": "01",
         "generated_at": "2025-01-15T18:30:00Z",
         "generator": "Manual",
         "sum_unorm": 5.48
       },
       "01.1": [
         {
           "star_system": "Lyra",
           "weight": 0.78,
           "role": "primary",
           "polarity": "core",
           "confidence": 5,
           "behavioral_match": "Patient timing...",
           "keywords": ["waits", "incubates"],
           "why": "Lyra core — cites quick_rule"
         }
       ],
       "01.2": [
         { "... primary system ..." },
         { "... secondary system ..." }
       ]
     }
     ```
   - Keys must be `"NN.L"` strings; values are arrays with ≤2 entries.
   - `behavioral_match`, `keywords` (2-6 items), and `why` are required for every entry.

2. **Evidence** – `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`
   - Structure:
     ```json
     {
       "_meta": {
         "version": "4.2",
         "baseline_beacon": "59bfc617",
         "gate": "01",
         "generated_at": "2025-01-15T18:30:00Z",
         "generator": "Manual"
       },
       "01.1": [
         {
           "star_system": "Lyra",
           "sources": {
             "legge1899": {
               "quote": "the dragon lying hid...",
               "locator": "Hex 01, Line 1",
               "attribution": "Legge 1899"
             },
             "line_companion": {
               "quote": "Time is everything...",
               "locator": "Gate 1, Line 1",
               "attribution": "Ra Uru Hu (LC)"
             }
           },
           "atoms": {
             "hd_keywords": ["time", "wait", "patience"],
             "ic_atoms": ["lying hid", "not the time"]
           },
           "why_cited": "Patient incubation ...",
           "polarity": "core",
           "confidence": 5
         }
       ]
     }
     ```
   - `sources.legge1899` and `sources.line_companion` objects are always present (quotes can be empty strings when justified, but locators/attributions remain).
   - `hd_keywords` and `ic_atoms`: 2-6 keywords each pulled directly from the quoted text.
   - `confidence` must mirror the corresponding weight entry.

**Metadata checklist:**
- `_meta.version` = `"4.2"`.
- `baseline_beacon` = SHA256 fingerprint of `combined-baselines-4.2.json` (currently `59bfc617`; recompute if baselines change).
- `gate` = zero-padded string (`"01"` … `"64"`).
- `generated_at` = ISO8601 timestamp (UTC).
- `generator` = `"Manual"` (or `"GPT-5"` / `"Claude"` if one of those agents produced the files).
- `sum_unorm` = sum of all non-zero weights across six lines (weight file only).

### 4. Run Validation Scripts

**Validation 7.1 - Schema & Structure:**
```bash
cd GPT-5/scripts
python validate_gate_outputs.py N
```

This checks:
- JSON schema compliance for weights + evidence
- `_meta` completeness (version, beacon, gate, generator, timestamps, sum_unorm)
- Weight precision (0.01) and cap (≤0.95)
- Top-2 constraint, role assignments, canonical ordering
- Pairwise exclusion rules (all six invariants)
- Sparse format (no zero-weight entries in evidence)
- Canonical star system names

**Validation 7.2 - Quote Verification:**
```bash
cd GPT-5/scripts
python verify_quotes.py N
```

This checks:
- Quotes are ≤25 words, verbatim, and found in the correct sources
- Locator formats (`Hex NN, Line L` / `Gate N, Line L`) and gate/line alignment
- Legge same-line requirement for weights >0.50 (Option A)
- Line Companion quotes exist within the same gate (line-agnostic)
- Attributions + keyword atoms match schema expectations

**Both scripts must pass before proceeding.**

### 5. Document Difficult Decisions

If you encounter ambiguous cases, document them:

**Create / update:** `GPT-5/notes/gate-{N:02d}-notes.md` (create the `GPT-5/notes` folder if it does not exist)

Include:
- Which line(s) were difficult
- What made them ambiguous
- How you resolved it
- Alternative interpretations considered

## Quality Standards

### Sparse Format Rule
**Never include weights of 0.0 in output files.** If a line has no alignment with a star system, omit that star system entirely from the output.

### Evidence Requirements
- Line Companion quote is preferred and may be from any line within the gate.
- Legge quote provides cross-reference; if weight >0.50, the Legge quote must come from the same line or the weight must be reduced.
- Quotes must be verbatim, ≤25 words, and cite correct locators.
- Populate `hd_keywords` / `ic_atoms` with 2-6 terms pulled directly from the quoted text.
- Reasoning should explain the behavioral match, not restate the quote.

### Weight Calibration
- Be consistent across gates
- Use the calibrated ranges (0.30-0.95) with 0.01 increments
- Don't inflate weights - be honest about weak connections
- When in doubt, err on the side of lower weights

### HD Primacy + Legge Cross-Reference
Human Design / Line Companion is the primary narrative. Use the Legge text to confirm, sharpen, or contrast the interpretation so the final mapping reflects the shared thread between systems (Option A retains the Legge same-line requirement for high weights).

## Common Pitfalls

❌ **Don't:**
- Include 0.0 weights in output (violates sparse format)
- Invent quotes or paraphrase without citation
- Assign high weights to weak symbolic connections
- Skip the Line Companion primary text
- Rush through lines without careful analysis

✅ **Do:**
- Read LC first, then cross-reference Legge for each line
- Compare systematically against all 8 star systems
- Use direct quotes (≤25 words) for evidence
- Run both validation scripts
- Document ambiguous cases
- Maintain consistency with previous gates

## Validation Quick Reference

- **Pass criteria:**
  - ✅ Both validation scripts pass (7.1 + 7.2)
  - ✅ All weights in range 0.00-0.95 (0.01 increments)
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

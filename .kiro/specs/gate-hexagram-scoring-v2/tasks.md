# Implementation Plan

## Phase 1: Foundation & Validation (Tasks 1-7) ✅ COMPLETE

- [x] 1. Setup and Schema Definition
  - Create JSON schemas for weight and evidence files
  - Implement baseline beacon computation script
  - Validate schemas against example files from requirements
  - _Requirements: 1.2, 6.3_

- [x] 2. Master Prompt Template Creation
  - Write comprehensive prompt template with three-phase instructions
  - Include top-2 constraint enforcement rules
  - Document all pairwise exclusion invariants
  - Add Legge gating rule (weight >0.50 requires Legge quote)
  - Include weight calibration scale and canonical system names
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 4.1-4.6_

- [x] 3. Gate 1 Pilot Test
  - Apply prompt template to Gate 1
  - Generate weight and evidence files
  - Validate outputs against schemas
  - Verify top-2 constraint and pairwise exclusions
  - Check quote verbatim accuracy and length
  - Confirm baseline beacon matches
  - _Requirements: 1.1, 1.2, 2.1-2.5, 3.1-3.5, 4.1-4.6, 5.1-5.5, 6.1-6.6, 7.1-7.5_

- [x] 4. Prompt Refinement
  - Document issues found in Gate 1 test
  - Update prompt template to address failures
  - Re-test Gate 1 to confirm fixes
  - Create refinement notes document
  - _Requirements: 1.1, 7.1-7.5_

- [x] 5. Prompt Generation Automation
  - Create script to generate 64 gate-specific prompts from template
  - Verify all required input files exist for each gate
  - Write prompts to GPT-5/prompts/gates/ directory
  - _Requirements: 8.1_

- [x] 6. Context Packing Script
  - Implement script to inline baseline, gate, and hexagram files into prompts
  - Ensure packed prompts are self-contained and ready to use
  - Test with Gate 1 prompt
  - _Requirements: 5.1-5.3, 8.1_

- [x] 7. Validation Script Suite
  
  - [x] 7.1 Core validation script
    - Implement JSON schema validation
    - Add top-2 constraint checking
    - Add pairwise exclusion rule verification
    - Add weight range and precision validation
    - Add baseline beacon verification (computed at runtime)
    - Add canonical name validation (exact case and spacing)
    - Add key sorting checks (ascending "NN.L" format)
    - Add tie-breaking order enforcement (canonical system order when weights equal)
    - Verify sparse format (only non-zero weights present)
    - Verify sum_unorm equals sum of all non-zero weights across all 6 lines
    - _Requirements: 3.4, 4.1-4.6, 6.5, 6.6, 7.1-7.5_

  - [x] 7.2 Quote verification script
    - Implement verbatim quote checking against source files
    - Add 25-word length validation
    - Add Legge same-line verification (MUST be from same line number) for weights >0.50
    - Verify Line Companion quotes are verbatim (may be from any line in gate)
    - Apply checks independently for each included system (max 2 per line)
    
    **Word Counting Rules:**
    - Tokenize on whitespace (split by spaces, tabs, newlines)
    - Collapse consecutive whitespace into single separator
    - Hyphenated words count as 1 word (e.g., "self-control")
    - Contractions count as 1 word (e.g., "don't")
    - Em-dashes and en-dashes treated as word separators
    - Punctuation alone is not a word
    - Apply Unicode normalization (NFC or NFKC) before counting
    
    **Verbatim Matching Rules:**
    - Exact substring match in correct source block (case-sensitive)
    - Apply minimal normalization before matching:
      - Unicode normalization (NFKC)
      - Normalize smart quotes/apostrophes to straight ASCII (' " instead of ' ' " ")
      - Collapse internal whitespace runs to single space
      - Strip leading/trailing whitespace
    - No paraphrasing allowed
    - Punctuation must match after normalization
    - Quote must be found as substring (no sentence boundary requirement)
    
    **Locator Validation:**
    - Legge locator format: "Hex {NN}, Line {L}" where NN is zero-padded gate number, L is line 1-6
    - Legge quote MUST be found within hexagram {NN} line {L} content (same-line requirement)
    - Line Companion locator format: "Gate {N}, Line {L}" where N is gate number (may be zero-padded), L is line 1-6
    - Line Companion gate must match, but line may differ (line-agnostic within gate)
    - Validate locator format matches expected pattern
    - Cross-check that quote's actual source location matches locator claim
    
    **Error Messages (for CI usability):**
    - "Quote exceeds 25 words (actual: {count} words)"
    - "Quote not found verbatim in source: {source_type} {locator}"
    - "Locator format invalid: '{locator}' (expected format: {expected_format})"
    - "Locator line mismatch: expected Hex {NN} Line {L}, but quote found in Line {actual_line}"
    - "Locator gate mismatch: expected Gate {N}, but quote found in Gate {actual_gate}"
    - "Missing Legge quote for weight >0.50 (weight: {weight}, system: {system})"
    
    _Requirements: 2.1, 2.2, 2.6, 7.2, 7.5_

## Phase 2: Infrastructure & Orchestration (Tasks 7.3-7.5)

- [x] 7.3 Invariant fuzz testing script
  - Test all pairwise exclusion rules across sample data
  - Generate invariants report
  - _Requirements: 4.1-4.6, 7.4_

- [x] 7.4 Quote Rules Reference Document
  - Create `GPT-5/docs/QUOTE_VALIDATION_RULES.md`
  - Consolidate word count rules, normalization policy, locator formats
  - Document error patterns and CI-style error messages
  - Reference from both validation script and documentation
  - _Requirements: 2.1, 2.2, 7.2_

- [x] 7.5 Manual Scoring Run Manifest
  - Create `GPT-5/run-manifest-template.yaml` defining required fields:
    - `schema_version` (string), `analyst` (string), `session_date` (ISO 8601 date)
    - `baseline_beacon`: { `value` (string), `method` (string), `source_path` (string), `source_sha256` (string) }
    - `gates_completed` (array of gate numbers), `gates_validated` (array of gate numbers)
    - `timestamp_utc` (ISO 8601 string), `git_commit` (string), `git_dirty` (bool)
    - `notes` (string, optional session notes)
  - Include example at `GPT-5/docs/RUN_MANIFEST.md`
  - Implement writer `GPT-5/scripts/write_run_manifest.py` that emits per-session manifest `GPT-5/runs/<session_date>/run-manifest.yaml`
  - Document usage in `GPT-5/docs/ORCHESTRATION.md` for tracking manual scoring progress
  - Acceptance: template present and validates; writer generates file with correct hashes; manifest tracks completion status
  - _Requirements: 1.2, 8.1_

- [ ] 7.6 Batch Validation & Reporting Script (Optional)
  - Implement `GPT-5/scripts/run_validation_batch.py` with:
    - Batch validation across multiple gates
    - Structured logging (per-gate validation results, errors, timing)
    - Automatic validation (calls 7.1 + 7.2 validators)
    - Summary report generation
  - Support `--gates 1-8` range syntax
  - Useful for validating multiple gates after manual scoring
  - _Requirements: 8.1-8.5_
  - _Note: Adapted for manual scoring workflow - focuses on validation/reporting, not orchestration_

## Phase 3: Gate-by-Gate Analysis & Scoring (Tasks 8-71)

**Approach:** Kiro reads and analyzes each gate individually with **Human Design Line Companion text as the primary lens**, cross-referencing the Legge I Ching lines to find the shared thread before mapping to star system baselines.

**Input Files (per gate):**
- Star system baselines: `GPT-5/combined-baselines-4.2.json` (all 8 systems consolidated)
- Line Companion data (primary HD source): `claude/Full Pass/gate-{N}-full.json` (complete verbatim Line Companion text by Ra Uru Hu)
- I Ching Legge data (cross-reference): `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json` (complete Legge 1899 translation, zero-padded)
- Gate metadata (optional reference): `s3-data/gates/{N:02d}.json` (structured metadata, not for quotes)
- Hexagram metadata (optional reference): `s3-data/hexagrams/{N:02d}.json` (structured metadata, not for quotes)
- Reference (optional): `lore-research/research-outputs/star-mapping-by-gate/gate-{N}.json` (v1 format, for comparison only)

**Output Format (production-ready sparse format):**
- Star map: `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json` (see Gate01 as example)
- Evidence: `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`
- Format: Top 1-2 systems only per line, with behavioral_match, keywords, confidence

**Workflow (per gate):**
1. Read `GPT-5/combined-baselines-4.2.json` - focus on `core_themes`, `shadow_themes`, `quick_rules`, `notes_for_alignment`
2. Read source files (HD first, Legge second):
   - Line Companion: `claude/Full Pass/gate-{N}-full.json` (full verbatim text for quotes)
   - I Ching Legge: `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json` (full verbatim text for quotes)
   - Optional metadata: `s3-data/gates/{N:02d}.json` and `s3-data/hexagrams/{N:02d}.json` (structured data, NOT for quotes)
3. For each of 6 lines:
   - Read Line Companion text first (`lines[i].full_text`) to anchor the Human Design interpretation
   - Cross-reference the matching Legge I Ching line (`lines[i].legge_line_text`) to find the shared thread / divergence
   - Compare blended HD+Legge themes against star system characteristics
   - Use `quick_rules` as primary discriminators
   - Identify top 1-2 star systems with strongest resonance
   - Assign weights (0.00-0.95 scale, typically 0.65-0.85 for primary, 0.30-0.55 for secondary, increments of 0.01)
   - Apply pairwise exclusion rules (Pleiades/Draco, Orion Light/Dark, etc.) and re-check after adjustments
   - Extract verbatim quotes (≤25 words) from both sources:
     - Line Companion quote preferred for HD evidence; can be any line within the gate
     - Legge quote for cross-reference; **must be same line when weight >0.50**
   - Document behavioral_match, keywords, confidence (1-5 scale, where 1=low, 5=high)
   - **Tie-breaker:** If weights are equal, order systems by canonical order (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco)
4. Populate metadata:
   - Calculate `sum_unorm` (sum of all weights across all 6 lines) and include in `_meta`
   - Set `baseline_beacon` from Phase 0 hash, `gate` as zero-padded string, and `generated_at` ISO timestamp
   - Set `generator` to `"Manual"` (or the agent producing the files, matching schema enum)
5. Generate output files in GPT-5 sparse format (see Gate 01 as canonical example)
6. Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py {N}` and `python GPT-5/scripts/verify_quotes.py {N}`
7. Fix any validation errors
8. Document any difficult decisions or edge cases

**Note on Reference Files:**
- Files in `lore-research/research-outputs/star-mapping-by-gate/` are v1 (exploratory, verbose, all 8 systems)
- They can be consulted for comparison but are NOT the target format
- GPT-5 format is production-ready (sparse, top 1-2 only, with evidence)

---

- [ ] 8. Gate 1 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-1-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-01.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate01.json` and `GPT-5/evidence/gateLine_evidence_Gate01.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 1` and `python GPT-5/scripts/verify_quotes.py 1`
  - Document reasoning for difficult decisions
  - _Note: Gate 1 already has content - review and refine if needed to match v4.2 format_

- [ ] 9. Gate 2 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-2-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-02.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate02.json` and `GPT-5/evidence/gateLine_evidence_Gate02.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 2` and `python GPT-5/scripts/verify_quotes.py 2`
  - Document reasoning for difficult decisions

- [ ] 10. Gate 3 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-3-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-03.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate03.json` and `GPT-5/evidence/gateLine_evidence_Gate03.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 3` and `python GPT-5/scripts/verify_quotes.py 3`
  - Document reasoning for difficult decisions

- [ ] 11. Gate 4 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-4-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-04.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate04.json` and `GPT-5/evidence/gateLine_evidence_Gate04.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 4` and `python GPT-5/scripts/verify_quotes.py 4`
  - Document reasoning for difficult decisions

- [ ] 12. Gate 5 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-5-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-05.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate05.json` and `GPT-5/evidence/gateLine_evidence_Gate05.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 5` and `python GPT-5/scripts/verify_quotes.py 5`
  - Document reasoning for difficult decisions

- [ ] 13. Gate 6 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-6-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-06.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate06.json` and `GPT-5/evidence/gateLine_evidence_Gate06.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 6` and `python GPT-5/scripts/verify_quotes.py 6`
  - Document reasoning for difficult decisions

- [ ] 14. Gate 7 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-7-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-07.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate07.json` and `GPT-5/evidence/gateLine_evidence_Gate07.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 7` and `python GPT-5/scripts/verify_quotes.py 7`
  - Document reasoning for difficult decisions

- [ ] 15. Gate 8 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-8-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-08.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate08.json` and `GPT-5/evidence/gateLine_evidence_Gate08.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 8` and `python GPT-5/scripts/verify_quotes.py 8`
  - Document reasoning for difficult decisions

- [ ] 16. Gate 9 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-9-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-09.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate09.json` and `GPT-5/evidence/gateLine_evidence_Gate09.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 9` and `python GPT-5/scripts/verify_quotes.py 9`
  - Document reasoning for difficult decisions

- [ ] 17. Gate 10 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-10-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-10.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate10.json` and `GPT-5/evidence/gateLine_evidence_Gate10.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 10` and `python GPT-5/scripts/verify_quotes.py 10`
  - Document reasoning for difficult decisions

- [ ] 18. Gate 11 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-11-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-11.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate11.json` and `GPT-5/evidence/gateLine_evidence_Gate11.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 11` and `python GPT-5/scripts/verify_quotes.py 11`
  - Document reasoning for difficult decisions

- [ ] 19. Gate 12 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-12-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-12.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate12.json` and `GPT-5/evidence/gateLine_evidence_Gate12.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 12` and `python GPT-5/scripts/verify_quotes.py 12`
  - Document reasoning for difficult decisions

- [ ] 20. Gate 13 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-13-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-13.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate13.json` and `GPT-5/evidence/gateLine_evidence_Gate13.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 13` and `python GPT-5/scripts/verify_quotes.py 13`
  - Document reasoning for difficult decisions

- [ ] 21. Gate 14 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-14-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-14.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate14.json` and `GPT-5/evidence/gateLine_evidence_Gate14.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 14` and `python GPT-5/scripts/verify_quotes.py 14`
  - Document reasoning for difficult decisions

- [ ] 22. Gate 15 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-15-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-15.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate15.json` and `GPT-5/evidence/gateLine_evidence_Gate15.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 15` and `python GPT-5/scripts/verify_quotes.py 15`
  - Document reasoning for difficult decisions

- [ ] 23. Gate 16 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-16-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-16.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate16.json` and `GPT-5/evidence/gateLine_evidence_Gate16.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 16` and `python GPT-5/scripts/verify_quotes.py 16`
  - Document reasoning for difficult decisions

- [ ] 24. Gate 17 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-17-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-17.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate17.json` and `GPT-5/evidence/gateLine_evidence_Gate17.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 17` and `python GPT-5/scripts/verify_quotes.py 17`
  - Document reasoning for difficult decisions

- [ ] 25. Gate 18 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-18-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-18.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate18.json` and `GPT-5/evidence/gateLine_evidence_Gate18.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 18` and `python GPT-5/scripts/verify_quotes.py 18`
  - Document reasoning for difficult decisions

- [ ] 26. Gate 19 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-19-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-19.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate19.json` and `GPT-5/evidence/gateLine_evidence_Gate19.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 19` and `python GPT-5/scripts/verify_quotes.py 19`
  - Document reasoning for difficult decisions

- [ ] 27. Gate 20 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-20-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-20.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate20.json` and `GPT-5/evidence/gateLine_evidence_Gate20.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 20` and `python GPT-5/scripts/verify_quotes.py 20`
  - Document reasoning for difficult decisions

- [ ] 28. Gate 21 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-21-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-21.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate21.json` and `GPT-5/evidence/gateLine_evidence_Gate21.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 21` and `python GPT-5/scripts/verify_quotes.py 21`
  - Document reasoning for difficult decisions

- [ ] 29. Gate 22 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-22-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-22.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate22.json` and `GPT-5/evidence/gateLine_evidence_Gate22.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 22` and `python GPT-5/scripts/verify_quotes.py 22`
  - Document reasoning for difficult decisions

- [ ] 30. Gate 23 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-23-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-23.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate23.json` and `GPT-5/evidence/gateLine_evidence_Gate23.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 23` and `python GPT-5/scripts/verify_quotes.py 23`
  - Document reasoning for difficult decisions

- [ ] 31. Gate 24 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-24-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-24.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate24.json` and `GPT-5/evidence/gateLine_evidence_Gate24.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 24` and `python GPT-5/scripts/verify_quotes.py 24`
  - Document reasoning for difficult decisions

- [ ] 32. Gate 25 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-25-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-25.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate25.json` and `GPT-5/evidence/gateLine_evidence_Gate25.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 25` and `python GPT-5/scripts/verify_quotes.py 25`
  - Document reasoning for difficult decisions

- [ ] 33. Gate 26 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-26-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-26.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate26.json` and `GPT-5/evidence/gateLine_evidence_Gate26.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 26` and `python GPT-5/scripts/verify_quotes.py 26`
  - Document reasoning for difficult decisions

- [ ] 34. Gate 27 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-27-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-27.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate27.json` and `GPT-5/evidence/gateLine_evidence_Gate27.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 27` and `python GPT-5/scripts/verify_quotes.py 27`
  - Document reasoning for difficult decisions

- [ ] 35. Gate 28 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-28-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-28.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate28.json` and `GPT-5/evidence/gateLine_evidence_Gate28.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 28` and `python GPT-5/scripts/verify_quotes.py 28`
  - Document reasoning for difficult decisions

- [ ] 36. Gate 29 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-29-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-29.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate29.json` and `GPT-5/evidence/gateLine_evidence_Gate29.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 29` and `python GPT-5/scripts/verify_quotes.py 29`
  - Document reasoning for difficult decisions

- [ ] 37. Gate 30 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-30-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-30.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate30.json` and `GPT-5/evidence/gateLine_evidence_Gate30.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 30` and `python GPT-5/scripts/verify_quotes.py 30`
  - Document reasoning for difficult decisions

- [ ] 38. Gate 31 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-31-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-31.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate31.json` and `GPT-5/evidence/gateLine_evidence_Gate31.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 31` and `python GPT-5/scripts/verify_quotes.py 31`
  - Document reasoning for difficult decisions

- [ ] 39. Gate 32 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-32-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-32.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate32.json` and `GPT-5/evidence/gateLine_evidence_Gate32.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 32` and `python GPT-5/scripts/verify_quotes.py 32`
  - Document reasoning for difficult decisions

- [ ] 40. Gate 33 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-33-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-33.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate33.json` and `GPT-5/evidence/gateLine_evidence_Gate33.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 33` and `python GPT-5/scripts/verify_quotes.py 33`
  - Document reasoning for difficult decisions

- [ ] 41. Gate 34 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-34-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-34.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate34.json` and `GPT-5/evidence/gateLine_evidence_Gate34.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 34` and `python GPT-5/scripts/verify_quotes.py 34`
  - Document reasoning for difficult decisions

- [ ] 42. Gate 35 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-35-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-35.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate35.json` and `GPT-5/evidence/gateLine_evidence_Gate35.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 35` and `python GPT-5/scripts/verify_quotes.py 35`
  - Document reasoning for difficult decisions

- [ ] 43. Gate 36 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-36-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-36.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate36.json` and `GPT-5/evidence/gateLine_evidence_Gate36.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 36` and `python GPT-5/scripts/verify_quotes.py 36`
  - Document reasoning for difficult decisions

- [ ] 44. Gate 37 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-37-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-37.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate37.json` and `GPT-5/evidence/gateLine_evidence_Gate37.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 37` and `python GPT-5/scripts/verify_quotes.py 37`
  - Document reasoning for difficult decisions

- [ ] 45. Gate 38 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-38-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-38.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate38.json` and `GPT-5/evidence/gateLine_evidence_Gate38.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 38` and `python GPT-5/scripts/verify_quotes.py 38`
  - Document reasoning for difficult decisions

- [ ] 46. Gate 39 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-39-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-39.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate39.json` and `GPT-5/evidence/gateLine_evidence_Gate39.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 39` and `python GPT-5/scripts/verify_quotes.py 39`
  - Document reasoning for difficult decisions

- [ ] 47. Gate 40 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-40-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-40.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate40.json` and `GPT-5/evidence/gateLine_evidence_Gate40.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 40` and `python GPT-5/scripts/verify_quotes.py 40`
  - Document reasoning for difficult decisions

- [ ] 48. Gate 41 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-41-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-41.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate41.json` and `GPT-5/evidence/gateLine_evidence_Gate41.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 41` and `python GPT-5/scripts/verify_quotes.py 41`
  - Document reasoning for difficult decisions

- [ ] 49. Gate 42 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-42-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-42.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate42.json` and `GPT-5/evidence/gateLine_evidence_Gate42.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 42` and `python GPT-5/scripts/verify_quotes.py 42`
  - Document reasoning for difficult decisions

- [ ] 50. Gate 43 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-43-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-43.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate43.json` and `GPT-5/evidence/gateLine_evidence_Gate43.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 43` and `python GPT-5/scripts/verify_quotes.py 43`
  - Document reasoning for difficult decisions

- [ ] 51. Gate 44 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-44-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-44.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate44.json` and `GPT-5/evidence/gateLine_evidence_Gate44.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 44` and `python GPT-5/scripts/verify_quotes.py 44`
  - Document reasoning for difficult decisions

- [ ] 52. Gate 45 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-45-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-45.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate45.json` and `GPT-5/evidence/gateLine_evidence_Gate45.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 45` and `python GPT-5/scripts/verify_quotes.py 45`
  - Document reasoning for difficult decisions

- [ ] 53. Gate 46 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-46-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-46.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate46.json` and `GPT-5/evidence/gateLine_evidence_Gate46.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 46` and `python GPT-5/scripts/verify_quotes.py 46`
  - Document reasoning for difficult decisions

- [ ] 54. Gate 47 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-47-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-47.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate47.json` and `GPT-5/evidence/gateLine_evidence_Gate47.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 47` and `python GPT-5/scripts/verify_quotes.py 47`
  - Document reasoning for difficult decisions

- [ ] 55. Gate 48 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-48-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-48.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate48.json` and `GPT-5/evidence/gateLine_evidence_Gate48.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 48` and `python GPT-5/scripts/verify_quotes.py 48`
  - Document reasoning for difficult decisions

- [ ] 56. Gate 49 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-49-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-49.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate49.json` and `GPT-5/evidence/gateLine_evidence_Gate49.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 49` and `python GPT-5/scripts/verify_quotes.py 49`
  - Document reasoning for difficult decisions

- [ ] 57. Gate 50 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-50-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-50.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate50.json` and `GPT-5/evidence/gateLine_evidence_Gate50.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 50` and `python GPT-5/scripts/verify_quotes.py 50`
  - Document reasoning for difficult decisions

- [ ] 58. Gate 51 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-51-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-51.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate51.json` and `GPT-5/evidence/gateLine_evidence_Gate51.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 51` and `python GPT-5/scripts/verify_quotes.py 51`
  - Document reasoning for difficult decisions

- [ ] 59. Gate 52 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-52-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-52.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate52.json` and `GPT-5/evidence/gateLine_evidence_Gate52.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 52` and `python GPT-5/scripts/verify_quotes.py 52`
  - Document reasoning for difficult decisions

- [ ] 60. Gate 53 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-53-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-53.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate53.json` and `GPT-5/evidence/gateLine_evidence_Gate53.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 53` and `python GPT-5/scripts/verify_quotes.py 53`
  - Document reasoning for difficult decisions

- [ ] 61. Gate 54 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-54-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-54.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate54.json` and `GPT-5/evidence/gateLine_evidence_Gate54.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 54` and `python GPT-5/scripts/verify_quotes.py 54`
  - Document reasoning for difficult decisions

- [ ] 62. Gate 55 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-55-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-55.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate55.json` and `GPT-5/evidence/gateLine_evidence_Gate55.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 55` and `python GPT-5/scripts/verify_quotes.py 55`
  - Document reasoning for difficult decisions

- [ ] 63. Gate 56 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-56-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-56.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate56.json` and `GPT-5/evidence/gateLine_evidence_Gate56.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 56` and `python GPT-5/scripts/verify_quotes.py 56`
  - Document reasoning for difficult decisions

- [ ] 64. Gate 57 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-57-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-57.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate57.json` and `GPT-5/evidence/gateLine_evidence_Gate57.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 57` and `python GPT-5/scripts/verify_quotes.py 57`
  - Document reasoning for difficult decisions

- [ ] 65. Gate 58 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-58-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-58.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate58.json` and `GPT-5/evidence/gateLine_evidence_Gate58.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 58` and `python GPT-5/scripts/verify_quotes.py 58`
  - Document reasoning for difficult decisions

- [ ] 66. Gate 59 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-59-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-59.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate59.json` and `GPT-5/evidence/gateLine_evidence_Gate59.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 59` and `python GPT-5/scripts/verify_quotes.py 59`
  - Document reasoning for difficult decisions

- [ ] 67. Gate 60 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-60-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-60.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate60.json` and `GPT-5/evidence/gateLine_evidence_Gate60.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 60` and `python GPT-5/scripts/verify_quotes.py 60`
  - Document reasoning for difficult decisions

- [ ] 68. Gate 61 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-61-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-61.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate61.json` and `GPT-5/evidence/gateLine_evidence_Gate61.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 61` and `python GPT-5/scripts/verify_quotes.py 61`
  - Document reasoning for difficult decisions

- [ ] 69. Gate 62 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-62-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-62.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate62.json` and `GPT-5/evidence/gateLine_evidence_Gate62.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 62` and `python GPT-5/scripts/verify_quotes.py 62`
  - Document reasoning for difficult decisions

- [ ] 70. Gate 63 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-63-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-63.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate63.json` and `GPT-5/evidence/gateLine_evidence_Gate63.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 63` and `python GPT-5/scripts/verify_quotes.py 63`
  - Document reasoning for difficult decisions

- [ ] 71. Gate 64 Analysis & Scoring
  - Read `GPT-5/combined-baselines-4.2.json` (star system baselines)
  - Read `claude/Full Pass/gate-64-full.json` (Line Companion - primary source)
  - Read `claude/I-Ching-Full-Pass/hexagram-64.json` (Legge I Ching - cross-reference)
  - Analyze all 6 lines individually (HD first, then Legge cross-check)
  - Assign weights (0.00-0.95, increments of 0.01) and extract evidence (sparse format, top 1-2 systems)
  - Apply mechanical constraints (top-2, pairwise exclusions, canonical ordering, polarity when ≥0.40)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate64.json` and `GPT-5/evidence/gateLine_evidence_Gate64.json`
  - Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py 64` and `python GPT-5/scripts/verify_quotes.py 64`
  - Document reasoning for difficult decisions

## Phase 4: Validation & Quality Assurance (Tasks 72-74)

- [ ] 72. Full Validation Pass
  - Run all validation scripts (7.1 + 7.2) across all 64 gates in `GPT-5/star-maps/` and `GPT-5/evidence/`
  - Generate comprehensive validation report
  - Verify all 384 lines processed correctly
  - Confirm zero validation failures
  - _Requirements: 7.1-7.5_

- [ ] 73. Master File Generation & Analysis
  
  - [ ] 73.1 Merge script implementation
    - Create script to merge all weight files from `GPT-5/star-maps/` into master
    - Create script to merge all evidence files from `GPT-5/evidence/` into master
    - Validate merged outputs against schemas
    - Sort by gate and line
    - _Requirements: 6.1, 6.2, 6.6_

  - [ ] 73.2 Generate master files
    - Run merge script on all 64 gates
    - Generate `GPT-5/gateLine_star_map_MASTER.json`
    - Generate `GPT-5/gateLine_evidence_MASTER.json`
    - Validate master files
    - _Requirements: 6.1, 6.2_

  - [ ] 73.3 Statistics generation
    - Compute weight distribution per system
    - Calculate average weights per system
    - Identify most/least common systems
    - Analyze confidence level distribution
    - Find lines with highest/lowest total weights
    - Check Orion Light vs Orion Dark co-occurrence
    - Generate statistics report
    - _Requirements: 1.5_

  - [ ] 73.4 Evidence Quality Heuristics Report
    - Generate `GPT-5/quality_report.json` flagging:
      - High weight (>0.40) + low confidence (≤2 on 1-5 scale)
      - Near-tie weights (top 2 systems within 0.05)
      - Unusual system distributions (e.g., all 8 systems present)
      - Repeated generic quotes across multiple gates
      - Frequent caps at 0.50 weight
    - Output JSON + Markdown summary for human review
    - _Requirements: 2.4, 7.5_

- [ ] 74. Comparison Analysis (v1 vs v2)
  - Compare new GPT-5 weights to existing lore-research mappings
  - Source v1: `lore-research/research-outputs/star-mapping-by-gate/gate-*.json`
  - Source v2: `GPT-5/star-maps/gateLine_star_map_Gate*.json`
  - Calculate per-system weight deltas
  - Identify significant changes
  - Document systems added/removed from top-2
  - Note confidence shifts
  - Assess evidence quality improvements (v2 has quotes, v1 doesn't)
  - Include baseline fingerprint:
    - Baseline beacon hash from `GPT-5/combined-baselines-4.2.json`
  - Generate comparison report
  - _Requirements: 2.3, 2.4_

## Phase 5: Documentation & Deployment (Tasks 75-78)

- [ ] 75. Documentation
  
  - [ ] 75.1 README documentation
    - Write overview of the scoring system
    - Document Kiro's analytical approach
    - Explain input files and output format
    - Note difference between v1 (lore-research) and v2 (GPT-5) formats
    - Provide examples from Gate 01
    - _Requirements: All_

  - [ ] 75.2 Methodology documentation
    - Document scoring theory
    - Explain quick_rules application as primary discriminators
    - Describe pairwise exclusion rationale
    - Document how to use combined baselines file
    - _Requirements: 2.3, 4.1-4.6_

  - [ ] 75.3 Analysis guide
    - Document workflow for analyzing each gate
    - Explain how to read combined baselines effectively
    - Provide tips for identifying behavioral matches
    - Add "Common Quote Validation Pitfalls" appendix (reference Task 7.4)
    - Provide troubleshooting guidance
    - _Requirements: 8.1_

- [ ] 76. CI Pipeline Integration
  - Create GitHub Actions workflow
  - Add baseline beacon computation step
  - Add matrix job to run both validators (7.1 + 7.2) across all gates in `GPT-5/star-maps/` and `GPT-5/evidence/`
  - Add validation script execution (fail on any error)
  - Add quote verification step
  - Add merge and statistics generation
  - Add job to compute/print baseline beacon from `GPT-5/combined-baselines-4.2.json`
  - Configure to fail PR on any violation
  - Test CI pipeline end-to-end
  - _Requirements: 1.2, 1.3, 7.1-7.5_

- [ ] 77. Human QA Workflow (Optional)
  - Define lightweight review pass for flagged gates
  - Input: quality_report.json from Task 73.4
  - Output: accept/fix notes
  - Create small CLI or UI to navigate flagged issues
  - Document review criteria and process
  - _Requirements: 7.5_

- [ ] 78. Consistency Check
  - Periodically review a sample of gates for consistency
  - Check that similar themes across gates receive similar star system assignments
  - Verify pairwise exclusion rules are applied consistently
  - Document any patterns or edge cases discovered
  - _Requirements: 8.5_

---

## Task Dependencies

```
Phase 1 (1-7.2) ✅ → Phase 2 (7.3-7.6) → Phase 3 (8-71) → Phase 4 (72-74) → Phase 5 (75-78)
                                              ↓
                                       Kiro analyzes each gate
                                       Uses combined baselines
                                       Uses validators (7.1, 7.2)
```

## Notes

- **Completed through Task 7.2**: Foundation and core validation scripts are done ✅
- **Phase 3 approach**: Kiro performs manual analysis (not automated batch processing)
- **Input files**: Use `GPT-5/combined-baselines-4.2.json` for star system baselines
- **Output format**: GPT-5 sparse format (see `GPT-5/star-maps/gateLine_star_map_Gate01.json` as example)
- **Reference files**: `lore-research/research-outputs/star-mapping-by-gate/` are v1 (exploratory) - can be consulted but NOT the target format
- **Quality gates**: Tasks 73.4 and 78 add quality checks to catch issues early
- **Total gates**: 64 gates × 6 lines = 384 individual line analyses

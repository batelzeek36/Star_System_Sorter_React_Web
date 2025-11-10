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

- [ ] 7.3 Invariant fuzz testing script
  - Test all pairwise exclusion rules across sample data
  - Generate invariants report
  - _Requirements: 4.1-4.6, 7.4_

- [ ] 7.4 Quote Rules Reference Document
  - Create `GPT-5/docs/QUOTE_VALIDATION_RULES.md`
  - Consolidate word count rules, normalization policy, locator formats
  - Document error patterns and CI-style error messages
  - Reference from both validation script and documentation
  - _Requirements: 2.1, 2.2, 7.2_

- [ ] 7.5 Model Parameter Lockfile & Run Manifest
  - Create `GPT-5/run-manifest-template.yaml` with:
    - Model name and version
    - Temperature, top_p, seed (if supported)
    - Prompt template revision/hash
    - Baseline beacon fingerprint
    - Timestamp and run metadata
  - Document usage in batch orchestrator
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

**Approach:** Kiro reads and analyzes each gate individually, comparing gate/hexagram content against star system baselines to assign weights and extract evidence.

**Input Files (per gate):**
- Star system baselines: `GPT-5/combined-baselines-4.2.json` (all 8 systems consolidated)
- Gate data: `s3-data/gates/{N}.json`
- Hexagram data: `s3-data/hexagrams/{N}.json`
- Line Companion data: `claude/Full Pass/gate-{N}-full.json` (for Line Companion quotes)
- Reference (optional): `lore-research/research-outputs/star-mapping-by-gate/gate-{N}.json` (v1 format, for comparison only)

**Output Format (production-ready sparse format):**
- Star map: `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json` (see Gate01 as example)
- Evidence: `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`
- Format: Top 1-2 systems only per line, with behavioral_match, keywords, confidence

**Workflow (per gate):**
1. Read `GPT-5/combined-baselines-4.2.json` - focus on `core_themes`, `shadow_themes`, `quick_rules`, `notes_for_alignment`
2. Read gate and hexagram files
3. For each of 6 lines:
   - Read Line Companion text from `claude/Full Pass/gate-{N}-full.json`
   - Read Legge I Ching text from hexagram file
   - Compare themes against star system characteristics
   - Use `quick_rules` as primary discriminators
   - Identify top 1-2 star systems with strongest resonance
   - Assign weights (0.00-1.00 scale, typically 0.65-0.85 for primary, 0.30-0.55 for secondary)
   - Apply pairwise exclusion rules (Pleiades/Draco, Orion Light/Dark, etc.)
   - Extract verbatim quotes (≤25 words) from Legge and/or Line Companion
   - **Important:** Legge quotes MUST be from same line when weight >0.50
   - Document behavioral_match, keywords, confidence (1-5 scale, where 1=low, 5=high)
   - **Tie-breaker:** If weights are equal, order systems by canonical order (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco)
4. Calculate `sum_unorm` (sum of all weights across all 6 lines) and include in `_meta`
5. Set `generator: "Kiro"` in `_meta`
6. Generate output files in GPT-5 sparse format
7. Run validation scripts: `python GPT-5/scripts/validate_gate_outputs.py` and `python GPT-5/scripts/verify_quotes.py`
8. Fix any validation errors
9. Document any difficult decisions or edge cases

**Note on Reference Files:**
- Files in `lore-research/research-outputs/star-mapping-by-gate/` are v1 (exploratory, verbose, all 8 systems)
- They can be consulted for comparison but are NOT the target format
- GPT-5 format is production-ready (sparse, top 1-2 only, with evidence)

---

- [ ] 8. Gate 1 Analysis & Scoring
  - Read combined baselines, gate, and hexagram files
  - Analyze all 6 lines individually
  - Assign weights and extract evidence (sparse format)
  - Generate `GPT-5/star-maps/gateLine_star_map_Gate01.json` and `GPT-5/evidence/gateLine_evidence_Gate01.json`
  - Run validation scripts (7.1 + 7.2)
  - Document reasoning for difficult decisions
  - _Note: Gate 1 already has content - review and refine if needed_

- [ ] 9. Gate 2 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 2 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate02.json`, `GPT-5/evidence/gateLine_evidence_Gate02.json`

- [ ] 10. Gate 3 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 3 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate03.json`, `GPT-5/evidence/gateLine_evidence_Gate03.json`

- [ ] 11. Gate 4 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 4 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate04.json`, `GPT-5/evidence/gateLine_evidence_Gate04.json`

- [ ] 12. Gate 5 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 5 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate05.json`, `GPT-5/evidence/gateLine_evidence_Gate05.json`

- [ ] 13. Gate 6 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 6 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate06.json`, `GPT-5/evidence/gateLine_evidence_Gate06.json`

- [ ] 14. Gate 7 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 7 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate07.json`, `GPT-5/evidence/gateLine_evidence_Gate07.json`

- [ ] 15. Gate 8 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 8 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate08.json`, `GPT-5/evidence/gateLine_evidence_Gate08.json`

- [ ] 16. Gate 9 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 9 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate09.json`, `GPT-5/evidence/gateLine_evidence_Gate09.json`

- [ ] 17. Gate 10 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 10 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate10.json`, `GPT-5/evidence/gateLine_evidence_Gate10.json`

- [ ] 18. Gate 11 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 11 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate11.json`, `GPT-5/evidence/gateLine_evidence_Gate11.json`

- [ ] 19. Gate 12 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 12 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate12.json`, `GPT-5/evidence/gateLine_evidence_Gate12.json`

- [ ] 20. Gate 13 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 13 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate13.json`, `GPT-5/evidence/gateLine_evidence_Gate13.json`

- [ ] 21. Gate 14 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 14 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate14.json`, `GPT-5/evidence/gateLine_evidence_Gate14.json`

- [ ] 22. Gate 15 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 15 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate15.json`, `GPT-5/evidence/gateLine_evidence_Gate15.json`

- [ ] 23. Gate 16 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 16 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate16.json`, `GPT-5/evidence/gateLine_evidence_Gate16.json`

- [ ] 24. Gate 17 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 17 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate17.json`, `GPT-5/evidence/gateLine_evidence_Gate17.json`

- [ ] 25. Gate 18 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 18 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate18.json`, `GPT-5/evidence/gateLine_evidence_Gate18.json`

- [ ] 26. Gate 19 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 19 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate19.json`, `GPT-5/evidence/gateLine_evidence_Gate19.json`

- [ ] 27. Gate 20 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 20 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate20.json`, `GPT-5/evidence/gateLine_evidence_Gate20.json`

- [ ] 28. Gate 21 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 21 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate21.json`, `GPT-5/evidence/gateLine_evidence_Gate21.json`

- [ ] 29. Gate 22 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 22 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate22.json`, `GPT-5/evidence/gateLine_evidence_Gate22.json`

- [ ] 30. Gate 23 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 23 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate23.json`, `GPT-5/evidence/gateLine_evidence_Gate23.json`

- [ ] 31. Gate 24 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 24 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate24.json`, `GPT-5/evidence/gateLine_evidence_Gate24.json`

- [ ] 32. Gate 25 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 25 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate25.json`, `GPT-5/evidence/gateLine_evidence_Gate25.json`

- [ ] 33. Gate 26 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 26 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate26.json`, `GPT-5/evidence/gateLine_evidence_Gate26.json`

- [ ] 34. Gate 27 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 27 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate27.json`, `GPT-5/evidence/gateLine_evidence_Gate27.json`

- [ ] 35. Gate 28 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 28 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate28.json`, `GPT-5/evidence/gateLine_evidence_Gate28.json`

- [ ] 36. Gate 29 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 29 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate29.json`, `GPT-5/evidence/gateLine_evidence_Gate29.json`

- [ ] 37. Gate 30 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 30 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate30.json`, `GPT-5/evidence/gateLine_evidence_Gate30.json`

- [ ] 38. Gate 31 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 31 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate31.json`, `GPT-5/evidence/gateLine_evidence_Gate31.json`

- [ ] 39. Gate 32 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 32 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate32.json`, `GPT-5/evidence/gateLine_evidence_Gate32.json`

- [ ] 40. Gate 33 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 33 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate33.json`, `GPT-5/evidence/gateLine_evidence_Gate33.json`

- [ ] 41. Gate 34 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 34 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate34.json`, `GPT-5/evidence/gateLine_evidence_Gate34.json`

- [ ] 42. Gate 35 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 35 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate35.json`, `GPT-5/evidence/gateLine_evidence_Gate35.json`

- [ ] 43. Gate 36 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 36 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate36.json`, `GPT-5/evidence/gateLine_evidence_Gate36.json`

- [ ] 44. Gate 37 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 37 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate37.json`, `GPT-5/evidence/gateLine_evidence_Gate37.json`

- [ ] 45. Gate 38 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 38 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate38.json`, `GPT-5/evidence/gateLine_evidence_Gate38.json`

- [ ] 46. Gate 39 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 39 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate39.json`, `GPT-5/evidence/gateLine_evidence_Gate39.json`

- [ ] 47. Gate 40 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 40 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate40.json`, `GPT-5/evidence/gateLine_evidence_Gate40.json`

- [ ] 48. Gate 41 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 41 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate41.json`, `GPT-5/evidence/gateLine_evidence_Gate41.json`

- [ ] 49. Gate 42 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 42 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate42.json`, `GPT-5/evidence/gateLine_evidence_Gate42.json`

- [ ] 50. Gate 43 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 43 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate43.json`, `GPT-5/evidence/gateLine_evidence_Gate43.json`

- [ ] 51. Gate 44 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 44 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate44.json`, `GPT-5/evidence/gateLine_evidence_Gate44.json`

- [ ] 52. Gate 45 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 45 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate45.json`, `GPT-5/evidence/gateLine_evidence_Gate45.json`

- [ ] 53. Gate 46 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 46 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate46.json`, `GPT-5/evidence/gateLine_evidence_Gate46.json`

- [ ] 54. Gate 47 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 47 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate47.json`, `GPT-5/evidence/gateLine_evidence_Gate47.json`

- [ ] 55. Gate 48 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 48 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate48.json`, `GPT-5/evidence/gateLine_evidence_Gate48.json`

- [ ] 56. Gate 49 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 49 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate49.json`, `GPT-5/evidence/gateLine_evidence_Gate49.json`

- [ ] 57. Gate 50 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 50 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate50.json`, `GPT-5/evidence/gateLine_evidence_Gate50.json`

- [ ] 58. Gate 51 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 51 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate51.json`, `GPT-5/evidence/gateLine_evidence_Gate51.json`

- [ ] 59. Gate 52 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 52 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate52.json`, `GPT-5/evidence/gateLine_evidence_Gate52.json`

- [ ] 60. Gate 53 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 53 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate53.json`, `GPT-5/evidence/gateLine_evidence_Gate53.json`

- [ ] 61. Gate 54 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 54 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate54.json`, `GPT-5/evidence/gateLine_evidence_Gate54.json`

- [ ] 62. Gate 55 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 55 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate55.json`, `GPT-5/evidence/gateLine_evidence_Gate55.json`

- [ ] 63. Gate 56 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 56 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate56.json`, `GPT-5/evidence/gateLine_evidence_Gate56.json`

- [ ] 64. Gate 57 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 57 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate57.json`, `GPT-5/evidence/gateLine_evidence_Gate57.json`

- [ ] 65. Gate 58 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 58 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate58.json`, `GPT-5/evidence/gateLine_evidence_Gate58.json`

- [ ] 66. Gate 59 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 59 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate59.json`, `GPT-5/evidence/gateLine_evidence_Gate59.json`

- [ ] 67. Gate 60 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 60 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate60.json`, `GPT-5/evidence/gateLine_evidence_Gate60.json`

- [ ] 68. Gate 61 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 61 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate61.json`, `GPT-5/evidence/gateLine_evidence_Gate61.json`

- [ ] 69. Gate 62 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 62 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate62.json`, `GPT-5/evidence/gateLine_evidence_Gate62.json`

- [ ] 70. Gate 63 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 63 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate63.json`, `GPT-5/evidence/gateLine_evidence_Gate63.json`

- [ ] 71. Gate 64 Analysis & Scoring
  - Follow workflow in `.kiro/steering/gate-scoring-workflow.md`
  - Gate: 64 | Outputs: `GPT-5/star-maps/gateLine_star_map_Gate64.json`, `GPT-5/evidence/gateLine_evidence_Gate64.json`

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

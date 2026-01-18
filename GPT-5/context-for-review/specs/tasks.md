# Implementation Plan

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
  - _Requirements: 8.1_a

- [ ] 6. Context Packing Script
  - Implement script to inline baseline, gate, and hexagram files into prompts
  - Ensure packed prompts are self-contained and ready to use
  - Test with Gate 1 prompt
  - _Requirements: 5.1-5.3, 8.1_

- [ ] 7. Validation Script Suite
- [ ] 7.1 Core validation script
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

- [ ] 7.2 Quote verification script
  - Implement verbatim quote checking against source files
  - Add 25-word length validation
  - Add Legge same-line verification (MUST be from same line number) for weights >0.50
  - Verify Line Companion quotes are verbatim (may be from any line in gate)
  - _Requirements: 2.1, 2.2, 2.6, 7.2, 7.5_

- [ ] 7.3 Invariant fuzz testing script
  - Test all pairwise exclusion rules across sample data
  - Generate invariants report
  - _Requirements: 4.1-4.6, 7.4_

- [ ] 8. Batch 1 Processing (Gates 1-8)
  - Generate packed prompts for gates 1-8
  - Process each gate through LLM
  - Save weight and evidence files
  - Run validation scripts on all outputs
  - Test non-determinism by re-running Gate 1 and comparing hashes
  - Generate batch validation report
  - _Requirements: 1.1, 8.1-8.5_

- [ ] 9. Batch 2 Processing (Gates 9-16)
  - Process gates 9-16 using validated workflow
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 10. Batch 3 Processing (Gates 17-24)
  - Process gates 17-24
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 11. Batch 4 Processing (Gates 25-32)
  - Process gates 25-32
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 12. Batch 5 Processing (Gates 33-40)
  - Process gates 33-40
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 13. Batch 6 Processing (Gates 41-48)
  - Process gates 41-48
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 14. Batch 7 Processing (Gates 49-56)
  - Process gates 49-56
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 15. Batch 8 Processing (Gates 57-64)
  - Process gates 57-64
  - Run validation scripts
  - Generate batch validation report
  - _Requirements: 8.1-8.5_

- [ ] 16. Full Validation Pass
  - Run all validation scripts across all 64 gates
  - Generate comprehensive validation report
  - Verify all 384 lines processed correctly
  - Confirm zero validation failures
  - _Requirements: 7.1-7.5_

- [ ] 17. Master File Generation
- [ ] 17.1 Merge script implementation
  - Create script to merge all weight files into master
  - Create script to merge all evidence files into master
  - Validate merged outputs against schemas
  - Sort by gate and line
  - _Requirements: 6.1, 6.2, 6.6_

- [ ] 17.2 Generate master files
  - Run merge script on all 64 gates
  - Generate gateLine_star_map_MASTER.json
  - Generate gateLine_evidence_MASTER.json
  - Validate master files
  - _Requirements: 6.1, 6.2_

- [ ] 17.3 Statistics generation
  - Compute weight distribution per system
  - Calculate average weights per system
  - Identify most/least common systems
  - Analyze confidence level distribution
  - Find lines with highest/lowest total weights
  - Check Orion Light vs Orion Dark co-occurrence
  - Generate statistics report
  - _Requirements: 1.5_

- [ ] 18. Comparison Analysis
  - Compare new weights to existing mappings
  - Calculate per-system weight deltas
  - Identify significant changes
  - Document systems added/removed from top-2
  - Note confidence shifts
  - Assess evidence quality improvements
  - Generate comparison report
  - _Requirements: 2.3, 2.4_

- [ ] 19. Documentation
- [ ] 19.1 README documentation
  - Write overview of the scoring system
  - Document usage instructions
  - Provide examples
  - _Requirements: All_

- [ ] 19.2 Methodology documentation
  - Document scoring theory
  - Explain quick_rules application
  - Describe pairwise exclusion rationale
  - _Requirements: 2.3, 4.1-4.6_

- [ ] 19.3 Prompt guide
  - Document how to run prompts
  - Explain how to modify prompts
  - Provide troubleshooting guidance
  - _Requirements: 8.1_

- [ ] 20. CI Pipeline Integration
  - Create GitHub Actions workflow
  - Add baseline beacon computation step
  - Add validation script execution
  - Add quote verification step
  - Add merge and statistics generation
  - Configure to fail PR on any violation
  - Test CI pipeline end-to-end
  - _Requirements: 1.2, 1.3, 7.1-7.5_

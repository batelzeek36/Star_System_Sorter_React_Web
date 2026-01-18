# Requirements Document

## Introduction

This feature generates deterministic star system weights for all 384 gate.line combinations (64 gates × 6 lines each) in the Human Design system. The system scores Human Design Line Companion text and I Ching Legge text against 8 star system baselines to produce academically rigorous, evidence-based weights with proper source citations. The output format integrates directly with the existing Star System Sorter runtime scorer.

## Glossary

- **Gate**: One of 64 positions in the Human Design bodygraph, corresponding to I Ching hexagrams
- **Line**: One of 6 sub-positions within each gate (gate.line notation, e.g., "01.1")
- **Star System**: One of 8 archetypal classification systems (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco)
- **Weight**: Numerical score (0.0-0.95) indicating alignment strength between a gate.line and star system
- **Baseline**: Reference document defining core themes, shadow themes, and quick rules for each star system
- **Baseline Beacon**: SHA256 hash (first 8 characters) of the baseline file, computed at runtime by `compute_beacon.py`, ensuring deterministic scoring
- **Top-2 Constraint**: Maximum of 2 star systems with non-zero weights per line
- **Pairwise Exclusion**: Hard rules preventing incompatible star systems from both scoring >0 on the same line
- **Evidence File**: JSON document containing verbatim quotes and justifications for assigned weights
- **Line Companion**: Human Design text source by Ra Uru Hu
- **Legge I Ching**: Classical I Ching translation by James Legge (1899)

## Requirements

### Requirement 1: Deterministic Weight Generation

**User Story:** As a researcher, I want the same input data to always produce identical weights, so that results are reproducible and scientifically valid.

#### Acceptance Criteria

1. WHEN THE Scoring_System processes gate.line text with a locked baseline, THE Scoring_System SHALL produce identical weight values across multiple runs
2. THE Scoring_System SHALL include a baseline_beacon field in all output files that matches the SHA256 hash (first 8 characters) of the baseline file, computed at runtime
3. THE Scoring_System SHALL use sparse format (only non-zero weights included in output), WHERE missing systems are treated as weight 0.00 by the runtime scorer
3. THE Scoring_System SHALL fail validation IF the baseline_beacon does not match the expected locked value
4. THE Scoring_System SHALL generate weights as multiples of 0.01 within the range 0.0 to 0.95
4. THE Scoring_System SHALL compute and include sum_unorm (sum of all non-zero weights across all 6 lines in the file) in the metadata block

### Requirement 2: Academic Rigor and Evidence

**User Story:** As a researcher, I want all weight assignments to be supported by verbatim source quotes and clear justifications, so that scoring decisions are transparent and auditable.

#### Acceptance Criteria

1. THE Scoring_System SHALL extract verbatim quotes of 25 words or fewer from source texts
2. THE Scoring_System SHALL include source attribution (Legge 1899 or Line Companion) for all quotes
3. THE Scoring_System SHALL provide a "why" field citing specific baseline themes or quick_rules for each non-zero weight
4. THE Scoring_System SHALL assign confidence levels (1-5) based on textual clarity and match strength
5. IF a weight exceeds 0.50, THEN THE Scoring_System SHALL include a Legge quote from the same line number, ELSE THE Scoring_System SHALL cap the weight at 0.50
6. THE Scoring_System SHALL allow Line Companion quotes from any line within the gate (line-agnostic), WHILE Legge quotes MUST be from the same line number

### Requirement 3: Top-2 Constraint Enforcement

**User Story:** As a system designer, I want each gate.line to map to at most 2 star systems, so that classifications remain clear and avoid "mud" (everything scores a little).

#### Acceptance Criteria

1. THE Scoring_System SHALL assign non-zero weights to a maximum of 2 star systems per line
2. THE Scoring_System SHALL set all other star systems to exactly 0.0 for that line
3. THE Scoring_System SHALL sort systems by weight in descending order within each line
4. THE Scoring_System SHALL fail validation IF more than 2 systems have weight >0 for any line
5. THE Scoring_System SHALL use canonical system order to break ties when weights are equal

### Requirement 4: Pairwise Exclusion Rules

**User Story:** As a system designer, I want incompatible star system archetypes to be mutually exclusive, so that scoring reflects archetypal coherence.

#### Acceptance Criteria

1. IF Pleiades weight >0, THEN THE Scoring_System SHALL set Draco weight to 0 (unless text clearly shows both care and enforcement, in which case keep only one using quick_rules)
2. IF Sirius weight ≥0.60, THEN THE Scoring_System SHALL cap Orion Light weight at 0.35
3. IF Andromeda weight ≥0.60, THEN THE Scoring_System SHALL set Orion Dark weight to 0
4. IF Arcturus weight >0, THEN THE Scoring_System SHALL set Pleiades weight to 0
5. IF Lyra weight >0, THEN THE Scoring_System SHALL set Draco weight to 0
6. IF both Orion Light and Orion Dark match, THEN THE Scoring_System SHALL down-rank one to ≤0.35 or set to 0 using quick_rules

### Requirement 5: Complete Text Processing

**User Story:** As a researcher, I want scoring to use complete source texts rather than summaries, so that nuanced meanings are preserved.

#### Acceptance Criteria

1. THE Scoring_System SHALL read the complete Line Companion text for each gate.line
2. THE Scoring_System SHALL read the complete Legge I Ching text for each gate.line
3. THE Scoring_System SHALL read all 8 star system baselines including core_themes, shadow_themes, and quick_rules
4. THE Scoring_System SHALL score using full text BEFORE extracting evidence quotes
5. THE Scoring_System SHALL extract evidence quotes to justify scores, not to constrain scoring decisions

### Requirement 6: Output File Structure

**User Story:** As a developer, I want output files to follow a consistent schema with proper metadata, so that runtime integration is seamless.

#### Acceptance Criteria

1. THE Scoring_System SHALL generate weight files at path GPT-5/star-maps/gateLine_star_map_Gate{NN}.json
2. THE Scoring_System SHALL generate evidence files at path GPT-5/evidence/gateLine_evidence_Gate{NN}.json
3. THE Scoring_System SHALL include a _meta block with version, baseline_beacon, gate, generated_at, generator, and sum_unorm
4. THE Scoring_System SHALL use zero-padded gate numbers in filenames and keys (e.g., "01" not "1")
5. THE Scoring_System SHALL use canonical star system names with proper case and spacing in all outputs (e.g., "Orion Light" with space, not "Orion-Light" with hyphen or "orion-light" lowercase)
6. THE Scoring_System SHALL sort line keys in ascending order ("01.1", "01.2", ..., "01.6")

### Requirement 7: Quality Gates and Validation

**User Story:** As a quality assurance engineer, I want automated validation to catch errors immediately, so that invalid outputs never reach production.

#### Acceptance Criteria

1. THE Scoring_System SHALL abort with error message IF any required input file is missing
2. THE Scoring_System SHALL abort with error message IF any quote exceeds 25 words
3. THE Scoring_System SHALL abort with error message IF more than 2 systems have weight >0 for any line
4. THE Scoring_System SHALL abort with error message IF pairwise exclusion rules are violated
5. THE Scoring_System SHALL abort with error message IF weight >0.50 lacks a Legge quote from the same line

### Requirement 8: Batch Processing

**User Story:** As a researcher, I want to process all 64 gates efficiently, so that the complete dataset can be generated in a reasonable timeframe.

#### Acceptance Criteria

1. THE Scoring_System SHALL process all 6 lines of a gate in a single manual analysis session
2. THE Scoring_System SHALL generate both weight and evidence files for each gate
3. THE Scoring_System SHALL validate outputs immediately after generation
4. THE Scoring_System SHALL produce batch validation reports for groups of 8 gates
5. THE Scoring_System SHALL detect non-determinism by comparing hash values of repeated runs

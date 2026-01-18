# Requirements Document

## Introduction

This spec defines tooling to support the manual scoring workflow for Human Design charts against the 8 star systems. The manual scoring process creates ground truth data by having the domain expert (who has 862-1,656 hours of research) manually analyze their own chart and others' charts. This ground truth serves as the gold standard for validating automated scoring systems and calibrating the methodology.

## Glossary

- **Manual Scoring**: The process of a domain expert manually analyzing Human Design activations against star systems to create ground truth data
- **Activation**: A gate-line combination from a Human Design chart (e.g., "13.1" means Gate 13, Line 1)
- **Star Map**: JSON file containing weights and behavioral matches for gate-line to star system mappings
- **Evidence File**: JSON file containing quotes, keywords, and reasoning for each mapping
- **Ground Truth**: Manually scored data that serves as the reference standard for validation
- **Sparse Format**: Only including entries with weight > 0.0 in output files
- **Weight**: A numerical score (0.00-0.95) indicating alignment strength between a gate-line and star system
- **Polarity**: Whether an activation expresses as "core" (healthy) or "shadow" (distorted)
- **Diagnostics File**: Sidecar file containing near-misses (0.30-0.39) and constraint triggers for training data
- **Rubric**: Calibrated weight scale with anchored examples defining what each weight range means
- **CLI Tool**: Command-line interface for manual scoring workflow (no UI to be built)

## Requirements

### Requirement 1: Chart Data Extraction

**User Story:** As a domain expert, I want to extract my Human Design chart activations from the BodyGraph API or manual entry, so that I have the raw data to begin manual scoring.

#### Acceptance Criteria

1. WHEN THE domain expert provides birth data (date, time, location, IANA timezone), THE Chart Extraction CLI SHALL retrieve the Human Design chart from the BodyGraph API
2. WHEN THE API response is received, THE Chart Extraction CLI SHALL parse and extract all 26 activations (13 Personality + 13 Design)
3. WHEN THE activations are extracted, THE Chart Extraction CLI SHALL save them to a structured JSON file at `GPT-5/manual-scoring/my-chart-raw.json` with SHA-256 hashes of all source files
4. WHERE THE BodyGraph API is unavailable, THE Chart Extraction CLI SHALL provide a manual entry prompt for recording activations
5. WHEN THE chart data is saved, THE Chart Extraction CLI SHALL validate that timezone is in IANA format (e.g., America/New_York) and all required fields are present

### Requirement 2: Scoring Workspace Setup

**User Story:** As a domain expert, I want an automated workspace setup with calibration rubric and schemas, so that I have the correct directory structure and reference materials ready for manual scoring.

#### Acceptance Criteria

1. WHEN THE domain expert initiates workspace setup, THE Setup CLI SHALL create the directory structure at `GPT-5/manual-scoring/` with subdirectories for notes, star-maps, evidence, and diagnostics
2. WHEN THE directories are created, THE Setup CLI SHALL generate JSON schemas (star_map.schema.json, evidence.schema.json) with weight validation, role enums, polarity requirements, and quote length limits
3. WHEN THE schemas are generated, THE Setup CLI SHALL create a Rubric.md with 5 calibrated weight bands (0.80-0.95, 0.65-0.79, 0.50-0.64, 0.40-0.49, <0.40) and 1-2 example activations per band
4. WHEN THE rubric is created, THE Setup CLI SHALL create invariant_rationale.md documenting why each of the 6 pairwise caps exists
5. WHEN THE workspace is ready, THE Setup CLI SHALL create a Fair-Use note with exact citation formats for ≤25-word quotes
6. WHEN THE setup completes, THE Setup CLI SHALL record SHA-256 hashes for all source files (baselines, LC, Legge) in _meta.sources

### Requirement 3: CLI Scoring Workflow

**User Story:** As a domain expert, I want a CLI-based scoring workflow with optional blind mode, so that I can efficiently analyze gate-lines against all 8 star systems without expectancy bias.

#### Acceptance Criteria

1. WHEN THE domain expert selects an activation to score, THE Scoring CLI SHALL display the Line Companion text and Legge I Ching text for that gate-line
2. WHERE THE domain expert enables blind mode, THE Scoring CLI SHALL display star systems as "System A…H" during evidence pass to reduce expectancy bias
3. WHEN THE domain expert assigns a weight to a star system, THE Scoring CLI SHALL validate against the JSON schema (0.00-0.95, multipleOf 0.01)
4. WHEN THE domain expert assigns a weight, THE Scoring CLI SHALL prompt for separate "textual_evidence_weight" and optional "intuition_adjustment" (bounded ±0.05)
5. WHEN THE intuition adjustment is provided, THE Scoring CLI SHALL require a reason for the adjustment
6. WHEN THE domain expert completes scoring for an activation, THE Scoring CLI SHALL validate all mechanical constraints and save both star-map and diagnostics files
7. WHEN THE diagnostics file is saved, THE Scoring CLI SHALL include near-misses (0.30-0.39) and which pairwise constraints triggered

### Requirement 4: Source Material Display

**User Story:** As a domain expert, I want CLI-based source material display with provenance tracking, so that I can reference Line Companion, Legge, and baseline texts with full edition information.

#### Acceptance Criteria

1. WHEN THE domain expert is scoring an activation, THE Scoring CLI SHALL display the full Line Companion text for the current gate with the current line highlighted
2. WHEN THE Line Companion is displayed, THE Scoring CLI SHALL show edition and attribution metadata (Ra Uru Hu, Line Companion)
3. WHEN THE domain expert requests Legge text, THE Scoring CLI SHALL display the corresponding hexagram with translator and edition information (Legge 1899)
4. WHEN THE Legge text is displayed, THE Scoring CLI SHALL highlight the matching line number
5. WHEN THE domain expert requests baseline information, THE Scoring CLI SHALL display the full baseline text with SHA-256 hash verification
6. WHEN THE source materials are displayed, THE Scoring CLI SHALL record which sources were viewed in the activation's metadata

### Requirement 5: Constraint Validation Engine

**User Story:** As a domain expert, I want real-time validation of mechanical constraints with diagnostics logging, so that I catch errors immediately and understand which constraints triggered.

#### Acceptance Criteria

1. WHEN THE domain expert assigns weights to star systems for a line, THE Validation Engine SHALL enforce the top-2 constraint (maximum 2 systems with weight > 0)
2. WHEN THE top-2 constraint is enforced, THE Validation Engine SHALL require exactly one "primary" role (enum validation) and allow optional one "secondary" role
3. WHEN THE domain expert assigns weights, THE Validation Engine SHALL check all 6 pairwise exclusion rules (max combined 0.95) and log which constraints triggered
4. WHEN THE weight is 0.40 or higher, THE Validation Engine SHALL require polarity assignment (enum: core or shadow)
5. WHEN THE weight exceeds 0.50, THE Validation Engine SHALL require a Legge quote from the same line number (locator pattern: "Hex NN, Line L")
6. WHEN THE domain expert attempts to save, THE Validation Engine SHALL verify canonical ordering if weights are tied
7. WHEN THE validation fails, THE Validation Engine SHALL display clear error messages and write constraint triggers to the diagnostics file

### Requirement 6: Evidence Extraction with Schema Validation

**User Story:** As a domain expert, I want CLI-based evidence extraction with automatic schema validation, so that I can quickly populate evidence entries with correct formatting.

#### Acceptance Criteria

1. WHEN THE domain expert provides a Line Companion quote, THE Evidence CLI SHALL validate that the quote is ≤25 words (enforced in schema)
2. WHEN THE quote is validated, THE Evidence CLI SHALL automatically populate the locator field with correct pattern ("Gate N, Line L")
3. WHEN THE domain expert provides a Legge quote, THE Evidence CLI SHALL validate that the quote is ≤25 words and matches the locator pattern ("Hex NN, Line L")
4. WHEN THE quotes are provided, THE Evidence CLI SHALL prompt for 2-6 keywords extracted from each quote
5. WHEN THE keywords are provided, THE Evidence CLI SHALL validate against the JSON schema (hd_keywords and ic_atoms arrays)
6. WHEN THE evidence is complete, THE Evidence CLI SHALL validate all required fields against the schema and save to the evidence file

### Requirement 7: Progress Tracking

**User Story:** As a domain expert, I want CLI-based progress tracking with retest scheduling, so that I know which activations are complete and can validate reproducibility.

#### Acceptance Criteria

1. WHEN THE domain expert runs the progress command, THE Progress CLI SHALL display all 26 activations with their completion status
2. WHEN THE activations are displayed, THE Progress CLI SHALL show which activations have been scored and which are pending
3. WHEN THE domain expert completes all activations, THE Progress CLI SHALL schedule 3 random activations for retest 7 days later
4. WHEN THE retest date arrives, THE Progress CLI SHALL prompt the domain expert to rescore the selected activations
5. WHEN THE retest is complete, THE Progress CLI SHALL calculate drift (weight differences) and log to notes/retest-drift.md

### Requirement 8: Decision Log Generator

**User Story:** As a domain expert, I want automated decision log entries for difficult scoring decisions, so that I can document my reasoning without manual markdown formatting.

#### Acceptance Criteria

1. WHEN THE domain expert marks a scoring decision as "difficult", THE Decision Log Generator SHALL create a structured entry in the decision log
2. WHEN THE entry is created, THE Decision Log Generator SHALL pre-populate the gate-line, star system, weight, and timestamp
3. WHEN THE domain expert provides reasoning, THE Decision Log Generator SHALL format it according to the decision log template
4. WHEN THE entry is saved, THE Decision Log Generator SHALL append it to `GPT-5/manual-scoring/notes/decision-log.md`
5. WHEN THE decision log is viewed, THE Decision Log Generator SHALL provide filtering by difficulty level, star system, or date

### Requirement 9: Validation Report Generator

**User Story:** As a domain expert, I want to run validation checks on my completed scoring, so that I can verify all outputs meet schema and constraint requirements before using them as ground truth.

#### Acceptance Criteria

1. WHEN THE domain expert requests validation, THE Validation Reporter SHALL run schema validation on all star-map and evidence files
2. WHEN THE schema validation completes, THE Validation Reporter SHALL run quote verification to ensure all quotes are verbatim and correctly located
3. WHEN THE quote verification completes, THE Validation Reporter SHALL run invariant checks to verify all pairwise exclusion rules
4. WHEN THE all checks complete, THE Validation Reporter SHALL generate a comprehensive report with pass/fail status for each check
5. WHEN THE validation fails, THE Validation Reporter SHALL provide specific line numbers and error messages for each failure
6. WHEN THE validation passes, THE Validation Reporter SHALL generate a summary report at `GPT-5/manual-scoring/validation-report.md`

### Requirement 10: Chart Comparison Tool

**User Story:** As a domain expert, I want to compare my manual scoring against automated LLM scoring, so that I can identify where the automated system deviates from ground truth.

#### Acceptance Criteria

1. WHEN THE domain expert provides an LLM-scored chart, THE Comparison Tool SHALL load both manual and automated scoring data
2. WHEN THE data is loaded, THE Comparison Tool SHALL calculate weight differences for each activation and star system
3. WHEN THE differences are calculated, THE Comparison Tool SHALL highlight activations where weights differ by more than 0.10
4. WHEN THE differences are highlighted, THE Comparison Tool SHALL display side-by-side evidence (quotes, keywords, reasoning) for comparison
5. WHEN THE comparison is complete, THE Comparison Tool SHALL generate a diff report showing agreement percentage and major deviations
6. WHEN THE report is generated, THE Comparison Tool SHALL save it to `GPT-5/manual-scoring/notes/llm-comparison.md`

### Requirement 11: Multi-Chart Management

**User Story:** As a domain expert, I want to manage multiple charts (my own, girlfriend's, friends'), so that I can build a diverse ground truth dataset without mixing up data.

#### Acceptance Criteria

1. WHEN THE domain expert creates a new chart project, THE Chart Manager SHALL create a separate subdirectory under `GPT-5/manual-scoring/charts/`
2. WHEN THE subdirectory is created, THE Chart Manager SHALL initialize the same workspace structure (notes, star-maps, evidence)
3. WHEN THE domain expert switches between charts, THE Chart Manager SHALL load the correct chart data and scoring progress
4. WHEN THE multiple charts are scored, THE Chart Manager SHALL provide a consolidated view of all charts with summary statistics
5. WHEN THE domain expert requests export, THE Chart Manager SHALL package all charts into a single ground truth dataset with metadata

### Requirement 12: Activation ID Validation

**User Story:** As a domain expert, I want activation IDs to follow a strict enum or regex pattern, so that I avoid key typos in the output files.

#### Acceptance Criteria

1. WHEN THE domain expert creates an activation entry, THE Scoring CLI SHALL validate the activation_id against a regex pattern (P_Sun, P_Earth, D_Moon, etc.)
2. WHEN THE activation_id is validated, THE Scoring CLI SHALL ensure it matches one of the 26 valid activation types (13 Personality + 13 Design)
3. WHEN THE activation_id is invalid, THE Scoring CLI SHALL display the list of valid activation IDs and reject the entry
4. WHEN THE output files are generated, THE Scoring CLI SHALL validate all activation_id keys against the schema enum
5. WHEN THE validation passes, THE Scoring CLI SHALL save the activation with the validated ID

### Requirement 13: Simple Time Tracking

**User Story:** As a domain expert, I want simple CLI timer wrapper for each activation, so that I can validate the estimated 25-45 minutes per activation without complex UI.

#### Acceptance Criteria

1. WHEN THE domain expert begins scoring an activation, THE Scoring CLI SHALL start a timer for that activation
2. WHEN THE domain expert completes the activation, THE Scoring CLI SHALL record the elapsed time to time-log.json
3. WHEN THE all activations are complete, THE Scoring CLI SHALL generate summary statistics (average time, min/max, total time)
4. WHEN THE statistics are generated, THE Scoring CLI SHALL compare actual times against the 25-45 minute estimate
5. WHEN THE time data is saved, THE Scoring CLI SHALL write it to `GPT-5/manual-scoring/notes/time-log.json` with activation_id and duration fields

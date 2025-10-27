# Requirements Document

## Introduction

This spec defines the automated pipeline for generating the gate.line → star system alignment map (`gateLine_star_map.json`). This map is the core scoring mechanism for the Star System Sorter app, translating Human Design chart data into star system classifications with behavioral rationale.

## Glossary

- **Gate.Line**: A Human Design chart element (e.g., "19.1", "44.4") representing specific behavioral/archetypal patterns
- **Star System**: One of 8 classifications (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco)
- **Mapping Digest**: A behavioral fingerprint added to each star system baseline JSON for programmatic comparison
- **Machine Layer**: Clean, behavioral scoring data (gateLine_star_map.json)
- **Provenance Layer**: Academic citations, disputed points, consensus levels (star system baseline JSONs)
- **Alignment Type**: Classification of gate.line match ("core", "shadow", "none")
- **Weight**: Numeric score (0.0-1.0) indicating strength of gate.line → star system alignment

## Requirements

### Requirement 1

**User Story:** As a developer, I want a documented pipeline specification, so that the mapping generation process is auditable and reproducible.

#### Acceptance Criteria

1. THE System SHALL create a `tasks.md` file at the repository root documenting the complete pipeline
2. THE `tasks.md` file SHALL include data sources, mapping_digest concept, scoring protocol, loop structure, merge rules, and QC checklist
3. THE `tasks.md` file SHALL document expected behavioral patterns for sanity checking (e.g., Gate 19.x → Pleiades, Gate 44.x → Draco)
4. THE `tasks.md` file SHALL include a STATUS section tracking completion of each pipeline phase

### Requirement 2

**User Story:** As a scoring algorithm, I need behavioral fingerprints for each star system, so that I can programmatically compare gate.lines against star system archetypes.

#### Acceptance Criteria

1. THE System SHALL add a `mapping_digest` object to each star system baseline JSON in `lore-research/research-outputs/star-systems/v4.2/`
2. THE `mapping_digest` object SHALL contain `core_themes` (healthy expression), `shadow_themes` (distorted expression), and `quick_rules` (disambiguation logic)
3. THE System SHALL preserve all existing fields in star system JSONs (bibliography, disputed_points, methodology, etc.)
4. THE `mapping_digest.quick_rules` SHALL explicitly differentiate each star system from others to prevent cross-contamination
5. THE `mapping_digest` content SHALL be behavioral and role-oriented, avoiding cosmogenesis lore

### Requirement 3

**User Story:** As a classification engine, I need per-batch alignment scores for each star system, so that I can systematically evaluate all gate.lines against all star systems.

#### Acceptance Criteria

1. THE System SHALL create directory `lore-research/research-outputs/star-mapping-drafts/` if it does not exist
2. FOR each star system AND each gate-line batch (1-7), THE System SHALL generate a mapping file named `<system-name>-batch<i>.json`
3. EACH mapping file SHALL contain all gate.lines from the input batch with weight (0.0-1.0), alignment_type ("core"|"shadow"|"none"), and why (one-sentence behavioral rationale)
4. THE System SHALL use `mapping_digest.core_themes` to judge "core" alignment
5. THE System SHALL use `mapping_digest.shadow_themes` to judge "shadow" alignment
6. THE System SHALL use `mapping_digest.quick_rules` to break ties and avoid cross-system contamination
7. THE System SHALL output valid JSON with no trailing commas

### Requirement 4

**User Story:** As the S³ app runtime, I need a single canonical lookup file, so that I can efficiently score user charts without loading multiple files.

#### Acceptance Criteria

1. THE System SHALL merge all per-batch mapping files into `lore-research/research-outputs/gateLine_star_map.json`
2. THE merged file SHALL be structured as `{ "<gate.line>": [{ "star_system": "...", "weight": ..., "alignment_type": "...", "why": "..." }] }`
3. FOR each gate.line, THE System SHALL include all star systems with weight > 0.0
4. THE System SHALL omit star systems with weight 0.0 from each gate.line's array
5. THE merged file SHALL be valid, parseable JSON

### Requirement 5

**User Story:** As a quality assurance process, I need validation checks, so that the generated mapping is complete and consistent.

#### Acceptance Criteria

1. THE System SHALL verify every gate.line from gate-line-1.json through gate-line-7.json appears in gateLine_star_map.json
2. THE System SHALL verify no gate.line has an empty array
3. THE System SHALL verify all weights are numbers between 0 and 1
4. THE System SHALL verify gateLine_star_map.json parses as valid JSON
5. THE System SHALL spot-check known archetypal cases (Gate 19.x → Pleiades, Gate 44.x → Draco, Gate 54.x → Orion-Light/Sirius, Gate 27.x → Pleiades, Gate 32.x → Draco)
6. THE System SHALL document QC results and any edge cases in tasks.md

### Requirement 6

**User Story:** As a researcher, I need behavioral rationale in scoring outputs, so that classification decisions are transparent and auditable.

#### Acceptance Criteria

1. EVERY gate.line alignment SHALL include a "why" field with one-sentence behavioral rationale
2. THE "why" field SHALL use behavioral language (psychological, motivational, relational)
3. THE "why" field SHALL NOT quote channeled text or include copyrighted long quotes
4. THE "why" field SHALL reference behavioral themes from mapping_digest, not cosmogenesis lore

### Requirement 7

**User Story:** As a legal compliance officer, I need provenance data preserved, so that academic credibility and IP protection remain intact.

#### Acceptance Criteria

1. THE System SHALL NOT delete bibliography, methodology, disputed_points, or consensus_level from star system baseline files
2. THE System SHALL NOT rename established directories
3. THE System SHALL preserve all existing fields when adding mapping_digest to star system JSONs
4. THE System SHALL maintain two-layer architecture (machine layer in gateLine_star_map.json, provenance layer in star system baselines)

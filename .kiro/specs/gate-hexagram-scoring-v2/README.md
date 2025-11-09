# Gate/Hexagram Star System Scoring - Spec v2

## Overview

This spec defines a deterministic, academically rigorous system for generating star system weights for all 384 gate.line combinations (64 gates × 6 lines) in Human Design. The system scores Human Design Line Companion text and I Ching Legge text against 8 star system baselines.

## Spec Status

✅ **Complete and Ready for Implementation**

All precision issues identified by GPT-5 have been addressed. See `PRECISION_FIXES.md` for details.

## Key Features

- **Deterministic**: Same inputs always produce identical outputs (locked with baseline beacon)
- **Academic Rigor**: Evidence-based weights with verbatim source citations
- **Top-2 Constraint**: Maximum 2 star systems per line (prevents "mud")
- **Pairwise Exclusions**: Hard rules prevent incompatible archetypes
- **Sparse Format**: Only non-zero weights in output (runtime treats missing as 0.00)
- **Full Audit Trail**: Evidence files show "receipts" for all scoring decisions

## Document Structure

### requirements.md
- 8 requirements as user stories with EARS-compliant acceptance criteria
- Glossary defining all technical terms
- Clear, measurable success criteria

### design.md
- Three-phase architecture (Score → Evidence → Output)
- Component interfaces and data models
- Pairwise exclusion rules and disambiguation matrix
- Error handling and validation strategy
- Performance considerations

### tasks.md
- 20 implementation tasks with sub-tasks
- Each task references specific requirements
- Clear deliverables and acceptance criteria
- Estimated time: ~21-22 hours

## Critical Precision Points

1. **Baseline Beacon**: Computed at runtime via `compute_beacon.py` (first 8 chars of SHA256)
2. **sum_unorm**: Sum of all non-zero weights across all 6 lines in the file
3. **Sparse Format**: Only non-zero weights included; missing = 0.00
4. **Role + Polarity Separation** (v4.2):
   - `role`: "primary" | "secondary" (priority/strength - exactly 1 primary per line, optional 1 secondary)
   - `polarity`: "core" | "shadow" (expression/valence - healthy signature vs growth-edge)
5. **Canonical Names**: "Orion Light" and "Orion Dark" use **space**, not hyphen
6. **Legge Gating**: Legge quotes MUST be from same line number; Line Companion may be from any line
7. **Tie-Breaking**: When weights equal, sort by canonical system order

## Canonical System Order

1. Pleiades
2. Sirius
3. Lyra
4. Andromeda
5. Orion Light
6. Orion Dark
7. Arcturus
8. Draco

## Getting Started

1. Review `requirements.md` to understand the feature goals
2. Study `design.md` for architecture and data models
3. Open `tasks.md` and click "Start task" on Task 1 to begin implementation

## Validation

All outputs must pass:
- JSON schema validation
- Top-2 constraint (max 2 systems with weight >0 per line)
- Pairwise exclusion rules
- Weight precision (multiples of 0.01, range 0.0-0.95)
- Quote verification (verbatim, ≤25 words)
- Baseline beacon matching
- Canonical name enforcement
- Key sorting (ascending "NN.L")
- Sparse format compliance

## Output Files

Per gate (64 total):
- `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json` - Weight assignments
- `GPT-5/evidence/gateLine_evidence_Gate{NN}.json` - Source citations and justifications

Master files (after all 64 gates):
- `GPT-5/gateLine_star_map_MASTER.json` - All 384 lines merged
- `GPT-5/gateLine_evidence_MASTER.json` - All evidence merged
- `GPT-5/STATISTICS_REPORT.md` - Weight distributions and analysis

## Success Criteria

- All 64 gates processed (384 lines total)
- All validation scripts pass
- Weights are reproducible (same inputs → same outputs)
- No invented quotes or unsupported claims
- Runtime scorer integration works seamlessly
- CI pipeline passes all checks

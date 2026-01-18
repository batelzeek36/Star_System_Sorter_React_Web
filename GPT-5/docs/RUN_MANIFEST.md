# Run Manifest Documentation

## Overview

The run manifest system tracks progress during manual gate scoring sessions. Each session generates a YAML manifest file that records which gates have been completed, validated, and the baseline beacon used for scoring.

## Purpose

- **Progress Tracking**: Know which gates have been scored and validated
- **Reproducibility**: Record the exact baseline version used for each session
- **Quality Assurance**: Track validation status separately from completion
- **Session Management**: Document who scored what and when

## Manifest Structure

### Required Fields

- **schema_version** (string): Version of the manifest format (currently "1.0")
- **analyst** (string): Name or identifier of the person performing the scoring
- **session_date** (ISO 8601 date): Date of the scoring session (YYYY-MM-DD)
- **baseline_beacon** (object): Information about the baseline file used
  - **value** (string): First 8 characters of SHA256 hash
  - **method** (string): Hash computation method (typically "sha256_canonical_json")
  - **source_path** (string): Relative path to baseline file
  - **source_sha256** (string): Full SHA256 hash of baseline file
- **gates_completed** (array): Gate numbers that have been scored and files generated
- **gates_validated** (array): Gate numbers that have passed both validation scripts
- **timestamp_utc** (ISO 8601 string): When the manifest was last updated
- **git_commit** (string): Git commit hash at time of session
- **git_dirty** (boolean): Whether git working directory had uncommitted changes

### Optional Fields

- **notes** (string): Free-form session notes, observations, or issues encountered

## Example Manifest

```yaml
# Manual Scoring Run Manifest
schema_version: "1.0"

analyst: "Kiro"

session_date: "2025-01-15"

baseline_beacon:
  value: "59bfc617"
  method: "sha256_canonical_json"
  source_path: "GPT-5/combined-baselines-4.2.json"
  source_sha256: "59bfc617a8e4f2d3c1b9e7f6a5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6"

gates_completed: [1, 2, 3, 4, 5, 6, 7, 8]

gates_validated: [1, 2, 3, 4, 5, 6, 7, 8]

timestamp_utc: "2025-01-15T18:30:00Z"

git_commit: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"

git_dirty: false

notes: |
  Completed first batch of 8 gates. All gates passed validation on first attempt.
  Gate 3 required careful attention to Pleiades/Draco exclusion rule.
  Gate 7 had interesting Orion Light/Dark tension - documented in gate-07-notes.md.
```

## Usage Workflow

### 1. Start a New Session

```bash
cd GPT-5/scripts
python write_run_manifest.py init
```

This creates a new manifest file at `GPT-5/runs/<session_date>/run-manifest.yaml` with:
- Current date as session_date
- Computed baseline beacon
- Empty gates_completed and gates_validated arrays
- Current git commit and dirty status

### 2. Update After Completing Gates

```bash
python write_run_manifest.py add-completed 1 2 3
```

This adds gates 1, 2, and 3 to the `gates_completed` array.

### 3. Update After Validating Gates

```bash
python write_run_manifest.py add-validated 1 2 3
```

This adds gates 1, 2, and 3 to the `gates_validated` array.

### 4. Add Session Notes

```bash
python write_run_manifest.py notes "Completed batch 1. Gate 3 required extra attention."
```

### 5. View Current Status

```bash
python write_run_manifest.py status
```

Displays:
- Current session date
- Baseline beacon
- Gates completed: X/64
- Gates validated: X/64
- Completion percentage
- Next gates to score

## File Organization

```
GPT-5/
├── run-manifest-template.yaml    # Template file
├── runs/                          # Session-specific manifests
│   ├── 2025-01-15/
│   │   └── run-manifest.yaml
│   ├── 2025-01-16/
│   │   └── run-manifest.yaml
│   └── 2025-01-17/
│       └── run-manifest.yaml
└── docs/
    └── RUN_MANIFEST.md           # This file
```

## Integration with Validation

The manifest system integrates with the validation scripts:

```bash
# After scoring gates 1-8
python write_run_manifest.py add-completed 1 2 3 4 5 6 7 8

# Run validation
for gate in {1..8}; do
  python validate_gate_outputs.py $gate && \
  python verify_quotes.py $gate && \
  python write_run_manifest.py add-validated $gate
done
```

## Quality Gates

Before marking a gate as validated:
1. Files must exist: `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
2. Files must exist: `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`
3. `validate_gate_outputs.py` must pass (Task 7.1)
4. `verify_quotes.py` must pass (Task 7.2)

## Baseline Beacon Verification

The baseline beacon ensures all gates in a session use the same baseline version:

```bash
# Compute current baseline beacon
python compute_beacon.py

# Compare with manifest
python write_run_manifest.py verify-beacon
```

If the beacon doesn't match, it indicates:
- The baseline file has changed since the session started
- Gates scored with different baselines (reproducibility issue)
- Need to re-score gates with the new baseline

## Session Recovery

If a session is interrupted:

```bash
# Resume the most recent session
python write_run_manifest.py status

# Or specify a specific session date
python write_run_manifest.py status --session-date 2025-01-15
```

## Reporting

Generate a progress report:

```bash
python write_run_manifest.py report
```

Output:
```
Manual Scoring Progress Report
==============================

Session: 2025-01-15
Analyst: Kiro
Baseline: 59bfc617

Gates Completed: 8/64 (12.5%)
Gates Validated: 8/64 (12.5%)

Completed: [1, 2, 3, 4, 5, 6, 7, 8]
Validated: [1, 2, 3, 4, 5, 6, 7, 8]

Next to score: [9, 10, 11, 12, 13, 14, 15, 16]

Git: a1b2c3d4 (clean)
Last updated: 2025-01-15T18:30:00Z
```

## Best Practices

1. **Start each session with --init**: Creates a clean manifest with current baseline
2. **Update immediately after completion**: Don't wait to batch updates
3. **Validate before marking validated**: Only add to gates_validated after both scripts pass
4. **Add notes for difficult gates**: Document edge cases and decisions
5. **Verify beacon periodically**: Ensure baseline hasn't changed mid-session
6. **Commit manifests to git**: Track progress over time

## Troubleshooting

### Beacon Mismatch

```
ERROR: Baseline beacon mismatch!
  Manifest: 59bfc617
  Current:  8485865f
```

**Solution**: The baseline file has changed. Either:
- Revert baseline to the version used in the session
- Start a new session with the new baseline
- Re-score all gates in the session with the new baseline

### Missing Gates

```
WARNING: Gate 5 marked as validated but not completed
```

**Solution**: Add gate to gates_completed first:
```bash
python write_run_manifest.py add-completed 5
```

### Git Dirty Warning

```
WARNING: Git working directory has uncommitted changes
```

**Solution**: Commit changes before continuing:
```bash
git add .
git commit -m "Completed gates 1-8"
```

## See Also

- [ORCHESTRATION.md](ORCHESTRATION.md) - Full orchestration workflow
- [VALIDATION_QUICK_REFERENCE.md](../scripts/VALIDATION_QUICK_REFERENCE.md) - Validation commands
- [README.md](../README.md) - Project overview

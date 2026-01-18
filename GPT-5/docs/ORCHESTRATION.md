# Orchestration Guide

## Overview

This guide documents the complete workflow for manually scoring all 64 gates using the run manifest system to track progress. The orchestration approach emphasizes quality over speed, with validation at every step.

## Prerequisites

Before starting:

1. **Baseline file exists**: `GPT-5/combined-baselines-4.2.json`
2. **Source files available**:
   - Line Companion: `claude/Full Pass/gate-{N}-full.json` (64 files)
   - Legge I Ching: `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json` (64 files)
3. **Validation scripts working**:
   - `GPT-5/scripts/validate_gate_outputs.py`
   - `GPT-5/scripts/verify_quotes.py`
4. **Python dependencies installed**: `pyyaml`

## Workflow Overview

```
1. Initialize Session
   ↓
2. Score Gates (1-8 per batch)
   ↓
3. Validate Gates
   ↓
4. Update Manifest
   ↓
5. Repeat until all 64 gates complete
   ↓
6. Generate Master Files
```

## Step-by-Step Process

### Phase 1: Session Initialization

Start a new scoring session:

```bash
cd GPT-5/scripts

# Initialize new session
python write_run_manifest.py init --analyst "Your Name"

# Verify baseline beacon
python write_run_manifest.py verify-beacon

# Check status
python write_run_manifest.py status
```

Expected output:
```
✓ Created manifest: GPT-5/runs/2025-01-15/run-manifest.yaml
  Analyst: Your Name
  Session: 2025-01-15
  Baseline beacon: 59bfc617
  Git: a1b2c3d4 (clean)
```

### Phase 2: Gate Scoring (Batch Processing)

Process gates in batches of 8 for manageable sessions:

#### Batch 1: Gates 1-8

```bash
# For each gate in the batch:
# 1. Read source files
# 2. Analyze all 6 lines
# 3. Assign weights and extract evidence
# 4. Generate output files
# 5. Run validation

# Example for Gate 1:
# (Manual analysis by Kiro or analyst)
# - Read GPT-5/combined-baselines-4.2.json
# - Read claude/Full Pass/gate-1-full.json
# - Read claude/I-Ching-Full-Pass/hexagram-01.json
# - Analyze lines 1.1 through 1.6
# - Generate GPT-5/star-maps/gateLine_star_map_Gate01.json
# - Generate GPT-5/evidence/gateLine_evidence_Gate01.json

# After generating files, validate:
python validate_gate_outputs.py 1
python verify_quotes.py 1

# If validation passes, update manifest:
python write_run_manifest.py add-completed 1
python write_run_manifest.py add-validated 1

# Repeat for gates 2-8
```

#### Batch Validation Script

For efficiency, validate an entire batch at once:

```bash
#!/bin/bash
# validate_batch.sh

BATCH_START=$1
BATCH_END=$2

for gate in $(seq $BATCH_START $BATCH_END); do
  echo "Validating Gate $gate..."
  
  if python validate_gate_outputs.py $gate && python verify_quotes.py $gate; then
    echo "✓ Gate $gate passed validation"
    python write_run_manifest.py add-validated $gate
  else
    echo "✗ Gate $gate failed validation"
    exit 1
  fi
done

echo "✓ Batch $BATCH_START-$BATCH_END validated successfully"
```

Usage:
```bash
chmod +x validate_batch.sh
./validate_batch.sh 1 8
```

### Phase 3: Progress Tracking

Check progress regularly:

```bash
# View current status
python write_run_manifest.py status

# Generate detailed report
python write_run_manifest.py report

# Add session notes
python write_run_manifest.py notes "Completed batch 1. Gate 3 required extra attention to Pleiades/Draco exclusion."
```

### Phase 4: Quality Checks

After each batch, perform quality checks:

```bash
# Verify baseline hasn't changed
python write_run_manifest.py verify-beacon

# Check for common issues
python fuzz_invariants.py  # Verify pairwise exclusions

# Review difficult gates
ls GPT-5/notes/gate-*-notes.md
```

### Phase 5: Batch Completion

After completing a batch:

```bash
# Update manifest with all completed gates
python write_run_manifest.py add-completed 1 2 3 4 5 6 7 8

# Validate entire batch
./validate_batch.sh 1 8

# Add batch notes
python write_run_manifest.py notes --append "Batch 1 (gates 1-8) complete. All validations passed."

# Commit to git
git add GPT-5/star-maps/gateLine_star_map_Gate0[1-8].json
git add GPT-5/evidence/gateLine_evidence_Gate0[1-8].json
git add GPT-5/runs/*/run-manifest.yaml
git commit -m "Complete batch 1: gates 1-8"
```

## Batch Schedule

Recommended batch schedule (8 gates per batch):

- **Batch 1**: Gates 1-8
- **Batch 2**: Gates 9-16
- **Batch 3**: Gates 17-24
- **Batch 4**: Gates 25-32
- **Batch 5**: Gates 33-40
- **Batch 6**: Gates 41-48
- **Batch 7**: Gates 49-56
- **Batch 8**: Gates 57-64

Estimated time: 30-60 minutes per gate = 4-8 hours per batch

## Error Recovery

### Validation Failure

If a gate fails validation:

```bash
# Review error message
python validate_gate_outputs.py 5

# Fix the issue in the output files
# Re-run validation
python validate_gate_outputs.py 5
python verify_quotes.py 5

# Once fixed, update manifest
python write_run_manifest.py add-validated 5
```

### Baseline Change

If baseline changes mid-session:

```bash
# Check for mismatch
python write_run_manifest.py verify-beacon

# Option 1: Revert baseline
git checkout GPT-5/combined-baselines-4.2.json

# Option 2: Start new session with new baseline
python write_run_manifest.py init --analyst "Your Name" --force
```

### Session Interruption

If a session is interrupted:

```bash
# Resume latest session
python write_run_manifest.py status

# Continue from where you left off
# Next gates to score will be shown in status output
```

## Quality Assurance

### Pre-Flight Checks

Before starting each gate:

1. ✓ Baseline beacon verified
2. ✓ Source files exist and are readable
3. ✓ Previous gates validated
4. ✓ Git working directory clean

### Post-Gate Checks

After completing each gate:

1. ✓ Both output files generated
2. ✓ Schema validation passed (7.1)
3. ✓ Quote verification passed (7.2)
4. ✓ Manifest updated
5. ✓ Difficult decisions documented

### Batch Review

After each batch of 8 gates:

1. ✓ All gates validated
2. ✓ Pairwise exclusions verified
3. ✓ Weight distributions reasonable
4. ✓ Evidence quality consistent
5. ✓ Changes committed to git

## Monitoring Progress

### Daily Status Check

```bash
# Morning routine
cd GPT-5/scripts
python write_run_manifest.py status
python write_run_manifest.py verify-beacon
```

### Weekly Report

```bash
# Generate progress report
python write_run_manifest.py report > weekly_report_$(date +%Y-%m-%d).txt

# Review statistics
python ../scripts/generate_statistics.py  # (Task 73.3)
```

## Completion Checklist

When all 64 gates are complete:

- [ ] All gates in `gates_completed` array (64/64)
- [ ] All gates in `gates_validated` array (64/64)
- [ ] Baseline beacon consistent across all gates
- [ ] All output files exist and valid
- [ ] All changes committed to git
- [ ] Session notes document any issues
- [ ] Ready for Phase 4 (Master File Generation)

## Integration with Other Tasks

### Task 7.1: Core Validation

```bash
python validate_gate_outputs.py <gate_number>
```

Checks:
- JSON schema compliance
- Top-2 constraint
- Pairwise exclusions
- Weight precision
- Baseline beacon
- Canonical names

### Task 7.2: Quote Verification

```bash
python verify_quotes.py <gate_number>
```

Checks:
- Quote length (≤25 words)
- Verbatim matching
- Locator formats
- Same-line requirement for Legge (weight >0.50)
- Source attribution

### Task 7.3: Invariant Fuzzing

```bash
python fuzz_invariants.py
```

Checks:
- All pairwise exclusion rules
- Across all completed gates
- Generates invariants report

### Task 73: Master File Generation

After all 64 gates complete:

```bash
# Merge all gates into master files
python merge_gate_mappings.py

# Generate statistics
python generate_statistics.py

# Generate quality report
python generate_quality_report.py
```

## Best Practices

### 1. Consistent Workflow

- Always initialize session before starting
- Update manifest immediately after each gate
- Validate before marking as validated
- Commit regularly to git

### 2. Quality Over Speed

- Take time to analyze each line carefully
- Document difficult decisions
- Don't rush through ambiguous cases
- Review previous gates for consistency

### 3. Batch Processing

- Process 8 gates per session
- Take breaks between batches
- Review batch as a whole before moving on
- Look for patterns across gates

### 4. Documentation

- Add notes for difficult gates
- Document edge cases
- Record decisions and rationale
- Update notes as you learn

### 5. Validation Discipline

- Never skip validation
- Fix issues immediately
- Don't accumulate technical debt
- Verify beacon regularly

## Troubleshooting

### Common Issues

**Issue**: Manifest not found
```bash
# Solution: Initialize session
python write_run_manifest.py init
```

**Issue**: Baseline beacon mismatch
```bash
# Solution: Verify baseline hasn't changed
python write_run_manifest.py verify-beacon
git diff GPT-5/combined-baselines-4.2.json
```

**Issue**: Gate marked validated but not completed
```bash
# Solution: Add to completed first
python write_run_manifest.py add-completed <gate>
```

**Issue**: Validation fails after changes
```bash
# Solution: Review error, fix, re-validate
python validate_gate_outputs.py <gate>
# Fix issue
python validate_gate_outputs.py <gate>
python write_run_manifest.py add-validated <gate>
```

## See Also

- [RUN_MANIFEST.md](RUN_MANIFEST.md) - Manifest file format and usage
- [VALIDATION_QUICK_REFERENCE.md](../scripts/VALIDATION_QUICK_REFERENCE.md) - Validation commands
- [QUOTE_VALIDATION_RULES.md](QUOTE_VALIDATION_RULES.md) - Quote verification rules
- [README.md](../README.md) - Project overview
- [gate-scoring-workflow.md](../../.kiro/steering/gate-scoring-workflow.md) - Gate analysis workflow

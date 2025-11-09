# Gate Output Validation Script

## Overview

`validate_gate_outputs.py` is a comprehensive validation script that enforces all structural and business rules for v4.2 gate/hexagram scoring outputs. It performs 12 categories of validation checks to ensure data quality and consistency.

## Usage

```bash
# Validate a specific gate (zero-padded)
python3 validate_gate_outputs.py 01

# Validate with custom baseline beacon
python3 validate_gate_outputs.py 01 --beacon 59bfc617
```

## Validation Checks

### 1. JSON Schema Validation
- Validates weight files against `schemas/weights.schema.json`
- Validates evidence files against `schemas/evidence.schema.json`
- Ensures all required fields are present
- Verifies data types and value constraints

### 2. Top-2 Constraint
- Enforces maximum of 2 star systems per line
- Requires exactly 1 primary system per line
- Allows optional 1 secondary system per line
- Verifies primary weight > secondary weight

**Example violations:**
```json
// ✗ Too many systems (3)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"},
  {"star_system": "Pleiades", "weight": 0.15, "role": "secondary"}
]

// ✓ Valid (2 systems)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"}
]
```

### 3. Pairwise Exclusion Rules
Enforces archetypal incompatibility rules:

| System A | System B | Rule | Action |
|----------|----------|------|--------|
| Pleiades | Draco | Mutual exclusion | If Pleiades >0 → Draco =0 |
| Sirius | Orion Light | Threshold cap | If Sirius ≥0.60 → Orion Light ≤0.35 |
| Andromeda | Orion Dark | Mutual exclusion | If Andromeda ≥0.60 → Orion Dark =0 |
| Arcturus | Pleiades | Mutual exclusion | If Arcturus >0 → Pleiades =0 |
| Lyra | Draco | Mutual exclusion | If Lyra >0 → Draco =0 |
| Orion Light | Orion Dark | Down-rank | If both match → one ≤0.35 or =0 |

**Example violations:**
```json
// ✗ Pleiades + Draco (mutual exclusion)
"01.1": [
  {"star_system": "Pleiades", "weight": 0.75},
  {"star_system": "Draco", "weight": 0.25}
]

// ✗ Sirius ≥0.60 + Orion Light >0.35
"01.2": [
  {"star_system": "Sirius", "weight": 0.65},
  {"star_system": "Orion Light", "weight": 0.40}
]

// ✓ Valid (Orion Light capped at 0.35)
"01.2": [
  {"star_system": "Sirius", "weight": 0.65},
  {"star_system": "Orion Light", "weight": 0.35}
]
```

### 4. Legge-Gating Rule
- If weight >0.50, requires Legge quote from same line number
- Verifies evidence entry exists for the system
- Checks Legge quote is non-empty

**Example violations:**
```json
// ✗ Weight 0.75 but no Legge quote
"01.1": [
  {"star_system": "Lyra", "weight": 0.75}
]
// Evidence missing or Legge quote empty

// ✓ Valid (weight >0.50 with Legge quote)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75}
]
// Evidence has: "legge1899": {"quote": "the dragon lying hid..."}
```

### 5. Weight Range and Precision
- Ensures weights are in range 0.0 to 0.95
- Verifies weights are multiples of 0.01
- Allows for float precision tolerance (±0.001)

**Example violations:**
```json
// ✗ Weight not multiple of 0.01
{"star_system": "Lyra", "weight": 0.753}

// ✗ Weight exceeds maximum
{"star_system": "Lyra", "weight": 0.97}

// ✓ Valid
{"star_system": "Lyra", "weight": 0.75}
```

### 6. Polarity Presence
- Requires polarity field when weight ≥0.40
- Polarity must be "core" or "shadow"

### 7. Canonical Name Validation
Enforces exact canonical star system names with proper case and spacing:

**Canonical Names:**
```
Pleiades
Sirius
Lyra
Andromeda
Orion Light    (space, not hyphen)
Orion Dark     (space, not hyphen)
Arcturus
Draco
```

**Example violations:**
```json
// ✗ Wrong case
{"star_system": "orion light"}

// ✗ Hyphen instead of space
{"star_system": "Orion-Light"}

// ✗ Invalid name
{"star_system": "Betelgeuse"}

// ✓ Valid
{"star_system": "Orion Light"}
```

### 8. Key Format Validation
- Verifies line keys follow `NN.L` format
- Gate number (NN) must be zero-padded (01-64)
- Line number (L) must be 1-6
- Gate number must match `_meta.gate`

**Example violations:**
```json
// ✗ Not zero-padded
"1.1": [...]

// ✗ Gate mismatch
"_meta": {"gate": "01"}
"02.1": [...]

// ✗ Line out of range
"01.7": [...]

// ✓ Valid
"_meta": {"gate": "01"}
"01.1": [...]
"01.2": [...]
```

### 9. Sorting and Tie-Breaking
- Line keys must be sorted ascending ("01.1", "01.2", ...)
- Systems within each line sorted by weight descending
- When weights are equal, use canonical system order for tie-breaking

**Canonical Sort Order (for ties):**
1. Pleiades
2. Sirius
3. Lyra
4. Andromeda
5. Orion Light
6. Orion Dark
7. Arcturus
8. Draco

**Example violations:**
```json
// ✗ Wrong weight order
"01.1": [
  {"star_system": "Sirius", "weight": 0.25},
  {"star_system": "Lyra", "weight": 0.75}
]

// ✗ Tie-breaking order wrong (Sirius before Pleiades when equal)
"01.1": [
  {"star_system": "Sirius", "weight": 0.50},
  {"star_system": "Pleiades", "weight": 0.50}
]

// ✓ Valid (Pleiades before Sirius in canonical order)
"01.1": [
  {"star_system": "Pleiades", "weight": 0.50},
  {"star_system": "Sirius", "weight": 0.50}
]
```

### 10. Sparse Format
- Only non-zero weights should be present in output
- Systems with weight 0.0 must be omitted

**Example violations:**
```json
// ✗ Zero weight present
"01.1": [
  {"star_system": "Lyra", "weight": 0.75},
  {"star_system": "Sirius", "weight": 0.0}
]

// ✓ Valid (zero weights omitted)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75}
]
```

### 11. Sum Unorm Validation
- Verifies `_meta.sum_unorm` equals sum of all non-zero weights across all 6 lines
- Allows for float precision tolerance (±0.01)

**Example:**
```json
{
  "_meta": {
    "sum_unorm": 5.48  // Must equal sum of all weights
  },
  "01.1": [{"weight": 0.78}],  // 0.78
  "01.2": [{"weight": 0.75}, {"weight": 0.25}],  // 1.00
  "01.3": [{"weight": 0.70}],  // 0.70
  "01.4": [{"weight": 0.85}],  // 0.85
  "01.5": [{"weight": 0.65}, {"weight": 0.35}],  // 1.00
  "01.6": [{"weight": 0.75}, {"weight": 0.40}]   // 1.15
  // Total: 5.48 ✓
}
```

### 12. Baseline Beacon Match
- Verifies `baseline_beacon` in both weight and evidence files
- Must match expected beacon (computed from `combined-baselines-4.2.json`)
- Default expected beacon: `59bfc617`

## Exit Codes

- `0`: All validations passed
- `1`: Validation errors found
- `2`: File not found or invalid JSON

## Output Format

```
Validating Gate 01...

1. Schema validation...
  ✓ Weights schema valid
  ✓ Evidence schema valid

2. Top-2 constraint...
  ✓ Top-2 constraint satisfied

3. Pairwise exclusions...
  ✓ Pairwise exclusions satisfied

...

12. Beacon match...
  ✓ Beacon matches

✓ All validations PASSED
```

If errors are found:
```
Validating Gate 01...

1. Schema validation...
  ✓ Weights schema valid
  ✓ Evidence schema valid

2. Top-2 constraint...
  ✗ 01.1: Top-2 violation - found 3 systems (max 2)

...

✗ Validation FAILED with 1 error(s)
```

## Testing

Run the test suite to verify validation logic:

```bash
python3 test_validate_gate_outputs.py
```

The test suite includes:
- Top-2 constraint tests (valid/invalid cases)
- Pairwise exclusion tests (all 6 rules)
- Canonical name tests (case, spacing, invalid names)
- Key format tests (padding, range, gate mismatch)
- Sparse format tests (zero weight detection)
- Sum unorm tests (matching, mismatch, missing)
- Weight precision tests (multiples of 0.01)
- Sorting and tie-breaking tests (weight order, canonical order)

## Integration with CI Pipeline

This script is designed to be integrated into a CI pipeline:

```yaml
# .github/workflows/validate-gates.yml
- name: Validate Gate Outputs
  run: |
    for gate in {01..64}; do
      python3 GPT-5/scripts/validate_gate_outputs.py $gate || exit 1
    done
```

## Dependencies

- Python 3.7+
- `jsonschema` package: `pip install jsonschema`

## Related Scripts

- `compute_beacon.py`: Computes baseline beacon hash
- `validate_schemas.py`: Validates schema files themselves
- `pack_scoring_input.py`: Packs prompts with baseline data
- `generate_gate_prompts.py`: Generates gate-specific prompts

## Error Recovery

If validation fails:

1. Review the specific error messages
2. Check the line and system mentioned in the error
3. Verify against the requirements document
4. Fix the weight or evidence file
5. Re-run validation

Common fixes:
- **Top-2 violation**: Remove extra systems, keep only top 2
- **Pairwise exclusion**: Remove or down-rank conflicting system
- **Legge-gating**: Add Legge quote or reduce weight to ≤0.50
- **Canonical names**: Fix case/spacing (e.g., "Orion Light" not "Orion-Light")
- **Sum unorm**: Recalculate sum of all weights across all 6 lines
- **Sparse format**: Remove any systems with weight 0.0

## Version History

- **v4.2**: Added role/polarity separation, sum_unorm validation
- **v4.1**: Initial validation script with core rules

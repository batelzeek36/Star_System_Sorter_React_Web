# Validation Quick Reference

## Quick Start

```bash
# Validate a gate
python3 validate_gate_outputs.py 01

# Run all tests
python3 test_validate_gate_outputs.py

# Compute baseline beacon
python3 compute_beacon.py
```

## Common Validation Errors

### Top-2 Constraint Violations

**Error:** `Top-2 violation - found 3 systems (max 2)`

**Fix:** Keep only the top 2 systems by weight. Remove the third system.

```json
// Before (✗)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"},
  {"star_system": "Pleiades", "weight": 0.15, "role": "secondary"}
]

// After (✓)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"}
]
```

### Pairwise Exclusion Violations

**Error:** `Pairwise exclusion violated - Pleiades > 0 requires Draco = 0`

**Fix:** Remove the excluded system (Draco in this case).

```json
// Before (✗)
"01.1": [
  {"star_system": "Pleiades", "weight": 0.75, "role": "primary"},
  {"star_system": "Draco", "weight": 0.25, "role": "secondary"}
]

// After (✓)
"01.1": [
  {"star_system": "Pleiades", "weight": 0.75, "role": "primary"}
]
```

**Error:** `Sirius ≥ 0.60 requires Orion Light ≤ 0.35, but Orion Light = 0.40`

**Fix:** Cap Orion Light at 0.35 or remove it.

```json
// Before (✗)
"01.2": [
  {"star_system": "Sirius", "weight": 0.65, "role": "primary"},
  {"star_system": "Orion Light", "weight": 0.40, "role": "secondary"}
]

// After (✓)
"01.2": [
  {"star_system": "Sirius", "weight": 0.65, "role": "primary"},
  {"star_system": "Orion Light", "weight": 0.35, "role": "secondary"}
]
```

### Legge-Gating Violations

**Error:** `Legge-gating violated - Lyra weight 0.75 > 0.50 but Legge quote is empty`

**Fix:** Add a Legge quote from the same line number, or reduce weight to ≤0.50.

```json
// Option 1: Add Legge quote (✓)
// In evidence file:
"01.1": [
  {
    "star_system": "Lyra",
    "sources": {
      "legge1899": {
        "quote": "the dragon lying hid (in the deep). It is not the time for active doing.",
        "locator": "Hex 1, Line 1",
        "attribution": "Legge 1899"
      }
    }
  }
]

// Option 2: Reduce weight (✓)
// In weight file:
"01.1": [
  {"star_system": "Lyra", "weight": 0.50, "role": "primary"}
]
```

### Canonical Name Violations

**Error:** `Non-canonical system name 'Orion-Light' (should be 'Orion Light')`

**Fix:** Use exact canonical name with space, not hyphen.

```json
// Before (✗)
{"star_system": "Orion-Light"}
{"star_system": "orion light"}
{"star_system": "ORION LIGHT"}

// After (✓)
{"star_system": "Orion Light"}
```

**Canonical Names:**
- Pleiades
- Sirius
- Lyra
- Andromeda
- Orion Light (space!)
- Orion Dark (space!)
- Arcturus
- Draco

### Key Format Violations

**Error:** `Key gate mismatch '02.1' (gate part '02' doesn't match metadata gate '01')`

**Fix:** Ensure line keys match the gate number in metadata.

```json
// Before (✗)
{
  "_meta": {"gate": "01"},
  "02.1": [...]
}

// After (✓)
{
  "_meta": {"gate": "01"},
  "01.1": [...]
}
```

**Error:** `Invalid line number in '01.7' (must be 1-6)`

**Fix:** Use line numbers 1-6 only.

```json
// Before (✗)
"01.7": [...]
"01.0": [...]

// After (✓)
"01.1": [...]
"01.6": [...]
```

### Sparse Format Violations

**Error:** `Sparse format violation - Sirius has weight 0.0 (should be omitted)`

**Fix:** Remove any systems with weight 0.0.

```json
// Before (✗)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.0, "role": "secondary"}
]

// After (✓)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
]
```

### Sum Unorm Violations

**Error:** `sum_unorm mismatch: declared 6.00, but sum of all weights = 5.48`

**Fix:** Recalculate sum_unorm as the sum of all weights across all 6 lines.

```json
// Before (✗)
{
  "_meta": {"sum_unorm": 6.00},
  "01.1": [{"weight": 0.78}],
  "01.2": [{"weight": 0.75}, {"weight": 0.25}],
  "01.3": [{"weight": 0.70}],
  "01.4": [{"weight": 0.85}],
  "01.5": [{"weight": 0.65}, {"weight": 0.35}],
  "01.6": [{"weight": 0.75}, {"weight": 0.40}]
}

// After (✓)
{
  "_meta": {"sum_unorm": 5.48},  // 0.78 + 1.00 + 0.70 + 0.85 + 1.00 + 1.15
  ...
}
```

### Sorting Violations

**Error:** `Systems not sorted by weight descending: [0.25, 0.75]`

**Fix:** Sort systems by weight descending (highest first).

```json
// Before (✗)
"01.1": [
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"},
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"}
]

// After (✓)
"01.1": [
  {"star_system": "Lyra", "weight": 0.75, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.25, "role": "secondary"}
]
```

**Error:** `Tie-breaking order violated - Sirius should come after Pleiades in canonical order`

**Fix:** When weights are equal, use canonical system order.

```json
// Before (✗)
"01.1": [
  {"star_system": "Sirius", "weight": 0.50, "role": "primary"},
  {"star_system": "Pleiades", "weight": 0.50, "role": "secondary"}
]

// After (✓)
"01.1": [
  {"star_system": "Pleiades", "weight": 0.50, "role": "primary"},
  {"star_system": "Sirius", "weight": 0.50, "role": "secondary"}
]
```

## Pairwise Exclusion Rules Reference

| System A | Operator | Threshold | System B | Constraint |
|----------|----------|-----------|----------|------------|
| Pleiades | > | 0 | Draco | = 0 |
| Sirius | ≥ | 0.60 | Orion Light | ≤ 0.35 |
| Andromeda | ≥ | 0.60 | Orion Dark | = 0 |
| Arcturus | > | 0 | Pleiades | = 0 |
| Lyra | > | 0 | Draco | = 0 |
| Orion Light | > | 0.35 | Orion Dark | ≤ 0.35 or = 0 |
| Orion Dark | > | 0.35 | Orion Light | ≤ 0.35 or = 0 |

## Canonical System Order (for tie-breaking)

1. Pleiades
2. Sirius
3. Lyra
4. Andromeda
5. Orion Light
6. Orion Dark
7. Arcturus
8. Draco

## Weight Constraints

- **Range:** 0.0 to 0.95
- **Precision:** Multiples of 0.01 (0.00, 0.01, 0.02, ..., 0.95)
- **Legge-gating:** Weight >0.50 requires Legge quote from same line
- **Sparse format:** Only non-zero weights in output

## Role and Polarity

**Role:**
- `primary`: Highest weight on the line (exactly 1 per line)
- `secondary`: Second system (optional, max 1 per line)

**Polarity:**
- `core`: Healthy signature, positive expression
- `shadow`: Growth-edge, under stress, shadow work
- Required when weight ≥0.40

## Validation Checklist

Before submitting gate outputs:

- [ ] All line keys use NN.L format (zero-padded gate)
- [ ] Line keys sorted ascending (01.1, 01.2, ..., 01.6)
- [ ] Max 2 systems per line (top-2 constraint)
- [ ] Exactly 1 primary per line
- [ ] Systems sorted by weight descending within each line
- [ ] Canonical system names (exact case and spacing)
- [ ] Weights are multiples of 0.01
- [ ] Weights in range 0.0 to 0.95
- [ ] No zero weights in output (sparse format)
- [ ] Pairwise exclusion rules satisfied
- [ ] Legge quotes present for weights >0.50
- [ ] sum_unorm matches sum of all weights
- [ ] baseline_beacon matches expected value
- [ ] Polarity present for weights ≥0.40

## Getting Help

If validation fails and you're unsure how to fix it:

1. Read the error message carefully - it tells you exactly what's wrong
2. Check this quick reference for the specific error type
3. Review the full documentation in `README_VALIDATION.md`
4. Look at `GPT-5/star-maps/gateLine_star_map_Gate01.json` as a reference
5. Run the test suite to understand expected behavior: `python3 test_validate_gate_outputs.py`

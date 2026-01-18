# Invariant Fuzz Testing Script

## Overview

The `fuzz_invariants.py` script performs comprehensive testing of all pairwise exclusion rules across gate.line weight data. It validates that the scoring system maintains archetypal coherence by enforcing mutual exclusivity between incompatible star systems.

## Purpose

This script tests the following invariants:

1. **Pleiades/Draco exclusion**: If Pleiades > 0 → Draco = 0
2. **Sirius/Orion Light cap**: If Sirius ≥ 0.60 → Orion Light ≤ 0.35
3. **Andromeda/Orion Dark exclusion**: If Andromeda ≥ 0.60 → Orion Dark = 0
4. **Arcturus/Pleiades exclusion**: If Arcturus > 0 → Pleiades = 0
5. **Lyra/Draco exclusion**: If Lyra > 0 → Draco = 0
6. **Orion faction conflict**: If both Orion Light > 0 AND Orion Dark > 0 → one must be ≤ 0.35

## Usage

### Test specific gates

```bash
python fuzz_invariants.py --gates 01,03,07,10
```

### Test all available gates

```bash
python fuzz_invariants.py
```

### Save report to file

```bash
python fuzz_invariants.py --output invariants_report.txt
```

### Test all gates and save report

```bash
python fuzz_invariants.py --output GPT-5/reports/invariants_full_report.txt
```

## Output Format

The script generates a comprehensive report with:

1. **Summary**: Total gates tested, violations found, passes
2. **Rule Statistics**: Per-rule breakdown with pass rates
3. **Violations Detail**: Specific violations with gate.line and system details
4. **Rule Definitions**: Complete list of all pairwise exclusion rules
5. **Tested Gates**: List of gates included in the test run

## Exit Codes

- `0`: All tests passed (no violations)
- `1`: Violations found or error occurred

## Integration with CI

This script can be integrated into CI pipelines to automatically validate all gate outputs:

```yaml
# .github/workflows/validate-gates.yml
- name: Run invariant fuzz tests
  run: python GPT-5/scripts/fuzz_invariants.py
```

The script will fail the build if any pairwise exclusion rules are violated.

## Example Output

```
Testing 1 gate(s)...

Gate 01: ✓ All tests passed (36 checks)

================================================================================
PAIRWISE EXCLUSION INVARIANTS FUZZ TEST REPORT
================================================================================

SUMMARY
--------------------------------------------------------------------------------
Gates tested: 1
Total violations: 0
Total passes: 0

RULE STATISTICS
--------------------------------------------------------------------------------
Andromeda/Orion Dark:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

Arcturus/Pleiades:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

Lyra/Draco:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

Orion Light/Orion Dark:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

Pleiades/Draco:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

Sirius/Orion Light:
  Tested: 6
  Violations: 0
  Passes: 6
  Pass rate: 100.0%

✓ NO VIOLATIONS FOUND

RULE DEFINITIONS
--------------------------------------------------------------------------------

• Pleiades > 0.0 → Draco = 0
• Sirius ≥ 0.6 → Orion Light ≤ 0.35
• Andromeda ≥ 0.6 → Orion Dark ≤ 0.0
• Arcturus > 0.0 → Pleiades ≤ 0.0
• Lyra > 0.0 → Draco = 0
• Orion Light > 0 AND Orion Dark > 0 → one must be ≤ 0.35

TESTED GATES
--------------------------------------------------------------------------------
01

================================================================================
```

## Violation Example

If a violation is found, the report will include details:

```
VIOLATIONS DETAIL
--------------------------------------------------------------------------------
1. Gate 05, 05.3: Pleiades > 0.0 requires Draco = 0, but Draco = 0.25
2. Gate 12, 12.4: Sirius ≥ 0.6 requires Orion Light ≤ 0.35, but Orion Light = 0.45
```

## Rationale for Pairwise Exclusions

These rules enforce archetypal coherence:

- **Pleiades/Draco**: Emotional nurturing vs. dominance hierarchy
- **Sirius/Orion Light**: Liberation teaching vs. ordeal initiation (can coexist but Sirius dominates)
- **Andromeda/Orion Dark**: Liberation from captivity vs. empire control
- **Arcturus/Pleiades**: Frequency healing vs. emotional caretaking
- **Lyra/Draco**: Artistic expression vs. survival dominance
- **Orion factions**: Light (mystery schools) vs. Dark (empire control) are opposing polarities

## Requirements

- Python 3.7+
- No external dependencies (uses only standard library)

## Related Scripts

- `validate_gate_outputs.py`: Validates schema, top-2 constraint, and other structural rules
- `verify_quotes.py`: Validates quote verbatim accuracy and length
- `compute_beacon.py`: Computes baseline beacon hash

## Notes

- The script automatically skips gates with missing or invalid JSON files
- Empty gate files (not yet scored) are reported as "SKIPPED"
- Each line in each gate is tested against all 6 pairwise exclusion rules
- The script tests 6 rules × 6 lines = 36 checks per gate

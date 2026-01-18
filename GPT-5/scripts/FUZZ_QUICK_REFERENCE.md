# Fuzz Invariants Quick Reference

## Quick Commands

```bash
# Test single gate
python fuzz_invariants.py --gates 01

# Test multiple gates
python fuzz_invariants.py --gates 01,03,07,10

# Test all available gates
python fuzz_invariants.py

# Save report to file
python fuzz_invariants.py --output report.txt
```

## What It Tests

| Rule | Condition | Constraint |
|------|-----------|------------|
| Pleiades/Draco | Pleiades > 0 | Draco = 0 |
| Sirius/Orion Light | Sirius ≥ 0.60 | Orion Light ≤ 0.35 |
| Andromeda/Orion Dark | Andromeda ≥ 0.60 | Orion Dark = 0 |
| Arcturus/Pleiades | Arcturus > 0 | Pleiades = 0 |
| Lyra/Draco | Lyra > 0 | Draco = 0 |
| Orion Factions | Both > 0 | One must be ≤ 0.35 |

## Exit Codes

- `0` = All tests passed
- `1` = Violations found or error

## Typical Workflow

1. Score gate with Kiro
2. Run structural validation: `python validate_gate_outputs.py 01`
3. Run quote verification: `python verify_quotes.py 01`
4. Run fuzz tests: `python fuzz_invariants.py --gates 01`
5. Fix any violations
6. Proceed to next gate

## Common Violations

### Pleiades/Draco Conflict
```
Gate 05, 05.3: Pleiades > 0.0 requires Draco = 0, but Draco = 0.25
```
**Fix**: Remove Draco or remove Pleiades (they're mutually exclusive)

### Sirius/Orion Light Cap
```
Gate 12, 12.4: Sirius ≥ 0.6 requires Orion Light ≤ 0.35, but Orion Light = 0.45
```
**Fix**: Reduce Orion Light to ≤ 0.35 or reduce Sirius below 0.60

### Orion Faction Conflict
```
Gate 08, 08.2: Orion faction conflict - both Light (0.75) and Dark (0.45) > 0.35
```
**Fix**: Down-rank one faction to ≤ 0.35 or set to 0

## Report Sections

1. **Summary**: Total gates, violations, passes
2. **Rule Statistics**: Per-rule breakdown with pass rates
3. **Violations Detail**: Specific violations (if any)
4. **Rule Definitions**: Complete list of rules
5. **Tested Gates**: Gates included in test run

## CI Integration

Add to `.github/workflows/validate-gates.yml`:

```yaml
- name: Fuzz test invariants
  run: python GPT-5/scripts/fuzz_invariants.py
```

Build will fail if violations found.

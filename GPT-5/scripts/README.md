# GPT-5 Scripts

This directory contains validation and utility scripts for the Gate/Hexagram Star System Scoring system.

## Scripts

### compute_beacon.py

Computes the baseline beacon (SHA256 hash, first 8 characters) for the baseline file.

**Usage:**
```bash
python compute_beacon.py [baseline_file]
```

**Example:**
```bash
python compute_beacon.py ../combined-baselines-4.2.json
# Output: Baseline beacon: 59bfc617
```

If no file is specified, defaults to `../combined-baselines-4.2.json`.

### validate_schemas.py

Validates weight and evidence files against their JSON schemas (basic structural validation only).

**Usage:**
```bash
python validate_schemas.py [--weights WEIGHT_FILE] [--evidence EVIDENCE_FILE]
```

**Examples:**
```bash
# Validate example files
python validate_schemas.py

# Validate specific files
python validate_schemas.py --weights ../star-maps/gateLine_star_map_Gate02.json
python validate_schemas.py --evidence ../evidence/gateLine_evidence_Gate02.json
```

If no files are specified, validates the example files:
- `GPT-5/star-maps/gateLine_star_map_Gate01.json`
- `GPT-5/evidence/gateLine_evidence_Gate01.json`

### validate_gate_outputs.py

Comprehensive validation with all mechanical invariants (top-2, pairwise exclusions, Legge-gating, etc.).

**Usage:**
```bash
python validate_gate_outputs.py GATE_NUMBER [--beacon BEACON]
```

**Examples:**
```bash
# Validate Gate 01 with default beacon
python validate_gate_outputs.py 01

# Validate Gate 02 with custom beacon
python validate_gate_outputs.py 02 --beacon 59bfc617
```

**Validations performed:**
1. Schema validation (weights + evidence)
2. Top-2 constraint (exactly 1 primary, ≤1 secondary per line)
3. Pairwise exclusions (Pleiades/Draco, Sirius/Orion-Light, etc.)
4. Legge-gating (weight >0.50 requires same-line Legge quote)
5. Weight precision (multiples of 0.01)
6. Polarity presence (required when weight ≥ 0.40)
7. Sorting (line keys ascending, systems by weight desc)
8. Beacon match (baseline_beacon matches expected value)

### verify_quotes.py

Validates quote verbatim accuracy, length, and source attribution.

**Usage:**
```bash
python verify_quotes.py GATE_NUMBER
```

**Example:**
```bash
python verify_quotes.py 01
```

**Validations performed:**
1. Quote length (≤25 words)
2. Verbatim matching against source files
3. Legge same-line requirement (weight >0.50)
4. Line Companion line-agnostic matching
5. Locator format validation
6. Source attribution accuracy

See `README_QUOTE_VERIFICATION.md` for detailed documentation.

### fuzz_invariants.py

Fuzz tests all pairwise exclusion rules across gate data to ensure archetypal coherence.

**Usage:**
```bash
python fuzz_invariants.py [--gates GATE_LIST] [--output FILE]
```

**Examples:**
```bash
# Test specific gates
python fuzz_invariants.py --gates 01,03,07,10

# Test all available gates
python fuzz_invariants.py

# Save report to file
python fuzz_invariants.py --output invariants_report.txt
```

**Rules tested:**
1. Pleiades/Draco mutual exclusion
2. Sirius/Orion Light threshold cap
3. Andromeda/Orion Dark exclusion
4. Arcturus/Pleiades mutual exclusion
5. Lyra/Draco mutual exclusion
6. Orion Light/Dark faction conflict

See `README_FUZZ_INVARIANTS.md` for detailed documentation.

## Requirements

- Python 3.7+
- jsonschema package: `pip install jsonschema`

## Schema Files

Schemas are located in `GPT-5/schemas/`:
- `weights.schema.json` - Schema for weight files
- `evidence.schema.json` - Schema for evidence files

## Validation Rules (v4.2 - role+polarity separation)

### Weight Files
- Must have `_meta` block with version="4.2", baseline_beacon, gate, generated_at, generator, sum_unorm
- Maximum 2 star systems per line (top-2 constraint)
- Exactly 1 `role: "primary"` per line, optional 1 `role: "secondary"`
- `polarity: "core"` or `"shadow"` required for all systems
- Weights must be 0.0-0.95, multiples of 0.01
- Canonical star system names: "Pleiades", "Sirius", "Lyra", "Andromeda", "Orion Light", "Orion Dark", "Arcturus", "Draco"
- Line keys must be zero-padded (e.g., "01.1" not "1.1")
- Pairwise exclusions enforced (see validate_gate_outputs.py)
- Legge-gating: weight >0.50 requires same-line Legge quote in evidence

### Evidence Files
- Must have `_meta` block with version="4.2", baseline_beacon, gate, generated_at, generator
- Must include both Legge 1899 and Line Companion quotes
- Quotes should be ≤25 words (250 char max)
- Must include keywords (hd_keywords and ic_atoms, 2-6 each)
- Must include why_cited explanation
- Must include `polarity: "core"` or `"shadow"`
- Must include confidence (1-5)

### UI Label Mapping
- `polarity: "core"` → "Signature Mode" (UI display)
- `polarity: "shadow"` → "Growth Edge" (UI display)
- `role: "primary"` → "Primary Signal" (UI display)
- `role: "secondary"` → "Supporting Signal" (UI display)

### Important: Role vs Polarity
**Role** = ranking/priority (primary = 1st place, secondary = 2nd place by weight)  
**Polarity** = behavioral quality (core = healthy, shadow = distorted)

These are independent concepts:
- A system can be `role: "secondary"` with `polarity: "core"` (2nd-ranked, healthy)
- A system can be `role: "secondary"` with `polarity: "shadow"` (2nd-ranked, distorted)
- The "why" field in star-maps should reference the **polarity**, not the role (e.g., "Sirius core —" not "Sirius secondary —")

# Quote Verification Script

## Overview

The `verify_quotes.py` script validates all quotes in evidence files against source texts to ensure academic rigor and reproducibility.

## Features

### 1. Quote Length Validation
- Enforces ≤25 word limit for all quotes
- Uses precise word counting rules:
  - Tokenize on whitespace
  - Hyphenated words count as 1 word (e.g., "self-control")
  - Contractions count as 1 word (e.g., "don't")
  - Em-dashes and en-dashes treated as word separators
  - Punctuation alone is not a word
  - Unicode normalization (NFKC) applied before counting

### 2. Verbatim Matching
- Verifies quotes are exact substrings from source texts
- Applies minimal normalization:
  - Unicode normalization (NFKC)
  - Smart quotes → straight ASCII (' " instead of ' ' " ")
  - Collapse internal whitespace to single space
  - Strip leading/trailing whitespace
- No paraphrasing allowed
- Punctuation must match after normalization

### 3. Locator Validation

#### Legge I Ching
- Format: `"Hex {NN}, Line {L}"` where NN is zero-padded gate number, L is line 1-6
- **Same-line requirement**: Quote MUST be found within hexagram {NN} line {L} content
- Cross-checks that quote's actual source location matches locator claim

#### Line Companion
- Format: `"Gate {N}, Line {L}"` where N is gate number (may be zero-padded), L is line 1-6
- **Line-agnostic**: Gate must match, but line may differ (quote can be from any line in gate)
- Cross-checks that quote's actual gate matches locator claim

### 4. Legge-Gating Rule
- For weights >0.50: MUST have Legge quote from same line number
- For weights ≤0.50: Legge quote optional
- Enforces academic rigor for high-confidence classifications

## Usage

```bash
# Verify quotes for a specific gate
python verify_quotes.py 01
```

## Error Messages

The script provides CI-friendly error messages:

```
Quote exceeds 25 words (actual: {count} words)
Quote not found verbatim in source: {source_type} {locator}
Locator format invalid: '{locator}' (expected format: {expected_format})
Locator line mismatch: expected Hex {NN} Line {L}, but quote found in Line {actual_line}
Locator gate mismatch: expected Gate {N}, but quote found in Gate {actual_gate}
Missing Legge quote for weight >0.50 (weight: {weight}, system: {system})
```

## Source File Locations

The script searches multiple locations for source files:

### Legge I Ching
- `claude/I-Ching-Full-Pass/hexagram-{NN}.json`
- `s3-data/hexagrams/{NN}.json`

### Line Companion
- `claude/Full Pass/gate-{N}-full.json`
- `s3-data/gates/{NN}.json`
- `lore-research/research-outputs/line-companion/gates/gate-{NN}.json`

## Testing

Run the test suite:

```bash
python test_verify_quotes.py
```

Tests cover:
- Text normalization
- Word counting rules
- Locator parsing
- Quote finding in Legge sources
- Quote finding in Line Companion sources

## Integration with CI

Add to GitHub Actions workflow:

```yaml
- name: Verify quotes
  run: |
    for gate in {01..64}; do
      python GPT-5/scripts/verify_quotes.py $gate || exit 1
    done
```

## Requirements

- Python 3.7+
- No external dependencies (uses only standard library)

## Exit Codes

- `0`: All validations passed
- `1`: Validation failures detected

## Related Scripts

- `validate_gate_outputs.py`: Validates weight files and structural rules
- `compute_beacon.py`: Computes baseline beacon for deterministic scoring
- `pack_scoring_input.py`: Packs prompts with source files

## Design Principles

1. **Academic Rigor**: All quotes must be verbatim from source texts
2. **Reproducibility**: Same sources always produce same validation results
3. **CI-Friendly**: Clear error messages for automated testing
4. **Minimal Normalization**: Only normalize what's necessary for matching
5. **Source Fidelity**: Preserve original text as much as possible

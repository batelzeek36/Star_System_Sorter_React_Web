# Task 7.2 Completion Summary: Quote Verification Script

## Overview

Implemented comprehensive quote verification script (`verify_quotes.py`) that validates all quotes in evidence files against source texts to ensure academic rigor and reproducibility.

## Deliverables

### 1. Main Script: `verify_quotes.py`

**Location:** `GPT-5/scripts/verify_quotes.py`

**Features:**
- Quote length validation (≤25 words)
- Verbatim matching against source files
- Locator format and accuracy validation
- Legge same-line requirement enforcement (for weights >0.50)
- Line Companion line-agnostic matching within gate
- CI-friendly error messages

**Usage:**
```bash
python3 verify_quotes.py 01
```

### 2. Test Suite: `test_verify_quotes.py`

**Location:** `GPT-5/scripts/test_verify_quotes.py`

**Coverage:**
- Text normalization
- Word counting rules
- Locator parsing (Legge and Line Companion)
- Quote finding in Legge sources
- Quote finding in Line Companion sources

**Usage:**
```bash
python3 test_verify_quotes.py
```

### 3. Documentation

**README_QUOTE_VERIFICATION.md:**
- Comprehensive feature documentation
- Usage examples
- Error message reference
- Integration with CI
- Design principles

**VALIDATION_QUICK_REFERENCE.md (updated):**
- Added quote verification to quick start
- Added common quote validation errors
- Added fix examples for each error type

## Implementation Details

### Word Counting Rules

Implemented precise word counting according to spec:
- Tokenize on whitespace
- Collapse consecutive whitespace
- Hyphenated words count as 1 word (e.g., "self-control")
- Contractions count as 1 word (e.g., "don't")
- Em-dashes and en-dashes treated as word separators
- Punctuation alone is not a word
- Unicode normalization (NFKC) applied before counting

### Verbatim Matching Rules

Implemented minimal normalization for matching:
- Unicode normalization (NFKC)
- Smart quotes → straight ASCII (' " instead of ' ' " ")
- Collapse internal whitespace to single space
- Strip leading/trailing whitespace
- Case-sensitive substring matching
- No paraphrasing allowed

### Locator Validation

**Legge I Ching:**
- Format: `"Hex {NN}, Line {L}"`
- Same-line requirement: Quote MUST be from hexagram {NN} line {L}
- Cross-checks actual source location matches locator claim

**Line Companion:**
- Format: `"Gate {N}, Line {L}"`
- Line-agnostic: Gate must match, line may differ
- Cross-checks actual gate matches locator claim

### Source File Discovery

Script searches multiple locations for source files:

**Legge:**
- `claude/I-Ching-Full-Pass/hexagram-{NN}.json`
- `s3-data/hexagrams/{NN}.json`

**Line Companion:**
- `claude/Full Pass/gate-{N}-full.json`
- `s3-data/gates/{NN}.json`
- `lore-research/research-outputs/line-companion/gates/gate-{NN}.json`

## Error Messages

All error messages are CI-friendly and include:
- Line key (e.g., "01.1")
- Star system name
- Source type (Legge or Line Companion)
- Specific issue description
- Actual values where applicable

**Examples:**
```
01.1 (Lyra, Line Companion): Quote exceeds 25 words (actual: 32 words)
01.2 (Sirius, Legge): Quote not found verbatim in source: Legge Hex 1, Line 2
01.3 (Orion Light, Legge): Locator line mismatch: expected Hex 01 Line 3, but quote found in Line 4
01.4 (Lyra): Missing Legge quote for weight >0.50 (weight: 0.75, system: Lyra)
```

## Testing Results

All unit tests pass:
```
✓ normalize_text tests passed
✓ count_words tests passed
✓ parse_locators tests passed
✓ find_quote_in_legge tests passed
✓ find_quote_in_line_companion tests passed

✓ All tests passed!
```

## Integration with Existing Workflow

The quote verification script complements the existing validation workflow:

1. **validate_gate_outputs.py** - Validates structure and business rules
2. **verify_quotes.py** - Validates quote accuracy and source fidelity
3. **compute_beacon.py** - Computes baseline beacon

All three scripts work together to ensure complete validation coverage.

## Known Issues and Limitations

### Current Evidence File Issues

Testing with Gate 01 revealed several quote issues in the existing evidence file:
- Some quotes combine non-contiguous sentences
- Some quotes are not exact substrings from source

These are **legitimate errors** that the script correctly identifies. The evidence file will need to be updated with proper verbatim quotes.

### Source File Availability

The script requires source files to be present. If source files are missing, it will fail with a clear error message indicating which file is needed.

## Post-Review Fixes

Based on reviewer feedback, the following improvements were made:

1. **Removed --beacon flag from documentation** - The script doesn't accept this parameter, so removed it from usage examples in README_QUOTE_VERIFICATION.md

2. **Enhanced smart quotes normalization** - Expanded Unicode character mapping to cover all variants:
   - Left/right single quotes (\u2018, \u2019, \u201a, \u201b)
   - Left/right double quotes (\u201c, \u201d, \u201e, \u201f)
   - Prime marks (\u2032, \u2033)
   - Em-dash and en-dash (\u2014, \u2013)

3. **Added comprehensive quote normalization tests** - Test suite now explicitly covers curly quotes and all Unicode variants

## Next Steps

1. **Fix Gate 01 evidence file** - Update quotes to be verbatim from sources
2. **Run verification on all gates** - Once Gate 01 is fixed, verify all 64 gates
3. **Integrate with CI** - Add to GitHub Actions workflow
4. **Document quote extraction process** - Create guidelines for extracting valid quotes

## Requirements Satisfied

✅ **2.1** - Verbatim quote extraction (≤25 words)
✅ **2.2** - Source attribution validation
✅ **2.6** - Legge same-line requirement for weights >0.50
✅ **7.2** - Quote verification implementation
✅ **7.5** - Automated validation with clear error messages

## Files Created/Modified

**Created:**
- `GPT-5/scripts/verify_quotes.py` (main script)
- `GPT-5/scripts/test_verify_quotes.py` (test suite)
- `GPT-5/scripts/README_QUOTE_VERIFICATION.md` (documentation)
- `GPT-5/scripts/TASK_7.2_COMPLETION_SUMMARY.md` (this file)

**Modified:**
- `GPT-5/scripts/VALIDATION_QUICK_REFERENCE.md` (added quote verification section)

## Conclusion

Task 7.2 is complete. The quote verification script provides comprehensive validation of all quotes against source texts, ensuring academic rigor and reproducibility. The script is production-ready and can be integrated into the CI pipeline.

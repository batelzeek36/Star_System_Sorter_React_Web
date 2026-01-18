# Quote Validation Rules

## Overview

This document consolidates all rules for quote validation in the Gate/Hexagram Star System Scoring system. These rules ensure academic rigor, reproducibility, and proper source attribution for all evidence quotes.

**Purpose**: Provide a single authoritative reference for:
- Word counting methodology
- Text normalization policies
- Locator format specifications
- Verbatim matching requirements
- Error message standards

**Audience**: Developers, validators, CI systems, and anyone working with evidence files.

---

## 1. Word Counting Rules

### 1.1 Maximum Length
- **Rule**: All quotes MUST be ≤25 words
- **Rationale**: Ensures quotes are concise and focused on key evidence
- **Enforcement**: Automated validation via `verify_quotes.py`

### 1.2 Tokenization Method
Quotes are tokenized using the following rules:

1. **Whitespace Splitting**: Split text on spaces, tabs, and newlines
2. **Whitespace Collapse**: Consecutive whitespace treated as single separator
3. **Hyphenated Words**: Count as 1 word
   - Examples: "self-control", "co-regulation", "well-being"
4. **Contractions**: Count as 1 word
   - Examples: "don't", "can't", "it's", "we're"
5. **Em-dashes and En-dashes**: Treated as word separators
   - "word—word" → 2 words
   - "word–word" → 2 words
6. **Punctuation-Only Tokens**: NOT counted as words
   - Examples: ".", ",", "!", "?", ";"
7. **Unicode Normalization**: Apply NFC or NFKC before counting

### 1.3 Word Counting Algorithm

```python
def count_words(text: str) -> int:
    # Apply Unicode normalization
    text = unicodedata.normalize('NFKC', text)
    
    # Replace em-dashes and en-dashes with spaces
    text = text.replace('—', ' ').replace('–', ' ')
    
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Split on whitespace
    tokens = text.split()
    
    # Filter out punctuation-only tokens
    words = [t for t in tokens if re.search(r'[a-zA-Z0-9]', t)]
    
    return len(words)
```

### 1.4 Examples

| Quote | Word Count | Explanation |
|-------|------------|-------------|
| "the dragon appearing in the field" | 6 | Simple case |
| "self-control and well-being" | 3 | Hyphenated words = 1 each |
| "don't wait—act now!" | 3 | Contraction = 1, em-dash separates |
| "Time is everything. You have to wait." | 7 | Punctuation not counted |
| "co-regulation, care-taking, and nervous-system soothing" | 6 | Hyphens + commas |

---

## 2. Text Normalization Policy

### 2.1 Purpose
Minimal normalization to enable verbatim matching while accounting for encoding variations.

### 2.2 Normalization Steps

Apply in this order:

1. **Unicode Normalization**: NFKC (Compatibility Decomposition + Canonical Composition)
2. **Smart Quotes → Straight ASCII**:
   - Left/right single quotes (`'`, `'`, `‚`, `‛`) → `'`
   - Left/right double quotes (`"`, `"`, `„`, `‟`) → `"`
   - Prime marks (`′`, `″`) → `'` or `"`
3. **Dashes → Hyphen**:
   - Em-dash (`—`) → `-`
   - En-dash (`–`) → `-`
4. **Whitespace Collapse**: Replace runs of whitespace with single space
5. **Trim**: Strip leading/trailing whitespace

### 2.3 What NOT to Normalize

- **Case**: Preserve original case (case-sensitive matching)
- **Punctuation**: Preserve commas, periods, semicolons, etc.
- **Word Order**: No reordering
- **Spelling**: No corrections
- **Grammar**: No fixes

### 2.4 Normalization Algorithm

```python
def normalize_text(text: str) -> str:
    # Unicode normalization
    text = unicodedata.normalize('NFKC', text)
    
    # Smart quotes → straight ASCII
    text = text.replace('\u2018', "'")  # '
    text = text.replace('\u2019', "'")  # '
    text = text.replace('\u201a', "'")  # ‚
    text = text.replace('\u201b', "'")  # ‛
    text = text.replace('\u201c', '"')  # "
    text = text.replace('\u201d', '"')  # "
    text = text.replace('\u201e', '"')  # „
    text = text.replace('\u201f', '"')  # ‟
    text = text.replace('\u2032', "'")  # ′
    text = text.replace('\u2033', '"')  # ″
    
    # Dashes → hyphen
    text = text.replace('\u2014', '-')  # —
    text = text.replace('\u2013', '-')  # –
    
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Trim
    text = text.strip()
    
    return text
```

### 2.5 Rationale

- **Unicode Normalization**: Handles different encodings of same character
- **Quote Normalization**: OCR and different editors produce different quote styles
- **Dash Normalization**: Em-dashes and en-dashes often substituted for hyphens
- **Whitespace Collapse**: Line breaks and multiple spaces vary by source format

---

## 3. Locator Format Specifications

### 3.1 Legge I Ching Locator

**Format**: `"Hex {NN}, Line {L}"`

**Components**:
- `Hex`: Literal string (case-insensitive)
- `{NN}`: Gate number (1-64, may be zero-padded)
- `, `: Comma + space separator
- `Line`: Literal string (case-insensitive)
- `{L}`: Line number (1-6)

**Examples**:
- `"Hex 1, Line 2"` ✓
- `"Hex 01, Line 2"` ✓
- `"Hex 64, Line 6"` ✓
- `"hex 1, line 2"` ✓ (case-insensitive)

**Invalid**:
- `"Hexagram 1, Line 2"` ✗ (wrong keyword)
- `"Hex 1 Line 2"` ✗ (missing comma)
- `"Hex 1, L2"` ✗ (wrong format)
- `"Hex 0, Line 1"` ✗ (gate out of range)
- `"Hex 1, Line 7"` ✗ (line out of range)

**Regex Pattern**:
```python
r'Hex\s+(\d+),\s+Line\s+(\d+)'  # case-insensitive flag
```

### 3.2 Line Companion Locator

**Format**: `"Gate {N}, Line {L}"`

**Components**:
- `Gate`: Literal string (case-insensitive)
- `{N}`: Gate number (1-64, may be zero-padded)
- `, `: Comma + space separator
- `Line`: Literal string (case-insensitive)
- `{L}`: Line number (1-6)

**Examples**:
- `"Gate 1, Line 2"` ✓
- `"Gate 01, Line 2"` ✓
- `"Gate 64, Line 6"` ✓
- `"gate 1, line 2"` ✓ (case-insensitive)

**Invalid**:
- `"G1, Line 2"` ✗ (wrong keyword)
- `"Gate 1 Line 2"` ✗ (missing comma)
- `"Gate 1, L2"` ✗ (wrong format)
- `"Gate 0, Line 1"` ✗ (gate out of range)
- `"Gate 1, Line 7"` ✗ (line out of range)

**Regex Pattern**:
```python
r'Gate\s+(\d+),\s+Line\s+(\d+)'  # case-insensitive flag
```

---

## 4. Verbatim Matching Requirements

### 4.1 Definition
A quote is **verbatim** if it appears as an exact substring in the source text after normalization.

### 4.2 Matching Rules

1. **Exact Substring**: Quote must appear in source without modification
2. **Case-Sensitive**: After normalization, case must match
3. **Punctuation Preserved**: Commas, periods, etc. must match
4. **No Paraphrasing**: Even minor word changes invalidate the match
5. **No Sentence Boundary Requirement**: Quote can be partial sentence

### 4.3 Matching Algorithm

```python
def is_verbatim_match(quote: str, source: str) -> bool:
    normalized_quote = normalize_text(quote)
    normalized_source = normalize_text(source)
    return normalized_quote in normalized_source
```

### 4.4 Examples

**Source**: `"The dragon appears in the field. It will be advantageous to see the great man."`

| Quote | Verbatim? | Reason |
|-------|-----------|--------|
| `"the dragon appears in the field"` | ✓ | Exact substring |
| `"It will be advantageous to see the great man"` | ✓ | Exact substring |
| `"the dragon appears"` | ✓ | Partial sentence OK |
| `"The dragon appears in the field"` | ✓ | Case matches after normalization |
| `"the dragon is in the field"` | ✗ | Word changed ("appears" → "is") |
| `"dragon appears in field"` | ✗ | Missing words ("the") |
| `"the dragon appears in the fields"` | ✗ | Word changed ("field" → "fields") |

---

## 5. Source-Specific Rules

### 5.1 Legge I Ching Rules

#### 5.1.1 Same-Line Requirement
- **Rule**: Legge quotes MUST be found within the same line number as the gate.line being scored
- **Example**: For gate.line `01.2`, Legge quote must be from Hexagram 1, Line 2
- **Rationale**: Ensures precise source attribution and prevents cross-line contamination

#### 5.1.2 Legge-Gating Rule
- **Rule**: IF weight >0.50, THEN Legge quote MUST exist from same line
- **Rule**: IF weight ≤0.50, THEN Legge quote is optional
- **Rationale**: High-confidence classifications require strongest textual evidence

#### 5.1.3 Source File Locations
Search in order:
1. `claude/I-Ching-Full-Pass/hexagram-{NN}.json`
2. `s3-data/hexagrams/{NN}.json`

#### 5.1.4 Source File Structure
```json
{
  "hexagram": 1,
  "lines": [
    {
      "line": 1,
      "legge_line_text": "...",
      "legge_small_image": "..."
    }
  ],
  "full_text": "..."
}
```

### 5.2 Line Companion Rules

#### 5.2.1 Line-Agnostic Matching
- **Rule**: Line Companion quotes may be from ANY line within the gate
- **Example**: For gate.line `01.2`, quote can be from Gate 1, Line 1-6
- **Rationale**: Line Companion text often discusses themes across multiple lines

#### 5.2.2 Gate Must Match
- **Rule**: Line Companion quote MUST be from the same gate number
- **Example**: For gate.line `01.2`, quote must be from Gate 1 (any line)
- **Rationale**: Prevents cross-gate contamination

#### 5.2.3 Source File Locations
Search in order:
1. `claude/Full Pass/gate-{N}-full.json`
2. `s3-data/gates/{NN}.json`
3. `lore-research/research-outputs/line-companion/gates/gate-{NN}.json`

#### 5.2.4 Source File Structure
```json
{
  "gate": 1,
  "lines": [
    {
      "line": 1,
      "full_text": "...",
      "keywords": [...]
    }
  ]
}
```

---

## 6. Error Message Standards

### 6.1 Design Principles
- **CI-Friendly**: Machine-parseable format
- **Actionable**: Include specific location and issue
- **Consistent**: Same format across all error types
- **Contextual**: Include relevant values (actual vs. expected)

### 6.2 Error Message Format

```
{line_key} ({star_system}[, {source_type}]): {error_description}
```

**Components**:
- `{line_key}`: Gate.line identifier (e.g., "01.2")
- `{star_system}`: Star system name (e.g., "Lyra")
- `{source_type}`: Optional source type ("Legge" or "Line Companion")
- `{error_description}`: Specific error with context

### 6.3 Standard Error Messages

#### 6.3.1 Quote Length Errors
```
{line_key} ({star_system}, {source_type}): Quote exceeds 25 words (actual: {count} words)
```

**Example**:
```
01.2 (Lyra, Legge): Quote exceeds 25 words (actual: 28 words)
```

#### 6.3.2 Verbatim Matching Errors
```
{line_key} ({star_system}, {source_type}): Quote not found verbatim in source: {source_type} {locator}
```

**Example**:
```
01.2 (Lyra, Legge): Quote not found verbatim in source: Legge Hex 1, Line 2
```

#### 6.3.3 Locator Format Errors
```
{line_key} ({star_system}, {source_type}): Locator format invalid: '{locator}' (expected format: {expected_format})
```

**Examples**:
```
01.2 (Lyra, Legge): Locator format invalid: 'Hexagram 1, Line 2' (expected format: 'Hex NN, Line L')
01.2 (Lyra, Line Companion): Locator format invalid: 'G1, L2' (expected format: 'Gate N, Line L')
```

#### 6.3.4 Locator Line Mismatch Errors (Legge)
```
{line_key} ({star_system}, Legge): Locator line mismatch: expected Hex {NN} Line {L}, but quote found in Line {actual_line}
```

**Example**:
```
01.2 (Lyra, Legge): Locator line mismatch: expected Hex 01 Line 2, but quote found in Line 3
```

#### 6.3.5 Locator Gate Mismatch Errors (Line Companion)
```
{line_key} ({star_system}, Line Companion): Locator gate mismatch: expected Gate {N}, but quote found in Gate {actual_gate}
```

**Example**:
```
01.2 (Lyra, Line Companion): Locator gate mismatch: expected Gate 1, but quote found in Gate 2
```

#### 6.3.6 Missing Legge Quote Errors
```
{line_key} ({star_system}): Missing Legge quote for weight >0.50 (weight: {weight}, system: {star_system})
```

**Example**:
```
01.2 (Lyra): Missing Legge quote for weight >0.50 (weight: 0.78, system: Lyra)
```

### 6.4 Error Message Guidelines

**DO**:
- Include all relevant context (line, system, source)
- Show actual vs. expected values
- Use consistent formatting
- Make errors machine-parseable

**DON'T**:
- Use vague descriptions ("invalid quote")
- Omit context (which line? which system?)
- Use inconsistent formats
- Include stack traces in user-facing messages

---

## 7. Validation Workflow

### 7.1 Pre-Validation Checks
1. Verify evidence file exists
2. Verify weight file exists
3. Verify source files exist (Legge + Line Companion)
4. Load and parse all JSON files

### 7.2 Per-Quote Validation
For each quote in evidence file:

1. **Length Validation**:
   - Count words using algorithm in Section 1.3
   - Error if >25 words

2. **Locator Format Validation**:
   - Parse locator using regex in Section 3
   - Error if format invalid

3. **Verbatim Matching**:
   - Normalize quote and source using algorithm in Section 2.4
   - Check if quote is substring of source
   - Error if not found

4. **Source Location Validation**:
   - For Legge: Verify quote is from same line number
   - For Line Companion: Verify quote is from same gate
   - Error if location mismatch

5. **Legge-Gating Validation**:
   - Get weight for this system from weight file
   - If weight >0.50, verify Legge quote exists
   - Error if missing

### 7.3 Validation Script Usage

```bash
# Validate single gate
python GPT-5/scripts/verify_quotes.py 01

# Validate all gates (CI)
for gate in {01..64}; do
  python GPT-5/scripts/verify_quotes.py $gate || exit 1
done
```

### 7.4 Exit Codes
- `0`: All validations passed
- `1`: One or more validation failures

---

## 8. Common Pitfalls and Solutions

### 8.1 Quote Too Long
**Problem**: Quote exceeds 25 words

**Solutions**:
- Select a shorter excerpt from the same sentence
- Use ellipsis (`...`) to indicate omitted text (counts as 1 word)
- Choose a different sentence that captures the same theme

### 8.2 Quote Not Found Verbatim
**Problem**: Quote appears paraphrased or modified

**Solutions**:
- Copy exact text from source file (no retyping)
- Check for smart quotes vs. straight quotes
- Verify source file is correct version
- Check for OCR errors in source file

### 8.3 Locator Format Invalid
**Problem**: Locator doesn't match expected format

**Solutions**:
- Use exact format: `"Hex NN, Line L"` or `"Gate N, Line L"`
- Include comma and space between components
- Use "Hex" not "Hexagram"
- Use "Gate" not "G" or "Gt"

### 8.4 Legge Quote from Wrong Line
**Problem**: Legge quote found in different line than expected

**Solutions**:
- Find quote in correct line of hexagram
- If no suitable quote in correct line, use Line Companion instead
- If weight >0.50, must find Legge quote from same line or reduce weight to ≤0.50

### 8.5 Line Companion Quote from Wrong Gate
**Problem**: Line Companion quote found in different gate

**Solutions**:
- Find quote in correct gate (any line OK)
- Verify gate number in source file matches line_key gate
- Check for copy-paste errors

---

## 9. Integration with Validation Scripts

### 9.1 Script References

This document is referenced by:
- `GPT-5/scripts/verify_quotes.py` (implementation)
- `GPT-5/scripts/README_QUOTE_VERIFICATION.md` (usage guide)
- `GPT-5/scripts/test_verify_quotes.py` (test suite)
- `.kiro/specs/gate-hexagram-scoring-v2/design.md` (design doc)
- `.kiro/specs/gate-hexagram-scoring-v2/tasks.md` (task 7.2)

### 9.2 Validation Script Implementation

The `verify_quotes.py` script implements all rules in this document:

```python
# Word counting (Section 1)
word_count = count_words(quote)

# Text normalization (Section 2)
normalized_quote = normalize_text(quote)
normalized_source = normalize_text(source)

# Locator parsing (Section 3)
gate, line = parse_legge_locator(locator)

# Verbatim matching (Section 4)
if normalized_quote not in normalized_source:
    error(...)

# Source-specific rules (Section 5)
if weight > 0.50 and not legge_quote:
    error(...)

# Error messages (Section 6)
print(f"{line_key} ({star_system}): {error_description}")
```

### 9.3 Test Coverage

The `test_verify_quotes.py` script tests:
- Word counting edge cases
- Text normalization transformations
- Locator parsing (valid and invalid)
- Verbatim matching with various encodings
- Source-specific rules (same-line, line-agnostic)
- Error message formatting

---

## 10. Maintenance and Updates

### 10.1 Version History
- **v1.0** (2025-01-15): Initial version consolidating rules from design doc and implementation

### 10.2 Change Process
When updating these rules:

1. Update this document first
2. Update `verify_quotes.py` implementation
3. Update test suite (`test_verify_quotes.py`)
4. Update usage guide (`README_QUOTE_VERIFICATION.md`)
5. Update design doc if architectural changes
6. Run full validation suite on all 64 gates
7. Document changes in version history

### 10.3 Questions and Clarifications
For questions about these rules:
- Check implementation in `verify_quotes.py`
- Review test cases in `test_verify_quotes.py`
- Consult design doc for rationale
- Open issue for ambiguous cases

---

## Appendix A: Quick Reference

### Word Counting
- ≤25 words maximum
- Hyphenated words = 1 word
- Contractions = 1 word
- Em/en-dashes = word separators
- Punctuation alone ≠ word

### Text Normalization
- Unicode NFKC
- Smart quotes → straight ASCII
- Em/en-dashes → hyphen
- Collapse whitespace
- Trim leading/trailing

### Locator Formats
- Legge: `"Hex NN, Line L"`
- Line Companion: `"Gate N, Line L"`

### Source Rules
- Legge: Same line required
- Legge: Required if weight >0.50
- Line Companion: Line-agnostic within gate

### Error Format
```
{line_key} ({star_system}[, {source_type}]): {error_description}
```

---

## Appendix B: Validation Checklist

Use this checklist when validating quotes:

- [ ] Quote ≤25 words
- [ ] Locator format correct
- [ ] Quote found verbatim in source
- [ ] Legge quote from same line (if applicable)
- [ ] Line Companion quote from same gate (if applicable)
- [ ] Legge quote exists if weight >0.50
- [ ] All error messages follow standard format
- [ ] Source files exist and are correct version

---

**Document Status**: Authoritative Reference  
**Last Updated**: 2025-01-15  
**Maintained By**: Gate Scoring Validation Team  
**Related Documents**: 
- `GPT-5/scripts/README_QUOTE_VERIFICATION.md`
- `.kiro/specs/gate-hexagram-scoring-v2/design.md`
- `.kiro/specs/gate-hexagram-scoring-v2/requirements.md`

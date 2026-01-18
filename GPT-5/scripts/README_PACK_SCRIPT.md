# Context Packing Script Documentation

## Overview

The `pack_scoring_input.py` script creates self-contained gate prompts by inlining all required input files (baseline, gate, hexagram) as JSON code blocks within the prompt template.

## Purpose

This script addresses Task 6 of the gate-hexagram-scoring-v2 spec:
- Implement script to inline baseline, gate, and hexagram files into prompts
- Ensure packed prompts are self-contained and ready to use
- Test with Gate 1 prompt

## How It Works

### Input Files

For each gate (1-64), the script requires three input files:

1. **Baseline file** (same for all gates):
   - Path: `GPT-5/combined-baselines-4.2.json`
   - Contains: 8 star system baselines with core_themes, shadow_themes, quick_rules

2. **Gate file** (Line Companion text):
   - Path: `claude/Full Pass/gate-{N}-full.json`
   - Contains: Complete Line Companion text for all 6 lines
   - Note: Uses non-zero-padded gate number (e.g., `gate-1-full.json`)

3. **Hexagram file** (Legge I Ching text):
   - Path: `claude/I-Ching-Full-Pass/hexagram-{NN}.json`
   - Contains: Complete Legge I Ching text for all 6 lines
   - Note: Uses zero-padded hexagram number (e.g., `hexagram-01.json`)

### Processing Steps

1. **Load prompt template** from `GPT-5/prompts/gates/gate-{NN}-prompt.md`
2. **Load three JSON files** (baseline, gate, hexagram)
3. **Format JSON as markdown code blocks** with proper titles
4. **Insert inlined data** before the "BEGIN PROCESSING" section
5. **Write packed prompt** to `GPT-5/prompts/gates-packed/gate-{NN}-prompt-packed.md`

### Output Structure

The packed prompt contains:

```markdown
# Gate {N} Star System Scoring Prompt

[... original prompt instructions ...]

---

## INLINED CONTEXT DATA

**The following three files are inlined below for your reference.**

### File 1: GPT-5/combined-baselines-4.2.json

```json
{
  "version": "4.2",
  "systems": [...]
}
```

### File 2: claude/Full Pass/gate-{N}-full.json

```json
{
  "gate": {N},
  "lines": [...]
}
```

### File 3: claude/I-Ching-Full-Pass/hexagram-{NN}.json

```json
{
  "hexagram": {N},
  "lines": [...]
}
```

---

## BEGIN PROCESSING

[... rest of prompt ...]
```

## Usage

### Pack a Single Gate

```bash
python3 GPT-5/scripts/pack_scoring_input.py 1
```

### Pack Multiple Gates

```bash
python3 GPT-5/scripts/pack_scoring_input.py 1 2 3 4 5
```

### Pack All 64 Gates

```bash
python3 GPT-5/scripts/pack_scoring_input.py
```

## Output

- **Location**: `GPT-5/prompts/gates-packed/`
- **Naming**: `gate-{NN}-prompt-packed.md` (zero-padded)
- **Size**: ~75-85 KB per gate
- **Format**: Markdown with embedded JSON code blocks

## Validation

After packing, verify the output:

```bash
# Check file was created
ls -lh GPT-5/prompts/gates-packed/gate-01-prompt-packed.md

# Verify JSON is properly embedded
grep -A 5 "## INLINED CONTEXT DATA" GPT-5/prompts/gates-packed/gate-01-prompt-packed.md

# Check file size (should be ~75-85 KB)
wc -c GPT-5/prompts/gates-packed/gate-01-prompt-packed.md
```

## Error Handling

The script will fail gracefully if:

- Prompt template file is missing
- Any of the three required JSON files are missing
- JSON files contain invalid JSON syntax

Error messages clearly indicate which file is missing or invalid.

## Testing

Tested with:
- ✓ Gate 1 (primary test case)
- ✓ Gate 2, 5, 10 (additional validation)
- ✓ Zero-padding for hexagram files
- ✓ Non-zero-padding for gate files
- ✓ JSON formatting and embedding
- ✓ File size verification (~75-85 KB)

## Next Steps

After packing prompts:

1. Review packed prompts to verify format
2. Begin batch processing (Tasks 8-15)
3. Run validation scripts on LLM outputs
4. Verify deterministic scoring (same input → same output)

## Requirements Satisfied

- ✓ 5.1: Implement script to inline baseline, gate, and hexagram files
- ✓ 5.2: Ensure packed prompts are self-contained
- ✓ 5.3: Test with Gate 1 prompt
- ✓ 8.1: Support batch processing workflow

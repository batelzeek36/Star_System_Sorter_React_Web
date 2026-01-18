# GPT-5 Prompt Review Context

This folder contains all the files needed for GPT-5 to review and validate the gate prompts in `GPT-5/prompts/gates/`.

## Purpose

Verify that the generated gate prompts:
- ✅ Match requirements and design specifications
- ✅ Use correct file path formatting (zero-padded: `gate-01-full.json` not `gate-1-full.json`)
- ✅ Reference proper output schemas
- ✅ Point to accurate input file paths
- ✅ Maintain consistency across single-digit (1-9) and double-digit (10-64) gates

## File Structure

### Core Specifications (specs/)
1. **requirements.md** - Requirements the prompts must satisfy
2. **design.md** - Design specifications for the scoring system
3. **PRECISION_FIXES.md** - Recent fixes applied to address file path issues
4. **tasks.md** - Implementation tasks and workflow

### Output Schemas (schemas/)
5. **weights.schema.json** - Expected format for weight outputs
6. **evidence.schema.json** - Expected format for evidence outputs

### Prompt Templates & Samples (prompts/)
7. **gate-scoring-prompt-template.md** - Template used to generate all gate prompts
8. **gate-01-prompt.md** - Gate 1 sample (single-digit, zero-padded)
9. **gate-09-prompt.md** - Gate 9 sample (last single-digit)
10. **gate-10-prompt.md** - Gate 10 sample (first double-digit)

### Reference Data (data/)
11. **combined-baselines-4.2.json** - Star system baseline data referenced in prompts
12. **gate-1-full.json** - Sample Line Companion data structure
13. **hexagram-01.json** - Sample Legge I Ching data structure

### Validation Tools (scripts/)
14. **generate_gate_prompts.py** - Shows how {N}/{NN} placeholders are applied
15. **validate_gate_outputs.py** - Validation script for checking outputs
16. **compute_beacon.py** - Computes beacon hash for verification (expected: `59bfc617`)

### Quality Benchmark
17. **GATE_01_PILOT_TEST_REPORT.md** - Previous pilot test results for comparison

## Key Validation Points

### File Path Formatting
- ✅ **Correct**: `claude/Full Pass/gate-01-full.json`
- ❌ **Wrong**: `claude/Full Pass/gate-1-full.json`

### Consistency Checks
- Single-digit gates (1-9) should use zero-padding in file paths
- Double-digit gates (10-64) should use two digits naturally
- All prompts should reference the same baseline data file
- Schema references should be consistent across all gates

## Expected Beacon Value
The computed beacon hash for the baseline data should be: **59bfc617**

## Usage

Provide these files to GPT-5 with the instruction:
> "Review the gate prompts in `GPT-5/prompts/gates/` and verify they meet all requirements, use correct file paths, and maintain consistency across all 64 gates."

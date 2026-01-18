# Packed Gate Prompts

This directory contains self-contained, packed gate prompts ready for LLM processing.

## What are Packed Prompts?

Packed prompts are gate-specific prompts that have all required input files (baseline, gate, hexagram) inlined as JSON code blocks. This makes them completely self-contained and eliminates the need to reference external files during LLM processing.

## Structure

Each packed prompt contains:

1. **Original prompt template** - All instructions, phases, and quality gates
2. **Inlined JSON data** - Three files embedded as markdown code blocks:
   - `GPT-5/combined-baselines-4.2.json` - 8 star system baselines
   - `claude/Full Pass/gate-{N}-full.json` - Line Companion text for all 6 lines
   - `claude/I-Ching-Full-Pass/hexagram-{NN}.json` - Legge I Ching text for all 6 lines

## File Naming

- Format: `gate-{NN}-prompt-packed.md`
- Example: `gate-01-prompt-packed.md`, `gate-42-prompt-packed.md`
- Gate numbers are zero-padded (01-64)

## Usage

### For LLM Processing

Simply copy the entire contents of a packed prompt file and paste it into your LLM interface (GPT-5, Claude, etc.). The LLM will have all necessary context to:

1. Execute Phase 0 (Pre-Flight Validation)
2. Execute Phase 1 (Weight Assignment)
3. Execute Phase 2 (Evidence Extraction)
4. Execute Phase 3 (Output Generation)

### Expected Outputs

Each packed prompt will generate two JSON files:

1. **Weight file**: `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
2. **Evidence file**: `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`

## Generation

Packed prompts are generated using the `pack_scoring_input.py` script:

```bash
# Pack a single gate
python3 GPT-5/scripts/pack_scoring_input.py 1

# Pack multiple gates
python3 GPT-5/scripts/pack_scoring_input.py 1 2 3

# Pack all 64 gates
python3 GPT-5/scripts/pack_scoring_input.py
```

## File Size

Typical packed prompt size: ~75-85 KB per gate

This is well within token limits for:
- GPT-5: 128K context window
- Claude: 200K context window

## Validation

After LLM processing, validate outputs using:

```bash
# Validate schemas
python3 GPT-5/scripts/validate_schemas.py --weights GPT-5/star-maps/gateLine_star_map_Gate01.json --evidence GPT-5/evidence/gateLine_evidence_Gate01.json

# Validate gate outputs (comprehensive)
python3 GPT-5/scripts/validate_gate_outputs.py 1
```

## Notes

- Packed prompts are deterministic - same input always produces same output
- All constraints (top-2, pairwise exclusions, quote length) are enforced mechanically
- Baseline beacon is computed at runtime and embedded in output metadata
- Prompts are self-documenting with inline examples and error handling

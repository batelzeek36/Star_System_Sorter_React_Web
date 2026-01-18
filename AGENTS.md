# AGENTS.md — Gate Scoring Orchestration

## Overview

This file instructs an orchestrating agent to dispatch **64 parallel subagents**, one per gate, to complete the Gate-Hexagram Scoring tasks (Tasks 8-71 in `.kiro/specs/gate-hexagram-scoring-v2/tasks.md`).

Each subagent is responsible for **one gate and all 6 of its lines**, synthesizing Human Design, I Ching, and Star System lore to produce validated scoring outputs.

## Why Per-Gate Subagents?

- **Context efficiency**: Each agent loads only ~15KB of data (1 gate's worth) instead of 190KB+
- **Quality through focus**: Deep analysis of 6 lines rather than shallow passes over 384
- **Parallelization**: All 64 gates can be processed simultaneously
- **Independent validation**: Each gate's outputs are validated before completion

---

## Orchestrator Instructions

When you receive a task to "complete the gate scoring" or "run the scoring agents":

### Step 1: Read Prerequisites

First, verify the foundation is in place:
```
.kiro/specs/gate-hexagram-scoring-v2/tasks.md  # Task definitions
GPT-5/combined-baselines-4.2.json              # Star system baselines (shared)
GPT-5/scripts/validate_gate_outputs.py         # Validation script
GPT-5/scripts/verify_quotes.py                 # Quote verification script
```

### Step 2: Determine Which Gates Need Processing

Check which gates already have valid outputs:
```bash
ls GPT-5/star-maps/gateLine_star_map_Gate*.json 2>/dev/null | wc -l
ls GPT-5/evidence/gateLine_evidence_Gate*.json 2>/dev/null | wc -l
```

For each existing file, optionally run validation to confirm it's complete:
```bash
python GPT-5/scripts/validate_gate_outputs.py {N}
python GPT-5/scripts/verify_quotes.py {N}
```

### Step 3: Dispatch Subagents

Launch one subagent per gate that needs processing. Use the Task tool with `subagent_type: "general-purpose"`.

**Batch size recommendation**: Launch 8-16 gates at a time to avoid overwhelming the system. Example:
- Batch 1: Gates 1-8
- Batch 2: Gates 9-16
- ... and so on

**Subagent prompt template**:

```
You are a Gate Scoring Agent responsible for Gate {N} (Hexagram {NN}).

## Your Task
Analyze Gate {N}'s 6 lines and map them to star systems using HD Line Companion as the primary lens, cross-referenced with Legge I Ching.

## Input Files (READ ALL BEFORE SCORING)
1. Star system baselines: `GPT-5/combined-baselines-4.2.json`
   - Focus on: core_themes, shadow_themes, quick_rules, notes_for_alignment

2. HD Line Companion (PRIMARY source): `claude/Full Pass/gate-{N}-full.json`
   - Contains full verbatim text by Ra Uru Hu
   - Use for understanding each line's energy and extracting quotes

3. I Ching Legge (cross-reference): `claude/I-Ching-Full-Pass/hexagram-{NN}.json`
   - Contains Legge 1899 translation
   - Use for finding shared threads and extracting quotes

## Workflow for Each Line (1-6)

1. Read Line Companion text for Line {L} (`lines[{L-1}].full_text`)
2. Read Legge I Ching text for Line {L}
3. Identify core themes from HD interpretation
4. Cross-reference with Legge to find shared/divergent threads
5. Compare blended themes against star system `quick_rules`
6. Select top 1-2 systems with strongest resonance
7. Assign weights (0.00-0.95, typically 0.65-0.85 primary, 0.30-0.55 secondary)
8. Extract verbatim quotes (≤25 words each):
   - Line Companion quote: can be from any line in the gate
   - Legge quote: MUST be from same line when weight >0.50
9. Apply constraints:
   - Top-2 only per line
   - Pairwise exclusions (Pleiades/Draco, Orion Light/Dark cannot coexist)
   - Canonical ordering for ties (Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco)

## Output Files

Generate these files in the exact format shown in `GPT-5/star-maps/gateLine_star_map_Gate01.json`:

1. `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
2. `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`

Where {NN} is zero-padded (01, 02, ... 64).

## Validation (REQUIRED)

After generating files, run:
```bash
python GPT-5/scripts/validate_gate_outputs.py {N}
python GPT-5/scripts/verify_quotes.py {N}
```

If validation fails, fix the issues and re-run until both pass.

## Completion Signal

When done, run:
```bash
./scripts/ding.sh "Gate {N} scoring complete - validation passed"
```

## Key Constraints

- Weight range: 0.00-0.95 (increments of 0.01)
- Max 2 systems per line (sparse format)
- Legge same-line rule: weights >0.50 require Legge quote from same line number
- Quote max: 25 words
- Quotes must be VERBATIM (exact substring match after normalization)
```

### Step 4: Monitor Progress

Track completion across all 64 gates. Suggested tracking:
```markdown
| Batch | Gates | Status |
|-------|-------|--------|
| 1 | 1-8 | ✅ Complete |
| 2 | 9-16 | 🔄 In Progress |
| 3 | 17-24 | ⏳ Pending |
| ... | ... | ... |
```

### Step 5: Post-Processing

After all 64 gates complete:

1. Run full validation pass:
```bash
for i in {1..64}; do
  python GPT-5/scripts/validate_gate_outputs.py $i
  python GPT-5/scripts/verify_quotes.py $i
done
```

2. Generate master files (Task 73):
```bash
# Merge all gate files into master
python GPT-5/scripts/merge_gate_files.py
```

3. Generate statistics and quality report (Task 73.3, 73.4)

---

## Per-Gate Input File Reference

| Gate | Line Companion | Legge I Ching |
|------|----------------|---------------|
| 1 | `claude/Full Pass/gate-1-full.json` | `claude/I-Ching-Full-Pass/hexagram-01.json` |
| 2 | `claude/Full Pass/gate-2-full.json` | `claude/I-Ching-Full-Pass/hexagram-02.json` |
| ... | ... | ... |
| 64 | `claude/Full Pass/gate-64-full.json` | `claude/I-Ching-Full-Pass/hexagram-64.json` |

---

## Star System Quick Reference

From `GPT-5/combined-baselines-4.2.json`:

| System | Key Themes |
|--------|------------|
| Pleiades | Harmony, emotional healing, collective care, nurturing |
| Sirius | Mastery, precision, structure, sacred knowledge |
| Lyra | Creativity, music, artistic expression, beauty |
| Andromeda | Innovation, technology, progress, visionary thinking |
| Orion Light | Leadership, courage, justice, noble warrior |
| Orion Dark | Conquest, domination, ruthless ambition, shadow power |
| Arcturus | Integration, balance, higher wisdom, synthesis |
| Draco | Control, manipulation, strategic power, hidden influence |

**Pairwise Exclusions** (cannot coexist in same line):
- Pleiades ↔ Draco
- Orion Light ↔ Orion Dark

---

## Task Completion Notification

**IMPORTANT**: At the end of completing any task, always run `./scripts/ding.sh` with a custom message.

### Usage

```bash
# With custom message (preferred)
./scripts/ding.sh "Gate 01 scoring complete"
./scripts/ding.sh "Batch 1 (Gates 1-8) complete"
./scripts/ding.sh "All 64 gates validated"

# Without message (generic fallback)
./scripts/ding.sh
```

---

## Example: Launching Gates 1-8 in Parallel

```
I'll launch 8 subagents to process Gates 1-8 in parallel.

[Launch Task tool with subagent_type="general-purpose" for Gate 1]
[Launch Task tool with subagent_type="general-purpose" for Gate 2]
[Launch Task tool with subagent_type="general-purpose" for Gate 3]
...
[Launch Task tool with subagent_type="general-purpose" for Gate 8]

Waiting for all 8 to complete before starting Gates 9-16...
```

---

## Files Modified by This Process

**Created per gate:**
- `GPT-5/star-maps/gateLine_star_map_Gate{NN}.json`
- `GPT-5/evidence/gateLine_evidence_Gate{NN}.json`

**Created at end:**
- `GPT-5/gateLine_star_map_MASTER.json`
- `GPT-5/gateLine_evidence_MASTER.json`
- `GPT-5/quality_report.json`
- `GPT-5/statistics_report.json`

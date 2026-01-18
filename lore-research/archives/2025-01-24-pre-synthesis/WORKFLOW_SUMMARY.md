# Lore Research Workflow Summary

## 🚨 CRITICAL: Phase 0 Must Come First

**Before researching any gates, you MUST complete Phase 0 (Star System Baselines).**

See: `PHASE_0_EXECUTION_GUIDE.md` for complete instructions.

---

# Lore Research Workflow Summary

## What Changed

**Before:** Manual copy-paste of nearly identical prompts for each gate  
**After:** Template-based system with automation scripts

## New Structure

```
lore-research/
├── TASKS.md                          # ⭐ Main workflow & checklist
├── GATE_ARCHETYPES.md                # Quick reference for all 64 gates
├── prompts/
│   ├── TEMPLATE_PASS_A.txt           # Template for Pass A (HD/Gene Keys/I Ching)
│   ├── TEMPLATE_PASS_B.txt           # Template for Pass B (Ancient wisdom)
│   ├── TEMPLATE_PASS_C.txt           # Template for Pass C (Star systems)
│   ├── gate-1/                       # Generated prompts for Gate 1
│   │   ├── COMET_PASS_A_GATE_1.txt
│   │   ├── COMET_PASS_B_GATE_1.txt
│   │   └── COMET_PASS_C_GATE_1.txt
│   ├── gate-2/                       # Generated prompts for Gate 2
│   └── gate-3/                       # Generated prompts for Gate 3
├── scripts/
│   ├── generate-gate-prompts.sh      # Auto-generate prompts from templates
│   ├── check-progress.sh             # Show completion status
│   └── README.md                     # Script documentation
└── research-outputs/
    ├── gate-1-pass-a.json            # ✅ Complete
    ├── gate-1-pass-b.json            # ✅ Complete
    ├── gate-1-pass-c.json            # ✅ Complete
    └── gate-X-pass-[a|b|c].json      # Future outputs
```

## How to Use

### 1. Generate Prompts for a Gate

```bash
# Look up archetype in GATE_ARCHETYPES.md
./scripts/generate-gate-prompts.sh 3 "innovation through difficulty, mutation, new beginnings from chaos"
```

This creates 3 files in `prompts/gate-3/` with all variables replaced.

### 2. Research in Perplexity Comet

1. Open Perplexity Comet
2. Paste `prompts/gate-3/COMET_PASS_A_GATE_3.txt`
3. Save JSON response to `research-outputs/gate-3-pass-a.json`
4. Repeat for Pass B and Pass C

### 3. Check Progress

```bash
./scripts/check-progress.sh
```

Shows:

- ✅ Complete gates (all 3 passes done)
- ⚠️ Partial gates (1-2 passes done)
- Overall percentage

### 4. Follow the Checklist

Open `TASKS.md` and work through the gates in priority order:

1. **Phase 1**: G Center gates (identity)
2. **Phase 2**: Emotional & intuitive gates
3. **Phase 3**: Mental & logic gates
4. **Phase 4**: Power & will gates
5. **Phase 5**: Integration gates

## Key Files

| File                               | Purpose                                     |
| ---------------------------------- | ------------------------------------------- |
| `TASKS.md`                         | Main workflow, checklist, progress tracking |
| `GATE_ARCHETYPES.md`               | Keywords for all 64 gates                   |
| `CITATION_QUALITY_STANDARDS.md`    | Validation criteria                         |
| `COMET_WORKFLOW_GUIDE.md`          | Detailed instructions                       |
| `scripts/generate-gate-prompts.sh` | Automation tool                             |
| `scripts/check-progress.sh`        | Progress tracker                            |

## Benefits

1. **No duplication**: Templates eliminate copy-paste errors
2. **Consistency**: All gates use same format and standards
3. **Automation**: Scripts handle variable replacement
4. **Progress tracking**: Easy to see what's done vs pending
5. **Scalability**: Can batch-generate prompts for multiple gates
6. **Organization**: Each gate has its own folder

## Example Workflow

```bash
# Morning: Generate prompts for Gates 3-7
./scripts/generate-gate-prompts.sh 3 "innovation through difficulty, mutation, new beginnings from chaos"
./scripts/generate-gate-prompts.sh 4 "mental solutions, answers, formulization, youthful folly"
./scripts/generate-gate-prompts.sh 5 "fixed patterns, waiting, natural timing, consistency"
# ... etc

# Afternoon: Research in Comet
# Paste each prompt, save JSON responses

# Evening: Check progress
./scripts/check-progress.sh
# Shows: "Complete: 5 / 64 gates (7% complete)"
```

## Next Steps

1. ✅ Templates created
2. ✅ Scripts created
3. ✅ Gate 1 complete (baseline)
4. ✅ Gate 2 prompts generated
5. ✅ Gate 3 prompts generated
6. ⏳ Research Gate 2 in Comet
7. ⏳ Research Gate 3 in Comet
8. ⏳ Continue through all 64 gates

## Time Estimates

- **Generate prompts**: 30 seconds per gate
- **Research in Comet**: 10-15 minutes per gate (3 passes)
- **Validation**: 2-3 minutes per gate
- **Total per gate**: ~15-20 minutes
- **All 64 gates**: ~16-21 hours of research time

With templates and scripts, the workflow is now streamlined and repeatable.

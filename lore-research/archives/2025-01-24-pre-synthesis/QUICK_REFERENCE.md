# Quick Reference Card

## 🎯 To Research Next Gate

```bash
# 1. Check what's done
./scripts/check-progress.sh

# 2. Pick next gate from TASKS.md checklist

# 3. Look up archetype in GATE_ARCHETYPES.md

# 4. Generate prompts
./scripts/generate-gate-prompts.sh X "archetype keywords"

# 5. Research in Comet (paste each prompt, save JSON)
# - prompts/gate-X/COMET_PASS_A_GATE_X.txt → research-outputs/gate-X-pass-a.json
# - prompts/gate-X/COMET_PASS_B_GATE_X.txt → research-outputs/gate-X-pass-b.json
# - prompts/gate-X/COMET_PASS_C_GATE_X.txt → research-outputs/gate-X-pass-c.json

# 6. Validate against CITATION_QUALITY_STANDARDS.md
```

## 📁 Key Files

| File | What It Does |
|------|--------------|
| `TASKS.md` | Main checklist & workflow |
| `GATE_ARCHETYPES.md` | Keywords for all 64 gates |
| `scripts/generate-gate-prompts.sh` | Auto-generate prompts |
| `scripts/check-progress.sh` | Show completion status |
| `CITATION_QUALITY_STANDARDS.md` | Validation criteria |

## 🔢 Gate Priority Order

1. **G Center** (Gates 1, 2, 7, 13, 25, 46, 10, 15) - Identity
2. **Throat** (Gates 62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16) - Expression
3. **Solar Plexus** (Gates 6, 37, 22, 36, 30, 55, 49, 19, 39) - Emotion
4. **Spleen** (Gates 57, 44, 50, 32, 28, 18, 48) - Intuition
5. **Ajna** (Gates 47, 24, 4, 17, 43, 11) - Mental
6. **Head** (Gates 64, 61, 63) - Pressure
7. **Heart/Ego** (Gates 51, 21, 40, 26) - Will
8. **Sacral** (Gates 5, 14, 29, 59, 9, 3, 42, 27, 34) - Life Force
9. **Root** (Gates 53, 60, 52, 41, 58, 38, 54) - Drive

## ✅ Quality Checklist

Before marking a gate complete:
- [ ] All 3 JSON files exist
- [ ] All citations have page numbers
- [ ] All citations have actual quotes (not "unknown")
- [ ] All citations have edition info
- [ ] URLs included where available

## 📊 Current Status

Run `./scripts/check-progress.sh` to see:
- Complete gates (all 3 passes)
- Partial gates (1-2 passes)
- Overall percentage

## 🎓 Example

```bash
# Generate Gate 7 prompts
./scripts/generate-gate-prompts.sh 7 "leadership, direction, democracy, role of the self"

# This creates:
# prompts/gate-7/COMET_PASS_A_GATE_7.txt
# prompts/gate-7/COMET_PASS_B_GATE_7.txt
# prompts/gate-7/COMET_PASS_C_GATE_7.txt

# Then paste each into Comet and save responses
```

## ⏱️ Time Per Gate

- Generate prompts: 30 seconds
- Research (3 passes): 10-15 minutes
- Validation: 2-3 minutes
- **Total: ~15-20 minutes per gate**

## 🎯 Goal

64 gates × 15 minutes = **~16 hours total research time**

---

**Start here:** Open `TASKS.md` and pick the next gate from the checklist!

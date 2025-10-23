# Lore Research Scripts

Helper scripts for generating and managing gate research prompts.

## generate-prompts-for-gate.sh ⭐ RECOMMENDED

**Easiest way to generate prompts** - automatically looks up the archetype from GATE_ARCHETYPES.md.

### Usage

```bash
./generate-prompts-for-gate.sh <gate_number>
```

### Examples

```bash
# Gate 3 - automatically finds "innovation through difficulty, mutation, new beginnings from chaos"
./generate-prompts-for-gate.sh 3

# Gate 4 - automatically finds "mental solutions, answers, formulization, youthful folly"
./generate-prompts-for-gate.sh 4

# Gate 5 - automatically finds "fixed patterns, waiting, natural timing, consistency"
./generate-prompts-for-gate.sh 5
```

### What it does

1. Looks up the archetype for the gate in `GATE_ARCHETYPES.md`
2. Calls `generate-gate-prompts.sh` with the correct archetype
3. Creates all three prompt files ready to copy/paste into Perplexity Comet

---

## generate-gate-prompts.sh

**Manual version** - requires you to provide the archetype keywords yourself.

### Usage

```bash
./generate-gate-prompts.sh <gate_number> "<archetype_keywords>"
```

### Examples

```bash
# Gate 3
./generate-gate-prompts.sh 3 "innovation through difficulty, mutation, new beginnings from chaos"

# Gate 4
./generate-gate-prompts.sh 4 "mental solutions, answers, formulization, youthful folly"

# Gate 5
./generate-gate-prompts.sh 5 "fixed patterns, waiting, natural timing, consistency"
```

### What it does

1. Creates `prompts/gate-X/` directory
2. Copies templates and replaces variables:
   - `{{GATE_NUMBER}}` → actual gate number
   - `{{GATE_ARCHETYPE}}` → archetype keywords
3. Outputs 3 files:
   - `COMET_PASS_A_GATE_X.txt` (HD + Gene Keys + I Ching)
   - `COMET_PASS_B_GATE_X.txt` (Ancient wisdom connections)
   - `COMET_PASS_C_GATE_X.txt` (Star system alignments)

---

## Quick Workflow

1. **Generate prompts for a gate:**
   ```bash
   ./generate-prompts-for-gate.sh 5
   ```

2. **Copy/paste each prompt into Perplexity Comet:**
   - Open `prompts/gate-5/COMET_PASS_A_GATE_5.txt`
   - Copy entire contents
   - Paste into Perplexity Comet with browser enabled
   - Save JSON response to `research-outputs/gate-5/gate-5-pass-a.json`
   - Repeat for Pass B and Pass C

3. **Validate responses:**
   - Check against `CITATION_QUALITY_STANDARDS.md`
   - Verify all citations have page numbers
   - Ensure no blog sources
   - Confirm ancient text support in Pass C

4. **Check progress:**
   ```bash
   ./check-progress.sh  # (if available)
   ```

---

## Notes

- All generated prompts include the updated ancient text priority section in Pass C
- Prompts are saved to `prompts/gate-X/` directory
- JSON responses should be saved to `research-outputs/gate-X/` directory
- Check `GATE_ARCHETYPES.md` for archetype keywords if using manual script

---

## Future Scripts (TODO)

- `validate-research.sh` - Check if all 3 JSON files exist for a gate
- `batch-generate.sh` - Generate prompts for multiple gates at once
- `check-progress.sh` - Show which gates are complete vs pending
- `merge-outputs.sh` - Combine all gate research into master file

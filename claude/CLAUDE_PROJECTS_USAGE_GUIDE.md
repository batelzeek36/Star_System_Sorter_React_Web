# Claude Projects Usage Guide - Gate.Line Extraction

**Template:** `claude/LINE_COMPANION_PRODUCTION_TEMPLATE.json`  
**Status:** ✅ Production-ready (95%+ accuracy with validators)  
**Last Updated:** 2025-11-05

---

## Quick Start

### Per-Gate Extraction Command

Use this **exact opener** for each gate to reduce drift:

```
Use the attached template as hard rules. Load `s3-data/gates/{gate}.json` for meta (center, circuit_family, subcircuit). **Fill ONLY the placeholders for Gate {N}. Output JSON only, no prose.** If any validator fails, auto-fix and re-emit.
```

### Example Commands

**Gate 1:**
```
Use the attached template as hard rules. Load `s3-data/gates/1.json` for meta (center, circuit_family, subcircuit). **Fill ONLY the placeholders for Gate 1. Output JSON only, no prose.** If any validator fails, auto-fix and re-emit.
```

**Gate 2:**
```
Use the attached template as hard rules. Load `s3-data/gates/2.json` for meta (center, circuit_family, subcircuit). **Fill ONLY the placeholders for Gate 2. Output JSON only, no prose.** If any validator fails, auto-fix and re-emit.
```

**Gate 4:**
```
Use the attached template as hard rules. Load `s3-data/gates/4.json` for meta (center, circuit_family, subcircuit). **Fill ONLY the placeholders for Gate 4. Output JSON only, no prose.** If any validator fails, auto-fix and re-emit.
```

---

## Claude Projects Setup

### 1. Create Project

- **Name:** "HD Gate.Line Extraction"
- **Description:** "Extract gate.line data from Ra Uru Hu's Line Companion using production template"

### 2. Upload Files

**Required:**
- `claude/LINE_COMPANION_PRODUCTION_TEMPLATE.json` (the template)
- `s3-data/gates/_meta/gate-index.json` (canonical gate metadata)
- `lore-research/research-outputs/line-companion/gates/gate-{N}.json` (Line Companion source for each gate)

**Optional (for reference):**
- `claude/MECHANICAL_PRECISION_CHEATSHEET.md`
- `claude/GPT5_TEMPLATE_FIXES.md`

### 3. Project Instructions

Add this to the project's custom instructions:

```
You are extracting gate.line data from Ra Uru Hu's Line Companion using a production template with strict validators.

CRITICAL RULES:
1. ALL quotes must be VERBATIM from Line Companion source
2. Behavioral/shadow axes must be ONE SENTENCE with concrete action verbs
3. ALWAYS look up gate metadata from s3-data/gates/_meta/gate-index.json
4. NEVER infer circuit from memory - use canonical metadata
5. Apply line archetype rules strictly (2nd=hermit, 3rd=trial-and-error, 4th=externalization, 5th=projection field, 6th=role model)
6. Output JSON only, no prose
7. If validators fail, auto-fix and re-emit

Line archetype reminders:
- Line 2: "called out by others" NOT "projects outward"
- Line 3: explicitly use "trial-and-error"
- Line 4: "externalizes", "says yes then learns"
- Line 5: must include "projection field"
- Line 6: "objectivity", "role model", "wisdom"

Center-specific language:
- Ajna: "mental", "formulas" NOT "instinctive"
- Spleen: "instinctive", "in-the-moment" NOT "mental"
- G: "identity", "direction" NOT "work"
- Solar Plexus: "rides wave" NOT "control emotions"
```

---

## Workflow

### Single Gate Extraction

1. **Start new chat** in Claude Projects
2. **Paste command:** "Use the attached template as hard rules. Load `s3-data/gates/1.json` for meta..."
3. **Review output** for validator compliance
4. **Save to file:** `claude/claude-project-gates/gate-line-claude-1.json`
5. **Verify:** Check against Line Companion source

### Batch Extraction (Gates 1-64)

**Option A: Sequential (Recommended)**
- New chat per gate to prevent context drift
- Ensures each gate gets fresh template application
- Takes ~5-10 minutes per gate = 5-10 hours total

**Option B: Same Chat (Faster but riskier)**
- "Do Gate 1 with this template."
- "Now do Gate 2 with this template."
- Risk: Context drift, validator fatigue
- Requires spot-checking every 5-10 gates

---

## Validation Checklist

After each extraction, verify:

### Quote Validation
- [ ] ≤25 words
- [ ] Verbatim from Line Companion source
- [ ] No ellipses
- [ ] Punctuation/case preserved

### Axis Validation
- [ ] One sentence only
- [ ] No banned verbs (recognizes, understands, knows, realizes, sees)
- [ ] Concrete action verbs used
- [ ] Observable interpersonal behavior

### Keyword Validation
- [ ] 3-5 items
- [ ] Behavioral traits (not mystical concepts)
- [ ] Observable actions and patterns

### Mechanics Validation
- [ ] Gate center correct (check CENTER_MAP)
- [ ] Circuit family correct (check gate-index.json)
- [ ] Individual gates include melancholy/mutation/pulse
- [ ] Line 2: "called out" or "natural" (NOT "projects outward")
- [ ] Line 3: "trial-and-error" or "experiments"
- [ ] Line 4: "externalizes" or "network" or "says yes then learns"
- [ ] Line 5: "projection field"
- [ ] Line 6: "objectivity" or "role model" or "wisdom"
- [ ] Ajna gates: "mental" NOT "instinctive"
- [ ] Spleen gates: "instinctive" NOT "mental"
- [ ] G Center gates: NO "work/productivity" framing
- [ ] Solar Plexus gates: "rides wave" NOT "control emotions"

---

## Common Issues & Fixes

### Issue: Claude uses "recognizes" or "understands"
**Fix:** Remind: "Use concrete action verbs only. Replace 'recognizes' with observable behavior."

### Issue: Line 2 says "projects outward"
**Fix:** "Line 2 is HERMIT/NATURAL. They get CALLED OUT by others. They don't project - others project ONTO them."

### Issue: Quote >25 words
**Fix:** "Quote must be ≤25 words. Select the most declarative contiguous span."

### Issue: Multiple sentences in axis
**Fix:** "Behavioral and shadow axes must be ONE SENTENCE each."

### Issue: Circuit inferred from memory
**Fix:** "Look up circuit from s3-data/gates/_meta/gate-index.json. Do not infer from memory."

### Issue: Ajna gate uses "instinctive"
**Fix:** "Ajna is mental, not instinctive. Use 'mental', 'conceptual', 'formulas'."

### Issue: Individual gate missing melancholy theme
**Fix:** "This is an Individual circuit gate. Include 'melancholy', 'mutation', or 'pulse' theme."

---

## Output Format

Expected JSON structure:

```json
{
  "gate": 1,
  "gate_name": "The Creative",
  "lines": {
    "1.1": {
      "line": 1,
      "hd_title": "Creativity",
      "hd_quote": "Timing is everything and cannot be forced.",
      "keywords": ["creative timing", "mutation", "melancholy"],
      "behavioral_axis": "Waits for creative impulses without forcing them, letting timing unfold naturally.",
      "shadow_axis": "Tries to control creative output through willpower and ego, becoming unstable and frustrated.",
      "source": "Line Companion (Ra Uru Hu) via normalized chunks"
    },
    "1.2": { ... },
    "1.3": { ... },
    "1.4": { ... },
    "1.5": { ... },
    "1.6": { ... }
  }
}
```

---

## Quality Assurance

### Spot Check (Every 5 Gates)
1. Verify quotes are verbatim from Line Companion
2. Check line archetype language (2nd=hermit, 5th=projection field, etc.)
3. Verify center-specific language (Ajna=mental, Spleen=instinctive)
4. Confirm circuit themes (Individual=melancholy, etc.)

### Full Audit (After All 64 Gates)
1. Run validation script (if available)
2. Check for systematic errors (e.g., all Line 2s incorrect)
3. Verify circuit assignments match gate-index.json
4. Test scoring with sample HD charts

---

## File Naming Convention

**Output files:**
- `claude/claude-project-gates/gate-line-claude-1.json`
- `claude/claude-project-gates/gate-line-claude-2.json`
- ...
- `claude/claude-project-gates/gate-line-claude-64.json`

**Second pass refinements:**
- `claude/claude-project-gates/second-pass/gate-1-refinements.md`
- `claude/claude-project-gates/second-pass/gate-4-refinements.md`
- etc.

---

## Success Metrics

**Target Accuracy:**
- 95%+ mechanical accuracy (center/circuit context correct)
- 100% line archetype accuracy (no 2nd/5th line confusion)
- 100% quote verbatim accuracy
- 100% one-sentence axis compliance

**Expected Time:**
- 5-10 minutes per gate
- 5-10 hours for all 64 gates
- 2-3 hours for validation/QA

---

## Troubleshooting

### Claude ignores template rules
**Solution:** Start new chat, use exact command format, emphasize "hard rules"

### Context drift after multiple gates
**Solution:** Start new chat every 5-10 gates

### Validators not catching errors
**Solution:** Manually verify first few gates, adjust template if needed

### Circuit assignments wrong
**Solution:** Verify gate-index.json is uploaded and accessible

---

## Next Steps After Extraction

1. **Validate outputs** against Line Companion source
2. **Run scoring tests** with sample HD charts
3. **Document improvements** in classification accuracy
4. **Apply corrections** to existing gate.line files if needed
5. **Integrate** into star system scoring algorithm

---

## Support Files

- **Template:** `claude/LINE_COMPANION_PRODUCTION_TEMPLATE.json`
- **Gate Metadata:** `s3-data/gates/_meta/gate-index.json`
- **Cheatsheet:** `claude/MECHANICAL_PRECISION_CHEATSHEET.md`
- **Fixes Doc:** `claude/GPT5_TEMPLATE_FIXES.md`
- **Usage Guide:** `claude/CLAUDE_PROJECTS_USAGE_GUIDE.md` (this file)

# Lore Research Tasks

Organized workflow for researching star systems and all 64 Human Design gates.

## 📋 Scope

- **Phase 0:** 8 star systems (baseline characteristics)
- **Phase 1:** 64 Human Design gates (all gates, 3 passes each = 192 prompts)
- **Total:** 200 research prompts with strict citation requirements

## 📁 Templates Location

All prompts are generated from templates in `lore-research/prompts/`:
- **Phase 0:** `PHASE_0_ALL_STAR_SYSTEMS.md` (8 star system prompts ready to use)
- **Phase 1:** `TEMPLATE_PASS_A.txt`, `TEMPLATE_PASS_B.txt`, `TEMPLATE_PASS_C.txt` (for all 64 gates)

Kiro will read these templates and generate prompts with the correct variables filled in.

## ⚠️ CRITICAL: Research Order

**Phase 0 (Star Systems) MUST be completed BEFORE Phase 1 (Gates)**

Why? You cannot match gates to star systems if you haven't proven what the star systems represent.

See `lore-research/Important!/RESEARCH_PHASES.md` for detailed explanation.

---

## Phase 0: Star System Baseline Research (DO THIS FIRST)

### Goal

Establish documented characteristics for all 8 star systems with 5+ sources each.

### Required Reading

**Before starting Phase 0, review:**
- `lore-research/star-systems/BASELINE_SYNTHESIS.md` - Authoritative baseline combining GPT-4o traits with GPT-5 evidence standards
- `lore-research/Important!/STAR_SYSTEM_BASELINE_RESEARCH.md` - Detailed Phase 0 guide
- `lore-research/CITATION_QUALITY_STANDARDS.md` - Validation criteria

### Workflow

1. **Pick a star system** from checklist below
2. **Ask Kiro** to generate the baseline research prompt
   - Example: "Generate the baseline research prompt for Sirius"
   - Kiro will create a prompt with strict citation requirements from BASELINE_SYNTHESIS.md
3. **Research in Perplexity Comet**
   - Paste the prompt
   - Save JSON response to `research-outputs/star-system-[name]-baseline.json`
4. **Validate** against `BASELINE_SYNTHESIS.md` red flags and `CITATION_QUALITY_STANDARDS.md`
5. **Mark complete** in checklist below

### Phase 0 Checklist

**Primary 6 Star Systems:**
- [ ] Sirius (teachers, guardians, Sirian-Christos lineage)
- [ ] Pleiades (nurturers, artists, empaths, Seven Sisters)
- [ ] Orion Light/Osirian (historians, Egyptian mystery schools, Thoth/Hermes)
- [ ] Arcturus (engineers, healers, geometric consciousness)
- [ ] Andromeda (explorers, iconoclasts, freedom, sovereignty)
- [ ] Lyra (primordial builders, feline beings, instinct)

**Additional Systems (Optional):**
- [ ] Draco (power, will, hierarchy, kundalini - disputed)
- [ ] Zeta Reticuli (analysts, experimenters, detachment)

### Success Criteria for Phase 0

✅ All 6 primary systems have documented characteristics  
✅ Each characteristic has 5+ sources with full citations  
✅ Consensus patterns are identified  
✅ Ancient + modern sources are balanced  
✅ All citations have page numbers, quotes, editions, URLs

**Time Estimate:** ~20 hours (2-3 days focused work)

---

## Phase 1: Gate Research (AFTER Phase 0 Complete)

### Goal

Map 64 Human Design gates to star systems based on documented characteristics from Phase 0.

### Workflow

1. **Check progress**: `./scripts/check-progress.sh`
2. **Pick a gate** from checklist below (start with G Center gates)
3. **Ask Kiro** to generate the 3 prompts for that gate
   - Example: "Generate prompts for Gate 3"
   - Kiro will look up the archetype and create 3 prompts from templates
4. **Research in Perplexity Comet**:
   - Paste `COMET_PASS_A_GATE_X.txt` → save JSON to `research-outputs/gate-X-pass-a.json`
   - Paste `COMET_PASS_B_GATE_X.txt` → save JSON to `research-outputs/gate-X-pass-b.json`
   - Paste `COMET_PASS_C_GATE_X.txt` → save JSON to `research-outputs/gate-X-pass-c.json`
5. **Validate**: Check responses against `CITATION_QUALITY_STANDARDS.md`
6. **Mark complete** in checklist below

### Phase 1 Checklist

#### Priority 1: G Center (Identity & Direction)

- [ ] Gate 1 - Self-Expression ✅ (COMPLETE - all 3 passes done)
- [ ] Gate 2 - Direction (prompts generated, needs research)
- [ ] Gate 7 - The Army
- [ ] Gate 13 - The Listener
- [ ] Gate 25 - Innocence
- [ ] Gate 46 - Determination
- [ ] Gate 10 - Self-Love
- [ ] Gate 15 - Extremes

#### Priority 2: Throat Center (Expression & Manifestation)

- [ ] Gate 62 - Details
- [ ] Gate 23 - Assimilation
- [ ] Gate 56 - Stimulation
- [ ] Gate 35 - Change
- [ ] Gate 12 - Caution
- [ ] Gate 45 - The Gatherer
- [ ] Gate 33 - Privacy
- [ ] Gate 8 - Contribution
- [ ] Gate 31 - Influence
- [ ] Gate 20 - The Now
- [ ] Gate 16 - Skills

#### Priority 3: Solar Plexus (Emotional Authority)

- [ ] Gate 6 - Friction
- [ ] Gate 37 - Friendship
- [ ] Gate 22 - Grace
- [ ] Gate 36 - Crisis
- [ ] Gate 30 - Feelings
- [ ] Gate 55 - Spirit
- [ ] Gate 49 - Revolution
- [ ] Gate 19 - Wanting
- [ ] Gate 39 - Provocation

#### Priority 4: Spleen Center (Intuition & Survival)

- [ ] Gate 57 - Intuition
- [ ] Gate 44 - Alertness
- [ ] Gate 50 - Values
- [ ] Gate 32 - Continuity
- [ ] Gate 28 - The Game Player
- [ ] Gate 18 - Correction
- [ ] Gate 48 - Depth

#### Priority 5: Ajna Center (Mental Awareness)

- [ ] Gate 47 - Realization
- [ ] Gate 24 - Rationalization
- [ ] Gate 4 - Mental Solutions
- [ ] Gate 17 - Opinions
- [ ] Gate 43 - Insight
- [ ] Gate 11 - Ideas

#### Priority 6: Head Center (Mental Pressure)

- [ ] Gate 64 - Confusion
- [ ] Gate 61 - Mystery
- [ ] Gate 63 - Doubt

#### Priority 7: Heart/Ego Center (Willpower)

- [ ] Gate 51 - Shock
- [ ] Gate 21 - Control
- [ ] Gate 40 - Aloneness
- [ ] Gate 26 - The Egoist

#### Priority 8: Sacral Center (Life Force)

- [ ] Gate 5 - Fixed Rhythms
- [ ] Gate 14 - Power Skills
- [ ] Gate 29 - Perseverance
- [ ] Gate 59 - Sexuality
- [ ] Gate 9 - Focus
- [ ] Gate 3 - Ordering
- [ ] Gate 42 - Growth
- [ ] Gate 27 - Caring
- [ ] Gate 34 - Power

#### Priority 9: Root Center (Pressure & Drive)

- [ ] Gate 53 - Beginnings
- [ ] Gate 60 - Limitation
- [ ] Gate 52 - Stillness
- [ ] Gate 41 - Contraction
- [ ] Gate 58 - Vitality
- [ ] Gate 38 - The Fighter
- [ ] Gate 54 - Ambition

### Gate Count Summary

**Total Gates in Checklist:** 64 (Gates 1-64, all present)

Breakdown by center:
- G Center: 8 gates
- Throat: 11 gates
- Solar Plexus: 9 gates
- Spleen: 7 gates
- Ajna: 6 gates
- Head: 3 gates
- Heart/Ego: 4 gates
- Sacral: 9 gates
- Root: 7 gates

**Total: 64 gates** ✅

### Success Criteria for Phase 1

✅ **All 64 gates researched** with 3 passes each (192 total prompts)  
✅ All citations meet quality standards  
✅ 3-5 star system alignments per gate  
✅ Confidence levels assigned  
✅ Integration with Phase 0 baseline

**Scope:** This is a complete research project covering:
- 64 Human Design gates (every gate from 1-64, all listed above)
- 3 research passes per gate (A: Foundation, B: Ancient Wisdom, C: Star Systems)
- 192 total JSON outputs (64 gates × 3 passes)

**Time Estimate:** ~16 hours (1-2 days focused work) for all 64 gates

---

## Task Templates

### Task: Generate Star System Baseline Prompt (Phase 0)

**User Action:**
```
"Generate the baseline research prompt for [STAR SYSTEM NAME]"
```

**Kiro Action:**
1. Read template from `lore-research/prompts/PHASE_0_ALL_STAR_SYSTEMS.md`
2. Extract the prompt for the requested star system
3. Present it to user for pasting into Perplexity Comet

**Note:** All 8 star system prompts already exist in `lore-research/prompts/PHASE_0_ALL_STAR_SYSTEMS.md`. Kiro will extract the relevant one.

### Task: Generate Gate Prompts (Phase 1)

**User Action:**
```
"Generate prompts for Gate X"
```

**Kiro Action:**
1. Look up archetype in `lore-research/GATE_ARCHETYPES.md`
2. Read templates from `lore-research/prompts/`:
   - `TEMPLATE_PASS_A.txt` (HD/Gene Keys/I Ching)
   - `TEMPLATE_PASS_B.txt` (Ancient wisdom connections)
   - `TEMPLATE_PASS_C.txt` (Star system alignments)
3. Replace variables:
   - `{{GATE_NUMBER}}` → actual gate number
   - `{{GATE_ARCHETYPE}}` → keywords from GATE_ARCHETYPES.md
4. Create 3 prompts and present them to user for pasting into Perplexity Comet

**Note:** Templates use strict citation requirements (page numbers, quotes, editions, URLs). All 64 gates will use these same templates with different variables.

### Task: Validate Research Output

**Steps:**
1. Check all JSON files exist
2. Run validation checklist from `COMET_RESPONSE_CHECKLIST.md`
3. Verify citations have page numbers, quotes, editions, URLs
4. If any response fails validation, re-run that pass with stricter instructions
5. Mark as validated in checklist

---

## Output Organization

```
research-outputs/
├── star-system-sirius-baseline.json      # Phase 0
├── star-system-pleiades-baseline.json    # Phase 0
├── star-system-orion-baseline.json       # Phase 0
├── ...
├── gate-1-pass-a.json                    # Phase 1 ✅
├── gate-1-pass-b.json                    # Phase 1 ✅
├── gate-1-pass-c.json                    # Phase 1 ✅
├── gate-2-pass-a.json                    # Phase 1 (pending)
└── ...
```

---

## Quality Standards

Before marking complete:

1. ✅ All required JSON files exist
2. ✅ All citations have page numbers or specific sections
3. ✅ All citations have actual quotes (not "unknown")
4. ✅ All citations have edition information
5. ✅ URLs included where available
6. ✅ JSON is valid and minified
7. ✅ Follows schema from templates

See `CITATION_QUALITY_STANDARDS.md` for full criteria.

---

## Progress Tracking

### Check Overall Progress

```bash
cd lore-research
./scripts/check-progress.sh
```

Shows:
- ✅ Complete gates (all 3 passes)
- ⚠️ Partial gates (1-2 passes)
- Overall percentage

---

## Timeline

| Phase | Scope | Time | Status |
|-------|-------|------|--------|
| Phase 0: Star Systems | 8 systems × 1 prompt each | ~20 hours | ⏳ NOT STARTED |
| Phase 1: Gates | 64 gates × 3 prompts each = 192 prompts | ~16 hours | 🔒 BLOCKED (needs Phase 0) |
| **Total** | **8 + 192 = 200 prompts** | **~36 hours** | **3-5 days focused work** |

**Progress Tracking:**
- Phase 0: 0/8 star systems complete (0%)
- Phase 1: 1/64 gates complete (Gate 1 done, 63 remaining) (1.5%)

---

## Next Steps

1. ✅ Templates created
2. ✅ Scripts created
3. ✅ Gate 1 complete (baseline)
4. ⏳ **START HERE:** Phase 0 - Star System Baseline Research
5. ⏳ Phase 1 - Gate Research (after Phase 0)
6. ⏳ Compile into lore.yaml
7. ⏳ Integrate with scorer

---

## Key Files

| File | Purpose |
|------|---------|
| `lore-research/star-systems/BASELINE_SYNTHESIS.md` | **Authoritative baseline** - GPT-4o traits + GPT-5 evidence standards |
| `lore-research/Important!/RESEARCH_PHASES.md` | Why Phase 0 must come first |
| `lore-research/Important!/STAR_SYSTEM_BASELINE_RESEARCH.md` | Phase 0 detailed guide |
| `lore-research/GATE_ARCHETYPES.md` | Keywords for all 64 gates |
| `lore-research/CITATION_QUALITY_STANDARDS.md` | Validation criteria |
| `lore-research/COMET_WORKFLOW_GUIDE.md` | Detailed instructions |
| `scripts/check-progress.sh` | Progress tracker |

---

**Current Status:** Ready to start Phase 0 (Star System Baseline Research)  
**Next Action:** Ask Kiro to generate baseline prompt for first star system (recommend starting with Sirius)

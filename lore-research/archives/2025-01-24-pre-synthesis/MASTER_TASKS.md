# Lore Research - Master Task List

**Last Updated:** 2025-01-23  
**Current Phase:** Phase 0 (Star System Baselines)  
**Status:** Ready to execute Comet research

---

## 🎯 WHERE YOU ARE NOW

You have:
- ✅ 9 bulletproof Phase 0 prompts ready for Comet
- ✅ GPT-4o's preliminary star system analysis (3 new docs)
- ✅ Ancient source library compiled
- ✅ Citation quality standards defined
- ✅ Gate research templates (Pass A/B/C) ready for Phase 1

You need to:
- ⏳ Execute Phase 0 research with Comet (validate GPT-4o's claims with citations)
- ⏳ Then proceed to Phase 1 (gate research)

---

## 📊 THE BIG PICTURE

```
Phase 0: Star System Baselines (YOU ARE HERE)
    ↓
Phase 1: Gate Research (64 gates × 3 passes)
    ↓
Phase 2: BEAM Validation
    ↓
Phase 3: Compilation into lore.yaml
    ↓
Phase 4: App Integration
```

---

## 🚀 IMMEDIATE NEXT STEPS (Phase 0)

### Task 0.1: Execute Comet Research for All 9 Star Systems
**Priority:** CRITICAL  
**Time Estimate:** 18-27 hours  
**Status:** NOT STARTED

**What to do:**
1. Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/INDEX.md`
2. Start with SIRIUS (easiest)
3. Copy entire prompt from `SIRIUS_BASELINE.txt`
4. Paste into Perplexity Comet
5. Wait for JSON response
6. Validate using checklist in prompt
7. Save as `lore-research/research-outputs/star-systems/sirius-baseline.json`
8. Repeat for all 9 systems

**Order (easiest to hardest):**
1. Sirius
2. Pleiades
3. Orion Light
4. Draco
5. Arcturus
6. Andromeda
7. Lyra
8. Orion Dark
9. Zeta Reticuli

**Deliverables:**
- [ ] sirius-baseline.json
- [ ] pleiades-baseline.json
- [ ] orion-light-baseline.json
- [ ] orion-dark-baseline.json
- [ ] andromeda-baseline.json
- [ ] lyra-baseline.json
- [ ] arcturus-baseline.json
- [ ] draco-baseline.json
- [ ] zeta-reticuli-baseline.json

**Quality Check:**
- Each JSON must have 3-5 characteristics
- Each characteristic must have 5+ sources
- All sources must have specific page numbers
- All sources must have actual quotes ≤25 words
- Disputed claims must have counter-evidence

---

### Task 0.2: Cross-Check GPT-4o Claims
**Priority:** HIGH  
**Time Estimate:** 4-6 hours  
**Status:** NOT STARTED  
**Depends On:** Task 0.1

**What to do:**
1. Read GPT-4o's 3 new docs:
   - `gpt-4o-systems.md`
   - `gpt-4o-cross-system-matrix.md`
   - `gpt-4o-star-system-storyline.md`
2. Compare GPT-4o's claims against Comet's cited research
3. Mark claims as:
   - ✅ VALIDATED (Comet found 3+ sources)
   - ⚠️ PARTIAL (Comet found 1-2 sources)
   - ❌ UNSUPPORTED (Comet found no sources)
4. Create validation report

**Deliverables:**
- [ ] `lore-research/validation/gpt-4o-claims-validation.md`

---

### Task 0.3: Compile Star System Baselines
**Priority:** HIGH  
**Time Estimate:** 2-4 hours  
**Status:** NOT STARTED  
**Depends On:** Tasks 0.1, 0.2

**What to do:**
1. Combine all 9 JSON files into master YAML
2. Cross-reference with GPT-4o's validated claims
3. Resolve any conflicts (prefer Comet's cited sources)
4. Create final authoritative baseline

**Deliverables:**
- [ ] `lore-research/star-systems/COMPILED_BASELINES.yaml`
- [ ] `lore-research/star-systems/CONFLICTS_RESOLVED.md`

---

## 📋 PHASE 1 TASKS (After Phase 0 Complete)

### Task 1.1: Generate Gate Prompts
**Priority:** MEDIUM  
**Time Estimate:** 2 hours  
**Status:** NOT STARTED  
**Depends On:** Task 0.3

**What to do:**
1. Use `scripts/generate-gate-prompts.sh` to create 64 gate prompts
2. Each gate gets 3 prompts (Pass A, B, C)
3. Prompts reference compiled star system baselines

**Deliverables:**
- [ ] 192 gate prompt files (64 gates × 3 passes)

---

### Task 1.2: Execute Gate Research
**Priority:** MEDIUM  
**Time Estimate:** 16-32 hours  
**Status:** NOT STARTED  
**Depends On:** Task 1.1

**What to do:**
1. Run Pass A for all 64 gates (Comet)
2. Run Pass B for all 64 gates (Comet)
3. Run Pass C for all 64 gates (Comet)
4. Validate each response

**Deliverables:**
- [ ] 192 JSON files (64 gates × 3 passes)

---

### Task 1.3: BEAM Validation
**Priority:** MEDIUM  
**Time Estimate:** 8-16 hours  
**Status:** NOT STARTED  
**Depends On:** Task 1.2

**What to do:**
1. Run BEAM validation on all gate outputs
2. Check for consistency across passes
3. Identify conflicts and resolve

**Deliverables:**
- [ ] BEAM validation reports
- [ ] Conflict resolution docs

---

## 🎨 APP INTEGRATION TASKS (After Phase 1 Complete)

### Task 2.1: Update Scorer
**Priority:** HIGH  
**Time Estimate:** 4-8 hours  
**Status:** NOT STARTED

**What to do:**
1. Add Orion Dark, Draco, Zeta Reticuli to scorer
2. Update classification logic for 9 systems
3. Test deterministic results

**Deliverables:**
- [ ] Updated `scorer.ts`
- [ ] Updated `schemas.ts`
- [ ] Test coverage

---

### Task 2.2: Create Missing Crests
**Priority:** HIGH  
**Time Estimate:** Design work (external)  
**Status:** NOT STARTED

**What to do:**
1. Design crests for:
   - Orion Dark
   - Draco
   - Zeta Reticuli
2. Ensure visual distinction from existing crests

**Deliverables:**
- [ ] 3 new crest SVGs

---

### Task 2.3: Update UI
**Priority:** HIGH  
**Time Estimate:** 4-8 hours  
**Status:** NOT STARTED

**What to do:**
1. Update result screen for 9 systems
2. Add Orion Light/Dark distinction in UI
3. Update "Why" screen with new lore

**Deliverables:**
- [ ] Updated ResultScreen.tsx
- [ ] Updated WhyScreen.tsx
- [ ] Updated DossierScreen.tsx

---

## 📁 FILE ORGANIZATION

### Current Structure
```
lore-research/
├── MASTER_TASKS.md ← YOU ARE HERE
├── PHASE_0_EXECUTION_GUIDE.md ← Read this for Phase 0 details
├── STAR_SYSTEMS_FINAL_LIST.md ← Authoritative 9-system list
├── prompts/
│   ├── PHASE_0_STAR_SYSTEMS/ ← 9 prompts ready to use
│   │   ├── INDEX.md ← Start here
│   │   ├── SIRIUS_BASELINE.txt
│   │   ├── PLEIADES_BASELINE.txt
│   │   ├── ORION_LIGHT_BASELINE.txt
│   │   ├── ORION_DARK_BASELINE.txt
│   │   ├── ANDROMEDA_BASELINE.txt
│   │   ├── LYRA_BASELINE.txt
│   │   ├── ARCTURUS_BASELINE.txt
│   │   ├── DRACO_BASELINE.txt
│   │   ├── ZETA_RETICULI_BASELINE.txt
│   │   ├── gpt-4o-systems.md ← GPT-4o's analysis
│   │   ├── gpt-4o-cross-system-matrix.md
│   │   └── gpt-4o-star-system-storyline.md
│   ├── TEMPLATE_PASS_A.txt ← Ready for Phase 1
│   ├── TEMPLATE_PASS_B.txt
│   └── TEMPLATE_PASS_C.txt
├── research-outputs/
│   ├── star-systems/ ← Save Comet responses here
│   └── gates/ ← Phase 1 outputs go here
└── source-mining/
    └── !ESOTERIC_SOURCE_LIBRARY.md ← Reference library
```

---

## ⏱️ TIME ESTIMATES

### Phase 0 (Current)
- Task 0.1: 18-27 hours (Comet research)
- Task 0.2: 4-6 hours (validation)
- Task 0.3: 2-4 hours (compilation)
- **Total: 24-37 hours**

### Phase 1 (Next)
- Task 1.1: 2 hours (prompt generation)
- Task 1.2: 16-32 hours (gate research)
- Task 1.3: 8-16 hours (BEAM validation)
- **Total: 26-50 hours**

### Phase 2 (App Integration)
- Task 2.1: 4-8 hours (scorer)
- Task 2.2: External (design)
- Task 2.3: 4-8 hours (UI)
- **Total: 8-16 hours + design time**

### Grand Total: 58-103 hours

---

## 🎯 SUCCESS CRITERIA

### Phase 0 Complete When:
- ✅ All 9 star systems have baseline JSON files
- ✅ Each system has 3-5 characteristics with 5+ cited sources
- ✅ GPT-4o's claims are validated or marked unsupported
- ✅ Compiled baseline YAML exists
- ✅ All disputed claims have counter-evidence noted

### Phase 1 Complete When:
- ✅ All 64 gates have Pass A/B/C research
- ✅ BEAM validation shows consistency
- ✅ Conflicts are resolved
- ✅ lore.yaml is compiled

### Phase 2 Complete When:
- ✅ App supports 9 star systems
- ✅ All crests exist
- ✅ UI properly distinguishes Orion Light/Dark
- ✅ Tests pass

---

## 🚨 BLOCKERS & DEPENDENCIES

### Current Blockers: NONE
All Phase 0 prompts are ready. You can start immediately.

### Dependencies:
- Phase 1 depends on Phase 0 completion
- Phase 2 depends on Phase 1 completion
- Crest design is external dependency

---

## 📞 QUICK REFERENCE

**Where to start:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/INDEX.md`  
**First task:** Copy `SIRIUS_BASELINE.txt` into Perplexity Comet  
**Save results:** `lore-research/research-outputs/star-systems/`  
**Quality check:** Use checklist in each prompt  
**Questions:** Refer to `PHASE_0_EXECUTION_GUIDE.md`

---

## 📝 NOTES

- Phase 0 is the foundation - don't skip it
- Reject weak Comet responses and re-prompt
- GPT-4o's claims need citation validation
- Ancient sources provide legitimacy
- Keep Orion Light/Dark distinction clear
- Don't conflate Draco with kundalini

---

**Next Action:** Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/INDEX.md` and begin with Sirius.

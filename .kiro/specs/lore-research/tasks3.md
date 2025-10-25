# Implementation Plan - Lore Research & Gate Mapping (Part 3)

## Phase 4: App Integration - Continued

- [ ] 4. App Integration (continued)
- [ ] 4.10 Update DossierScreen with new lore

  - Update `star-system-sorter/src/screens/DossierScreen.tsx`
  - Integrate new lore data
  - Show Gate.Line breakdowns
  - Ensure all 9 systems display correctly
  - _Time: 4-6 hours_
  - _Depends on: 4.9_

- [ ] 4.11 Implement feature flags

  - Toggle: "Show interpretive star-lore" (on/off)
  - Default: ON with "Interpretive" label
  - Store in user preferences
  - _Time: 2-4 hours_
  - _Depends on: 4.10_

- [ ] 4.12 Update product documentation
  - Update `.kiro/steering/product.md` with 9 systems
  - Update `README.md` with Gate.Line research
  - Update any other relevant docs
  - _Time: 2-3 hours_
  - _Depends on: 4.11_

**Phase 4 Total Time: 43-69 hours + design time**

---

## Phase 5: Testing & QA

- [ ] 5. Testing & QA
- [ ] 5.1 Unit tests for scoring and resolver

  - Test `star-system-sorter/src/lib/scorer.ts` with 9 systems
  - Test `star-system-sorter/src/lib/getGateLineLore.ts`
  - Test planetary modifiers
  - Test data layer vs interpretation layer separation
  - Run with Vitest
  - _Time: 4-6 hours_
  - _Depends on: Phase 4 complete_

- [ ] 5.2 Schema validation in CI

  - Integrate AJV validation into CI pipeline
  - Verify all 384 Gate.Line files validate
  - Verify all 6 line archetype files validate
  - Verify all 9 star system files validate
  - Verify all 64 gate files validate
  - _Time: 2-3 hours_
  - _Depends on: 5.1_

- [ ] 5.3 E2E tests (Playwright)

  - Test: / → /input → /result → /why → /dossier
  - Test Gate.Line page renders correctly
  - Test citations drawer opens and displays
  - Test planetary modifiers show as tooltips
  - Test feature flag toggle (show/hide interpretive lore)
  - _Time: 6-8 hours_
  - _Depends on: 5.2_

- [ ] 5.4 Snapshot tests for Tier 1 entries

  - Create snapshot tests for 20-30 Tier 1 Gate.Lines
  - Protect against regressions
  - _Time: 2-4 hours_
  - _Depends on: 5.3_

- [ ] 5.5 Manual QA - Full flow

  - Test: / → /input → /result → /why → /dossier → /gate/{N}/line/{L}
  - Verify all 9 systems can be classified
  - Verify Orion Light/Dark distinction is clear
  - Verify all crests display correctly
  - Verify Gate.Line pages load and display correctly
  - _Time: 2-3 hours_
  - _Depends on: 5.4_

- [ ] 5.6 Manual QA - Edge cases

  - Test hybrid classifications with new systems
  - Test unresolved classifications
  - Test with various HD chart configurations
  - Test rare Gate.Line combinations
  - _Time: 2-3 hours_
  - _Depends on: 5.5_

- [ ] 5.7 Performance validation

  - Verify classification completes in <100ms
  - Verify UI renders in <200ms
  - Check bundle size increase (lazy loading working?)
  - Test with all 384 Gate.Lines loaded
  - _Time: 2-3 hours_
  - _Depends on: 5.6_

- [ ] 5.8 Accessibility audit
  - Verify keyboard navigation works (including Gate.Line pages)
  - Verify screen reader compatibility
  - Verify color contrast ratios
  - Verify touch target sizes (44px minimum)
  - Test citations drawer accessibility
  - _Time: 2-3 hours_
  - _Depends on: 5.7_

**Phase 5 Total Time: 22-33 hours**

---

## Phase 6: Methods, Citations, and Release Documentation

- [ ] 6. Methods, Citations, and Release Documentation
- [ ] 6.1 Create METHODS.md

  - **Location:** `lore-research/METHODS.md`
  - **Contents:**
    - Humanities framing (digital humanities + comparative mythology)
    - Research methodology (I Ching triangulation, HD structure, star-lore correlation)
    - Limits of claims (interpretive, not scientific proof)
    - Reproducibility (scoring rubric, provenance, citations)
    - Data vs interpretation layer separation
    - Quality gates and validation process
  - _Time: 4-6 hours_
  - _Depends on: Phase 5 complete_

- [ ] 6.2 Create CITATION_GUIDE.md

  - **Location:** `lore-research/CITATION_GUIDE.md`
  - **Contents:**
    - How to cite I Ching line text properly
    - Translator attribution standards
    - Chinese text inclusion (optional but recommended)
    - ISBN, page number, quote requirements
    - HD source citation standards
    - Star mythology citation standards
  - _Time: 3-4 hours_
  - _Depends on: 6.1_

- [ ] 6.3 Create public "Scope & Claims" document

  - **Location:** `star-system-sorter/public/SCOPE_AND_CLAIMS.md`
  - **Contents:**
    - What this research is (interpretive lore correlation)
    - What this research is NOT (scientific proof, predictions, medical advice)
    - HD's actual foundations (I Ching, Astrology, Kabbalah, Chakras)
    - Academic standards used (source quality, citation rigor)
    - Transparency about interpretive layers
  - Link from app footer and Why screen
  - _Time: 2-3 hours_
  - _Depends on: 6.2_

- [ ] 6.4 Create Zenodo dataset and DOI

  - Package all research outputs:
    - 9 star system JSONs
    - 64 gate JSONs (3 passes each)
    - 6 line archetype JSONs
    - 384 Gate.Line JSONs
    - Scoring rubric YAML
    - Methodology documentation
  - Upload to Zenodo
  - Obtain DOI for academic citation
  - Create changelog
  - _Time: 4-6 hours_
  - _Depends on: 6.3_

- [ ] 6.5 Update all documentation with DOI

  - Add Zenodo DOI to README.md
  - Add to METHODS.md
  - Add to app footer
  - Add to Why screen
  - _Time: 1 hour_
  - _Depends on: 6.4_

- [ ] 6.6 Final documentation review
  - Review all updated documentation
  - Ensure accuracy and completeness
  - Verify all links work
  - Verify academic framing consistent throughout
  - _Time: 2-3 hours_
  - _Depends on: 6.5_

**Phase 6 Total Time: 16-23 hours**

---

## Summary

### Time Estimates (EXHAUSTIVE RESEARCH)

- **Phase 0:** 30-45 hours (star system baselines + academic documentation)

  - Fix existing outputs: 3-5 hours
  - Remaining research (6 systems): 12-18 hours
  - Academic documentation: 6-8 hours
  - Cross-check and validation: 6-10 hours
  - Quality improvements: 3-4 hours

- **Phase 1:** 136-272 hours (64 gates, 3 passes each)

  - Pass A (canonical meaning): 64-128 hours
  - Pass B (HD context): 32-64 hours
  - Pass C (star-system hypotheses): 32-64 hours
  - Validation and conflict resolution: 8-16 hours

- **Phase 2:** 15 hours (6 line archetypes)

  - Setup: 2-3 hours
  - Research (6 lines × 2 hours): 12 hours
  - Validation: 1 hour

- **Phase 3:** 600-1,199 hours (384 Gate.Line combinations - EXHAUSTIVE)

  - Setup and infrastructure: 9-13 hours
  - Tier 1 (20-30 combos): 62-94 hours
  - Tier 2 (50-80 combos): 104-248 hours
  - Tier 3 (~270 combos): 413-826 hours
  - Quality gates and validation: 12-18 hours

- **Phase 4:** 43-69 hours + design time (app integration)

  - Data infrastructure: 8-12 hours
  - Scorer and schemas: 5-10 hours
  - UI components and pages: 18-28 hours
  - Screen updates: 12-18 hours
  - Documentation: 2-3 hours

- **Phase 5:** 22-33 hours (testing & QA)

  - Unit tests: 4-6 hours
  - Schema validation: 2-3 hours
  - E2E tests: 6-8 hours
  - Snapshot tests: 2-4 hours
  - Manual QA: 4-6 hours
  - Performance and accessibility: 4-6 hours

- **Phase 6:** 16-23 hours (methods, citations, release)
  - Documentation: 9-13 hours
  - Zenodo dataset: 4-6 hours
  - Final review: 3-4 hours

**Total Time: 862-1,656 hours (21-41 weeks full-time, or 5-10 months at 40 hrs/week)**

### Current Status

- **Phase 0:** 33% complete (3/9 systems researched, needs quality improvements)

  - Sirius: ✅ Complete (needs methodology fields)
  - Pleiades: ⚠️ Complete (needs Wikipedia fix + methodology fields)
  - Orion Light: ✅ Complete (needs methodology fields)
  - Orion Dark: ❌ Not started
  - Andromeda: ❌ Not started
  - Lyra: ❌ Not started
  - Arcturus: ❌ Not started
  - Draco: ❌ Not started
  - Zeta Reticuli: ❌ Not started (prompt needs creation)
  - **Quality:** 7.5/10 → Target: 9/10

- **Phase 1:** 0% complete (0/64 gates researched)
- **Phase 2:** 0% complete (0/6 line archetypes researched)
- **Phase 3:** 0% complete (0/384 Gate.Line combinations researched)
- **Phase 4:** 0% complete (blocked by Phase 3)
- **Phase 5:** 0% complete (blocked by Phase 4)
- **Phase 6:** 0% complete (blocked by Phase 5)

### Next Actions (Priority Order)

1. **CRITICAL:** Fix Pleiades Wikipedia violation (Task 0.1)
2. **HIGH:** Enhance existing JSONs with methodology fields (Task 0.2)
3. **MEDIUM:** Complete remaining 6 star system research (Tasks 0.6-0.11)
4. **MEDIUM:** Create academic documentation (Tasks 0.12-0.13)
5. **LOW:** Cross-check GPT-4o claims (Task 0.15)
6. **NEXT PHASE:** Begin Phase 1 gate research (64 gates × 3 passes)

### Quality Metrics

**Current State:**

- Source quality: 8/10 (one Wikipedia violation)
- Citation quality: 9/10 (excellent)
- Academic framing: 6/10 (missing methodology documentation)
- Overall: 7.5/10

**Target State:**

- Source quality: 9/10 (no violations, all primary sources)
- Citation quality: 9/10 (maintain current standard)
- Academic framing: 9/10 (methodology + bibliography documented)
- Overall: 9/10

### Files to Create (Infrastructure)

**Prompts:**

- `lore-research/prompts/TEMPLATE_PASS_LINE.txt` (Phase 2)
- `lore-research/prompts/TEMPLATE_PASS_GATE_LINE.txt` (Phase 3)

**Schemas:**

- `lore-research/schemas/line-archetype.schema.json` (Phase 2)
- `lore-research/schemas/gate-line.schema.json` (Phase 3)

**Config:**

- `lore-research/rubrics/star-system-scoring.yaml` (Phase 3)

**Tools:**

- `tools/select-tiered-gate-lines.ts` (Phase 3)

**Code:**

- `star-system-sorter/src/lib/lore.bundle.ts` (Phase 4)
- `star-system-sorter/src/lib/getGateLineLore.ts` (Phase 4)

**Documentation:**

- `lore-research/METHODS.md` (Phase 6)
- `lore-research/CITATION_GUIDE.md` (Phase 6)
- `star-system-sorter/public/SCOPE_AND_CLAIMS.md` (Phase 6)

### Reference Documents

**Strategy:**

- **Gate.Line Synthesis Strategy:** `lore-research/strategy/GATE_LINE_SYNTHESIS_STRATEGY.md`
- **Unified Gate.Line Strategy:** `lore-research/strategy/UNIFIED_GATE_LINE_STRATEGY.md`
- **GPT-5 Gate.Line Synthesis:** `lore-research/strategy/gpt-5-gate-line-synthesis.md`

**Research Quality:**

- **Academic Assessment:** `lore-research/ACADEMIC_CREDIBILITY_ASSESSMENT.md`
- **Positioning Strategy:** `lore-research/ACADEMIC_POSITIONING_STRATEGY.md`
- **Human Design Foundations:** `lore-research/documentation/human-design.md`
- **Enhanced JSON Example:** `lore-research/research-outputs/star-systems/ENHANCED_JSON_EXAMPLE.json`

**Prompt Quality:**

- **V3 Fixes Applied:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/V3_FIXES_APPLIED.md`
- **Baseline Audit:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/BASELINE_PROMPTS_AUDIT.md`
- **Bulletproof Complete:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/BULLETPROOF_COMPLETE.md`

### Non-Negotiables (Academic Defensibility)

- ✅ Use ≥2 I Ching translations per Gate.Line; save one ≤25-word quote
- ✅ Clearly label star-system mapping as **interpretive lore correlation**
- ✅ Keep HD inputs accurate: I Ching, Western Astrology, Kabbalah, Chakras (NOT quantum physics)
- ✅ Store **provenance inline** with each entry; include confidence level
- ✅ Separate data layer (I Ching, HD structure) from interpretation layer (star-lore)
- ✅ All citations must have full metadata (translator, ISBN, page numbers)
- ✅ No Wikipedia, Britannica, or encyclopedia sources
- ✅ No blog or personal website sources
- ✅ Disputed claims must include counter-evidence

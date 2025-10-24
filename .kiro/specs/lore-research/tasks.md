# Implementation Plan - Lore Research & Gate Mapping

## Phase 0: Star System Baselines (CURRENT PHASE)

### Status: 3/9 Complete (Sirius ✅, Pleiades ⚠️, Orion Light ✅)

**Current Quality: 7.5/10 → Target: 9/10**

**Critical Issues to Fix:**
1. ❌ Wikipedia violation in Pleiades output (must fix before proceeding)
2. ⚠️ Missing methodology context in all JSONs
3. ⚠️ Missing academic foundations documentation

---

### 0.0 Fix Existing Outputs (PRIORITY)

- [ ] 0.0.1 Fix Pleiades Wikipedia violation
  - **Issue:** Line 2 cites "Wikipedia Contributors" as author
  - **Fix:** Replace with primary source (Mahabharata translation or academic paper on Krittika)
  - **Search:** Archive.org for "Mahabharata Krittika" or academic papers on Pleiades in Vedic astronomy
  - **Validate:** Ensure new source has ISBN, translator, page number, actual quote
  - **Update:** `lore-research/research-outputs/star-systems/pleiades-baseline.json`
  - _Time: 1-2 hours_
  - _Status: CRITICAL - Blocks academic credibility_

- [ ] 0.0.2 Enhance JSON structure for all completed outputs
  - **Add to Sirius, Pleiades, Orion Light:**
    - `version` field (1.0)
    - `last_updated` field (date)
    - `methodology` object (framework, academic_foundations, source_standards)
    - `academic_context` object (Human Design foundations, mathematical correspondences)
    - `bibliography` object (organized by type: ancient_texts, modern_research, academic_foundations)
  - **Reference:** See `lore-research/research-outputs/star-systems/ENHANCED_JSON_EXAMPLE.json`
  - **Validate:** Ensure JSON is still valid after additions
  - _Time: 2-3 hours_
  - _Depends on: 0.0.1_

---

### 0.1-0.3 Completed Research (Needs Enhancement)

- [x] 0.1 Research Sirius baseline ✅
  - Status: Complete, good quality (8/10)
  - Needs: Methodology fields added (0.0.2)

- [x] 0.2 Research Pleiades baseline ⚠️
  - Status: Complete but has Wikipedia violation (6/10)
  - Needs: Fix Wikipedia violation (0.0.1), then add methodology fields (0.0.2)

- [x] 0.3 Research Orion Light baseline ✅
  - Status: Complete, good quality (8/10)
  - Needs: Methodology fields added (0.0.2)

---

### 0.4-0.9 Remaining Research (Enhanced Process)

**Note:** All remaining prompts have been updated with V3 fixes (explicit encyclopedia bans, source location guidance). Use enhanced JSON structure from the start.

- [ ] 0.4 Research Orion Dark baseline
  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ORION_DARK_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No Wikipedia, Britannica, or encyclopedia sources
    - ✅ No blog/personal website sources
    - ✅ Light/Dark/Draco distinctions clear
    - ✅ All sources have ISBNs, translators, page numbers
    - ✅ Includes methodology and academic_context fields
  - Save as `lore-research/research-outputs/star-systems/orion-dark-baseline.json`
  - _Time: 2-3 hours_
  - _Depends on: 0.0.2 (to match enhanced structure)_

- [ ] 0.5 Research Andromeda baseline
  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ANDROMEDA_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources (encyclopedias, blogs)
    - ✅ Symbolic vs direct evidence noted
    - ✅ Ancient Greek sources properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/andromeda-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.6 Research Lyra baseline
  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/LYRA_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Feline vs avian inconsistencies documented
    - ✅ Orpheus/lyre mythology properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/lyra-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.7 Research Arcturus baseline
  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ARCTURUS_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Modern-only nature acknowledged (ancient_support: low)
    - ✅ Channeled sources properly labeled
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/arcturus-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.8 Research Draco baseline
  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/DRACO_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Icke marked as disputed/controversial
    - ✅ No kundalini conflation
    - ✅ Dragon mythology (Greek, Chinese) properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/draco-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.9 Research Zeta Reticuli baseline
  - **Note:** Prompt needs to be created first
  - Create `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ZETA_RETICULI_BASELINE.txt`
  - Use V3 template with explicit encyclopedia bans
  - Copy prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Hill star map marked as disputed
    - ✅ Betty and Barney Hill case properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/zeta-reticuli-baseline.json`
  - _Time: 3-4 hours (includes prompt creation)_

---

### 0.10 Create Academic Documentation

- [ ] 0.10.1 Create METHODOLOGY.md
  - **Location:** `lore-research/METHODOLOGY.md`
  - **Contents:**
    - Theoretical framework (Comparative mythology + I Ching-based HD)
    - Human Design's 8 academic foundations (I Ching, DNA codons, Kabbalah, Chakras, etc.)
    - Mathematical correspondences (64 hexagrams = 64 codons)
    - Research approach (comparative mythology, source standards)
    - Evidence typing system (direct/inferred/symbolic)
  - **Reference:** See `lore-research/ACADEMIC_POSITIONING_STRATEGY.md` Section 1.1
  - _Time: 2-3 hours_
  - _Depends on: 0.0.2_

- [ ] 0.10.2 Create BIBLIOGRAPHY.md
  - **Location:** `lore-research/BIBLIOGRAPHY.md`
  - **Contents:**
    - Extract all sources from 9 JSON files
    - Add Human Design academic foundations (Wilhelm, Nirenberg, Scholem, etc.)
    - Organize by category:
      - I Ching / Sinology
      - Genetics / DNA Codons
      - Kabbalah
      - Chakras / Yoga Studies
      - Comparative Mythology
      - Jungian Psychology
      - Star Mythology (by star system)
  - **Reference:** See `lore-research/ACADEMIC_CREDIBILITY_ASSESSMENT.md` Bibliography section
  - _Time: 3-4 hours_
  - _Depends on: 0.9_

- [ ] 0.10.3 Update baseline prompts with academic context
  - **Add to all baseline prompts** (after OBJECTIVE section):
    - Academic context section explaining HD foundations
    - Emphasis on comparative mythology (not pseudoscience)
  - **Files to update:**
    - All remaining baseline prompts (if not already updated)
  - **Reference:** See `lore-research/ACADEMIC_POSITIONING_STRATEGY.md` Section 1.4
  - _Time: 1 hour_
  - _Optional: Already done for V3 prompts_

---

### 0.11 Cross-check and Validation

- [ ] 0.11.1 Cross-check GPT-4o claims
  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-systems.md`
  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-cross-system-matrix.md`
  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-star-system-storyline.md`
  - Compare GPT-4o's claims against Comet's cited research
  - Mark each claim as: ✅ VALIDATED (3+ sources), ⚠️ PARTIAL (1-2 sources), ❌ UNSUPPORTED (no sources)
  - Create validation report at `lore-research/validation/gpt-4o-claims-validation.md`
  - _Time: 4-6 hours_
  - _Depends on: 0.9_

- [ ] 0.11.2 Compile star system baselines
  - Combine all 9 JSON files into master YAML
  - Cross-reference with GPT-4o's validated claims
  - Resolve any conflicts (prefer Comet's cited sources over GPT-4o's uncited claims)
  - Create final authoritative baseline at `lore-research/star-systems/COMPILED_BASELINES.yaml`
  - Document conflict resolutions at `lore-research/star-systems/CONFLICTS_RESOLVED.md`
  - _Time: 2-4 hours_
  - _Depends on: 0.11.1_

- [ ] 0.11.3 Quality check Phase 0 completion
  - **Verify all 9 JSON files:**
    - ✅ Exist and are valid JSON
    - ✅ Include methodology and academic_context fields
    - ✅ Have 3-5 characteristics each
    - ✅ Have 5+ sources per characteristic (minimum 3 if truly limited)
    - ✅ All sources have ISBNs, translators, page numbers, quotes
    - ✅ No Wikipedia, Britannica, or encyclopedia sources
    - ✅ No blog/personal website sources
    - ✅ Disputed claims have counter-evidence
  - **Verify documentation:**
    - ✅ METHODOLOGY.md exists and is complete
    - ✅ BIBLIOGRAPHY.md exists and is complete
    - ✅ COMPILED_BASELINES.yaml exists and is valid
  - **Overall quality target:** 9/10
  - _Depends on: 0.11.2_

## Phase 1: Gate Research

- [ ] 1. Generate and execute gate research prompts
- [ ] 1.1 Generate gate prompts

  - Run `lore-research/scripts/generate-gate-prompts.sh`
  - Verify 192 prompt files created (64 gates × 3 passes)
  - Each prompt references compiled star system baselines
  - _Time: 2 hours_
  - _Depends on: Phase 0 complete_

***ASK GPT-4o FIRST TO TELL YOU ABOUT STUFF***
- [ ] 1.2 Execute Pass A for all gates

  - For each of 64 gates, copy Pass A prompt into Comet
  - Validate each response
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-a.json`
  - _Time: 8-16 hours_
  - _Depends on: 1.1_

- [ ] 1.3 Execute Pass B for all gates

  - For each of 64 gates, copy Pass B prompt into Comet
  - Validate each response
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-b.json`
  - _Time: 8-16 hours_
  - _Depends on: 1.2_

- [ ] 1.4 Execute Pass C for all gates

  - For each of 64 gates, copy Pass C prompt into Comet
  - Validate each response
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-c.json`
  - _Time: 8-16 hours_
  - _Depends on: 1.3_

- [ ] 1.5 BEAM validation

  - Run BEAM validation on all gate outputs
  - Check for consistency across Pass A/B/C
  - Identify conflicts and inconsistencies
  - Create validation report at `lore-research/validation/beam-validation-report.md`
  - _Time: 4-8 hours_
  - _Depends on: 1.4_

- [ ] 1.6 Resolve conflicts

  - Review BEAM validation report
  - Resolve conflicts between passes
  - Document resolution decisions
  - Update gate JSON files with resolved data
  - _Time: 4-8 hours_
  - _Depends on: 1.5_

- [ ] 1.7 Compile gate research into lore.yaml
  - Combine all gate research into master lore.yaml
  - Include star system baselines
  - Validate YAML structure
  - Save as `star-system-sorter/data/lore/lore.yaml`
  - _Time: 2-4 hours_
  - _Depends on: 1.6_

## Phase 2: App Integration

- [ ] 2. Update app to support 9 star systems
- [ ] 2.1 Update scorer for 9 systems

  - Add Orion Dark, Draco, Zeta Reticuli to `star-system-sorter/src/lib/scorer.ts`
  - Update classification logic to handle 9 systems
  - Ensure deterministic results maintained
  - Update tests
  - _Time: 4-8 hours_
  - _Depends on: Phase 1 complete_

- [ ] 2.2 Update schemas for 9 systems

  - Add new systems to `star-system-sorter/src/lib/schemas.ts`
  - Update TypeScript types
  - Update Zod validation schemas
  - _Time: 1-2 hours_
  - _Depends on: 2.1_

- [ ] 2.3 Create missing crests

  - Design crest for Orion Dark
  - Design crest for Draco
  - Design crest for Zeta Reticuli
  - Export as SVG files
  - Add to `star-system-sorter/src/assets/crests/`
  - _Time: External design work_
  - _Depends on: 2.1_

- [ ] 2.4 Update ResultScreen for 9 systems

  - Update `star-system-sorter/src/screens/ResultScreen.tsx`
  - Add new crest imports
  - Update system display logic
  - Ensure Orion Light/Dark distinction is clear
  - _Time: 2-4 hours_
  - _Depends on: 2.3_

- [ ] 2.5 Update WhyScreen with new lore

  - Update `star-system-sorter/src/screens/WhyScreen.tsx`
  - Integrate new lore data
  - Ensure all 9 systems display correctly
  - _Time: 2-4 hours_
  - _Depends on: 2.1_

- [ ] 2.6 Update DossierScreen with new lore

  - Update `star-system-sorter/src/screens/DossierScreen.tsx`
  - Integrate new lore data
  - Ensure all 9 systems display correctly
  - _Time: 2-4 hours_
  - _Depends on: 2.1_

- [ ] 2.7 Update product documentation
  - Update `.kiro/steering/product.md` if needed
  - Update `README.md` with 9 systems
  - Update any other relevant docs
  - _Time: 1 hour_
  - _Depends on: 2.6_

## Phase 3: Testing & Validation

- [ ] 3. Test and validate complete system
- [ ] 3.1 Run unit tests

  - Run `npm run test` in star-system-sorter
  - Verify all tests pass
  - Fix any failures
  - _Time: 1-2 hours_
  - _Depends on: Phase 2 complete_

- [ ] 3.2 Run E2E tests

  - Run `npm run test:e2e` in star-system-sorter
  - Verify all tests pass
  - Fix any failures
  - _Time: 1-2 hours_
  - _Depends on: 3.1_

- [ ] 3.3 Manual QA - Full flow

  - Test: / → /input → /result → /why → /dossier
  - Verify all 9 systems can be classified
  - Verify Orion Light/Dark distinction is clear
  - Verify all crests display correctly
  - _Time: 1-2 hours_
  - _Depends on: 3.2_

- [ ] 3.4 Manual QA - Edge cases

  - Test hybrid classifications with new systems
  - Test unresolved classifications
  - Test with various HD chart configurations
  - _Time: 1-2 hours_
  - _Depends on: 3.3_

- [ ] 3.5 Performance validation

  - Verify classification completes in <100ms
  - Verify UI renders in <200ms
  - Check bundle size increase
  - _Time: 1 hour_
  - _Depends on: 3.4_

- [ ] 3.6 Accessibility audit

  - Verify keyboard navigation works
  - Verify screen reader compatibility
  - Verify color contrast ratios
  - Verify touch target sizes (44px minimum)
  - _Time: 1-2 hours_
  - _Depends on: 3.5_

- [ ] 3.7 Final documentation review
  - Review all updated documentation
  - Ensure accuracy and completeness
  - Update any outdated information
  - _Time: 1 hour_
  - _Depends on: 3.6_

## Summary

### Time Estimates (Updated)

- **Phase 0:** 30-45 hours (star system baselines + academic documentation)
  - Fix existing outputs: 3-5 hours
  - Remaining research (6 systems): 12-18 hours
  - Academic documentation: 6-8 hours
  - Cross-check and validation: 6-10 hours
  - Quality improvements: 3-4 hours
- **Phase 1:** 26-50 hours (gate research)
- **Phase 2:** 8-16 hours + design time (app integration)
- **Phase 3:** 7-11 hours (testing & validation)
- **Total:** 71-122 hours + design time

### Current Status (Updated)

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
- **Phase 1:** 0% complete (blocked by Phase 0)
- **Phase 2:** 0% complete (blocked by Phase 1)
- **Phase 3:** 0% complete (blocked by Phase 2)

### Next Actions (Priority Order)

1. **CRITICAL:** Fix Pleiades Wikipedia violation (Task 0.0.1)
2. **HIGH:** Enhance existing JSONs with methodology fields (Task 0.0.2)
3. **MEDIUM:** Complete remaining 6 star system research (Tasks 0.4-0.9)
4. **MEDIUM:** Create academic documentation (Tasks 0.10.1-0.10.2)
5. **LOW:** Cross-check GPT-4o claims (Task 0.11.1)

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

### Reference Documents

**Research Quality:**
- **Academic Assessment:** `lore-research/ACADEMIC_CREDIBILITY_ASSESSMENT.md` (current rating, what to improve)
- **Positioning Strategy:** `lore-research/ACADEMIC_POSITIONING_STRATEGY.md` (how to advertise research quality)
- **Human Design Foundations:** `lore-research/human-design.md` (8 source systems)
- **Enhanced JSON Example:** `lore-research/research-outputs/star-systems/ENHANCED_JSON_EXAMPLE.json`

**Prompt Quality:**
- **V3 Fixes Applied:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/V3_FIXES_APPLIED.md`
- **Baseline Audit:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/BASELINE_PROMPTS_AUDIT.md`
- **Orion Light Fix History:** `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ORION_LIGHT_PROMPT_FIX_V3.md`

**Execution Guides:**
- **Phase 0 Guide:** `lore-research/PHASE_0_EXECUTION_GUIDE.md` (if exists)
- **Star Systems List:** `lore-research/STAR_SYSTEMS_FINAL_LIST.md` (if exists)
- **Citation Standards:** `lore-research/CITATION_QUALITY_STANDARDS.md` (if exists)

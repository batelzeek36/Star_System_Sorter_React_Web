# Implementation Plan - Lore Research & Gate Mapping

> **Canon:** Gate.Line is the irreducible unit (384 total). Lines (1-6) are non-definitional background used for tone/modifiers and UI tooltips. Never concatenate "gate text + generic line text" to define a Gate.Line.

> **Academic Framing:** This is digital humanities research with rigorous sourcing. Star-system mapping is interpretive lore correlation, not scientific proof. HD's actual foundations: I Ching + Western Astrology + Kabbalah + Chakras (NOT quantum physics).

---

## Phase 0: Star System Baselines (Foundations)

### Status: 3/9 Complete (Sirius ✅, Pleiades ⚠️, Orion Light ✅)

**Current Quality: 7.5/10 → Target: 9/10**

**Critical Issues to Fix:**

1. ❌ Wikipedia violation in Pleiades output (must fix before proceeding)
2. ⚠️ Missing methodology context in all JSONs
3. ⚠️ Missing academic foundations documentation

---

### 0.0 Fix Existing Outputs (PRIORITY)

- [x] 0.0.1 Fix Pleiades Wikipedia violation

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

## Phase 1: Gate Research (64 Gates, 3 Passes)

**Purpose:** Establish canonical gate meanings before synthesizing Gate.Line combinations.

- [ ] 1.1 Generate gate prompts

  - Run `lore-research/scripts/generate-gate-prompts.sh`
  - Verify 192 prompt files created (64 gates × 3 passes)
  - Each prompt references compiled star system baselines
  - _Time: 2 hours_
  - _Depends on: Phase 0 complete_

- [ ] 1.2 Execute Pass A for all gates (Canonical gate meaning)

  - **Sources:** Ra Uru Hu's Gate Companion + Gene Keys + cross-check
  - For each of 64 gates, copy Pass A prompt into Perplexity Comet
  - **Validate each response:**
    - ✅ Citations ≥3 per gate
    - ✅ No "quantum proof" claims
    - ✅ HD structure filled (center, circuit, channel partner)
    - ✅ No Wikipedia/encyclopedia sources
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-a.json`
  - _Time: 64-128 hours (1-2 hours per gate)_
  - _Depends on: 1.1_

- [ ] 1.3 Execute Pass B for all gates (Circuit/center/channel context)

  - For each of 64 gates, copy Pass B prompt into Perplexity Comet
  - **Validate each response:**
    - ✅ Center assignment correct
    - ✅ Circuit assignment correct
    - ✅ Channel partner identified
    - ✅ Behavioral signature described
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-b.json`
  - _Time: 32-64 hours (0.5-1 hour per gate)_
  - _Depends on: 1.2_

- [ ] 1.4 Execute Pass C for all gates (Preliminary star-system hypotheses)

  - **Note:** Gate-level only; labeled interpretive
  - For each of 64 gates, copy Pass C prompt into Perplexity Comet
  - **Validate each response:**
    - ✅ Star-system mapping labeled "interpretive"
    - ✅ Scoring rationale provided
    - ✅ No definitive claims
  - Save as `lore-research/research-outputs/gates/gate-{N}-pass-c.json`
  - _Time: 32-64 hours (0.5-1 hour per gate)_
  - _Depends on: 1.3_

- [ ] 1.5 Validation and conflict resolution
  - Run validation on all gate outputs
  - Check for consistency across Pass A/B/C
  - Identify conflicts and inconsistencies
  - Create validation report at `lore-research/validation/gate-validation-report.md`
  - Resolve conflicts and document decisions
  - Update gate JSON files with resolved data
  - _Time: 8-16 hours_
  - _Depends on: 1.4_

**Phase 1 Total Time: 136-272 hours (2-4 weeks full-time)**

## Phase 2: Line Archetype Research (Non-Definitional Background)

**Purpose:** Capture universal line tones for UI/educational context and as modifiers. NOT to define Gate.Line meanings.

- [ ] 2.1 Create line archetype research prompt and schema

  - Create `lore-research/prompts/TEMPLATE_PASS_LINE.txt`
  - Create `lore-research/schemas/line-archetype.schema.json`
  - **Prompt must include:**
    - Sources: Classical I Ching commentary + HD pedagogy + Gene Keys tone (labeled interpretive)
    - "Non-definitional" flag requirement
    - Cautions about misuse (don't concatenate with gate text)
  - **Schema must validate:**
    - Essence (≤20 words)
    - Universal tone/archetype
    - Cautions field
    - Non-definitional flag
    - Citations with full metadata
  - _Time: 2-3 hours_
  - _Depends on: Phase 1 complete_

- [ ] 2.2 Research Line 1 (Investigator/Foundation)

  - Use TEMPLATE_PASS_LINE.txt
  - Compare ≥2 I Ching sources on Line 1 universal meaning
  - Save as `lore-research/research-outputs/lines/line-1-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.3 Research Line 2 (Hermit/Natural)

  - Use TEMPLATE_PASS_LINE.txt
  - Save as `lore-research/research-outputs/lines/line-2-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.4 Research Line 3 (Martyr/Experimenter)

  - Use TEMPLATE_PASS_LINE.txt
  - Save as `lore-research/research-outputs/lines/line-3-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.5 Research Line 4 (Opportunist/Network)

  - Use TEMPLATE_PASS_LINE.txt
  - Save as `lore-research/research-outputs/lines/line-4-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.6 Research Line 5 (Heretic/Universalizer)

  - Use TEMPLATE_PASS_LINE.txt
  - Save as `lore-research/research-outputs/lines/line-5-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.7 Research Line 6 (Role Model/Observer)

  - Use TEMPLATE_PASS_LINE.txt
  - Save as `lore-research/research-outputs/lines/line-6-archetype.json`
  - _Time: 2 hours_
  - _Depends on: 2.1_

- [ ] 2.8 Validate line archetype research
  - Run JSON schema validation on all 6 files
  - Verify non-definitional flags present
  - Verify cautions documented
  - Create validation report
  - _Time: 1 hour_
  - _Depends on: 2.7_

**Phase 2 Total Time: 15 hours**

---

## Phase 3: Gate.Line Emergent Synthesis (384 Combinations - EXHAUSTIVE)

**Purpose:** Research all 384 Gate.Line combinations as irreducible units, rooted in I Ching line text.

### 3.1 Setup and Infrastructure

- [ ] 3.1.1 Create Gate.Line research prompt and schema

  - Create `lore-research/prompts/TEMPLATE_PASS_GATE_LINE.txt`
  - Create `lore-research/schemas/gate-line.schema.json`
  - **Prompt must require:**
    - Compare ≥2 I Ching translations for this specific line
    - Extract root essence (≤20 words)
    - Save one ≤25-word quote with full attribution
    - HD context: center, circuit, channel partner, behavioral signature
    - Planetary modifiers (non-definitional)
    - Phenomenology: shadow/gift (labeled interpretive)
    - Star-system hypotheses with scoring (see 3.1.3)
    - Provenance and confidence level
  - **Schema must validate all fields above**
  - _Time: 3-4 hours_
  - _Depends on: Phase 2 complete_

- [ ] 3.1.2 Create star-system scoring rubric

  - Create `lore-research/rubrics/star-system-scoring.yaml`
  - **Define weights:**
    - I Ching feature match: 0.35
    - HD structural match: 0.35
    - Phenomenology fit: 0.20
    - Star-lore coherence: 0.10
  - **Document scoring criteria for each weight**
  - This becomes single source of truth for all Gate.Line research
  - _Time: 2-3 hours_
  - _Depends on: 3.1.1_

- [ ] 3.1.3 Create tiering selection tool
  - Create `tools/select-tiered-gate-lines.ts`
  - **Inputs:** Weighting config (statistical prevalence, archetypal significance, user impact)
  - **Outputs:**
    - `lore-research/tiering/tier1.json` (20-30 combos)
    - `lore-research/tiering/tier2.json` (50-80 combos)
    - `lore-research/tiering/tier3.json` (~270 combos)
  - **Rationale saved per pick (≤140 chars)**
  - Reproducible selection process
  - _Time: 4-6 hours_
  - _Depends on: 3.1.2_

**3.1 Total Time: 9-13 hours**

### 3.2 Tier 1: High-Priority Gate.Line Research (20-30 combos)

**Selection Criteria:**

- Personality Sun/Earth gates (most visible)
- Node placements (life path)
- Lines 3, 5, 6 (strongest archetypal leverage)
- Completes key channels
- Community requests

- [ ] 3.2.1 Execute Tier 1 research (Manual, full synthesis)

  - For each of 20-30 selected Gate.Line combinations:
    - Use TEMPLATE_PASS_GATE_LINE.txt
    - Copy prompt into Perplexity Comet
    - **Validate response:**
      - ✅ ≥2 I Ching translations compared
      - ✅ One ≤25-word quote saved with translator attribution
      - ✅ Root essence ≤20 words
      - ✅ All HD context fields filled
      - ✅ Planetary modifiers present (non-definitional)
      - ✅ Phenomenology labeled interpretive
      - ✅ Star-system scores with rationale + weights visible
      - ✅ Provenance and confidence set
      - ✅ All citations have full metadata
    - Save as `lore-research/research-outputs/gate-lines/gate-{N}-line-{L}.json`
  - _Time: 60-90 hours (2-3 hours per combo)_
  - _Depends on: 3.1.3_

- [ ] 3.2.2 Validate Tier 1 research
  - Run JSON schema validation on all Tier 1 files
  - Verify quality gates met (see Quality Gates section below)
  - Create validation report
  - _Time: 2-4 hours_
  - _Depends on: 3.2.1_

**3.2 Total Time: 62-94 hours**

### 3.3 Tier 2: Medium-Priority Gate.Line Research (50-80 combos)

**Selection Criteria:**

- Moderately common in charts
- Clear archetypal patterns
- Requested by users (feedback-driven)

- [ ] 3.3.1 Execute Tier 2 research (Manual, full synthesis)

  - For each of 50-80 selected Gate.Line combinations:
    - Use TEMPLATE_PASS_GATE_LINE.txt
    - Same validation criteria as Tier 1
    - Save as `lore-research/research-outputs/gate-lines/gate-{N}-line-{L}.json`
  - _Time: 100-240 hours (2-3 hours per combo)_
  - _Depends on: 3.2.2_

- [ ] 3.3.2 Validate Tier 2 research
  - Run JSON schema validation on all Tier 2 files
  - Verify quality gates met
  - Create validation report
  - _Time: 4-8 hours_
  - _Depends on: 3.3.1_

**3.3 Total Time: 104-248 hours**

### 3.4 Tier 3: Long-Tail Gate.Line Research (~270 combos)

**Selection Criteria:**

- Rare in charts
- Less archetypal significance
- Lower user impact initially

- [ ] 3.4.1 Execute Tier 3 research (Manual, full synthesis)

  - For each of remaining ~270 Gate.Line combinations:
    - Use TEMPLATE_PASS_GATE_LINE.txt
    - Same validation criteria as Tier 1 & 2
    - Save as `lore-research/research-outputs/gate-lines/gate-{N}-line-{L}.json`
  - **Note:** This is exhaustive research, not algorithmic
  - Can be batched and parallelized
  - _Time: 405-810 hours (1.5-3 hours per combo)_
  - _Depends on: 3.3.2_

- [ ] 3.4.2 Validate Tier 3 research
  - Run JSON schema validation on all Tier 3 files
  - Verify quality gates met
  - Create validation report
  - _Time: 8-16 hours_
  - _Depends on: 3.4.1_

**3.4 Total Time: 413-826 hours**

### 3.5 Quality Gates & Validation (All Tiers)

- [ ] 3.5.1 Implement JSON schema validation

  - Use AJV for validation
  - Create script: `pnpm validate:gate-lines`
  - Integrate into CI pipeline
  - _Time: 4-6 hours_
  - _Depends on: 3.1.1_

- [ ] 3.5.2 Quality gate checklist (per Gate.Line entry)

  - ✅ Q1: ≥2 I Ching translations compared, one ≤25-word quote saved
  - ✅ Q2: HD context filled (center, circuit, channel partner, behavioral signature)
  - ✅ Q3: Phenomenology drafted (shadow/gift), labeled interpretive
  - ✅ Q4: Star-system hypotheses scored with rationale + weights visible
  - ✅ Q5: Provenance & confidence set; all fields YAML-valid
  - ✅ Q6: Accurate HD framing (I Ching + Astrology + Kabbalah + Chakras, NOT quantum physics)
  - ✅ Q7: User-facing narrative (short + long) drafted
  - ✅ Q8: All citations have full metadata (translator, ISBN, page numbers)
  - _Time: Ongoing validation during research_

- [ ] 3.5.3 Final validation report for all 384 Gate.Lines
  - Verify all 384 files exist and are valid JSON
  - Verify all quality gates passed
  - Create comprehensive validation report
  - Document any exceptions or edge cases
  - _Time: 8-12 hours_
  - _Depends on: 3.4.2_

**3.5 Total Time: 12-18 hours**

**Phase 3 Total Time: 600-1,199 hours (15-30 weeks full-time)**

---

## Phase 4: App Integration

- [ ] 4.1 Create lore data bundle loader

  - Create `star-system-sorter/src/lib/lore.bundle.ts`
  - Lazy load by route
  - Memoized selectors
  - _Time: 4-6 hours_
  - _Depends on: Phase 3 complete_

- [ ] 4.2 Create Gate.Line resolver

  - Create `star-system-sorter/src/lib/getGateLineLore.ts`
  - Function: `getGateLineLore(gate, line, opts)`
  - Applies planetary modifiers
  - Returns data + interpretation layers distinctly
  - _Time: 4-6 hours_
  - _Depends on: 4.1_

- [ ] 4.3 Update scorer for 9 systems

  - Add Orion Dark, Draco, Zeta Reticuli to `star-system-sorter/src/lib/scorer.ts`
  - Update classification logic to handle 9 systems
  - Ensure deterministic results maintained
  - Update tests
  - _Time: 4-8 hours_
  - _Depends on: 4.2_

- [ ] 4.4 Update schemas for 9 systems

  - Add new systems to `star-system-sorter/src/lib/schemas.ts`
  - Update TypeScript types
  - Update Zod validation schemas
  - _Time: 1-2 hours_
  - _Depends on: 4.3_

- [ ] 4.5 Create missing crests

  - Design crest for Orion Dark
  - Design crest for Draco
  - Design crest for Zeta Reticuli
  - Export as SVG files
  - Add to `star-system-sorter/src/assets/crests/`
  - _Time: External design work_
  - _Depends on: 4.3_

- [ ] 4.6 Create Gate.Line UI components

  - Create essence card component
  - Create HD context strip component
  - Create star-lore panel (with "interpretive" badge)
  - Create citations drawer component
  - _Time: 8-12 hours_
  - _Depends on: 4.2_

- [ ] 4.7 Create Gate.Line page

  - Create route: `/gate/{N}/line/{L}`
  - Display essence, HD context, phenomenology, star-lore
  - Show planetary modifiers as tooltips
  - Citations drawer accessible
  - _Time: 6-10 hours_
  - _Depends on: 4.6_

- [ ] 4.8 Update ResultScreen for 9 systems

  - Update `star-system-sorter/src/screens/ResultScreen.tsx`
  - Add new crest imports
  - Update system display logic
  - Ensure Orion Light/Dark distinction is clear
  - Link to relevant Gate.Line pages
  - _Time: 4-6 hours_
  - _Depends on: 4.7_

- [ ] 4.9 Update WhyScreen with new lore

  - Update `star-system-sorter/src/screens/WhyScreen.tsx`
  - Integrate new lore data
  - Ensure all 9 systems display correctly
  - Link to methodology documentation
  - _Time: 4-6 hours_
  - _Depends on: 4.8_

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

## Phase 5: Testing & QA

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

1. **CRITICAL:** Fix Pleiades Wikipedia violation (Task 0.0.1)
2. **HIGH:** Enhance existing JSONs with methodology fields (Task 0.0.2)
3. **MEDIUM:** Complete remaining 6 star system research (Tasks 0.4-0.9)
4. **MEDIUM:** Create academic documentation (Tasks 0.10.1-0.10.2)
5. **LOW:** Cross-check GPT-4o claims (Task 0.11.1)
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

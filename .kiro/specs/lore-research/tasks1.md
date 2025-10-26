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

- [ ] 0. Fix Existing Outputs and Complete Remaining Research
- [x] 0.1 Fix Pleiades Wikipedia violation

  - **Issue:** Line 2 cites "Wikipedia Contributors" as author
  - **Fix:** Replace with primary source (Mahabharata translation or academic paper on Krittika)
  - **Search:** Archive.org for "Mahabharata Krittika" or academic papers on Pleiades in Vedic astronomy
  - **Validate:** Ensure new source has ISBN, translator, page number, actual quote
  - **Update:** `lore-research/research-outputs/star-systems/pleiades-baseline.json`
  - _Time: 1-2 hours_
  - _Priority: CRITICAL - Blocks academic credibility_

- [ ] 0.2 Enhance JSON structure for all completed outputs

  - **Add to Sirius, Pleiades, Orion Light:**
    - `version` field (1.0)
    - `last_updated` field (date)
    - `methodology` object (framework, academic_foundations, source_standards)
    - `academic_context` object (Human Design foundations, mathematical correspondences)
    - `bibliography` object (organized by type: ancient_texts, modern_research, academic_foundations)
  - **Reference:** See `lore-research/research-outputs/star-systems/ENHANCED_JSON_EXAMPLE.json`
  - **Validate:** Ensure JSON is still valid after additions
  - _Time: 2-3 hours_
  - _Depends on: 0.1_

- [x] 0.3 Research Sirius baseline

  - Status: Complete, good quality (8/10)
  - Needs: Methodology fields added (0.2)

- [x] 0.4 Research Pleiades baseline

  - Status: Complete but has Wikipedia violation (6/10)
  - Needs: Fix Wikipedia violation (0.1), then add methodology fields (0.2)

- [x] 0.5 Research Orion Light baseline

  - Status: Complete, good quality (8/10)
  - Needs: Methodology fields added (0.2)

- [ ] 0.6 Research Orion Dark baseline

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
  - _Depends on: 0.2 (to match enhanced structure)_

- [ ] 0.7 Research Andromeda baseline

  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ANDROMEDA_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources (encyclopedias, blogs)
    - ✅ Symbolic vs direct evidence noted
    - ✅ Ancient Greek sources properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/andromeda-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.8 Research Lyra baseline

  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/LYRA_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Feline vs avian inconsistencies documented
    - ✅ Orpheus/lyre mythology properly cited
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/lyra-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.9 Research Arcturus baseline

  - Open `lore-research/prompts/PHASE_0_STAR_SYSTEMS/ARCTURUS_BASELINE.txt`
  - Copy entire prompt into Perplexity Comet
  - **Validate response:**
    - ✅ No forbidden sources
    - ✅ Modern-only nature acknowledged (ancient_support: low)
    - ✅ Channeled sources properly labeled
    - ✅ Includes enhanced JSON structure
  - Save as `lore-research/research-outputs/star-systems/arcturus-baseline.json`
  - _Time: 2-3 hours_

- [ ] 0.10 Research Draco baseline

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

- [ ] 0.11 Research Zeta Reticuli baseline

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

- [ ] 0.12 Create METHODOLOGY.md

  - **Location:** `lore-research/METHODOLOGY.md`
  - **Contents:**
    - Theoretical framework (Comparative mythology + I Ching-based HD)
    - Human Design's 8 academic foundations (I Ching, DNA codons, Kabbalah, Chakras, etc.)
    - Mathematical correspondences (64 hexagrams = 64 codons)
    - Research approach (comparative mythology, source standards)
    - Evidence typing system (direct/inferred/symbolic)
  - **Reference:** See `lore-research/ACADEMIC_POSITIONING_STRATEGY.md` Section 1.1
  - _Time: 2-3 hours_
  - _Depends on: 0.2_

- [ ] 0.13 Create BIBLIOGRAPHY.md

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
  - _Depends on: 0.11_

- [ ] 0.14 Update baseline prompts with academic context

  - **Add to all baseline prompts** (after OBJECTIVE section):
    - Academic context section explaining HD foundations
    - Emphasis on comparative mythology (not pseudoscience)
  - **Files to update:**
    - All remaining baseline prompts (if not already updated)
  - **Reference:** See `lore-research/ACADEMIC_POSITIONING_STRATEGY.md` Section 1.4
  - _Time: 1 hour_
  - _Optional: Already done for V3 prompts_

- [ ] 0.15 Cross-check GPT-4o claims

  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-systems.md`
  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-cross-system-matrix.md`
  - Read `lore-research/prompts/PHASE_0_STAR_SYSTEMS/gpt-4o-star-system-storyline.md`
  - Compare GPT-4o's claims against Comet's cited research
  - Mark each claim as: ✅ VALIDATED (3+ sources), ⚠️ PARTIAL (1-2 sources), ❌ UNSUPPORTED (no sources)
  - Create validation report at `lore-research/validation/gpt-4o-claims-validation.md`
  - _Time: 4-6 hours_
  - _Depends on: 0.11_

- [ ] 0.16 Compile star system baselines

  - Combine all 9 JSON files into master YAML
  - Cross-reference with GPT-4o's validated claims
  - Resolve any conflicts (prefer Comet's cited sources over GPT-4o's uncited claims)
  - Create final authoritative baseline at `lore-research/star-systems/COMPILED_BASELINES.yaml`
  - Document conflict resolutions at `lore-research/star-systems/CONFLICTS_RESOLVED.md`
  - _Time: 2-4 hours_
  - _Depends on: 0.15_

- [ ] 0.17 Quality check Phase 0 completion
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
  - _Depends on: 0.16_

## Phase 1: Gate Research (64 Gates, 3 Passes)

**Purpose:** Establish canonical gate meanings before synthesizing Gate.Line combinations.

**Phase 1 Total Time: 136-272 hours (2-4 weeks full-time)**

- [ ] 1. Gate Research (64 Gates, 3 Passes)
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

## Phase 2: Line Archetype Research (Non-Definitional Background)

**Purpose:** Capture universal line tones for UI/educational context and as modifiers. NOT to define Gate.Line meanings.

- [ ] 2. Line Archetype Research
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


---

## PDF-Based Quote Extraction Workflow

**Context:** LLMs with web search (like Comet) cannot access full book contents, only previews and abstracts. This makes it impossible to extract exact quotes with page numbers. Solution: Upload PDFs to Kiro project for manual extraction.

### Setup

- [ ] 0.18 Create PDF source library structure
  - Create folder: `lore-research/source-pdfs/`
  - Create folder: `lore-research/extraction-requests/`
  - Create `.gitignore` entry for `source-pdfs/` (keep PDFs private)
  - _Time: 5 minutes_

### Priority Books to Acquire

**For Pleiades (Wikipedia Violations):**
- [ ] Mahabharata (Kisari Mohan Ganguli translation, 1883-1896)
- [ ] Alain Daniélou - "The Myths and Gods of India" (1991, ISBN 0-89281-354-7)
- [ ] Wendy Doniger - "Hindu Myths: A Sourcebook" (Penguin Classics, ISBN 0-14-044306-1)

**For Sirius (Wikipedia Violations):**
- [ ] R.O. Faulkner - "The Ancient Egyptian Pyramid Texts" (1969, ISBN 0-19-815437-2)
- [ ] Robert Temple - "The Sirius Mystery" (2019 50th Anniversary Edition, ISBN 978-1-64411-101-7)
- [ ] Patricia Cori - "The New Sirian Revelations" (2023, ISBN 978-1-59143-474-0)

**General Research:**
- [ ] Munya Andrews - "The Seven Sisters of the Pleiades" (2004, ISBN 1-876756-45-5)
- [ ] Barbara Marciniak - "Bringers of the Dawn" (1992, ISBN 0-939680-98-5)
- [ ] Alice Bailey - "Esoteric Astrology" (1951, ISBN 0-85330-148-2)

### Extraction Workflow

**What Kiro Can Do With PDFs:**
1. Search for keywords (e.g., "Sopdet", "Sirius", "Krittika", "Pleiades")
2. Extract exact quotes with page numbers
3. Verify quote context is accurate
4. Build proper citations (ISBN, edition, translator, year)
5. Create properly formatted JSON source objects
6. Mark as `"verified": true` since we actually read the source

**Process:**
1. Upload PDF to `lore-research/source-pdfs/`
2. Create extraction request in `lore-research/extraction-requests/`
3. Kiro searches PDF for relevant passages
4. Kiro extracts verbatim quotes (≤25 words)
5. Kiro formats as JSON source object
6. You review and approve
7. Update baseline JSON files

**Example Extraction Request:**
```markdown
# Pleiades - Krittika Nurturing References

**Source:** mahabharata-ganguli-1896.pdf
**Target:** Replace Wikipedia "Krittika" source in pleiades-baseline.json

**Search Terms:**
- Krittika
- Krittikas
- nurses of Kartikeya
- foster mothers

**Requirements:**
- Find 2-3 quotes about Krittika as nurturers/nurses
- Include specific section/verse numbers (e.g., "Vana Parva, Section 225")
- Extract verbatim quotes ≤25 words
- Note page numbers if available
```

**Legal Note:** Keep PDFs private for research purposes only. Do not redistribute. Add to `.gitignore`.

### Integration with Phase 0

- [ ] 0.19 Extract Pleiades Wikipedia replacements
  - Upload Mahabharata, Daniélou, Doniger PDFs
  - Create extraction requests for Krittika references
  - Extract quotes and build JSON sources
  - Update `lore-research/research-outputs/star-systems/v2/pleiades-baseline.json`
  - Remove Wikipedia violations
  - _Time: 2-3 hours_
  - _Depends on: 0.18, acquiring PDFs_

- [ ] 0.20 Extract Sirius Wikipedia replacements
  - Upload Faulkner, Temple, Cori PDFs
  - Create extraction requests for Sopdet/Sirius references
  - Extract quotes and build JSON sources
  - Update `lore-research/research-outputs/star-systems/v2/sirius-baseline.json`
  - Remove Wikipedia violations
  - _Time: 2-3 hours_
  - _Depends on: 0.18, acquiring PDFs_

- [ ] 0.21 Validate all V2 outputs are Wikipedia-free
  - Run validation script to check for "Wikipedia Contributors"
  - Run validation script to check for encyclopedia sources
  - Run validation script to check for "Various scholars"
  - Confirm all sources have ISBNs or DOIs
  - Confirm all quotes are verbatim (not paraphrases)
  - _Time: 1 hour_
  - _Depends on: 0.19, 0.20_

# Star System Sorter - Beam Evaluation Order

## Purpose
This document defines the optimal order for AI models to evaluate the Star System Sorter methodology, building understanding progressively from foundation to implementation.

---

## Evaluation Sequence

### Phase 1: Foundation & Methodology (Understand the System)

#### 1.1 Read: Logical Foundation
**File:** `lore-research/Important!/LOGICAL_FOUNDATION.md`

**Purpose:** Understand the core logic chain and what we're claiming vs. not claiming

**Key Questions:**
- Is the logic chain sound? (Gates → Star Systems → Thematic Matching)
- Are the claims defensible?
- Is the framing honest and transparent?

---

#### 1.2 Read: Star System Baseline Research
**File:** `lore-research/Important!/STAR_SYSTEM_BASELINE_RESEARCH.md`

**Purpose:** Understand why Phase 0 (star system characteristics) must come before Phase 1 (gate research)

**Key Questions:**
- Is the research priority correct?
- Are the quality standards appropriate?
- Is the two-sided documentation approach valid?

---

#### 1.3 Read: Star System Baseline Synthesis
**File:** `lore-research/star-systems/BASELINE_SYNTHESIS.md`

**Purpose:** Review the documented characteristics for each of the 8 star systems

**Key Questions:**
- Are the evidence quality standards appropriate?
- Are consensus levels (HIGH/MEDIUM/LOW) defensible?
- Are disputed sources handled properly?
- Is ancient vs. modern source separation valid?

---

### Phase 2: Research Templates (Understand the Process)

#### 2.1 Read: Template Pass A (Initial Research)
**File:** `lore-research/prompts/TEMPLATE_PASS_A.txt`

**Purpose:** Understand how initial gate research is conducted

**Key Questions:**
- Does Pass A gather appropriate initial data?
- Are the requirements clear and achievable?
- Is the JSON output format appropriate?

---

#### 2.2 Read: Template Pass B (Thematic Synthesis)
**File:** `lore-research/prompts/TEMPLATE_PASS_B.txt`

**Purpose:** Understand how thematic connections are identified

**Key Questions:**
- Is the thematic matching approach valid?
- Are confidence levels assigned appropriately?
- Is the rationale requirement sufficient?

---

#### 2.3 Read: Template Pass C (Citation Upgrade)
**File:** `lore-research/prompts/TEMPLATE_PASS_C.txt`

**Purpose:** Understand how citations are strengthened

**Key Questions:**
- Are citation quality standards appropriate?
- Is the upgrade process rigorous enough?
- Are page numbers and quotes required appropriately?

---

### Phase 3: Actual Research Output (See It In Action)

#### 3.1 Read: Gate 1 Pass A Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-a.json`

**Purpose:** See initial research results for Gate 1

**Key Questions:**
- Does the output match template requirements?
- Is the initial research quality acceptable?
- Are sources diverse and credible?

---

#### 3.2 Read: Gate 1 Pass B Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-b.json`

**Purpose:** See thematic synthesis for Gate 1

**Key Questions:**
- Are thematic connections logical?
- Are confidence levels justified?
- Are rationales clear and defensible?

---

#### 3.3 Read: Gate 1 Pass C Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Purpose:** See final citation-upgraded research for Gate 1

**Key Questions:**
- Are citations specific and verifiable?
- Do quotes support the claims?
- Is provenance complete?

---

### Phase 4: Quality Control (Validation Process)

#### 4.1 Read: Citation Quality Standards
**File:** `lore-research/CITATION_QUALITY_STANDARDS.md`

**Purpose:** Understand what makes a citation acceptable

**Key Questions:**
- Are standards rigorous enough?
- Are they achievable for esoteric sources?
- Is the balance between rigor and practicality appropriate?

---

#### 4.2 Read: Comet Response Checklist
**File:** `lore-research/COMET_RESPONSE_CHECKLIST.md`

**Purpose:** Understand validation criteria for research outputs

**Key Questions:**
- Is the checklist comprehensive?
- Are rejection criteria appropriate?
- Does it catch quality issues effectively?

---

### Phase 5: Implementation (How It Works in the App)

#### 5.1 Read: Scorer Algorithm
**File:** `star-system-sorter/src/lib/scorer.ts`

**Purpose:** Understand how research translates to classification

**Key Questions:**
- Is the scoring algorithm deterministic?
- Is the hybrid classification logic sound?
- Are percentages calculated correctly?

---

#### 5.2 Read: Lore Bundle Schema
**File:** `star-system-sorter/src/lib/schemas.ts` (LoreRule interface)

**Purpose:** Understand how research is structured in code

**Key Questions:**
- Does the schema capture all necessary metadata?
- Is provenance tracked properly?
- Can users verify sources?

---

### Phase 6: User Experience (How It's Presented)

#### 6.1 Read: Why Screen Implementation
**File:** `star-system-sorter/src/screens/WhyScreen.tsx`

**Purpose:** See how contributing factors are shown to users

**Key Questions:**
- Is transparency adequate?
- Can users understand why they got their result?
- Are sources accessible?

---

#### 6.2 Read: Dossier Screen Implementation
**File:** `star-system-sorter/src/screens/DossierScreen.tsx`

**Purpose:** See full provenance display (rule IDs, sources, confidence)

**Key Questions:**
- Is full provenance available?
- Can users verify claims?
- Is the presentation clear?

---

## Evaluation Workflow

### Step 1: Foundation Review (30 minutes)
Read Phase 1 documents (1.1 → 1.2 → 1.3) to understand:
- What we're building
- Why we're building it this way
- What we claim vs. don't claim

**Checkpoint:** Does the foundational logic make sense?

---

### Step 2: Process Review (20 minutes)
Read Phase 2 documents (2.1 → 2.2 → 2.3) to understand:
- How research is conducted
- What quality standards are applied
- How citations are upgraded

**Checkpoint:** Is the research process rigorous enough?

---

### Step 3: Output Review (15 minutes)
Read Phase 3 documents (3.1 → 3.2 → 3.3) to see:
- Actual research results
- How templates are applied
- Quality of final output

**Checkpoint:** Does the output meet the standards?

---

### Step 4: Quality Control Review (15 minutes)
Read Phase 4 documents (4.1 → 4.2) to understand:
- What makes citations acceptable
- How outputs are validated
- What causes rejection

**Checkpoint:** Are quality controls adequate?

---

### Step 5: Implementation Review (20 minutes)
Read Phase 5 documents (5.1 → 5.2) to see:
- How research becomes code
- How scoring works
- How classification is determined

**Checkpoint:** Is the algorithm sound?

---

### Step 6: UX Review (15 minutes)
Read Phase 6 documents (6.1 → 6.2) to see:
- How results are presented
- How transparency is achieved
- How users can verify claims

**Checkpoint:** Is user-facing transparency adequate?

---

## Total Time: ~2 hours for complete evaluation

---

## Quick Evaluation (30 minutes)

If time is limited, prioritize:

1. **Foundation:** `LOGICAL_FOUNDATION.md` (10 min)
2. **Process:** `TEMPLATE_PASS_B.txt` (5 min)
3. **Output:** `gate-1-pass-c.json` (5 min)
4. **Implementation:** `scorer.ts` (5 min)
5. **UX:** `DossierScreen.tsx` (5 min)

This gives a representative sample of the full system.

---

## Beam Prompt Structure

### Option A: Sequential Evaluation (Recommended)

Send one comprehensive prompt with reading order specified:

```
Please evaluate the Star System Sorter methodology by reading the following documents in order:

PHASE 1 - FOUNDATION (Read First):
1. lore-research/Important!/LOGICAL_FOUNDATION.md
2. lore-research/Important!/STAR_SYSTEM_BASELINE_RESEARCH.md
3. lore-research/star-systems/BASELINE_SYNTHESIS.md

PHASE 2 - PROCESS (Read Second):
4. lore-research/prompts/TEMPLATE_PASS_A.txt
5. lore-research/prompts/TEMPLATE_PASS_B.txt
6. lore-research/prompts/TEMPLATE_PASS_C.txt

PHASE 3 - OUTPUT (Read Third):
7. lore-research/research-outputs/gate-1/gate-1-pass-a.json
8. lore-research/research-outputs/gate-1/gate-1-pass-b.json
9. lore-research/research-outputs/gate-1/gate-1-pass-c.json

PHASE 4 - QUALITY CONTROL (Read Fourth):
10. lore-research/CITATION_QUALITY_STANDARDS.md
11. lore-research/COMET_RESPONSE_CHECKLIST.md

PHASE 5 - IMPLEMENTATION (Read Fifth):
12. star-system-sorter/src/lib/scorer.ts
13. star-system-sorter/src/lib/schemas.ts (LoreRule interface)

PHASE 6 - USER EXPERIENCE (Read Last):
14. star-system-sorter/src/screens/WhyScreen.tsx
15. star-system-sorter/src/screens/DossierScreen.tsx

After reading in this order, please evaluate:
[Insert validation questions from BEAM_VALIDATION_PROMPT.md]
```

---

### Option B: Phased Evaluation (More Thorough)

Send 3 separate Beams:

**Beam 1: Foundation & Process**
- Phase 1 + Phase 2 documents
- Questions: Is the logic sound? Is the process rigorous?

**Beam 2: Output & Quality**
- Phase 3 + Phase 4 documents
- Questions: Does output meet standards? Are quality controls adequate?

**Beam 3: Implementation & UX**
- Phase 5 + Phase 6 documents
- Questions: Is the algorithm sound? Is transparency adequate?

---

## Key Evaluation Checkpoints

After each phase, models should be able to answer:

### After Phase 1 (Foundation)
- ✅ Do I understand what this system does?
- ✅ Do I understand what it claims vs. doesn't claim?
- ✅ Is the foundational logic sound?

### After Phase 2 (Process)
- ✅ Do I understand how research is conducted?
- ✅ Are the templates appropriate?
- ✅ Are quality standards clear?

### After Phase 3 (Output)
- ✅ Does the actual output match the templates?
- ✅ Is the research quality acceptable?
- ✅ Are thematic connections logical?

### After Phase 4 (Quality Control)
- ✅ Are citation standards rigorous enough?
- ✅ Is the validation process adequate?
- ✅ Would I accept this research quality?

### After Phase 5 (Implementation)
- ✅ Does the code match the methodology?
- ✅ Is the algorithm deterministic?
- ✅ Is provenance tracked properly?

### After Phase 6 (UX)
- ✅ Can users understand their results?
- ✅ Can users verify claims?
- ✅ Is transparency adequate?

---

## Red Flags to Watch For

If any model says:

- 🚩 "I don't understand the logic chain" → Foundation issue
- 🚩 "The research process is too loose" → Process issue
- 🚩 "The output quality is insufficient" → Output issue
- 🚩 "Citations are not verifiable" → Quality control issue
- 🚩 "The algorithm is not deterministic" → Implementation issue
- 🚩 "Users can't verify claims" → UX issue

---

## Success Criteria

**Pass:** 6+ models agree after full evaluation that:
- Foundation logic is sound
- Research process is rigorous
- Output quality is acceptable
- Quality controls are adequate
- Implementation is correct
- UX transparency is sufficient

**Needs Work:** 3-5 models flag specific issues in any phase

**Fail:** 5+ models have fundamental concerns about foundation or process

---

## Next Steps After Evaluation

1. **Compile feedback** using `BEAM_RESPONSE_MATRIX.md`
2. **Identify patterns** across model responses
3. **Prioritize fixes** based on consensus
4. **Update documents** based on feedback
5. **Re-evaluate** if major changes made

---

## Document Locations

All documents referenced are in the repository:

```
lore-research/
├── Important!/
│   ├── LOGICAL_FOUNDATION.md
│   ├── STAR_SYSTEM_BASELINE_RESEARCH.md
│   └── RESEARCH_PHASES.md
├── star-systems/
│   └── BASELINE_SYNTHESIS.md
├── prompts/
│   ├── TEMPLATE_PASS_A.txt
│   ├── TEMPLATE_PASS_B.txt
│   └── TEMPLATE_PASS_C.txt
├── research-outputs/gate-1/
│   ├── gate-1-pass-a.json
│   ├── gate-1-pass-b.json
│   └── gate-1-pass-c.json
├── CITATION_QUALITY_STANDARDS.md
└── COMET_RESPONSE_CHECKLIST.md

star-system-sorter/src/
├── lib/
│   ├── scorer.ts
│   └── schemas.ts
└── screens/
    ├── WhyScreen.tsx
    └── DossierScreen.tsx
```

---

**Recommendation:** Use Option A (Sequential Evaluation) with the full reading order for most comprehensive feedback. This ensures models understand the complete system before evaluating specific aspects.

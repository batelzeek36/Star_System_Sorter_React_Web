# Star System Sorter - Complete Beam Validation Prompt

## Instructions for Big-AGI Beam

Copy this entire prompt and send via Beam to all available models (Claude, GPT-4, GPT-4o, Grok, Perplexity, etc.)

---

## Evaluation Task

I'm building a web application called **Star System Sorter** that maps Human Design birth chart data to star system archetypes. I need you to evaluate the logical soundness, research quality, and defensibility of this methodology.

**Please read the following documents in order before evaluating:**

---

## PHASE 1: FOUNDATION (Read First)

### 1.1 Logical Foundation
**File:** `lore-research/Important!/LOGICAL_FOUNDATION.md`

**Key Concepts:**
- Logic chain: Gates (documented) → Star Systems (documented) → Thematic Matching (logical)
- What we claim: Archetypal synthesis with full citations
- What we DON'T claim: Scientific fact, literal extraterrestrial origins
- Legal framing: "For insight & entertainment" with full disclaimers

**Summary:**
We're creating a synthesis system that:
1. Takes established Human Design gate meanings (Ra Uru Hu, 1987-present)
2. Takes documented star system archetypes (esoteric literature, ancient sources)
3. Identifies thematic pattern matches between them
4. Documents logic with full citations and confidence levels
5. Presents results transparently

---

### 1.2 Star System Baseline Research
**File:** `lore-research/Important!/STAR_SYSTEM_BASELINE_RESEARCH.md`

**Key Concepts:**
- Phase 0 (star system characteristics) MUST come before Phase 1 (gate research)
- Each star system needs 5+ sources with full citations
- Mix of ancient and modern sources required
- Consensus patterns must be identified

**Why This Matters:**
Without documented star system characteristics, gate-to-star-system mappings are just guessing. This establishes the foundation that makes all mappings defensible.

---

### 1.3 Star System Baseline Synthesis
**File:** `lore-research/star-systems/BASELINE_SYNTHESIS.md`

**Key Concepts:**
- Evidence quality framework (ancient/research/channeled/indigenous/controversial)
- Consensus levels (HIGH/MEDIUM/LOW)
- Required elements per trait (3+ sources, quotes ≤25 words, page numbers)
- Handling of disputed sources (Dogon/Sirius, Hill star map, etc.)

**Example - Sirius:**
- Trait: "Teachers and wisdom keepers"
- Consensus: HIGH
- Ancient support: HIGH (Egyptian Sopdet/Sothis)
- Sources: Pyramid Texts, Law of One, Dogon tradition (disputed)

---

## PHASE 2: RESEARCH PROCESS (Read Second)

### 2.1 Template Pass A - Initial Research
**File:** `lore-research/prompts/TEMPLATE_PASS_A.txt`

**Purpose:** Gather initial gate meanings and star system candidates

**Key Requirements:**
- Gate meaning from Ra Uru Hu
- 3-5 star system candidates with rationale
- Initial sources and citations
- JSON output format

---

### 2.2 Template Pass B - Thematic Synthesis
**File:** `lore-research/prompts/TEMPLATE_PASS_B.txt`

**Purpose:** Identify thematic connections and assign confidence levels

**Key Requirements:**
- Thematic rationale for each system match
- Confidence level (1-5) with justification
- Evidence type (explicit/thematic/cross-cultural/inferred)
- Ancient wisdom support where applicable

---

### 2.3 Template Pass C - Citation Upgrade
**File:** `lore-research/prompts/TEMPLATE_PASS_C.txt`

**Purpose:** Strengthen citations with specific page numbers and quotes

**Key Requirements:**
- Direct quotes ≤25 words
- Page numbers or section identifiers
- Edition information
- Working URLs where available
- Dispute notation for controversial claims

---

## PHASE 3: ACTUAL OUTPUT (Read Third)

### 3.1 Gate 1 Pass A Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-a.json`

**What to Look For:**
- Does output match template requirements?
- Are initial sources diverse and credible?
- Are star system candidates logical?

---

### 3.2 Gate 1 Pass B Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-b.json`

**What to Look For:**
- Are thematic connections logical?
- Are confidence levels justified?
- Are rationales clear and defensible?

**Example Connection:**
- Gate 1 (creative self-expression) → Pleiades (artistic nature)
- Confidence: 5/5
- Rationale: "Both embody creative expression and artistic manifestation"

---

### 3.3 Gate 1 Pass C Output
**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**What to Look For:**
- Are citations specific and verifiable?
- Do quotes support the claims?
- Is provenance complete?

---

## PHASE 4: QUALITY CONTROL (Read Fourth)

### 4.1 Citation Quality Standards
**File:** `lore-research/CITATION_QUALITY_STANDARDS.md`

**Key Standards:**
- Minimum 3 sources per trait
- Direct quotes with page numbers
- Mix of source types (not all channeled)
- Explicit dispute notation
- Ancient support level noted

---

### 4.2 Comet Response Checklist
**File:** `lore-research/COMET_RESPONSE_CHECKLIST.md`

**Validation Criteria:**
- Are sources properly labeled by type?
- Are disputed claims marked with counter-evidence?
- Do HIGH consensus traits have 3+ independent sources?
- Are quotes ≤25 words with page numbers?
- Are controversial sources flagged?

---

## PHASE 5: IMPLEMENTATION (Read Fifth)

### 5.1 Scorer Algorithm
**File:** `star-system-sorter/src/lib/scorer.ts`

**Key Functions:**
- `matchLoreRules()` - Matches HD attributes to lore rules
- `computeScoresWithLore()` - Calculates raw scores and percentages
- `classify()` - Determines primary/hybrid/unresolved classification

**Classification Logic:**
- Primary: Lead > 6% over second place
- Hybrid: Top two within 6% of each other
- Unresolved: No clear classification

---

### 5.2 Lore Bundle Schema
**File:** `star-system-sorter/src/lib/schemas.ts`

**Key Interfaces:**
- `LoreRule` - Captures rule ID, conditions, system weights, rationale, sources, confidence
- `EnhancedContributor` - Includes provenance metadata for transparency

---

## PHASE 6: USER EXPERIENCE (Read Last)

### 6.1 Why Screen
**File:** `star-system-sorter/src/screens/WhyScreen.tsx`

**Shows Users:**
- Contributing factors (gates, channels, centers)
- Weights for each contributor
- System summaries with percentages

---

### 6.2 Dossier Screen
**File:** `star-system-sorter/src/screens/DossierScreen.tsx`

**Shows Users:**
- Full provenance (rule IDs, sources, confidence levels)
- Evidence matrix with filtering
- Source citations with links
- Confidence level indicators

---

## EVALUATION QUESTIONS

After reading all documents in order, please evaluate:

### 1. Logical Consistency (1-5 rating)
- Is the methodology internally consistent?
- Does the logic chain (gates → star systems → scoring) hold up?
- Are there any circular reasoning issues?
- Is the deterministic algorithm approach sound?

### 2. Research Quality (1-5 rating)
- Are the evidence standards appropriate for this type of synthesis?
- Is the source classification system (ancient/research/channeled/etc.) reasonable?
- Are the consensus levels (HIGH/MEDIUM/LOW) defensible?
- What gaps or weaknesses do you see in the research approach?

### 3. Defensibility (1-5 rating)
- Is the legal/ethical framing adequate?
- Are the disclaimers sufficient?
- What claims (if any) are overreaching?
- How would you rate the intellectual honesty of this approach?

### 4. Comparison to Similar Systems
- How does this compare to astrology (birth data → archetypes)?
- How does this compare to Myers-Briggs or Enneagram?
- Is the synthesis approach valid for this type of framework?

### 5. Red Flags
- What are the biggest risks or vulnerabilities in this methodology?
- Where is the system most likely to be criticized?
- What would strengthen the defensibility?

### 6. Cultural Sensitivity
- Is the use of indigenous/ancient sources respectful and appropriate?
- Are disputed claims (like Dogon/Sirius) handled properly?
- What cultural sensitivity issues should be addressed?

### 7. Specific Example Evaluation
**Gate 1 → Pleiades mapping:**
- Does the thematic match (creative expression ↔ artistic nature) make sense?
- Is confidence level 5/5 justified?
- What would make this connection stronger or weaker?

### 8. Process Evaluation
**Three-pass research process (A → B → C):**
- Is this process rigorous enough?
- Are the templates well-designed?
- Does the output quality justify the process?

### 9. Implementation Evaluation
**Scorer algorithm and classification logic:**
- Is the algorithm deterministic and fair?
- Is the 6% hybrid threshold reasonable?
- Is provenance tracked adequately?

### 10. Transparency Evaluation
**Why Screen and Dossier Screen:**
- Can users understand their results?
- Can users verify claims?
- Is transparency adequate for this type of system?

---

## RESPONSE FORMAT

Please provide:

### Overall Assessment (1-2 paragraphs)
- Is this methodology sound for its stated purpose (self-exploration/entertainment)?
- What's your confidence level in this approach?

### Strengths (bullet points)
- What aspects are well-designed?
- What makes this defensible?

### Weaknesses (bullet points)
- What needs improvement?
- What are the vulnerabilities?

### Recommendations (bullet points)
- Specific suggestions to strengthen the system
- Priority order if possible

### Risk Assessment (1-5 scale)
- 1 = High risk of criticism/legal issues
- 5 = Well-defended, minimal risk

### Comparison Rating
- How does this compare to astrology/MBTI/Enneagram in terms of logical rigor?
- Is it more rigorous, less rigorous, or comparable?

### Launch Readiness
- Ready to launch as-is?
- Ready with minor changes?
- Needs significant work?
- Not ready (major revisions needed)?

---

## CONTEXT

This is a React web app (MVP phase) that:
- Uses Human Design birth chart API (BodyGraph Chart)
- Applies proprietary scoring algorithm based on researched lore
- Presents results with visual crests and percentages
- Includes "Why" screen showing contributing factors
- Includes "Dossier" screen with full provenance (rule IDs, sources, confidence)

**Goal:** Create a researched, transparent, logically-consistent synthesis for self-exploration and entertainment, NOT to prove extraterrestrial origins or make scientific claims.

**Legal Disclaimer (on all screens):**
> "For insight & entertainment. Not medical, financial, or legal advice. Star system classifications are based on archetypal synthesis and esoteric research. They represent thematic alignments derived from documented sources, not scientific or historical facts."

---

## YOUR TASK

Evaluate this methodology as if you were:
1. **A skeptical academic** reviewing the research quality
2. **A legal advisor** assessing liability risks
3. **A UX researcher** evaluating transparency
4. **A cultural anthropologist** checking for appropriation issues

Be honest, critical, and constructive. I want to know where this system is weak so I can strengthen it before launch.

---

## IMPORTANT NOTES

- This is NOT claiming to be science or historical fact
- This IS claiming to be well-researched archetypal synthesis
- Users are told this is for "insight & entertainment"
- Full provenance is available for verification
- Disputed sources are marked as such
- Ancient vs. modern sources are clearly labeled

**The question is:** Given these constraints and framing, is this methodology defensible and valuable for its stated purpose?

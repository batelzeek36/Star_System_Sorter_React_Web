# Manual Scoring Workbook - Personal Chart Analysis

**Purpose**: Create a definitive ground truth by manually scoring your own Human Design chart against the 8 star systems. This serves as the gold standard for validating automated scoring systems and calibrating the methodology.

**Status**: 🟡 Ready to Begin

---

## Why Manual Scoring First?

1. **You're the domain expert** - 862-1,656 hours of research makes your judgment the gold standard
2. **Calibrate weight ranges** - Understand what 0.65 vs 0.78 actually means in practice
3. **Identify edge cases** - Document ambiguities that LLMs miss
4. **Create training data** - Your outputs become reference examples for future automation
5. **Validate the system** - If your own chart doesn't "feel right", the methodology needs adjustment

---

## Pre-Flight Checklist

### Step 1: Gather Your Birth Data

- [ ] Birth Date: `__10/03/1992________`
- [ ] Birth Time: `__12:03AM________`
- [ ] Birth Location: `___Attleboro, MA_______`
- [ ] Timezone: `___New York_______`

### Step 2: Generate Your HD Chart

**Option A: Use BodyGraph API (if available)**
```bash
# From star-system-sorter directory
npm run dev  # Start dev server
# Navigate to http://localhost:5173/input
# Enter your birth data and submit
# Save the raw API response to: GPT-5/manual-scoring/my-chart-raw.json
```

**Option B: Use External HD Calculator**
- Visit: https://www.mybodygraph.com or https://www.jovianarchive.com
- Generate chart and manually record activations
- Save to: `GPT-5/manual-scoring/my-chart-manual.txt`

### Step 3: Identify Your Activations

Extract the following from your chart:

**Personality (Conscious) Activations:**
- Sun: Gate ___ . Line ___
- Earth: Gate ___ . Line ___
- North Node: Gate ___ . Line ___
- South Node: Gate ___ . Line ___
- Moon: Gate ___ . Line ___
- Mercury: Gate ___ . Line ___
- Venus: Gate ___ . Line ___
- Mars: Gate ___ . Line ___
- Jupiter: Gate ___ . Line ___
- Saturn: Gate ___ . Line ___
- Uranus: Gate ___ . Line ___
- Neptune: Gate ___ . Line ___
- Pluto: Gate ___ . Line ___

**Design (Unconscious) Activations:**
- Sun: Gate ___ . Line ___
- Earth: Gate ___ . Line ___
- North Node: Gate ___ . Line ___
- South Node: Gate ___ . Line ___
- Moon: Gate ___ . Line ___
- Mercury: Gate ___ . Line ___
- Venus: Gate ___ . Line ___
- Mars: Gate ___ . Line ___
- Jupiter: Gate ___ . Line ___
- Saturn: Gate ___ . Line ___
- Uranus: Gate ___ . Line ___
- Neptune: Gate ___ . Line ___
- Pluto: Gate ___ . Line ___

**Total Activations**: ~26 (13 Personality + 13 Design)

### Step 4: Create Working Directory

```bash
mkdir -p GPT-5/manual-scoring
mkdir -p GPT-5/manual-scoring/notes
mkdir -p GPT-5/manual-scoring/star-maps
mkdir -p GPT-5/manual-scoring/evidence
```

---

## Scoring Workflow (Per Activation)

For each of your ~26 activations, follow this process:

### Phase 1: Read Source Material

**For Gate N, Line L:**

1. **Read Line Companion (primary source)**
   - File: `claude/Full Pass/gate-{N}-full.json`
   - Focus on: `lines[L-1].text` and `lines[L-1].exaltation/detriment`
   - Note key themes, archetypes, behavioral patterns

2. **Read Legge I Ching (cross-reference)**
   - File: `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json`
   - Focus on: `lines[L-1].text`
   - Look for overlaps/tensions with Line Companion

3. **Read Star System Baselines (all 8)**
   - File: `GPT-5/combined-baselines-4.2.json`
   - Refresh your memory on each system's core themes
   - Systems: Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco

**Time estimate**: 5-10 minutes per activation

### Phase 2: Analyze & Score

**For each of the 8 star systems, ask:**

1. **Does this gate-line resonate with this star system?**
   - Strong alignment (0.65-0.95)
   - Moderate alignment (0.45-0.60)
   - Weak/supporting (0.30-0.40)
   - No alignment (0.00 - omit from output)

2. **What's the evidence?**
   - Which Line Companion quote best captures the match?
   - Which Legge quote supports it?
   - What keywords emerge from both sources?

3. **What's the polarity?**
   - Core expression (healthy, integrated)
   - Shadow expression (distorted, unintegrated)
   - Required when weight ≥ 0.40

4. **Primary or secondary role?**
   - Primary: The strongest match (only one per line)
   - Secondary: Supporting flavor (optional, max one)

**Time estimate**: 10-20 minutes per activation

### Phase 3: Apply Mechanical Constraints

**Before finalizing, verify:**

- [ ] **Top-2 constraint**: Max 2 systems with weight > 0
- [ ] **Role assignment**: Exactly one "primary", optional one "secondary"
- [ ] **Pairwise exclusions** (check all 6 invariants):
  - [ ] Pleiades ↔ Draco (max combined 0.95)
  - [ ] Sirius ↔ Orion Light (max combined 0.95)
  - [ ] Andromeda ↔ Orion Dark (max combined 0.95)
  - [ ] Arcturus ↔ Pleiades (max combined 0.95)
  - [ ] Lyra ↔ Draco (max combined 0.95)
  - [ ] Orion Light ↔ Orion Dark (max combined 0.95)
- [ ] **Polarity**: Required when weight ≥ 0.40
- [ ] **Precision**: All weights multiples of 0.01, capped at 0.95
- [ ] **Canonical ordering**: If tie, use system list order

**Time estimate**: 2-5 minutes per activation

### Phase 4: Extract Evidence (Sparse Format)

**Create two entries:**

1. **Star Map Entry** (weights + behavioral match)
2. **Evidence Entry** (quotes + reasoning)

**Template files to reference:**
- `GPT-5/star-maps/gateLine_star_map_Gate01.json`
- `GPT-5/evidence/gateLine_evidence_Gate01.json`

**Key rules:**
- Only include systems with weight > 0.0 (sparse format)
- Line Companion quote: ≤25 words, verbatim, from any line in the gate
- Legge quote: ≤25 words, verbatim, from same line if weight > 0.50
- Keywords: 2-6 terms from each source
- Reasoning: 1-2 sentences, cite quick_rules

**Time estimate**: 5-10 minutes per activation

---

## Output Format

### Star Map File: `GPT-5/manual-scoring/star-maps/my-chart-star-map.json`

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "chart_type": "personal_manual",
    "generated_at": "2025-01-15T18:30:00Z",
    "generator": "Manual",
    "scorer": "Domain Expert",
    "notes": "Ground truth for validation"
  },
  "activations": {
    "personality_sun": {
      "gate_line": "13.1",
      "mappings": [
        {
          "star_system": "Sirius",
          "weight": 0.78,
          "role": "primary",
          "polarity": "core",
          "confidence": 5,
          "behavioral_match": "Listening to collective stories...",
          "keywords": ["listener", "witness", "stories"],
          "why": "Sirius core — receptive witness to human experience"
        }
      ]
    },
    "personality_earth": {
      "gate_line": "7.4",
      "mappings": [
        {
          "star_system": "Arcturus",
          "weight": 0.65,
          "role": "primary",
          "polarity": "core",
          "confidence": 4,
          "behavioral_match": "Strategic influence through example...",
          "keywords": ["influence", "example", "strategy"],
          "why": "Arcturus core — leads through demonstration"
        }
      ]
    }
    // ... continue for all ~26 activations
  }
}
```

### Evidence File: `GPT-5/manual-scoring/evidence/my-chart-evidence.json`

```json
{
  "_meta": {
    "version": "4.2",
    "baseline_beacon": "59bfc617",
    "chart_type": "personal_manual",
    "generated_at": "2025-01-15T18:30:00Z",
    "generator": "Manual",
    "scorer": "Domain Expert"
  },
  "activations": {
    "personality_sun": {
      "gate_line": "13.1",
      "mappings": [
        {
          "star_system": "Sirius",
          "sources": {
            "legge1899": {
              "quote": "men of different clans unite",
              "locator": "Hex 13, Line 1",
              "attribution": "Legge 1899"
            },
            "line_companion": {
              "quote": "The ability to listen and witness",
              "locator": "Gate 13, Line 1",
              "attribution": "Ra Uru Hu (LC)"
            }
          },
          "atoms": {
            "hd_keywords": ["listen", "witness", "stories", "collective"],
            "ic_atoms": ["unite", "clans", "fellowship"]
          },
          "why_cited": "Sirius core — receptive witness to collective human stories, uniting diverse perspectives",
          "polarity": "core",
          "confidence": 5
        }
      ]
    }
    // ... continue for all activations
  }
}
```

---

## Decision Log Template

**File**: `GPT-5/manual-scoring/notes/decision-log.md`

For each difficult decision, document:

```markdown
### Gate N.L - [Star System]

**Date**: 2025-01-15
**Weight Assigned**: 0.XX
**Difficulty**: [Low / Medium / High]

**What made this tricky:**
- [Describe the ambiguity]

**Line Companion says:**
- [Key quote or theme]

**Legge says:**
- [Key quote or theme]

**Why I chose this weight:**
- [Your reasoning]

**Alternative interpretations considered:**
- [Other systems that almost fit]
- [Why you ruled them out]

**Confidence level**: [1-5]
```

---

## Validation Checkpoints

### After Each Activation

Run validation on your growing dataset:

```bash
cd GPT-5/scripts

# Validate structure (if you format as gate files)
python validate_gate_outputs.py N

# Verify quotes
python verify_quotes.py N
```

**Note**: You may need to adapt these scripts to handle the "personal chart" format vs. "full gate" format. Consider creating a conversion script.

### After All Activations

1. **Run the scorer**:
   ```bash
   cd star-system-sorter
   # Create a test that loads your manual scoring
   npm run test -- scorer-manual.test.ts
   ```

2. **Check the classification**:
   - Does your primary star system "feel right"?
   - Do the percentages make sense?
   - Are allies/hybrids meaningful?

3. **Compare against intuition**:
   - Write a reflection: `GPT-5/manual-scoring/notes/self-assessment.md`
   - What surprised you?
   - What confirmed your suspicions?
   - What feels off?

---

## Time Estimates

**Per activation**: 25-45 minutes
- Reading sources: 5-10 min
- Analysis: 10-20 min
- Constraints: 2-5 min
- Evidence extraction: 5-10 min
- Documentation: 3-5 min

**Total for ~26 activations**: 11-20 hours

**Spread over**: 3-5 days (2-4 hours per session)

---

## Expansion: Additional Charts

Once your own chart is complete, score 2-3 more charts:

### Chart 2: Girlfriend's Chart
- Different chart type (Generator vs. Projector, etc.)
- Tests consistency across chart types
- Validates that methodology isn't "overfit" to your chart

### Chart 3-4: Friends/Family
- Diverse activations (different gates/lines)
- Edge cases (rare combinations)
- Hybrid classifications

**Time per additional chart**: 10-18 hours

---

## Success Criteria

You'll know the manual scoring is complete when:

- [ ] All ~26 activations scored with weights + evidence
- [ ] Validation scripts pass (or you've documented why they don't)
- [ ] Decision log captures all difficult calls
- [ ] Self-assessment written
- [ ] Classification result "feels right" intuitively
- [ ] You have confidence in the weight calibration ranges
- [ ] Edge cases are documented for future automation

---

## Next Steps After Manual Scoring

1. **Create reference dataset**:
   - Your manual outputs become "test fixtures"
   - LLM outputs can be compared against your ground truth

2. **Calibrate LLM prompts**:
   - Use your decision log to improve prompt instructions
   - Add examples from your difficult cases

3. **Build comparison tools**:
   - Script to diff LLM output vs. your manual output
   - Highlight where LLMs deviate and by how much

4. **Iterate on methodology**:
   - If your chart doesn't feel right, adjust the baselines
   - If weights feel wrong, recalibrate the ranges
   - If evidence is weak, strengthen the source material

---

## Resources

**Source Files:**
- Star system baselines: `GPT-5/combined-baselines-4.2.json`
- Line Companion gates: `claude/Full Pass/gate-{N}-full.json`
- Legge hexagrams: `claude/I-Ching-Full-Pass/hexagram-{N:02d}.json`

**Reference Examples:**
- Gate 1 star map: `GPT-5/star-maps/gateLine_star_map_Gate01.json`
- Gate 1 evidence: `GPT-5/evidence/gateLine_evidence_Gate01.json`

**Validation Tools:**
- Schema validation: `GPT-5/scripts/validate_gate_outputs.py`
- Quote verification: `GPT-5/scripts/verify_quotes.py`
- Invariant fuzzing: `GPT-5/scripts/fuzz_invariants.py`

**Documentation:**
- Gate scoring workflow: `.kiro/steering/gate-scoring-workflow.md`
- Validation quick reference: `GPT-5/scripts/VALIDATION_QUICK_REFERENCE.md`
- Quote validation rules: `GPT-5/docs/QUOTE_VALIDATION_RULES.md`

---

## Notes & Observations

Use this section to capture insights as you work:

- **Weight calibration insights**: [What you learned about 0.65 vs 0.78]
- **Common patterns**: [Themes that emerged across activations]
- **Surprising findings**: [What didn't match expectations]
- **Methodology improvements**: [Ideas for refining the system]
- **LLM comparison notes**: [How your judgment differs from automated scoring]

---

**Ready to begin?** Start with Step 1 of the Pre-Flight Checklist above. Good luck! 🚀

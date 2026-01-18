# Beam Validation - Quick Start Guide

## What This Is

A comprehensive validation system for cross-checking the Star System Sorter methodology across multiple AI models using Big-AGI's "Beam" feature.

---

## Files in This Directory

### 1. `COMPLETE_BEAM_PROMPT.md` ⭐ START HERE
**Use this for your Beam request**

Contains:
- Complete evaluation prompt with reading order
- All 6 phases of documents to review
- 10 evaluation questions
- Response format requirements

**How to use:**
1. Copy entire contents
2. Paste into Big-AGI
3. Send as Beam to all models
4. Wait for responses

---

### 2. `EVALUATION_ORDER.md`
**Reference guide for evaluation sequence**

Contains:
- Detailed explanation of each phase
- Why documents should be read in this order
- Checkpoints after each phase
- Time estimates
- Quick evaluation option (30 min)

**Use this to:**
- Understand the evaluation logic
- Explain the process to others
- Create custom evaluation sequences

---

### 3. `BEAM_VALIDATION_PROMPT.md`
**Original validation prompt (without reading order)**

Contains:
- Methodology explanation
- Evidence standards
- Example mappings
- Validation questions

**Use this if:**
- You want to customize the prompt
- You're sending documents separately
- You need a shorter version

---

### 4. `BEAM_TEST_CASES.md`
**Specific test cases for follow-up validation**

Contains:
- 10 detailed test cases
- Edge cases (disputed sources, channeled-only systems)
- Hybrid classification logic
- Legal disclaimer adequacy
- Success criteria

**Use this for:**
- Follow-up questions after initial Beam
- Targeted validation of specific concerns
- Deeper dive on controversial areas

---

## Quick Start (5 minutes)

### Step 1: Copy the Prompt
Open `COMPLETE_BEAM_PROMPT.md` and copy everything

### Step 2: Open Big-AGI
Navigate to your Big-AGI instance

### Step 3: Send Beam
1. Paste the prompt
2. Click "Beam" button
3. Select all available models:
   - Claude 3.5 Sonnet
   - Claude 3 Opus
   - GPT-4 Turbo
   - GPT-4o
   - Grok 2
   - Perplexity Pro
   - Any others you have configured

### Step 4: Wait for Responses
Models will respond in parallel (usually 1-3 minutes)

### Step 5: Analyze Results
Use `../BEAM_RESPONSE_MATRIX.md` to organize feedback

---

## What to Expect

### Response Time
- **Fast models** (GPT-4o, Grok): 30-60 seconds
- **Thorough models** (Claude Opus, Perplexity): 2-3 minutes
- **Total time**: 3-5 minutes for all responses

### Response Length
- **Concise models**: 500-1000 words
- **Detailed models**: 1500-3000 words
- **Very thorough models**: 3000+ words

### Response Quality
- **All models** should address the 10 evaluation questions
- **Most models** will provide ratings (1-5 scale)
- **Some models** will give specific recommendations
- **Best models** will identify risks and suggest improvements

---

## Evaluation Phases (What Models Will Read)

### Phase 1: Foundation (3 documents)
- Logical Foundation
- Star System Baseline Research
- Baseline Synthesis

**Purpose:** Understand what we're building and why

---

### Phase 2: Process (3 documents)
- Template Pass A (Initial Research)
- Template Pass B (Thematic Synthesis)
- Template Pass C (Citation Upgrade)

**Purpose:** Understand how research is conducted

---

### Phase 3: Output (3 documents)
- Gate 1 Pass A JSON
- Gate 1 Pass B JSON
- Gate 1 Pass C JSON

**Purpose:** See actual research results

---

### Phase 4: Quality Control (2 documents)
- Citation Quality Standards
- Comet Response Checklist

**Purpose:** Understand validation criteria

---

### Phase 5: Implementation (2 documents)
- Scorer Algorithm (scorer.ts)
- Lore Bundle Schema (schemas.ts)

**Purpose:** See how research becomes code

---

### Phase 6: User Experience (2 documents)
- Why Screen (WhyScreen.tsx)
- Dossier Screen (DossierScreen.tsx)

**Purpose:** See how results are presented to users

---

## Key Questions Models Will Answer

1. **Logical Consistency** (1-5 rating)
2. **Research Quality** (1-5 rating)
3. **Defensibility** (1-5 rating)
4. **Comparison to Similar Systems** (qualitative)
5. **Red Flags** (list)
6. **Cultural Sensitivity** (concerns)
7. **Specific Example** (Gate 1 → Pleiades)
8. **Process Evaluation** (3-pass system)
9. **Implementation** (algorithm soundness)
10. **Transparency** (user-facing)

---

## Success Criteria

### ✅ PASS (Ready to Launch)
- 6+ models rate methodology 4-5/5
- 6+ models rate risk 3-5/5 (acceptable)
- 6+ models say "ready to launch" or "ready with minor changes"
- No major red flags raised by multiple models

### ⚠️ NEEDS WORK (Fixable Issues)
- 3-5 models raise specific concerns
- Issues are in implementation, not foundation
- Recommendations are actionable
- Can be fixed in 1-2 days

### ❌ FAIL (Major Revisions Needed)
- 5+ models rate methodology 1-2/5
- 5+ models rate risk 1-2/5 (high risk)
- Multiple models say "not ready"
- Foundation or logic chain is questioned

---

## After You Get Responses

### Step 1: Organize Feedback
Use `../BEAM_RESPONSE_MATRIX.md` to create a comparison table

### Step 2: Identify Consensus
- What do 6+ models agree on? → That's solid
- What do 4-5 models flag? → Needs attention
- What's split? → Judgment call

### Step 3: Prioritize Fixes
- **Critical:** Issues raised by 6+ models
- **High:** Issues raised by 4-5 models
- **Medium:** Issues raised by 2-3 models
- **Low:** Issues raised by 1 model only

### Step 4: Make Improvements
Address critical and high-priority issues first

### Step 5: Re-validate (if needed)
If you make major changes, run Beam again

---

## Common Patterns to Watch For

### High Agreement (Expected)
- ✅ Methodology is internally consistent
- ✅ Evidence standards are appropriate
- ✅ Disclaimers are necessary
- ✅ Transparency is a strength

### Potential Disagreement
- ⚠️ Whether disputed sources should be included
- ⚠️ Whether channeled-only systems are valid
- ⚠️ Appropriate confidence levels
- ⚠️ Whether 6% tie threshold is reasonable

### Red Flags (Address Immediately)
- 🚩 Methodology is fundamentally flawed
- 🚩 Claims are overreaching
- 🚩 Cultural appropriation concerns
- 🚩 Legal/ethical risks too high

---

## Tips for Best Results

### Do:
- ✅ Send to 6+ models for good consensus
- ✅ Use the complete prompt (includes reading order)
- ✅ Wait for all responses before analyzing
- ✅ Look for patterns across models
- ✅ Take criticism seriously

### Don't:
- ❌ Cherry-pick favorable responses
- ❌ Ignore consensus concerns
- ❌ Skip the response matrix
- ❌ Launch without addressing critical issues
- ❌ Dismiss cultural sensitivity feedback

---

## Follow-Up Questions

If you need deeper validation on specific points, use test cases from `BEAM_TEST_CASES.md`:

- **TC1:** Gate 1 → Pleiades (strong match)
- **TC2:** Gate 13 → Sirius (disputed sources)
- **TC4:** Gate 9 → Arcturus (no ancient support)
- **TC5:** Dogon/Sirius controversy
- **TC7:** David Icke / Draco (controversial source)
- **TC8:** Hybrid classification logic
- **TC9:** Legal disclaimer adequacy
- **TC10:** Comparison to astrology

---

## Troubleshooting

### "Models aren't reading all documents"
- Try shorter prompt with just Phase 1-3
- Send phases separately
- Use Quick Evaluation version (30 min)

### "Responses are too generic"
- Add specific test cases from BEAM_TEST_CASES.md
- Ask for ratings (1-5) explicitly
- Request specific examples of concerns

### "Models disagree wildly"
- This is actually useful! Shows where methodology is unclear
- Focus on areas with 4+ model consensus
- Use disagreement to identify edge cases

### "All models say it's fine"
- Great! But double-check you're asking tough questions
- Try sending test cases for edge cases
- Consider adding a "devil's advocate" request

---

## Next Steps After Validation

1. **Document results** in BEAM_RESPONSE_MATRIX.md
2. **Identify consensus** (what 6+ models agree on)
3. **Address concerns** (prioritize by frequency)
4. **Update methodology** based on feedback
5. **Re-validate** if major changes made
6. **Proceed to launch** if consensus is positive

---

## Questions?

If you need help:
1. Check `EVALUATION_ORDER.md` for process details
2. Check `BEAM_TEST_CASES.md` for specific scenarios
3. Check `../BEAM_RESPONSE_MATRIX.md` for analysis template

---

## File Locations

```
lore-research/prompts/Beam/
├── README.md                      ← You are here
├── COMPLETE_BEAM_PROMPT.md        ← Use this for Beam
├── EVALUATION_ORDER.md            ← Reference guide
├── BEAM_VALIDATION_PROMPT.md      ← Original prompt
└── BEAM_TEST_CASES.md             ← Follow-up questions

lore-research/
└── BEAM_RESPONSE_MATRIX.md        ← Analysis template
```

---

**Ready to Beam!** 🚀

Copy `COMPLETE_BEAM_PROMPT.md` and send it to all your models. Good luck!

# Beam Validation - Quick Start Guide

## What You Need

### 1. The Main Prompt
**File:** `lore-research/prompts/Beam/COMPLETE_BEAM_PROMPT.md`

This is the master prompt that you'll paste into Big-AGI. It already contains references to all the other documents.

### 2. Template Prompts (Referenced by Main Prompt)
These show the research process:
- `lore-research/prompts/TEMPLATE_PASS_A.txt`
- `lore-research/prompts/TEMPLATE_PASS_B.txt`
- `lore-research/prompts/TEMPLATE_PASS_C.txt`

### 3. Research Output JSONs (Referenced by Main Prompt)
These are the actual outputs to validate:
- `lore-research/research-outputs/gate-1/gate-1-pass-a.json`
- `lore-research/research-outputs/gate-1/gate-1-pass-b.json`
- `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

## How to Execute

### Step 1: Open Big-AGI
Navigate to your Big-AGI instance (https://big-agi.com or local installation)

### Step 2: Copy the Main Prompt
```bash
# Open this file and copy its entire contents:
lore-research/prompts/Beam/COMPLETE_BEAM_PROMPT.md
```

### Step 3: Paste into Big-AGI
Paste the entire COMPLETE_BEAM_PROMPT.md content into Big-AGI's chat interface

### Step 4: Click "Beam"
Click the Beam button to send the prompt to multiple AI models simultaneously

### Step 5: Select Models
Choose all available models:
- ✅ Claude 3.5 Sonnet
- ✅ Claude 3 Opus
- ✅ GPT-4 Turbo
- ✅ GPT-4o
- ✅ Grok 2
- ✅ Perplexity Pro
- ✅ Any other available models

### Step 6: Wait for Responses
Big-AGI will send the prompt to all selected models and collect their responses (typically 3-5 minutes)

### Step 7: Analyze Results
Use the Beam Response Matrix to analyze consensus:
- `lore-research/BEAM_RESPONSE_MATRIX.md` (template)
- Create dated copy: `BEAM_RESPONSE_MATRIX_YYYY-MM-DD.md`

## What Big-AGI Beam Does

The Beam function:
1. Reads the main prompt you pasted
2. Follows the file references in the prompt to read:
   - Template prompts (TEMPLATE_PASS_A/B/C.txt)
   - Research outputs (gate-1-pass-a/b/c.json)
3. Sends the complete context to all selected AI models
4. Collects and displays all responses for comparison

## Expected Output

Each AI model will evaluate:
- **Logical Consistency** (1-5 rating)
- **Research Quality** (1-5 rating)
- **Defensibility** (1-5 rating)
- **Risk Assessment** (1-5 rating)
- **Launch Readiness** (Ready/Minor Changes/Significant Work/Not Ready)
- **Strengths** (bullet points)
- **Weaknesses** (bullet points)
- **Recommendations** (bullet points)

## Success Criteria

✅ **PASS** if:
- 6+ models rate methodology 4-5/5
- 6+ models rate risk 3-5/5
- 6+ models say "Ready" or "Ready with minor changes"
- No major red flags from multiple models

⚠️ **NEEDS WORK** if:
- 4-5 models identify same critical issues
- Fixable problems identified
- Re-validation needed after fixes

❌ **FAIL** if:
- Multiple models rate methodology 1-2/5
- Multiple models say "Not ready"
- Fundamental flaws identified
- Major revisions required

## Troubleshooting

### "File not found" errors
- Ensure you're running Big-AGI from the project root directory
- Check that all referenced files exist in the correct locations

### Models not responding
- Verify API keys are configured in Big-AGI settings
- Check rate limits on API providers
- Try reducing number of models if timeout occurs

### Inconsistent responses
- This is expected! The goal is to identify consensus and outliers
- Focus on patterns across 4+ models
- Single-model concerns are noted but not critical

## Next Steps

After Beam execution:
1. Fill out the Response Matrix (Task 3.1-3.7)
2. Determine launch readiness (Task 4.1)
3. Prioritize action items (Task 4.2)
4. Create fix plan if needed (Task 4.3)
5. Implement fixes (Task 5.1-5.3)
6. Re-validate if major changes (Task 6.1-6.2)
7. Document and launch (Task 7.1-7.4)

## Questions?

See full task list: `.kiro/specs/cross-check/tasks.md`
See evaluation order: `lore-research/prompts/Beam/EVALUATION_ORDER.md`
See response matrix template: `lore-research/BEAM_RESPONSE_MATRIX.md`

# Beam Validation - Files Checklist

## Files You Need for Big-AGI Beam

### ✅ Main Prompt (Copy & Paste This)
- [ ] `lore-research/prompts/Beam/COMPLETE_BEAM_PROMPT.md`

### ✅ Template Prompts (Referenced by Main Prompt)
- [ ] `lore-research/prompts/TEMPLATE_PASS_A.txt`
- [ ] `lore-research/prompts/TEMPLATE_PASS_B.txt`
- [ ] `lore-research/prompts/TEMPLATE_PASS_C.txt`

### ✅ Research Output JSONs (Referenced by Main Prompt)
- [ ] `lore-research/research-outputs/gate-1/gate-1-pass-a.json`
- [ ] `lore-research/research-outputs/gate-1/gate-1-pass-b.json`
- [ ] `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

## Verification Commands

```bash
# Verify all files exist
ls -la lore-research/prompts/Beam/COMPLETE_BEAM_PROMPT.md
ls -la lore-research/prompts/TEMPLATE_PASS_A.txt
ls -la lore-research/prompts/TEMPLATE_PASS_B.txt
ls -la lore-research/prompts/TEMPLATE_PASS_C.txt
ls -la lore-research/research-outputs/gate-1/gate-1-pass-a.json
ls -la lore-research/research-outputs/gate-1/gate-1-pass-b.json
ls -la lore-research/research-outputs/gate-1/gate-1-pass-c.json
```

## What to Do

1. **Copy** the COMPLETE_BEAM_PROMPT.md content
2. **Paste** into Big-AGI
3. **Click** the Beam button
4. **Select** all available AI models
5. **Wait** for responses (3-5 minutes)
6. **Analyze** using BEAM_RESPONSE_MATRIX.md

## Notes

- The main prompt already contains file references to the templates and JSONs
- Big-AGI's Beam function will automatically read those referenced files
- You don't need to manually paste the templates or JSONs
- Just paste the main prompt and click Beam!

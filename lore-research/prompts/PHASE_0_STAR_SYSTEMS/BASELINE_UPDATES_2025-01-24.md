# Phase 0 Baseline Prompts - Updates Applied 2025-01-24

## Summary

Applied 5 critical improvements to all 9 star system baseline prompts based on GPT-4o and GPT-5 feedback.

## Changes Applied to All Files:

### 0. ✅ Added Hard Guardrails Section (CRITICAL)
- Added "🔒 HARD RULES (NON-NEGOTIABLE)" section at top of each file
- Explicitly forbids: blogs, anonymous authors, social media, YouTube, wikis without citations
- 3-tier source hierarchy (Tier 1: Acceptable Primary, Tier 2: Acceptable Secondary, Tier 3: Unacceptable)
- Prevents AI from using low-quality sources
- Matches TEMPLATE_PASS_B standards

### 1. ✅ Labeled Example Quotes as Placeholders
- Added clear warnings: "⚠️ EXAMPLES ARE EXAMPLES ONLY - DO NOT COPY INTO OUTPUT"
- Prevents AI hallucination by making it clear examples are not real citations
- Changed example quotes to "(NOT PLACEHOLDER)" reminders

### 2. ✅ Added Translator/Editor Field
- New required field: `"translator_or_editor": "FULL NAME (translator/editor)"`
- Critical for ancient texts (e.g., Faulkner vs Budge for Egyptian texts)
- Allows verification of which translation was used
- Marked as "REQUIRED FOR ANCIENT TEXTS"

### 3. ✅ Added Astronomical Component Field (Sirius Only)
- Sirius-specific field: `"astronomical_component": "A|B|C|unspecified"`
- Critical for distinguishing Sirius A vs B vs C references
- Especially important for Dogon controversy (claims about Sirius B specifically)
- Not applicable to other star systems

### 4. ✅ Harmonized Source Count Requirements
- Changed from inconsistent "3+ sources (5+ preferred)" 
- To consistent: "5+ sources (minimum 3 if truly limited)"
- Applied across all quality checklists
- Clearer expectations for Comet

### 5. ✅ Added Guidance for Unverifiable Claims
- New instruction: "If a commonly believed claim cannot be verified, include it in `research_notes`"
- Example format provided: "Note: No credible evidence found for [claim], despite prevalence in New Age discourse."
- Helps handle popular but unsupported claims systematically

## Additional Improvements:

### Citation Requirements Section
- Expanded and standardized across all files
- Now includes 9 numbered requirements (was 5-8 depending on file)
- Emphasizes "NOT PLACEHOLDER" for quotes
- Clarifies translator/editor requirements

### Quality Checklist Enhancements
- Added "no placeholders" reminder
- Added "Ancient sources include translator/editor attribution"
- Added "Edition information and URLs included"
- More comprehensive validation criteria

## Files Updated:

1. ✅ SIRIUS_BASELINE.txt (updated 2025-01-24, includes astronomical_component field)
2. ✅ PLEIADES_BASELINE.txt
3. ✅ LYRA_BASELINE.txt
4. ✅ ANDROMEDA_BASELINE.txt
5. ✅ ARCTURUS_BASELINE.txt
6. ✅ DRACO_BASELINE.txt
7. ✅ ORION_DARK_BASELINE.txt
8. ✅ ORION_LIGHT_BASELINE.txt
9. ✅ ZETA_RETICULI_BASELINE.txt

## Impact:

These changes will:
- **Prevent hallucination** - Clear example labeling stops AI from copying fake quotes
- **Improve verification** - Translator attribution allows checking which translation was used
- **Enhance clarity** - Consistent source count requirements across all prompts
- **Better handling of gaps** - Systematic approach to unverifiable claims
- **Critical for Sirius** - Astronomical component field prevents A/B/C conflation

## Next Steps:

1. Run Phase 0 research through Comet with updated prompts
2. Validate that outputs include translator/editor fields for ancient texts
3. Verify no placeholder quotes appear in outputs
4. Check that unverifiable claims are properly noted in research_notes

## Notes:

- Astronomical component field is Sirius-specific (not added to other systems)
- All files maintain their unique characteristics (e.g., Draco's shadow/light polarity, Zeta's Hill map dispute)
- Changes are additive - no existing content was removed, only enhanced

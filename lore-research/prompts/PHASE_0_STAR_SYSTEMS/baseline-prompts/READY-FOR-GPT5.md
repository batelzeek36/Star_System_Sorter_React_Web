# Baseline Prompts - Ready for GPT-5 (Comet)

## Status: ✅ READY TO USE (Updated 2025-10-24)

All 8 baseline prompts in this directory have been updated with bulletproof source quality standards and explicit Wikipedia rejection in final validation sections. Ready for Comet/GPT-5 research runs.

## Files Ready

1. ✅ **ANDROMEDA_BASELINE.txt** - Ready
2. ✅ **ARCTURUS_BASELINE.txt** - Ready
3. ✅ **DRACO_BASELINE.txt** - Ready
4. ✅ **LYRA_BASELINE.txt** - Ready
5. ✅ **ORION_DARK_BASELINE.txt** - Ready
6. ✅ **ORION_LIGHT_BASELINE.txt** - Ready
7. ✅ **PLEIADES_BASELINE.txt** - Ready (Wikipedia fix applied)
8. ✅ **SIRIUS_BASELINE.txt** - Ready (includes Component A/B tracking)

## Key Features (All Prompts)

### Hard Rules Section
- ❌ Forbids blog sources, anonymous authors, social media
- ❌ Forbids Wikipedia and online encyclopedias
- ❌ Forbids placeholder quotes or "unknown" fields
- ✅ Requires published books with ISBNs
- ✅ Requires ancient texts with named translators
- ✅ Requires specific page numbers and verbatim quotes

### Source Quality Enforcement
- Every source must have `"verified": true` field
- All ancient texts require translator/editor attribution
- All quotes must be verbatim (≤25 words)
- All page numbers must be specific and verifiable
- URLs required when sources are available online

### Final Validation Checklist
Each prompt includes a mandatory pre-submission checklist that will cause rejection if:
- ❌ **CRITICAL:** Any source with "Wikipedia Contributors" as author
- ❌ **CRITICAL:** Any Wikipedia or online encyclopedia sources
- ❌ **CRITICAL:** Any "Various scholars" or anonymous authors
- Any placeholder quotes or "unknown" fields
- Any missing translator for ancient texts
- Any abbreviated titles or author names
- Any blog/social media sources

## Special Notes

### Pleiades
- **Fixed:** Wikipedia "Krittika" violation
- **Added:** Specific Mahabharata/Ramayana source requirements
- **Result:** V2 output successfully removed Wikipedia citations

### Sirius
- **Special:** Includes Component A/B astronomical tracking
- **Reason:** Sirius is a binary star system (discovered 1862)
- **Requirement:** All sources must specify which component they reference

### Orion Light
- **Special:** Explicitly forbids "ANY online encyclopedias" in final validation
- **Distinction:** Separates Orion Light (Osirian) from Orion Dark
- **Focus:** Mystery schools, Thoth/Hermes, sacred geometry

## Output Destinations

Place GPT-5 JSON responses in:
- **V1:** `lore-research/research-outputs/star-systems/v1/` (first run)
- **V2:** `lore-research/research-outputs/star-systems/v2/` (corrected runs)

## Validation

After receiving GPT-5 output, check for:
1. ❌ No "Wikipedia Contributors" as author
2. ❌ No encyclopedia or aggregator sites
3. ✅ All ancient texts have translator attribution
4. ✅ All sources have specific page numbers
5. ✅ All quotes are verbatim (not paraphrases)
6. ✅ All sources have `"verified": true`

## Template

The `_BULLETPROOF_TEMPLATE.txt` file contains the base structure used for all prompts. Do not send this to GPT-5 - it's for reference only.

---

**Last Updated:** 2025-01-24
**Status:** Production-ready for GPT-5 research runs


---

## Update Log

**2025-10-24:** Added explicit Wikipedia rejection to all baseline prompts
- Added to final validation: "❌ **CRITICAL:** Any source with 'Wikipedia Contributors' as author"
- Added to final validation: "❌ **CRITICAL:** Any Wikipedia or online encyclopedia sources"
- Added to final validation: "❌ **CRITICAL:** Any 'Various scholars' or anonymous authors"
- Updated PASS CRITERIA to include: "✅ Zero Wikipedia or encyclopedia sources"
- Updated PASS CRITERIA to include: "✅ Zero anonymous authors or 'Various scholars'"

**Reason:** Comet was including Wikipedia sources despite general prohibition in HARD RULES section. Explicit rejection in FINAL VALIDATION section ensures compliance.

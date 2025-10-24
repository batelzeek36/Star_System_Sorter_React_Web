# Baseline Prompts Audit - What Needs Fixing

## Status Summary

| Star System | Status | Output Quality | Prompt Issues |
|-------------|--------|----------------|---------------|
| **Sirius** | ✅ Complete | Good (no violations) | None - working prompt |
| **Pleiades** | ✅ Complete | Good (no violations) | None - working prompt |
| **Orion Light** | ✅ Complete | Good (8/10) | Fixed in V3 |
| **Andromeda** | ❌ Not run | Unknown | Needs V3 fixes |
| **Arcturus** | ❌ Not run | Unknown | Needs V3 fixes |
| **Draco** | ❌ Not run | Unknown | Needs V3 fixes |
| **Lyra** | ❌ Not run | Unknown | Needs V3 fixes |
| **Orion Dark** | ❌ Not run | Unknown | Needs V3 fixes |

## What Worked (Sirius & Pleiades)

Both successful prompts have:
1. ✅ Wikipedia warning (though ambiguous wording)
2. ✅ Explicit mention of archive.org and sacred-texts.com
3. ✅ "Where to find sources" section
4. ✅ No "INFERENCE AND SYNTHESIS" or "STOP OVERTHINKING" sections
5. ✅ Strict, direct tone throughout

## What Failed (Orion Light V1 & V2)

Orion Light attempts 1-2 had:
1. ❌ Ambiguous Wikipedia wording ("NOT ACCEPTABLE as primary sources")
2. ❌ No explicit Britannica.com ban
3. ❌ V2 added "INFERENCE AND SYNTHESIS" (backfired - AI lowered standards)
4. ❌ V2 added "STOP OVERTHINKING" (backfired - AI got lazy)

## What Fixed It (Orion Light V3)

V3 changes:
1. ✅ Changed "NOT ACCEPTABLE as primary sources" → "COMPLETELY FORBIDDEN"
2. ✅ Explicit Britannica.com ban with domain list
3. ✅ Removed "INFERENCE AND SYNTHESIS" section
4. ✅ Removed "STOP OVERTHINKING" section
5. ✅ Added "WHERE TO FIND VERIFIED SOURCES" with specific locations
6. ✅ Added "EVIDENCE TYPE vs SOURCE QUALITY" (clear distinction)
7. ✅ Maintained strict, direct tone

## Remaining Prompts Need

All remaining prompts (Andromeda, Arcturus, Draco, Lyra, Orion Dark) need:

### Critical Fixes:
1. **Strengthen Wikipedia warning** - Change from "NOT ACCEPTABLE as primary sources" to "COMPLETELY FORBIDDEN"
2. **Add explicit Britannica ban** - List forbidden domains (britannica.com, encyclopedia.com, etc.)
3. **Add "WHERE TO FIND VERIFIED SOURCES"** section with:
   - Archive.org search terms
   - Sacred-texts.com links
   - Forbidden domain list

### Optional Improvements:
4. **Add "EVIDENCE TYPE vs SOURCE QUALITY"** section (if synthesis is needed)
5. **Add URL domain check** in final validation

## Recommended Approach

**Option A: Minimal Fix (Safest)**
- Just strengthen the Wikipedia warning
- Add explicit Britannica/encyclopedia ban
- Add "WHERE TO FIND VERIFIED SOURCES" section
- Keep everything else the same

**Option B: Full V3 Treatment**
- Apply all Orion Light V3 changes
- More comprehensive but more editing

**Recommendation:** Start with Option A for the next prompt. If it works, apply to all remaining prompts. If it fails, escalate to Option B.

## Key Lesson

**The tone matters more than the length.**

- Sirius (460 lines) worked because it was strict and direct
- Orion Light V2 (461 lines) failed because it was encouraging and flexible
- Orion Light V3 (461 lines) worked because it returned to strict and direct

**Encouraging language backfires.** The AI interprets "be flexible about evidence type" as "be flexible about source quality."

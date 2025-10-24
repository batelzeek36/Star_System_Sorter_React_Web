# Orion Light Prompt Fix V3 - Clarity Over Encouragement

## Problem Diagnosis

**Attempt #1:** 1 violation (Encyclopedia.com) - otherwise solid
**Attempt #2:** 7+ violations (Britannica, WordPress, Tripod, Goodreads, etc.) - much worse

**Root cause:** We added "encouraging" language that the AI misinterpreted as permission to lower source quality standards.

## What We Removed (V3)

### 1. "INFERENCE AND SYNTHESIS ARE REQUIRED" Section
**Why it backfired:**
- Meant to say: "Evidence type can be inferred"
- AI heard: "Be flexible about everything"
- Result: Used encyclopedias and blogs

### 2. "STOP OVERTHINKING - YOU HAVE EVERYTHING YOU NEED"
**Why it backfired:**
- Meant to say: "Don't refuse the task"
- AI heard: "Just grab whatever you find and submit it"
- Result: Lazy source-grabbing from search results

### 3. "CONCRETE EXAMPLE" Section
**Why it was confusing:**
- Showed acceptable synthesis approach
- But might have implied "the example matters more than the rules"
- Removed to reduce noise

## What We Added (V3)

### 1. "EVIDENCE TYPE vs SOURCE QUALITY" (Clearer Distinction)

**Before (V2):**
```
## CRITICAL: INFERENCE AND SYNTHESIS ARE REQUIRED
You MUST understand the difference between...
```

**After (V3):**
```
## EVIDENCE TYPE vs SOURCE QUALITY
CRITICAL DISTINCTION - These are NOT the same thing:

SOURCE QUALITY = ABSOLUTELY RIGID (NO EXCEPTIONS)
EVIDENCE TYPE = FLEXIBLE (Document what you find)
```

**Key change:** Removed encouraging tone, added explicit "ABSOLUTELY RIGID" language

### 2. "WHERE TO FIND VERIFIED SOURCES" (Specific Locations)

**Replaced:** "STOP OVERTHINKING" encouragement

**With:** Concrete list of where to find sources:
- Archive.org search terms
- Sacred-texts.com direct links
- Specific forbidden domains

**Why this works better:**
- Actionable instructions instead of motivation
- Shows exactly where to look
- Lists forbidden domains explicitly

### 3. Streamlined "Light vs Dark" Section

**Before:** Long explanation about synthesis being acceptable

**After:** Short, direct:
```
ALL SOURCES MUST STILL MEET QUALITY STANDARDS:
- ✅ Use Faulkner/Allen from archive.org (NOT wordpress)
- ✅ Use Hermetic Corpus from sacred-texts.com (NOT encyclopedias)
```

## Key Insight

**The Sirius prompt worked because it was strict and direct, not encouraging.**

**Tone comparison:**

| Sirius (Works) | Orion V2 (Failed) | Orion V3 (Fixed) |
|----------------|-------------------|------------------|
| "ABSOLUTELY FORBIDDEN" | "Don't overthink it!" | "ABSOLUTELY RIGID" |
| "Use authoritative sources" | "Inference is fine!" | "SOURCE QUALITY = NON-NEGOTIABLE" |
| "Find the primary source" | "You have everything!" | "Use archive.org first" |

## What V3 Accomplishes

1. **Removes mixed messaging** - No more "be flexible" language that could apply to source quality
2. **Separates concerns clearly** - Evidence type ≠ Source quality
3. **Provides specific locations** - Archive.org, sacred-texts.com (not just "find good sources")
4. **Maintains strictness** - "ABSOLUTELY RIGID", "NON-NEGOTIABLE"
5. **Reduces noise** - Removed example section that might distract from rules

## Expected Outcome

With V3, the AI should:
- ✅ Use archive.org for Pyramid Texts, Book of the Dead
- ✅ Use sacred-texts.com for Hermetic Corpus, Kybalion, Manly P. Hall
- ✅ Avoid ALL encyclopedias (Britannica, Encyclopedia.com, Wikipedia)
- ✅ Avoid ALL blogs (WordPress, Tripod, personal sites)
- ✅ Mark evidence_type as direct/inferred/symbolic (this is still flexible)
- ✅ Synthesize characteristics from multiple verified sources

## Lesson Learned

**When prompting for rigorous research:**
- ❌ Don't use encouraging language ("Don't overthink!", "You can do this!")
- ❌ Don't explain why rules exist (just state them)
- ✅ Be direct and strict ("ABSOLUTELY RIGID", "NON-NEGOTIABLE")
- ✅ Provide specific locations (archive.org, sacred-texts.com)
- ✅ Separate flexible aspects (evidence type) from rigid aspects (source quality)

**Encouragement can backfire.** The AI interpreted "be flexible about evidence type" as "be flexible about source quality." V3 makes the distinction crystal clear.

# Corrections Needed - Gate 1 Outputs

**Date:** January 23, 2025

Based on 8-model web-enabled validation.

---

## Pass A Corrections

### Citations to Fix

**NONE** - Pass A citations are solid

### Citations to Verify Manually

1. **Ra Uru Hu quote** - Verify exact wording or mark as condensed summary (7/8 verified, likely accurate)
2. **Gene Keys quote** - Verify exact wording or mark as poetic paraphrase (4/8 verified, style matches)

---

## Pass B Corrections

### Citations to Fix

1. **Hopi Creation Story** (CRITICAL)
   - **Current:** karlcross.wordpress.com (blog)
   - **Fix:** Frank Waters, "Book of the Hopi" (1963) with page number
   - **Alternative:** Academic anthropological source (Courlander, Malotki)
   - **Consensus:** 8/8 models flagged this

### Citations to Verify Manually

1. **Rig Veda quote** - Minor paraphrase noted by 1 model (Wilhelm translation differs slightly)
2. **Orphic Hymns** - Verify exact line in Taylor translation (6/8 verified, likely accurate)

---

## Pass C Corrections

### Citations to Fix

1. **Marciniak "Emit your own frequency"** (CRITICAL)

   - **Current:** Bringers of the Dawn (1992)
   - **Fix:** Family of Light (1998), p. 71
   - **Consensus:** 8/8 models caught this error

2. **Royal/Priest Lyra quote** (CRITICAL)

   - **Current:** Direct quote, p. 88
   - **Fix:** Mark as paraphrase OR find exact quote
   - **Issue:** Only 2/8 models verified exact wording

3. **Andromeda sources** (HIGH PRIORITY)
   - **Current:** "Various contemporary researchers (2025)" from blogs
   - **Fix:** Find published books OR downgrade confidence to LOW
   - **Consensus:** 8/8 models flagged weak sourcing

### Citations to Verify Manually

1. **Bailey page numbers** - Verify pp. 17-18 and p. 98 against actual PDF (4-5/8 verified)
2. **Marciniak "Create new pathways"** - Find exact quote or mark as thematic summary (1/8 verified)
3. **Temple quote** - Verified but disputed; ensure "disputed" flag is prominent

---

## Priority Levels

### CRITICAL (Must fix before any production use)

1. **Marciniak book attribution** - Wrong book is a factual error (8/8 models)
2. **Hopi blog source** - Replace with anthropological source (8/8 models)
3. **Royal/Priest paraphrase** - Mark as paraphrase or find exact quote (6/8 models)

### HIGH (Should fix before launch)

1. **Lyra confidence level** - Downgrade HIGH → MEDIUM (7/8 models)
2. **Andromeda confidence level** - Downgrade MEDIUM → LOW (8/8 models)
3. **Andromeda sources** - Replace blogs with published books (8/8 models)
4. **Sirius/Dogon integration** - Separate credible from disputed (7/8 models)
5. **Weight recalibration** - Lyra 5→3, Sirius 3→4 (6/8 models)
6. **Evidence type relabeling** - Lyra "explicit" → "channeled/mythological" (6/8 models)

### MEDIUM (Can fix during iteration)

1. **Bailey page verification** - Verify against actual PDF
2. **Marciniak second quote** - Find exact wording or mark as thematic
3. **Ra Uru Hu quote** - Verify exact wording or mark as condensed
4. **Gene Keys quote** - Verify exact wording or mark as paraphrase

### LOW (Nice to have)

1. Add academic archetypal psychology sources (Jung, Campbell)
2. Add skeptical perspective notes
3. Create epistemological framework glossary
4. Add disclaimer language for channeled sources

---

## Estimated Work

- **Critical fixes:** 1-2 hours
  - Marciniak attribution: 15 min
  - Hopi source replacement: 30 min
  - Royal/Priest paraphrase marking: 15 min
- **High priority fixes:** 2-3 hours
  - Confidence level adjustments: 30 min
  - Andromeda source upgrade: 60 min
  - Sirius section restructure: 45 min
  - Weight recalibration: 15 min
  - Evidence type relabeling: 30 min
- **Medium priority fixes:** 1-2 hours

  - Quote verifications: 60-90 min
  - Page number checks: 30 min

- **Total:** 4-7 hours

---

## Timeline

If corrections are needed:

- **Critical fixes:** 0.5 days (immediate)
- **High priority fixes:** 1 day
- **Medium priority fixes:** 0.5 days (optional)
- **Re-validation:** 0.5 days (spot-check)
- **Total:** 2-3 days to production-ready

**Recommendation:** Fix critical + high priority items (3-5 hours), launch, iterate on medium priority post-launch.

---

## Detailed Correction Instructions

### 1. Marciniak Book Attribution (CRITICAL)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "quote": "Everything changes when you start to emit your own frequency rather than absorbing frequencies around you",
  "source": "Bringers of the Dawn: Teachings from the Pleiadians",
  "author": "Barbara Marciniak",
  "year": 1992
}
```

**Fix to:**

```json
{
  "quote": "Everything changes when you start to emit your own frequency rather than absorbing frequencies around you",
  "source": "Family of Light: Pleiadian Tales and Lessons in Living",
  "author": "Barbara Marciniak",
  "year": 1998,
  "page": "p. 71"
}
```

---

### 2. Hopi Source Replacement (CRITICAL)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-b.json`

**Current:**

```json
{
  "quote": "Taiowa created Sotuknang to make manifest his will and carry out his plan",
  "source": "Hopi Creation Story",
  "author": "Unknown (oral tradition)",
  "year": 1900,
  "url": "https://karlcross.wordpress.com/..."
}
```

**Fix to:**

```json
{
  "quote": "Taiowa created Sotuknang to make manifest his will and carry out his plan",
  "source": "Book of the Hopi",
  "author": "Frank Waters",
  "year": 1963,
  "publisher": "Penguin Books",
  "page": "p. 3-4",
  "note": "Recorded from Hopi oral tradition"
}
```

---

### 3. Royal/Priest Paraphrase (CRITICAL)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "quote": "Lyra: Birthplace of humanoid races with all galactic family connections tied to it",
  "source": "The Prism of Lyra: An Exploration of Human Galactic Heritage",
  "page": "p. 88"
}
```

**Fix to:**

```json
{
  "quote": "Lyra: Birthplace of humanoid races with all galactic family connections tied to it",
  "source": "The Prism of Lyra: An Exploration of Human Galactic Heritage",
  "page": "Chapter 3 (paraphrased)",
  "note": "Condensed summary of core thesis; exact wording may vary"
}
```

---

### 4. Lyra Confidence Downgrade (HIGH)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "system": "Lyra",
  "confidence": "HIGH",
  "evidence_type": "explicit"
}
```

**Fix to:**

```json
{
  "system": "Lyra",
  "confidence": "MEDIUM",
  "evidence_type": "channeled/mythological",
  "note": "Explicit in channeled source (Royal/Priest 1989), not externally verified"
}
```

---

### 5. Andromeda Confidence & Sources (HIGH)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "system": "Andromeda",
  "confidence": "MEDIUM",
  "sources": [
    {
      "title": "Starseed Origins and Missions",
      "author": "Various contemporary researchers",
      "year": 2025
    }
  ]
}
```

**Fix to:**

```json
{
  "system": "Andromeda",
  "confidence": "LOW",
  "evidence_type": "contemporary spiritual interpretation",
  "sources": [
    {
      "title": "Defending Sacred Ground",
      "author": "Alex Collier",
      "year": 1996,
      "note": "Channeled material; controversial source"
    }
  ],
  "note": "Based on modern starseed community interpretations; minimal historical substrate"
}
```

---

### 6. Sirius Section Restructure (HIGH)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "system": "Sirius",
  "ancient_support": [
    "Egyptian mystery schools identified Sirius with Isis",
    "Dogon tribe preserved knowledge of Sirius B"
  ]
}
```

**Fix to:**

```json
{
  "system": "Sirius",
  "ancient_support": [
    {
      "claim": "Egyptian mystery schools identified Sirius (Sopdet/Sothis) with Isis",
      "status": "CREDIBLE",
      "note": "Well-documented historical association"
    },
    {
      "claim": "Dogon tribe preserved knowledge of Sirius B",
      "status": "DISPUTED",
      "dispute": "Van Beek (1991) fieldwork found no evidence of pre-colonial Sirius B knowledge; suggests knowledge came from 1930s ethnographers",
      "note": "Temple's interpretation remains controversial"
    }
  ]
}
```

---

### 7. Weight Recalibration (HIGH)

**File:** `lore-research/research-outputs/gate-1/gate-1-pass-c.json`

**Current:**

```json
{
  "weights_hint": {
    "Lyra": 5,
    "Andromeda": 4,
    "Pleiades": 3,
    "Sirius": 3
  }
}
```

**Fix to:**

```json
{
  "weights_hint": {
    "Sirius": 4,
    "Lyra": 3,
    "Pleiades": 3,
    "Andromeda": 2
  },
  "note": "Weights reflect evidence quality: Sirius has historical + esoteric support; Lyra/Pleiades have established channeled sources; Andromeda has contemporary interpretation only"
}
```

---

## Verification Checklist

Before marking as complete, verify:

- [ ] Marciniak quote changed to Family of Light (1998)
- [ ] Hopi source changed to Frank Waters (1963)
- [ ] Royal/Priest marked as paraphrase
- [ ] Lyra confidence downgraded to MEDIUM
- [ ] Lyra evidence type changed to "channeled/mythological"
- [ ] Andromeda confidence downgraded to LOW
- [ ] Andromeda sources upgraded from blogs to books
- [ ] Sirius ancient support restructured with dispute integration
- [ ] Weights recalibrated (Sirius 4, Lyra 3, Pleiades 3, Andromeda 2)
- [ ] All JSON files validate correctly
- [ ] Spot-check 2-3 citations manually

---

## Post-Fix Validation

After corrections, the output should achieve:

- **Citation verification rate:** 85%+ (up from 74%)
- **Confidence alignment:** Epistemologically sound
- **Source quality:** No blog sources for primary evidence
- **Production readiness:** YES (with disclaimers)

**Expected outcome:** Gate 1 outputs will be defensible for "insight & entertainment" use with proper disclaimers about channeled/esoteric sources.

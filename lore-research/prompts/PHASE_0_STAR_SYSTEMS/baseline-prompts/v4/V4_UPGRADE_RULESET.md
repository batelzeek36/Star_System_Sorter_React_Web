# V4 BASELINE PROMPT UPGRADE RULESET

This document provides the exact steps to upgrade any v2/v3 baseline prompt to v4 standards.

**Reference Templates:**
- `SIRIUS_BASELINE_V4.txt` - Complete v4 with astronomical components
- `PLEIADES_BASELINE_V4.txt` - Complete v4 with cross-cultural patterns
- `ORION_LIGHT_BASELINE_V4.txt` - Complete v4 with faction handling (Light/positive)
- `ORION_DARK_BASELINE_V4.txt` - Complete v4 with faction handling (Dark/shadow) + nuance flags

**Universal Fixes Document:** `v4_universal_fixes.txt`

---

## STEP 1: UPDATE HEADER SECTION

### Add V4 Context Block

Replace old context with:

```
# [STAR SYSTEM NAME] BASELINE RESEARCH (V4)

## CONTEXT
You are conducting Phase 0 baseline research for the Star System Sorter project. This research establishes the foundational characteristics of [STAR SYSTEM] that will later be used to map Human Design gates to star systems. Academic rigor and proper citations are CRITICAL.

**V4 PHILOSOPHY:** This version uses honest field naming to distinguish provisional research (location hints + summaries) from locked citations (exact pages + verbatim quotes). You provide the research scaffold, the human locks it down later.

**V4 IMPROVEMENTS:**
1. Relaxed trait coverage rule for low-consensus characteristics
2. Optimized handling of fully accessible online sources (sacred-texts.com, archive.org)
3. Clarified translator full name expectations
```

---

## STEP 2: KEEP HARD RULES SECTION (NO CHANGES)

The `🔒 HARD RULES (NON-NEGOTIABLE)` section is universal. Keep as-is from any v4 template.

**DO NOT modify:**
- Source hierarchy (Tier 1/2/3)
- Forbidden sources list
- Acceptable sources list

---

## STEP 3: ADD PROVISIONAL vs LOCKED CITATION POLICY

Insert the complete `🔥 V4 CITATION POLICY: PROVISIONAL vs LOCKED` section from any v4 template.

**Key requirements:**
- Define PROVISIONAL: `location_hint` + `summary` + `citation_status: "provisional"`
- Define LOCKED: `page` + `quote` + `citation_status: "locked"`
- Include examples for both types
- Add "What You MAY Do" and "What You MAY NOT Do" sections
- Add "Field Usage Rules"
- **CRITICAL:** Include the rule: "If a source is fully available at sacred-texts.com, archive.org, or [relevant site] with complete searchable text, you MUST treat it as `citation_status: "locked"`"

**Star-specific customization:**
- Update example sources to match the star system
- Update URLs to relevant archives (e.g., lawofone.info for Orion, poetryintranslation.com for Greek myths)

---

## STEP 4: UPDATE OBJECTIVE SECTION

Keep the star-specific objective but add v4 academic context:

```
## OBJECTIVE
Research and document the characteristics attributed to [STAR SYSTEM] across [relevant source categories]. Return findings as minified JSON with complete citations.

## ACADEMIC CONTEXT

This research supports Star System Sorter, which maps Human Design's I Ching-based gate system to star mythology.

**Human Design's Academic Foundations:**
- **I Ching (64 hexagrams)** - 3,000+ years of scholarship, Jung's endorsement (Wilhelm translation, 1950)
- **64 DNA codons** - Nobel Prize research (Nirenberg & Khorana, 1968)
- **Kabbalah (Tree of Life)** - Extensive academic study (Scholem, Idel)
- **Chakra system** - Religious Studies, Yoga Studies (Feuerstein)
- **Western Astrology** - Cultural/historical phenomenon (Tarnas)

**Mathematical Correspondences:**
- 64 I Ching hexagrams = 64 DNA codons (verifiable fact)
- Binary yin/yang logic = Binary genetic code (A/T, C/G)

**Your Task:** Document [star system] characteristics using rigorous sourcing standards (ancient texts, published books, proper citations). This is **comparative mythology research**, not pseudoscience.

**CRITICAL:** If you cannot find an ISBN for a pre-1967 or pre-ISBN edition, set `"isbn": null` and STILL RETURN THE SOURCE. Do not omit the source.
```

---

## STEP 5: UPDATE HYPOTHESIS TO VALIDATE

Keep star-specific hypotheses but ensure they're framed as testable claims.

**Format:**
```
## HYPOTHESIS TO VALIDATE
Based on preliminary research, [STAR SYSTEM] is associated with:
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]
- [etc.]

Your task is to find evidence that confirms, refutes, or nuances these characteristics.
```

---

## STEP 6: UPDATE PRIMARY SOURCES SECTION

Keep star-specific sources but add priority indicators and accessibility notes:

**Format:**
```
## PRIMARY SOURCES TO RESEARCH

### [Category 1] (HIGH PRIORITY - Often fully accessible)
- **[Source 1]**: [Details] ([Translator] translation on [archive site])
- **[Source 2]**: [Details]

### [Category 2]
- [Sources with ISBNs and years]

### [Category 3]
- [Sources]
```

**Add accessibility notes:**
- "(archive.org)" for public domain books
- "(sacred-texts.com)" for ancient texts
- "(lawofone.info)" for Law of One
- "(poetryintranslation.com)" for classical texts

---

## STEP 7: UPDATE CITATION REQUIREMENTS

Replace old citation requirements with v4 version:

```
## CITATION REQUIREMENTS

Every source MUST include:

**ALWAYS REQUIRED (both provisional and locked):**
1. **Full title** (exact, not abbreviated)
2. **Author name(s)** (full names preferred; initials acceptable if that's how the translator is commonly cited in academic literature)
3. **Translator/Editor** (for ancient texts - MUST include translator name with "(translator)" designation. Example: "R. O. Faulkner (translator)")
4. **Edition information** (e.g., "First Edition", "Oxford University Press Edition")
5. **Publication year** (original and edition if different)
6. **Publisher/imprint** (e.g., "Oxford University Press", "Bear & Company")
7. **URL** (if available online - archive.org, publisher, academic database)
8. **ISBN or DOI** (required for verification. If neither exists for pre-1967 publications or ancient translations, use `"isbn": null` and ensure publisher is specified)
9. **Source type** (ancient|research|channeled|indigenous|controversial)
10. **Citation status** (provisional|locked)

**FOR PROVISIONAL citations:**
11. **location_hint** - Chapter, section, verse/line reference
12. **summary** - ≤25 word paraphrase of what source says

**FOR LOCKED citations:**
11. **page** - Exact locator in the cited edition. This MAY be a physical page number OR an internal canonical unit (e.g., "Book III, lines 110-114", "Utterance 632", "Session 14.18"). Canonical units are acceptable as LOCKED citations.
12. **quote** - Verbatim text ≤25 words from source
```

---

## STEP 8: UPDATE CONSENSUS LEVELS

Replace old consensus rules with v4 relaxed version:

```
## CONSENSUS LEVELS

Assign based on evidence quality:

- **HIGH**: 3+ independent sources, cross-cultural validation, minimal disputes
- **MEDIUM**: 2-3 sources, or strong in one category only
- **LOW**: 1-2 sources, heavily disputed, or channeled-only

**V4 NOTE:** For low-consensus or single-source-type characteristics (e.g., channeled-only), 2 sources minimum is acceptable. The 3-5 sources target applies primarily to high and medium consensus traits.
```

---

## STEP 9: UPDATE OUTPUT FORMAT

### Add Version and Methodology Fields

```json
{
  "star_system": "[STAR SYSTEM NAME]",
  "version": "4.0",
  "last_updated": "2025-10-25",
  
  "methodology": {
    "framework": "Comparative mythology + I Ching-based Human Design system",
    "academic_foundations": [
      "I Ching (64 hexagrams → 64 Human Design gates)",
      "[Star-specific foundation 1]",
      "[Star-specific foundation 2]"
    ],
    "source_standards": "Ancient texts with named translators, published books with ISBNs, evidence typing (direct/inferred/symbolic), consensus levels documented. V4: Uses provisional (location_hint + summary) vs locked (page + quote) citation status. Optimized for fully accessible online sources. Relaxed trait coverage for low-consensus characteristics.",
    "research_date": "2025-10-25"
  },
  
  "academic_context": {
    "human_design_foundations": [
      "I Ching - 3,000+ years of scholarship (Wilhelm, Legge, Jung)",
      "64 DNA codons - Nobel Prize research (Nirenberg, Khorana 1968)",
      "Kabbalah - Extensive academic study (Scholem, Idel)",
      "Chakra system - Religious Studies, Yoga Studies",
      "Western Astrology - Cultural/historical phenomenon (Tarnas)"
    ],
    "mathematical_correspondences": [
      "64 I Ching hexagrams = 64 DNA codons",
      "Binary yin/yang logic = Binary genetic code (A/T, C/G)"
    ]
  }
}
```

### Update Source Object Templates

**PROVISIONAL template:**
```json
{
  "title": "FULL TITLE",
  "author": "FULL NAME",
  "translator_or_editor": "FULL NAME (translator) - REQUIRED FOR ANCIENT TEXTS",
  "edition": "SPECIFIC EDITION",
  "year": 1992,
  "original_year": 1992,
  "publisher": "PUBLISHER NAME",
  "location_hint": "Chapter 3, Section 225, Utterance 466, etc.",
  "summary": "≤25 word paraphrase of what source says about trait",
  "url": "WORKING URL IF AVAILABLE",
  "isbn": "ISBN NUMBER or null if pre-1967",
  "source_type": "ancient|research|channeled|indigenous|controversial",
  "citation_status": "provisional"
}
```

**LOCKED template:**
```json
{
  "title": "FULL TITLE FOR LOCKED SOURCE",
  "author": "FULL NAME",
  "translator_or_editor": "IF APPLICABLE",
  "edition": "SPECIFIC EDITION",
  "year": 2004,
  "publisher": "PUBLISHER NAME",
  "page": "Chapter 2, p. 34 (or canonical unit like Utterance 466, §882)",
  "quote": "Verbatim text ≤25 words from source",
  "url": "URL",
  "isbn": "ISBN or null if pre-1967",
  "source_type": "indigenous",
  "citation_status": "locked"
}
```

### Update disputed_points Template

**CRITICAL:** Use PROVISIONAL citations only to avoid fabricated quotes:

```json
"disputed_points": [
  {
    "claim": "[Disputed claim description]",
    "supporting_sources": [
      {
        "title": "FULL TITLE",
        "author": "FULL NAME",
        "year": 1994,
        "publisher": "PUBLISHER NAME",
        "location_hint": "Chapter X, pp. XX-XX",
        "summary": "Brief summary of supporting argument",
        "url": "URL",
        "isbn": "ISBN",
        "source_type": "research",
        "citation_status": "provisional"
      }
    ],
    "counter_evidence": [
      {
        "title": "Counter-argument source",
        "author": "FULL NAME",
        "year": 2000,
        "publisher": "PUBLISHER NAME",
        "location_hint": "SPECIFIC CHAPTER/SECTION where claim is challenged",
        "summary": "Brief summary of counter-argument",
        "url": "URL",
        "isbn": "ISBN OR null",
        "source_type": "research",
        "citation_status": "provisional"
      }
    ],
    "consensus": "high|medium|low - Brief explanation"
  }
]
```

---

## STEP 10: UPDATE QUALITY CHECKLIST

Replace old checklist with v4 version:

```
## QUALITY CHECKLIST

Before submitting, verify:

✅ Each characteristic has 3-5 sources (target); 2 sources minimum acceptable for low-consensus traits
✅ All sources have ISBN or DOI (or null with publisher specified)
✅ All sources have either (location_hint + summary) OR (page + quote)
✅ All sources have `citation_status: "provisional"` or `citation_status: "locked"`
✅ Ancient sources include translator/editor attribution
✅ URLs included where available
✅ Source types are labeled
✅ Consensus levels are justified
✅ Ancient support levels are noted
✅ [Star-specific pattern] documented with sources
✅ Mix of [relevant source categories]
✅ **NO `verified: true` field** (added during manual verification)
```

---

## STEP 11: ADD/UPDATE MANDATORY CHARACTERISTICS SECTION

Every star system needs 3 mandatory characteristics. Format:

```
═══════════════════════════════════════════════════════════════════════════════
🔒 MANDATORY [STAR SYSTEM]-SPECIFIC CHARACTERISTICS (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════════════════════

**You MUST include these characteristics as separate traits. Do NOT fold them into other characteristics.**

### MANDATORY #1: [Primary Characteristic]

**You MUST include a characteristic documenting [description].**

[Explanation of why this is core to the star system]

**Required sources:**
- [Source 1 with details]
- [Source 2 with details]
- [Source 3 with details]
- At least one additional [category] source

**Trait name examples:**
- "[Example trait name 1]"
- "[Example trait name 2]"
- "[Example trait name 3]"

**This MUST be its own trait with [validation type] documented.**

### MANDATORY #2: [Secondary Characteristic]

[Repeat format]

### MANDATORY #3: [Tertiary Characteristic]

[Repeat format]

═══════════════════════════════════════════════════════════════════════════════
```

**How to choose mandatory characteristics:**
1. **Primary**: Strongest ancient/cross-cultural pattern
2. **Secondary**: Core modern esoteric archetype
3. **Tertiary**: Unique distinguishing feature

---

## STEP 12: UPDATE FINAL REMINDER SECTION

```
## FINAL REMINDER

**DO NOT give up and return empty results.** Ancient sources for [STAR SYSTEM] are widely available online.

**If you cannot fully satisfy a field under LOCKED mode, fall back to PROVISIONAL mode instead of omitting the source.** If you cannot produce `page` + `quote` for a relevant source, you MUST still include that source as `citation_status: "provisional"` with `location_hint` + `summary`. Do NOT omit the source.

**Prioritize LOCKED citations from:**
- [Archive site 1] ([specific sources])
- [Archive site 2] ([specific sources])
- [Archive site 3] ([specific sources])

**Use PROVISIONAL citations for:**
- [Category 1] (likely behind paywall)
- [Category 2] (recent publications)
- [Category 3] (limited access)

**Remember:** Canonical units like [examples] count as LOCKED citations. You don't need physical page numbers for ancient texts if you have the canonical reference.

**Minimum acceptable response: 5-7 characteristics (including 3 mandatory), each with 2-5 fully cited sources (mix of provisional and locked), with [star-specific pattern] documented, and citation status marked.**
```

---

## STEP 13: UPDATE FINAL VALIDATION SECTION

```
═══════════════════════════════════════════════════════════════════════════════
🔒 FINAL VALIDATION BEFORE SUBMISSION
═══════════════════════════════════════════════════════════════════════════════

**MANDATORY CHECK - Your response will be REJECTED if:**

❌ Missing "[Mandatory characteristic 1]" characteristic
❌ Missing "[Mandatory characteristic 2]" characteristic
❌ Missing "[Mandatory characteristic 3]" characteristic
❌ Any source missing `citation_status` field
❌ Any source with `citation_status: locked` but no verbatim `quote`
❌ Any source with `citation_status: provisional` but no `summary`
❌ Any source with both `quote` and `summary` fields (pick one based on status)
❌ Any source with "Wikipedia Contributors" as author
❌ Any Wikipedia or online encyclopedia sources
❌ Any "Various scholars" or anonymous authors
❌ Any blog sources or personal websites
❌ Any missing edition information
❌ Any social media posts or YouTube videos
❌ Any source with `verified: true` field (DO NOT include this)
❌ Missing [star-specific required field]

**PASS CRITERIA:**
✅ All 3 mandatory characteristics included as separate traits
✅ Every source has `citation_status: "provisional"` OR `citation_status: "locked"`
✅ Every source has `publisher` field
✅ Provisional sources have `location_hint` + `summary`
✅ Locked sources have `page` + `quote`
✅ All sources have ISBN/DOI OR `"isbn": null` with publisher specified
✅ All translator names include proper attribution
✅ Canonical units ([examples]) are acceptable as LOCKED citations
✅ All sources have complete bibliographic information
✅ [Star-specific pattern] documented
✅ Zero Wikipedia or encyclopedia sources
✅ Zero anonymous authors
✅ NO `verified: true` field anywhere

**V4 allows provisional citations, but you must still find legitimate sources and mark them honestly.**
```

---

## SPECIAL CASE: FACTION-BASED STAR SYSTEMS

Some star systems have internal factions that require separate baseline prompts (e.g., Orion Light vs Orion Dark).

### When to Use Faction Handling

**Use separate faction prompts when:**
- Modern esoteric sources explicitly distinguish positive/negative polarities
- The factions have fundamentally different characteristics
- Ancient sources may not distinguish factions (document this)

**Examples:**
- Orion Light (Osirian): Mystery schools, wisdom, sacred geometry
- Orion Dark: Control structures, shadow work, service-to-self polarity

### Faction-Specific Requirements

**1. Add Faction Field at Characteristic Level**
```json
{
  "trait": "Control and hierarchical power structures",
  "consensus_level": "medium",
  "ancient_support": "unknown",
  "evidence_type": "direct",
  "disputed": false,
  "faction": "dark",  // or "light"
  "sources": [...]
}
```

**2. Add Source Contamination Filter**
In the OBJECTIVE section, add explicit filter to prevent mixing factions:
```
**CRITICAL SOURCE FILTER:** If a source is describing [STAR SYSTEM] in [opposite faction terms], that belongs to [OPPOSITE FACTION] and MUST NOT be cited as evidence for [THIS FACTION]. Do not mix [faction A] and [faction B] material.
```

Example for Orion Dark:
```
**CRITICAL SOURCE FILTER:** If a source is describing Orion in benevolent/teacher/mystery-school terms (Osiris, Thoth, Hermes, resurrection, wisdom traditions, sacred geometry), that belongs to Orion Light and MUST NOT be cited as evidence for Orion Dark. Do not mix Light and Dark material.
```

**3. Add Faction Distinction Field**
Replace generic `cross_cultural_patterns` or similar with faction-specific metadata:
- Orion Light: `light_vs_dark_distinctions`
- Orion Dark: `orion_light_distinctions`, `draco_alliance`, `shadow_integration`

**4. Optional: Per-Source Nuance Flags**
For shadow/negative factions, add boolean flags to track source perspective:
```json
{
  "title": "Source Title",
  "author": "Author Name",
  // ... standard fields ...
  "citation_status": "locked",
  "polarized": false,  // true if source presents faction as purely negative/evil
  "nuanced": true,     // true if source discusses complexity/shadow work
  "integration_themes": false  // true if source discusses redemption/evolution
}
```

These flags help distinguish:
- Fearbait sources ("Orion = evil enslavers")
- Nuanced sources ("Orion Dark = shadow work curriculum")
- Integration sources ("Orion Dark entities can evolve to Light")

**5. Enforce Faction Field in Validation**
Add to rejection criteria:
```
❌ Any characteristic missing `faction: "[faction_name]"` field
```

Add to pass criteria:
```
✅ Every characteristic has `faction: "[faction_name]"` at trait level
```

---

## STAR-SPECIFIC CUSTOMIZATIONS CHECKLIST

When upgrading a specific star system, customize these sections:

### 1. HYPOTHESIS TO VALIDATE
- [ ] List star-specific characteristics to research
- [ ] Based on preliminary research or existing v2/v3 findings

### 2. PRIMARY SOURCES TO RESEARCH
- [ ] List ancient texts relevant to this star system
- [ ] List modern esoteric sources
- [ ] List scholarly works
- [ ] Add accessibility notes (archive.org, sacred-texts.com, etc.)

### 3. SPECIAL FOCUS (if applicable)
- [ ] Cross-cultural patterns (like Pleiades Seven Sisters)
- [ ] Faction distinctions (like Orion Light vs Dark)
- [ ] Astronomical components (like Sirius A/B/C)
- [ ] Unique star-specific considerations

### 4. MANDATORY CHARACTERISTICS
- [ ] Define 3 mandatory characteristics
- [ ] List required sources for each
- [ ] Provide trait name examples
- [ ] Explain validation requirements

### 5. RESEARCH STRATEGY
- [ ] Prioritize sources by accessibility
- [ ] List specific archive sites to check
- [ ] Identify which sources are likely LOCKED vs PROVISIONAL

### 6. EXPECTED CHARACTERISTICS
- [ ] List 5-7 expected characteristics
- [ ] Note likely consensus levels
- [ ] Note likely ancient support levels
- [ ] Note likely citation status (LOCKED vs PROVISIONAL)

### 7. FINAL VALIDATION
- [ ] Update mandatory characteristic names in rejection criteria
- [ ] Update star-specific required fields
- [ ] Update canonical unit examples

---

## THINGS TO NEVER CHANGE (UNIVERSAL ACROSS ALL STARS)

**DO NOT modify these sections when upgrading:**

1. `🔒 HARD RULES (NON-NEGOTIABLE)` - Universal source standards
2. `🔥 V4 CITATION POLICY` - Core provisional/locked logic (only update examples)
3. `ACADEMIC CONTEXT` - Human Design foundations (universal)
4. `CONSENSUS LEVELS` - Definition and v4 note (universal)
5. `ANCIENT SUPPORT LEVELS` - Definitions (universal)
6. `🔒 OUTPUT FORMAT REQUIREMENT` - JSON-only rule (universal)
7. Core `QUALITY CHECKLIST` items (only add star-specific items)
8. Core `FINAL VALIDATION` logic (only add star-specific checks)

---

## COMMON MISTAKES TO AVOID

### ❌ DON'T: Use `"locked|provisional"` in examples
This is invalid JSON and will leak into output.

**✅ DO:** Pick one status per example source, preferably `"provisional"` for disputed_points

### ❌ DON'T: Include `verified: true` field
This is added during manual verification, not by the AI.

**✅ DO:** Explicitly state "NO `verified: true` field" in validation

### ❌ DON'T: Require page numbers for all ancient texts
Many use canonical units (utterances, spells, sessions).

**✅ DO:** State "Canonical units are acceptable as LOCKED citations"

### ❌ DON'T: Require 3-5 sources for ALL traits
Low-consensus traits may only have 2 sources.

**✅ DO:** State "2 sources minimum acceptable for low-consensus traits"

### ❌ DON'T: Forbid translator initials
Some translators are commonly cited as "R. O. Faulkner" in scholarship.

**✅ DO:** State "Full names preferred; initials acceptable if that's how the translator is commonly cited"

### ❌ DON'T: Require ISBN for pre-1967 books
ISBN system started in 1967.

**✅ DO:** State "`isbn: null` acceptable for pre-1967 sources, but publisher must be specified"

### ❌ DON'T: Give fabricated quotes in disputed_points examples
AI will copy them as real quotes.

**✅ DO:** Use PROVISIONAL citations with summaries in disputed_points templates

---

## VALIDATION CHECKLIST FOR COMPLETED V4 UPGRADE

Before marking a star system prompt as "v4 complete", verify:

- [ ] Header says "(V4)" and includes V4 philosophy statement
- [ ] V4 improvements listed (relaxed consensus, online sources, translator clarity)
- [ ] Complete provisional vs locked citation policy section
- [ ] "Full text online = LOCKED" rule included
- [ ] ISBN/null rule included with publisher requirement
- [ ] Translator/editor rules with "(translator)" designation
- [ ] Canonical locators explicitly allowed as LOCKED
- [ ] Consensus levels include v4 relaxation note
- [ ] Output format includes `version: "4.0"` and `methodology` fields
- [ ] Source templates show both provisional and locked examples
- [ ] disputed_points uses PROVISIONAL citations only
- [ ] Quality checklist includes "NO `verified: true` field"
- [ ] 3 mandatory characteristics defined with examples
- [ ] Final validation includes all 3 mandatory characteristics
- [ ] Research strategy prioritizes LOCKED-accessible sources
- [ ] Expected characteristics note likely citation status
- [ ] Star-specific customizations complete

---

## QUICK REFERENCE: V4 vs V2/V3 KEY DIFFERENCES

| Aspect | V2/V3 | V4 |
|--------|-------|-----|
| **Citation modes** | Single mode | Provisional vs Locked |
| **Page numbers** | Always required | Optional if provisional |
| **Quotes** | Always required | Only for locked |
| **Online sources** | Treated same as books | Must use locked if fully accessible |
| **Consensus** | 3-5 sources always | 2 sources OK for low-consensus |
| **Translator names** | Full names only | Initials OK if standard |
| **ISBN** | Required | Can be null if pre-1967 |
| **Canonical units** | Unclear | Explicitly allowed as locked |
| **verified field** | Sometimes included | Never included (manual phase) |
| **disputed_points** | Mixed citation types | Provisional only |

---

## UPGRADE PRIORITY ORDER (RECOMMENDED)

1. ✅ **Orion Light** - COMPLETE - Faction handling, mystery schools
2. ✅ **Orion Dark** - COMPLETE - Faction handling, shadow work, nuance flags
3. **Lyra** - Ancient Greek sources, similar to Pleiades
4. **Andromeda** - Greek mythology, similar to Lyra
5. **Arcturus** - Already has v2 baseline, straightforward upgrade
6. **Draco** - May need faction handling (if Light/Dark split exists)
7. **Zeta Reticuli** - Modern/channeled heavy, unique challenges

---

## TESTING YOUR V4 UPGRADE

After upgrading a prompt, test it by checking:

1. **Can you identify 3 mandatory characteristics?** → Should be in dedicated section
2. **Are disputed_points using provisional citations?** → No fabricated quotes (if applicable)
3. **Is the ISBN/null rule stated?** → Pre-1967 sources won't be rejected
4. **Are canonical units allowed?** → Ancient texts can use utterance/spell numbers
5. **Is verified: true forbidden?** → Should be in rejection criteria
6. **Are online sources prioritized for LOCKED?** → archive.org, sacred-texts.com mentioned
7. **For faction-based systems:** Is faction field required? Is source contamination filter present?
8. **For shadow/negative factions:** Are nuance flags (polarized, nuanced, integration_themes) included?

If all applicable checks pass, your v4 upgrade is complete.

---

## LESSONS LEARNED FROM ORION DARK UPGRADE

### Critical Additions for Shadow/Negative Factions

When upgrading a shadow or negative faction (Orion Dark, potentially Draco Dark, etc.):

**1. Source Contamination Prevention**
Add explicit filter in OBJECTIVE section to prevent mixing positive/light material:
```
**CRITICAL SOURCE FILTER:** If a source is describing [STAR] in [positive terms], that belongs to [LIGHT FACTION] and MUST NOT be cited as evidence for [DARK FACTION]. Do not mix Light and Dark material.
```

**2. Nuance Flags Per Source**
Add three boolean flags to track source perspective:
- `polarized: true/false` - Does source present faction as purely evil?
- `nuanced: true/false` - Does source discuss shadow work/complexity?
- `integration_themes: true/false` - Does source discuss redemption/evolution?

**3. Multiple Metadata Fields**
Instead of one distinction field, use multiple to capture complexity:
- `[opposite_faction]_distinctions` - How to distinguish from opposite faction
- `[allied_system]_alliance` - Relationship with allied systems (e.g., Draco)
- `shadow_integration` - Nuanced view of shadow work themes

**4. Emphasize "Not Evil" Framing**
Throughout the prompt, emphasize:
- Shadow work and integration themes
- Archetypal lessons, not moral judgment
- Service-to-self as polarity, not evil
- Necessary counterbalance to Light

This prevents fearbait output and creates emotionally responsible profiles.

**5. Enforce Nuance Flags in Validation**
Add to rejection criteria:
```
❌ Any source missing `polarized`, `nuanced`, or `integration_themes` boolean flags
```

Add to pass criteria:
```
✅ Every source has `polarized`, `nuanced`, and `integration_themes` boolean flags
```

### Why This Matters

Shadow/negative factions need extra care because:
- Users may get these in their profile and feel judged
- Sources often polarize these factions as "evil"
- The app needs to reframe shadow work as curriculum, not doom
- Legal/ethical responsibility to avoid harmful stereotyping

The nuance flags let you filter and present sources appropriately in the UI.

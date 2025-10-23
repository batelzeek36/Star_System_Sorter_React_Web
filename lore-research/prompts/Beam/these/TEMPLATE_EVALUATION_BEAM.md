# Research Template Evaluation - Beam Prompt

## Your Task

I'm designing a three-pass research methodology for mapping Human Design gates to star system archetypes. I need you to evaluate whether these research templates are rigorous, appropriate, and defensible for esoteric synthesis work.

**Please evaluate:**
1. Are the citation requirements appropriate and achievable?
2. Are the quality checks sufficient?
3. Are there any logical gaps or weaknesses?
4. What would make these templates stronger?
5. What are the biggest risks with this approach?

---

## TEMPLATE PASS A: Initial Research

**Purpose:** Gather gate meanings from primary sources (Ra Uru Hu, Gene Keys, I Ching) and establish baseline citations.

**Full Template:**

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research "Human Design Gate {{GATE_NUMBER}}".

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections (e.g., "Gate {{GATE_NUMBER}}, Lines 1-6", "Chapter 3, pp. 45-47")
- You MUST extract actual quotes ≤25 words from the source material
- You MUST include edition information (e.g., "2nd Edition", "Revised Edition", "1st Edition")
- You MUST include working URLs when available
- Only write "unknown" if the source is genuinely inaccessible or doesn't exist
- DO NOT dump URLs outside the JSON structure - parse them into the citations array with full metadata
- If you find sources but can't extract metadata, that response is REJECTED - dig deeper

Requirements:
- Pull Ra Uru Hu's meaning (1–2 sentences) with exact page or section and book/edition metadata
- Pull Gene Keys (shadow, gift, siddhi) with exact page or section
- I Ching Hexagram {{GATE_NUMBER}}: canonical name + brief meaning + why it maps to Gate {{GATE_NUMBER}}
- All arrays must be present (can contain "unknown" only if truly unavailable)

Output shape (minified JSON only):
{
  "gate": {{GATE_NUMBER}},
  "gate_name": "…",
  "hd_meaning": "…",
  "gene_keys": { "shadow": "…", "gift": "…", "siddhi": "…" },
  "i_ching_parallel": { "hexagram": {{GATE_NUMBER}}, "name": "…", "meaning": "…", "relevance": "…" },
  "citations": {
    "primary": [
      { 
        "title":"The Rave I'Ching",
        "author":"Ra Uru Hu",
        "edition":"MUST BE SPECIFIC (e.g., '2nd Edition')",
        "year":1994,
        "page_or_section":"MUST BE SPECIFIC (e.g., 'Gate {{GATE_NUMBER}}, pp. 23-25')",
        "url":"MUST INCLUDE IF AVAILABLE",
        "quote":"MUST BE ACTUAL QUOTE ≤25 words (not 'unknown' unless truly unavailable)"
      }
    ],
    "secondary": [
      { 
        "title":"Gene Keys",
        "author":"Richard Rudd",
        "edition":"MUST BE SPECIFIC (e.g., '1st Edition')",
        "year":2009,
        "page_or_section":"MUST BE SPECIFIC (e.g., 'Gene Key {{GATE_NUMBER}}: [Title]')",
        "url":"MUST INCLUDE IF AVAILABLE",
        "quote":"MUST BE ACTUAL QUOTE ≤25 words (not 'unknown' unless truly unavailable)"
      }
    ]
  },
  "notes": "unknown|brief"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ Do all citations have specific page numbers or sections?
- ✅ Do all citations have actual quotes (not "unknown")?
- ✅ Do all citations have edition information?
- ✅ Are URLs included where available?
- ❌ If any answer is NO, the response is REJECTED - research deeper
```

---

## TEMPLATE PASS B: Ancient Wisdom Connections

**Purpose:** Find thematic parallels in ancient texts (Egyptian, Chinese, Vedic, Indigenous, Greek, Sumerian) to establish cross-cultural archetypal patterns.

**Full Template:**

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Task: For Human Design Gate {{GATE_NUMBER}} archetype ({{GATE_ARCHETYPE}}), find **best-fit** ancient parallels (max 6 items total) from:
- Egyptian/Thothian (Emerald Tablets, Book of the Dead, Pyramid Texts, Hermetica)
- Chinese/Taoist (I Ching #{{GATE_NUMBER}} is mandatory; Tao Te Ching if relevant)
- Vedic/Hindu (Rig Veda, Gita, Upanishads)
- Indigenous (Hopi, Dogon, Aboriginal Seven Sisters, Cherokee/Mayan star lore)
- Greek/Mystery Schools (Orphic, Plato, Pythagoras)
- Sumerian/Mesopotamian (Enuma Elish, Gilgamesh, Sumerian King List)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers, verse numbers, or specific sections (e.g., "Verse 1.1-1.5", "Tablet III, lines 20-25")
- You MUST extract actual quotes ≤25 words from the source material
- You MUST include edition/translation information (e.g., "Wilhelm/Baynes translation", "Penguin Classics 1987")
- You MUST include working URLs when available
- Only write "unknown" if the source is genuinely inaccessible or doesn't exist
- DO NOT dump URLs outside the JSON structure - parse them into the citations array with full metadata
- If you find sources but can't extract metadata, that response is REJECTED - dig deeper

Rules:
- Prefer **one solid citation per tradition** over many weak ones
- If no clean match in a tradition, omit it (don't force it)
- All arrays must be present (can be empty [])

Output shape (minified JSON only):
{
  "gate": {{GATE_NUMBER}},
  "ancient_wisdom_connections": [
    {
      "source_type": "egyptian|chinese|vedic|indigenous|greek|sumerian",
      "text": "Emerald Tablets|I Ching|Rig Veda|…",
      "author": "MUST BE SPECIFIC",
      "edition": "MUST BE SPECIFIC (e.g., 'Wilhelm/Baynes translation, 3rd Edition')",
      "year": 1234,
      "connection": "Specific archetype parallel in ≤2 sentences",
      "quote": "MUST BE ACTUAL QUOTE ≤25 words (not 'unknown' unless truly unavailable)",
      "page_or_section": "MUST BE SPECIFIC (e.g., 'Hexagram {{GATE_NUMBER}}, Line 1', 'Verse 10.129')",
      "url": "MUST INCLUDE IF AVAILABLE"
    }
  ],
  "contradictions": [],
  "notes": "unknown|brief"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ Do all connections have specific page/verse/section numbers?
- ✅ Do all connections have actual quotes (not "unknown")?
- ✅ Do all connections have edition/translation information?
- ✅ Are URLs included where available?
- ❌ If any answer is NO, the response is REJECTED - research deeper
```

---

## TEMPLATE PASS C: Star System Alignments

**Purpose:** Map gate archetype to star systems with full citations, confidence levels, and evidence types. This is the final synthesis that connects Human Design gates to star system characteristics.

**Full Template:**

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Task: Using Gate {{GATE_NUMBER}}'s essence ({{GATE_ARCHETYPE}}), map to candidate star systems:

STAR SYSTEMS:
- Sirius (teachers, guardians, Sirian-Christos lineage)
- Pleiades (nurturers, artists, empaths, Seven Sisters)
- Orion Light/Osirian (historians, Egyptian mystery schools, Thoth/Hermes)
- Arcturus (engineers, healers, geometric consciousness)
- Andromeda (explorers, iconoclasts, freedom, sovereignty)
- Lyra (primordial builders, feline beings, instinct)
- Draco (power, will, hierarchy, kundalini - disputed)
- Zeta Reticuli (analysts, experimenters, detachment)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers, chapters, or specific sections for EVERY source
- You MUST extract actual quotes ≤25 words from the source material
- You MUST include edition/publication information (e.g., "1st Edition 1998", "Revised 2015")
- You MUST include working URLs when available
- Only write "unknown" if the source is genuinely inaccessible or doesn't exist
- DO NOT dump URLs outside the JSON structure - parse them into the sources array with full metadata
- If you find sources but can't extract metadata, that response is REJECTED - dig deeper
- Each alignment needs 2-3 sources with FULL metadata (not just URLs)

Rules:
- 3–5 alignments max
- Mark confidence: high|medium|low|speculative
- Tag evidence_type per alignment: explicit|thematic|cross_cultural|inferred
- Include 2–3 sources per alignment (mix ancient + modern esoteric when possible)
- For Orion, specify "Orion Light" or "Osirian" (not just "Orion")
- All arrays must be present (can be empty [])

Output shape (minified JSON only):
{
  "gate": {{GATE_NUMBER}},
  "star_system_alignments": [
    {
      "system": "Sirius|Pleiades|Orion Light|Arcturus|Andromeda|Lyra|Draco|Zeta",
      "confidence": "high|medium|low|speculative",
      "evidence_type": "explicit|thematic|cross_cultural|inferred",
      "primary_rationale": "2–3 sentences tying Gate {{GATE_NUMBER}} essence to this system's signature.",
      "ancient_support": ["…","…"],
      "modern_support": ["…","…"],
      "cross_cultural_pattern": "… or 'unknown'",
      "sources": [
        { 
          "title":"MUST BE SPECIFIC",
          "author":"MUST BE SPECIFIC",
          "edition":"MUST BE SPECIFIC (e.g., '2nd Edition 2005')",
          "year":1234,
          "source_type":"ancient|channeled|research|indigenous",
          "quote":"MUST BE ACTUAL QUOTE ≤25 words (not 'unknown' unless truly unavailable)",
          "page":"MUST BE SPECIFIC (e.g., 'Chapter 5, pp. 78-80')",
          "url":"MUST INCLUDE IF AVAILABLE",
          "disputed":false
        }
      ]
    }
  ],
  "weights_hint": [
    {
      "system_id": "lyra|sirius|pleiades|orion_light|arcturus|andromeda",
      "suggested_w": 1-5,
      "reason": "Brief explanation why this weight"
    }
  ],
  "mind_blowing_connections": [],
  "contradictions": [],
  "notes": "unknown|brief"
}

WEIGHTS_HINT RULES:
- Total weight across all systems should be ≤15 per gate
- Higher weight = stronger alignment (1=weak, 5=very strong)
- Must match the alignments you identified above
- Reason should be 5-10 words max

QUALITY CHECK BEFORE SUBMITTING:
- ✅ Does each alignment have 2-3 sources with full metadata?
- ✅ Do all sources have specific page numbers or sections?
- ✅ Do all sources have actual quotes (not "unknown")?
- ✅ Do all sources have edition information?
- ✅ Are URLs included where available?
- ❌ If any answer is NO, the response is REJECTED - research deeper
```

---

## YOUR EVALUATION

Please provide a detailed assessment:

### 1. Citation Requirements (1-5 rating)
- Are the citation standards appropriate for esoteric research?
- Is requiring page numbers + quotes + editions realistic?
- Are these standards too strict, too loose, or just right?
- What citation requirements would you add or remove?

### 2. Research Scope (1-5 rating)
**Pass A:** Is focusing on Ra Uru Hu + Gene Keys + I Ching sufficient for baseline?
**Pass B:** Is the ancient wisdom scope (6 traditions) appropriate?
**Pass C:** Is the star system list (8 systems) comprehensive enough?

### 3. Quality Checks (1-5 rating)
- Are the pre-submission quality checks sufficient?
- What additional validation would you add?
- Are there any checks that are redundant or unnecessary?

### 4. Evidence Types (Pass C)
The template uses: explicit | thematic | cross_cultural | inferred
- Is this classification system clear and useful?
- What other evidence types should be included?
- How would you improve this taxonomy?

### 5. Confidence Levels (Pass C)
The template uses: high | medium | low | speculative
- Is this scale appropriate?
- Should there be more granularity (1-10 scale)?
- How would you define each level?

### 6. Source Mix (Pass C)
The template requires "mix ancient + modern esoteric when possible"
- Is mixing ancient texts with channeled material defensible?
- Should there be minimum requirements per source type?
- How would you balance ancient vs. modern sources?

### 7. Logical Gaps
- What's missing from these templates?
- What assumptions are being made?
- What edge cases aren't handled?

### 8. Practical Concerns
- Can an AI actually execute these templates successfully?
- Are the requirements too demanding?
- What would cause the most failures?

### 9. Defensibility
- If challenged, which parts of this methodology are weakest?
- What would a skeptic attack first?
- How would you strengthen the defensibility?

### 10. Overall Assessment
- Are these templates ready for production use?
- What's the biggest risk with this approach?
- What would you change before launching?

---

## Context

This methodology is for a web app that maps Human Design birth charts to star system archetypes. It's framed as "for insight & entertainment" with full disclaimers. The goal is to create well-researched, transparent archetypal synthesis—NOT to prove extraterrestrial origins or make scientific claims.

**The question:** Are these research templates rigorous enough to be defensible, or do they need major revisions?

**Success criteria:**
- Citations are verifiable
- Logic is internally consistent
- Transparency is maintained
- Users can verify claims
- Legal/ethical framing is adequate

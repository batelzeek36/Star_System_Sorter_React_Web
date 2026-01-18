# Phase 0: Star System Baseline Research Prompts

## Instructions

Copy each prompt below and paste into Perplexity Comet. These prompts validate GPT-4o's hypotheses with proper citations.

**Critical:** Each prompt demands:
- 5+ sources per characteristic
- Specific page numbers or sections
- Actual quotes ≤25 words
- Edition information
- Working URLs where available

**Save results as:** `star-system-[name]-baseline.json`

---

## 1. SIRIUS

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research the star system **SIRIUS** characteristics in esoteric, ancient, and modern sources.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Divine teachers / wisdom keepers
- Genetic engineers (Nommo, god-race)
- Lawgivers, spiritual initiators (Osirian lineage)
- Guardians of sacred knowledge
- Christos-type vibration

SOURCES TO CHECK:
- Dogon tribe oral tradition (Nommo = amphibious Sirians)
- "The Sirius Mystery" by Robert Temple
- "The Law of One" (Ra Material)
- Egyptian mythology: Sopdet (Sirius), Isis, Osiris
- Patricia Cori channeled works

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections (e.g., "Chapter 3, pp. 67-69", "Session 6, Question 14")
- You MUST extract actual quotes ≤25 words from the source material
- You MUST include edition information (e.g., "50th Anniversary Edition", "1st Edition")
- You MUST include working URLs when available
- Only write "unknown" if the source is genuinely inaccessible or doesn't exist
- DO NOT dump URLs outside the JSON structure - parse them into the sources array with full metadata
- If you find sources but can't extract metadata, that response is REJECTED - dig deeper
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with consensus across multiple sources
- Mark consensus_level: high|medium|low based on source agreement
- Include both ancient and modern sources
- All arrays must be present (can be empty [])

Output shape (minified JSON only):
{
  "star_system": "Sirius",
  "characteristics": [
    {
      "trait": "Teachers and wisdom keepers",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC (full title)",
          "author": "MUST BE SPECIFIC (full name)",
          "edition": "MUST BE SPECIFIC (e.g., '50th Anniversary Edition')",
          "year": 2019,
          "page": "MUST BE SPECIFIC (e.g., 'Chapter 3, pp. 67-69')",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words (not 'unknown')",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Brief notes on consensus patterns or contradictions"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ Do all sources have specific page numbers or sections?
- ✅ Do all sources have actual quotes (not "unknown")?
- ✅ Do all sources have edition information?
- ✅ Are URLs included where available?
- ✅ Does each characteristic have 5+ sources?
- ❌ If any answer is NO, the response is REJECTED - research deeper
```

---

## 2. PLEIADES

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research the star system **PLEIADES** characteristics in global mythology, esoteric texts, and modern channeled material.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Emotional empaths and healers
- Artistic, sensual, aesthetic
- Feminine-coded (Yin, Venusian)
- Starseed 'origin point' for many
- Spiritual midwives of awakening

SOURCES TO CHECK:
- "Bringers of the Dawn" by Barbara Marciniak
- "The Pleiadian Agenda" by Barbara Hand Clow
- Greek mythology: Seven Sisters (linked to Artemis)
- Aboriginal Dreamtime legends
- Cherokee and Maya oral traditions
- Hindu: Krittika (nurturing mothers)
- Japanese: Subaru (unity, harmony)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words from the source material
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if the source is genuinely inaccessible
- DO NOT dump URLs outside the JSON structure
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with cross-cultural validation
- Mark consensus_level based on how many cultures/sources agree
- Include ancient mythology AND modern channeled sources
- Look for "Seven Sisters" pattern across cultures
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Pleiades",
  "characteristics": [
    {
      "trait": "Nurturers and artistic beings",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1992,
          "page": "MUST BE SPECIFIC (e.g., 'Chapter 3, pp. 45-47')",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Note cross-cultural patterns (e.g., Seven Sisters in 6+ cultures)"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ Do all sources have specific page numbers or sections?
- ✅ Do all sources have actual quotes (not "unknown")?
- ✅ Do all sources have edition information?
- ✅ Are URLs included where available?
- ✅ Does each characteristic have 5+ sources?
- ✅ Are cross-cultural patterns documented?
- ❌ If any answer is NO, the response is REJECTED - research deeper
```

---

## 3. ORION LIGHT (Osirian)

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research **ORION LIGHT** (Osirian/Thoth/Hermes lineage) characteristics. EXCLUDE Orion Dark/Draco material.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Record keepers / historians
- Spiritual strategists / system architects
- Carriers of sacred geometry / mystery school teachings
- Affiliated with Thoth / Hermes
- Often oppose Orion "Dark"/Draco hybrid systems

SOURCES TO CHECK:
- "Emerald Tablets" of Thoth
- "The Orion Mystery" by Robert Bauval
- Egyptian Pyramid alignment research
- "The Law of One" (Ra Material - mentions Orion influence)
- Rosicrucian / Hermetic writings
- Hermetic Corpus

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata
- CLEARLY distinguish Light Orion from Dark Orion

Requirements:
- Extract 3-5 core characteristics specific to Light/Osirian faction
- Mark consensus_level based on source agreement
- Note any Light vs Dark distinctions found
- Include ancient Egyptian AND modern esoteric sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Orion Light",
  "characteristics": [
    {
      "trait": "Record keepers and historians",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1994,
          "page": "MUST BE SPECIFIC",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Note Light vs Dark Orion distinctions, Thoth/Hermes connections"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ✅ Light vs Dark Orion clearly distinguished?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## 4. ARCTURUS

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research the star system **ARCTURUS** characteristics in esoteric literature and channeling.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Energy healers
- Frequency-based consciousness
- Architects of advanced tech + sacred geometry
- Defenders of Earth's energy grids
- Dreamtime and sleep-state engineers

SOURCES TO CHECK:
- Edgar Cayce readings (indexed)
- "We, the Arcturians" by Norma Milanovich
- "The Arcturian Anthology" by Tom Kenyon
- Bashar (Darryl Anka) mentions
- Dolores Cannon (starseed origin types)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or reading numbers (e.g., "Reading 254-87", "Chapter 5, pp. 78-80")
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with consensus
- Mark consensus_level based on source agreement
- Note if ancient references exist (likely limited)
- Include Cayce readings AND modern channeled sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Arcturus",
  "characteristics": [
    {
      "trait": "Energy healers and frequency workers",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1990,
          "page": "MUST BE SPECIFIC (e.g., 'Reading 254-87' or 'Chapter 3, pp. 45-50')",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Note if ancient references exist; document Cayce reading consistency"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page/reading numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## 5. ANDROMEDA

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research **ANDROMEDAN** being characteristics in mythology and channeling.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Sovereignty / anti-control
- Galactic explorers, nomadic
- Non-hierarchical ethos
- Technically advanced yet tribal
- Often anti-interventionist

SOURCES TO CHECK:
- "Defending Sacred Ground" by Alex Collier
- Lyssa Royal Holt works
- Greek mythology: Princess Andromeda (symbolic connections)
- Channeled Andromedan Council material
- Bashar (Darryl Anka) contrasts/mentions

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with consensus
- Mark consensus_level based on source agreement
- Note Greek mythology connections (if any)
- Include channeled AND research sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Andromeda",
  "characteristics": [
    {
      "trait": "Freedom-seeking and sovereignty-focused",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1996,
          "page": "MUST BE SPECIFIC",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Note Greek mythology connections; document anti-interventionist stance"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## 6. LYRA

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research the star system **LYRA** as described in esoteric, channeled, and root race texts.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Primordial humanoid root race
- Feline (or avian) ancestry
- Builders of early civilizations
- Refugees after war with Draco
- Carry "first template" consciousness

SOURCES TO CHECK:
- "The Prism of Lyra" by Lyssa Royal Holt
- Dolores Cannon - "The Three Waves of Volunteers"
- Bashar (Darryl Anka) mentions
- Root race theory (Theosophy, Blavatsky)
- Lemurian channeling material

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with consensus
- Mark consensus_level based on source agreement
- Clarify feline vs avian ancestry confusion if possible
- Note Lyran-Draco war references
- Include root race theory AND modern channeled sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Lyra",
  "characteristics": [
    {
      "trait": "Primordial root race and builders",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1989,
          "page": "MUST BE SPECIFIC",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Clarify feline vs avian; document Lyran-Draco war consistency"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ✅ Feline vs avian clarified?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## 7. DRACO

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research the **DRACO** star system and dragon archetype across cultures.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Power, control, dominance
- Hierarchy and royalty
- Kundalini / serpentine force
- Genetic manipulators
- Often misunderstood or polarized as evil (but not inherently so)

SOURCES TO CHECK:
- "The Biggest Secret" by David Icke (NOTE: controversial, speculative)
- "Blue Blood, True Blood" by Stewart Swerdlow
- Global dragon myths (Chinese, Mayan, Norse, European)
- Gnostic serpent imagery
- Ancient Babylonian symbols
- Kundalini teachings (Eastern traditions)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata
- NOTE controversial sources (e.g., Icke) as "disputed: true"

Requirements:
- Extract 3-5 core characteristics with consensus
- Mark consensus_level based on source agreement
- Separate shadow vs light Draco when possible
- Note dragon = evil (West) vs dragon = wisdom (East) duality
- Include ancient mythology AND modern esoteric sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Draco",
  "characteristics": [
    {
      "trait": "Power and hierarchical structure",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1999,
          "page": "MUST BE SPECIFIC",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous",
          "disputed": true|false
        }
      ]
    }
  ],
  "research_notes": "Note shadow vs light Draco; document East vs West dragon duality"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ✅ Controversial sources marked as disputed?
- ✅ Shadow vs light Draco distinguished?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## 8. ZETA RETICULI

```
Return **JSON only** (no markdown, no pre/post text). Output **minified JSON**.

Research **ZETA RETICULI** entities from UFO lore, channeling, and hypnosis regression material.

HYPOTHESIS TO VALIDATE (from GPT-4o):
- Emotionally detached intelligence
- Genetic researchers / experimenters
- Interdimensional abductors (neutral to negative)
- Timeline engineers
- Carry karmic debt from past implosions

SOURCES TO CHECK:
- Betty and Barney Hill case (1961) - Zeta star map
- Bashar (Darryl Anka) - Zeta-human hybrid perspective
- "The Threat" by David Jacobs
- "The Prism of Lyra" by Lyssa Royal (mentions Zeta hybrid programs)
- Dolores Cannon (abduction regression sessions)

CRITICAL CITATION REQUIREMENTS (NON-NEGOTIABLE):
- You MUST find exact page numbers or specific sections
- You MUST extract actual quotes ≤25 words
- You MUST include edition information
- You MUST include working URLs when available
- Only write "unknown" if source is genuinely inaccessible
- DO NOT dump URLs outside JSON structure
- Each characteristic needs 5+ sources with FULL metadata

Requirements:
- Extract 3-5 core characteristics with consensus
- Mark consensus_level based on source agreement
- Note if modern hybrids are more benevolent
- Document karmic redemption themes if found
- Include UFO research AND channeled sources
- All arrays must be present

Output shape (minified JSON only):
{
  "star_system": "Zeta Reticuli",
  "characteristics": [
    {
      "trait": "Analytical and emotionally detached",
      "consensus_level": "high|medium|low",
      "sources": [
        {
          "title": "MUST BE SPECIFIC",
          "author": "MUST BE SPECIFIC",
          "edition": "MUST BE SPECIFIC",
          "year": 1961,
          "page": "MUST BE SPECIFIC (or 'Case Report' for Hill case)",
          "quote": "MUST BE ACTUAL QUOTE ≤25 words",
          "url": "MUST INCLUDE IF AVAILABLE",
          "source_type": "ancient|modern|channeled|indigenous"
        }
      ]
    }
  ],
  "research_notes": "Note hybrid program evolution; document karmic redemption themes"
}

QUALITY CHECK BEFORE SUBMITTING:
- ✅ All sources have specific page numbers?
- ✅ All sources have actual quotes?
- ✅ All sources have edition information?
- ✅ URLs included where available?
- ✅ Each characteristic has 5+ sources?
- ❌ If any answer is NO, REJECTED - research deeper
```

---

## After Running All 8 Prompts

1. **Save each result** as `star-system-[name]-baseline.json`
2. **Evaluate quality** using `COMET_RESPONSE_CHECKLIST.md`
3. **Reject weak responses** - Re-prompt if citations are missing
4. **Compile results** into `star-systems-baseline.yaml`
5. **Validate consensus** - Check if GPT-4o's hypotheses were confirmed
6. **THEN proceed** to Phase 1 (gate research)

---

**Total Time Estimate:** 8 systems × 2-3 hours each = 16-24 hours  
**Priority:** CRITICAL - This is the foundation for all gate mappings

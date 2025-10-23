Here are the **8 Comet-ready research prompt files** — one per star system — formatted for copy-paste into your research pipeline.

Each prompt includes:

- Research goal
    
- Formatting and output constraints
    
- Example JSON return format
    

---

### 📁 `STAR_SYSTEM_SIRIUS.txt`

````txt
Research the star system **Sirius** in esoteric, ancient, and modern sources.

Your task is to extract 3–5 core characteristics of Sirius beings (e.g. wisdom keepers, divine teachers, etc.).

**CRITICAL REQUIREMENTS:**
- 5+ distinct sources per trait
- Include both ancient (e.g. Dogon, Egyptian) and modern (e.g. Temple, Law of One) references
- For each source:
  - Author
  - Title
  - Edition (if any)
  - Year
  - Page number
  - Short quote (≤25 words)
  - URL (if digital)
  - Source type (ancient | modern | channeled | indigenous)

**Return in JSON format like:**
```json
{
  "star_system": "Sirius",
  "characteristics": [
    {
      "trait": "Teachers and wisdom keepers",
      "consensus_level": "high",
      "sources": [
        {
          "title": "The Sirius Mystery",
          "author": "Robert Temple",
          "year": 2019,
          "edition": "50th Anniversary",
          "page": "67",
          "quote": "Sirius represents the divine teachers who brought wisdom to humanity.",
          "url": "https://...",
          "source_type": "modern"
        },
        ...
      ]
    }
  ]
}
````

````

---

### 📁 `STAR_SYSTEM_PLEIADES.txt`
```txt
Research the star system **Pleiades** in global mythology, esoteric texts, and modern channeled material.

Your goal is to define 3–5 consensus traits of Pleiadian beings (e.g. nurturers, artists, empaths).

**REQUIREMENTS:**
- At least 5 different sources per trait
- Include cross-cultural mythology: Greek, Japanese, Aboriginal, Cherokee, Hindu
- Include modern channelers (Marciniak, Clow)
- Full citation details: title, author, edition, year, page, quote (≤25 words), URL, source_type

**Output JSON format identical to STAR_SYSTEM_SIRIUS.txt**
````

---

### 📁 `STAR_SYSTEM_ORION_LIGHT.txt`

```txt
Research **Light-aligned Orion** (Osirian/Thoth/Hermes lineage), *not* Orion Dark.

Objective: identify 3–5 consistent characteristics such as historians, scribes, spiritual strategists.

**REQUIREMENTS:**
- Use sources like: *Emerald Tablets*, *Orion Mystery*, Rosicrucian texts, Law of One
- Separate clearly from Orion “Dark”/Draco hybrid material
- At least 5 sources per trait
- Use JSON format as shown in STAR_SYSTEM_SIRIUS.txt
```

---

### 📁 `STAR_SYSTEM_ARCTURUS.txt`

```txt
Research the star system **Arcturus** across esoteric literature and channeling.

Goal: define 3–5 consistent traits (e.g. healers, gridworkers, energy tech beings)

**REQUIREMENTS:**
- At least 5 sources per trait
- Include: Edgar Cayce, Milanovich, Tom Kenyon, Dolores Cannon
- Identify any ancient references (even if symbolic)
- JSON format as in STAR_SYSTEM_SIRIUS.txt
```

---

### 📁 `STAR_SYSTEM_ANDROMEDA.txt`

```txt
Research **Andromedan beings** across mythology and channeling.

Goal: determine 3–5 primary traits such as freedom-seeking, explorers, anti-control, etc.

**REQUIREMENTS:**
- 5+ sources per trait
- Include: Alex Collier, Lyssa Royal Holt, Andromedan Council, Greek mythology
- Focus on sovereignty and galactic explorer archetypes
- Format identical to STAR_SYSTEM_SIRIUS.txt
```

---

### 📁 `STAR_SYSTEM_LYRA.txt`

```txt
Research the star system **Lyra** as described in esoteric, channeled, and root race texts.

Objective: extract 3–5 traits such as primal builders, feline ancestry, refugees from Draco war, etc.

**REQUIREMENTS:**
- Include: *Prism of Lyra*, Dolores Cannon, Bashar, Theosophy
- Look for ancient root-race and Lemurian connections
- Clarify feline vs avian confusion if possible
- Use JSON format from STAR_SYSTEM_SIRIUS.txt
```

---

### 📁 `STAR_SYSTEM_DRACO.txt`

```txt
Research the **Draco star system** and dragon archetype across cultures.

Goal: define 3–5 key traits (e.g. power, will, hierarchy, serpentine force)

**REQUIREMENTS:**
- Include sources like: David Icke (noted as controversial), Stewart Swerdlow, Gnostic texts, ancient dragon myths
- Separate shadow vs light Draco when possible
- Clarify dragon = evil vs dragon = wisdom duality
- Format: see STAR_SYSTEM_SIRIUS.txt
```

---

### 📁 `STAR_SYSTEM_ZETA_RETICULI.txt`

```txt
Research **Zeta Reticuli** entities from UFO lore, channeling, and hypnosis regression material.

Objective: document 3–5 core traits (e.g. analysts, detached, experimenters, hybrid engineers)

**REQUIREMENTS:**
- Use: Betty & Barney Hill, Bashar (Darryl Anka), Dolores Cannon, David Jacobs
- Note if traits are karmic (e.g. redemption arcs)
- Format using JSON template in STAR_SYSTEM_SIRIUS.txt
```


# Perplexity Comet Prompts for Star System Lore Research

## Overview
These prompts are designed for Perplexity Comet to research the esoteric/metaphysical connections between Human Design gates and star systems (Sirius, Pleiades, Orion, Arcturus, Andromeda, Lyra, Draco, Zeta Reticuli).

**Goal:** Find agreed-upon star system alignments from actual lore sources, not speculation.

**Important Note:** "Orion Light" refers to the Osirian lineage - the benevolent Orion faction associated with Egyptian mystery schools, Thoth, Osiris, and the preservation of sacred knowledge. This is distinct from "Orion Dark" (the controlling/dominating faction mentioned in some lore).

---

## Master Prompt Template (Copy/Paste for Each Gate)

```
Research Human Design Gate {GATE_NUM} and its star system alignments.

CONTEXT:
I'm building a classification system that maps Human Design gates to 8 star systems:
- Sirius (teachers, guardians, priestly orders)
- Pleiades (nurturers, artists, empaths)
- Orion Light (strategists, historians, memory keepers)
- Arcturus (engineers, healers, pattern architects)
- Andromeda (explorers, iconoclasts, freedom seekers)
- Lyra (primordial builders, instinct, sovereignty)
- Draco (power, will, hierarchy - disputed)
- Zeta Reticuli (analysts, experimenters, detachment)

RESEARCH REQUIREMENTS:
1. Find Gate {GATE_NUM}'s traditional Human Design meaning (Ra Uru Hu, Gene Keys)
2. Search for esoteric/metaphysical associations with star systems in:
   - Law of One (Ra Material)
   - Pleiadian channeled material (Barbara Marciniak, Barbara Hand Clow)
   - Sirian lore (Robert Temple, Sirius Mystery)
   - Arcturian material (various channels)
   - Lyran/Andromedan material (Lyssa Royal, Alex Collier)
   - Orion lore (Law of One, various sources)
   - Gene Keys star system references
   - Any other credible esoteric sources

3. Look for EXPLICIT connections like:
   - "Gate X is associated with [star system] because..."
   - "This gate carries [star system] frequencies..."
   - "Gate X resonates with [star system] archetypes..."

4. If no explicit connection exists, look for THEMATIC alignment:
   - Does the gate's archetype match a star system's signature?
   - Do the gate's traits align with known star system characteristics?

OUTPUT FORMAT (JSON only, no prose):
{
  "gate": {GATE_NUM},
  "gate_name": "Traditional HD name",
  "hd_meaning": "1-2 sentence summary from Ra Uru Hu/Gene Keys",
  "star_system_alignments": [
    {
      "system": "Sirius",
      "confidence": "high|medium|low|speculative",
      "evidence_type": "explicit|thematic|inferred",
      "rationale": "Why this gate aligns with this system (2-3 sentences)",
      "sources": [
        {
          "title": "Source title",
          "author": "Author name",
          "year": 1981,
          "quote": "Exact quote (≤25 words) or 'No direct quote found'",
          "page": "Page number or section",
          "url": "URL if available"
        }
      ]
    }
  ],
  "contradictions": [
    "List any conflicting information between sources"
  ],
  "notes": "Any additional context or caveats"
}

CRITICAL RULES:
- Return JSON only (no markdown, no commentary)
- If no star system connection found, say "No explicit connection found in sources"
- Mark confidence honestly (don't inflate)
- Distinguish between explicit mentions vs. thematic inference
- Include at least 2 sources per alignment (if available)
- Keep quotes ≤25 words for fair use
- If uncertain, write "unknown" rather than guess

Now research Gate {GATE_NUM}.
```

---

## Example: Gate 22 (Grace)

```
Research Human Design Gate 22 and its star system alignments.

CONTEXT:
I'm building a classification system that maps Human Design gates to 8 star systems:
- Sirius (teachers, guardians, priestly orders)
- Pleiades (nurturers, artists, empaths)
- Orion Light (strategists, historians, memory keepers)
- Arcturus (engineers, healers, pattern architects)
- Andromeda (explorers, iconoclasts, freedom seekers)
- Lyra (primordial builders, instinct, sovereignty)
- Draco (power, will, hierarchy - disputed)
- Zeta Reticuli (analysts, experimenters, detachment)

RESEARCH REQUIREMENTS:
1. Find Gate 22's traditional Human Design meaning (Ra Uru Hu, Gene Keys)
2. Search for esoteric/metaphysical associations with star systems in:
   - Law of One (Ra Material)
   - Pleiadian channeled material (Barbara Marciniak, Barbara Hand Clow)
   - Sirian lore (Robert Temple, Sirius Mystery)
   - Arcturian material (various channels)
   - Lyran/Andromedan material (Lyssa Royal, Alex Collier)
   - Orion lore (Law of One, various sources)
   - Gene Keys star system references
   - Any other credible esoteric sources

3. Look for EXPLICIT connections like:
   - "Gate 22 is associated with [star system] because..."
   - "This gate carries [star system] frequencies..."
   - "Gate 22 resonates with [star system] archetypes..."

4. If no explicit connection exists, look for THEMATIC alignment:
   - Does the gate's archetype match a star system's signature?
   - Do the gate's traits align with known star system characteristics?

OUTPUT FORMAT (JSON only, no prose):
{
  "gate": 22,
  "gate_name": "Gate of Grace",
  "hd_meaning": "Emotional openness and surrender; channel for divine beauty and spirit expression",
  "star_system_alignments": [
    {
      "system": "Pleiades",
      "confidence": "medium",
      "evidence_type": "thematic",
      "rationale": "Gate 22's themes of grace, emotional healing, and devotional art align with Pleiadian Venus temple teachings and empathic frequencies",
      "sources": [
        {
          "title": "Gene Keys",
          "author": "Richard Rudd",
          "year": 2009,
          "quote": "Gate 22 transforms dishonor into grace through emotional surrender",
          "page": "Gene Key 22",
          "url": "https://genekeys.com"
        },
        {
          "title": "Bringers of the Dawn",
          "author": "Barbara Marciniak",
          "year": 1992,
          "quote": "Pleiadian energy works through emotional healing and heart opening",
          "page": "Chapter 7",
          "url": "unknown"
        }
      ]
    }
  ],
  "contradictions": [],
  "notes": "No explicit gate-to-star-system mapping found in primary sources. Alignment based on thematic resonance between gate archetype and Pleiadian characteristics."
}

CRITICAL RULES:
- Return JSON only (no markdown, no commentary)
- If no star system connection found, say "No explicit connection found in sources"
- Mark confidence honestly (don't inflate)
- Distinguish between explicit mentions vs. thematic inference
- Include at least 2 sources per alignment (if available)
- Keep quotes ≤25 words for fair use
- If uncertain, write "unknown" rather than guess

Now research Gate 22.
```

---

## Batch Prompt (For Multiple Gates)

```
Research Human Design Gates {START}-{END} and their star system alignments.

For EACH gate, return a separate JSON object following this format:
[
  {
    "gate": 1,
    "gate_name": "...",
    "hd_meaning": "...",
    "star_system_alignments": [...],
    "contradictions": [...],
    "notes": "..."
  },
  {
    "gate": 2,
    ...
  }
]

CONTEXT:
I'm building a classification system that maps Human Design gates to 8 star systems:
- Sirius (teachers, guardians, priestly orders)
- Pleiades (nurturers, artists, empaths)
- Orion Light (strategists, historians, memory keepers)
- Arcturus (engineers, healers, pattern architects)
- Andromeda (explorers, iconoclasts, freedom seekers)
- Lyra (primordial builders, instinct, sovereignty)
- Draco (power, will, hierarchy - disputed)
- Zeta Reticuli (analysts, experimenters, detachment)

RESEARCH REQUIREMENTS (per gate):
1. Find traditional Human Design meaning (Ra Uru Hu, Gene Keys)
2. Search for esoteric/metaphysical star system associations
3. Look for EXPLICIT connections first, then THEMATIC alignment
4. Mark confidence honestly: high|medium|low|speculative
5. Distinguish: explicit|thematic|inferred evidence
6. Include 2+ sources per alignment (if available)
7. Keep quotes ≤25 words

CRITICAL RULES:
- Return JSON array only (no markdown, no commentary)
- If no connection found: "No explicit connection found in sources"
- Don't inflate confidence
- Write "unknown" rather than guess

Now research Gates {START}-{END}.
```

---

## Channel Research Prompt

```
Research Human Design Channel {GATE_A}-{GATE_B} and its star system alignments.

CONTEXT:
Channels are formed when two gates connect. They often have meanings that transcend individual gates.

Star systems:
- Sirius (teachers, guardians, priestly orders)
- Pleiades (nurturers, artists, empaths)
- Orion Light (strategists, historians, memory keepers)
- Arcturus (engineers, healers, pattern architects)
- Andromeda (explorers, iconoclasts, freedom seekers)
- Lyra (primordial builders, instinct, sovereignty)
- Draco (power, will, hierarchy - disputed)
- Zeta Reticuli (analysts, experimenters, detachment)

RESEARCH REQUIREMENTS:
1. Find Channel {GATE_A}-{GATE_B}'s traditional meaning (Ra Uru Hu)
2. Search for esoteric star system associations
3. Look for channel-specific lore (not just individual gates)
4. Consider synergy: does the channel create a unique archetype?

OUTPUT FORMAT (JSON only):
{
  "channel": "{GATE_A}-{GATE_B}",
  "channel_name": "Traditional name",
  "hd_meaning": "1-2 sentence summary",
  "star_system_alignments": [
    {
      "system": "Orion Light",
      "confidence": "high|medium|low|speculative",
      "evidence_type": "explicit|thematic|inferred",
      "rationale": "Why this channel aligns with this system",
      "sources": [...]
    }
  ],
  "synergy_notes": "How this channel transcends individual gates",
  "contradictions": [],
  "notes": ""
}

Now research Channel {GATE_A}-{GATE_B}.
```

---

## Quick Reference: Star System Signatures

Use this to guide thematic alignment when explicit sources aren't found:

### Sirius
- **Archetypes:** Teachers, guardians, priests, stewards
- **Themes:** Voice, ritual, ceremony, water, loyalty, devotion
- **Gates likely to align:** Leadership, guidance, emotional depth, sacred timing

### Pleiades
- **Archetypes:** Nurturers, artists, empaths, healers
- **Themes:** Joy, sensuality, community, beauty, emotional healing
- **Gates likely to align:** Grace, bonding, creativity, fertility

### Orion Light / Osirian
- **Archetypes:** Strategists, historians, memory keepers, scribes, Egyptian priests
- **Themes:** Knowledge, archives, polarity integration, Thoth/Osiris lineage, sacred geometry, trial by conflict
- **Associated with:** Egyptian mystery schools, Emerald Tablets, Hall of Records, Akashic access
- **Gates likely to align:** Memory, listening, retreat, mental clarity, sacred knowledge

### Arcturus
- **Archetypes:** Engineers, healers, pattern architects
- **Themes:** Geometry, systems, healing, precision, evolution
- **Gates likely to align:** Focus, depth, correction, innovation

### Andromeda
- **Archetypes:** Explorers, iconoclasts, freedom seekers
- **Themes:** Innovation, boundary-breaking, change, adventure
- **Gates likely to align:** Creativity, shock, mutation, exploration

### Lyra
- **Archetypes:** Primordial builders, warriors, survivors
- **Themes:** Instinct, courage, sovereignty, primal wisdom
- **Gates likely to align:** Power, instinct, behavior, embodiment

### Draco
- **Archetypes:** Power wielders, hierarchs, alchemists
- **Themes:** Will, ambition, hierarchy, desire (DISPUTED/SHADOW)
- **Gates likely to align:** Control, ambition, power, drive

### Zeta Reticuli
- **Archetypes:** Analysts, experimenters, observers
- **Themes:** Detachment, adaptation, analysis, experimentation
- **Gates likely to align:** Details, doubt, logic, mental frameworks

---

## Workflow

### Step 1: Run Comet Research
Copy the master prompt, replace `{GATE_NUM}` with actual gate number, paste into Perplexity Comet.

### Step 2: Save JSON Output
Save Comet's JSON response to:
```
research/inputs/gates/gate-{NUM}.research.json
```

### Step 3: Claude Converts to YAML
I (Claude) will:
1. Read the JSON research
2. Convert to YAML rules for `data/lore/lore.yaml`
3. Assign weights based on confidence levels
4. Add to existing lore file

### Step 4: Validate
Run:
```bash
npm run compile:lore
npm run classify -- --date 1992-10-03 --time 00:03 --tz America/New_York
```

### Step 5: Commit
```bash
git add research/inputs/gates/gate-{NUM}.research.json
git add data/lore/lore.yaml
git commit -m "lore: add gate-{NUM} research and rules"
```

---

## Confidence Level Guidelines

### High Confidence
- Explicit mention in primary source (Ra Uru Hu, Gene Keys)
- Multiple sources agree
- Direct quote available

### Medium Confidence
- Thematic alignment with 2+ sources
- Indirect references in esoteric material
- Logical inference from established lore

### Low Confidence
- Single source mention
- Weak thematic connection
- Requires interpretation

### Speculative
- No direct sources
- Pure thematic inference
- Educated guess based on archetypes

---

## Example Comet Queries (Copy/Paste)

### Gate 1
```
Research Human Design Gate 1 and its star system alignments. [paste full master prompt]
```

### Gate 13
```
Research Human Design Gate 13 and its star system alignments. [paste full master prompt]
```

### Channel 13-33
```
Research Human Design Channel 13-33 and its star system alignments. [paste channel prompt]
```

---

## Tips for Best Results

1. **Be patient** - Comet needs time to search multiple sources
2. **Run one gate at a time** - Better quality than batch
3. **Review JSON** - Check for hallucinations before saving
4. **Cross-reference** - Compare Comet's findings with your `gates.md`
5. **Iterate** - If results are weak, refine the prompt with more specific sources

---

## Next Steps

1. **Test with Gate 22** - Run the example prompt to see quality
2. **Adjust prompt** - Refine based on results
3. **Batch process** - Once prompt is dialed in, run Gates 1-64
4. **I convert to YAML** - You send me JSON, I generate rules
5. **Validate & commit** - Test and commit in batches

Ready to test with Gate 22?

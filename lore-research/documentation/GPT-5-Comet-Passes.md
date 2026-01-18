Short answer: it’s a strong start, but it’s **too big for one Comet run**. You’ll get better citations and fewer hallucinations by splitting it into 2–3 small passes (then letting Claude merge → YAML). Below are drop-in prompts you can paste into Comet + a trimmed single-shot you can use when you need it fast.

---

```md
# Comet → Claude flow for Gate 1

## PASS A — Canonical HD/GK/I Ching (concise, highly citable)
Return JSON only.

Research “Human Design Gate 1”.

Requirements:
- Pull Ra Uru Hu’s meaning (1–2 sentences) with page/section.
- Pull Gene Keys (shadow, gift, siddhi) with page/section.
- I Ching Hexagram 1: name + brief meaning + why it maps to Gate 1.
- Quotes ≤25 words; include page/section; use "unknown" if missing.

Output (JSON only):
{
  "gate": 1,
  "gate_name": "…",
  "hd_meaning": "…",
  "gene_keys": { "shadow": "…", "gift": "…", "siddhi": "…" },
  "i_ching_parallel": { "hexagram": 1, "name": "…", "meaning": "…", "relevance": "…" },
  "citations": {
    "primary": [{ "title":"…","author":"…","year":1994,"page":"…","url":"…","quote":"≤25 words" }],
    "secondary": [{ "title":"…","author":"…","year":2009,"page":"…","url":"…","quote":"≤25 words" }]
  },
  "notes": "unknown|brief"
}
```

```md
## PASS B — Ancient wisdom parallels (targeted, not spray-and-pray)
Return JSON only.

Task: For the archetype described in PASS A (Gate 1), find **best-fit** ancient parallels (max 6 items total) from:
- Egyptian/Thothian (Emerald Tablets, Book of the Dead, Pyramid Texts, Hermetica)
- Chinese/Taoist (I Ching #1 is mandatory; Tao Te Ching if relevant)
- Vedic/Hindu (Rig Veda, Gita, Upanishads)
- Indigenous (Hopi, Dogon, Aboriginal Seven Sisters, Cherokee/Mayan star lore)
- Greek/Mystery Schools (Orphic, Plato, Pythagoras)
- Sumerian/Mesopotamian (Enuma Elish, Gilgamesh, Sumerian King List)

Rules:
- Prefer **one solid citation per tradition** over many weak ones.
- Quotes ≤25 words with page/section; "unknown" if unavailable.
- If no clean match in a tradition, omit it (don’t force it).

Output (JSON only):
{
  "gate": 1,
  "ancient_wisdom_connections": [
    {
      "source_type": "egyptian|chinese|vedic|indigenous|greek|sumerian",
      "text": "Emerald Tablets|I Ching|Rig Veda|…",
      "connection": "Specific archetype parallel in ≤2 sentences",
      "quote": "≤25 words or 'unknown'",
      "page_or_section": "… or 'unknown'",
      "url": "… or 'unknown'"
    }
  ],
  "contradictions": ["…"] ,
  "notes": "unknown|brief"
}
```

```md
## PASS C — Star system alignments (tight, evidence-tagged)
Return JSON only.

Task: Using PASS A (HD/GK/I Ching) + PASS B (ancient parallels), map Gate 1 to candidate star systems:
- Sirius, Pleiades, Orion Light/Osirian, Arcturus, Andromeda, Lyra, Draco, Zeta Reticuli.

Rules:
- 3–5 alignments max.
- Mark confidence: high|medium|low|speculative.
- Tag evidence_type per alignment: explicit|thematic|cross_cultural|inferred.
- Include 2–3 sources per alignment (mix ancient + modern esoteric when possible).
- Quotes ≤25 words; page/section if available; "disputed": true if controversial.

Output (JSON only):
{
  "gate": 1,
  "star_system_alignments": [
    {
      "system": "Sirius|Pleiades|Orion Light|Arcturus|Andromeda|Lyra|Draco|Zeta",
      "confidence": "high|medium|low|speculative",
      "evidence_type": "explicit|thematic|cross_cultural|inferred",
      "primary_rationale": "2–3 sentences tying Gate 1 essence to this system’s signature.",
      "ancient_support": ["…","…"],
      "modern_support": ["…","…"],
      "cross_cultural_pattern": "… or 'unknown'",
      "sources": [
        { "title":"…","author":"…","year":…,"source_type":"ancient|channeled|research|indigenous","quote":"≤25 words","page":"…","url":"…","disputed":false }
      ]
    }
  ],
  "mind_blowing_connections": ["…"],
  "contradictions": ["…"],
  "notes": "unknown|brief"
}
```

```md
## (Optional) SINGLE-SHOT (when you need it fast)
Return **JSON only** that matches this shape. Keep it concise and well-cited.

Include:
- PASS A core (HD/GK/I Ching)
- PASS B best 4–6 ancient parallels total
- PASS C 3–5 star alignments with confidence + evidence_type, 2–3 sources each
- Quotes ≤25 words; page/section when possible; "unknown" if missing

{ 
  "gate": 1, "gate_name":"…", "hd_meaning":"…",
  "gene_keys": { "shadow":"…","gift":"…","siddhi":"…" },
  "i_ching_parallel": { "hexagram":1,"name":"…","meaning":"…","relevance":"…" },
  "ancient_wisdom_connections":[ { "source_type":"…","text":"…","connection":"…","quote":"…","page_or_section":"…","url":"…" } ],
  "star_system_alignments":[ { "system":"…","confidence":"…","evidence_type":"…","primary_rationale":"…","ancient_support":["…"],"modern_support":["…"],"cross_cultural_pattern":"…","sources":[{ "title":"…","author":"…","year":…,"source_type":"…","quote":"…","page":"…","url":"…","disputed":false }] } ],
  "mind_blowing_connections":[ "…" ],
  "contradictions":[ "…" ],
  "notes":"…"
}
```

---

## Why this beats your original single mega-prompt

- **Smaller passes = better citations.** Comet is more accurate when each ask is narrow.
    
- **Token-safe.** Avoids hitting length limits or devolving into prose.
    
- **Claude-friendly.** Each JSON drops neatly into `research/inputs/gates/gate-1.*.json`, then Claude runs the SOP you set up to emit YAML, run QA, and update coverage.
    

Use PASS A → PASS B → PASS C for Gate 1, then repeat the same trio for Gates 2–64. When you’re in a hurry, use the single-shot prompt.
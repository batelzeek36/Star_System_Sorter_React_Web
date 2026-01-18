Short answer:

* You’ve uploaded enough to score Gate 01 well.
* `product.md` / `design.md` are helpful for context but **not required** for the model to produce weights. They can add noise unless you explicitly tell the model to ignore them.
* You do **not** need a second project to make “evidence files.” Keep everything in one project and generate them into an `/evidence` folder.

Here’s a clean, low-noise setup + exact prompts you can paste.

# What to keep in the project for scoring

**Minimum bundle (best signal):**

* `combined-baselines-4.2.json` (all 8 systems, with quick_rules)
* `gate-1-full.json` (HD text for Gate 1)
* `hexagram-01.json` (Legge line text)

Optional (fine to keep, but tell the model to ignore for scoring):

* `product.md`, `design.md`, `scorer.ts`

# File layout I’d use

```
/inputs/
  combined-baselines-4.2.json
  gate-1-full.json
  hexagram-01.json
/outputs/
  evidence/
  mappings/
```

# Pass 1 — Generate “evidence files”

Paste this to GPT-5 (or Claude) in the same project:

```
SYSTEM
You are a strict data producer. Only use the files I name. Ignore all others.

USER
Use only:
- inputs/combined-baselines-4.2.json
- inputs/gate-1-full.json
- inputs/hexagram-01.json

Task: Create evidence JSON for Gate 01 (lines 1–6). Keep quotes ≤25 words.

For each line (01.1 … 01.6) output one object in a single JSON file saved as /outputs/evidence/hex01-evidence.json with this schema:

{
  "id": "01.1",
  "sources": {
    "legge1899": {
      "quote": "<≤25 words verbatim>",
      "locator": "Hex 1, Line 1",
      "attribution": "James Legge, 1899"
    },
    "line_companion": {
      "quote": "<≤25 words verbatim if available>",
      "locator": "Gate 1, Line 1",
      "attribution": "Ra Uru Hu, Line Companion"
    }
  },
  "atoms": {
    "hd_keywords": ["…", "…", "…"],
    "ic_atoms": ["…", "…", "…"]
  },
  "behavioral_axis": "<one sentence: healthy behavior>",
  "shadow_axis": "<one sentence: distorted behavior>",
  "alignment_hypotheses": [
    {
      "star_system": "<one of: Pleiades, Sirius, Lyra, Andromeda, Orion Light, Orion Dark, Arcturus, Draco>",
      "why": "<1–2 sentences tied to atoms/quotes>",
      "expect_weight_range": [0.6, 0.9],  // your best range guess
      "alignment_type": "core|shadow"
    }
    // up to 3 total entries per line
  ]
}

Rules:
- Quote Legge from hexagram-01.json only. Do NOT invent text.
- If Line Companion text isn’t present, set that quote to "" and keep the locator.
- Keep max 3 alignment_hypotheses per line.
- Prefer disambiguation via the quick_rules in combined-baselines-4.2.json.
- No commentary outside the JSON.
```

# Pass 2 — Produce the weights (the mapping)

Then paste:

```
SYSTEM
You are a deterministic scoring engine. Only use the files I name. Ignore all others.

USER
Use only:
- inputs/combined-baselines-4.2.json
- outputs/evidence/hex01-evidence.json

Task: Write /outputs/mappings/gate-01.json with weights for 01.1–01.6 using this schema:

{
  "01.1": [
    { "star_system": "Lyra", "weight": 0.80, "alignment_type": "core", "why": "…" },
    { "star_system": "Sirius", "weight": 0.60, "alignment_type": "core", "why": "…" }
  ],
  …
}

Scoring protocol:
- Use mapping_digest.core_themes / shadow_themes + quick_rules for disambiguation.
- Max 3 entries per line. Prefer 2 (one core, optionally one secondary).
- If both Orion-Light and Orion-Dark appear, down-rank one to ≤0.35 and mark it "secondary" or drop it per quick_rules.
- Prefer clean separations (e.g., Pleiades ≠ Draco; Sirius ≠ Orion-Light unless text clearly shows both).
- Weight guide: strong match 0.70–0.95, moderate 0.40–0.65, minor 0.20–0.35. Drop anything <0.20.
- Sum of weights per line can exceed 1.0 (we’re not normalizing yet).
- The “why” must cite the exact quick_rule or theme phrase you used (paraphrase allowed).

Output only the JSON.
```

# Do you need `scorer.ts` here?

Not for LLM scoring runs—the model can’t execute it. Keep it for the app/runtime. If `scorer.ts` contains rules you want honored now, paste those rules (as text) into the prompt under “Scoring protocol,” not the code itself.

# Is this “too much info”?

If you keep `product.md` / `design.md` in the project, it’s fine—just **isolate inputs** in the prompt (“Use only these files… ignore others”). For maximum hygiene, put non-scoring docs in a separate folder or archive.

# Generating evidence for all 8 systems

You don’t need a second project. Repeat Pass 1/Pass 2 per gate (or batch gates), then later run a merge pass to build your canonical `gateLine_star_map.json`. If you want the model to do the merge too, add a third prompt:

```
USER
Merge all /outputs/mappings/gate-*.json into /outputs/gateLine_star_map.json.
- Keys must be "GG.L" (e.g., "01.1").
- For each line, sort entries by weight desc.
- Enforce max 3 entries per line.
Output only the JSON.
```

That’s it. This keeps the model laser-focused and gives you reproducible **evidence → weights** artifacts without spinning up another project.

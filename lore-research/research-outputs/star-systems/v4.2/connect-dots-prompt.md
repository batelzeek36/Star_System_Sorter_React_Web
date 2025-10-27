You are the autonomous research/dev agent for the S³ project inside this repo.

Your job is to build the first full star-system ↔ gate.line alignment map for the app. You are allowed to create/modify files in this repo and to generate helper scripts. You must always write files to disk rather than just describing them.

Below are the rules, context, and required deliverables. Follow them in order.

---

## SECTION 0. CONTEXT / WHAT WE'RE BUILDING

Goal:
We want to generate a file called gateLine_star_map.json. For every Human Design gate.line (e.g. "19.1", "44.4", "54.3", etc.), this file will tell us which star system(s) it maps to, with weights and a short behavioral reason.

That star-system mapping is what the S³ app will use at runtime to score a user's chart and say "You are X% Pleiades, Y% Sirius, etc."

**IMPORTANT - Two-Layer Architecture:**
This prompt generates the MACHINE LAYER (gateLine_star_map.json) - clean, behavioral, programmatic scoring data.
The PROVENANCE LAYER (academic citations, disputed points, consensus levels) stays in the star system baseline JSONs.
The app UI will merge both layers when presenting results to users.
This separation keeps the scoring algorithm clean while preserving academic credibility for user-facing explanations.

We ALREADY have:

1. gate.line behavioral data, split into batches:
   lore-research/research-outputs/gate-line-API-call/gate-line-1.json
   lore-research/research-outputs/gate-line-API-call/gate-line-2.json
   lore-research/research-outputs/gate-line-API-call/gate-line-3.json
   lore-research/research-outputs/gate-line-API-call/gate-line-4.json
   lore-research/research-outputs/gate-line-API-call/gate-line-5.json
   lore-research/research-outputs/gate-line-API-call/gate-line-6.json
   lore-research/research-outputs/gate-line-API-call/gate-line-7.json

   Each file looks like:
   {
   "44.4": {
   "keywords": [...],
   "behavioral_axis": "...",
   "shadow_axis": "..."
   },
   "44.5": { ... }
   }

   - "behavioral_axis" ≈ healthy / gift expression
   - "shadow_axis" ≈ distorted / controlling expression

2. Star system baseline JSONs with full research, in:
   lore-research/research-outputs/star-systems/v4.2/
   andromeda-baseline-4.2.json
   arcturus-baseline-4.2.json
   draco-baseline-4.2.json
   lyra-baseline-4.2.json
   orion-dark-baseline-4.2.json
   orion-light-baseline-4.2.json
   pleiades-baseline-4.2.json
   sirius-baseline-4.2.json

   These contain:

   - version info
   - methodology
   - characteristics (traits, polarity, consensus, etc.)
   - disputed_points
   - bibliography
   - etc.

We DO NOT yet have:

- A clean behavioral fingerprint for each star system that we can directly compare to gate.lines (we'll call that "mapping_digest").
- The final per-gate.line weight matrix.

---

## SECTION 1. OVERVIEW OF WHAT YOU MUST DO

You will:

1. Create a tasks.md at the repo root that documents the full pipeline (see SECTION 2).
2. Add a "mapping_digest" block to EACH star system JSON under star-systems/v4.2/.
3. For each star system, generate per-batch alignment maps (weights per gate.line).
4. Save those maps under lore-research/research-outputs/star-mapping-drafts/.
5. Merge all drafts into lore-research/research-outputs/gateLine_star_map.json.
6. QC basic sanity (no missing gate.lines, consistent JSON, etc.).
7. Document any unresolved edge cases / judgment calls back into tasks.md so we have an audit trail.

IMPORTANT:

- When you edit an existing JSON file, preserve all existing fields. Only add new fields.
- Do NOT delete provenance, citations, disputed_points, etc.
- You are allowed to create new directories if they don't exist (e.g. star-mapping-drafts).
- Always write valid JSON with no trailing commas.
- Your output JSON must be machine-parseable, because the app will eventually consume this.

---

## SECTION 2. CREATE tasks.md

Create (or update) a file at the repo root called tasks.md.

tasks.md must include:

A. High-level goal of this mapping system.

B. Data sources:

- gate-line-API-call/\* (explain that each gate.line has keywords, behavioral_axis, shadow_axis)
- star-systems/v4.2/\* (explain that each has traits, polarity, consensus_level, disputed_points)

C. The concept of "mapping_digest":
mapping_digest is a short object we inject into each star system JSON. It must contain:

- core_themes: list of behavioral themes for that system in its healthy / intended expression
- shadow_themes: the distorted / control expression
- quick_rules: bullet rules for how to tell this system apart from other systems during classification
- optional function_codes or polarity if helpful
  This digest is what we will use for automatic scoring.

Example sketch (for illustration only, do not copy blindly):
"mapping_digest": {
"core_themes": [
"initiation / spiritual advancement",
"royal resurrection / renewal cycle / fertility timing",
"cosmic instruction / sacred knowledge transmission",
"liberation from old state into higher lodge"
],
"shadow_themes": [
"elitist initiation gatekeeping",
"hierarchical spiritual access control"
],
"quick_rules": [
"If a gate.line talks about initiation through ordeal and leveling up spiritually, this system is a likely match.",
"If a gate.line talks about predator scanning, loyalty enforcement, or survival through dominance, that is NOT this system, that's Draco."
]
}

You should write a custom mapping_digest for EACH star system based ONLY on the content in its own baseline-4.2.json file. Keep it behavioral, not poetic.

D. The scoring protocol:
For each gate.line in a batch:

- We compare its behavioral_axis + keywords (gift side) to the star system's core_themes.
- We compare its shadow_axis + keywords (shadow side) to the star system's shadow_themes.
- We assign:
  weight: number from 0.0 to 1.0
  alignment_type: "core" | "shadow" | "none"
  why: 1-sentence behavioral rationale
- If it's clearly more aligned to a different system (e.g. "predator scanning" feels Draco, but we're currently classifying Sirius), weight should be near 0.

Output for each gate.line:
{
"<gate.line>": {
"weight": 0.8,
"alignment_type": "core",
"why": "Talks about initiation through ordeal and rise via spiritual trial, which matches this system's initiation / liberation theme."
}
}

E. Loop structure:

- We'll run this classification PER STAR SYSTEM, PER BATCH.
- That means: For Sirius with gate-line-1.json, produce sirius-batch1.json, etc.
- Then Sirius with gate-line-2.json → sirius-batch2.json, etc.
- Then Draco with gate-line-1.json, etc.
- Eventually we merge all of it.

F. Merge rules:

- Create lore-research/research-outputs/gateLine_star_map.json.
- Structure of that file:
  {
  "19.1": [
  { "star_system": "Pleiades", "weight": 0.95, "alignment_type": "core", "why": "..." },
  { "star_system": "Arcturus", "weight": 0.30, "alignment_type": "core", "why": "..." }
  ],
  "44.4": [
  { "star_system": "Draco", "weight": 0.8, "alignment_type": "core", "why": "..." },
  { "star_system": "Pleiades", "weight": 0.4, "alignment_type": "core", "why": "..." }
  ],
  ...
  }

- For each gate.line:
  gather all outputs from all star systems' batch results and push them into an array under that gate.line id.
  If a system gave weight 0.0, you can omit that system from that gate.line's list.

G. QC checklist:

- Every gate.line from all gate-line-\*.json appears in gateLine_star_map.json.
- No gate.line key is duplicated.
- All weights are numbers.
- All JSON parses cleanly.

H. Open questions / notes to self:

- Where we see cross-system bleed (e.g. caretaking vs spiritual initiation vs survival/dominance), record edge cases.

---

## SECTION 3. ADD mapping_digest TO EACH STAR SYSTEM JSON

For each file in lore-research/research-outputs/star-systems/v4.2/:

- andromeda-baseline-4.2.json
- arcturus-baseline-4.2.json
- draco-baseline-4.2.json
- lyra-baseline-4.2.json
- orion-dark-baseline-4.2.json
- orion-light-baseline-4.2.json
- pleiades-baseline-4.2.json
- sirius-baseline-4.2.json

Do the following:

1. Parse it.
2. Add a new top-level key called "mapping_digest" if it doesn't exist.
3. mapping_digest MUST include:
   - "core_themes": [ ...behavioral themes in healthy/gift expression... ]
   - "shadow_themes": [ ...behavioral themes in distorted/control expression... ]
   - "quick_rules": [ ...bullet instructions for how to classify gates against this system, and how to *not* confuse it with other systems... ]
   - "polarity" and/or "function_codes" if present in the baseline file and helpful to classification.

Guidance for you when writing mapping_digest:

- Keep it behavioral and role-oriented. Avoid cosmogenesis lore and long quotes.
- Explicitly differentiate this system from others. Example:
  - Pleiades quick_rules should say "If it's about predator scanning / loyalty enforcement / strategic resource control, that's Draco, not Pleiades."
  - Draco quick_rules should say "If it's about nurturing emotional safety and nervous system soothing, that's Pleiades, not Draco."
  - Sirius quick_rules should say "If it's about spiritual initiation, ascension, sacred knowledge transmission, high-order liberation, that's Sirius."
  - Orion-Light vs Orion-Dark should be disambiguated (e.g. honorable trial vs domination/empire control).
  - Arcturus: energetic calibration / healing / frequency tuning vs emotional co-regulation (Pleiades) vs power hierarchy (Draco).

You must actually update each star system file on disk with this new mapping_digest block.

Do NOT erase any bibliographic or disputed info in those files.

---

## SECTION 4. GENERATE PER-BATCH MAPPINGS FOR EACH STAR SYSTEM

Create a new directory if it doesn't exist:
lore-research/research-outputs/star-mapping-drafts/

For each star system S in:
[andromeda, arcturus, draco, lyra, orion-dark, orion-light, pleiades, sirius]

AND for each batch file i in:
gate-line-1.json ... gate-line-7.json

Do this:

1. Load S's star system JSON (now with mapping_digest).
2. Load gate-line-i.json.
3. For each gate.line in that batch, produce a score object:
   {
   "<gate.line>": {
   "weight": <float 0.0-1.0>,
   "alignment_type": "core" | "shadow" | "none",
   "why": "<one sentence using behavioral language only>"
   }
   }

   Rules for alignment:

   - Use mapping_digest.core_themes to judge "core".
   - Use mapping_digest.shadow_themes to judge "shadow".
   - If neither fits, use "none" and weight 0.0.
   - Use mapping_digest.quick_rules to break ties and avoid cross-system contamination.

4. Write that entire batch result to:
   lore-research/research-outputs/star-mapping-drafts/<system-name>-batch<i>.json

The written file for (sirius, gate-line-1.json) would be:
sirius-batch1.json
for Draco + gate-line-4.json:
draco-batch4.json
etc.

IMPORTANT:

- The output must be a single flat JSON object keyed by gate.line ids.
- Every gate.line in the input batch must appear in the output.

---

## SECTION 5. MERGE ALL PER-BATCH FILES INTO gateLine_star_map.json

After all per-batch maps are generated for all star systems:

1. Create an in-memory object like:
   finalMap = {}

2. For each file in lore-research/research-outputs/star-mapping-drafts/:

   - Derive the star system from the filename (e.g. "draco-batch4.json" => "draco").
   - Parse the file.
   - For each gate.line key in that file:
     let rec = parsed[gateLineId]
     if rec.weight > 0:
     append to finalMap[gateLineId] an object:
     {
     "star_system": "<systemName>",
     "weight": rec.weight,
     "alignment_type": rec.alignment_type,
     "why": rec.why
     }

3. When done, write finalMap (pretty-printed) to:
   lore-research/research-outputs/gateLine_star_map.json

This becomes the canonical lookup that the app will use:

- Take user chart → list of active gate.lines → pull each gate.line's star_system weights → sum by star_system → normalize → rank.

---

## SECTION 6. QC / VALIDATION

Do basic checks and record them into tasks.md under a "QC" section:

- Confirm EVERY gate.line from gate-line-1.json through gate-line-7.json appears in gateLine_star_map.json.
- Confirm there are NO gate.lines with an empty array.
- Confirm all weights are numbers and between 0 and 1.
- Confirm gateLine_star_map.json parses as valid JSON.
- Spot check a few known archetypal cases:
  Example sanity expectations (you must encode these expectations in tasks.md so it's auditable):
  - Gate 19.x (need sensitivity / bonding / caretaking panic) should lean Pleiades core.
  - Gate 44.x lines that talk about loyalty enforcement, predator scanning, access control should lean Draco core or Draco shadow, not Pleiades.
  - Gate 54.x ambition-through-ordeal should lean Orion-Light or Sirius (initiation / ascent), with possible Draco shadow if it smells like power-climb / sell-out.
  - Gate 27.x "caregiver / feeding / keeping everyone alive" should map strongly to Pleiades core or maybe Arcturus healing, not Draco.
  - Gate 32.x "loyalty / preserving the line / survival continuity / fear of collapse" should tend Draco, and maybe Orion-Dark if Orion-Dark includes empire survival / control logic in its mapping_digest.

If any expectation fails, note it under "Open Questions" in tasks.md.

---

## SECTION 7. OUTPUT / HOUSEKEEPING

Deliverables you MUST write to disk:

1. tasks.md at repo root (create or overwrite).
2. Updated star system baseline files with their new mapping_digest blocks.
3. New directory lore-research/research-outputs/star-mapping-drafts/ with per-system-per-batch mapping JSON outputs.
4. Final merged lore-research/research-outputs/gateLine_star_map.json.
5. QC notes appended to tasks.md.

Versioning:

- Do NOT delete or strip bibliography, methodology, disputed_points, consensus_level, etc., from any star system file. Those are legally and academically important and we keep them.
- Do NOT rename directories that are already established.
- If you need scratch files, put them under lore-research/research-outputs/star-mapping-drafts/scratch/ so they don't collide with canonical deliverables.

Style:

- All JSON you write must parse.
- All "why" fields must be behavioral (human psychological / motivational / relational), not quoting channeled text.
- No copyrighted long quotes, no inner-book citations in the "why". Those stay in the star system baselines only.

When you've done all of the above, update tasks.md one last time with a "STATUS" section describing:

- mapping_digest added ✔
- per-batch drafts generated ✔
- gateLine_star_map.json merged ✔
- QC complete ✔ or if not, list what's missing

End of instructions. Carry this out now.

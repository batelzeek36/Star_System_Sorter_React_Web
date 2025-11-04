Here’s a universal steering doc you can hand to any model (Claude, etc.) before it edits ANY of the star system batch files (Andromeda, Draco, Pleiades, etc.). It generalizes the method so it works for all systems, not just Andromeda.

You can paste this once and reuse.

---

## STAR SYSTEM MAPPING: UNIVERSAL STEERING DOC

### Objective

You are cleaning the `*-batchN.json` draft files for each star system so they correctly map Human Design gate.lines (e.g. `"18.4"`) to that star system.

### Source Priority (DO NOT DEVIATE)

When deriving behavior for any gate.line, use sources in THIS order:

1. `s3-data/Line Companion_djvu.txt` **or** `s3-data/Line Companion.epub`
   - Prefer the version that has already been normalized into:
     - `lore-research/research-outputs/line-companion/normalized.txt`

2. If line is missing/garbled in Line Companion → fall back to **I Ching hexagram** text from:
   - `s3-data/236066-The I Ching_djvu.txt`
   - `s3-data/236066-The I Ching_page_numbers.json` (for locator only)

3. If still missing → mark this line as:
```json
{
  "citation_status": "provisional",
  "missing_source": "line_companion + i_ching",
  "note": "human review required"
}
```

**You MUST NOT invent, paraphrase, or "Ra-ify" a line that is missing from the sources above.**

For each gate.line in the batch, you will:

1. Read that gate.line’s behavioral meaning from the corresponding `gate-line-API-call/gate-line-<X>.json` file.
2. Compare that behavior to this star system’s `mapping_digest` (core_themes, shadow_themes, quick_rules).
3. Output a block like this:

```json
"<gate>.<line>": {
  "weight": <number between 0.0 and 1.0>,
  "alignment_type": "core" | "secondary" | "none",
  "why": "<1-sentence behavioral explanation>"
}
```

You must do this for **every** gate.line in the batch file.

---

## Definitions

### weight

* A real number between 0.0 and 1.0.
* `0` means “this gate.line does NOT belong to this star system.”
* Nonzero means “this gate.line matches this star system,” with higher = stronger match.

Guidance:

* Strong, explicit, unmistakable match to this system’s core behavior: `0.4 – 0.7`
* Clear but situational match: `0.2 – 0.4`
* Weak / partial / secondary flavor: `0.1 – 0.25`
* No match at all: `0`

Never assign a nonzero weight if it doesn’t actually match the star system.

### alignment_type

* `"core"` if the gate.line is expressing the system’s healthy / high expression / functional pattern.
* `"shadow"` if the gate.line is expressing the system’s distorted / wounded / compensatory / unhealthy expression.
* `"none"` if weight is 0.

The system’s own baseline file (star system v4.2) will tell you what its core_themes and shadow_themes are. Use those exact meanings.

Example logic:

* If a line shows “restoring sovereignty, intervening against exploitation,” that’s Andromeda core.
* If a line shows “caretaking everyone’s nervous system so nobody falls apart,” that’s Pleiades core.
* If a line shows “predator scanning / enforcing loyalty / gatekeeping access to protect the tribe through dominance,” that’s Draco core.
* If a line shows “cleaning trauma static out of the field / frequency repair / energetic recalibration,” that's Arcturus core.
* If a line is chasing status through ordeal/initiation, “prove yourself through trial,” “catalyze transformation through crisis,” that can be Sirius or Orion-Light core (initiation / ascent through ordeal).
* If a line shows exploit/control/manipulation for gain, social climbing through domination, coercive hierarchy, that can sit in Draco shadow or Orion-Dark shadow depending on that system’s mapping_digest.

You MUST use the star system you are currently working on. Don’t assign Draco logic when you’re editing a Pleiades batch file, etc.

### why

A single sentence that:

1. Describes the gate.line’s real interpersonal/psychological behavior in plain language.

   * Use the `behavioral_axis` and `secondary_axis` from the `gate-line-API-call` file.
   * Do NOT write lore. Write behavior (“what this person actually does in human terms”).
2. Explains why that behavior is (or is not) this star system.

The `"why"` is not allowed to be generic boilerplate like “This is not about X so it’s not Y.” You have to name the actual behavior.

---

## The workflow per gate.line

For each `<gate>.<line>`:

1. Look up that line in `gate-line-API-call/gate-line-<gate>.json`

   * Pull out the `behavioral_axis` and `secondary_axis`.
   * This tells you what that line *does socially / psychologically / somatically.*

#### Hexagram Cross-Check (to prevent semantic drift)

Before deciding the star system match, confirm that the HD gate you're evaluating is consistent with its **I Ching hexagram** sibling in `/s3-data/hexagrams/*.json`.

- If the wording between Line Companion and the hexagram file is materially different (different actor, different posture, different lesson), prefer the wording in `/s3-data/hexagrams/*.json`.
- If both are close → keep Line Companion wording, but set:

```json
"source_alignment": "line_companion+hexagram"
```

This is required so later correlations (HD → hexagram → star system) do not drift.

2. Compare that behavior to THIS STAR SYSTEM’S archetype:

   * Use this system’s `core_themes` and `shadow_themes` from its baseline.
   * Use `quick_rules` to avoid mixing it with a different system.

3. Decide which case you're in:

   **Case A: Strong match to system CORE**

   * The behavior IS the star system’s healthy function.
   * Example patterns by system:

     * Andromeda core: confronts exploitation, protects sovereignty, challenges abusive control.
     * Pleiades core: nurtures, feeds, holds, regulates safety for the nervous system / attachment safety.
     * Draco core: scans for threat, controls access, enforces loyalty, protects survival through dominance and resource control.
     * Arcturus core: cleans trauma static, stabilizes a chaotic field, restores functional signal, “frequency repair.”
     * Sirius / Orion-Light core: initiates transformation through ordeal, catalyzes growth via crisis, rites-of-passage energy.
   * Action:

     * Give a nonzero weight (often 0.4–0.7).
     * `alignment_type: "core"`.
     * `"why"`: “<Behavior in human terms> … which expresses <star system> core.”

   **Case B: Strong match to system SHADOW**

   * The behavior matches this system’s wounded/distorted expression.
   * Example patterns by system:

     * Andromeda shadow: martyr witness, “I carry the injustice and wait for rescue,” passive suffering, righteous blame with no intervention.
     * Pleiades shadow: panic-attachment, codependency, smothering care, self-erasure to keep closeness.
     * Draco shadow: coercive loyalty, domination to secure status, “obey or you’re out,” weaponized access.
     * Arcturus shadow: cold clinical detachment, treating people like energy problems instead of humans, sterilizing instead of healing.
     * Orion-Dark shadow: predatory exploitation, using hierarchy as a feeding mechanism, status-feeding off others’ vulnerability.
     * Sirius / Orion-Light shadow: forcing tests/ordeals on others to prove worth, spiritualizing suffering to justify power ladders.
   * Action:

     * Give a nonzero but usually lower weight (0.1–0.3).
     * `alignment_type: "shadow"`.
     * `"why"`: “<Behavior in human terms> … which is <star system> shadow.”

   **Case C: Not this system**

   * The behavior belongs to a *different* system or is neutral.
   * Action:

     * `weight: 0`
     * `alignment_type: "none"`
     * `"why"`: describe the actual behavior and explicitly say which energy it really belongs to (if obvious), so we prevent contamination.

   Example “none” with redirect:

   * `"why": "Soothes panic and keeps everyone emotionally safe and bonded, which is Pleiadian nervous-system caretaking, not Draco-style control or Andromeda-style sovereignty defense — not a match here."`
   * `"why": "Enforces resource access and loyalty to protect the group’s survival, which is Draco dominance/survival logic, not Pleiadian nurture — not a match here."`
   * `"why": "Publicly calls out abusive patterns so the group can’t pretend it’s fine, which is Andromeda liberation work, not Arcturian frequency repair — not a match here."`
   * `"why": "Initiates people through ordeal and frames crisis as a rite of passage, which is Sirius / Orion-Light initiation current, not Pleiadian soothing — not a match here."`

That redirect language is REQUIRED. We need those redirects because later we’ll build a merged `gateLine_star_map.json` and want to see, at a glance, “oh, this line is actually Pleiades-coded, not Draco,” etc.

---

## Weight selection details

* If the line description is basically the star system’s flagship function, go higher (0.5–0.7).

  * Example: Draco core = “I scan for threats, control who gets in, and enforce loyalty to keep us alive.”
    A line that literally does that should be ~0.6.

* If the line reflects the system but only at a personal/micro/conditional level (like self-boundary or early-stage version), go mid/low (0.2–0.4).

* If the line is mostly another system but touches this one lightly, it can still be `0` for this system.
  DO NOT give sympathy points. If it’s not this system, it gets `0`.

* A line can map to this system’s SHADOW with a real number.
  Shadow expressions still count as alignment. Shadow is still alignment.

* Never assign nonzero weight to “none.”
  If `weight` is not `0`, `alignment_type` cannot be `"none"`.

---

## Style rules you MUST follow

1. **Do not reuse generic boilerplate across every line.**
   Each `"why"` must be specific to that gate.line’s behavior.

2. **Do not write lore-only sentences.**
   The `"why"` must sound like a real psychological / interpersonal behavior.

   * GOOD: “Uses guilt and emotional panic to keep people close and becomes the one responsible for everyone’s needs.”
   * BAD: “Carries the ancient frequency of Pleiadian womb-light.”

3. **Do not invent new metaphysics for the gate.line that is not in the gate-line file.**
   You are allowed to interpret the behavior in terms of the star system, but you cannot rewrite the behavior itself.

4. **No filler weights.**
   It's allowed (and expected) that most gate.lines in a batch will get `0` and `"none"`.
   If it doesn’t match this system, leave it zero.

5. **Respect ‘quick_rules’ from the star system baseline.**
   Example patterns we already enforce globally:

   * Emotional soothing / feeding / bonding panic → Pleiades, NOT Andromeda or Draco.
   * Predator scanning / access control / loyalty enforcement → Draco, NOT Pleiades.
   * Healing via light / frequency repair / trauma field cleanup → Arcturus, NOT Pleiades bonding.
   * Liberating someone from exploitation / restoring sovereignty / anti-domination ethics → Andromeda, NOT Draco.
   * Status climb / ordeal-initiation / “prove yourself through crisis to ascend” → Sirius / Orion-Light, NOT Pleiades.
   * Exploit/enslave / hierarchical predation / weaponized leverage → Orion-Dark or Draco secondary, NOT Andromeda core.

If a line matches one of these lanes, score it accordingly.

---

## Final sanity requirements before you hand off the batch

For the batch you’re producing (e.g. `draco-batch4.json`, `pleiades-batch6.json`, etc.):

* Every gate.line object must include `weight`, `alignment_type`, and `why`.
* Every `why` must mention the specific behavior of that gate.line in human terms.
* If `weight` is `0`, `alignment_type` MUST be `"none"`.
* If `weight` is nonzero, `alignment_type` MUST be `"core"` or `"secondary"`.
* If you mark `"none"`, you should still route it verbally: clarify which system’s vibe it actually is, if that’s obvious from the behavior (Draco vs Pleiades vs Andromeda etc.). This prevents cross-system contamination later.
* Do not assign multiple star systems in the JSON here. This batch is only for THIS star system. You’re just naming other systems in the `"why"` for clarity, not mapping them here.

---

## Example (generic template)

Imagine we’re working on Draco and we’re evaluating gate.line X.Y. The line behavior is:

* “Scans for threat, controls who gets access, enforces loyalty so the tribe survives.”

Correct output for Draco:

```json
"X.Y": {
  "weight": 0.6,
  "alignment_type": "core",
  "why": "Constantly scans for threat, restricts access, and enforces loyalty to protect the group’s survival, which is predator-guard / resource-control survival strategy — Draco core."
}
```

Now imagine we’re STILL working on Draco, but the line is actually pure Pleiades caregiving:

```json
"Z.W": {
  "weight": 0,
  "alignment_type": "none",
  "why": "Soothes emotional panic and tries to keep everyone bonded and safe through nurture, which is Pleiadian nervous-system caretaking, not Draco-style survival-through-control — not Draco."
}
```

That’s the standard.

Follow this, line by line, for the rest of the star system batch files.


---

## Source Verification Requirements

* Any gate.line whose source could not be confirmed MUST be listed in `lore-research/research-outputs/BAD_LINES.md` with:
  - gate
  - line
  - source tried
  - short reason
* Old auto-generated files:
  - `lore-research/research-outputs/line-companion/gate-lines.json`
  - `lore-research/research-outputs/line-companion/gates.json`
  - `lore-research/research-outputs/line-companion/quotes.json`
  are considered **non-authoritative** and MAY be deleted or ignored.

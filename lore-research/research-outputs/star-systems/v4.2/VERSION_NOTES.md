# VERSION_NOTES.md

Star System Sorter — Baseline Research Schema
Global Standard: Version 4.2

## Purpose

This document defines **Version 4.2**, which is now the required standard for all future star system baseline files (Sirius, Arcturus, Pleiades, Orion Light / Orion Dark, Draco, etc.).

The goals of v4.2 are:

* academic defensibility (traceable sourcing, transparent controversy handling),
* machine usability (deterministic scoring and filtering),
* mythic honesty (we preserve spiritual / initiatory material without disguising it as archaeology).

All future baselines must comply with the requirements below.

---

## 1. Source Standards

### 1.1 Forbidden Sources

The following source types are **not allowed** in any v4.2-compliant file:

* Personal blogs / Medium posts / random websites
* Goodreads / retail product pages / marketing blurbs
* Spiritual school sales pages
* Wikipedia
* Anonymous “committee” translations with no named human translator
* Channelled / psychic PDFs with no verifiable publisher imprint

These appeared in earlier versions (v4.0 and earlier) and are now banned.

### 1.2 Allowed Sources

To be included, a source MUST meet at least one of the following criteria:

* A publisher-backed book with an ISBN (or with a legacy/catalog identifier if pre-ISBN era)
* A recognized imprint or press (e.g. university press, Lucis Publishing Company, Theosophical Publishing Company)
* A peer-reviewed journal article / academic paper
* An ancient / classical / premodern text with:

  * a named human translator or editor,
  * and a publisher or imprint

Special treatment:

* Theosophical / Lucis Trust style works (e.g. Blavatsky, Bailey) **are allowed** even though they are metaphysical/channeled, because they are produced and distributed by stable, attributable publishers/imprints.
* Modern “received transmissions” with no imprint are not allowed.

### 1.3 Controversial Sources

Material that is widely challenged (for example: alien contact claims, advanced off-world genetics, etc.) **may** be included if:

* It meets the publisher/imprint rule above,
* AND it is clearly annotated as controversial in the data model (see Sections 4 and 5).
  We do not delete controversy. We quarantine it with structure.

---

## 2. Required Fields for Each Source Object

Every source listed under a trait (in `characteristics[*].sources`) and every source referenced in `disputed_points` MUST include the following fields:

* `title`

* `author`

* `translator_or_editor`

  * `null` if not applicable
  * REQUIRED (not null) for ancient / classical texts

* `edition`

* `year`

  * The year of the specific edition being cited / accessed

* `original_year`

  * The first publication year of that work or translation
  * If unknown or identical, repeat `year`

* `publisher`

* `url`

  * Plain string only, not Markdown `[text](url)`

* `isbn`

  * Use `null` if not applicable (journals, pre-ISBN, archival scans)

* `source_type`

  * One of:

    * `"ancient"` (primary translated premodern text, e.g. Pyramid Texts, Avesta, etc.)
    * `"research"` (peer-reviewed, academic, ethnography, historiography, astronomy)
    * `"channeled"` (esoteric / initiatory / metaphysical material published by a known imprint)
    * `"controversial"` (publisher-backed but widely disputed claims, e.g. ancient alien contact narratives)

* `citation_status`

  * `"locked"` or `"provisional"`

* `citation_status = "locked"` means:

  * You provide a direct quote from the source (≤ 25 words),
  * AND a concrete locator (`page`, `section`, `utterance`, etc.).

* `citation_status = "provisional"` means:

  * You provide `location_hint` + `summary` instead of a direct quote / locator that you can prove,
  * because you cannot or should not reproduce verbatim text at this time.

* `astronomical_component`

* `component_reasoning`

These last two are explained in Section 3.

If any of these fields are missing for a given source, that source is not v4.2 compliant.

---

## 3. Astronomical Component Classification

### 3.1 Definition

Every source MUST include:

```json
"astronomical_component": "A" | "B" | "G" | "H" | "unspecified"
"component_reasoning": "string"
```

This forces us to say **which aspect of the star system** the source is talking about.

### 3.2 Meanings

* `"A"`

  * The visibly observable, historically attested stellar body (e.g. Sirius A / Sopdet / Tishtrya)
  * Themes: calendrical timing, agricultural fertility, kingship, resurrection rites, publicly visible heliacal rising, rain-bringing, seasonal markers

* `"B"`

  * A hidden or controversial companion object (e.g. Sirius B, alleged hidden companion stars, “invisible” bodies, white dwarfs known only to initiates)
  * Themes: “secret star,” off-world genetic engineers, alien contact, advanced tech lore, disputed ethnography

* `"G"`

  * Gateway / portal / transit function
  * Themes: soul-waypoints, stargates, reincarnation routing, cosmic checkpoints, “afterlife corridor,” passage of consciousness between systems
  * Often appears in Arcturus-style material

* `"H"`

  * Healing / restoration / vibrational recalibration / softening / frequency repair
  * Often appears in Pleiadian-style or “frequency medicine / heart-tone” narratives

* `"unspecified"`

  * References to “the [star system]” at a system/lodge/council/cosmic-governance level, where no explicit sub-component is named
  * Themes: White Lodge / High Council / cosmic mind / spiritual hierarchy / universal law transmission / “source of manas” / “overseer civilization”

### 3.3 Rationale

* `astronomical_component` lets downstream logic and UX say:

  * “Show me only traits tied to visible, archaeologically anchored phenomena (`A`)”
  * “Show me disputed high-contact lore (`B`) but warn me it’s low consensus”
  * “Show me esoteric initiatory gate/oversoul content (often `G`, `H`, or `unspecified`)”
* `component_reasoning` requires us to say WHY we gave that classification so no one can fudge it.

---

## 4. Trait / Characteristic Objects

Each entry in the `"characteristics"` array in the baseline file represents one thematic trait associated with the star system.

**Every characteristic MUST include:**

* `trait`
  Human-readable label for the theme.

* `consensus_level`
  `"high" | "medium" | "low"`
  How widely repeated / culturally reinforced the claim is across qualified sources.

* `ancient_support`
  `"high" | "medium" | "low" | "unknown" | "none"`
  Does this concept appear in premodern / pre-contact / pre-20th-century material, or is it mostly modern/esoteric?

* `evidence_type`
  `"direct" | "inferred" | "symbolic"`

  * `"direct"` = the source literally states the claim
  * `"inferred"` = we derived it by stitching multiple sources that imply the same function
  * `"symbolic"` = the claim is initiatory/ritual/psycho-spiritual/metaphysical (White Lodge, cosmic love-ray, etc.)

* `disputed`
  `true | false`
  Whether the theme itself is actively challenged by credible counter-evidence.

* `polarity`
  `"neutral" | "light" | "dark"`
  Energetic framing of the trait for archetype matching.

  * `"neutral"` can include agricultural timing, kingship, duty, fertility cycles, etc.
  * `"light"` can include liberation, healing, wisdom transmission, compassion, etc.
  * `"dark"` can include domination, predatory control narratives, parasitic hierarchies, etc.

* `sources`
  Array of source objects as defined in Section 2.
  Note: different sources for the same characteristic can have different `astronomical_component` codes. That’s valid.

### Why this matters

This gives us a scoring vector per trait.
We can display or suppress traits like toggles:

* Only show `"consensus_level": "high"` AND `"ancient_support": "high"` to users who only want archaeologically grounded content.
* Allow opt-in to `"consensus_level": "low"` with `"evidence_type": "symbolic"` for users who want spiritual / metaphysical / initiatory material.
* Avoid accidentally presenting disputed `"B"`-component claims as if they were universal truth.

---

## 5. Disputed Points

Each file must include a `disputed_points` array if there are major contested narratives tied to that star system.

Each `disputed_points[*]` entry MUST include:

* `claim`
  The contested statement (e.g. “X civilization was taught by off-world beings from this star system who genetically modified humans.”)

* `supporting_sources`
  Array of source objects (Section 2) that **support** the claim.

* `counter_evidence`
  Array of source objects (Section 2) that **challenge** the claim (e.g. ethnographic restudy, alternative explanation, accusations of contamination, etc.)

* `consensus`
  Usually `"low"` for these, but we still store it explicitly.

### Purpose

We do not erase controversial narratives.
We document them, we pair them with academic/anthropological pushback, and we clearly mark consensus as low.

This protects:

* intellectual honesty,
* downstream UX (we can tag this as “highly disputed” in the app),
* and legal/academic posture.

---

## 6. Bibliography

Each baseline file MUST include a final `bibliography` block grouping sources by class, e.g.:

* `"ancient_texts"`
  Premodern/translated works anchored in antiquity or classical religious/ritual material.

* `"modern_research"`
  Peer-reviewed work, field ethnography, astronomy, anthropology, historiography.

* `"channeled_sources"`
  Esoteric / Theosophical / metaphysical / initiatory transmissions published under known imprints.

* `"academic_foundations"`
  Cross-system foundations like: I Ching scholarship, DNA codon research, Kabbalah scholarship, cosmology references, etc.
  (These anchor the meta-framework that connects Human Design / comparative mythology / cosmology.)

This bibliography anchors your citations so other people can audit lineage quickly.

---

## 7. Behavior Changes From v4.0 → v4.2

### 7.1 Structural Upgrades

* Source objects now require full provenance (publisher, edition year, original year, ISBN/null, source_type, citation_status).
* Trait objects now require analytic metadata (`consensus_level`, `ancient_support`, `evidence_type`, `disputed`, `polarity`).
* Every source must declare an `astronomical_component` plus `component_reasoning`.
* `disputed_points` is now a structured dataset (claim → supporting → counter_evidence → consensus), not a block of prose.

### 7.2 Epistemic Upgrades

* We explicitly separate:

  * Publicly visible / historically tracked functions of the star system (`A`)
  * Disputed off-world contact / tech transfer / “secret star” narratives (`B`)
  * System-level metaphysical governance, White Lodge / Hierarchy / soul transit / healing currents (`unspecified`, `G`, `H`)
* We no longer let all “star lore” blob together. Each aspect is pinned to a component code.

### 7.3 Quality / Safety Upgrades

* Low-provenance or sales-driven channelers are removed unless they meet imprint and citation standards.
* Controversial claims are not memory-holed — they’re quarantined with counter-evidence and clearly marked low-consensus.
* We can now safely serve both:

  * archaeologically anchored content (high-consensus, ancient-supported),
  * and initiatory/mythic content (symbolic, low-consensus),
    without pretending they are the same tier of evidence.

### 7.4 Archetype Mapping Upgrades

The 4.2 schema is designed for downstream personality/archetype matching:

* `polarity` allows alignment mapping (“light liberation current,” “neutral cyclical stewardship,” “dark control matrix,” etc.).
* `evidence_type` and `ancient_support` let you gate how “woo” vs “archaeology” the output is.
* `astronomical_component` lets you distinguish:

  * visible/fertility/royal-cycle stars,
  * controversial hidden companions,
  * “council / initiatory lodge / higher-order mind” system-level myths,
  * soul-gate / healing-frequency functions.

---

## 8. Implementation Requirements Going Forward

All future baseline files for ANY star system MUST:

1. Follow the v4.2 source standard (Section 2).
   No source may appear without publisher/imprint info, `citation_status`, and `astronomical_component`.

2. Follow the v4.2 trait standard (Section 4).
   Every `characteristics[*]` item must include the full analytic header:

   * `consensus_level`
   * `ancient_support`
   * `evidence_type`
   * `disputed`
   * `polarity`
   * PLUS its `sources[]` with all required source fields.

3. Use `astronomical_component` codes and `component_reasoning` everywhere (Section 3).
   Reserve `"G"` for transit/gateway themes and `"H"` for healing/frequency themes, even if a given star system doesn’t use them yet.
   This keeps the ontology stable across systems.

4. Represent disputed narratives using `disputed_points` (Section 5).
   Include both the narrative AND the academic counter-evidence, with consensus clearly labeled.

5. End with a `bibliography` block (Section 6) grouped by source class.

6. Keep URLs as plain strings, not Markdown-wrapped.

7. Use consistent `source_type` vocabulary:
   `"ancient"`, `"research"`, `"channeled"`, `"controversial"`.
   Do not invent new tags for this field.

---

## 9. Notes for Maintainers

* Do not delete a theme just because it’s controversial.
  Keep it if it matters culturally or spiritually — but mark it correctly:

  * `consensus_level: "low"`
  * `disputed: true` if there’s credible pushback
  * `evidence_type: "symbolic"` or `"inferred"` when appropriate
  * `astronomical_component` set accurately (`B`, `unspecified`, etc.)
  * Document counter-evidence in `disputed_points`.

* When a star system is associated with a “gentle civilization / non-bellicose lineage / movement-as-meditation / no ancestral war imprint” style narrative, that belongs in `characteristics` even if it only appears in modern channeled sources.
  DO NOT erase it.
  Instead, encode it with:

  * `consensus_level: "low"`
  * `ancient_support: "none"` / `"unknown"`
  * `evidence_type: "symbolic"`
  * `polarity: "light"`
  * `astronomical_component: "unspecified"`

  This preserves living mythic identity patterns users strongly resonate with, without mislabeling them as historically attested.

---

## 10. Bottom Line

**Version 4.0**: collected lore
– loosely structured, mixed provenance, harder to audit, harder to score

**Version 4.2**: forensic schema
– per-source provenance, per-trait analytics, explicit component mapping, structured dispute handling, polarity tagging, and publisher-grade admissibility

As of now, **v4.2 is the baseline standard**.
All future star system files must comply with this spec.

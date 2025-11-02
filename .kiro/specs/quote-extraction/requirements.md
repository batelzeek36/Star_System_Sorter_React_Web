# Requirements Document
**Project:** S³ (Star System Sorter) — Ra Uru Hu Line Companion Ingestion  
**Version:** 0.7 (with restored sections)  
**Date:** 2025-11-02  
**Context:** user dataset in `s3-data/` + research workspace in `lore-research/research-outputs/`

---

## 1. Introduction

This document defines the requirements for turning **Ra Uru Hu's _Line Companion_** into **tight, ≤25-word, copyright-conscious quotes** and merging them into the existing **S³ structured dataset**:

- Human Design gates (64 × 6 lines) → `s3-data/gates/`
- I Ching hexagrams (64 × 6 lines) → `s3-data/hexagrams/`
- Channels (36) → `s3-data/channels/`
- Centers (9) → `s3-data/centers/`
- Circuits (5) → `s3-data/circuits/`
- Line archetypes → `s3-data/line_archetypes/`
- Star-system baselines (8 systems, v4.2) → `lore-research/research-outputs/star-systems/v4.2/*.json`

**Goal:** a coherent, reproducible research graph where every HD gate.line has:

1. an exact Ra quote (`classical.hd_quote`, ≤25 words),
2. optional Ra **exaltation** and **detriment** (each ≤25 words),
3. citation metadata,
4. hard link to **its I Ching line**, and
5. can be scored against **all 8 star-system baselines**.

---

## 2. Scope

**In scope**

- Ingest from any of these sources (prefer normalized):
  - `lore-research/research-outputs/line-companion/normalized.txt`
  - `s3-data/Line Companion_djvu.txt`
  - `s3-data/Line Companion.epub`
  - `s3-data/Line Companion_abbyy.gz`
  - `s3-data/Line Companion_djvu.xml`
  - `s3-data/Line Companion_scandata.xml`
- Verify / tighten all 64 **I Ching hexagram** files in `s3-data/hexagrams/*.json` against **Legge 1899**.
- Merge extracted Ra content into **all 6 S³ data collections**:
  1. `s3-data/hexagrams/`
  2. `s3-data/gates/`
  3. `s3-data/channels/`
  4. `s3-data/centers/`
  5. `s3-data/circuits/`
  6. `s3-data/line_archetypes/`
- Keep / update association data so every gate.line can be used by **all 8** star-system baselines:
  - Andromeda
  - Arcturus
  - Draco
  - Lyra
  - Orion (Dark)
  - Orion (Light)
  - Pleiades
  - Sirius
- Generating validation reports.

**Out of scope (for now)**

- UI for manual review.
- Re-OCR from scratch.
- Paraphrasing or "nice-ifying" Ra.
- Translating Chinese.

---

## 3. Glossary

- **Gate.Line** — Human Design atom, e.g. `"1.1"`, `"10.3"`, `"64.6"`, total **384**.

- **Line Companion** — Ra Uru Hu source text (our **authoritative HD** source for gate/line, exaltation, detriment).

- **Hexagram file** — Public-domain I Ching representation in `s3-data/hexagrams/NN.json` (Legge-first).

- **HD gate file** — Human Design representation in `s3-data/gates/NN.json` (Ra-first).

- **Star system baseline** — v4.2 star-lore mapping file in `lore-research/research-outputs/star-systems/v4.2/`.

- **Correlation layer** — logic that connects: **hexagram → HD gate → gate.line → star-system score.**

- **Classical block** — the section in HD JSON where we put Ra's text, e.g.:

  ```json
  "classical": {
    "hd_title": "...",
    "hd_quote": "...",
    "exaltation": "...",
    "detriment": "...",
    "citation": { ... }
  }
  ```

---

## 4. Source Priority Rules

1. **Ra > everything** for HD gate/line wording.
2. **Legge 1899 > other I Ching** for hexagram wording.
3. Other translators = allowed but must be marked:
   ```json
   "citation_status": "provisional"
   ```
4. Any AI / normalized text must live in **separate** fields (`normalized_summary`, `behavioral_axis`, etc.) so it can't be confused with Ra or Legge.

---

## 5. Data Sources ("6 + 2" model)

**Core 6 S³ collections**

1. `s3-data/hexagrams/`
2. `s3-data/gates/`
3. `s3-data/channels/`
4. `s3-data/centers/`
5. `s3-data/circuits/`
6. `s3-data/line_archetypes/`

**Plus 2 control layers**

7. `s3-data/associations/*.json`
8. `s3-data/pipeline_rules/*.json`

**Requirement:** the correlation step SHALL be able to take **any object** from those 6 collections and produce star-system scores using the 8 v4.2 baselines.

---

## 6. Functional Requirements

### 6.1 Line Companion Ingestion

**FR-LC-1**
Ingest Line Companion from the first available source in this order:

1. `lore-research/research-outputs/line-companion/normalized.txt`
2. `s3-data/Line Companion_djvu.txt`
3. `s3-data/Line Companion.epub`
4. `s3-data/Line Companion_abbyy.gz` (fallback/patch)

**FR-LC-2**
If the normalized file exists, **do not re-normalize**; log that normalized text was used.

**FR-LC-3**
The system SHALL detect **64 gate blocks** using a tolerant regex such as  
`Gate\s+(\d{1,2})` or `^(?:HEXAGRAM|Gate)\s+(\d{1,2})` (multiline), and SHALL fail loudly if fewer than 60 are detected.

**FR-LC-4**
For each gate block, the system SHALL detect **6 line blocks** using tolerant patterns such as:

- `Line 1`
- `1st line`
- `Line 1 –`
- `The 1st line`

**FR-LC-5**
For each line, extract:

* `hd_quote` (≤25 words)
* `exaltation` (≤25 words, optional)
* `detriment` (≤25 words, optional)
* `raw_source_locator` (to help you reopen PDF/EPUB)

**FR-LC-6**
If a line can't be cleanly extracted, flag it and continue.

---

### 6.2 I Ching Hexagram Verification

**FR-HX-1**
Open every `s3-data/hexagrams/*.json` and verify:

* number 1–64
* 6 lines
* `unicode_hexagram` present

**FR-HX-2**
Compare each stored Legge line with the OCR Legge source. Mark as:

```json
"legge_verification": "pass"
```

or

```json
"legge_verification": "mismatch",
"legge_diff_note": "..."
```

**FR-HX-3**
If Legge text is missing, reconstruct from OCR and insert.

**FR-HX-4**
Do **not** overwrite HD gate text with I Ching text.

**FR-HX-5**
Emit `lore-research/research-outputs/HEXAGRAM_VERIFICATION.json` (or `.md`) with mismatches.

---

### 6.3 Data Integration into S³

**FR-DI-1**
For every `s3-data/gates/NN.json` ensure **exactly 6** lines.

**FR-DI-2**
Populate each line with a `classical` block:

```json
"classical": {
  "hd_title": "<from Ra or existing>",
  "hd_quote": "<≤25 words from Line Companion>",
  "exaltation": "<≤25 words or null>",
  "detriment": "<≤25 words or null>",
  "citation": {
    "author": "Ra Uru Hu",
    "work": "Line Companion",
    "source_file": "<filename used>",
    "page_or_locator": "<best-effort locator>",
    "extraction_method": "ocr|normalized|djvu-xml"
  },
  "word_count": <int>
}
```

**FR-DI-3**
The system SHALL **preserve** all existing non-classical fields, including relational / behavioral / group-role mappings.

**FR-DI-4**
The system SHALL also merge Ra quotes into:

* `s3-data/channels/*.json`

  * use gate-level Ra phrases to replace long placeholders
  * if channel is abstracted (like 1–8), MAY store **multiple** Ra snippets in an array
* `s3-data/centers/*.json`

  * centers = **best-effort**; if Ra never spoke directly to it, leave as:

    ```json
    { "ra_quote": null, "citation_status": "not_applicable" }
    ```
* `s3-data/circuits/*.json`

  * store 1–3 short Ra fragments to justify circuit inclusion; if missing, mark as `"provisional"`

**FR-DI-5**
Add / update `meta.provenance` on every touched file to state that Ra, ≤25-word, fair-use excerpts are present.

**FR-DI-6**
For `s3-data/hexagrams/*.json` and `s3-data/line_archetypes/*.json`, the system SHALL:

- **not** overwrite existing I Ching / archetypal text,
- attach Ra-derived snippets only if a clean, ≤25-word, directly corresponding Line Companion fragment exists,
- otherwise set:

  ```json
  { "ra_quote": null, "citation_status": "not_applicable" }
  ```

- and update `meta.provenance` the same way as for gates/channels/centers/circuits.

---

### 6.4 Correlation to Star Systems

**FR-CS-1**
The system SHALL take **any** of:

* gate line → `s3-data/gates/NN.json`
* channel → `s3-data/channels/*.json`
* center → `s3-data/centers/*.json`
* circuit → `s3-data/circuits/*.json`
* hexagram → `s3-data/hexagrams/*.json`
* line archetype → `s3-data/line_archetypes/*.json`

and produce a correlation record.

Example correlation record:

```json
{
  "source_ref": "gate.10.3",
  "hexagram_ref": "hx10.line3",
  "hd_ref": "gate.10 line 3",
  "star_scores": {
    "andromeda": { "score": 0.72, "reason": "liberation-from-captivity match" },
    "arcturus": { "score": 0.23, "reason": "vibrational-repair partial" },
    "draco": { "score": 0.10, "reason": "control/protection mismatch" },
    "lyra": { "score": 0.05, "reason": "aesthetic, but not primary" },
    "orion_dark": { "score": 0.00 },
    "orion_light": { "score": 0.15 },
    "pleiades": { "score": 0.34 },
    "sirius": { "score": 0.41 }
  },
  "citations": [
    "lore-research/research-outputs/star-systems/v4.2/andromeda-baseline-4.2.json",
    "s3-data/associations/gate-line-to-star.v2.json"
  ]
}
```

**FR-CS-2**
The correlation logic SHALL use **all 8** v4.2 star-system baseline files:

* `andromeda-baseline-4.2.json`
* `arcturus-baseline-4.2.json`
* `draco-baseline-4.2.json`
* `lyra-baseline-4.2.json`
* `orion-dark-baseline-4.2.json`
* `orion-light-baseline-4.2.json`
* `pleiades-baseline-4.2.json`
* `sirius-baseline-4.2.json`

**FR-CS-3**
The correlation logic SHALL consider **all 6** S³ data types as eligible inputs.

**FR-CS-4**
If `s3-data/associations/gate-line-to-star.v2.json` exists, **respect it**; else fall back to `s3-data/pipeline_rules/derivation.v1.json`.

**FR-CS-5**
The correlation **record** SHALL store the **I Ching leg** of the mapping to prove no drift:

```json
"source_alignment": {
  "hexagram_line_text": "<Legge 1899 text>",
  "hd_line_text": "<Ra line quote>",
  "alignment_confidence": 0.0
}
```

(0.0–1.0, your agent can set 0.7+ for clean matches.)

---

### 6.5 Validation & QA

**FR-VQ-1**
Verify all **384** gate.lines now have non-empty `classical.hd_quote`.

**FR-VQ-2**
Verify all Ra-sourced fields (`hd_quote`, `exaltation`, `detriment`) are **≤25 words**.

**FR-VQ-3**
Verify every `s3-data/gates/*.json` has **exactly 6** line objects.

**FR-VQ-4**
Output a validation report listing:

* missing lines
* lines with too many words
* hexagram mismatches
* star-system correlation failures

**FR-VQ-5**
The system SHALL support manual review batches of **≥10 gates (60 lines)** by exporting JSON like:

```json
[
  {
    "gate_line": "10.3",
    "ra_quote": "...",
    "exaltation": "...",
    "detriment": "...",
    "source_locator": "...",
    "hexagram_text": "...",
    "issues": []
  }
]
```

**FR-VQ-6**
Write a human queue file:

* `lore-research/research-outputs/BAD_LINES.md`
* contains: gate, line, source used, why it failed, recommended source (pdf/epub)

---

### 6.6 Copyright / Fair Use

**FR-CU-1**
Cap all Ra text at **25 words**.

**FR-CU-2**
Attach attribution:

```json
"citation": {
  "author": "Ra Uru Hu",
  "work": "Line Companion",
  "usage": "research/education",
  "note": "quote limited to <=25 words for fair-use alignment"
}
```

**FR-CU-3**
Never emit whole paragraphs.

**FR-CU-4**
Maintain `s3-data/sources/registry.json` for:

* Ra Uru Hu — Line Companion
* James Legge — The I Ching (1899)
* Other translators (provisional)

---

### 6.7 Cleanup

**FR-CL-1**
Treat these as scratch:

* `lore-research/research-outputs/line-companion/gate-lines.json`
* `lore-research/research-outputs/line-companion/gates.json`
* `lore-research/research-outputs/line-companion/quotes.json`

**FR-CL-2**
Production runs SHALL emit versioned files, e.g.:

* `line-companion-gate-lines.v1.json`
* `line-companion-gate-lines.v2.json`

---

## 7. Non-Functional

1. Deterministic
2. Idempotent
3. Diff-friendly
4. Runs on Mac / Kiro
5. Traceable back to source + offset

---

## 8. Open / Optional

1. **Wilhelm merge** — if you later drop Wilhelm/Baynes into `s3-data/sources/`, the pipeline MAY add it as a second translation on the hexagram files.

2. **PDF locator** — if `s3-data/Line Companion.pdf` has stable page numbers, we can upgrade `citation.page_or_locator` to an actual page number.

3. **Scandata leverage** — `s3-data/Line Companion_scandata.xml` can be used to disambiguate broken headings; not required in v0.7.

---

## 9. Summary

* ✅ Channels / centers / circuits stay in.
* ✅ Explicit list of all 8 v4.2 baselines stays in.
* ✅ Explicit `source_alignment` JSON stays in.
* ✅ Manual-review batch JSON stays in.
* ✅ 25-word cap + attribution stays in.
* ✅ Glossary section restored.
* ✅ Explicit regex patterns for gate/line detection restored.
* ✅ Sample correlation record JSON restored.
* ✅ Open/Optional section restored.

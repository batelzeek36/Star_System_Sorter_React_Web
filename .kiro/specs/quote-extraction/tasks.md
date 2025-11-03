# Implementation Plan

## ⚠️ CURRENT MODE: LEGGE PARAPHRASE (BETA)

**Status**: Using paraphrased Legge text from `s3-data/hexagrams/*.json` to ship quickly. Full OCR verification deferred to post-launch.

**Config Flag**: `LEGGE_MODE = "paraphrase"` (see `lore-research/scripts/config.py`)

**What this means**:
- **Both LC and Legge paraphrase are extracted as parallel sources** (not fallback)
- Each gate.line gets BOTH `classical.line_companion` AND `classical.legge` blocks
- Page/leaf locators optional for Legge
- Cross-check stages run in "record-only" mode (no strict match/conflict enforcement)
- All Legge quotes stamped with `"status": "beta"` and `"source": "legge-paraphrase"`
- UI shows both sources side-by-side, with "BETA" badge on Legge quotes

**Switching back to verified Legge later**:
1. Set `LEGGE_MODE = "verified"` in config
2. Point to repaired/OCR'd Legge index
3. Re-run stages 5→6→7→8 with strict validation
4. Promote candidates to live (BETA badge disappears)

**See**: "Reversibility & Mode Switching" section at end of this document for full details.

---

## ⚠️ IMPLEMENTATION NOTE: Large-Text Rule

For any source in `s3-data/` bigger than 50 MB (Line Companion DJVU export, Legge DJVU export):
- **DO NOT** load entire file into memory
- Process as streaming iterator
- Write intermediate chunk files
- Only build final JSON from already-split per-hex/per-gate files

---

- [x] 1. Set up project structure and core utilities
  - Create directory structure for pipeline scripts in `lore-research/scripts/`
  - Create output directory structure in `lore-research/research-outputs/`
  - Implement shared utility functions (file I/O, logging, validation helpers)
  - Set up configuration file for source paths and thresholds
  - _Requirements: FR-LC-1, FR-CL-1, FR-CL-2_

- [ ] 2. Implement text normalization stage
  - [x] 2.1 Create source file selector with priority logic
    - Implement file existence checks for all Line Companion sources
    - Apply priority order: normalized.txt → djvu.txt → epub → djvu.xml → scandata.xml → abbyy.gz
    - Log which source was selected and why
    - Log `source_file` and `source_offset` (if available) for traceability
    - _Requirements: FR-LC-1, FR-LC-2_

  - [x] 2.2 Implement OCR text normalizer (`01-normalize-line-companion.py`)
    - Normalize line endings (CRLF → LF)
    - Collapse excessive blank lines (3+ → 1)
    - Join mid-sentence newlines intelligently
    - Apply configurable OCR fix dictionary
    - Detect and log lines >1500 chars as potential OCR errors
    - Write output to `line-companion/normalized.txt`
    - Emit companion index file `line-companion/normalized.index.json` with total_lines and optional sample offsets for LLM-assisted review
    - ALSO emit chunked outputs (`line-companion/normalized-partNN.txt`) when `CHUNK_NORMALIZED=1` env var is set (e.g., 500 lines per chunk) to support interactive review
    - Log OCR issues to `line-companion/OCR_ISSUES.md` in addition to inline detection
    - _Requirements: FR-LC-1, FR-LC-2_

  - [x] 2.2b Ingest Line Companion scan metadata
    - Read from: `s3-data/Line Companion_scandata.xml`
    - Parse:
      - `bookData.dpi`
      - `bookData.leafCount`
      - each `<page leafNum="N">` (store width, height, cropBox)
    - Write normalized copy to: `lore-research/research-outputs/line-companion/scandata.json`
    - Expose helper to map `leafNum` → image dims / crop
    - _Requirements: FR-CL-1, FR-DI-5_

  - [x] 2.2c Second-pass cleaner for LC normalized text
    - Input: `lore-research/research-outputs/line-companion/normalized.txt` **and** all `normalized-partNN.txt`
    - Remove page headers/footers matching: `^Page \d+$`, `^Page \d+/$`, or `^Page \d+\s*$`
    - Apply stronger mid-sentence join:
      - if line ends with lowercase / comma / semicolon and next line starts lowercase → join with space
    - Extend `OCR_FIXES` with LC-specific entries:
      - `lMe` → `We`
      - `Vie` → `We`
      - `V*stern` → `Western`
      - `i.e.` spacing fixes
    - Re-write cleaned files to:
      - `lore-research/research-outputs/line-companion/normalized.clean.txt`
      - `lore-research/research-outputs/line-companion/normalized.clean-partNN.txt`
    - Do **not** delete the original normalized files (they're still provenance)
    - _Requirements: FR-LC-2, FR-VQ-2_

  - [x] 2.3 Normalize Legge I Ching (`236066-The I Ching_djvu.txt`)
    - Read from `s3-data/236066-The I Ching_djvu.txt`
    - **Process as a streaming source** (DO NOT load whole file into memory)
      - read line-by-line or in fixed-size chunks (4–16 KB)
      - detect hexagram headers while streaming
    - Apply SAME normalization rules as Line Companion:
      - normalize line endings (CRLF → LF)
      - collapse excessive blank lines
      - join mid-sentence newlines
      - apply shared OCR fix dict (re-use LC dict; extend if Legge-specific issues found)
    - Write normalized output to: `s3-data/hexagrams/legge-normalized.txt`
    - ALSO emit chunked outputs to: `s3-data/hexagrams/chunks/legge-partNN.txt` (use same chunk size as LC, e.g. 500 lines)
    - Log OCR and structure issues to: `s3-data/hexagrams/OCR_ISSUES.md`
    - _Requirements: FR-HX-1, FR-CU-4, Non-functional (large-file streaming)_

  - [x] 2.4 Build Legge hexagram index
    - Parse `s3-data/hexagrams/legge-normalized.txt`
    - Split into 64 hexagrams using patterns:
      - `^HEXAGRAM\s+(\d+)\b`
      - OR fallback: `^(\d+)\.\s+The\s+.+`
    - For each hexagram:
      - capture title
      - capture body
      - split lines 1–6 if present (look for `^Line\s+(\d+)`, or map to standard line order if missing)
    - Write consolidated JSON to: `s3-data/hexagrams/legge-hx.json`
    - Preserve raw text for provenance (`raw_text`)
    - _Requirements: FR-HX-1, FR-HX-2, FR-DI-5_

  - [x] 2.5 Attach Legge page/leaf metadata
    - Read page map from: `s3-data/236066-The I Ching_page_numbers.json`
    - For each entry: `leafNum`, `confidence`, `ocr_value[]`, optional `pageNumber`
    - Build in-memory lookup: `leafNum → {confidence, ocr_value, pageNumber}`
    - When writing `s3-data/hexagrams/legge-hx.json`, try to:
      - estimate which leaf range a hexagram came from
      - attach to hexagram:
        - `source_leaf_start`
        - `source_leaf_end`
        - `source_page_candidates: [...]` (from `ocr_value`)
        - `source_page_confidence`
    - If no good match → set `source_leaf_start: null` and log to `s3-data/hexagrams/OCR_ISSUES.md`
    - **PARAPHRASE MODE**: When `LEGGE_MODE = "paraphrase"`, page/leaf locators are optional—don't fail validation if missing
    - _Requirements: FR-CU-2, FR-DI-2, FR-HX-5_

  - [ ] 2.6 Build lenient Legge index (all 64 guaranteed) **[OPTIONAL]**
    - Script: `lore-research/scripts/04b-build-legge-hx-lenient.py`
    - Read from: `s3-data/hexagrams/legge-normalized.txt`
    - Parse with very permissive rules to guarantee all 64 hexagrams present
    - For missing/damaged hexagrams:
      - Create stub entry with empty lines
      - Mark with `quality: "ocr_janky"` in `_meta`
      - Backfill titles from paraphrase files (`s3-data/hexagrams/01.json` … `64.json`) for UI readability
    - Write to: `s3-data/hexagrams/legge-hx.json` (overwrites strict version from 2.4)
    - Log quality stats: count of empty hexagrams, missing lines
    - This ensures UI always has complete coverage even with poor OCR
    - _Requirements: FR-HX-1, FR-HX-2, FR-VQ-2_

  - [ ] 2.7 LLM-powered OCR repair pass **[OPTIONAL]**
    - Script: `lore-research/scripts/05c-llm-repair-legge.py`
    - Input: `s3-data/hexagrams/legge-hx.json` (from 2.6)
    - For each line marked `quality: "ocr_janky"`:
      - Build prompt with hexagram title + judgment context
      - Call LLM with strict system rules: "Fix ONLY OCR artifacts (broken hyphenation, ligatures, spurious headers), NO paraphrasing"
      - Calculate edit distance ratio between original and repaired
      - Reject if ratio exceeds threshold (default 0.28)
      - Log all decisions to: `lore-research/repair_reports/llm_repair_YYYYMMDD_HHMMSS.ndjson`
    - Write repaired output to: `s3-data/hexagrams/legge-hx.repaired.json`
    - Keep original `legge-hx.json` for rollback
    - Add `_meta.quality_notes[]` per line with repair metadata
    - CLI flags:
      - `--dry-run`: Report changes without writing
      - `--provider openai|anthropic`: LLM provider
      - `--model gpt-4o-mini`: Model name
      - `--max-change-ratio 0.28`: Rejection threshold
    - **Implementation note**: `call_model()` function must be wired to your LLM SDK
    - _Requirements: FR-HX-2, FR-VQ-2, FR-CU-4_

  - [ ] 2.8 Iterative upgrade path **[OPTIONAL]**
    - Ship MVP with paraphrase-as-Legge in per-hex files (already done via 06c-sync script)
    - Badge UI as **BETA** for lines sourced from paraphrase
    - In parallel, iterate 2.6 → 2.7 to gradually improve Legge quality
    - When satisfied with repair quality:
      - Point sync script (06c) at `legge-hx.repaired.json` instead of `legge-hx.json`
      - Re-run sync to overlay verified Legge text into per-hex files
      - Update UI badge to **Verified** for lines with `source_alignment: "legge-1899"`
    - This provides complete coverage today + clean upgrade path without blocking app
    - _Requirements: FR-HX-5, FR-VQ-5, Non-functional (iterative improvement)_

- [ ] 3. Implement gate splitting stage
  - [x] 3.1 Create gate block detector (`02-split-gates.py`) (back up any existing files from this task and put into a subfolder, we are running this task again.)
    - Read monolithic `lore-research/research-outputs/line-companion/normalized.txt` (fail with clear message if missing: "run 01-normalize first")
    - Loop over all gate heading patterns from `config.GATE_HEADING_PATTERNS` (first match wins per line)
    - Extract text blocks between gate headings
    - Validate gate count: <60 → exit 1, 60-63 → write JSON + warning + BAD_LINES, 64 → ✅
    - Write output to `lore-research/research-outputs/line-companion/gates.json`
    - Include `_meta` block with `detected_gates` count and `missing_gates` array
    - If LC scandata is available:
      - estimate which page range the gate came from (based on byte/line offset in normalized.txt)
      - attach to `gates.json` under `_meta.page_hint = { "leaf_start": N, "leaf_end": M, "dpi": 300 }`
      - if estimate fails → do NOT error; just skip and log to `line-companion/OCR_ISSUES.md`
    - _Requirements: FR-LC-3_

  - [x] 3.2 Create gate fanout script (`03-fanout-gates.py`) (back up any existing files from this task and put into a subfolder, we are running this task again.)
    - Read monolithic `lore-research/research-outputs/line-companion/gates.json`
    - Create output directory `lore-research/research-outputs/line-companion/gates/` if it doesn't exist
    - Iterate gates 1..64 and write each to its own file: `gate-{gate:02d}.json` (e.g., `gate-01.json`, `gate-27.json`)
    - File structure: `{"gate": <int>, "title": <str or null>, "raw_text": <full text from gates.json>, "lines": {}, "_meta": {"source": "line-companion-normalized.txt", "extracted_from": "gates.json", "created_at": "<auto-iso8601>"}}`
    - If a gate key exists in `gates.json` but has empty/missing text → log to `BAD_LINES.md`
    - Keep the monolithic `gates.json` as the canonical LC dump for provenance
    - _Requirements: FR-LC-3, FR-DI-5_

  - [x] 3.3 Handle missing gates
    - For any gate 1..64 not present or present-but-empty in `gates.json`, log to `BAD_LINES.md` with format: `gate: <N> | source: line-companion-normalized.txt | problem: not found in normalized text | suggestion: check I Ching fallback`
    - ALSO add missing gates to the **top-level** `_meta.missing_gates` array in `lore-research/research-outputs/line-companion/gates.json` (update the original file)
    - If `BAD_LINES.md` doesn't exist, create it with a short header
    - Suggest checking I Ching source as fallback (this is just a text note, not an automated fetch)
    - _Requirements: FR-LC-6, FR-VQ-6_

  - [x] 3.4 Add per-gate line detector (back up any existing files from this task and put into a subfolder, we are running this task again.)
    - For each `gate-XX.json`, scan `raw_text` for headings of the form `^<gate>\.(\d)\s+(.+)$` (MULTILINE)
    - Populate `"lines": { "1": {"heading": "...", "raw": "..."}, ..., "6": {...} }`
    - If <6 lines → log to `BAD_LINES.md` with gate number and reason
    - Keep original `raw_text` intact for provenance
    - When writing `gate-XX.json`, if `_meta.page_hint` exists on the parent gate:
      - copy it into the per-gate file unchanged
    - _Requirements: FR-LC-4, FR-VQ-2_

  - [x] 3.5 Line-shaping / exaltation–detriment splitter
    - For each `gate-XX.json`, read `lines` object
    - Parse each line's `raw` into segments: intro, exaltation, detriment
    - Add `segments`: `[{"type": "intro", ...}, {"type": "exaltation", ...}, {"type": "detriment", ...}]`
    - If no exaltation/detriment found → log to `BAD_LINES.md`
    - _Requirements: FR-LC-5, FR-VQ-2_

- [ ] 4. Implement line extraction stage
  - [ ] 4.1 Verify line extraction completeness
    - After running 3.4, verify all gate files have line data populated
    - Check that each gate has exactly 6 lines (or is logged in BAD_LINES.md)
    - Validate line heading format and content
    - _Requirements: FR-LC-4, FR-LC-5_

  - [ ] 4.2 Detect and flag incomplete gates
    - Identify gates with <6 lines
    - Log missing/duplicate lines to `BAD_LINES.md`
    - Continue processing with available lines
    - _Requirements: FR-LC-6, FR-VQ-6_

- [ ] 5. Implement hexagram cross-check stage
  - [ ] 5.1 Create hexagram verifier (`03b-xcheck-with-hexagrams.py`)
    - Load primary hexagrams from `s3-data/hexagrams/legge-hx.json` (generated in 2.4)
    - If per-hex override files exist (e.g. `s3-data/hexagrams/01.json`, `s3-data/hexagrams/02.json`) → overlay those on top of Legge
    - Map HD gate N → hexagram N (1→1, 2→2, … 64→64)
    - For each gate line from LC (`lore-research/research-outputs/line-companion/gates/gate-XX.json`):
      - compare LC line text to Legge line text
      - detect semantic alignment (same core meaning) vs. conflict (different direction, missing line, bad OCR)
      - add fields: `hexagram_match: true|false`, `hexagram_conflict: true|false`, `hexagram_source: "legge-1899"`
    - If Legge hexagram has `source_leaf_start` → copy it into the cross-check record
    - Store under: `line_meta.legge_source_leaf` and `line_meta.legge_source_confidence`
    - **PARAPHRASE MODE**: Run with `--legge-mode paraphrase --record-only` flag:
      - Set `hexagram_source: "legge-paraphrase"`
      - Set `hexagram_match: null` and `hexagram_conflict: null` (don't grade paraphrase vs LC)
      - Copy through any `source_leaf_*` if present; otherwise leave `null` (don't fail)
      - Add `line_meta.legge_status: "beta"`
    - _Requirements: FR-HX-1, FR-HX-2, FR-HX-5_

  - [ ] 5.2 Flag conflicts and matches
    - Mark `hexagram_conflict: true` for semantic mismatches
    - Mark `hexagram_match: true` for aligned content
    - Store hexagram source reference
    - Store `lc_source_file` and `lc_source_offset` for manual review traceability
    - Write output to `line-companion/gate-lines-xchecked.json`
    - **PARAPHRASE MODE**: Skip grading; just record references
    - _Requirements: FR-HX-2, FR-HX-5_

  - [ ] 5.3 Hexagram-only reprocess mode
    - CLI: `--stage hex-only` or `--stage 5 --source legge`
    - Re-runs 2.3 → 2.4 → 5.1 without touching LC gate files
    - Useful when `s3-data/236066-The I Ching_djvu.txt` is updated or re-OCR'd
    - _Requirements: FR-HX-5, Non-functional (resume)_

- [ ] 6. Implement quote selection stage
  - [ ] 6.1 Create quote extractor (`04-extract-quotes.py`)
    - Read cross-checked line data
    - **Extract BOTH sources as parallel quotes** (not either/or):
      - Extract LC quote (≤25 words)
      - Extract Legge quote (≤25 words)
    - Extract first sentence ≤25 words from each source
    - If extracted text spans >1 paragraph, truncate to first ≤25-word segment
    - Truncate to 25 words with `...` if needed
    - **PARAPHRASE MODE**: Extract both LC and Legge paraphrase; stamp Legge with `"status": "beta"`
    - _Requirements: FR-LC-5, FR-CU-1, FR-CU-3_

  - [ ] 6.1b Handle missing sources gracefully
    - If LC line is missing/damaged → extract Legge only, log to `BAD_LINES.md`
    - If Legge line is missing → extract LC only, log to `BAD_LINES.md`
    - If BOTH missing → create stub with `status: "needs_manual"`, log to `BAD_LINES.md`
    - **PARAPHRASE MODE**: When extracting Legge paraphrase, stamp citation as:
      ```json
      {
        "source": "legge-paraphrase",
        "author": "Legge (paraphrase—verification pending)",
        "work": "I Ching",
        "source_file": "s3-data/hexagrams/{NN}.json",
        "page_or_locator": null,
        "extraction_method": "json-paraphrase",
        "fair_use_note": "BETA paraphrase stored pending verification",
        "word_count": 23
      }
      ```
    - _Requirements: FR-LC-6, FR-HX-2, FR-CU-1, FR-VQ-6_

  - [ ] 6.2 Extract exaltation and detriment
    - Detect exaltation/detriment patterns in LC text
    - Extract ≤25 word quotes for each
    - Enforce ≤25 words for exaltation and detriment, log overflow to BAD_LINES.md
    - Mark as optional (null if not present)
    - _Requirements: FR-LC-5, FR-VQ-2_

  - [ ] 6.3 Generate citation metadata
    - Store author, work, source file, locator
    - Record extraction method (ocr/normalized/djvu-xml)
    - Calculate word count
    - Add fair-use note
    - If Legge was the chosen source:
      - include `locator_leaf` (from 2.5)
      - include `locator_page_candidates` (array of strings from OCR, e.g. ["XVI","116"])
      - include `locator_confidence`
      - set `source_id: "legge-1899"`
    - **PARAPHRASE MODE**: Don't require page numbers or "legge-1899" identifiers for paraphrase lines; allow `page_or_locator: null`
    - Write output to `line-companion/quotes.json`
    - _Requirements: FR-DI-2, FR-CU-2_

  - [ ] 6.4 Handle extraction failures
    - Create stub entries with `status: "needs_manual"`
    - Log reason (OCR_fragment, missing_text, etc.)
    - Add to `BAD_LINES.md` queue
    - _Requirements: FR-LC-6, FR-VQ-6_

- [ ] 7. Implement gate file merger
  - [ ] 7.1 Create quote merger (`06-merge-quotes-into-gates.py`)
    - Read existing gate files from `s3-data/gates/`
    - Load quote data from `line-companion/quotes.json`
    - Preserve all existing non-classical fields
    - _Requirements: FR-DI-1, FR-DI-3_

  - [ ] 7.2 Populate classical blocks
    - Create/update `classical` object for each line
    - Set hd_title, hd_quote, exaltation, detriment
    - Include complete citation: `citation.author`, `citation.work`, `citation.source_file`, `citation.page_or_locator`, `citation.extraction_method`, and fair-use note
    - Include word_count field
    - **PARAPHRASE MODE**: Populate `classical.legge` like:
      ```json
      "classical": {
        "legge": {
          "status": "beta",
          "hd_title": "...",
          "hd_quote": "...",
          "citation": { ... as above with "legge-paraphrase" source ... }
        },
        "line_companion": { ... }
      }
      ```
    - _Requirements: FR-DI-2, FR-CU-2_

  - [ ] 7.3 Write candidate files safely
    - Write to `s3-data/gates/_candidate/` directory
    - Never overwrite live gate files directly
    - Pretty-print JSON with stable key order to keep git diffs small
    - Preserve JSON formatting and structure
    - Update `meta.provenance` field
    - _Requirements: FR-DI-5, Non-functional requirements_

- [ ] 8. Implement validation stage
  - [ ] 8.1 Create validator (`07-validate-gates.py`)
    - Verify all 64 gates present in candidate directory
    - Check exactly 6 lines per gate
    - Validate all quotes are ≤25 words
    - Verify citation metadata completeness
    - **PARAPHRASE MODE**: Run with `--legge-mode paraphrase` to relax checks:
      - Page/leaf **optional** for Legge sources
      - `citation.author` may be "Legge (paraphrase—verification pending)"
      - `hexagram_match/conflict` may be `null`
      - Still **enforce**: 64 gates × 6 lines, ≤25 words, presence of **at least one** source (LC or Legge-paraphrase)
    - _Requirements: FR-VQ-1, FR-VQ-2, FR-VQ-3_

  - [ ] 8.2 Generate validation report
    - Count total gates, lines, valid lines
    - List all `needs_manual` entries
    - Include notes with specific issues
    - Write validation report to `lore-research/research-outputs/VALIDATION_REPORT.v1.json` (or .md) for versioning
    - Update `BAD_LINES.md` with final queue
    - Verify multi-source presence:
      - assert Line Companion gates exist: `lore-research/research-outputs/line-companion/gates/gate-01.json` … `gate-64.json`
      - assert Legge index exists: `s3-data/hexagrams/legge-hx.json`
      - if Legge missing → add to `BAD_LINES.md`:
        - `source: legge-1899 | problem: missing indexed hexagrams | suggestion: rerun 2.3/2.4`
    - Include section: "scan_linkage"
      - total gates with page_hint
      - total gates without page_hint
      - sources used: LC-scandata.xml
    - _Requirements: FR-VQ-4, FR-VQ-5, FR-VQ-6, FR-CL-2_

  - [ ] 8.3 Verify hexagram linkage
    - Check every line links to correct hexagram N
    - Detect off-by-one errors
    - Warn if quote came only from LC without hexagram verification
    - **PARAPHRASE MODE**: In paraphrase mode, **warn** instead of **assert** on linkage mismatches
    - _Requirements: FR-HX-1, FR-HX-2, FR-HX-5_

- [ ] 9. Create pipeline orchestrator
  - [ ] 9.1 Implement main pipeline script
    - Chain all stages in correct order
    - Handle stage failures gracefully
    - Log progress and timing for each stage
    - Support resuming from intermediate stages
    - _Requirements: All FR sections_

  - [ ] 9.2 Add command-line interface
    - CLI arguments: `--stage 1|2|3|3b|4|merge|validate` and `--resume`
    - Support running individual stages
    - Add dry-run mode for testing
    - Include verbose logging option
    - Document usage in script docstring
    - _Requirements: Non-functional requirements_

- [ ] 10. Create source registry
  - [ ] 10.1 Implement source registry manager
    - Create/update `s3-data/sources/registry.json`
    - Register Ra Uru Hu - Line Companion
    - Register James Legge - The I Ching (1899)
    - Register source:
      - id: `legge-1899`
      - kind: `i-ching`
      - path_raw: `s3-data/236066-The I Ching_djvu.txt`
      - path_normalized: `s3-data/hexagrams/legge-normalized.txt`
      - path_indexed: `s3-data/hexagrams/legge-hx.json`
      - has_page_map: true
      - page_map_path: `s3-data/236066-The I Ching_page_numbers.json`
      - page_map_confidence: "mixed-ocr"
      - provenance: `public-domain (James Legge, 1899, archive.org mirror 236066)`
      - notes: "Used as fallback and cross-check against Ra Uru Hu Line Companion; do not overwrite without re-running 2.3/2.4. Use page map only for human-facing locators; do not rely on it for splitting."
    - Include metadata for all sources used
    - _Requirements: FR-CU-4_

- [ ] 11. Documentation and runbook
  - [ ] 11.1 Create pipeline documentation
    - Document each script's purpose and usage
    - Provide example commands for full pipeline run
    - Explain intermediate file formats
    - Document error handling and recovery
    - _Requirements: All sections_

  - [ ] 11.2 Create manual review guide
    - Document how to use `BAD_LINES.md`
    - Explain candidate file promotion process
    - Provide examples of common OCR issues
    - Include PDF/EPUB reference instructions
    - _Requirements: FR-VQ-5, FR-VQ-6_

- [ ] 12. Phase 2: Extended integration (deferred)
  - [ ] 12.1 Extend to channels/centers/circuits
    - Apply same quote extraction pattern to channels
    - Best-effort extraction for centers (set null if Ra never spoke to it)
    - Store 1-3 Ra fragments for circuits
    - Update meta.provenance consistently
    - _Requirements: FR-DI-4_

  - [ ] 12.2 Implement star-system correlation generator
    - Load all 8 v4.2 star-system baseline files
    - Generate correlation records for any S³ object type
    - Calculate scores for all 8 systems per gate.line
    - Include source_alignment block linking hexagram → HD → star score
    - Use existing association mappings from gate-line-to-star.v2.json
    - _Requirements: FR-CS-1, FR-CS-2, FR-CS-3, FR-CS-4, FR-CS-5_

  - [ ] 12.3 Emit correlation reports
    - Generate correlation record per object with star_scores
    - Include reasoning for each score
    - Reference citation sources
    - Write to versioned output file
    - _Requirements: FR-CS-1, FR-CS-5_

---

## Reversibility & Mode Switching

### Why Paraphrase Mode?

The project needs to ship quickly. Rather than block on perfect Legge OCR, we're using paraphrased Legge text from `s3-data/hexagrams/*.json` as a **BETA** source. This lets us:
- Ship complete coverage (all 64 gates × 6 lines)
- **Provide BOTH LC and Legge quotes side-by-side** for comparison
- Show users both the HD interpretation (LC) and classical I Ching (Legge)
- Defer full OCR verification to post-launch

### Config Flags (in `lore-research/scripts/config.py`)

```python
LEGGE_MODE = "paraphrase"              # "verified" | "paraphrase" | "repaired"
LEGGE_PARAPHRASE_DIR = "s3-data/hexagrams"
EXTRACT_BOTH_SOURCES = True            # Extract BOTH LC and Legge as parallel sources
REQUIRE_PAGE_LOCATOR_FOR_LEGGE = False # Page/leaf optional in paraphrase mode
```

### What Changes in Paraphrase Mode

**Unaffected (keep as-is)**:
- Stage 2.1–2.4 (normalization/index build)
- Stage 3.1–3.4 (gate split/fanout/line detect)
- Stage 3.5 (line segmenter)
- Stage 4.0–4.2 (line extraction readiness)
- Stage 7 (merge)
- Stage 9–11 (orchestrator/docs)
- Stage 12 (later)
- Quote extraction and merge logic still work fine if source priority is LC → Legge (paraphrase) with a badge

**Impacted (needs tweaks or a flag)**:
- **2.5** page/leaf linkage: page locators will often be `null`. Don't *require* them in validation when Legge is paraphrase.
- **2.6/2.7** (lenient index + LLM repair): optional; leave off for now.
- **5.1–5.3** cross-check with Legge: can't claim "match/conflict" against paraphrase. Switch to **"record-only"** mode (store refs, don't grade).
- **6.1** quote extraction: extract BOTH LC and Legge quotes for every line (parallel sources, not fallback).
- **6.3** citation metadata: don't require page numbers or "legge-1899" identifiers for paraphrase lines.
- **8.3** "verify hexagram linkage": in paraphrase mode, **warn** instead of **assert**.

### Running the Pipeline in Paraphrase Mode

```bash
# 1. Finish 3.5 (exaltation/detriment splitter) so quotes pick clean segments
python3 lore-research/scripts/03c-split-exaltation-detriment.py

# 2. Extract/merge/validate with paraphrase mode
# Extract BOTH LC and Legge quotes as parallel sources
python3 lore-research/scripts/04-extract-quotes.py --extract-both

python3 lore-research/scripts/06-merge-quotes-into-gates.py

python3 lore-research/scripts/07-validate-gates.py --legge-mode paraphrase

# 3. Skip grading in Stage 5 for now (record-only mode)
python3 lore-research/scripts/03b-xcheck-with-hexagrams.py --legge-mode paraphrase --record-only
```

### UI Rendering in Paraphrase Mode

In the UI, render Legge quotes with a small **BETA** badge & tooltip:
- Badge text: "BETA"
- Tooltip: "Paraphrased Legge text. Tap to submit corrections."
- Logic: Check `classical.legge.status === "beta"` in the JSON

### Switching Back to Verified Legge (Post-Launch)

When you have clean/repaired Legge text:

**1. Update config**:
```python
LEGGE_MODE = "verified"                 # or "repaired"
REQUIRE_PAGE_LOCATOR_FOR_LEGGE = True   # Tighten again
```

**2. Point the index**:
- If you did 2.7 LLM repair: use `s3-data/hexagrams/legge-hx.repaired.json`
- Else use strict `s3-data/hexagrams/legge-hx.json`

**3. Re-run the strict stages**:
```bash
# Rebuild/repair (only if you updated sources)
# python3 lore-research/scripts/04b-build-legge-hx-lenient.py
# python3 lore-research/scripts/05c-llm-repair-legge.py --provider openai --model gpt-4o-mini

# Cross-check: now ENFORCE matches/conflicts
python3 lore-research/scripts/03b-xcheck-with-hexagrams.py --legge-mode verified

# Quote extraction: prefer verified Legge, LC as fallback only if configured
python3 lore-research/scripts/04-extract-quotes.py --prefer legge --allow-lc-fallback

# Merge into candidate gates
python3 lore-research/scripts/06-merge-quotes-into-gates.py

# Validate with strict rules (page/leaf required if present in source map)
python3 lore-research/scripts/07-validate-gates.py --legge-mode verified
```

**4. Promote candidates**:
- Review `s3-data/gates/_candidate/` files
- Copy to `s3-data/gates/` when satisfied
- UI badge automatically disappears (no more `status: "beta"`)

### Why This Is Safe to Switch Later

- **Feature-flagged behavior** (`LEGGE_MODE`) isolates logic (record-only vs enforce), so no schema changes.
- **Provenance preserved**: every quote carries `source`, `extraction_method`, and (in BETA) `status:"beta"`. You can precisely target/replace only paraphrase entries.
- **Candidate writes only**: live files aren't overwritten; promotion stays a conscious step.
- **Idempotent scripts**: re-running with the same inputs yields the same outputs—so flipping modes and re-running is deterministic.

### Quick "Promotion-Readiness" Checks

Before flipping to verified mode:

```bash
# No paraphrase residue:
grep -R '"source": "legge-paraphrase"' lore-research/research-outputs | wc -l

# All lines have ≤25 words and citations present:
python3 lore-research/scripts/07-validate-gates.py --legge-mode verified --report-only
```

### Bottom Line

You're safe to proceed. Flip to **paraphrase mode**, keep LC as primary, optionally allow Legge-paraphrase as fallback, and relax Stage-5/6/8 checks as above. Later, switch to **verified** by toggling the flag, re-running 5→6→7→8, and promoting.


---

## Phase 2: LLM-Assisted Star System Mapping (Optional Enhancement)

This phase adds LLM-assisted scoring for star system mappings as a **constrained "judge"** within a deterministic scaffold. The LLM helps scale the mapping process while maintaining quality through strict schemas, rubrics, and validation.

### Overview

Instead of manually scoring all 384 gate.lines × 8 star systems (3,072 mappings), use an LLM with:
- Strict JSON schema enforcement
- Condensed rubric from v4.2 baselines
- Evidence packs (LC + Legge quotes + keywords)
- Post-calibration consistency checks
- Disagreement reports vs. existing drafts

### Why This Approach

- **Constrained**: LLM outputs strict JSON matching Pydantic schema
- **Reversible**: Switching to verified Legge only changes evidence source
- **Auditable**: Every score includes reasoning citing evidence phrases
- **Upgradeable**: Can re-run with better models or prompts later
- **Safe**: Existing drafts preserved as priors; disagreements flagged for review

- [ ] 13. Phase 2: LLM-Assisted Star Mapping

  - [ ] 13.1 Compile evidence packs (`08a-compile-evidence.py`)
    - Script: `lore-research/scripts/08a-compile-evidence.py`
    - For each gate.line (1.1 through 64.6):
      - Load gate file from `s3-data/gates/{NN}.json`
      - Load hexagram file from `s3-data/hexagrams/{NN}.json`
      - Extract LC quote (≤25 words from `classical.line_companion.hd_quote`)
      - Extract Legge quote (≤25 words from `classical.legge.hd_quote`)
      - Extract normalized meaning from hexagram `lines[N].meaning`
      - Extract keywords from hexagram `lines[N].keywords`
      - Build evidence pack:
        ```json
        {
          "gate_line": "1.2",
          "lc_quote": "≤25 words",
          "lc_title": "...",
          "lc_locator": "gate-01.json#2",
          "legge_quote": "≤25 words",
          "legge_title": "...",
          "legge_locator": "hx01:line2",
          "normalized_meaning": "...",
          "keywords": ["...", "..."],
          "mode": "paraphrase"
        }
        ```
      - Write to `lore-research/research-outputs/evidence/{gate:02d}-{line}.json`
    - Write summary to `evidence/_summary.json` with count and mode
    - _Requirements: Deterministic evidence compilation, token-efficient_

  - [ ] 13.2 Implement LLM scorer (`08b-llm-score-star-systems.py`)
    - Script: `lore-research/scripts/08b-llm-score-star-systems.py`
    - Define Pydantic schemas:
      - `SystemScore`: id, alignment (core|shadow|none), weight (0.0-1.0), why (≤400 chars), confidence (0.0-1.0)
      - `StarMapOutput`: gate_line, systems (list of 8 SystemScore), notes, source_meta
    - Load condensed rubric from v4.2 baselines:
      - **Andromeda (core)**: Liberation, sovereignty reclamation, anti-domination, rescue
      - **Andromeda (shadow)**: Passive victimhood, savior fixation, martyr witness
      - **Arcturus (core)**: Systems, calibration, signal hygiene, frequency repair
      - **Arcturus (shadow)**: Rigidity, technocracy, cold detachment
      - **Draco (core)**: Raw will, survival ruthlessness, predator-guard, resource control
      - **Draco (shadow)**: Predation, coercive power, weaponized access
      - **Lyra (core)**: Artistry, beauty, harmonic imprinting
      - **Lyra (shadow)**: Aesthetic vanity, hollow performance
      - **Orion-Light (core)**: Truth-quest, valor under trial, lawful order, initiation through ordeal
      - **Orion-Light (shadow)**: Crusader zealotry, forcing tests, spiritualizing suffering
      - **Orion-Dark (core)**: Shadow work, taboo alchemy, pattern exposure
      - **Orion-Dark (shadow)**: Exploitation, glamorization of darkness, predatory hierarchy
      - **Pleiades (core)**: Nurture, kinship fields, nervous system caretaking, attachment safety
      - **Pleiades (shadow)**: Smothering, martyrdom, panic-attachment, codependency
      - **Sirius (core)**: Guardianship, kingship service, catalyzing transformation through crisis
      - **Sirius (shadow)**: Authoritarianism, divine-right cosplay, forcing ordeals
    - Build prompt from evidence pack:
      - System prompt: rubric + strict rules (use evidence literally, no invention, prefer precision)
      - User prompt: gate.line context + LC/Legge quotes + normalized meaning + keywords
      - Task: Score ALL 8 systems with alignment, weight, confidence, and "why" citing evidence
    - Call OpenAI API with structured output (JSON mode)
    - Validate response with Pydantic
    - Retry once on failure, mark `needs_review` if still fails
    - Write output to `lore-research/research-outputs/star-maps-llm/{gate:02d}-{line}.json`
    - CLI args:
      - `--model gpt-4o-mini` (default)
      - `--temperature 0.0` (default)
      - `--batch-size 32` (lines per run)
      - `--start-gate 1` / `--end-gate 64`
    - Rate limiting: 0.5s between calls
    - Requires: `OPENAI_API_KEY` environment variable
    - _Requirements: Constrained LLM judge, strict schema, provenance_

  - [ ] 13.3 Post-calibration consistency checks (`08c-post-calibrate.py`)
    - Script: `lore-research/scripts/08c-post-calibrate.py`
    - For each LLM score in `star-maps-llm/`:
      - **Sparsity check**: ≤2 systems with weight >0.4
      - **Core/shadow conflict check**: Same system shouldn't have both core and shadow with high weights
      - **Evidence citation check**: "why" must reference actual evidence phrases (3+ word sequences from quotes or keywords)
    - Add `_calibration` metadata to each score:
      ```json
      {
        "_calibration": {
          "pass": true,
          "issues": ["Too many high weights (3)"]
        }
      }
      ```
    - Write calibrated scores to `lore-research/research-outputs/star-maps-calibrated/`
    - Write summary to `star-maps-calibrated/_calibration_summary.json`:
      - total_scored, passed, needs_review count
      - List of review items with gate.line and reason
    - _Requirements: Consistency validation, quality gates_

  - [ ] 13.4 Generate disagreement report (`08d-generate-disagreement-report.py`)
    - Script: `lore-research/scripts/08d-generate-disagreement-report.py`
    - Load existing draft mappings from `lore-research/research-outputs/star-mapping-drafts/`
    - Parse system name from filename (e.g., `andromeda-batch1.json` → `andromeda`)
    - For each LLM score:
      - Compare with draft mapping for same gate.line
      - Flag disagreements where |llm_weight - draft_weight| > 0.3
      - Collect: gate.line, system, llm_weight, draft_weight, Δ, alignments, why texts, confidence
    - Sort by weight difference (largest first)
    - Write outputs to `lore-research/research-outputs/star-maps-reports/`:
      - `disagreements.json` (full data)
      - `disagreements.md` (formatted table + top 50 detailed)
      - `disagreements.csv` (for spreadsheet review)
    - Summary stats:
      - Total disagreements
      - Unique gate.lines affected
      - Average weight difference
    - _Requirements: Surgical review, human-in-loop, audit trail_

  - [ ] 13.5 Merge LLM scores with existing drafts (optional)
    - Script: `08e-promote-star-maps.py` (to be created if needed)
    - Input A: LLM scores from `star-maps-calibrated/`
    - Input B: Existing drafts from `star-mapping-drafts/`
    - Merge rule: **LLM beats draft** when `confidence >= 0.6` AND `_calibration.pass == true`
    - Otherwise: keep draft, flag `needs_review: true`
    - Write to `star-mapping-drafts/_candidate/` (never overwrite live drafts)
    - Generate promotion report showing what changed
    - _Requirements: Safe upgrade, reversible, explicit promotion_

### Definition of Done (Phase 2)

- ✅ All 384 evidence packs compiled in `evidence/`
- ✅ LLM scores generated for all gate.lines in `star-maps-llm/`
- ✅ Calibration checks pass for ≥90% of scores
- ✅ Disagreement report generated with CSV for review
- ✅ Validator passes: JSON shape OK, quotes ≤25 words, at most 2 systems >0.4 per line
- ✅ Reversible: switching to verified Legge only changes evidence source, not scorer

### Running the LLM Pipeline

```bash
# 1. Compile evidence packs (deterministic, run once)
python3 lore-research/scripts/08a-compile-evidence.py

# 2. Score with LLM (requires OPENAI_API_KEY)
export OPENAI_API_KEY="your-key-here"
python3 lore-research/scripts/08b-llm-score-star-systems.py --batch-size 32

# 3. Run calibration checks
python3 lore-research/scripts/08c-post-calibrate.py

# 4. Generate disagreement report
python3 lore-research/scripts/08d-generate-disagreement-report.py

# 5. Review disagreements.csv and spot-check high-Δ items

# 6. (Optional) Promote LLM scores to drafts
# python3 lore-research/scripts/08e-promote-star-maps.py --confidence-threshold 0.6
```

### Cost Estimation

- **Evidence compilation**: Free (deterministic)
- **LLM scoring**: ~384 calls × $0.0001/call = ~$0.04 (gpt-4o-mini)
- **Calibration**: Free (deterministic)
- **Reports**: Free (deterministic)

**Total**: <$0.10 for full 384 gate.line scoring

### When to Use LLM vs Manual

**Use LLM for**:
- Bulk scoring of remaining gate.lines
- Consistency checking across all 8 systems
- Generating first-pass drafts for review

**Use Manual for**:
- Gold standard examples (batches 1-3)
- High-disagreement items (Δ >0.5)
- Edge cases flagged by calibration
- Final QC and spot-checking

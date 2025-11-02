# Implementation Plan

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

- [ ] 3. Implement gate splitting stage
  - [x] 3.1 Create gate block detector (`02-split-gates.py`)
    - Read monolithic `lore-research/research-outputs/line-companion/normalized.txt` (fail with clear message if missing: "run 01-normalize first")
    - Loop over all gate heading patterns from `config.GATE_HEADING_PATTERNS` (first match wins per line)
    - Extract text blocks between gate headings
    - Validate gate count: <60 → exit 1, 60-63 → write JSON + warning + BAD_LINES, 64 → ✅
    - Write output to `lore-research/research-outputs/line-companion/gates.json`
    - Include `_meta` block with `detected_gates` count and `missing_gates` array
    - _Requirements: FR-LC-3_

  - [x] 3.2 Create gate fanout script (`03-fanout-gates.py`)
    - Read monolithic `lore-research/research-outputs/line-companion/gates.json`
    - Create output directory `lore-research/research-outputs/line-companion/gates/` if it doesn't exist
    - Iterate gates 1..64 and write each to its own file: `gate-{gate:02d}.json` (e.g., `gate-01.json`, `gate-27.json`)
    - File structure: `{"gate": <int>, "title": <str or null>, "raw_text": <full text from gates.json>, "lines": {}, "_meta": {"source": "line-companion-normalized.txt", "extracted_from": "gates.json", "created_at": "<auto-iso8601>"}}`
    - If a gate key exists in `gates.json` but has empty/missing text → log to `BAD_LINES.md`
    - Keep the monolithic `gates.json` as the canonical LC dump for provenance
    - _Requirements: FR-LC-3, FR-DI-5_

  - [ ] 3.3 Handle missing gates
    - For any gate 1..64 not present or present-but-empty in `gates.json`, log to `BAD_LINES.md` with format: `gate: <N> | source: line-companion-normalized.txt | problem: not found in normalized text | suggestion: check I Ching fallback`
    - ALSO add missing gates to the **top-level** `_meta.missing_gates` array in `lore-research/research-outputs/line-companion/gates.json` (update the original file)
    - If `BAD_LINES.md` doesn't exist, create it with a short header
    - Suggest checking I Ching source as fallback (this is just a text note, not an automated fetch)
    - _Requirements: FR-LC-6, FR-VQ-6_

  - [ ] 3.4 Add per-gate line detector
    - For each `gate-XX.json`, scan `raw_text` for headings of the form `^<gate>\.(\d)\s+(.+)$` (MULTILINE)
    - Populate `"lines": { "1": {"heading": "...", "raw": "..."}, ..., "6": {...} }`
    - If <6 lines → log to `BAD_LINES.md` with gate number and reason
    - Keep original `raw_text` intact for provenance
    - _Requirements: FR-LC-4, FR-VQ-2_

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
    - Load all 64 hexagram files from `s3-data/hexagrams/`
    - Map HD gate N → hexagram N
    - Compare LC line text with hexagram line translations
    - Detect semantic conflicts vs. aligned matches
    - _Requirements: FR-HX-1, FR-HX-2_

  - [ ] 5.2 Flag conflicts and matches
    - Mark `hexagram_conflict: true` for semantic mismatches
    - Mark `hexagram_match: true` for aligned content
    - Store hexagram source reference
    - Store `lc_source_file` and `lc_source_offset` for manual review traceability
    - Write output to `line-companion/gate-lines-xchecked.json`
    - _Requirements: FR-HX-2, FR-HX-5_

- [ ] 6. Implement quote selection stage
  - [ ] 6.1 Create quote extractor (`04-extract-quotes.py`)
    - Read cross-checked line data
    - Apply source priority: hexagram (if conflict) → LC text
    - Extract first sentence ≤25 words
    - If extracted text spans >1 paragraph, truncate to first ≤25-word segment
    - Truncate to 25 words with `...` if needed
    - _Requirements: FR-LC-5, FR-CU-1, FR-CU-3_

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
    - _Requirements: FR-VQ-1, FR-VQ-2, FR-VQ-3_

  - [ ] 8.2 Generate validation report
    - Count total gates, lines, valid lines
    - List all `needs_manual` entries
    - Include notes with specific issues
    - Write validation report to `lore-research/research-outputs/VALIDATION_REPORT.v1.json` (or .md) for versioning
    - Update `BAD_LINES.md` with final queue
    - _Requirements: FR-VQ-4, FR-VQ-5, FR-VQ-6, FR-CL-2_

  - [ ] 8.3 Verify hexagram linkage
    - Check every line links to correct hexagram N
    - Detect off-by-one errors
    - Warn if quote came only from LC without hexagram verification
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

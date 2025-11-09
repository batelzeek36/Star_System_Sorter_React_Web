# Gate/Hexagram Star System Scoring – Tasks.md (Updated)

## Summary
Pipeline to generate **deterministic**, **auditable** star-system weights for all **384 gate.lines** (64×6) with **top-2 only** scoring, **pairwise invariants**, and **verbatim evidence**. Includes schemas, packing scripts, validation, merge, stats, and CI.

---

## Task 0: Prep Canonical Schemas + Baseline Beacon
**Estimate:** 30 minutes

**Deliverables**
- `schemas/weights.schema.json`
- `schemas/evidence.schema.json`
- `scripts/compute_beacon.py`

**Details**
- Schemas must encode all hard rules (top-2, weights multiple of 0.01, canonical names, NN.L keys, etc.).
- `compute_beacon.py` computes **sha256** of `combined-baselines-4.2.json` and prints the **first 8 hex chars**.

**Acceptance Criteria**
- Example files from Requirements validate against schemas.
- Beacon output exactly matches the value used in `_meta.baseline_beacon`.

---

## Task 1: Create Master Prompt Template
**Estimate:** 30 minutes

**Deliverables**
- `GPT-5/prompts/gate-scoring-prompt-template.md`

**Must Include**
- **Three-phase plan**: Score → Evidence → Output (strict ordering).
- **Top-2 constraint**: Keep only the **top-2 non-zero**, set all others to **0.00**.
- **Pairwise exclusion invariants** (Pleiades⊕Draco, Sirius vs Orion-Light, Andromeda⊕Orion-Dark, Arcturus⊕Pleiades, Lyra⊕Draco, Orion-Light vs Orion-Dark).
- **Legge gating**: Any weight **>0.50 requires a Legge quote from the same line**, else cap at 0.50.
- **Weights** in **[0.00..0.95]**, **multiples of 0.01**.
- **Canonical names** and **“NN.L”** keys sorted ascending.
- `_meta` with `baseline_beacon`, `version`, `gate`, `generated_at`, `generator`, `sum_unorm`.

**Acceptance Criteria**
- Template reproduces the exact schemas.
- Contains disambiguation matrix and quick_rules references.

---

## Task 2: Test Prompt on Gate 1
**Estimate:** 45 minutes

**Steps**
1. Copy template; set `{N}=01`.
2. Run in GPT-5 or Claude with inputs (combined baselines + gate-1 + hex-1).
3. Save outputs.

**Deliverables**
- `GPT-5/star-maps/gateLine_star_map_Gate01.json`
- `GPT-5/evidence/gateLine_evidence_Gate01.json`

**Acceptance Criteria**
- **Top-2 only** per line (rest exactly **0.00**).
- Pairwise invariants respected.
- Weights are **multiples of 0.01**, within 0.00–0.95.
- `_meta.baseline_beacon` matches `compute_beacon.py`.
- Evidence quotes are **verbatim**, **≤25 words**, correct sources.
- **Any weight >0.50** includes **Legge quote from the same line**.
- All 6 lines present, canonical names OK, keys **“01.1..01.6”** in order.

---

## Task 3: Refine Prompt Based on Gate 1 Results
**Estimate:** 30 minutes

**Deliverables**
- Updated `GPT-5/prompts/gate-scoring-prompt-template.md`
- `GPT-5/prompts/REFINEMENT_NOTES.md` (what changed and why)

**Acceptance Criteria**
- Running Gate 1 again passes all validation checks (see Task 13/13b).

---

## Task 4: Create Prompt Generation Script
**Estimate:** 45 minutes

**Deliverables**
- `GPT-5/scripts/generate_gate_prompts.py`

**Features**
- Reads template, replaces `{N}` for **01..64**.
- Confirms required inputs exist for each gate.
- Writes to `GPT-5/prompts/gates/gate-{NN}-prompt.md`.

**Acceptance Criteria**
- Exactly 64 gate prompts generated without errors.

---

## Task 4b: Context Packer (Inline Inputs into Each Prompt)
**Estimate:** 30 minutes

**Deliverables**
- `GPT-5/scripts/pack_scoring_input.py`

**Features**
- Inlines **combined-baselines-4.2.json**, `gate-{N}-full.json`, and `hexagram-{N}.json` directly into each prompt file to avoid copy/paste or context misses.

**Acceptance Criteria**
- Packed prompts include all necessary inputs + hard rules and are ready to paste.

---

## Task 5: Process Gates 1–8 (Batch 1)
**Estimate:** 2 hours

**Gates:** 01–08

**Steps per Gate**
1. Use packed prompt.
2. Run GPT-5/Claude.
3. Save outputs.
4. Run validation scripts (Task 13/13b/14b).

**Deliverables**
- 8 weights files
- 8 evidence files
- `GPT-5/batches/batch-1-validation-report.md`

**Acceptance Criteria**
- **Top-2 only** per line; others **0.00**.
- Pairwise invariants respected.
- Weights multiples of 0.01; range OK.
- Beacon matches; keys sorted; canonical names OK.
- Quotes **verbatim**, **≤25 words**, **Legge same-line** gating for any weight >0.50.
- **Non-determinism guard**: same prompt run twice yields identical weights file **hash**; otherwise flag “INSTABILITY”.

---

## Task 6: Process Gates 9–16 (Batch 2)
**Estimate:** 2 hours

**Deliverables**
- 8 weights files, 8 evidence files
- `GPT-5/batches/batch-2-validation-report.md`

**Acceptance Criteria**
- Same as Task 5, including **non-determinism guard**.

---

## Task 7: Process Gates 17–24 (Batch 3)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-3-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 8: Process Gates 25–32 (Batch 4)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-4-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 9: Process Gates 33–40 (Batch 5)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-5-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 10: Process Gates 41–48 (Batch 6)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-6-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 11: Process Gates 49–56 (Batch 7)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-7-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 12: Process Gates 57–64 (Batch 8)
**Estimate:** 2 hours

**Deliverables**
- Files + `batch-8-validation-report.md`

**Acceptance Criteria**
- Same as Task 5.

---

## Task 13: Create Validation Script
**Estimate:** 1 hour

**Deliverables**
- `GPT-5/scripts/validate_gate_outputs.py`

**Checks**
- JSON schema validation (weights/evidence).
- **Top-2 enforcement** (max 2 >0.00 per line).
- **Pairwise invariants** (all).
- **Weights multiples of 0.01**, range [0.00..0.95].
- `_meta.baseline_beacon` matches locked beacon.
- Canonical star names; keys are **NN.L** sorted.
- **sum_unorm** present and equals sum of non-zero weights per line.

**Acceptance Criteria**
- Script fails on first violation with clear error messages.

---

## Task 13b: Quote Verifier (Hard)
**Estimate:** 45 minutes

**Deliverables**
- `GPT-5/scripts/verify_quotes.py`

**Checks**
- **Legge quote** is **verbatim** and appears in `hexagram-{N}.json` for the **same line**.
- **Line Companion** quote is verbatim in `gate-{N}-full.json` (line-agnostic OK).
- **≤25 words** per quote.

**Acceptance Criteria**
- Fails with `{gate}.{line} + system` on first violation.

---

## Task 14: Run Full Validation
**Estimate:** 30 minutes

**Deliverables**
- `GPT-5/VALIDATION_REPORT.md`

**Acceptance Criteria**
- All 64 gates pass Task 13 + 13b checks.

---

## Task 14b: Pairwise Invariant Fuzz Test
**Estimate:** 30 minutes

**Deliverables**
- `GPT-5/scripts/fuzz_invariants.py`
- `GPT-5/INVARIANTS_REPORT.md`

**Acceptance Criteria**
- **Zero** invariant violations across all gates.

---

## Task 15: Create Merge Script
**Estimate:** 1 hour

**Deliverables**
- `GPT-5/scripts/merge_gate_mappings.py`

**Features**
- Merge all weights into `gateLine_star_map_MASTER.json`.
- Merge all evidence into `gateLine_evidence_MASTER.json`.
- Validate merged outputs (schemas + invariants).
- Sort by gate and line.

**Acceptance Criteria**
- Master files contain all **384 lines**; pass validation.

---

## Task 16: Generate Master Files + Statistics
**Estimate:** 30 minutes

**Deliverables**
- `GPT-5/gateLine_star_map_MASTER.json`
- `GPT-5/gateLine_evidence_MASTER.json`
- `GPT-5/STATISTICS_REPORT.md`

**Statistics**
- Weight distribution per system.
- Average weights per system.
- Most/least common systems.
- Confidence level distribution.
- Lines with highest/lowest total weights.
- **Orion-Light vs Orion-Dark co-occurrence** (should be rare and obey down-rank rule).

**Acceptance Criteria**
- Stats computed without errors; files ready for runtime.

---

## Task 17: Compare to Existing Mappings
**Estimate:** 1 hour

**Deliverables**
- `GPT-5/COMPARISON_REPORT.md`

**Metrics**
- Per-system weight deltas.
- Significant changes (thresholded).
- Systems added/removed from top-2.
- Confidence shifts.
- Evidence quality improvements.

**Acceptance Criteria**
- Clear rationale for changes; flags any concerns.

---

## Task 18: Documentation
**Estimate:** 45 minutes

**Deliverables**
- `GPT-5/README.md` (overview & usage)
- `GPT-5/METHODOLOGY.md` (scoring theory + quick_rules)
- `GPT-5/PROMPT_GUIDE.md` (how to run/modify prompts)

**Acceptance Criteria**
- Examples included; troubleshooting for common failures.

---

## Task 19: CI Wiring
**Estimate:** 45 minutes

**Deliverables**
- `.github/workflows/validate.yml`

**Pipeline**
1. Run `scripts/compute_beacon.py`
2. Run `validate_gate_outputs.py`
3. Run `verify_quotes.py`
4. Run `merge_gate_mappings.py` + stats
5. Fail PR on any violation

**Acceptance Criteria**
- CI blocks merges on errors; green CI produces merged master + stats artifacts.

---

## Critical Path
1. Task 0 → Task 1 → Task 2 → Task 3
2. Task 4 + 4b
3. Tasks 5–12 (batches with non-determinism guard)
4. Tasks 13 + 13b + 14 + 14b
5. Tasks 15–16
6. Tasks 17–19

## Total
- **Tasks:** 20
- **Estimated Time:** ~21–22 hours

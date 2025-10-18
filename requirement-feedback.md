Short answer: yes—this is a strong requirements doc. It’s scoped, testable, and lines up with your Figma flow. I’d call it an 8.5–9/10. Here are the few tweaks I’d make before you hand it to Claude:

## Keep (great parts)

* Clear ACs for Why 2.0 + Dossier, provenance, export, and no-network calls.
* UI prefs store + filters.
* E2E coverage for both screens.
* Performance target for /why (<50 ms after data ready).

## Tighten (small edits)

1. **Raw YAML location**

   * Move from `src/data/lore.yaml` → **`data/lore/*.yaml`** (outside `src`) to avoid bundling the raw file.
   * Compile to `src/lib/lore.bundle.ts` (you already require this).

2. **Lore compiler contract**

   * Add: deterministic `rules_hash` (stable hash of rules+sources) and **sorted output**.
   * Add: fail build with readable error if YAML invalid; provide tiny dev fallback.
   * Add: prebuild hooks (`predev`, `prebuild`) must run `compile:lore`.

3. **Classification meta**

   * Add to Requirement 2: include `meta: { lore_version, rules_hash, input_hash }`.
   * Explicitly state **hybrid rule**: second place qualifies when `|p1 - p2| ≤ tieThresholdPct`.
   * Percentages must **sum to 100** (two decimals), with deterministic rounding.

4. **Why 2.0**

   * Add empty states: when filters hide everything, show a “Nothing matches your filters” card.
   * Add performance note: list virtualization (if contributors > 75).

5. **Evidence Matrix columns**

   * Include an **Attribute Type** column (Gate/Channel/Center/Profile/Type/Authority) for quick scanning.

6. **Dossier specifics**

   * Define “Why Not” algorithm: choose the next 1–2 systems by score, list the **top 3 unmatched rules** (by weight) that would most increase them.
   * Signature channel: if multiple channels present, pick the **highest-weight channel-based rule**; else omit gracefully.
   * Sources gallery: de-dup by `id`; show external link if `url` exists; ⚑ for disputed.

7. **Export**

   * PNG export target width/ratio (e.g., 1080×1920 for mobile share).
   * Print CSS: hide animations, darken text for contrast, page-break hints between sections.

8. **Accessibility & safety**

   * Tooltips must be keyboard-reachable; provide `aria-describedby`.
   * Provide **Reduce Motion** respect; no flashing >3 Hz.
   * Keep the insight/entertainment disclaimer on both screens.

9. **CI & tests**

   * CI must run `npm run compile:lore` before build/tests.
   * In Dossier E2E, assert the PNG export yields a **non-empty data URL**.

## Paste-in addendum (minimal changes to your doc)

Add under **Requirement 1**:

* 1.6 The raw YAML SHALL reside outside the bundle at `data/lore/*.yaml` and be compiled into `src/lib/lore.bundle.ts`.
* 1.7 The compiler SHALL output a stable `rules_hash` and write systems/sources/rules in sorted order.
* 1.8 The build pipeline SHALL run `compile:lore` in `predev` and `prebuild`.
* 1.9 On validation failure, the compiler SHALL exit non-zero with a readable error; dev fallback is allowed behind a guard.

Add under **Requirement 2**:

* 2.6 `meta` SHALL include `{ lore_version, rules_hash, input_hash }`.
* 2.7 Percentages SHALL deterministically round to 2 decimals and sum to 100.
* 2.8 Hybrid status SHALL use `|p1 - p2| ≤ tieThresholdPct`.

Amend **Requirement 14**:

* 14.1 Move `lore.yaml` to `data/lore/lore.yaml` (not `src/…`).
* 14.3 The compiler SHALL read `data/lore/*.yaml` and generate `src/lib/lore.bundle.ts`.

Add to **Requirement 9**:

* 9.11 The Dossier SHALL compute “Why Not” via unmatched top-weight rules for the next 1–2 systems.
* 9.12 The Dossier SHALL select a signature channel from the highest-weight channel rule when present.

Add to **Requirement 10**:

* 10.7 PNG exports SHALL target 1080×1920 (or current viewport) and include timestamped filename.
* 10.8 Print styles SHALL disable animations and improve contrast.

If you drop these tweaks in, you’ve got a rock-solid spec Claude can execute cleanly.

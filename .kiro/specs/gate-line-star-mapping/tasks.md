# Implementation Plan

> This pipeline generates `gateLine_star_map.json`, which links every Human Design gate.line to star system archetypes with weights and behavioral rationale. The output is used by the S³ app to score a user's chart into % alignment per star system.

- [x] 1. Create pipeline documentation

  - Create `tasks.md` at repository root with complete pipeline specification
  - Document data sources:
    - Gate line batches in `lore-research/research-outputs/gate-line-API-call/`
    - Star system baselines in `lore-research/research-outputs/star-systems/v4.2/`
  - Document the `mapping_digest` concept and structure
  - Document scoring protocol:
    - core vs shadow alignment
    - weight assignment (0.0–1.0)
    - alignment_type ("core" | "shadow" | "none")
    - behavioral `why`
  - Document merge rules and QC checklist
  - Include archetypal sanity expectations (see Section 5.3)
  - State that the pipeline produces a machine layer (`gateLine_star_map.json`) and preserves provenance in star-system baselines
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Generate `mapping_digest` for all star systems

  - Load and parse all 8 star system baseline JSONs
  - Files:
    - andromeda-baseline-4.2.json
    - arcturus-baseline-4.2.json
    - draco-baseline-4.2.json
    - lyra-baseline-4.2.json
    - orion-dark-baseline-4.2.json
    - orion-light-baseline-4.2.json
    - pleiades-baseline-4.2.json
    - sirius-baseline-4.2.json
  - Location: `lore-research/research-outputs/star-systems/v4.2/`
  - Parse JSON and validate structure
  - _Requirements: 2.1, 2.3_
  - Generate `mapping_digest` for each star system
  - For each baseline file:
    - Extract behavioral themes from `characteristics`, `polarity`, known function/role
    - Build:
      - `core_themes`: healthy / gift expression
      - `shadow_themes`: distorted / control expression
      - `quick_rules`: disambiguation logic, including explicit "do not confuse this with X" guidance
    - Example: Pleiades quick_rules must say "If the behavior is predator scanning / hierarchical enforcement / loyalty control, that's Draco, not Pleiades."
    - Draco quick_rules must say "If the behavior is emotional co-regulation / nervous system soothing / caretaking panic, that's Pleiades, not Draco."
    - Sirius quick_rules must distinguish initiation / liberation / sacred instruction from pure dominance (Draco) and pure emotional bonding (Pleiades).
    - Orion-Light vs Orion-Dark:
      - Orion-Light = honorable trial, spiritual/warrior initiation, ascending through ordeal in service to a higher code.
      - Orion-Dark = empire management, coercive control structures, obedience enforcement, psychological pressure at scale.
    - Keep language behavioral and role-focused (no cosmogenesis lore, no huge quotes).
  - _Requirements: 2.2, 2.4, 2.5, plus disambiguation logic from design.md_
  - Inject `mapping_digest` into star system baseline files
  - Add `mapping_digest` as a new top-level key in each `*-baseline-4.2.json`
  - Preserve all existing fields (bibliography, disputed_points, methodology, consensus_level, polarity, astronomical_component model, etc.)
  - Rewrite updated JSON back to disk with valid syntax
  - Do NOT remove provenance; do NOT rename or relocate the baseline files
  - _Requirements: 2.1, 2.3, 7.1, 7.3, 7.4_

- [x] 3. Generate per-batch mapping files (you can reference task3-reference.md if you need to)

  - Create `star-mapping-drafts` directory
  - Ensure `lore-research/research-outputs/star-mapping-drafts/` exists
  - _Requirements: 3.1_
  - Implement scoring algorithm
  - For each star system:
    - Load that system's `mapping_digest`
    - Use `core_themes` to detect "core" matches
    - Use `shadow_themes` to detect "shadow" matches
    - Use `quick_rules` to avoid misattribution (e.g. don't give Draco weight just because something sounds protective if it's actually emotional caregiving, which is Pleiades)
  - Load one gate-line batch file from `gate-line-API-call/` (gate-line-1.json … gate-line-7.json)
  - For each gate.line in that batch:
    - Compare `behavioral_axis` + `keywords` to `core_themes`
    - Compare `shadow_axis` + `keywords` to `shadow_themes`
    - Apply `quick_rules` to break ties
    - Decide:
      - `weight` (0.0–1.0)
      - `alignment_type` ("core" | "shadow" | "none")
      - `why` (one-sentence behavioral rationale only)
    - Behavioral means: motivation, relational style, survival pattern, bonding pattern, initiation style, control style
    - NOT: channel quotes, mythic cosmology, cosmogenesis timeline, "royal lodge of Sirius said…"
  - _Requirements: 3.3, 3.4, 3.5, 3.6, 6.1, 6.2, 6.3, 6.4_
  - Generate all 56 per-batch mapping files
  - Loop star systems: andromeda, arcturus, draco, lyra, orion-dark, orion-light, pleiades, sirius
  - Loop gate line batches: gate-line-1.json … gate-line-7.json
  - For each [system, batch] pair:
    - Produce a single flat JSON object:
      ```json
      {
        "19.1": {
          "weight": 0.95,
          "alignment_type": "core",
          "why": "Extreme need-sensitivity and bond-maintenance panic maps to Pleiadian nurturing/safety behavior."
        },
        "44.4": {
          "weight": 0.8,
          "alignment_type": "core",
          "why": "Predator scanning, loyalty enforcement, and access control align with Draco survival-through-dominance."
        }
      }
      ```
    - Save to:
      `lore-research/research-outputs/star-mapping-drafts/<system-name>-batch<i>.json`
    - Example: `draco-batch4.json`
    - All weights MUST be numeric
    - No trailing commas, valid JSON required
  - _Requirements: 3.2, 3.7_

- [x] 4. Validate andromeda-batch1 ↔ gates 1-8 (GOLD STANDARD)
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)
  - Status: Corrected by GPT-5, serves as reference standard

- [x] 5. Validate andromeda-batch2 ↔ gates 9-16 (GOLD STANDARD)
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)
  - Status: Corrected by GPT-5, serves as reference standard

- [x] 6. Validate andromeda-batch3 ↔ gates 17-24 (GOLD STANDARD)
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)
  - Status: Corrected by GPT-5, serves as reference standard

- [x] 7. Validate andromeda-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)
  - Verify all gate.line keys exist in corresponding gate-line-N.json files
  - Check no cross-contamination from other batches
  - Validate behavioral rationale aligns with source data

- [ ] 8. Validate andromeda-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)
  - Verify all gate.line keys exist in corresponding gate-line-N.json files
  - Check no cross-contamination from other batches
  - Validate behavioral rationale aligns with source data

- [ ] 9. Validate andromeda-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)
  - Verify all gate.line keys exist in corresponding gate-line-N.json files
  - Check no cross-contamination from other batches
  - Validate behavioral rationale aligns with source data

- [ ] 10. Validate andromeda-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/andromeda-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)
  - Verify all gate.line keys exist in corresponding gate-line-N.json files
  - Check no cross-contamination from other batches
  - Validate behavioral rationale aligns with source data

- [ ] 11. Validate arcturus-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 12. Validate arcturus-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 13. Validate arcturus-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 14. Validate arcturus-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 15. Validate arcturus-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 16. Validate arcturus-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 17. Validate arcturus-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/arcturus-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 18. Validate draco-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 19. Validate draco-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 20. Validate draco-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 21. Validate draco-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 22. Validate draco-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 23. Validate draco-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 24. Validate draco-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/draco-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)
  - Verify gate.line keys match source, no cross-contamination, behavioral alignment

- [ ] 25. Validate lyra-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)

- [ ] 26. Validate lyra-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)

- [ ] 27. Validate lyra-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)

- [ ] 28. Validate lyra-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)

- [ ] 29. Validate lyra-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)

- [ ] 30. Validate lyra-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)

- [ ] 31. Validate lyra-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/lyra-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)

- [ ] 32. Validate orion-dark-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)

- [ ] 33. Validate orion-dark-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)

- [ ] 34. Validate orion-dark-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)

- [ ] 35. Validate orion-dark-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)

- [ ] 36. Validate orion-dark-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)

- [ ] 37. Validate orion-dark-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)

- [ ] 38. Validate orion-dark-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-dark-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)

- [ ] 39. Validate orion-light-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)

- [ ] 40. Validate orion-light-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)

- [ ] 41. Validate orion-light-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)

- [ ] 42. Validate orion-light-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)

- [ ] 43. Validate orion-light-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)

- [ ] 44. Validate orion-light-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)

- [ ] 45. Validate orion-light-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/orion-light-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)

- [ ] 46. Validate pleiades-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)

- [ ] 47. Validate pleiades-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)

- [ ] 48. Validate pleiades-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)

- [ ] 49. Validate pleiades-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)

- [ ] 50. Validate pleiades-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)

- [ ] 51. Validate pleiades-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)

- [ ] 52. Validate pleiades-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/pleiades-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)

- [ ] 53. Validate sirius-batch1 ↔ gates 1-8
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch1.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{1-8}.json`
  - Contains: Gates 1-8 (8 gates, 48 gate.lines total)

- [ ] 54. Validate sirius-batch2 ↔ gates 9-16
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch2.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{9-16}.json`
  - Contains: Gates 9-16 (8 gates, 48 gate.lines total)

- [ ] 55. Validate sirius-batch3 ↔ gates 17-24
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch3.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{17-24}.json`
  - Contains: Gates 17-24 (8 gates, 48 gate.lines total)

- [ ] 56. Validate sirius-batch4 ↔ gates 25-32
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch4.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{25-32}.json`
  - Contains: Gates 25-32 (8 gates, 48 gate.lines total)

- [ ] 57. Validate sirius-batch5 ↔ gates 33-40
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch5.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{33-40}.json`
  - Contains: Gates 33-40 (8 gates, 48 gate.lines total)

- [ ] 58. Validate sirius-batch6 ↔ gates 41-48
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch6.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{41-48}.json`
  - Contains: Gates 41-48 (8 gates, 48 gate.lines total)

- [ ] 59. Validate sirius-batch7 ↔ gates 49-64
  - Mapping: `lore-research/research-outputs/star-mapping-drafts/sirius-batch7.json`
  - Sources: `lore-research/research-outputs/gate-line-API-call/gate-line-{49-64}.json`
  - Contains: Gates 49-64 (16 gates, 96 gate.lines total)

- [ ] 60. Merge per-batch files into canonical lookup

  - Load all 56 per-batch mapping files
  - Extract `<system-name>` from filename
  - Parse JSON into memory
  - For each gate.line key in each file:
    - If `weight > 0`:
      - Append an entry to an array for that gate.line:
        ```json
        {
          "star_system": "<system-name>",
          "weight": <number>,
          "alignment_type": "<core|shadow|none>",
          "why": "<behavioral reason>"
        }
        ```
  - Build final mapping structure
  - Result object shape:
    ```json
    {
      "_meta": {
        "version": "1.0",
        "generated_at_utc": "2025-10-27T00:00:00Z",
        "source_star_system_version": "4.2"
      },
      "19.1": [
        {
          "star_system": "Pleiades",
          "weight": 0.95,
          "alignment_type": "core",
          "why": "..."
        },
        {
          "star_system": "Arcturus",
          "weight": 0.3,
          "alignment_type": "core",
          "why": "..."
        }
      ],
      "44.4": [
        {
          "star_system": "Draco",
          "weight": 0.85,
          "alignment_type": "core",
          "why": "..."
        }
      ]
    }
    ```
  - For each gate.line:
    - Omit systems with `weight === 0.0`
    - Sort that gate.line's array by `weight` descending
  - _Requirements: 4.1, 4.2, 4.3, 4.4, plus `_meta` addition_
  - Write `gateLine_star_map.json`
  - Write to: `lore-research/research-outputs/gateLine_star_map.json`
  - Pretty-print for readability
  - Validate final JSON parses
  - Confirm `_meta` is present with:
    - `version`
    - `generated_at_utc`
    - `source_star_system_version` (should match `4.2`)
  - _Requirements: 4.1, 4.5, plus `_meta` constraint_

- [ ] 61. Run QC validation

  - Coverage check
  - Count expected gate.lines: 64 gates × 6 lines = 384 total
  - Verify every gate.line from gate-line-1.json … gate-line-7.json appears in `gateLine_star_map.json`
  - List any missing gate.lines
  - _Requirements: 5.1_
  - Consistency check
  - Verify every gate.line in `gateLine_star_map.json` has a non-empty array
  - Verify all weights are numbers between 0 and 1
  - Verify `gateLine_star_map.json` parses as valid JSON
  - _Requirements: 5.2, 5.3, 5.4_
  - Sanity check archetypal expectations
  - Gate 19.x → Pleiades core (high weight); MAY have Arcturus secondary (healing/regulation signal)
  - Gate 27.x → Pleiades core (caretaking / feeding / "keep everyone alive"), NOT Draco
  - Gate 32.x → Draco core (survival continuity, loyalty preservation, fear of collapse); MAY also show Orion-Dark in hierarchical continuity / empire survival framing
  - Gate 44.x → Draco core (predator scanning, access control); NOT Pleiades
  - Gate 54.x → Orion-Light or Sirius core (initiation through ordeal, advancement through trial); Draco shadow MAY appear if it's "status climb at any cost"
  - Gate 36.x → Sirius or Orion-Light (initiation via emotional crisis / catalytic ordeal); Pleiades shadow MAY show up if it's crisis-for-attachment / emotional escalation as bonding strategy
  - Record any deviations
  - _Requirements: 5.5 (+ extended sanity rules)_
  - Document QC results in `tasks.md`
  - Append a QC section to this file with:
    - Coverage status (complete / missing which IDs)
    - Consistency status (invalid weights? parsing errors?)
    - Sanity notes on 19.x / 27.x / 32.x / 36.x / 44.x / 54.x
    - Any weird cross-system bleed that needs manual review
  - If there are unresolved issues (for example: a batch file failed to parse, or some gate.lines are missing), DO NOT silently mark the pipeline as "done."
  - Instead: mark QC as **incomplete** and list blockers.
  - _Requirements: 5.6, plus explicit fail-handling_

- [ ] 62. Update pipeline STATUS
  - Update root `tasks.md` STATUS section
  - Mark each phase:
    - mapping_digest added ✔ / ✘
    - per-batch drafts generated ✔ / ✘
    - gateLine_star_map.json merged ✔ / ✘
    - QC complete ✔ / ✘
  - Include:
    - generation timestamp (UTC)
    - `_meta.version` in `gateLine_star_map.json`
    - `source_star_system_version` used
  - If QC is incomplete, explain exactly why and what needs human review next
  - _Requirements: 1.4, 5.6_

---

## STATUS (to be filled by the agent)

- mapping_digest injected into all star systems: ✘
- per-batch mapping drafts (8×7 = 56 files) generated: ✘
- gateLine_star_map.json created with \_meta: ✘
- QC coverage / consistency / sanity complete: ✘
- Ready for runtime use in S³ app: ✘
- Timestamp (UTC): [to be filled]
- Source star system baseline version: 4.2

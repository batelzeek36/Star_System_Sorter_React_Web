 Goal: ship “Why 2.0 + Dossier” without breaking the MVP. ( be sure to move lore.yaml and prompt2.md into the appropriate folder for organization. )

# PLAN

1. Analyze repo → confirm file tree & tokens. DO NOT GUESS files. Print summaries.
2. Implement a data-driven Why 2.0 and a new `/dossier` route that renders a comprehensive “Galactic Dossier” view.
3. Wire both to existing classification output (contributors, sources, lore_version) and compiled lore bundle.
4. Add light tests + share/export hooks.

# CONSTRAINTS

- Keep Sort Result screen unchanged (only add link to Why + Dossier).
- Only modify/create files listed below.
- Follow existing Tailwind tokens (no new hexes).
- No secrets in client; no network calls from Why/Dossier.
- Prefer files ≤300 LOC.

# READ THESE FILES FIRST (print short summaries)

- lore.yaml (workspace root - source data for lore bundle)
- package.json, vite config
- src/App.tsx, src/main.tsx, src/index.css
- src/screens/ResultScreen.tsx, src/screens/WhyScreen.tsx
- src/store/birthDataStore.ts
- src/lib/scorer.ts, src/lib/schemas.ts
- src/lib/lore.bundle.ts (or compile output if different)
- src/components/figma/\* (list available - Button, Card, Chip, Field, Toast, Crests, etc.)
- tests/e2e/user-flow.spec.ts

# FIGMA COMPONENT LIBRARY

All UI primitives already exist in src/components/figma/:

- Button (primary, secondary, ghost, destructive variants; sm/md/lg sizes; with icon, loading, disabled states)
- Card (default, emphasis, warning variants)
- Chip (default with %, selectable, dismissable variants)
- Field (form inputs)
- Toast (notifications)
- StarSystemCrests (Pleiades, Sirius, Lyra, Andromeda, Orion, Arcturus)

**IMPORTANT**: New lore components (SourceBadge, ContributionCard, etc.) should COMPOSE from these existing Figma components, not build new primitives.

# IMPLEMENTATION (PATCHES)

A) Components (new - compose from existing Figma components)

- src/components/lore/SourceBadge.tsx
  Props: { id, title, author?, year?, disputed?: boolean }
  Uses: Chip component (selectable variant)
  Renders pill; shows ⚑ if disputed; tooltip w/ author/year.

- src/components/lore/ContributionCard.tsx
  Props: { systemId, ruleId, weight, rationale, sources: string[], confidence: 1|2|3|4|5 }
  Uses: Card, Chip (for sources), Button (for collapse)
  Shows % bar, rationale, SourceBadge list; collapsible details.

- src/components/lore/SystemSummary.tsx
  Props: { bySystem, primary, maybeHybrid?, loreVersion }
  Uses: Card, Chip (with percentages)
  Shows top systems, hybrid note, lore version.

- src/components/lore/EvidenceMatrix.tsx
  Props: { contributorsPerSystem, activeSystemId }
  Uses: Card, Button (for filters)
  Table view with simple filters (hide disputed, min confidence).

B) Why 2.0 (refactor /why)

- Keep route /why.
- Top: <SystemSummary/> using store classification.
- Tabs: [Primary, Allies…] default Primary.
- Body: contributorsPerSystem[activeSystemId] sorted desc → <ContributionCard/>.
- Controls: “Hide disputed” (default ON), “Min confidence >= 2”.
- Footer: “Lore v{lore_version} • Deterministic rules engine. For insight & entertainment.”

C) Dossier route

- New: src/screens/DossierScreen.tsx; add route `/dossier`.
- Sections (data-driven, no network):
  1. Identity Snapshot (type, authority, profile, defined centers, signature channel if present).
  2. One-Line Verdict (Primary + maybeHybrid + system descriptions from lore bundle).
  3. “Why Not” panel: closest non-selected systems & key missing features (compute from unmatched rules).
  4. Deployment Matrix: Primary/Secondary/Tertiary from bySystem ranking.
  5. Gate→Faction Grid: reuse <EvidenceMatrix/> in table mode.
  6. Sources gallery: dedup SourceBadge list (show ⚑ disputed).
- Actions: [Generate Narrative] (route to existing flow/placeholder), [Export PNG] (html-to-image), [Print/PDF] (print CSS).

D) ResultScreen link

- Add secondary button “Open Dossier” → navigate("/dossier").

E) UI prefs slice (new)

- src/store/uiStore.ts: { hideDisputed: true, minConfidence: 2 } + actions.

F) Types

- Ensure Contributor = { ruleId:string; w:number; rationale:string; sources:string[]; confidence:1|2|3|4|5 }.
- classification.meta.lore_version required.

G) Styling

- Use existing gradients/radii/shadows; match Figma; no new colors.

H) Tests

- tests/e2e/why.spec.ts: visit /why, toggle “Hide disputed”, expect disputed flags hidden.
- tests/e2e/dossier.spec.ts: visit /dossier, expect Identity Snapshot, Deployment Matrix, Sources gallery.

# ACCEPTANCE CRITERIA

- /why renders contributors with provenance; <50ms render after store ready.
- /dossier exports a non-empty PNG; no network calls; print CSS works.
- Disputed sources hidden when toggle on.
- Existing happy-path e2e passes.

# COMMANDS TO RUN

- npm run dev (no TS errors)
- npm run e2e

# NOTES

- If src/lib/lore.bundle.ts is missing, create a tiny compile step or import the provided YAML bundle; keep it precompiled in repo for now.
- Do not alter Sort Result visuals; only add the Dossier link.

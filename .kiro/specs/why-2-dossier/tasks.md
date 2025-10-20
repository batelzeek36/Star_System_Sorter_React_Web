# Implementation Plan - Why 2.0 + Dossier

## Phase 0: Repository & CI Setup

- [x] 0. Prepare repository and CI pipeline
- [x] 0.1 Pin Node version

  - Create .nvmrc with Node ≥18
  - Update CI configuration to use Node ≥18
  - _Requirements: 16.1_

- [x] 0.2 Add essential npm scripts

  - Add "compile:lore": "tsx scripts/compile-lore.ts"
  - Add "typecheck": "tsc -p tsconfig.json --noEmit"
  - Ensure "lint": "eslint ." exists
  - _Requirements: 16.1, 16.2_

- [x] 0.3 Set up pre-commit hooks

  - Configure pre-commit to run lint, typecheck, and fast unit tests
  - _Requirements: 16.4_

- [x] 0.4 Update CI pipeline
  - Add npm run compile:lore before build and tests in CI
  - Ensure CI runs typecheck and lint
  - _Requirements: 16.4, 16.5_

## Phase 1: Foundation & Data Layer

- [x] 1. Set up lore data structure and compiler
- [x] 1.1 Move lore.yaml to data/lore/lore.yaml

  - Create data/lore/ directory
  - Move lore.yaml from workspace root
  - Update .gitignore if needed
  - _Requirements: 14.1, 14.2_

- [x] 1.2 Create lore bundle TypeScript interfaces

  - Define LoreSource, LoreRule, LoreSystem, LoreBundle interfaces in src/lib/schemas.ts
  - Add Zod schemas for validation
  - Export types for use in compiler and scorer
  - _Requirements: 1.2, 1.3_

- [x] 1.3 Implement lore compiler script

  - Create scripts/compile-lore.ts
  - Read data/lore/\*.yaml files (support multiple files)
  - Dedup policy: fail with readable error on duplicate IDs (no silent last-writer-wins)
  - Validate with Zod schemas (enforce id format: ^[a-z0-9_]+$, channelsAny: string[] only)
  - Sort systems/sources/rules alphabetically by ID
  - Compute rules_hash using SHA-256
  - Generate src/lib/lore.bundle.ts with typed exports
  - Exit non-zero with readable error on validation failure
  - Emit dev banner if bundle missing (for Why/Dossier friendly alert)
  - _Requirements: 1.1, 1.6, 1.7, 1.9_

- [x] 1.4 Integrate compiler into build pipeline

  - Add "compile:lore": "tsx scripts/compile-lore.ts" to package.json
  - Add "predev": "npm run compile:lore" to package.json
  - Add "prebuild": "npm run compile:lore" to package.json
  - Test that dev server runs compiler automatically
  - _Requirements: 1.8, 16.1, 16.2, 16.3_

- [x] 1.5 Write unit tests for lore compiler
  - Test bundle structure validation
  - Test rules_hash stability (same input → same hash)
  - Test source lookup by ID
  - Test error handling for invalid YAML
  - _Requirements: 1.3, 1.9_

## Phase 2: Enhanced Classification

- [ ] 2. Enhance scorer with provenance metadata
- [x] 2.1 Update scorer to import lore bundle

  - Import loreBundle from ./lore.bundle in src/lib/scorer.ts
  - Match HD attributes to lore rules
  - Create EnhancedContributor interface with ruleId, rationale, sources, confidence
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 2.2 Implement deterministic percentage rounding

  - Implement largest remainder (Hamilton) rounding algorithm
  - Round to 2 decimal places
  - Ensure percentages sum to exactly 100.00
  - _Requirements: 2.7_

- [x] 2.3 Add input hash and rules hash to classification meta

  - Compute input_hash from normalized HD data (sorted arrays)
  - Add lore_version, rules_hash, input_hash to meta object
  - Maintain backward compatibility with deprecated fields
  - _Requirements: 2.6_

- [x] 2.4 Update hybrid classification logic

  - Implement hybrid rule: |p1 - p2| ≤ tieThresholdPct
  - Ensure deterministic tie-breaking
  - _Requirements: 2.8_

- [x] 2.5 Write unit tests for enhanced scorer

  - Property test: percentage rounding via largest remainder sums to 100.00 (1k randomized vectors)
  - Test input hash stability (same HD data → same hash)
  - Test enhanced contributor output includes all required fields
  - Test hybrid classification threshold (Δ === tieThresholdPct qualifies as hybrid)
  - Test synergy multiplier path (if applicable)
  - _Requirements: 2.7, 2.8_

- [x] 2.6 Add rules_hash mismatch detection
  - Persist meta.rules_hash in birthDataStore
  - On classification load, compare persisted rules_hash with current loreBundle.rules_hash
  - If mismatch, show "Recompute with new lore" banner/button
  - _Requirements: 2.6_

## Phase 3: UI State Management

- [x] 3. Create UI preferences store
- [x] 3.1 Implement uiStore with Zustand
  - Create src/store/uiStore.ts
  - Define UIState interface with hideDisputed (default: true) and minConfidence (default: 2)
  - Add version: 1 to store for future schema migrations
  - Implement setHideDisputed and setMinConfidence actions
  - Add Zustand persist middleware for localStorage
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

## Phase 4: Lore UI Components

- [x] 4. Build SourceBadge component
- [x] 4.1 Create SourceBadge component

  - Create src/components/lore/SourceBadge.tsx
  - Accept sourceId and showTooltip props
  - Look up source from loreBundle.sources
  - Compose from Figma Chip component (selectable variant)
  - Prepend ⚑ flag if disputed
  - Make focusable (tabIndex=0) with aria-describedby for tooltip
  - Ensure tooltip is keyboard-accessible
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 15.1_

- [x] 5. Build ContributionCard component
- [x] 5.1 Create ContributionCard component

  - Create src/components/lore/ContributionCard.tsx
  - Accept contributor, totalWeight, systemId props
  - Compose from Figma Card, Chip, Button components
  - Display percentage bar showing (weight / totalWeight) \* 100
  - Show rationale text from lore rule
  - Render SourceBadge components for each source
  - Display confidence level as filled/empty dots (●●○○○)
  - Implement collapsible details section with Button toggle
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 6. Build SystemSummary component
- [x] 6.1 Create SystemSummary component

  - Create src/components/lore/SystemSummary.tsx
  - Accept classification prop
  - Compose from Figma Card (emphasis variant) and Chip components
  - Display top 3 star systems with percentages using Chip components
  - Show hybrid indicator with format: "Hybrid: Pleiades + Sirius (Δ 3.2%)"
  - Display lore version number
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 7. Build EvidenceMatrix component
- [x] 7.1 Create EvidenceMatrix component (review to see if already done or not)
  - Create src/components/lore/EvidenceMatrix.tsx
  - Accept contributors and activeSystemId props
  - Compose from Figma Card and Button components
  - Display table with columns: Attribute Type (Gate/Channel/Center/Profile/Type/Authority), Attribute, Weight, Confidence, Sources
  - Implement "Hide disputed" toggle filter
  - Implement "Min confidence" slider filter (1-5)
  - Highlight active star system's contributors
  - Sort contributors by weight descending
  - Virtualize table rows when >75 contributors (guard for mobile perf)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

## Phase 5: Why 2.0 Screen Refactor

- [ ] 8. Refactor Why screen with enhanced features
- [x] 8.1 Add SystemSummary to Why screen

  - Import and render SystemSummary component at top of WhyScreen
  - Pass classification from birthDataStore
  - _Requirements: 8.1_

- [x] 8.2 Implement tabbed navigation for star systems

  - Add tabs for Primary and Ally star systems
  - Set default active tab to primary system
  - Update displayed contributors when tab changes
  - _Requirements: 8.2_

- [x] 8.3 Integrate filters from UI store

  - Connect hideDisputed and minConfidence from uiStore
  - Filter contributors based on disputed sources and confidence level
  - Memoize filtered contributors for performance
  - _Requirements: 8.4, 8.9_

- [x] 8.4 Render ContributionCard list

  - Map filtered contributors to ContributionCard components
  - Sort by weight descending
  - Pass totalWeight for percentage calculation
  - _Requirements: 8.3_

- [x] 8.5 Add empty state for filtered results

  - Show "Nothing matches your filters." card when filteredContributors.length === 0
  - Suggest adjusting filter preferences
  - _Requirements: 8.8_

- [x] 8.6 Add footer with lore version and disclaimer

  - Display "Lore v{lore_version} • Deterministic rules engine. For insight & entertainment."
  - Use hybrid copy format: "Hybrid: Pleiades + Sirius (Δ 3.2%)" for hybrid classifications
  - _Requirements: 8.5_

- [x] 8.7 Implement list virtualization for large contributor lists

  - Add @tanstack/react-virtual dependency if needed
  - Implement virtualization when contributors > 75
  - _Requirements: 8.9_

- [x] 8.8 Verify Why 2.0 performance target
  - Ensure render completes in <50ms after classification data available
  - Profile and optimize if needed
  - _Requirements: 8.6_

## Phase 6: Dossier Screen

- [ ] 9. Create Dossier screen with all sections
- [x] 9.1 Create DossierScreen component skeleton

  - Create src/screens/DossierScreen.tsx
  - Add lazy-loaded route in src/App.tsx: /dossier
  - Set up basic layout with starfield background
  - Add navigation guard (redirect to /input if no classification)
  - _Requirements: 9.1, 9.2, 9.10_

- [x] 9.2 Implement Identity Snapshot section

  - Display type, authority, profile from hdData
  - List defined centers
  - Compute signature channel: highest-weight channel rule; tie-break by lower channel number, then alphabetical
  - Display "—" if no channel rules matched
  - _Requirements: 9.3, 9.12_

- [x] 9.3 Implement One-Line Verdict section

  - Format verdict based on primary/hybrid classification
  - Include system descriptions from lore bundle
  - Use emphasis Card variant
  - _Requirements: 9.4_

- [x] 9.4 Implement "Why Not" panel

  - Compute next 1-2 systems by score (skip hybrid pair if applicable)
  - Find top 3 unmatched rules for each system
  - Sort unmatched rules by: weight desc → confidence desc → ID asc
  - Display missing factors that would increase each system's score
  - _Requirements: 9.5, 9.11_

- [x] 9.5 Implement Deployment Matrix section

  - Rank all systems by percentage
  - Display table with columns: Rank (Primary/Secondary/Tertiary), System, Alignment %, Role (description)
  - _Requirements: 9.6_

- [x] 9.6 Implement Gate→Faction Grid section

  - Reuse EvidenceMatrix component
  - Pass all contributors and active system ID
  - _Requirements: 9.7_

- [x] 9.7 Implement Sources Gallery section

  - Deduplicate sources by ID from all contributors
  - Render SourceBadge components with tooltips
  - Sort alphabetically by title
  - Add legend: "⚑ = Disputed or controversial lore"
  - _Requirements: 9.8_

- [x] 9.8 Verify Dossier makes no network calls
  - Audit component for any fetch/axios calls
  - Ensure all data comes from store and lore bundle
  - Add unit test: stub fetch and fail if called
  - _Requirements: 9.9_

## Phase 7: Export Functionality

- [ ] 10. Implement export actions for Dossier
- [x] 10.1 Add html-to-image dependency

  - Install html-to-image@^1.11.11
  - _Requirements: 10.2_

- [x] 10.2 Implement PNG export

  - Add "Export PNG" button with primary variant
  - Use html-to-image toPng function
  - Target 1080×1920 resolution (or current viewport)
  - Cap pixelRatio at 2 to guard memory on mobile
  - Generate timestamped filename: dossier-{primarySystem}-{timestamp}.png
  - Trigger download via anchor element
  - _Requirements: 10.1, 10.2, 10.3, 10.8_

- [x] 10.3 Implement Print/PDF functionality

  - Add "Print/PDF" button with secondary variant
  - Trigger browser print dialog on click
  - _Requirements: 10.4, 10.5_

- [x] 10.4 Add print-specific CSS

  - Create @media print styles
  - Disable animations and transitions
  - Improve text contrast for readability
  - Add page-break-inside: avoid to major sections
  - Add page-break hints between sections
  - Hide non-printable elements (.no-print class)
  - _Requirements: 10.6, 10.9, 10.10_

- [x] 10.5 Add "Generate Narrative" button
  - Add button with ghost variant
  - Route to placeholder or existing narrative flow
  - _Requirements: 10.7_

## Phase 8: Result Screen Integration

- [ ] 11. Add Dossier link to Result screen
- [x] 11.1 Add "Open Dossier" button to ResultScreen
  - Add secondary Button below "View Why" button
  - Navigate to /dossier on click
  - Maintain 44px minimum touch target
  - Verify Result screen layout remains unchanged except for new button
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

## Phase 9: File Organization

- [ ] 12. Organize project files
- [ ] 12.1 Move prompt2.md to spec directory

  - Move prompt2.md to .kiro/specs/why-2-dossier/prompt.md
  - _Requirements: 14.2_

- [ ] 12.2 Verify lore.yaml location
  - Confirm lore.yaml is at data/lore/lore.yaml
  - Update any remaining import paths
  - _Requirements: 14.1, 14.4_

## Phase 10: Testing

- [ ] 13. Write E2E tests for Why 2.0
- [ ] 13.1 Create why.spec.ts

  - Create tests/e2e/why.spec.ts
  - Test: Navigate to /why after completing classification
  - Test: Toggle "Hide disputed" filter
  - Test: Verify disputed source badges (⚑) are hidden when filter is active
  - Test: Verify disputed source badges are visible when filter is inactive
  - Ensure test completes in <10 seconds
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 14. Write E2E tests for Dossier
- [ ] 14.1 Create dossier.spec.ts

  - Create tests/e2e/dossier.spec.ts
  - Test: Navigate to /dossier after completing classification
  - Test: Verify Identity Snapshot section is visible
  - Test: Verify Deployment Matrix section is visible
  - Test: Verify Sources Gallery section is visible
  - Test: Verify Export PNG button is present
  - Test: Verify Print/PDF button is present
  - Test: Assert PNG export yields non-empty data URL
  - Ensure test completes in <10 seconds
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9_

- [ ] 15. Verify existing tests pass
- [ ] 15.1 Run existing E2E test suite
  - Run tests/e2e/user-flow.spec.ts
  - Verify all existing tests pass
  - Fix any regressions
  - _Requirements: 17.3_

## Phase 11: Accessibility & Polish

- [ ] 16. Implement accessibility features
- [ ] 16.1 Verify keyboard accessibility

  - Test all tooltips are keyboard-reachable
  - Verify tab order: filters → tabs → cards
  - Test Escape key closes expanded cards
  - Test Arrow keys navigate tabs
  - _Requirements: 15.1_

- [ ] 16.2 Add reduced motion support

  - Implement @media (prefers-reduced-motion: reduce) styles
  - Disable animations for contribution cards and starfield
  - Ensure no animations flash >3 Hz
  - _Requirements: 15.2, 15.3_

- [ ] 16.3 Verify disclaimers on all screens

  - Confirm insight/entertainment disclaimer on Why screen
  - Confirm disclaimer on Dossier screen
  - _Requirements: 15.4_

- [ ] 16.4 Verify touch target sizes
  - Audit all interactive elements for 44px minimum
  - Fix any elements below threshold
  - _Requirements: 15.5_

## Phase 12: Final Verification

- [ ] 17. Verify no breaking changes
- [ ] 17.1 Verify TypeScript compilation

  - Run npm run build
  - Ensure zero TypeScript errors
  - _Requirements: 17.4_

- [ ] 17.2 Verify CSS tokens

  - Audit all new components for color usage
  - Ensure only existing Tailwind tokens are used
  - Verify no new hex color values
  - _Requirements: 17.5_

- [ ] 17.3 Verify file sizes

  - Check all new files are ≤300 LOC where possible
  - Refactor any files exceeding limit
  - _Requirements: 17.6_

- [ ] 17.4 Run full test suite

  - Run npm run test (unit tests)
  - Run npm run test:e2e (E2E tests)
  - Verify all tests pass
  - _Requirements: 17.3_

- [ ] 17.5 Verify all routes work

  - Test navigation: / → /input → /result → /why → /dossier
  - Verify back navigation works
  - Confirm lazy loading works for Dossier
  - _Requirements: 17.2_

- [ ] 17.6 Performance audit

  - Verify Why 2.0 renders in <50ms
  - Verify Dossier renders in <200ms
  - Check bundle size increase is <50KB gzipped
  - _Requirements: 17.1_

- [ ] 17.7 Add route guards
  - If classification missing on /why or /dossier, redirect to /input
  - Show toast: "Add birth details first."
  - _Requirements: 9.1_

## Phase 13: Documentation & Manual QA

- [ ] 18. Add documentation and manual QA
- [ ] 18.1 Update README

  - Add section: "How to add/modify lore"
  - Add section: "How the compiler validates"
  - Add section: "How to run tests"
  - _Requirements: 17.1_

- [ ] 18.2 Manual QA script

  - Test full flow: / → /input → /result → /why → /dossier
  - Test back navigation
  - Test print to PDF
  - Test export PNG
  - Verify all filters work
  - Test on mobile viewport
  - _Requirements: 17.5_

- [ ]\* 18.3 Optional: Dev CLI for classification
  - Add npm script: classify -- --date YYYY-MM-DD --time HH:MM --tz TIMEZONE
  - Prints classification JSON to console
  - Useful for debugging lore rules
  - _Requirements: None (optional developer tool)_

# Requirements Document - Why 2.0 + Dossier

## Introduction

This feature enhances the Star System Sorter with a data-driven "Why 2.0" screen and a comprehensive "Galactic Dossier" view. The enhancement provides users with detailed provenance for their classification results, including source citations, confidence levels, and disputed lore flags. The Dossier screen offers an exportable, comprehensive report of the user's star system alignment with identity snapshot, deployment matrix, and evidence grid.

## Glossary

- **System**: Star System Sorter (S³) web application
- **User**: Individual accessing the application to discover their star system classification
- **Lore Bundle**: Compiled YAML data structure containing star system rules, sources, and metadata
- **Contributor**: A Human Design attribute (type, authority, profile, center, channel, gate) that contributes weight to a star system classification
- **Source**: A reference work cited in the lore bundle (e.g., "The Law of One", "Prism of Lyra")
- **Disputed Source**: A source marked with disputed: true in the lore bundle, indicating controversial or unverified lore
- **Confidence Level**: Integer 1-5 rating indicating the reliability of a classification rule
- **Classification Result**: The computed star system alignment including primary/hybrid designation, percentages, and contributors
- **UI Store**: Zustand state management store for user interface preferences
- **HD Data**: Human Design birth chart data extracted from the BodyGraph API
- **Provenance**: The traceable origin and reasoning behind a classification decision

## Requirements

### Requirement 1: Lore Bundle Integration

**User Story:** As a developer, I want the lore.yaml file compiled into a TypeScript module, so that classification rules and source metadata are available at runtime without network calls.

#### Acceptance Criteria

1. WHEN THE System builds the application, THE System SHALL compile lore.yaml into a TypeScript module at src/lib/lore.bundle.ts
2. THE lore.bundle.ts module SHALL export a LoreBundle type containing systems, sources, rules, lore_version, and tieThresholdPct
3. THE System SHALL validate the lore bundle structure against a Zod schema during compilation
4. THE System SHALL make the lore bundle available for import by scorer.ts and UI components
5. THE System SHALL include source metadata (id, title, author, year, disputed) in the bundle
6. THE raw YAML SHALL reside outside the bundle at data/lore/lore.yaml and be compiled into src/lib/lore.bundle.ts
7. THE compiler SHALL output a stable rules_hash and write systems/sources/rules in sorted order
8. THE build pipeline SHALL run compile:lore in predev and prebuild scripts
9. WHEN validation fails, THE compiler SHALL exit non-zero with a readable error message

### Requirement 2: Enhanced Classification Output

**User Story:** As a user, I want my classification results to include detailed contributor information with sources and confidence levels, so that I understand the provenance of my star system alignment.

#### Acceptance Criteria

1. WHEN THE System computes a classification, THE System SHALL include a contributors array for each star system
2. THE Contributor object SHALL contain ruleId, weight, rationale, sources array, and confidence level (1-5)
3. THE ClassificationResult SHALL include a lore_version field in the meta object
4. THE System SHALL sort contributors by weight in descending order
5. THE System SHALL preserve all contributor metadata from the lore bundle rules
6. THE meta object SHALL include lore_version, rules_hash, and input_hash fields
7. THE System SHALL round percentages deterministically to 2 decimal places and ensure they sum to 100
8. THE System SHALL determine hybrid status WHEN the absolute difference between first and second place is less than or equal to tieThresholdPct

### Requirement 3: UI Preferences Store

**User Story:** As a user, I want to control which contributors are displayed (hiding disputed sources and low-confidence rules), so that I can focus on the most reliable classification factors.

#### Acceptance Criteria

1. THE System SHALL create a uiStore.ts Zustand store at src/store/uiStore.ts
2. THE UI Store SHALL maintain hideDisputed boolean state with default value true
3. THE UI Store SHALL maintain minConfidence number state with default value 2
4. THE UI Store SHALL provide setHideDisputed and setMinConfidence actions
5. THE UI Store SHALL persist preferences to localStorage

### Requirement 4: Source Badge Component

**User Story:** As a user, I want to see visual badges for source citations with disputed flags, so that I can quickly identify the origin and reliability of lore.

#### Acceptance Criteria

1. THE System SHALL create a SourceBadge component at src/components/lore/SourceBadge.tsx
2. THE SourceBadge SHALL compose from the existing Figma Chip component
3. WHEN a source is disputed, THE SourceBadge SHALL display a ⚑ flag icon
4. THE SourceBadge SHALL show a tooltip with author and year on hover
5. THE SourceBadge SHALL use the selectable Chip variant with lavender styling

### Requirement 5: Contribution Card Component

**User Story:** As a user, I want to see individual contributor cards showing weight, rationale, and sources, so that I understand each factor's impact on my classification.

#### Acceptance Criteria

1. THE System SHALL create a ContributionCard component at src/components/lore/ContributionCard.tsx
2. THE ContributionCard SHALL compose from Figma Card, Chip, and Button components
3. THE ContributionCard SHALL display a percentage bar showing the contributor's weight relative to total
4. THE ContributionCard SHALL show the rationale text from the lore rule
5. THE ContributionCard SHALL render SourceBadge components for each source citation
6. THE ContributionCard SHALL support collapsible details with a Button toggle
7. THE ContributionCard SHALL display confidence level as 1-5 stars or dots

### Requirement 6: System Summary Component

**User Story:** As a user, I want to see a summary of my top star systems with percentages and hybrid status, so that I have a quick overview of my classification.

#### Acceptance Criteria

1. THE System SHALL create a SystemSummary component at src/components/lore/SystemSummary.tsx
2. THE SystemSummary SHALL compose from Figma Card and Chip components
3. THE SystemSummary SHALL display the top 3 star systems with percentages
4. WHEN classification is hybrid, THE SystemSummary SHALL show a hybrid indicator
5. THE SystemSummary SHALL display the lore version number
6. THE SystemSummary SHALL use emphasis Card variant for visual prominence

### Requirement 7: Evidence Matrix Component

**User Story:** As a user, I want to see a filterable table of all contributors across star systems, so that I can analyze the evidence supporting my classification.

#### Acceptance Criteria

1. THE System SHALL create an EvidenceMatrix component at src/components/lore/EvidenceMatrix.tsx
2. THE EvidenceMatrix SHALL compose from Figma Card and Button components
3. THE EvidenceMatrix SHALL display contributors in a table format with columns: Attribute Type, Attribute, Weight, Confidence, Sources
4. THE EvidenceMatrix SHALL include an Attribute Type column showing Gate/Channel/Center/Profile/Type/Authority
5. THE EvidenceMatrix SHALL provide a "Hide disputed" toggle filter
6. THE EvidenceMatrix SHALL provide a "Min confidence" slider filter (1-5)
7. THE EvidenceMatrix SHALL highlight the active star system's contributors
8. THE EvidenceMatrix SHALL sort contributors by weight descending

### Requirement 8: Why 2.0 Screen Refactor

**User Story:** As a user, I want an enhanced Why screen with tabbed navigation and filterable contributors, so that I can explore the detailed reasoning behind my classification.

#### Acceptance Criteria

1. THE System SHALL refactor WhyScreen.tsx to display SystemSummary at the top
2. THE WhyScreen SHALL provide tabs for Primary and Ally star systems
3. THE WhyScreen SHALL display ContributionCard components for the active system's contributors
4. THE WhyScreen SHALL integrate hideDisputed and minConfidence filters from UI Store
5. THE WhyScreen SHALL show a footer with lore version and disclaimer
6. THE WhyScreen SHALL render in under 50ms after classification data is available
7. THE WhyScreen SHALL maintain the existing cosmic theme and Figma component styling
8. WHEN filters hide all contributors, THE WhyScreen SHALL display a "Nothing matches your filters" empty state card
9. WHEN contributors exceed 75 items, THE WhyScreen SHALL implement list virtualization for performance

### Requirement 9: Dossier Screen

**User Story:** As a user, I want a comprehensive Galactic Dossier view that I can export, so that I have a complete report of my star system alignment.

#### Acceptance Criteria

1. THE System SHALL create a DossierScreen component at src/screens/DossierScreen.tsx
2. THE DossierScreen SHALL be accessible via the /dossier route
3. THE DossierScreen SHALL display an Identity Snapshot section with type, authority, profile, defined centers, and signature channel
4. THE DossierScreen SHALL display a One-Line Verdict section with primary/hybrid status and system descriptions
5. THE DossierScreen SHALL display a "Why Not" panel showing closest non-selected systems and missing features
6. THE DossierScreen SHALL display a Deployment Matrix ranking systems as Primary/Secondary/Tertiary
7. THE DossierScreen SHALL display a Gate→Faction Grid using the EvidenceMatrix component
8. THE DossierScreen SHALL display a Sources Gallery with deduplicated SourceBadge components
9. THE DossierScreen SHALL make no network calls (all data from store and lore bundle)
10. THE DossierScreen SHALL maintain the cosmic theme with starfield background
11. THE DossierScreen SHALL compute "Why Not" by selecting the next 1-2 systems by score and listing the top 3 unmatched rules by weight that would most increase their scores
12. WHEN multiple channels are present, THE DossierScreen SHALL select the signature channel from the highest-weight channel-based rule

### Requirement 10: Dossier Export Actions

**User Story:** As a user, I want to export my Dossier as PNG or PDF, so that I can save and share my star system report.

#### Acceptance Criteria

1. THE DossierScreen SHALL provide an "Export PNG" button
2. WHEN the user clicks "Export PNG", THE System SHALL use html-to-image library to generate a PNG
3. THE System SHALL download the PNG with filename format: dossier-{primarySystem}-{date}.png
4. THE DossierScreen SHALL provide a "Print/PDF" button
5. WHEN the user clicks "Print/PDF", THE System SHALL trigger the browser print dialog
6. THE System SHALL apply print-specific CSS to optimize the Dossier layout for printing
7. THE DossierScreen SHALL provide a "Generate Narrative" button that routes to a placeholder or existing flow
8. THE PNG export SHALL target 1080×1920 resolution or current viewport dimensions and include a timestamped filename
9. THE print styles SHALL disable animations and improve text contrast for readability
10. THE print styles SHALL include page-break hints between major sections

### Requirement 11: Result Screen Dossier Link

**User Story:** As a user, I want a button on the Result screen to open the Dossier, so that I can access the comprehensive report.

#### Acceptance Criteria

1. THE ResultScreen SHALL display a secondary "Open Dossier" button below the "View Why" button
2. WHEN the user clicks "Open Dossier", THE System SHALL navigate to /dossier
3. THE button SHALL use the Figma Button component with secondary variant
4. THE button SHALL maintain 44px minimum touch target size
5. THE ResultScreen layout SHALL remain unchanged except for the added button

### Requirement 12: E2E Tests for Why 2.0

**User Story:** As a developer, I want E2E tests for the Why 2.0 screen, so that I can verify the filtering functionality works correctly.

#### Acceptance Criteria

1. THE System SHALL create tests/e2e/why.spec.ts
2. THE test SHALL navigate to /why after completing classification
3. THE test SHALL toggle the "Hide disputed" filter
4. THE test SHALL verify disputed source badges are hidden when filter is active
5. THE test SHALL verify disputed source badges are visible when filter is inactive
6. THE test SHALL complete in under 10 seconds

### Requirement 13: E2E Tests for Dossier

**User Story:** As a developer, I want E2E tests for the Dossier screen, so that I can verify all sections render correctly.

#### Acceptance Criteria

1. THE System SHALL create tests/e2e/dossier.spec.ts
2. THE test SHALL navigate to /dossier after completing classification
3. THE test SHALL verify the Identity Snapshot section is visible
4. THE test SHALL verify the Deployment Matrix section is visible
5. THE test SHALL verify the Sources Gallery section is visible
6. THE test SHALL verify the Export PNG button is present
7. THE test SHALL verify the Print/PDF button is present
8. THE test SHALL assert that PNG export yields a non-empty data URL
9. THE test SHALL complete in under 10 seconds

### Requirement 14: File Organization

**User Story:** As a developer, I want lore.yaml and prompt2.md moved to appropriate folders, so that the repository is well-organized.

#### Acceptance Criteria

1. THE System SHALL move lore.yaml to data/lore/lore.yaml (outside src directory)
2. THE System SHALL move prompt2.md to .kiro/specs/why-2-dossier/prompt.md
3. THE compiler SHALL read data/lore/*.yaml and generate src/lib/lore.bundle.ts
4. THE System SHALL update any import paths referencing lore.yaml
5. THE System SHALL maintain the existing .gitignore patterns

### Requirement 15: Accessibility and Motion

**User Story:** As a user with accessibility needs, I want keyboard-accessible tooltips and reduced motion support, so that I can use the application comfortably.

#### Acceptance Criteria

1. THE System SHALL make all tooltips keyboard-reachable with aria-describedby attributes
2. THE System SHALL respect prefers-reduced-motion user preference
3. THE System SHALL ensure no animations flash more than 3 times per second
4. THE System SHALL display the insight/entertainment disclaimer on both Why and Dossier screens
5. THE System SHALL maintain 44px minimum touch target sizes for all interactive elements

### Requirement 16: Build Pipeline and CI

**User Story:** As a developer, I want the lore compiler integrated into the build pipeline, so that the lore bundle is always up-to-date.

#### Acceptance Criteria

1. THE System SHALL add a compile:lore script to package.json
2. THE predev script SHALL run compile:lore before starting the dev server
3. THE prebuild script SHALL run compile:lore before building for production
4. THE CI pipeline SHALL run npm run compile:lore before tests and builds
5. WHEN the compiler fails, THE build SHALL fail with a clear error message

### Requirement 17: No Breaking Changes

**User Story:** As a user, I want the existing MVP functionality to remain unchanged, so that my current experience is not disrupted.

#### Acceptance Criteria

1. THE System SHALL NOT modify the visual appearance of the Result screen except for adding the Dossier button
2. THE System SHALL maintain all existing routes: /, /input, /result, /why
3. THE System SHALL pass all existing E2E tests in tests/e2e/user-flow.spec.ts
4. THE System SHALL maintain TypeScript compilation with zero errors
5. THE System SHALL use only existing Tailwind CSS tokens (no new color values)
6. THE System SHALL maintain file size under 300 lines of code per file where possible

# Dossier Page Design Brief

## Overview

The Dossier page is a comprehensive, intelligence-report-style view of a user's star system classification. It presents their Human Design data, classification verdict, detailed evidence matrix, deployment rankings, and source citations in a structured, scannable format.

## Design Philosophy

- **Intelligence Report Aesthetic**: Think classified documents, data sheets, tactical briefings
- **Cosmic/Sci-Fi Theme**: Dark backgrounds, lavender accents, starfield elements
- **Information Hierarchy**: Clear sections with visual separation
- **Scannable**: Users should be able to quickly find specific information
- **Professional**: Serious tone, not playful—this is their "official" classification

## Page Structure

### 1. Header Section

**Title:** "Galactic Dossier"  
**Subtitle:** "{System} Classification" (e.g., "Orion Classification")

**Action Buttons (Top Right):**

- **Export PNG** — Downloads the entire dossier as a PNG image (1080×1920 resolution)
- **Print/PDF** — Opens browser print dialog for PDF export
- **Generate Narrative** — Navigates to narrative generation screen

**Design Notes:**

- Buttons should be hidden in print view
- Export PNG button shows "Exporting..." state during generation
- Buttons should have hover/scale effects for interactivity

### 2. Identity Snapshot

**Purpose:** Quick-reference card of core Human Design attributes

**Data Points:**

- Type: Manifesting Generator
- Authority: Sacral
- Profile: 1 / 3
- Defined Centers: Root, G, Sacral, Throat, Spleen (displayed as list or visual)
- Signature Channel: 13–33

**Design Notes:**

- Card or bordered section
- Icon or visual indicator for each attribute type
- Compact but readable
- Consider using a grid layout for defined centers

### 3. The Verdict

**Purpose:** Clear statement of classification result

**Content:**

- Primary system name (large, bold)
- Classification type (e.g., "Primary", "Hybrid", "Unresolved")
- Optional subtitle describing the system's archetype

**Example:**

> **Orion — Unknown system**

**Design Notes:**

- Prominent placement
- Could use accent color or border
- Consider adding system symbol/icon

### 4. Gate→Faction Grid (Evidence Matrix)

**Purpose:** Detailed breakdown of all contributing factors

**Subtitle:** "Evidence Matrix"  
**Count:** "17 of 17 contributors" — shows filtered vs total count

**Important Note:** Filters are currently **disabled** in the implementation to prevent users from removing sources with minimal confidence. The UI shows "Showing all contributors (filters disabled)" instead of filter controls.

**Table Columns:**

1. **Type** — Category of attribute (Type, Channel, Authority, Center, Gate)
2. **Attribute** — Specific attribute name (e.g., "Manifesting Generator", "Channel: 13–33")
3. **Weight** — Numerical score (e.g., 2.08, 1.60)
4. **Confidence** — Visual indicator (●●●●○ = 4/5 stars)
5. **Sources** — Comma-separated list of source texts

**Sample Rows:**
| Type | Attribute | Weight | Confidence | Sources |
|------|------------|---------|-------------|----------|
| Type | Manifesting Generator | 2.08 | ●●●●○ | Bashar Transmissions, Prism of Lyra |
| Channel | Channel: 13–33 | 1.60 | ●●●○○ | The Law of One (Ra Material, Book I) |
| Authority | Authority: Sacral | 1.60 | ●●●○○ | Bringers of the Dawn |
| Center | Center: Throat | 1.28 | ●●○○○ | The Law of One (Ra Material, Book I) |
| Gate | Gate: 13 | 1.18 | ●●○○○ | The Law of One (Ra Material, Book I) |
| Center | Center: G | 1.18 | ●●○○○ | Bringers of the Dawn |
| Gate | Gate: 48 | 1.18 | ●●○○○ | The Law of One (Ra Material, Book I) |
| Channel | Channel: 32–54 | 1.08 | ●●○○○ | Prism of Lyra, Pan-human esoteric/oral syntheses |
| Gate | Gate: 33 | 1.08 | ●●○○○ | The Law of One (Ra Material, Book I) |
| Gate | Gate: 2 | 1.00 | ●●○○○ | Bringers of the Dawn |
| Type | Manifesting Generator | 1.00 | ●●○○○ | Bashar Transmissions, Prism of Lyra |
| Gate | Gate: 10 | 1.00 | ●●○○○ | Prism of Lyra |
| Gate | Gate: 54 | 0.98 | ●●○○○ | Prism of Lyra, Pan-human esoteric/oral syntheses |
| Gate | Gate: 44 | 0.98 | ●●○○○ | Prism of Lyra, The Law of One (Ra Material, Book I) |
| Channel | Channel: 32–54 | 0.98 | ●●○○○ | Pan-human esoteric/oral syntheses |
| Gate | Gate: 54 | 0.98 | ●●○○○ | Prism of Lyra, Pan-human esoteric/oral syntheses |
| Gate | Gate: 44 | 0.68 | ●○○○○ | Prism of Lyra, The Law of One (Ra Material, Book I) |

**Design Notes:**

- Sortable/filterable table (by Type, Weight, Confidence)
- Alternating row colors for readability
- Confidence stars should be visually distinct (filled vs empty)
- Consider truncating long source lists with "show more" interaction
- Mobile: Consider card-based layout instead of table

### 5. Deployment Matrix

**Purpose:** Show all star systems ranked by alignment percentage

**Subtitle:** "All star systems ranked by alignment percentage"

**Table Columns:**

1. **Rank** — Primary, Secondary, Tertiary, or blank
2. **System** — Star system name
3. **Alignment** — Percentage (e.g., 32.81%)
4. **Role** — Brief description of system archetype

**Sample Data:**
| Rank | System | Alignment | Role |
|------|---------|------------|------|
| **Primary** | Orion | 32.81% | Strategists, historians; polarity integration, memory, trial by conflict. |
| **Secondary** | Pleiades | 24.87% | Nurturers, artists, empaths; joy, sensuality, community weaving. |
| **Tertiary** | Andromeda | 10.55% | Explorers, iconoclasts; freedom, innovation, boundary breaking. |
| | Lyra | 10.05% | Primordial builders; instinct, courage, solar wisdom, sovereignty. |
| | Draco | 9.52% | Power, will, hierarchy; alchemy of desire/ambition (highly disputed/charged lore). |
| | Sirius | 6.35% | Teachers, guardians, priestly orders; voice, ritual, stewardship, waters. |
| | Arcturus | 5.82% | Engineers, healers, pattern architects; mind–heart coherence, clean geometry. |
| | Zeta Reticuli | 0.08% | Analysts, experimenters, abstraction; detached observation, adaptation. |

**Design Notes:**

- Visual hierarchy: Primary/Secondary/Tertiary should stand out
- Consider adding system crests/icons next to names
- Percentage could have visual bar indicator
- Role descriptions should be readable but not dominate

### 6. Why Not…? Section

**Purpose:** Show near-miss systems and what would have increased their scores

**Subtitle:** "Other systems that were close contenders. Here's what would have increased their scores:"

**Format:** Non-expandable sections (always visible) for each near-miss system

**Logic:**

- Shows the next 1-2 systems after the primary/hybrid pair
- For each system, displays the top 3 **unmatched** rules (rules that didn't contribute to their score)
- Rules are sorted by weight (desc), then confidence (desc), then ID (alphabetically)
- If a system has no unmatched rules, shows: "No additional factors would significantly increase this system's score."

**Sample Content:**

**Pleiades (24.87%)**

- Generative life force (Sacral) → creative, communal cultivation; primordial craft lineages. (+2.5 ★★)
- Bonding/intimacy regulating closeness. (+1.4 ★★)
- Fertility/bonding; sensual bridge-builder. (+1.1 ★★)

**Andromeda (10.55%)**

- Freedom–pathfinding through voice & direction. (+1.5 ★★)
- Trial-and-error explorers. (+1.4 ★★)
- Creative direction amplified by contribution. (+1.3 ★★)

**Design Notes:**

- Each system is a non-collapsible section (always visible)
- Show system name + percentage in header
- Each unmatched rule is displayed in a card with:
  - Rationale text (left-aligned)
  - Weight value (right-aligned, monospace, e.g., "+2.5")
  - Confidence stars (right-aligned, e.g., "★★")
- Cards have subtle background and border
- Consider using accent colors for different systems

### 7. Sources & References

**Purpose:** Citation list for transparency and further reading

**Subtitle:** "All sources cited in your classification"

**Sample Content:**

- Bashar Transmissions
- Bringers of the Dawn
- Pan-human esoteric/oral syntheses (Various, 1990s)
- Prism of Lyra
- The Law of One (Ra Material, Book I)
- Disputed or controversial lore (noted)

**Design Notes:**

- Display as **badge/chip grid** (not a simple list)
- Each source is a clickable badge with hover tooltip
- Badges show: `⚑ {title}` for disputed sources, or just `{title}` for regular sources
- Tooltip on hover/focus shows:
  - Full title
  - Author (year)
  - "⚑ Disputed or controversial lore" (if applicable)
- Sources are sorted **alphabetically by title**
- All sources are deduplicated (no repeats)
- Legend below badges: "⚑ = Disputed or controversial lore"
- Badges have 44px minimum touch target for accessibility

### 8. Footer

**Legal Disclaimer:**

> "For insight & entertainment; not medical, financial, or legal advice."

**Design Notes:**

- Small, subtle text
- Always visible at bottom of page

## Design System Elements to Use

### Colors

- **Background:** Canvas dark (#0a0612)
- **Primary Accent:** Lavender (#a78bfa, #c4b5fd)
- **Text:** White/off-white for primary, gray for secondary
- **Borders:** Subtle lavender or dark gray
- **System Colors:** Each star system has its own accent color (reference existing crests)

### Typography

- **Headers:** Large, bold, uppercase for section titles
- **Body:** Clean, readable sans-serif (Inter or similar)
- **Data:** Monospace for numerical values (optional, for tech aesthetic)
- **Hierarchy:** Clear size/weight differences between levels

### Components to Reuse

- **Card:** For Identity Snapshot, Why Not sections
- **Chip:** For defined centers, tags
- **Button:** For interactions (filters, expand/collapse)
- **Crests:** Star system visual identifiers
- **Toast:** For error states (if needed)

### Spacing & Layout

- **Max Width:** 1200px for readability
- **Padding:** Generous whitespace between sections
- **Grid:** Use consistent grid system (12-column or similar)
- **Mobile:** Stack sections vertically, consider card-based layouts for tables

## Interactions & States

### Export Actions

- **Export PNG**: Generates a PNG image of the entire dossier at 1080×1920 resolution
  - Shows loading state: "Exporting..." button text
  - Uses `html-to-image` library
  - Filename format: `dossier-{SystemName}-{timestamp}.png`
  - Caps pixel ratio at 2 to prevent memory issues on mobile
- **Print/PDF**: Opens browser print dialog
  - Print styles hide starfield, glow effects, and action buttons
  - Optimizes layout for paper/PDF output
- **Generate Narrative**: Navigates to `/narrative` route

### Filters (Evidence Matrix)

- **DISABLED**: Filters are currently disabled to prevent users from removing sources with minimal confidence
- UI shows: "Showing all contributors (filters disabled)"
- All contributors are displayed without filtering

### Source Badges

- Hover/focus shows tooltip with full source details
- Tooltip includes: title, author, year, disputed flag
- Keyboard accessible (Tab navigation, focus states)

### Responsive Behavior

- **Desktop:** Full table layouts, side-by-side sections
- **Tablet:** Maintain tables but reduce padding
- **Mobile:** Convert tables to cards, stack all sections

## Accessibility Requirements

- **Keyboard Navigation:** All interactive elements accessible via Tab
- **Focus States:** Visible focus indicators (2px lavender ring)
- **Screen Readers:** Proper ARIA labels, semantic HTML
- **Color Contrast:** ≥4.5:1 for text
- **Touch Targets:** 44px minimum for mobile

## Sample Data for Design

Use the following complete example for your design mockups:

```
# Galactic Dossier
**Orion Classification**

---

## Identity Snapshot

**Type:** Manifesting Generator
**Authority:** Sacral
**Profile:** 1 / 3
**Defined Centers:**
  - Root
  - G
  - Sacral
  - Throat
  - Spleen
**Signature Channel:** 13–33

---

## The Verdict

**Orion — Unknown system**

---

## Gate→Faction Grid

### Evidence Matrix
(17 of 17 contributors)

[Use table data from Section 4 above]

---

## Deployment Matrix

_All star systems ranked by alignment percentage_

[Use table data from Section 5 above]

---

## Why Not…?

_Other systems that were close contenders. Here's what would have increased their scores:_

### Pleiades (24.87%)
- Generative life force (Sacral) → creative, communal cultivation; primordial craft lineages. (+2.5 ★★)
- Bonding/intimacy regulating closeness. (+1.4 ★★)
- Fertility/bonding; sensual bridge-builder. (+1.1 ★★)

### Andromeda (10.55%)
- Freedom–pathfinding through voice & direction. (+1.5 ★★)
- Trial-and-error explorers. (+1.4 ★★)
- Creative direction amplified by contribution. (+1.3 ★★)

---

## Sources & References

_All sources cited in your classification_

- Bashar Transmissions
- Bringers of the Dawn
- Pan-human esoteric/oral syntheses (Various, 1990s)
- Prism of Lyra
- The Law of One (Ra Material, Book I)
- Disputed or controversial lore (noted)

---

**For insight & entertainment; not medical, financial, or legal advice.**
```

## Technical Considerations

### Performance

- Lazy load sections below the fold
- **Virtualize Evidence Matrix when >75 contributors** using `@tanstack/react-virtual`
  - Below 75: Regular table rendering
  - Above 75: Virtual scrolling with 600px max height
- Optimize crest images (SVG preferred)
- PNG export uses `html-to-image` library with caching and pixel ratio capping

### Data Structure

The page receives a `ClassificationResult` object with:

- `hdData`: Human Design attributes
- `classification`: Primary system
- `percentages`: All system scores
- `contributions`: Array of contributing factors with weights
- `sources`: Array of source citations

### Animation

- **Starfield background**: Twinkling stars with CSS animation (2-5s duration, random delays)
- **Cosmic glow effect**: Pulsing lavender glow orb (positioned at top-left quarter)
- **Fade-in animations**:
  - Main content: `animate-fade-in`
  - Header: `animate-fade-in-down`
  - Sections: `animate-fade-in-up` with staggered delays (0.1s, 0.2s, etc.)
- **Button interactions**: Scale on hover (1.05x), active state (0.95x)
- **Card hover effects**: Border color change + shadow
- Respect `prefers-reduced-motion` (animations defined in `@/styles/animations.ts`)
- **Print styles**: Hide starfield, glow effects, and animations in print view

## Design Deliverables

Please provide:

1. **Desktop mockup** (1440px width)
2. **Tablet mockup** (768px width)
3. **Mobile mockup** (375px width)
4. **Component library** for reusable elements
5. **Interaction states** (hover, focus, active, disabled)
6. **Dark theme** (primary) and light theme (optional, Phase 2)

## Implementation Details (Current State)

### Resolved Decisions:

- ✅ **Source lists**: Displayed as interactive badges with tooltips (not truncated)
- ✅ **Evidence Matrix**: Virtualized when >75 contributors, regular table otherwise
- ✅ **Star system crest**: Not currently displayed (could be added in redesign)
- ✅ **"Why Not" sections**: Always expanded (not collapsible)
- ✅ **Export features**: PNG export and Print/PDF both implemented
- ✅ **Disputed sources**: Indicated with ⚑ flag in badges and tooltips

### Open Questions for Redesign:

- Should we add star system crests to the header or verdict section?
- Should "Why Not" sections be collapsible to reduce page length?
- Should we add visual progress bars to the Deployment Matrix percentages?
- Should the Evidence Matrix have a search/filter input (currently disabled)?
- Should we add a "Copy Link" or "Share" button?

## Reference Materials

- **Existing Figma Components:** `/Figma/components/s3/`
- **Design Tokens:** `/Figma/design-tokens.json`
- **Current Implementation:** `star-system-sorter/src/screens/DossierScreen.tsx`
- **Star System Crests:** Use existing crest components
- **Color Palette:** Reference `globals.css` for cosmic theme

---

**Goal:** Create a comprehensive, scannable, intelligence-report-style page that makes users feel like they're viewing an official galactic classification document. Balance information density with readability, and maintain the cosmic/sci-fi aesthetic throughout.

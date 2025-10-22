# Why Page - Purpose & Context

## Overview

The "Why" page (WhyScreen) explains how a user's star system classification was determined. It bridges the gap between receiving a result and understanding the methodology behind it.

## Current User Journey

1. User completes birth data form
2. Receives star system classification (e.g., "Primary: Pleiades")
3. Clicks "View Why" or "Learn More" button
4. Lands on Why page to understand their result

## Core Purpose

**Transparency & Trust**: Users need to understand that their classification isn't arbitrary—it's based on their actual Human Design chart data using a deterministic algorithm.

## What the Page Currently Shows

The Why page displays:

1. **System Summaries**: Overview of each star system's score/percentage
2. **Contributing Factors**: Breakdown of which Human Design attributes influenced the classification
3. **Evidence Matrix**: Detailed view of how specific gates, channels, centers, type, authority, and profile contributed points
4. **Source Attribution**: Clear indication of which Human Design elements were analyzed

## Key Information Architecture

### Data Sources (Human Design Attributes)
- **Type**: Generator, Manifestor, Projector, Reflector, Manifesting Generator
- **Authority**: Emotional, Sacral, Splenic, Ego, Self-Projected, Mental, Lunar
- **Profile**: 1/3, 2/4, 3/5, etc. (12 possible combinations)
- **Centers**: 9 energy centers (defined/undefined)
- **Channels**: 36 possible channels connecting centers
- **Gates**: 64 gates mapped to I Ching hexagrams

### Scoring Logic
Each Human Design attribute has weighted contributions to different star systems. For example:
- Gate 1 might contribute +15 points to Pleiades
- Emotional Authority might contribute +10 points to Sirius
- Generator Type might contribute +8 points to Lyra

The page shows which of the user's specific attributes contributed to their final classification.

## User Goals

When users visit this page, they want to:
1. **Validate**: "Is this legit or random?"
2. **Understand**: "What about my chart led to this result?"
3. **Explore**: "What if I had different attributes?"
4. **Learn**: "What do these Human Design terms mean?"

## Design Constraints

### Must Haves
- Display all 6 star systems with their percentages
- Show contributing factors grouped by source (gates, channels, centers, etc.)
- Maintain cosmic theme (dark background, lavender accents)
- Legal disclaimer: "For insight & entertainment. Not medical, financial, or legal advice."
- Back navigation to results

### Current Implementation Details
- Uses `ContributionCard` components for each contributing factor
- `EvidenceMatrix` component shows detailed breakdown
- `SystemSummary` component displays percentage bars
- `SourceBadge` component tags each contribution by type
- Filter controls to show/hide different contribution types

## Technical Context

### Data Structure
The page receives a `ClassificationResult` object containing:
```typescript
{
  classification: "primary" | "hybrid" | "unresolved",
  primary: "Pleiades" | "Sirius" | "Lyra" | "Andromeda" | "Orion" | "Arcturus",
  secondary?: string,
  percentages: { [system: string]: number },
  contributions: Array<{
    source: "gate" | "channel" | "center" | "type" | "authority" | "profile",
    identifier: string,
    system: string,
    points: number,
    description?: string
  }>
}
```

### Current Pain Points
- Information density is high (can be overwhelming)
- Contributions list can be very long (50+ items)
- No progressive disclosure or hierarchy
- Limited visual storytelling
- Doesn't leverage the cosmic/mystical theme effectively

## Redesign Opportunities

Consider:
- **Visual hierarchy**: What's most important to see first?
- **Progressive disclosure**: How to reveal complexity gradually?
- **Storytelling**: Can we make the data feel more narrative?
- **Interactivity**: Hover states, expandable sections, filtering?
- **Cosmic aesthetics**: Starfield, constellation lines, orbital patterns?
- **Mobile optimization**: Current design is desktop-first

## Success Criteria

A successful redesign should:
1. Make users feel confident in their classification
2. Be scannable (quick overview) and explorable (deep dive)
3. Feel cohesive with the cosmic theme
4. Work well on mobile and desktop
5. Maintain accessibility (keyboard nav, screen readers, color contrast)

## Reference Files

- Current implementation: `star-system-sorter/src/screens/WhyScreen.tsx`
- Component library: `star-system-sorter/src/components/lore/`
- Design tokens: `Figma/design-tokens.json`
- Scoring algorithm: `star-system-sorter/src/lib/scorer.ts`
- Canon data: `star-system-sorter/data/lore/lore.yaml`

## Example User Data

A typical user might have:
- 15-25 defined gates
- 3-8 defined channels
- 4-6 defined centers
- 1 type
- 1 authority
- 1 profile

This results in 20-35 total contributions to display, with varying point values (typically 5-20 points each).

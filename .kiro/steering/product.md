# Product Context - Star System Sorter

## What We're Building

Star System Sorter (S³) is a React web app that provides deterministic star system classification based on Human Design birth chart data. Users input their birth information, we retrieve their Human Design data via the BodyGraph Chart API, apply a proprietary scoring algorithm, and present their star system classification with visual crests and ally systems.

## Core Value Proposition

- **Deterministic Results**: Same birth data always produces the same classification
- **Privacy-First**: No logging of PII, secure API key handling, hashed cache keys
- **Cosmic Experience**: Dark theme with lavender gradients, starfield backgrounds, and star system crests
- **Fast & Efficient**: 30-day caching reduces API calls and improves performance

## User Flow (MVP)

1. **Onboarding** (`/`): Welcome screen with 3-step explainer → "Begin Sorting" button
2. **Input** (`/input`): Form for birth date, time, location, timezone → Submit
3. **Result** (`/result`): Primary star system crest, percentage chart, ally chips → "View Why"
4. **Why** (`/why`): Detailed explanation of contributing factors → Back to results

## Star Systems

Six possible classifications: **Pleiades**, **Sirius**, **Lyra**, **Andromeda**, **Orion**, **Arcturus**

Classifications can be:
- **Primary**: Clear winner (>6% lead)
- **Hybrid**: Top two systems within 6% of each other
- **Unresolved**: No clear classification

## Key Terminology

- Always use "star system" (never "house")
- Legal disclaimer on all screens: "For insight & entertainment. Not medical, financial, or legal advice."
- Human Design attributes: type, authority, profile, centers, channels, gates

## Figma Components

Pre-built components exist in `/Figma/components/s3/`:
- **Button**: primary, secondary, ghost, destructive variants (sm, md, lg sizes)
- **Card**: default, emphasis, warning variants
- **Chip**: For ally systems with percentages
- **Field**: Form inputs with icons, helper text, error states
- **StarSystemCrests**: Visual representations for each of the 6 systems (single component with variants)
- **Toast**: Error notifications (MVP scope)
- **AppBar, TabBar**: Phase 2 (navigation)
- **Screens**: PaywallScreen, SettingsScreen, EmptyStatesScreen (Phase 2)
- **Game Components**: Phase 2 (GameBadges, GameCards, GameModals, HUDComponents, PartyMember)

## MVP vs Phase 2

**MVP Includes**:
- 4-screen flow (onboarding → input → result → why)
- Basic Figma components (Button, Card, Chip, Field, Crests, Toast)
- Express proxy with 30-day cache
- Unit tests + 1 Playwright smoke test
- Basic accessibility (focus states, labeled fields, 44px targets)

**Phase 2 Deferred**:
- Profile, Community, Settings screens
- TabBar navigation
- Content moderation (profanity filters)
- Avatar/narrative generation
- Paywall
- GDPR/CCPA compliance features
- Full design token integration
- Comprehensive E2E test suite

## Success Metrics (MVP Acceptance)

1. All 4 routes load without errors
2. Happy path works end-to-end
3. No client exposure of API key
4. Tests pass (≥80% lib coverage + Playwright smoke)
5. Basic accessibility compliance

## Privacy & Compliance

- Never log birth data or PII
- API key stored server-side only (NO `VITE_` prefix)
- HTTPS in production
- Hash user identifiers before analytics
- Display legal disclaimer on all screens
- Phase 2: GDPR, CCPA, privacy policy, terms of service

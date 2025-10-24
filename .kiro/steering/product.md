# Product Context - Star System Sorter

## What We're Building

Star System Sorter (S³) is a React web app that provides deterministic star system classification based on Human Design birth chart data. Users input their birth information, we retrieve their Human Design data via the BodyGraph Chart API, apply a proprietary scoring algorithm, and present their star system classification with visual crests and ally systems.

## Core Value Proposition

- **Deterministic Results**: Same birth data always produces the same classification
- **Privacy-First**: No logging of PII, secure API key handling, hashed cache keys
- **Cosmic Experience**: Dark theme with lavender gradients, starfield backgrounds, and star system crests
- **Fast & Efficient**: 30-day caching reduces API calls and improves performance
- **Academic-Grade Research**: Built on rigorous comparative mythology with proper citations, not typical astrology blog content

## Academic Foundation (Competitive Moat)

**Human Design's Credible Foundations:**
- **I Ching (64 hexagrams)** - 3,000+ years of scholarship, Jung's endorsement (Wilhelm translation, 1950)
- **64 DNA codons** - Nobel Prize research (Nirenberg & Khorana, 1968) - verifiable mathematical correspondence
- **Kabbalah (Tree of Life)** - Extensive academic study (Scholem, Idel)
- **Chakra system** - Religious Studies, Yoga Studies (Feuerstein)
- **Western Astrology** - Cultural/historical phenomenon (Tarnas)

**Mathematical Correspondences:**
- 64 I Ching hexagrams = 64 DNA codons (verifiable fact)
- Binary yin/yang logic = Binary genetic code (A/T, C/G)

**Our Research Standards:**
- Ancient texts with named translators (Faulkner, Mercer, Wilhelm)
- Published books with ISBNs and page numbers
- Academic papers from JSTOR, university repositories
- Evidence typing (direct/inferred/symbolic)
- Consensus levels documented
- Disputed claims include counter-evidence

**This is NOT pseudoscience** - it's a synthesis system built on academically documented foundations, combined with comparative mythology research. Frame it as: **"Contemporary mythology with academic-grade sourcing"** not "scientifically proven predictions."

**Competitive Advantage:** No other astrology/mythology app can claim this level of research rigor or academic foundation.

## User Flow (MVP)

1. **Onboarding** (`/`): Welcome screen with 3-step explainer → "Begin Sorting" button
2. **Input** (`/input`): Form for birth date, time, location, timezone → Submit
3. **Result** (`/result`): Primary star system crest, percentage chart, ally chips → "View Why"
4. **Why** (`/why`): Detailed explanation of contributing factors → Back to results

## Star Systems

Nine possible classifications: **Pleiades**, **Sirius**, **Lyra**, **Andromeda**, **Orion Light**, **Orion Dark**, **Arcturus**, **Draco**, **Zeta Reticuli**

### Orion Faction Distinction
The Orion star system has two distinct factions that are classified separately:
- **Orion Light (Osirian)**: Mystery schools, Thoth/Hermes lineage, sacred geometry, wisdom keepers, record keepers
- **Orion Dark**: Control, hierarchy, shadow work, often allied with Draco but distinct from it

### Other Key Distinctions
- **Draco**: Separate star system from Orion, power/hierarchy archetype, often allied with Orion Dark faction
- **Zeta Reticuli**: Analytical, detached, genetic experimenters

Classifications can be:
- **Primary**: Clear winner (>6% lead)
- **Hybrid**: Top two systems within 6% of each other
- **Unresolved**: No clear classification

## Key Terminology

- Always use "star system" (never "house")
- Legal disclaimer on all screens: "For insight & entertainment. Not medical, financial, or legal advice."
- Human Design attributes: type, authority, profile, centers, channels, gates
- Frame as: "Comparative mythology research" or "Contemporary mythology with academic-grade sourcing"
- Avoid: "Scientifically proven", "medical diagnosis", "predict the future"
- Emphasize: "Pattern recognition", "archetypal mapping", "self-discovery tool"

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

## Communicating Academic Credibility

**On "Why" Screen (Task 11):**
- Explain the I Ching → Human Design → Star System mapping
- Mention the 64 hexagrams = 64 codons correspondence
- Link to methodology documentation (Phase 2)
- Emphasize research quality without overpromising

**Tone:**
- Confident but not arrogant
- "We've done the research so you don't have to"
- "Built on 3,000 years of I Ching scholarship, not blog posts"
- "Comparative mythology meets pattern recognition"

**What NOT to say:**
- ❌ "Scientifically proven"
- ❌ "Predict your future"
- ❌ "Medical/psychological diagnosis"
- ❌ "100% accurate"

**What TO say:**
- ✅ "Based on Human Design's I Ching foundation"
- ✅ "Researched using ancient texts and published sources"
- ✅ "Pattern recognition tool for self-discovery"
- ✅ "For insight and entertainment"

## Privacy & Compliance

- Never log birth data or PII
- API key stored server-side only (NO `VITE_` prefix)
- HTTPS in production
- Hash user identifiers before analytics
- Display legal disclaimer on all screens
- Phase 2: GDPR, CCPA, privacy policy, terms of service

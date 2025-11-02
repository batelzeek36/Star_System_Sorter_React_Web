# Project Structure & Architecture

## Monorepo Layout

```
/
├── Figma/                    # Pre-built UI components from Figma
│   ├── components/s3/        # Button, Card, Chip, Field, Crests, etc.
│   ├── design-tokens.json    # Design system tokens
│   ├── game-tokens.json      # Phase 2: Game-specific tokens (not used in MVP)
│   └── globals.css           # Global CSS variables
├── lore-research/            # Research data and ETL scripts
│   ├── scripts/              # Source → canon ETL scripts (Python/TypeScript)
│   │   ├── 01-normalize-line-companion.py
│   │   ├── 02-split-gates.py
│   │   ├── 03-split-lines-per-gate.py
│   │   └── 04-extract-quotes.py
│   └── research-outputs/     # Validated canon data
├── star-system-sorter/       # React web app (Vite)
│   ├── src/
│   │   ├── screens/          # 4 MVP screens (Onboarding, Input, Result, Why)
│   │   ├── lib/              # Pure logic (schemas, scorer, canon)
│   │   ├── api/              # bodygraph-client.ts
│   │   ├── store/            # Zustand stores (birthDataStore)
│   │   ├── hooks/            # useHDData, useClassification
│   │   └── data/             # canon-data.yaml
│   ├── tests/                # Vitest unit + Playwright E2E
│   └── previews/             # Screenshot outputs
├── server/                   # Express proxy server
│   └── src/
│       ├── routes/hd.ts      # POST /api/hd endpoint
│       └── index.ts          # Server entry point
├── data/                     # Source → canon ETL scripts (Python)
│   ├── 01_normalize_line_companion.py
│   ├── 02_split_gates.py
│   ├── 03_split_lines.py
│   └── 04_make_snippets.py
└── migration-package/        # Reference docs from React Native version
```

## Layered Architecture

**Dependency Flow** (top → bottom, never reverse):

```
Screens
  ↓
Components (Figma)
  ↓
Hooks
  ↓
Store / API
  ↓
Lib (schemas, scorer, canon)
```

**Rules**:
- Lib cannot import from Components, Screens, Hooks, Store, or API
- Components cannot import from Screens
- Store and API cannot import from Components, Screens, or Hooks
- No circular dependencies
- Export module interfaces through `index.ts` files
- Prohibit deep imports (use path aliases)

**Data ETL rule:** `/lore-research/scripts/*` may read and write under `s3-data/` and `lore-research/`, but the React app (`star-system-sorter/`) must only ever read the final, validated canon (e.g. `s3-data/hexagrams/*.json`, `s3-data/gates/*.json`, `lore-research/research-outputs/star-systems/v4.2/*.json`). Do NOT point UI components at raw OCR or provisional files.

**Data ETL rule:** `/data/*` may read and write under `s3-data/` and `lore-research/`, but the React app (`star-system-sorter/`) must only ever read the final, validated canon (e.g. `s3-data/hexagrams/*.json`, `s3-data/gates/*.json`, `lore-research/research-outputs/star-systems/v4.2/*.json`). Do NOT point UI components at raw OCR or provisional files.

## Path Aliases

Configure in `tsconfig.json` and `vite.config.ts`:

```typescript
{
  "@components": "./src/components",
  "@lib": "./src/lib",
  "@screens": "./src/screens",
  "@api": "./src/api",
  "@store": "./src/store",
  "@hooks": "./src/hooks",
  "@theme": "./src/theme"
}
```

## File Size Guidelines

- Target: 100-200 lines per file
- Maximum: 500 lines
- Split larger files into focused modules

## Key Files

### Client (star-system-sorter/src/)

**Lib** (pure logic, no React):
- `lib/schemas.ts`: Zod schemas (BirthDataFormSchema, HDExtractSchema, etc.)
- `lib/scorer.ts`: Classification algorithm (computeClassification)
- `lib/canon.ts`: Canon data loader and validator

**API**:
- `api/bodygraph-client.ts`: Fetch wrapper for POST /api/hd

**Store**:
- `store/birthDataStore.ts`: Zustand store for birth data and classification results

**Hooks**:
- `hooks/useHDData.ts`: Fetch HD data from API
- `hooks/useClassification.ts`: Compute classification from HD data

**Screens**:
- `screens/OnboardingScreen.tsx`: Welcome + "Begin Sorting"
- `screens/InputScreen.tsx`: Birth data form (React Hook Form + Zod)
- `screens/ResultScreen.tsx`: Star system crest + percentages + allies
- `screens/WhyScreen.tsx`: Contributors explanation

### Server (server/src/)

- `routes/hd.ts`: POST /api/hd endpoint with caching logic
- `index.ts`: Express app setup with CORS, rate limiting, error handling

### Figma Components

Import from `/Figma/components/s3/`:
- `Button.tsx`: Variants (primary, secondary, ghost, destructive)
- `Card.tsx`: Variants (default, emphasis, warning)
- `Chip.tsx`: For ally systems
- `Field.tsx`: Form inputs
- `StarSystemCrests.tsx`: PleiadesCrest, SiriusCrest, LyraCrest, AndromedaCrest, OrionCrest, ArcturusCrest
- `Toast.tsx`: Error notifications

## Module Boundaries

**Screens**:
- Can import: Components, Hooks, Store, API, Lib
- Responsibility: Layout, routing, user interaction orchestration

**Components**:
- Can import: Lib (for types)
- Responsibility: Reusable UI elements, no business logic

**Hooks**:
- Can import: Store, API, Lib
- Responsibility: Stateful logic, side effects

**Store**:
- Can import: Lib
- Responsibility: Global state management (Zustand)

**API**:
- Can import: Lib
- Responsibility: HTTP requests, error handling

**Lib**:
- Can import: Nothing (pure functions)
- Responsibility: Schemas, algorithms, data structures

## Testing Structure

```
tests/
├── lib/                      # Unit tests for schemas, scorer
│   ├── schemas.test.ts
│   └── scorer.test.ts
├── components/               # Component tests (RTL)
│   └── Field.test.tsx
└── e2e/                      # Playwright tests
    └── user-flow.spec.ts     # MVP: 1 smoke test
```

## Environment Variables

**Client** (star-system-sorter/.env):
```bash
# NO API keys here! Anything with VITE_ prefix is bundled to client
VITE_API_BASE_URL=/api  # Dev only, uses Vite proxy
```

**Server** (server/.env):
```bash
BODYGRAPH_API_KEY=your_key_here  # NO VITE_ prefix!
PORT=3000
NODE_ENV=development
```

## Deployment Structure

**Development**:
- Vite dev server: `http://localhost:5173`
- Express server: `http://localhost:3000`
- Vite proxy: `/api/*` → `http://localhost:3000/api/*`

**Production**:
- Static files: Vercel/Netlify CDN
- API routes: Serverless functions (Vercel Functions / Netlify Functions)
- Rewrites: `/api/*` → serverless function (NO Vite proxy)
- Environment: `BODYGRAPH_API_KEY` set in platform dashboard

## Build Outputs

```
star-system-sorter/dist/      # Vite build output (static files)
server/dist/                  # TypeScript compiled output (Node.js)
previews/                     # Playwright screenshots
coverage/                     # Vitest coverage reports
```


## Figma Design Reference

### Screen Implementations
All 19 screen designs are implemented in `/Figma/App.tsx` with visual references in `/Figma/Screnshots/`.

**MVP Screens (Tasks 8-11):**
- Screen 1: `onboarding` - Welcome + Begin Sorting CTA
- Screen 2: `input` - Birth data form with tabs
- Screen 3: `result` - Star system result with radial chart
- Screen 4: `why` - Contributors explanation

**Phase 2 Screens:**
- Screens 5-9: Community, Profile, Paywall, Settings, EmptyStates
- Screens 10-19: Game Layer (Hub, Team Select, HUD, Leaderboard, etc.)

**Implementation Approach:**
1. Reference `/Figma/App.tsx` for complete JSX implementation
2. View `/Figma/Screnshots/screen-X-Y-Z.png` for visual design
3. Import components from `src/components/figma/` (already copied into project)
4. Wire up navigation (React Router) and data (stores/hooks)

**Detailed Reference:** #[[file:star-system-sorter/FIGMA_SCREENS_REFERENCE.md]]

### Component Location
Figma components have been copied to `star-system-sorter/src/components/figma/` for easy import:

```typescript
// Import from local project
import { Button, Card, Chip, Field, PleiadesCrest } from '@/components/figma';
```

**Available Components:**
- Core: Button, Card, Chip, Field, Toast, AppBar, TabBar
- Crests: PleiadesCrest, SiriusCrest, LyraCrest, AndromedaCrest, OrionCrest, ArcturusCrest
- Screens (Phase 2): PaywallScreen, SettingsScreen, EmptyStatesScreen
- Game (Phase 2): TeamBadge, GameModeCard, HUDComponents, etc.

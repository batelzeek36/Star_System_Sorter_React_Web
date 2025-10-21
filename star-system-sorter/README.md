# Star System Sorter (S³)

A React web application that provides deterministic star system classification based on Human Design birth chart data.

## Overview

Star System Sorter retrieves Human Design data via the BodyGraph Chart API, applies a proprietary scoring algorithm with lore-based rules, and presents users with their star system classification including visual crests and ally systems.

**Key Features:**
- Deterministic classification (same birth data → same result)
- Privacy-first (no PII logging, secure API key handling)
- Cosmic UI with dark theme, lavender gradients, and starfield backgrounds
- 30-day caching for performance
- Comprehensive provenance tracking with source citations

## Tech Stack

- **Framework**: React 18+ with TypeScript 5+
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **Routing**: React Router 6+
- **State**: Zustand 4+
- **Validation**: Zod 3+
- **Testing**: Vitest 3+ (unit) + Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js ≥18 (see `.nvmrc`)
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your BODYGRAPH_API_KEY
```

### Development

```bash
# Start dev server (runs lore compiler automatically)
npm run dev

# Dev server runs at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Add/Modify Lore

Lore rules define how Human Design attributes map to star system classifications. The lore system is deterministic and version-controlled.

### Lore File Location

All lore data lives in YAML format at:
```
data/lore/lore.yaml
```

The compiler reads all `data/lore/*.yaml` files and merges them by ID.

### Lore Structure

```yaml
lore_version: "2.1.0"
tieThresholdPct: 6.0

systems:
  - id: pleiades
    label: Pleiades
    description: "Healers and empaths..."

sources:
  - id: law_of_one
    title: "The Law of One"
    author: "Ra Material"
    year: 1981
    disputed: false
    url: "https://example.com"

rules:
  - id: pleiades_emotional_authority
    systems:
      - id: pleiades
        w: 15
    if:
      authorityAny: ["Emotional"]
    rationale: "Emotional authority indicates Pleiadian empathic nature"
    sources: ["law_of_one"]
    confidence: 4
```

### Adding a New Rule

1. Open `data/lore/lore.yaml`
2. Add a new rule to the `rules` array:

```yaml
- id: my_new_rule
  systems:
    - id: sirius
      w: 10
  if:
    gatesAny: [1, 2, 3]
  rationale: "Gates 1, 2, 3 indicate Sirian leadership"
  sources: ["my_source"]
  confidence: 3
```

3. Run the compiler to validate:
```bash
npm run compile:lore
```

### Rule Matching Conditions

Rules support the following `if` conditions:
- `typeAny`: `["Generator", "Manifestor", "Projector", "Reflector"]`
- `authorityAny`: `["Emotional", "Sacral", "Splenic", "Ego", "Self-Projected", "Mental", "Lunar"]`
- `profileAny`: `["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"]`
- `centersAny`: `["Head", "Ajna", "Throat", "G", "Heart", "Spleen", "Solar Plexus", "Sacral", "Root"]`
- `channelsAny`: `["13-33", "1-8", ...]` (string format)
- `gatesAny`: `[1, 2, 3, ...]` (number array)

### Incrementing Lore Version

When you modify rules, increment the `lore_version`:
```yaml
lore_version: "2.2.0"  # Increment minor version for rule changes
```

This triggers a "Recompute with new lore" banner for users with cached classifications.

## How the Compiler Validates

The lore compiler (`scripts/compile-lore.ts`) runs automatically before dev and build. It performs strict validation to ensure data integrity.

### Validation Rules

**1. Schema Validation (Zod)**
- All fields must match expected types
- Required fields must be present
- Enums must use valid values

**2. ID Format Validation**
- Rule IDs: `^[a-z0-9_]+$` (lowercase, numbers, underscores only)
- System IDs: `^[a-z0-9_]+$`
- Source IDs: `^[a-z0-9_]+$`

**3. Reference Validation**
- All `systems[].id` in rules must reference existing systems
- All `sources[]` in rules must reference existing sources

**4. Channel Format Validation**
- `channelsAny` must be string array: `["13-33", "1-8"]`
- NOT number array (common mistake)

**5. Confidence Range**
- Must be integer 1-5

**6. Duplicate Detection**
- Duplicate rule IDs cause compilation failure
- No silent last-writer-wins behavior

### Compilation Process

1. **Read YAML**: Load all `data/lore/*.yaml` files
2. **Validate**: Run Zod schema validation
3. **Sort**: Alphabetically sort systems, sources, and rules by ID
4. **Hash**: Compute SHA-256 `rules_hash` for version tracking
5. **Generate**: Write TypeScript module to `src/lib/lore.bundle.ts`
6. **Exit**: Non-zero exit code on any validation failure

### Output

The compiler generates `src/lib/lore.bundle.ts`:
```typescript
export const loreBundle: LoreBundle = {
  lore_version: "2.1.0",
  tieThresholdPct: 6.0,
  rules_hash: "a1b2c3d4...",
  systems: [...],
  sources: [...],
  rules: [...]
};
```

### Error Handling

**Common Errors:**

```bash
# Invalid ID format
Error: Rule ID "Pleiades-Rule" must match ^[a-z0-9_]+$

# Missing source reference
Error: Rule "my_rule" references unknown source "missing_source"

# Invalid channel format
Error: channelsAny must be string[] (e.g., ["13-33"]), not number[]

# Duplicate rule ID
Error: Duplicate rule ID "pleiades_emotional_authority"
```

**Fix Process:**
1. Read error message carefully
2. Open `data/lore/lore.yaml`
3. Fix the validation issue
4. Run `npm run compile:lore` to verify
5. Commit changes

### Build Integration

The compiler runs automatically via npm scripts:
```json
{
  "compile:lore": "tsx scripts/compile-lore.ts",
  "predev": "npm run compile:lore",
  "prebuild": "npm run compile:lore"
}
```

**CI/CD**: The build fails if lore validation fails, preventing broken lore from reaching production.

## How to Run Tests

### Unit Tests (Vitest)

Run all unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

View coverage report:
```bash
open coverage/index.html
```

**Coverage Target**: ≥80% for `lib/` directory

### E2E Tests (Playwright)

Run all E2E tests:
```bash
npm run test:e2e
```

Run E2E tests in headed mode (see browser):
```bash
npm run test:e2e -- --headed
```

Run specific test file:
```bash
npm run test:e2e tests/e2e/user-flow.spec.ts
```

View Playwright report:
```bash
npx playwright show-report
```

### Test Organization

```
src/
├── lib/
│   ├── scorer.test.ts          # Classification algorithm tests
│   ├── schemas.test.ts         # Zod schema validation tests
├── components/
│   └── lore/
│       ├── SourceBadge.test.tsx
│       ├── ContributionCard.test.tsx
│       └── EvidenceMatrix.test.tsx
├── screens/
│   ├── WhyScreen.perf.test.tsx
│   └── DossierScreen.perf.test.tsx
tests/
└── e2e/
    ├── user-flow.spec.ts       # Happy path smoke test
    ├── why.spec.ts             # Why screen filtering
    ├── dossier.spec.ts         # Dossier export functionality
    └── route-guards.spec.ts    # Navigation protection
```

### Running Specific Test Suites

**Lore compiler tests:**
```bash
npm run test scripts/compile-lore.test.ts
```

**Scorer tests:**
```bash
npm run test src/lib/scorer.test.ts
```

**Component tests:**
```bash
npm run test src/components/lore/
```

**Performance tests:**
```bash
npm run test -- --run src/screens/*.perf.test.tsx
```

### Test Debugging

**Vitest UI:**
```bash
npm run test:ui
```

**Playwright Debug Mode:**
```bash
npx playwright test --debug
```

**Playwright Trace Viewer:**
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Developer Tools

### Classification CLI

A command-line tool for debugging lore rules and testing classification logic without running the full application.

**Usage:**
```bash
npm run classify -- --date YYYY-MM-DD --time HH:MM --tz TIMEZONE
```

**Example:**
```bash
npm run classify -- --date 1990-01-15 --time 14:30 --tz America/New_York
```

**Output:**
```
📍 Birth Data: 1990-01-15 at 14:30 (America/New_York)

🔮 Human Design Extract:
{
  "type": "Manifesting Generator",
  "authority": "Mental",
  "profile": "6/3",
  ...
}

⚙️  Computing classification...

✨ Classification Result:
{
  "classification": "hybrid",
  "hybrid": ["Andromeda", "Pleiades"],
  ...
}

📊 Summary:
Classification: Hybrid (Andromeda + Pleiades)
Delta: 2.20%

Percentages:
  Andromeda: 25.88%
  Pleiades: 23.68%
  ...

Lore Version: 2025.10.18
Rules Hash: c3f7dd2f1f21f508
Input Hash: 489ee82e489ee82e
```

**Use Cases:**
- Test lore rule changes quickly
- Debug classification edge cases
- Verify deterministic behavior (same input → same hash)
- Generate test data for unit tests

**Note:** The CLI uses mock HD data generated deterministically from the birth data. For real API integration, use the web application.

### Pre-commit Hooks

Tests run automatically on commit via Husky:
- Linting (`npm run lint`)
- Type checking (`npm run typecheck`)
- Fast unit tests (no E2E)

## Project Structure

```
star-system-sorter/
├── data/
│   └── lore/
│       └── lore.yaml           # Lore rules (source of truth)
├── scripts/
│   └── compile-lore.ts         # Lore compiler
├── src/
│   ├── screens/                # Route components
│   ├── components/
│   │   ├── figma/              # Pre-built Figma components
│   │   └── lore/               # Lore-specific components
│   ├── lib/
│   │   ├── lore.bundle.ts      # Generated (do not edit)
│   │   ├── scorer.ts           # Classification algorithm
│   │   └── schemas.ts          # Zod schemas
│   ├── store/                  # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   └── api/                    # API client
├── tests/
│   └── e2e/                    # Playwright tests
└── coverage/                   # Test coverage reports
```

## Deployment

### Netlify (Current)

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (set in Netlify dashboard)
BODYGRAPH_API_KEY=your_key_here
```

Serverless function at `netlify/functions/hd.ts` handles API proxy.

### Vercel (Alternative)

```bash
# Build command
npm run build

# Output directory
dist

# Environment variables (set in Vercel dashboard)
BODYGRAPH_API_KEY=your_key_here
```

Serverless function at `api/hd.ts` handles API proxy.

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.

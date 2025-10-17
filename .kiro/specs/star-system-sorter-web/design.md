# Design Document - MVP

## MVP Scope

**IN**: 4 screens (Onboarding → Input → Result → Why), Express /api/hd proxy with 30-day cache, Figma components (Button/Card/Chip/Field/Crests), Zustand (birth data), unit tests + 1 Playwright smoke.

**OUT**: Profile, TabBar, Community, Settings, auth, profanity filters, avatar/narrative gen, paywall, big E2E suite.

## System Overview

```
React Client (Vite) → /api/hd (Vite proxy) → Express Server → BodyGraph API
                                                    ↓
                                              node-cache (30d)
```

**Layers**: Screens → Components (Figma) → Hooks → Store/API → Lib (schemas, scorer)

**Security**: API key stored as `BODYGRAPH_API_KEY` (NO `VITE_` prefix). Any `VITE_` var is bundled to client. Server reads `process.env.BODYGRAPH_API_KEY`.

## 4-Screen Flow

1. **OnboardingScreen** (`/`): Title, 3-step explainer, "Begin Sorting" button → `/input`
2. **InputScreen** (`/input`): Form (date MM/DD/YYYY, time HH:MM AM/PM, location, timezone). React Hook Form + Zod (BirthDataFormSchema). Submit → POST /api/hd → `/result`
3. **ResultScreen** (`/result`): StarSystemCrest, primary % radial chart, ally Chips, "View Why" button → `/why`
4. **WhyScreen** (`/why`): Contributors list (Card components), back button → `/result`

## Type Contracts

```typescript
// User input (client)
interface BirthDataForm {
  date: string;        // MM/DD/YYYY
  time: string;        // HH:MM AM/PM
  location: string;    // 2-100 chars, [a-zA-Z\s,.-]+
  timeZone: string;    // IANA
}

// API request (client → server)
interface BirthDataAPIRequest {
  dateISO: string;     // YYYY-MM-DD
  time: string;        // HH:mm (24h)
  timeZone: string;
}

// API response (server → client)
interface HDExtract {
  type: string;
  authority: string;
  profile: string;
  centers: string[];
  channels: number[];
  gates: number[];
}

// Classification result
interface ClassificationResult {
  classification: 'primary' | 'hybrid' | 'unresolved';
  primary?: string;
  hybrid?: [string, string];
  allies: Array<{ system: string; percentage: number }>;
  percentages: Record<string, number>;
  contributorsPerSystem: Record<string, string[]>;
  meta?: { canonVersion: string; canonChecksum: string }; // For debugging
}
```

## Test Stance

**Unit (Vitest)**: Golden fixtures for scorer.ts (known input → expected output), strict valid/invalid for schemas.ts, date/time transforms. Target 80%+ lib coverage.

**Component (RTL)**: Field error states, Button/Card variants. Minimal.

**E2E (Playwright)**: 1 smoke test (`tests/e2e/user-flow.spec.ts`): / → fill form → submit → see primary star system. Screenshot to `previews/e2e-happy.png`.

**Agent Snapshots**: `npm run snap` writes `previews/*.png` after dev server is up for visual verification.

## Loading & Error Handling

**Loading**: Button spinner + optional overlay (≥200ms debounce to avoid flicker).

**Errors**: Toast for NETWORK/API/VALIDATION with Retry button (no PII in messages).

## Acceptance (MVP)

- Routes load: /, /input, /result, /why
- Happy path: form → /api/hd → classify → result → why
- No client exposure of BODYGRAPH_API_KEY
- Unit tests pass; Playwright smoke produces previews/e2e-happy.png
- Basic a11y: 44px targets, visible focus, labeled fields

## Run & Deploy

**Dev**:
```bash
npm run dev          # Vite :5173
npm run server:dev   # Express :3000
npm run test         # Vitest watch
npm run e2e          # Playwright
npm run snap         # Screenshot previews
```

**Build**: `npm run build` → `dist/`

**Deploy**: Vercel/Netlify (set `BODYGRAPH_API_KEY` in dashboard, NO `VITE_` prefix). Configure rewrites/redirects to route /api to serverless functions (Vite proxy is dev-only).

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/hd" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/hd"
  status = 200
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Tech Stack

React 18 + TypeScript 5 + Vite 5, Tailwind CSS 3, React Router 6, React Hook Form 7 + Zod 3, Zustand 4, Express 4 + node-cache, Vitest + RTL + Playwright.

## File Structure

```
src/
├── screens/         # 4 screens
├── lib/             # schemas.ts, scorer.ts, canon.ts
├── api/             # bodygraph-client.ts
├── store/           # birthDataStore.ts
├── hooks/           # useHDData, useClassification
└── data/            # canon-data.yaml
Figma/components/s3/ # Button, Card, Chip, Field, Crests
server/src/          # Express /api/hd endpoint
tests/               # lib/, components/, e2e/
```

**Word count**: ~450 words

---

For detailed architecture, caching strategy, deployment options, and Phase 2 features, see [design-details.md](./design-details.md).

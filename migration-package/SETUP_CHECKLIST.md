# Setup Checklist for React Web Migration

## Phase 1: Project Initialization

- [ ] Create new React project with Vite or Next.js
- [ ] Install Tailwind CSS
- [ ] Copy `.env.example` to `.env` and add your API keys
- [ ] Set up TypeScript with strict mode
- [ ] Configure path aliases (`@/` for src)

## Phase 2: Design System Setup

- [ ] Copy design tokens from `design-system/tokens.ts` to your project
- [ ] Import Tailwind config from `design-system/tailwind.config.js`
- [ ] Set up CSS variables for colors and gradients
- [ ] Create base component library (Button, Card, Input, etc.)
- [ ] Import Figma components and verify they match design tokens

## Phase 3: API Integration

- [ ] Copy `api-docs/bodygraph-api.md` for reference
- [ ] Implement API client from `business-logic/api-client.ts`
- [ ] Set up 30-day caching strategy (use localStorage or IndexedDB)
- [ ] Test API integration with sample birth data
- [ ] Verify error handling and rate limiting

## Phase 4: Core Features

- [ ] Copy validation schemas from `business-logic/schemas.ts`
- [ ] Implement scoring algorithm from `business-logic/scorer.ts`
- [ ] Set up moderation system from `business-logic/moderation.ts`
- [ ] Create form validation with react-hook-form + Zod
- [ ] Build main screens: Onboarding, Input, Result, Profile, Settings

## Phase 5: State Management

- [ ] Set up Zustand store (or your preferred state manager)
- [ ] Implement birth data state
- [ ] Implement user preferences state
- [ ] Add persistence layer (localStorage)

## Phase 6: Testing & Quality

- [ ] Set up Jest + React Testing Library
- [ ] Copy test patterns from `testing/`
- [ ] Add ESLint + Prettier configuration
- [ ] Set up dependency-cruiser for architecture validation
- [ ] Run accessibility audit

## Phase 7: Deployment

- [ ] Set up build pipeline
- [ ] Configure environment variables for production
- [ ] Test on multiple browsers
- [ ] Deploy to hosting platform (Vercel, Netlify, etc.)

## Environment Variables Required

```bash
VITE_BODYGRAPH_API_KEY=your-api-key-here
VITE_API_BASE_URL=http://localhost:3000
VITE_CACHE_DURATION_DAYS=30
```

## Tech Stack Recommendations

- **Framework**: Vite + React 18+ or Next.js 14+
- **Styling**: Tailwind CSS 3+
- **Forms**: react-hook-form + Zod
- **State**: Zustand or Jotai
- **Router**: React Router 6+ or Next.js App Router
- **Testing**: Vitest + React Testing Library
- **Type Safety**: TypeScript 5+ strict mode

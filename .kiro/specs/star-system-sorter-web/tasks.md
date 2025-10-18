# Implementation Plan

## Overview

This implementation plan breaks down the Star System Sorter MVP into discrete, incremental coding tasks. Each task builds on previous work and includes specific requirements references. All tasks are required.

## Task List

- [x] 1. Project setup and configuration

  - Initialize Vite + React + TypeScript project with recommended dependencies
  - Configure Tailwind CSS with path to Figma design tokens
  - Set up path aliases (@/, @screens/, @lib/, @api/, @store/, @hooks/)
  - Create .env.example with BODYGRAPH_API_KEY placeholder
  - Configure Vite proxy for /api/\* → http://localhost:3000
  - _Requirements: 11.1, 11.4, 11.6, 11.9, 11.10_

- [x] 2. Copy business logic from migration package

  - Copy schemas.ts to src/lib/schemas.ts
  - Copy scorer.ts to src/lib/scorer.ts
  - Copy canon-data.yaml to src/data/canon-data.yaml
  - Create src/lib/canon.ts to load and parse canon data
  - Verify TypeScript compilation with no errors
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 2.1 Write unit tests for schemas

  - Test BirthDataFormSchema with valid inputs (MM/DD/YYYY, HH:MM AM/PM)
  - Test BirthDataFormSchema with invalid inputs (wrong formats, out of range)
  - Test BirthDataAPIRequestSchema validation
  - Test HDExtractSchema validation
  - _Requirements: 12.6_

- [x] 2.2 Write unit tests for scorer with golden fixtures

  - Create mock canon data fixture
  - Test computeScores() with known HD data → expected percentages
  - Test classify() for primary classification (>6% lead)
  - Test classify() for hybrid classification (≤6% difference)
  - Test contributor label generation
  - _Requirements: 12.7_

- [x] 3. Set up Express backend server

  - Create server/ directory with package.json
  - Install Express, cors, dotenv, node-cache, express-rate-limit
  - Create server/src/index.ts with Express app setup
  - Configure CORS for localhost:5173
  - Add rate limiting middleware (100 req/15min)
  - Create server/tsconfig.json
  - _Requirements: 4.1, 4.4, 4.11_

- [x] 4. Implement /api/hd endpoint

  - Create server/src/routes/hd.ts
  - Implement POST /api/hd handler with request validation
  - Add node-cache with 30-day TTL
  - Implement cache key generation as hash of dateISO|time|timeZone (not raw concatenation for privacy)
  - Check cache before calling BodyGraph API
  - Call BodyGraph API with Authorization header using process.env.BODYGRAPH_API_KEY
  - Extract type, authority, profile, gates, centers, channels from response
  - Store result in cache
  - Return HDExtract to client
  - Add error handling for API failures
  - Test rate limiting returns 429 when limit exceeded (curl or test stub)
  - _Requirements: 4.2, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11_

- [x] 5. Create API client

  - Create src/api/bodygraph-client.ts
  - Implement computeHDExtract() function with fetch to /api/hd
  - Create HDAPIError class with code and details
  - Add error handling for network errors, validation errors, API errors
  - Implement client-side caching with localStorage (30-day TTL)
  - Create cache key generation as hash of dateISO|time|timeZone (not raw concatenation for privacy)
  - Implement computeHDExtractWithCache() wrapper
  - _Requirements: 4.1, 8.8, 10.1, 10.2_

- [x] 6. Create Zustand store

  - Create src/store/birthDataStore.ts
  - Define BirthDataState interface with date, time, location, timeZone, hdData, classification
  - Implement store with Zustand + persist middleware
  - Add setData, setHDData, setClassification, clear actions
  - Configure localStorage persistence with key 'birth-data-storage'
  - _Requirements: 11.7_

- [x] 7. Create custom hooks

  - Create src/hooks/useHDData.ts with data, loading, error, fetchHDData
  - Create src/hooks/useClassification.ts with result, loading, error, classify
  - Integrate with birthDataStore for state management
  - Add loading state management (≥200ms debounce)
  - _Requirements: 3.12, 5.13_

- [x] 8. Implement OnboardingScreen

  - Create src/screens/OnboardingScreen.tsx
  - Import Button from Figma components
  - Import Starfield component from Figma App.tsx unchanged (matches Figma exactly, no changes)
  - Add app title with gradient text
  - Add 3-step explanation text
  - Add "Begin Sorting" Button with primary variant
  - Add legal disclaimer text at bottom
  - Implement navigation to /input on button click
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 9. Implement InputScreen

  - Create src/screens/InputScreen.tsx
  - Import Field component from Figma
  - Set up React Hook Form with zodResolver(BirthDataFormSchema)
  - Add date field (MM/DD/YYYY) with Calendar icon
  - Add time field (HH:MM AM/PM) with Clock icon
  - Add location field with MapPin icon
  - Add timezone select dropdown
  - Display field-level error messages from Zod validation
  - Add "Compute Chart" Button with primary variant
  - Implement form submission handler
  - Convert date to ISO format (YYYY-MM-DD)
  - Convert time to 24-hour format (HH:mm)
  - Call useHDData.fetchHDData() with converted data
  - Show Toast on API error with Retry button
  - Show Button loading spinner during API call
  - Navigate to /result on success
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9, 3.10, 3.11, 3.12_

- [x] 10. Implement ResultScreen

  - Create src/screens/ResultScreen.tsx
  - Import StarSystemCrests, Chip, Button, Card from Figma
  - Import Starfield component from Figma unchanged (matches Figma exactly, no changes)
  - Get classification from birthDataStore
  - Display appropriate StarSystemCrest based on primary/hybrid result
  - Show primary star system name and percentage
  - Render radial percentage chart (simple CSS/SVG)
  - Display ally Chips with system names and percentages (top 3)
  - Add "View Why" Button with primary variant → navigate to /why
  - Add legal disclaimer at bottom
  - Handle loading state while classification computes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.9, 6.10_

- [x] 11. Implement WhyScreen

  - Create src/screens/WhyScreen.tsx
  - Import Card component from Figma
  - Get classification from birthDataStore
  - Display "Why [System Name]" header
  - Map contributorsPerSystem to Card components
  - Show contributor labels with weights/percentages
  - Add back button to navigate to /result
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 12. Set up React Router

  - Create src/App.tsx with BrowserRouter
  - Define routes: / → OnboardingScreen, /input → InputScreen, /result → ResultScreen, /why → WhyScreen
  - Wrap routes in Suspense with loading fallback
  - Update src/main.tsx to render App
  - Test navigation flow between all screens
  - _Requirements: 11.9_

- [x] 13. Add global styles and Figma integration

  - Copy /Figma/globals.css to src/index.css
  - Import Tailwind directives (@tailwind base/components/utilities)
  - Ensure Figma design tokens are available as CSS variables
  - Verify all Figma components render with correct styling
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 1.9, 1.11, 1.12_

- [x] 14. Implement loading and error states

  - Add loading spinner to Button component (already in Figma)
  - Create loading overlay component for screen-level loading
  - Implement Toast component usage for errors
  - Add Retry button to error Toast
  - Ensure no PII in error messages
  - Add ≥200ms debounce to loading states to avoid flicker
  - _Requirements: 9.11, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 15. Add accessibility features

  - Ensure all form fields have proper labels
  - Add visible focus states to all interactive elements
  - Verify 44px minimum touch targets on all buttons
  - Test keyboard navigation (Tab, Enter, Space)
  - Add alt text to StarSystemCrest components
  - Verify color contrast ≥ 4.5:1 for all text
  - _Requirements: 9.7, 9.8, 9.9, 9.10, 9.13_

- [x] 16. Write Playwright smoke test

  - Create playwright.config.ts with use.baseURL = 'http://localhost:5173'
  - Create tests/e2e/user-flow.spec.ts
  - Test: Navigate to / → use getByRole('button', { name: /begin sorting/i }).click()
  - Test: Fill form using getByLabel() for each field (date: 10/03/1992, time: 12:03 AM, location: Attleboro, MA, timezone: America/New_York)
  - Test: Click getByRole('button', { name: /compute/i })
  - Test: Wait for /result page to load
  - Test: Verify getByText(/primary star system/i) is visible
  - Test: Take screenshot to previews/e2e-happy.png
  - Add data-testid attributes where getByRole/getByLabel are insufficient
  - _Requirements: 12.3, 12.11_

- [ ] 17. Configure production deployment

  - Create vercel.json with /api rewrite to serverless function AND /\* → /index.html fallback for SPA routes
  - OR create netlify.toml with /api redirect to Netlify function AND /\* → /index.html fallback for SPA routes
  - Set BODYGRAPH*API_KEY in platform dashboard (NO VITE* prefix)
  - Test production build with npm run build
  - Verify /api routing works in production
  - Verify client routes (/input, /result, /why) load on direct access/refresh
  - _Requirements: 4.2, 4.3_

- [ ] 18. Final testing and validation
  - Run all unit tests: npm run test
  - Verify ≥80% coverage for lib directory
  - Run Playwright smoke test: npm run e2e
  - Verify previews/e2e-happy.png is generated
  - Test complete happy path manually
  - Verify no BODYGRAPH_API_KEY exposure in client bundle
  - Check all 5 MVP Acceptance criteria
  - _Requirements: 12.1, 12.5, MVP Acceptance 1-5_

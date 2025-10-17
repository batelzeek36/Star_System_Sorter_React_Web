# Requirements Document

## Introduction

The Star System Sorter (S³) is a React Web application that provides deterministic star system classification based on Human Design birth chart data. The application collects user birth information (date, time, location, timezone), retrieves Human Design data from the BodyGraph Chart API, applies a proprietary scoring algorithm, and presents users with their star system classification results. The system emphasizes privacy, deterministic results, and a cosmic-themed user experience.

**Note:** Pre-built Figma components and screens exist in the `/Figma` directory, including Button, Card, Chip, Field, AppBar, TabBar, Toast, StarSystemCrests, and screen implementations (PaywallScreen, SettingsScreen, EmptyStatesScreen). The implementation will integrate these existing UI components with the business logic from the migration package.

## Glossary

- **Application**: The Star System Sorter React Web application
- **User**: An individual accessing the Application to receive star system classification
- **Birth_Data**: User-provided information including birth date, time, location, and timezone
- **BodyGraph_API**: External third-party API service (api.bodygraphchart.com) that provides Human Design chart data
- **HD_Data**: Human Design data retrieved from BodyGraph_API including type, authority, profile, gates, centers, and channels
- **Classification_Result**: The computed star system assignment based on HD_Data and scoring algorithm
- **Proxy_Server**: Node.js/Express backend server that intermediates between Application and BodyGraph_API
- **Cache_System**: 30-day data storage mechanism to reduce API calls and improve performance
- **Scoring_Algorithm**: Deterministic computation logic that maps HD_Data to star system classifications
- **Design_System**: Tailwind CSS-based styling framework with cosmic theme tokens
- **PII**: Personally Identifiable Information including birth data and location information
- **Figma_Components**: Pre-built React components in /Figma directory including Button, Card, Chip, Field, AppBar, TabBar, Toast, and StarSystemCrests
- **Figma_Screens**: Pre-existing screen implementations in /Figma/components/s3/screens including PaywallScreen, SettingsScreen, and EmptyStatesScreen

## Requirements

### Requirement 1: Figma Component Integration

**User Story:** As a developer, I want to leverage existing Figma components, so that I can focus on business logic integration rather than UI implementation.

#### Acceptance Criteria

1. THE Application SHALL use Figma_Components from /Figma/components/s3 directory for all UI elements
2. THE Application SHALL use Button component with variants (primary, secondary, ghost, destructive) and sizes (sm, md, lg)
3. THE Application SHALL use Card component with variants (default, emphasis, warning) for content containers
4. THE Application SHALL use Chip component for star system allies display with percentage values
5. THE Application SHALL use Field component for form inputs with icon, helper text, and error state support
6. **Phase 2**: THE Application SHALL use AppBar component for screen headers with back navigation
7. **Phase 2**: THE Application SHALL use TabBar component for bottom navigation between Home, Community, and Profile
8. THE Application SHALL use Toast component for error notifications in MVP
9. THE Application SHALL use StarSystemCrests components (PleiadesCrest, SiriusCrest, LyraCrest, AndromedaCrest, OrionCrest, ArcturusCrest) for visual representation
10. **Phase 2**: THE Application SHALL use existing Figma_Screens (PaywallScreen, SettingsScreen, EmptyStatesScreen) where applicable
11. THE Application SHALL maintain consistency with Figma design tokens defined in /Figma/design-tokens.json
12. THE Application SHALL use CSS variables from /Figma/globals.css for styling

### Requirement 2: User Onboarding

**User Story:** As a new user, I want to see a welcoming introduction screen, so that I understand the purpose of the application before providing my information.

#### Acceptance Criteria

1. WHEN the User first accesses the Application, THE Application SHALL display an onboarding screen with application title, description, and call-to-action button
2. THE Application SHALL use Button component from Figma_Components with primary variant for "Begin Sorting" call-to-action
3. THE Application SHALL display the legal disclaimer "For insight & entertainment. Not medical, financial, or legal advice." on the onboarding screen
4. WHEN the User activates the call-to-action button, THE Application SHALL navigate to the birth data input screen
5. THE Application SHALL apply the cosmic theme design tokens to the onboarding screen including dark background and lavender gradients
6. THE Application SHALL display starfield background using the existing Figma Starfield component imported unchanged from the Figma code (no reimplementation)

### Requirement 3: Birth Data Collection

**User Story:** As a user, I want to input my birth information accurately, so that I receive a correct star system classification.

#### Acceptance Criteria

1. THE Application SHALL provide input fields for birth date, birth time, location, and timezone
2. WHEN the User submits Birth_Data, THE Application SHALL validate all required fields are populated using BirthDataFormSchema
3. THE Application SHALL validate birth date is in MM/DD/YYYY format and represents a valid historical date between 1900 and current year
4. THE Application SHALL validate birth time is in 12-hour format (HH:MM AM/PM) with hours between 1-12 and minutes between 0-59
5. THE Application SHALL validate location contains only letters, spaces, commas, periods, and hyphens with length between 2-100 characters
6. THE Application SHALL validate timezone is a valid IANA timezone identifier
7. WHEN Birth_Data validation fails, THE Application SHALL display specific error messages for each invalid field as defined in BirthDataFormSchema
8. **Phase 2**: THE Application SHALL moderate location input text to prevent profanity and inappropriate content
9. THE Application SHALL use React Hook Form with Zod resolver for form validation
10. THE Application SHALL convert user-friendly date format (MM/DD/YYYY) to ISO format (YYYY-MM-DD) before API submission
11. THE Application SHALL convert 12-hour time format to 24-hour format (HH:mm) before API submission
12. WHEN the User submits valid Birth_Data, THE Application SHALL proceed to retrieve HD_Data

### Requirement 4: API Integration and Caching

**User Story:** As a user, I want my birth chart data retrieved securely and efficiently, so that I receive results quickly without exposing sensitive API credentials.

#### Acceptance Criteria

1. THE Application SHALL send Birth_Data to Proxy_Server endpoint (POST /api/hd) rather than directly to BodyGraph_API
2. THE Proxy_Server SHALL store the BodyGraph_API key in server environment variables as `BODYGRAPH_API_KEY` (no `VITE_` prefix) and SHALL never expose it to the client bundle
3. THE Application SHALL use the Vite proxy for `/api/*` **in development only**. In production, `/api/*` SHALL be routed to the backend via platform rewrites/serverless functions (e.g., Vercel/Netlify)
4. THE Proxy_Server SHALL be implemented using Node.js with Express framework
5. WHEN Proxy_Server receives Birth_Data, THE Proxy_Server SHALL check Cache_System for existing HD_Data matching the Birth_Data
6. IF cached HD_Data exists and is less than 30 days old, THEN THE Proxy_Server SHALL return cached HD_Data without calling BodyGraph_API
7. IF cached HD_Data does not exist or is older than 30 days, THEN THE Proxy_Server SHALL request HD_Data from BodyGraph_API
8. WHEN BodyGraph_API returns HD_Data, THE Proxy_Server SHALL store HD_Data in Cache_System with 30-day expiration using node-cache
9. THE Proxy_Server SHALL extract type, authority, profile, gates, centers, and channels from BodyGraph_API response
10. WHEN BodyGraph_API request fails, THE Proxy_Server SHALL return error response with appropriate HTTP status code
11. THE Proxy_Server SHALL implement rate limiting of 100 requests per 15-minute window per IP address using express-rate-limit
12. THE Application SHALL never include BodyGraph_API key in client-side code or environment variables accessible to browser

### Requirement 5: Classification Computation

**User Story:** As a user, I want to receive a deterministic star system classification, so that I get consistent results for the same birth data.

#### Acceptance Criteria

1. WHEN the Application receives HD_Data, THE Application SHALL validate HD_Data structure matches HDExtractSchema before processing
2. THE Application SHALL generate attribute keys from HD_Data including type, authority, profile, centers, channels, and gates
3. THE Application SHALL compute raw scores for each star system by matching attribute keys against canon weights
4. THE Application SHALL normalize raw scores to percentages with 0.1% precision
5. THE Application SHALL classify result as "primary" when top system has greater than 6% lead over second system
6. THE Application SHALL classify result as "hybrid" when top two systems are within 6% of each other
7. THE Application SHALL classify result as "unresolved" when no clear classification exists
8. THE Application SHALL sort system scores by percentage in descending order
9. THE Application SHALL include top 3 systems as allies in Classification_Result
10. THE Application SHALL create human-readable labels for contributors (e.g., "Type: Manifesting Generator", "Gate: 34")
11. THE Scoring_Algorithm SHALL produce identical Classification_Result for identical HD_Data inputs
12. THE Application SHALL include canon version and checksum in Classification_Result metadata
13. WHEN Scoring_Algorithm computation completes, THE Application SHALL navigate to results display screen

### Requirement 6: Results Display

**User Story:** As a user, I want to see my star system classification with visual representation, so that I understand my results clearly.

#### Acceptance Criteria

1. THE Application SHALL display Classification_Result including star system name and percentage
2. THE Application SHALL render appropriate StarSystemCrest component (PleiadesCrest, SiriusCrest, LyraCrest, AndromedaCrest, OrionCrest, or ArcturusCrest) corresponding to the Classification_Result
3. THE Application SHALL display radial percentage chart showing primary star system percentage
4. THE Application SHALL display ally star systems using Chip components with system name and percentage
5. THE Application SHALL display key HD_Data attributes (type, authority, profile) on the results screen
6. THE Application SHALL use Button component with primary variant for "View Why" navigation
7. **Phase 2**: THE Application SHALL use Button component with secondary variant for "Generate Narrative" action
8. **Phase 2**: THE Application SHALL provide TabBar navigation to Community and Profile screens
9. THE Application SHALL apply cosmic theme styling with starfield background to results screen using the same Figma Starfield component imported unchanged
10. THE Application SHALL display the legal disclaimer "For insight & entertainment. Not medical, financial, or legal advice." on the results screen

### Requirement 7: Classification Explanation

**User Story:** As a user, I want to understand why I received my classification, so that I can learn about the factors that influenced my result.

#### Acceptance Criteria

1. WHEN the User requests classification explanation, THE Application SHALL display a detailed explanation screen
2. THE Application SHALL show which HD_Data attributes contributed to the Classification_Result
3. THE Application SHALL explain the scoring methodology in user-friendly language
4. THE Application SHALL provide navigation option to return to results screen
5. THE Application SHALL use "star system" terminology consistently and never use "house" terminology

### Requirement 8: Privacy and Compliance

**User Story:** As a user, I want my personal birth data protected, so that my privacy is maintained.

#### Acceptance Criteria

1. THE Application SHALL never log Birth_Data or PII to console, analytics, or error tracking systems
2. THE Application SHALL hash any user identifiers before sending to analytics or metrics systems
3. THE Application SHALL store BodyGraph_API key only in server environment variables
4. THE Application SHALL use HTTPS for all client-server communication in production
5. THE Application SHALL display disclaimer "For insight & entertainment. Not medical, financial, or legal advice." on all screens
6. THE Application SHALL use terminology "star system" consistently and never use term "house"
7. THE Proxy_Server SHALL not persist Birth_Data beyond the duration of the API request
8. THE Cache_System SHALL use hashed cache keys that do not expose raw Birth_Data
9. **Phase 2**: THE Application SHALL comply with GDPR requirements for EU users
10. **Phase 2**: THE Application SHALL comply with CCPA requirements for California users
11. **Phase 2**: THE Application SHALL provide privacy policy accessible from all screens
12. **Phase 2**: THE Application SHALL provide terms of service accessible from all screens
13. **Phase 2**: THE Application SHALL implement content moderation for all user text inputs
14. **Phase 2**: THE Application SHALL reject location inputs containing profanity or inappropriate content
15. THE Application SHALL enforce maximum length of 100 characters for location input
16. **Phase 2**: THE Application SHALL include third-party attribution for BodyGraph Chart API in about section
17. **Phase 2**: THE Application SHALL implement age restriction of 13+ for COPPA compliance
18. **Phase 2**: THE Application SHALL provide contact information for privacy inquiries and data deletion requests

### Requirement 9: Responsive Design and Accessibility

**User Story:** As a user on any device, I want the application to work smoothly, so that I can access my classification from desktop or mobile.

#### Acceptance Criteria

1. THE Application SHALL render responsively on viewport widths from 320px to 2560px
2. **Phase 2**: THE Application SHALL apply Figma design tokens from `/Figma/design-tokens.json` and global styles from `/Figma/globals.css` consistently across all components
3. **Phase 2**: THE Application SHALL use Tailwind CSS configuration from tailwind.config.js with custom design tokens
4. **Phase 2**: THE Application SHALL implement dark theme with canvas-dark (#0a0612) background color
5. **Phase 2**: THE Application SHALL use lavender color palette (lavender-100 through lavender-900) for primary UI elements
6. **Phase 2**: THE Application SHALL apply cosmic theme gradients for buttons, cards, and text as defined by `/Figma/design-tokens.json`
7. THE Application SHALL use semantic HTML elements for proper accessibility
8. THE Application SHALL provide keyboard navigation support for all interactive elements
9. THE Application SHALL maintain minimum color contrast ratios of 4.5:1 for text readability
10. THE Application SHALL implement minimum touch target size of 44px (spacing.11) for interactive elements
11. THE Application SHALL display loading states during API requests
12. **Phase 2**: THE Application SHALL use elevation shadows with lavender tint for depth perception
13. THE Application SHALL implement focus states with visible focus ring

### Requirement 10: Error Handling

**User Story:** As a user, I want clear feedback when something goes wrong, so that I know how to proceed.

#### Acceptance Criteria

1. WHEN network request to Proxy_Server fails, THE Application SHALL display user-friendly error message
2. WHEN BodyGraph_API returns error response, THE Application SHALL display appropriate error message without exposing technical details
3. WHEN validation fails on Birth_Data input, THE Application SHALL display field-specific error messages
4. WHEN rate limit is exceeded, THE Application SHALL display message instructing User to try again later
5. THE Application SHALL provide retry option for failed API requests
6. THE Application SHALL log errors to console in development environment only

### Requirement 11: Project Architecture

**User Story:** As a developer, I want the codebase to follow clean architecture principles, so that the application is maintainable and scalable.

#### Acceptance Criteria

1. THE Application SHALL organize code in layered structure: Screens → Components → Hooks → Store/API → Lib
2. THE Application SHALL prevent circular dependencies between modules
3. THE Application SHALL export module interfaces through index.ts files and prohibit deep imports
4. THE Application SHALL maintain file sizes between 100-200 lines of code with maximum of 500 lines
5. THE Application SHALL use TypeScript for type safety across all modules
6. THE Application SHALL configure path aliases for clean imports (@components, @lib, @screens, @api, @store, @hooks, @theme)
7. THE Application SHALL use Zustand for state management
8. THE Application SHALL use React Hook Form with Zod for form validation
9. THE Application SHALL use React Router for navigation
10. THE Application SHALL use Vite as build tool and development server
11. THE Application SHALL enforce dependency rules: Lib cannot import from Components, Screens, Hooks, Store, or API
12. THE Application SHALL enforce dependency rules: Components cannot import from Screens
13. THE Application SHALL enforce dependency rules: Store and API cannot import from Components, Screens, or Hooks

### Requirement 12: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive test coverage, so that the application is reliable and maintainable.

#### Acceptance Criteria

1. THE Application SHALL use Vitest as the unit testing framework
2. THE Application SHALL use React Testing Library for component testing
3. THE Application SHALL use Playwright for end-to-end testing, with a single smoke test for the MVP happy path
4. **Phase 2**: THE Application SHALL use MSW (Mock Service Worker) for API mocking in tests
5. THE Application SHALL achieve minimum 80% code coverage for business logic in lib directory
6. THE Application SHALL test all Zod validation schemas with valid and invalid inputs
7. THE Application SHALL test Scoring_Algorithm with deterministic test cases
8. **Phase 2**: THE Application SHALL test form validation with React Hook Form integration
9. **Phase 2**: THE Application SHALL test API client error handling and retry logic
10. **Phase 2**: THE Application SHALL test caching behavior for HD_Data retrieval
11. (Merged into 12.3)
12. **Phase 2**: THE Application SHALL configure test environment with jsdom for DOM simulation
13. **Phase 2**: THE Application SHALL mock window.matchMedia for responsive design tests
14. **Phase 2**: THE Application SHALL run tests in CI/CD pipeline before deployment


## MVP Acceptance

The following criteria define when the MVP is complete and ready for user testing:

1. **Routes Load**: All 4 routes (`/`, `/input`, `/result`, `/why`) load without errors
2. **Happy Path Works**: Complete user flow functions correctly: form submission → `/api/hd` API call → classification computation → results display → explanation view
3. **API Key Security**: No client exposure of `BODYGRAPH_API_KEY`; production routing uses platform rewrites/serverless functions (not Vite proxy)
4. **Tests Pass**: Unit tests pass with ≥80% coverage for `lib` directory; single Playwright smoke test produces `previews/e2e-happy.png`
5. **Basic Accessibility**: Visible focus states, properly labeled form fields, 44px minimum touch targets, color contrast ≥ 4.5:1


## Phase 2 Items Checklist

The following requirements are deferred to Phase 2 (post-MVP):

**Requirement 1 (Figma Component Integration):**
- 1.6: AppBar component
- 1.7: TabBar component
- 1.10: Figma_Screens (PaywallScreen, SettingsScreen, EmptyStatesScreen)

**Requirement 2 (User Onboarding):**
- (All in MVP scope)

**Requirement 3 (Birth Data Collection):**
- 3.8: Profanity/inappropriate content moderation

**Requirement 6 (Results Display):**
- 6.7: "Generate Narrative" button
- 6.8: TabBar navigation to Community/Profile

**Requirement 8 (Privacy and Compliance):**
- 8.9: GDPR compliance
- 8.10: CCPA compliance
- 8.11: Privacy policy links
- 8.12: Terms of service links
- 8.13: Content moderation for all user inputs
- 8.14: Profanity rejection
- 8.16: Third-party attribution
- 8.17: COPPA age restriction
- 8.18: Contact information for privacy requests

**Requirement 9 (Responsive Design and Accessibility):**
- 9.2: Design tokens from design-tokens.json/globals.css
- 9.3: Tailwind CSS configuration
- 9.4: Dark theme canvas-dark
- 9.5: Lavender color palette
- 9.6: Cosmic theme gradients
- 9.12: Elevation shadows with lavender tint

**Requirement 12 (Testing and Quality Assurance):**
- 12.4: MSW for API mocking
- 12.8: Form validation integration tests
- 12.9: API client error handling tests
- 12.10: Caching behavior tests
- 12.12: jsdom test environment configuration
- 12.13: window.matchMedia mocking
- 12.14: CI/CD pipeline integration

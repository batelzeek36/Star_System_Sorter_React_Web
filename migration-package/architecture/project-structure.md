# Recommended Project Structure for React Web

## Directory Layout

```
star-system-sorter-web/
├── public/                    # Static assets
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── api/                   # API client layer
│   │   ├── bodygraph-client.ts
│   │   └── types.ts
│   ├── components/            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Field.tsx
│   │   ├── StarSystemCrest.tsx
│   │   ├── RadialChart.tsx
│   │   └── StarfieldBackground.tsx
│   ├── screens/               # Page components
│   │   ├── OnboardingScreen.tsx
│   │   ├── InputScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── WhyScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── lib/                   # Utilities and helpers
│   │   ├── schemas.ts         # Zod validation schemas
│   │   ├── scorer.ts          # Scoring algorithm
│   │   ├── validation.ts      # Form validation helpers
│   │   └── utils.ts           # General utilities
│   ├── store/                 # State management (Zustand)
│   │   ├── birthDataStore.ts
│   │   ├── userStore.ts
│   │   └── index.ts
│   ├── theme/                 # Design system
│   │   ├── tokens.ts          # Design tokens
│   │   └── index.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useHDData.ts
│   │   ├── useClassification.ts
│   │   └── useLocalStorage.ts
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── hd.ts          # BodyGraph API proxy
│   │   ├── middleware/
│   │   │   ├── rateLimit.ts
│   │   │   └── validation.ts
│   │   └── index.ts           # Server entry
│   ├── package.json
│   └── tsconfig.json
├── tests/                     # Test files
│   ├── components/
│   ├── lib/
│   └── integration/
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts             # or next.config.js
└── README.md
```

## Layered Architecture

Follow strict layering to maintain clean architecture:

```
Screens (top layer)
  ↓ can import from
Components
  ↓ can import from
Hooks
  ↓ can import from
Store/API
  ↓ can import from
Lib (utilities)
```

**Rules:**
- Lower layers CANNOT import from higher layers
- Components cannot import from Screens
- Lib cannot import from Components, Hooks, or Screens
- Each module exports through `index.ts` (no deep imports)

## Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@lib/*": ["src/lib/*"],
      "@api/*": ["src/api/*"],
      "@store/*": ["src/store/*"],
      "@theme/*": ["src/theme/*"],
      "@hooks/*": ["src/hooks/*"]
    }
  }
}
```

And in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@api': path.resolve(__dirname, './src/api'),
      '@store': path.resolve(__dirname, './src/store'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
});
```

## File Size Guidelines

- **Target**: 100-200 lines of code
- **Soft Limit**: 300 lines of code
- **Hard Limit**: 500 lines of code (must refactor)

When files grow too large:
- Extract reusable components
- Split complex logic into helper functions
- Move type definitions to separate files
- Create module directories with `index.ts`

## Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`validation.ts`)
- **Directories**: kebab-case or lowercase
- **Components**: PascalCase
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

## Import Order

1. External dependencies (React, etc.)
2. Internal absolute imports (`@/...`)
3. Relative imports (`./...`)
4. Type imports (if separate)

Example:

```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@components/Button';
import { computeScores } from '@lib/scorer';

import { FormField } from './FormField';

import type { BirthDataForm } from '@lib/schemas';
```

## Module Exports

Each module should have an `index.ts` that exports its public API:

```typescript
// src/components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export type { ButtonProps, CardProps, InputProps } from './types';
```

This prevents deep imports and makes refactoring easier.

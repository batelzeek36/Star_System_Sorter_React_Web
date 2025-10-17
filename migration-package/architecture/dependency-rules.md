# Dependency Rules & Architecture Validation

## Overview

Maintain clean architecture by enforcing dependency rules. Use `dependency-cruiser` to validate your architecture automatically.

## Installation

```bash
npm install --save-dev dependency-cruiser
```

## Configuration

Create `.dependency-cruiser.js`:

```javascript
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'No circular dependencies allowed',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'No orphaned files (files not imported anywhere)',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
          '\\.d\\.ts$',                              // type definitions
          '(^|/)tsconfig\\.json$',                  // tsconfig
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$', // configs
        ],
      },
      to: {},
    },
    {
      name: 'no-lib-to-components',
      severity: 'error',
      comment: 'Lib (utilities) cannot import from components',
      from: {
        path: '^src/lib',
      },
      to: {
        path: '^src/components',
      },
    },
    {
      name: 'no-lib-to-screens',
      severity: 'error',
      comment: 'Lib (utilities) cannot import from screens',
      from: {
        path: '^src/lib',
      },
      to: {
        path: '^src/screens',
      },
    },
    {
      name: 'no-components-to-screens',
      severity: 'error',
      comment: 'Components cannot import from screens',
      from: {
        path: '^src/components',
      },
      to: {
        path: '^src/screens',
      },
    },
    {
      name: 'no-deep-imports',
      severity: 'warn',
      comment: 'Import from module index.ts, not deep files',
      from: {},
      to: {
        path: '^src/[^/]+/.+',
        pathNot: '^src/[^/]+/index\\.(ts|tsx)$',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
      archi: {
        collapsePattern: '^(node_modules|packages|src/[^/]+)/[^/]+',
      },
    },
  },
};
```

## NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "lint:deps": "depcruise --validate .dependency-cruiser.js src",
    "lint:deps:graph": "depcruise --validate --output-type dot .dependency-cruiser.js src | dot -T svg > dependency-graph.svg"
  }
}
```

## CI Integration

Add to your CI pipeline (GitHub Actions example):

```yaml
name: Architecture Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint:deps
```

## Layering Rules

### Allowed Dependencies

```
Screens → Components, Hooks, Store, API, Lib
Components → Hooks, Store, API, Lib
Hooks → Store, API, Lib
Store → API, Lib
API → Lib
Lib → (no internal dependencies)
```

### Forbidden Dependencies

```
Lib ✗→ Components, Screens, Hooks, Store, API
Components ✗→ Screens
Store ✗→ Components, Screens, Hooks
API ✗→ Components, Screens, Hooks, Store
```

## Best Practices

1. **No Circular Dependencies**: Always forbidden
2. **Import from Index**: Use module `index.ts` files
3. **Respect Layers**: Lower layers cannot import from higher layers
4. **Keep Files Small**: Target 100-200 LOC, max 500 LOC
5. **Single Responsibility**: Each file should have one clear purpose

## Validation Commands

```bash
# Validate architecture
npm run lint:deps

# Generate dependency graph
npm run lint:deps:graph

# Check specific path
depcruise --validate .dependency-cruiser.js src/components
```

## Common Violations

### Circular Dependencies

```typescript
// ❌ Bad: Circular dependency
// fileA.ts
import { funcB } from './fileB';

// fileB.ts
import { funcA } from './fileA';
```

**Fix**: Extract shared code to a third file.

### Deep Imports

```typescript
// ❌ Bad: Deep import
import { computeScore } from '@lib/scorer/score';

// ✅ Good: Import from index
import { computeScore } from '@lib/scorer';
```

### Layer Violations

```typescript
// ❌ Bad: Lib importing from Components
// src/lib/utils.ts
import { Button } from '@components/Button';

// ✅ Good: Components importing from Lib
// src/components/Button.tsx
import { cn } from '@lib/utils';
```

## Enforcement

Run `npm run lint:deps` in:
- Pre-commit hooks (using Husky)
- CI/CD pipeline
- Before merging PRs
- During code review

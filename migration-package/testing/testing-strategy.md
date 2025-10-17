# Testing Strategy for React Web

## Testing Pyramid

```
       /\
      /E2E\         (Few) - Critical user flows
     /------\
    /Integration\   (Some) - Component interactions
   /------------\
  /  Unit Tests  \  (Many) - Business logic, utilities
 /----------------\
```

## Tech Stack

- **Unit Tests**: Vitest or Jest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress
- **API Mocking**: MSW (Mock Service Worker)

## Installation

```bash
# Vitest + React Testing Library
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# MSW for API mocking
npm install --save-dev msw

# Playwright for E2E
npm install --save-dev @playwright/test
```

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## Unit Tests

### Testing Business Logic

```typescript
// tests/lib/scorer.test.ts
import { describe, it, expect } from 'vitest';
import { computeScores, classify } from '@lib/scorer';
import { mockHDExtract, mockCanon } from './mockData';

describe('Scorer', () => {
  describe('computeScores', () => {
    it('should compute scores for all systems', () => {
      const scores = computeScores(mockHDExtract, mockCanon);
      
      expect(scores).toHaveLength(4);
      expect(scores[0].percentage).toBeGreaterThan(0);
      expect(scores.every(s => s.percentage >= 0 && s.percentage <= 100)).toBe(true);
    });

    it('should sort scores by percentage descending', () => {
      const scores = computeScores(mockHDExtract, mockCanon);
      
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i].percentage).toBeGreaterThanOrEqual(scores[i + 1].percentage);
      }
    });
  });

  describe('classify', () => {
    it('should classify as primary when lead > 6%', () => {
      const scores = computeScores(mockHDExtract, mockCanon);
      const result = classify(scores, mockCanon);
      
      expect(result.classification).toBe('primary');
      expect(result.primary).toBeDefined();
    });
  });
});
```

### Testing Validation

```typescript
// tests/lib/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { BirthDataFormSchema } from '@lib/schemas';

describe('BirthDataFormSchema', () => {
  it('should validate correct birth data', () => {
    const data = {
      date: '10/03/1992',
      time: '12:03 AM',
      location: 'New York, NY',
      timeZone: 'America/New_York',
    };

    const result = BirthDataFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid date format', () => {
    const data = {
      date: '1992-10-03',
      time: '12:03 AM',
      location: 'New York, NY',
      timeZone: 'America/New_York',
    };

    const result = BirthDataFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
```

## Component Tests

```typescript
// tests/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@components/Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Integration Tests

```typescript
// tests/integration/input-flow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputScreen } from '@screens/InputScreen';

describe('Input Flow', () => {
  it('should submit form with valid data', async () => {
    render(<InputScreen />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/date/i), '10/03/1992');
    await userEvent.type(screen.getByLabelText(/time/i), '12:03 AM');
    await userEvent.type(screen.getByLabelText(/location/i), 'New York, NY');
    
    // Submit
    await userEvent.click(screen.getByText(/submit/i));
    
    // Verify
    await waitFor(() => {
      expect(screen.getByText(/computing/i)).toBeInTheDocument();
    });
  });
});
```

## API Mocking with MSW

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/hd', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      type: 'Manifesting Generator',
      authority: 'Sacral',
      profile: '1/3',
      centers: ['Sacral', 'Throat'],
      channels: [34, 20],
      gates: [1, 2, 13, 23, 43],
    });
  }),
];
```

```typescript
// tests/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## E2E Tests with Playwright

```typescript
// tests/e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete user flow', async ({ page }) => {
  // Navigate to app
  await page.goto('/');
  
  // Click get started
  await page.click('text=Get Started');
  
  // Fill birth data
  await page.fill('[name="date"]', '10/03/1992');
  await page.fill('[name="time"]', '12:03 AM');
  await page.fill('[name="location"]', 'New York, NY');
  
  // Submit
  await page.click('text=Submit');
  
  // Wait for results
  await expect(page.locator('text=Your Star System')).toBeVisible();
});
```

## NPM Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

## CI Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

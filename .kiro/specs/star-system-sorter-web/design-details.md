# Design Details - Reference

This document contains detailed architecture information, implementation patterns, and Phase 2 considerations. For MVP scope, see [design.md](./design.md).

## Detailed Architecture

### Layered Dependency Rules

```
Layer 5: Screens → imports from Layer 4
Layer 4: Components → imports from Layer 3
Layer 3: Hooks → imports from Layer 2
Layer 2: Store/API → imports from Layer 1
Layer 1: Lib → no internal imports
```

**Forbidden**: Lower layers cannot import from higher layers. Components cannot import from Screens. Lib cannot import from any other layer.

### Vite Proxy Configuration

**Development** (`vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

**Production**: Vercel/Netlify auto-routes /api to serverless functions.

## Caching Strategy

### Two-Tier Caching

**Server-Side** (node-cache):
```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 }); // 30 days

const cacheKey = `${dateISO}T${time}:${timeZone}`;
const cached = cache.get(cacheKey);
if (cached) return cached;
// ... fetch from BodyGraph API
cache.set(cacheKey, result);
```

**Client-Side** (localStorage):
```typescript
const CACHE_KEY_PREFIX = 'hd_cache_';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

function getCacheKey(data: BirthDataAPIRequest): string {
  return `${CACHE_KEY_PREFIX}${data.dateISO}_${data.time}_${data.timeZone}`;
}

const cached = localStorage.getItem(cacheKey);
if (cached) {
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp < CACHE_DURATION) return data;
}
```

## State Management

### birthDataStore (Zustand)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BirthDataState {
  date: string;
  time: string;
  location: string;
  timeZone: string;
  hdData: HDExtract | null;
  classification: ClassificationResult | null;
  setData: (data: Partial<BirthDataState>) => void;
  setHDData: (data: HDExtract) => void;
  setClassification: (result: ClassificationResult) => void;
  clear: () => void;
}

export const useBirthDataStore = create<BirthDataState>()(
  persist(
    (set) => ({
      date: '',
      time: '',
      location: '',
      timeZone: '',
      hdData: null,
      classification: null,
      setData: (data) => set((state) => ({ ...state, ...data })),
      setHDData: (hdData) => set({ hdData }),
      setClassification: (classification) => set({ classification }),
      clear: () => set({
        date: '',
        time: '',
        location: '',
        timeZone: '',
        hdData: null,
        classification: null,
      }),
    }),
    { name: 'birth-data-storage' }
  )
);
```

## API Client Implementation

### bodygraph-client.ts

```typescript
export class HDAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HDAPIError';
  }
}

export async function computeHDExtract(
  data: BirthDataAPIRequest
): Promise<HDExtract> {
  try {
    const response = await fetch('/api/hd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new HDAPIError(
        error.message || 'Failed to compute HD data',
        error.code || 'UNKNOWN_ERROR',
        error.details
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof HDAPIError) throw error;
    throw new HDAPIError(
      'Network error. Please check your connection.',
      'NETWORK_ERROR'
    );
  }
}
```

## Server Implementation

### Express /api/hd Endpoint

```typescript
import express from 'express';
import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

router.post('/api/hd', limiter, async (req, res) => {
  try {
    const { dateISO, time, timeZone } = req.body;
    
    // Check cache
    const cacheKey = `${dateISO}T${time}:${timeZone}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);
    
    // Call BodyGraph API
    const response = await fetch('https://api.bodygraphchart.com/v221006/hd-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BODYGRAPH_API_KEY}`,
      },
      body: JSON.stringify({
        date: `${dateISO} ${time}`,
        timezone: timeZone,
      }),
    });

    if (!response.ok) throw new Error('BodyGraph API request failed');
    
    const data = await response.json();
    const extract = {
      type: data.Properties?.Type?.option || 'Unknown',
      authority: data.Properties?.InnerAuthority?.option || 'Unknown',
      profile: data.Properties?.Profile?.option || 'Unknown',
      gates: data.Properties?.Gates?.list?.map((g: any) => g.option) || [],
      centers: [],
      channels: [],
    };
    
    cache.set(cacheKey, extract);
    res.json(extract);
  } catch (error) {
    console.error('HD API Error:', error);
    res.status(500).json({ error: 'Failed to compute HD data' });
  }
});

export default router;
```

## Deployment Options

### Vercel

**vercel.json**:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "env": {
    "BODYGRAPH_API_KEY": "@bodygraph-api-key"
  }
}
```

Set secret: `vercel secrets add bodygraph-api-key your-key-here`

### Netlify

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

Set env var in Netlify dashboard: `BODYGRAPH_API_KEY`

### Traditional (Nginx + PM2)

**nginx.conf**:
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    root /var/www/app/dist;
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**PM2**:
```bash
pm2 start server/dist/index.js --name s3-api
pm2 save
pm2 startup
```

## Testing Patterns

### Golden Fixture Example

```typescript
// tests/lib/scorer.test.ts
import { computeScores, classify } from '@lib/scorer';
import { mockCanon } from './fixtures/canon';

describe('scorer - golden fixtures', () => {
  it('should classify Pleiades primary (62%)', () => {
    const hdData = {
      type: 'Manifestor',
      authority: 'Emotional',
      profile: '1/3',
      centers: ['Sacral', 'Throat'],
      channels: [34, 57],
      gates: [1, 13, 25],
    };
    
    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);
    
    expect(result.classification).toBe('primary');
    expect(result.primary).toBe('Pleiades');
    expect(result.percentages['Pleiades']).toBeCloseTo(62.0, 1);
    expect(result.allies).toHaveLength(3);
  });
  
  it('should classify hybrid when within 6%', () => {
    const hdData = {
      type: 'Projector',
      authority: 'Splenic',
      profile: '2/4',
      centers: ['Spleen', 'G'],
      channels: [18, 58],
      gates: [2, 14, 29],
    };
    
    const scores = computeScores(hdData, mockCanon);
    const result = classify(scores, mockCanon);
    
    expect(result.classification).toBe('hybrid');
    expect(result.hybrid).toEqual(['Sirius', 'Pleiades']);
  });
});
```

### Component Test Example

```typescript
// tests/components/Field.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '@/Figma/components/s3/Field';

describe('Field', () => {
  it('should display error message', () => {
    render(<Field label="Date" error="Invalid date format" />);
    expect(screen.getByText('Invalid date format')).toBeInTheDocument();
  });
  
  it('should have accessible label', () => {
    render(<Field label="Date" />);
    const input = screen.getByLabelText('Date');
    expect(input).toBeInTheDocument();
  });
});
```

## Phase 2 Features

### Community Features
- Feed with posts, likes, replies
- Quests and challenges
- Team/star system membership
- Leaderboards

### User Features
- Profile screen with avatar
- Settings screen
- User authentication
- Subscription/paywall

### Content Features
- Narrative generation (LLM)
- Avatar generation
- Music theme selection
- Game modes

### Technical Enhancements
- Service Worker (offline support)
- PWA manifest
- Push notifications
- Analytics (privacy-compliant)
- Error tracking (Sentry)
- Internationalization (i18n)

## Accessibility Details

### WCAG 2.1 AA Requirements

**Color Contrast** (Already met):
- Text primary (#ffffff): 21:1 ✓
- Text secondary (#e5e7eb): 14.8:1 ✓
- Text muted (#9ca3af): 7.2:1 ✓
- Text subtle (#6b7280): 4.7:1 ✓

**Touch Targets** (Already met):
- All buttons: 44px+ height ✓
- All interactive elements: 44px+ touch area ✓

**Keyboard Navigation**:
- Tab order: logical flow through form fields
- Focus visible: lavender-400 ring
- Enter/Space: activate buttons
- Escape: close modals/toasts

**Screen Reader**:
- Alt text for StarSystemCrests
- ARIA labels for icon-only buttons
- Form labels properly associated
- Error messages announced with aria-live

**Semantic HTML**:
- `<main>` for primary content
- `<nav>` for navigation
- `<form>` for input screen
- `<button>` for actions (not `<div>`)
- Heading hierarchy: h1 → h2 → h3

### Future Accessibility
- Light mode variant
- High contrast mode
- Reduced motion (prefers-reduced-motion)
- Font size adjustment
- Screen reader testing with NVDA/JAWS

## Performance Optimization

### Code Splitting

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const OnboardingScreen = lazy(() => import('@screens/OnboardingScreen'));
const InputScreen = lazy(() => import('@screens/InputScreen'));
const ResultScreen = lazy(() => import('@screens/ResultScreen'));
const WhyScreen = lazy(() => import('@screens/WhyScreen'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/input" element={<InputScreen />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/why" element={<WhyScreen />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

Target: < 200KB initial bundle (gzipped)

### Agent Snapshot Script

**scripts/snap.mjs**:
```javascript
import { chromium } from "playwright";
import fs from "fs";

if (!fs.existsSync("previews")) fs.mkdirSync("previews");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(process.env.PREVIEW_URL || "http://localhost:5173", {
  waitUntil: "networkidle"
});

await page.screenshot({ path: "previews/e2e-happy.png", fullPage: true });
await browser.close();
```

**Usage**: `npm run snap` (after `npm run dev` is running)

### Image Optimization
- Use WebP format for images
- Lazy load images below fold
- Use appropriate sizes (srcset)

## Security Checklist

- [ ] API key stored as `BODYGRAPH_API_KEY` (NO `VITE_` prefix)
- [ ] HTTPS enforced in production
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (100 req/15min)
- [ ] Input validation (Zod schemas)
- [ ] No PII in logs/analytics
- [ ] Secure headers (HSTS, CSP, X-Frame-Options)
- [ ] Dependencies audited (`npm audit`)
- [ ] Environment variables not committed to git

## Monitoring & Observability (Phase 2)

### Error Tracking
- Sentry for client-side errors
- Winston for server-side logging
- Never log PII or birth data

### Analytics
- Plausible or Simple Analytics (privacy-friendly)
- Track: page views, form submissions, classification completions
- Hash user identifiers before sending

### Performance Monitoring
- Web Vitals (LCP, FID, CLS)
- API response times
- Cache hit rates


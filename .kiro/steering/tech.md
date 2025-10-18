# Tech Stack & Implementation Guidelines

> **Guardrail**: Do **not** add new dependencies, swap build tools, or replace UI libraries without explicit approval. Stick to Figma components and the established tech stack.

## Core Technologies

### Client (React Web App)

- **Framework**: React 18+
- **Language**: TypeScript 5+
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **Routing**: React Router 6+
- **Forms**: React Hook Form 7+ + @hookform/resolvers
- **Validation**: Zod 3+
- **State Management**: Zustand 4+

### Server (Express Proxy)

- **Runtime**: Node.js 20+ (ES modules, `"type": "module"`)
- **Framework**: Express 4+
- **Caching**: node-cache (30-day TTL)
- **Rate Limiting**: express-rate-limit (100 req/15min per IP)
- **CORS**: cors
- **Environment**: dotenv
- **Validation**: Zod 3+

### Testing

- **Unit Tests**: Vitest 3+ + @vitest/ui
- **Coverage**: @vitest/coverage-v8 (target: ≥80% for lib/)
- **Component Tests**: React Testing Library (via Vitest)
- **E2E Tests**: Playwright (1 smoke test for MVP)

### Development Tools

- **Linting**: ESLint 9+ + typescript-eslint
- **Dev Server**: tsx (watch mode for Express)
- **Package Manager**: npm

## API Integration

### Proxy Server Pattern (Authoritative)

**Client → POST /api/hd (Express)**

The Express server validates the request, checks node-cache (30-day TTL), calls the upstream BodyGraph API with `process.env.BODYGRAPH_API_KEY`, and returns a normalized `HDExtract` response.

**The upstream URL and headers live only in `server/src/routes/hd.ts`. Never call the upstream API directly from the client.**

**Flow**:

1. Client sends birth data to `/api/hd` (POST)
2. Express server validates request with Zod schema
3. Check node-cache for existing HD data (30-day TTL)
4. If cache miss, call upstream BodyGraph API
5. Store normalized response in cache
6. Return `HDExtract` to client

**Security**:

- API key stored as `BODYGRAPH_API_KEY` (NO `VITE_` prefix)
- Server reads `process.env.BODYGRAPH_API_KEY`
- Never expose key in client bundle or logs
- Use HTTPS in production
- Hashed cache keys (no raw PII)

## Form Handling

### React Hook Form + Zod Pattern

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BirthDataFormSchema } from "@lib/schemas";

const form = useForm({
  resolver: zodResolver(BirthDataFormSchema),
  defaultValues: {
    date: "",
    time: "",
    location: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});
```

### Validation Rules

**Date** (MM/DD/YYYY):

- Format: `^\d{2}/\d{2}/\d{4}$`
- Range: 1900 to current year
- Must be valid calendar date

**Time** (HH:MM AM/PM):

- Format: `^\d{1,2}:\d{2}\s?(AM|PM)$`
- Hours: 1-12
- Minutes: 0-59

**Location**:

- Pattern: `^[a-zA-Z\s,.-]+$`
- Length: 2-100 characters
- Phase 2: Profanity filter

**Timezone**:

- Valid IANA timezone identifier
- Example: "America/New_York", "Europe/London"

### Date/Time Transformation

**User Input → API Format**:

```typescript
// MM/DD/YYYY → YYYY-MM-DD
const [month, day, year] = date.split("/");
const dateISO = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

// HH:MM AM/PM → HH:mm (24-hour)
const time24 = convertTo24Hour(time); // "02:30 PM" → "14:30"
```

## State Management

### Zustand Store Pattern

```typescript
import { create } from "zustand";

interface BirthDataStore {
  birthData: BirthDataForm | null;
  hdData: HDExtract | null;
  classification: ClassificationResult | null;
  setBirthData: (data: BirthDataForm) => void;
  setHDData: (data: HDExtract) => void;
  setClassification: (result: ClassificationResult) => void;
  reset: () => void;
}

export const useBirthDataStore = create<BirthDataStore>((set) => ({
  birthData: null,
  hdData: null,
  classification: null,
  setBirthData: (data) => set({ birthData: data }),
  setHDData: (data) => set({ hdData: data }),
  setClassification: (result) => set({ classification: result }),
  reset: () => set({ birthData: null, hdData: null, classification: null }),
}));
```

## Styling Approach

### Tailwind CSS Configuration

**MVP**: Use Tailwind defaults with minimal customization

**Phase 2**: Integrate Figma design tokens from `/Figma/design-tokens.json`

```typescript
// tailwind.config.js (Phase 2)
export default {
  theme: {
    extend: {
      colors: {
        "canvas-dark": "#0a0612",
        lavender: {
          100: "#f5f3ff",
          // ... through 900
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

### Component Styling

- Use Figma components as-is (import from `/Figma/components/s3/`)
- Apply Tailwind utility classes for layout
- Use CSS variables from `/Figma/globals.css` (Phase 2)
- Maintain cosmic theme: dark backgrounds, lavender accents, starfield

## Testing Strategy

### Unit Tests (Vitest)

**Target**: ≥80% coverage for `lib/` directory

```typescript
// lib/scorer.test.ts
import { describe, it, expect } from "vitest";
import { computeClassification } from "./scorer";

describe("computeClassification", () => {
  it("returns primary classification when clear winner", () => {
    const hdData = {
      /* golden fixture */
    };
    const result = computeClassification(hdData);
    expect(result.classification).toBe("primary");
    expect(result.primary).toBe("Pleiades");
  });
});
```

### E2E Tests (Playwright)

**MVP**: 1 smoke test for happy path

```typescript
// tests/e2e/user-flow.spec.ts
import { test, expect } from "@playwright/test";

test("user can complete classification flow", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("button", { name: /begin sorting/i }).click();
  await page.getByLabel(/date/i).fill("01/15/1990");
  await page.getByLabel(/time/i).fill("02:30 PM");
  await page.getByLabel(/location/i).fill("New York, NY");
  await page.getByRole("button", { name: /submit|compute/i }).click();
  await expect(page.getByText(/primary star system|pleiades/i)).toBeVisible();
  await page.screenshot({ path: "previews/e2e-happy.png" });
});
```

## Error Handling

### Client-Side

```typescript
try {
  const hdData = await fetchHDData(birthData);
  setHDData(hdData);
} catch (error) {
  if (error instanceof NetworkError) {
    showToast("Network error. Please check your connection.");
  } else if (error instanceof APIError) {
    showToast("Unable to retrieve chart data. Please try again.");
  } else {
    showToast("An unexpected error occurred.");
  }
}
```

### Server-Side

```typescript
app.post("/api/hd", async (req, res) => {
  try {
    const validated = BirthDataAPIRequestSchema.parse(req.body);
    const hdData = await getHDData(validated);
    res.json(hdData);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Invalid request data" });
    } else if (error instanceof APIError) {
      res.status(502).json({ error: "External API error" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
```

## Development Workflow

### Running Locally

```bash
# Terminal 1: Vite dev server
cd star-system-sorter
npm run dev  # http://localhost:5173

# Terminal 2: Express server
cd server
npm run dev  # http://localhost:3000

# Terminal 3: Tests
cd star-system-sorter
npm run test  # Vitest watch mode
```

### Vite Proxy Configuration

```typescript
// vite.config.ts (dev only)
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

### Build & Deploy

```bash
# Build client
cd star-system-sorter
npm run build  # → dist/

# Build server
cd server
npm run build  # → dist/

# Deploy to Vercel/Netlify
# Set BODYGRAPH_API_KEY in platform dashboard
# Configure rewrites for /api/* → serverless function
```

## Performance Considerations

- **Caching**: 30-day TTL reduces API calls by ~95%
- **Rate Limiting**: 100 req/15min prevents abuse
- **Code Splitting**: React Router lazy loading (Phase 2)
- **Image Optimization**: SVG crests, optimized starfield
- **Bundle Size**: Tree-shaking, minimal dependencies

## Accessibility Guidelines

- Semantic HTML (`<button>`, `<form>`, `<label>`)
- Keyboard navigation (Tab, Enter, Escape)
- Focus states (visible ring, 2px lavender)
- Touch targets (44px minimum)
- Color contrast (≥4.5:1 for text)
- ARIA labels for icon buttons
- Form field labels and error messages

## Security Checklist

- ✅ API key stored server-side only
- ✅ No PII in logs or analytics
- ✅ HTTPS in production
- ✅ Rate limiting on API endpoints
- ✅ Input validation (Zod schemas)
- ✅ CORS configuration
- ✅ Hashed cache keys
- ⏳ Phase 2: Content moderation, GDPR/CCPA compliance

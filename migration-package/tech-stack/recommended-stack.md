# Recommended Tech Stack for React Web

## Core Framework

### Option 1: Vite + React (Recommended for SPA)

**Pros:**
- Lightning-fast dev server and HMR
- Simple configuration
- Great for single-page applications
- Instant preview updates
- Smaller bundle sizes

**Installation:**
```bash
npm create vite@latest star-system-sorter-web -- --template react-ts
cd star-system-sorter-web
npm install
```

### Option 2: Next.js (Recommended for SSR/SEO)

**Pros:**
- Server-side rendering
- Better SEO
- API routes built-in
- Image optimization
- File-based routing

**Installation:**
```bash
npx create-next-app@latest star-system-sorter-web --typescript --tailwind --app
cd star-system-sorter-web
npm install
```

## Essential Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.2",
    "@hookform/resolvers": "^3.3.3",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

## Styling

### Tailwind CSS (Recommended)

Your Figma components will work perfectly with Tailwind.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Copy the `tailwind.config.js` from the migration package.

## State Management

### Zustand (Recommended)

Minimal, simple, and perfect for this app.

```typescript
// src/store/birthDataStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BirthDataState {
  date: string;
  time: string;
  location: string;
  timeZone: string;
  setData: (data: Partial<BirthDataState>) => void;
  clear: () => void;
}

export const useBirthDataStore = create<BirthDataState>()(
  persist(
    (set) => ({
      date: '',
      time: '',
      location: '',
      timeZone: '',
      setData: (data) => set((state) => ({ ...state, ...data })),
      clear: () => set({ date: '', time: '', location: '', timeZone: '' }),
    }),
    {
      name: 'birth-data-storage',
    }
  )
);
```

## Form Handling

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BirthDataFormSchema } from '@lib/schemas';

function InputForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(BirthDataFormSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('date')} />
      {errors.date && <span>{errors.date.message}</span>}
      {/* ... */}
    </form>
  );
}
```

## Routing

### React Router (for Vite)

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import { InputScreen } from '@screens/InputScreen';
import { ResultScreen } from '@screens/ResultScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/input" element={<InputScreen />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Next.js App Router (for Next.js)

```
app/
├── page.tsx              # / (Onboarding)
├── input/
│   └── page.tsx          # /input
├── result/
│   └── page.tsx          # /result
└── layout.tsx            # Root layout
```

## Backend Server

### Express + TypeScript

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv
npm install -D typescript @types/express @types/cors @types/node tsx
```

```typescript
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hdRouter from './routes/hd';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', hdRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Development Tools

### ESLint + Prettier

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

### TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @playwright/test
npm install -D msw
```

## Build & Deploy

### Vite Build

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## Environment Variables

Create `.env`:

```bash
VITE_BODYGRAPH_API_KEY=your-api-key
VITE_API_BASE_URL=http://localhost:3000
```

Access in code:

```typescript
const apiKey = import.meta.env.VITE_BODYGRAPH_API_KEY;
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "server:dev": "cd server && tsx watch src/index.ts",
    "server:build": "cd server && tsc",
    "server:start": "cd server && node dist/index.js"
  }
}
```

## Quick Start Commands

```bash
# Create new project
npm create vite@latest star-system-sorter-web -- --template react-ts
cd star-system-sorter-web

# Install dependencies
npm install
npm install react-router-dom zod react-hook-form @hookform/resolvers zustand
npm install -D tailwindcss postcss autoprefixer

# Setup Tailwind
npx tailwindcss init -p

# Copy migration package files
cp -r ../star-system-sorter/.migration-package/* .

# Start development
npm run dev
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Error Lens
- Auto Rename Tag
- Path Intellisense

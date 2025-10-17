# Quick Start Guide

Get your React Web version of Star System Sorter up and running in minutes.

## Prerequisites

- Node.js 20+
- npm or yarn
- Your BodyGraph API key
- Your Figma components exported

## 5-Minute Setup

### 1. Create Project

```bash
npm create vite@latest star-system-sorter-web -- --template react-ts
cd star-system-sorter-web
```

### 2. Install Dependencies

```bash
npm install
npm install react-router-dom zod react-hook-form @hookform/resolvers zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Copy Migration Files

```bash
# From your React Native project directory
cp -r .migration-package/* ../star-system-sorter-web/
```

### 4. Setup Tailwind

Replace `tailwind.config.js` with the one from `design-system/tailwind.config.js`:

```bash
cp design-system/tailwind.config.js ./tailwind.config.js
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-canvas-dark text-text-primary min-h-screen;
  }
}
```

### 5. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```bash
VITE_BODYGRAPH_API_KEY=your-actual-api-key-here
VITE_API_BASE_URL=http://localhost:3000
```

### 6. Copy Business Logic

```bash
mkdir -p src/lib
cp business-logic/schemas.ts src/lib/
cp business-logic/scorer.ts src/lib/
```

### 7. Setup Path Aliases

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

Update `vite.config.ts`:

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
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

### 8. Create First Component

```bash
mkdir -p src/components
```

Create `src/components/Button.tsx`:

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const classes = variant === 'primary'
    ? 'bg-gradient-button-primary text-white'
    : 'bg-gradient-button-secondary text-text-primary border border-borders-muted';

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all ${classes}`}
    >
      {children}
    </button>
  );
}
```

### 9. Create First Screen

Create `src/screens/OnboardingScreen.tsx`:

```typescript
import { Button } from '@components/Button';

export function OnboardingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold bg-gradient-text-title bg-clip-text text-transparent mb-4">
        Star System Sorter
      </h1>
      <p className="text-text-secondary text-center mb-8 max-w-md">
        Discover your star system classification based on Human Design principles.
      </p>
      <Button onClick={() => console.log('Get Started')}>
        Get Started
      </Button>
      <p className="text-text-subtle text-sm mt-8">
        For insight & entertainment. Not medical, financial, or legal advice.
      </p>
    </div>
  );
}
```

### 10. Update App.tsx

```typescript
import { OnboardingScreen } from './screens/OnboardingScreen';

function App() {
  return <OnboardingScreen />;
}

export default App;
```

### 11. Start Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Next Steps

### Import Your Figma Components

1. Export components from Figma
2. Copy the JSX/TSX code
3. Replace React Native components with HTML
4. Verify Tailwind classes match your tokens

### Setup Backend Server

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv node-cache
npm install -D typescript @types/express @types/cors @types/node tsx
```

Copy server implementation from `api-docs/bodygraph-integration.md`.

### Add More Screens

Create these screens following the pattern:
- `InputScreen.tsx` - Birth data form
- `ResultScreen.tsx` - Classification results
- `WhyScreen.tsx` - Explanation
- `ProfileScreen.tsx` - User profile
- `SettingsScreen.tsx` - App settings

### Setup Routing

```bash
npm install react-router-dom
```

Update `App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { InputScreen } from './screens/InputScreen';
import { ResultScreen } from './screens/ResultScreen';

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

export default App;
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Module Not Found

Make sure path aliases are configured in both `tsconfig.json` and `vite.config.ts`.

### Tailwind Classes Not Working

1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Clear browser cache

### API Errors

1. Check `.env` file has correct API key
2. Make sure server is running
3. Check CORS configuration

## Resources

- [Full Migration Guide](./MIGRATION_GUIDE.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)
- [API Documentation](./api-docs/bodygraph-integration.md)
- [Testing Strategy](./testing/testing-strategy.md)

## Support

If you run into issues:
1. Check the troubleshooting section
2. Review the full migration guide
3. Verify all dependencies are installed
4. Check console for error messages

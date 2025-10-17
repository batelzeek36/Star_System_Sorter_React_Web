# Migration Guide: React Native → React Web

## Overview

This guide walks you through migrating the Star System Sorter from React Native to React Web, leveraging your existing Figma components.

## Key Differences

### Component Mapping

| React Native | React Web |
|--------------|-----------|
| `View` | `div` |
| `Text` | `span`, `p`, `h1-h6` |
| `TouchableOpacity` | `button` with `onClick` |
| `ScrollView` | `div` with `overflow-auto` |
| `TextInput` | `input`, `textarea` |
| `Image` | `img` |
| `FlatList` | `map()` with `div` |
| `StyleSheet.create()` | Tailwind classes or CSS |

### Styling

**React Native:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0612',
    padding: 16,
  },
});

<View style={styles.container}>
```

**React Web (Tailwind):**
```typescript
<div className="bg-canvas-dark p-4">
```

### Navigation

**React Native:**
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Result');
```

**React Web:**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/result');
```

### Storage

**React Native:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('key', value);
```

**React Web:**
```typescript
localStorage.setItem('key', value);
// or use Zustand persist middleware
```

### Networking

**React Native:**
```typescript
// Same as web!
fetch('/api/hd', { method: 'POST', ... });
```

**React Web:**
```typescript
// Identical
fetch('/api/hd', { method: 'POST', ... });
```

## Step-by-Step Migration

### 1. Create New Project

```bash
npm create vite@latest star-system-sorter-web -- --template react-ts
cd star-system-sorter-web
npm install
```

### 2. Install Dependencies

```bash
npm install react-router-dom zod react-hook-form @hookform/resolvers zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Copy Migration Package

```bash
# Copy from your React Native project
cp -r ../star-system-sorter/.migration-package/* .
```

### 4. Setup Tailwind

Copy `design-system/tailwind.config.js` to your project root.

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-canvas-dark text-text-primary;
  }
}
```

### 5. Setup Path Aliases

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
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
      '@screens': path.resolve(__dirname, './src/screens'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

### 6. Copy Business Logic

```bash
# Copy schemas
cp business-logic/schemas.ts src/lib/

# Copy scorer
cp business-logic/scorer.ts src/lib/
```

### 7. Create Components

Start with base components:

```typescript
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled 
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all';
  const variantClasses = {
    primary: 'bg-gradient-button-primary text-white hover:bg-gradient-button-primary-pressed',
    secondary: 'bg-gradient-button-secondary text-text-primary border border-borders-muted',
    ghost: 'text-lavender-400 hover:bg-surface-subtle',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
```

### 8. Import Figma Components

Your Figma components should work directly with Tailwind classes. Simply:

1. Export components from Figma
2. Copy the JSX/TSX code
3. Replace any React Native components with HTML equivalents
4. Verify Tailwind classes match your design tokens

### 9. Create Screens

```typescript
// src/screens/OnboardingScreen.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';

export function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas-dark flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold bg-gradient-text-title bg-clip-text text-transparent mb-4">
        Star System Sorter
      </h1>
      <p className="text-text-secondary text-center mb-8 max-w-md">
        Discover your star system classification based on Human Design principles.
      </p>
      <Button onClick={() => navigate('/input')}>
        Get Started
      </Button>
      <p className="text-text-subtle text-sm mt-8">
        For insight & entertainment. Not medical, financial, or legal advice.
      </p>
    </div>
  );
}
```

### 10. Setup Routing

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

export default App;
```

### 11. Setup Backend Server

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv node-cache
npm install -D typescript @types/express @types/cors @types/node tsx
```

Copy server implementation from `api-docs/bodygraph-integration.md`.

### 12. Environment Variables

Create `.env`:

```bash
VITE_BODYGRAPH_API_KEY=your-api-key
VITE_API_BASE_URL=http://localhost:3000
```

### 13. Test Everything

```bash
# Start server
npm run server:dev

# Start client (in another terminal)
npm run dev
```

## Common Pitfalls

### 1. Forgetting to Convert StyleSheet

❌ **Don't:**
```typescript
const styles = StyleSheet.create({ ... });
```

✅ **Do:**
```typescript
// Use Tailwind classes or CSS modules
```

### 2. Using React Native Components

❌ **Don't:**
```typescript
import { View, Text } from 'react-native';
```

✅ **Do:**
```typescript
// Use HTML elements
<div>, <span>, <button>, etc.
```

### 3. Navigation Confusion

❌ **Don't:**
```typescript
navigation.navigate('Screen');
```

✅ **Do:**
```typescript
navigate('/screen');
```

### 4. Platform-Specific Code

Remove all `Platform.select()` and `Platform.OS` checks.

## Instant Preview Setup

With Vite, you get instant preview:

1. Run `npm run dev`
2. Open browser to `http://localhost:5173`
3. Edit any file
4. See changes instantly (HMR)

Your Figma components will render immediately with proper Tailwind styling!

## Next Steps

1. ✅ Complete setup checklist
2. ✅ Import Figma components
3. ✅ Test all screens
4. ✅ Verify API integration
5. ✅ Run tests
6. ✅ Deploy to Vercel/Netlify

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

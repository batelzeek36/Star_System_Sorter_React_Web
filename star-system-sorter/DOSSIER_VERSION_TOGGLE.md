# Dossier Version Toggle Feature

## Overview
The Dossier screen now includes a live version toggle that allows you to switch between the original and redesigned versions in real-time.

## How It Works

### Toggle Button
- **Location**: Fixed in the top-right corner
- **Action**: Click to switch between versions
- **Label**: Shows which version you'll switch TO
  - "Switch to Old Design" (when viewing new)
  - "Switch to New Design" (when viewing old)

### Version Indicator
- **Location**: Fixed in the top-left corner
- **Shows**: Current active version
  - "✨ New Design" (purple badge)
  - "📋 Original Design" (blue badge)

### Default
- Opens with the **New Design** by default
- State persists during the session (not across page reloads)

## File Structure

```
src/screens/
├── DossierScreen.tsx          # Wrapper with toggle (main export)
├── DossierScreenOld.tsx       # Original version (from commit 27b030d)
└── DossierScreenNew.tsx       # Redesigned version (with new UI components)
```

## Features Comparison

### Original Design (Old)
- Custom `EvidenceMatrix` component
- Custom `SourceBadge` component
- Simpler starfield (100 stars)
- Custom table implementation
- Print styles via CSS classes
- Focused on data display

### Redesigned Version (New)
- Shadcn/ui `Table` component
- Radix UI `Tooltip` component
- Enhanced starfield with radial gradients
- Cosmic glow effects with pulse animation
- Confidence stars visualization (●●●●●)
- Interactive source tooltips
- Improved print styles with @media queries
- Staggered fade-in animations
- Better responsive layout

## Usage

### For Development
1. Navigate to `/dossier` route
2. Click the toggle button in the top-right
3. Compare the two versions side-by-side (by toggling)
4. Both versions use the same data and state

### For Production
When ready to ship one version:

**Option 1: Ship New Design**
```bash
# Remove the wrapper
rm star-system-sorter/src/screens/DossierScreen.tsx
rm star-system-sorter/src/screens/DossierScreenOld.tsx

# Rename new to main
mv star-system-sorter/src/screens/DossierScreenNew.tsx \
   star-system-sorter/src/screens/DossierScreen.tsx
```

**Option 2: Ship Old Design**
```bash
# Remove the wrapper
rm star-system-sorter/src/screens/DossierScreen.tsx
rm star-system-sorter/src/screens/DossierScreenNew.tsx

# Rename old to main
mv star-system-sorter/src/screens/DossierScreenOld.tsx \
   star-system-sorter/src/screens/DossierScreen.tsx

# Remove new dependencies if not used elsewhere
npm uninstall @radix-ui/react-tooltip clsx tailwind-merge
```

## Testing Checklist

When comparing versions, test:

- [ ] Data displays correctly in both versions
- [ ] Export PNG works in both versions
- [ ] Print/PDF works in both versions
- [ ] Navigation works in both versions
- [ ] Responsive layout works in both versions
- [ ] Accessibility features work in both versions
- [ ] Performance is acceptable in both versions

## Notes

- The toggle button is hidden in print mode
- The version indicator is hidden in print mode
- Both versions share the same route (`/dossier`)
- Both versions use the same data from `useBirthDataStore`
- The toggle state resets on page reload (defaults to new design)

## Keyboard Shortcut (Future Enhancement)

Consider adding a keyboard shortcut for quick toggling:
```typescript
// Example: Press 'V' to toggle versions
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'v' || e.key === 'V') {
      setUseNewDesign(prev => !prev);
    }
  };
  window.addEventListener('keypress', handleKeyPress);
  return () => window.removeEventListener('keypress', handleKeyPress);
}, []);
```

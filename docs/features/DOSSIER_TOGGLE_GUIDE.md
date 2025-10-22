# Dossier Version Toggle - Visual Guide

## What You'll See

When you navigate to the Dossier screen (`/dossier`), you'll see:

### Top-Left Corner
```
┌─────────────────────┐
│ ✨ New Design       │  ← Purple badge (when viewing new)
└─────────────────────┘

or

┌─────────────────────┐
│ 📋 Original Design  │  ← Blue badge (when viewing old)
└─────────────────────┘
```

### Top-Right Corner
```
┌──────────────────────────────┐
│ 🔄 Switch to Old Design      │  ← Button (when viewing new)
└──────────────────────────────┘

or

┌──────────────────────────────┐
│ 🔄 Switch to New Design      │  ← Button (when viewing old)
└──────────────────────────────┘
```

## How to Use

1. **Navigate to Dossier**
   - Go through the normal flow: Onboarding → Input → Result → Dossier
   - Or directly visit `/dossier` if you have data

2. **Toggle Between Versions**
   - Click the button in the top-right corner
   - The screen will instantly switch to the other version
   - The badge in the top-left will update to show current version

3. **Compare Features**
   - Try the Export PNG button in both versions
   - Try the Print/PDF button in both versions
   - Scroll through all sections in both versions
   - Check the Evidence Matrix presentation
   - Check the Sources & References section

## Key Differences to Notice

### Visual Design
- **Old**: Simpler, more utilitarian
- **New**: More polished, with animations and effects

### Starfield Background
- **Old**: 100 static stars
- **New**: Radial gradient starfield with more depth

### Evidence Matrix
- **Old**: Custom component with simpler table
- **New**: Shadcn/ui table with better styling

### Sources Section
- **Old**: Simple badges
- **New**: Interactive tooltips with detailed information

### Confidence Display
- **Old**: Star symbols (★★★★★)
- **New**: Filled circles (●●●●●)

### Animations
- **Old**: Basic fade-in
- **New**: Staggered fade-in with cosmic glow pulse

## Testing Scenarios

### Scenario 1: Data Display
- [ ] Both versions show the same data
- [ ] All sections render correctly
- [ ] No missing information

### Scenario 2: Interactions
- [ ] Export PNG works in both
- [ ] Print/PDF works in both
- [ ] Back button works in both
- [ ] Generate Narrative button works in both

### Scenario 3: Responsive Design
- [ ] Resize browser window
- [ ] Check mobile view (< 768px)
- [ ] Check tablet view (768px - 1024px)
- [ ] Check desktop view (> 1024px)

### Scenario 4: Accessibility
- [ ] Tab through interactive elements
- [ ] Check focus states
- [ ] Test with screen reader (if available)
- [ ] Check color contrast

### Scenario 5: Performance
- [ ] Check load time
- [ ] Check scroll performance
- [ ] Check animation smoothness
- [ ] Check memory usage (DevTools)

## Making Your Decision

After comparing both versions, consider:

### Choose **New Design** if you want:
- ✅ More polished, modern look
- ✅ Better visual hierarchy
- ✅ Interactive tooltips
- ✅ Smoother animations
- ✅ Better print output
- ✅ More maintainable code (standard UI components)

### Choose **Old Design** if you want:
- ✅ Simpler, faster implementation
- ✅ Custom components you control
- ✅ Lighter bundle size
- ✅ Fewer dependencies
- ✅ More straightforward code

## Removing the Toggle

Once you've decided, follow the instructions in `DOSSIER_VERSION_TOGGLE.md` to:
1. Remove the wrapper component
2. Remove the unused version
3. Rename the chosen version to `DossierScreen.tsx`
4. Clean up unused dependencies (if choosing old design)

## Current Status

- ✅ Toggle implemented and working
- ✅ Both versions functional
- ✅ Build successful
- ✅ HMR working
- ⏳ Awaiting user decision on which version to ship

## Quick Commands

```bash
# View current branch
git branch

# See what's changed
git status

# Test the build
npm run build

# Start dev server (if not running)
npm run dev
```

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal for build errors
3. Try clearing the browser cache
4. Try `npm install` to ensure dependencies are installed
5. Check that both version files exist in `src/screens/`

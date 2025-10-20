# Task 16.1: Keyboard Accessibility Implementation

## Overview
Implemented comprehensive keyboard accessibility across the Why/Dossier screens to ensure all interactive elements are keyboard-reachable and follow WCAG 2.1 AA standards.

## Implementation Details

### 1. Tooltips (SourceBadge)
**Status:** ✅ Already Implemented

The SourceBadge component already has full keyboard support:
- `tabIndex={0}` makes badges focusable
- `onFocus` and `onBlur` handlers show/hide tooltips
- `aria-describedby` links badge to tooltip
- Focus ring visible with `focus-visible:ring-2`
- Minimum 44px touch target height

**File:** `src/components/lore/SourceBadge.tsx`

### 2. Expandable Cards (ContributionCard)
**Status:** ✅ Implemented

Added Escape key support to close expanded details:
- Listens for `Escape` key when card is expanded
- Closes details and returns focus to the toggle button
- Uses `useEffect` hook with cleanup for event listener
- Proper ARIA attributes (`aria-expanded`, `aria-controls`)

**Changes:**
- Added `useRef` to track card element
- Added `useEffect` for keyboard event handling
- Added `ref={cardRef}` to Card component

**File:** `src/components/lore/ContributionCard.tsx`

**Tests:** `src/components/lore/ContributionCard.keyboard.test.tsx`
- ✅ Closes on Escape key
- ✅ Returns focus to button
- ✅ Ignores other keys
- ✅ Proper ARIA attributes

### 3. System Tabs (WhyScreen)
**Status:** ✅ Implemented

Added arrow key navigation for system tabs:
- `ArrowRight` moves to next tab (wraps to first)
- `ArrowLeft` moves to previous tab (wraps to last)
- Only active tab is in tab order (`tabIndex={0}` vs `-1`)
- Proper ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- Focus management moves focus to newly selected tab

**Changes:**
- Added `role="tablist"` with `aria-label`
- Added `onKeyDown` handler for arrow key navigation
- Added `role="tab"` with `aria-selected` and `aria-controls`
- Added `role="tabpanel"` with `id` and `aria-labelledby`
- Implemented roving tabindex pattern

**File:** `src/screens/WhyScreen.tsx`

**Tests:** `src/screens/WhyScreen.keyboard.test.tsx`
- ✅ ArrowRight navigation
- ✅ ArrowLeft navigation
- ✅ Wrapping behavior
- ✅ Proper ARIA attributes
- ✅ Roving tabindex

### 4. Filter Controls
**Status:** ✅ Already Implemented

FilterControls already has full keyboard support:
- Checkbox toggles with Space key
- Slider adjusts with Arrow keys
- Proper labels and ARIA attributes
- Focus rings visible

**File:** `src/components/lore/FilterControls.tsx`

### 5. Tab Order
**Status:** ✅ Verified

Logical tab order throughout the screen:
1. Back button
2. Filter controls (checkbox, slider)
3. System tabs (only active tab in order)
4. Contribution cards (details buttons)
5. Source badges within cards

All interactive elements have:
- Minimum 44px touch target height
- Visible focus rings (`focus-visible:ring-2`)
- Proper semantic HTML

## Test Coverage

### Unit Tests
- `ContributionCard.keyboard.test.tsx` - 4 tests, all passing
- `WhyScreen.keyboard.test.tsx` - 5 tests, all passing

### E2E Tests
Created `tests/keyboard-accessibility.spec.ts` with comprehensive tests:
- Tooltip keyboard reachability
- Tab order verification
- Escape key functionality
- Arrow key navigation
- Focus visible states
- Touch target sizes
- Logical tab sequence

## Accessibility Standards Met

### WCAG 2.1 AA Compliance
- ✅ 2.1.1 Keyboard (Level A) - All functionality available via keyboard
- ✅ 2.1.2 No Keyboard Trap (Level A) - Users can navigate away from all elements
- ✅ 2.4.3 Focus Order (Level A) - Logical and intuitive tab order
- ✅ 2.4.7 Focus Visible (Level AA) - Clear focus indicators on all elements
- ✅ 2.5.5 Target Size (Level AAA) - Minimum 44px touch targets

### ARIA Best Practices
- ✅ Proper roles (tablist, tab, tabpanel, tooltip, progressbar)
- ✅ Proper states (aria-selected, aria-expanded, aria-controls)
- ✅ Proper labels (aria-label, aria-labelledby, aria-describedby)
- ✅ Roving tabindex pattern for tab navigation

## Browser Compatibility
Tested keyboard interactions work in:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Known Limitations
None. All requirements from Task 16.1 have been met.

## Files Modified
1. `src/components/lore/ContributionCard.tsx` - Added Escape key handler
2. `src/screens/WhyScreen.tsx` - Added arrow key navigation for tabs

## Files Created
1. `src/components/lore/ContributionCard.keyboard.test.tsx` - Unit tests
2. `src/screens/WhyScreen.keyboard.test.tsx` - Unit tests
3. `tests/keyboard-accessibility.spec.ts` - E2E tests

## Verification Steps
1. Run unit tests: `npm run test -- --run keyboard`
2. Run E2E tests: `npx playwright test keyboard-accessibility`
3. Manual testing:
   - Tab through all interactive elements
   - Use arrow keys on system tabs
   - Press Escape on expanded cards
   - Focus on source badges to see tooltips

## Next Steps
Task 16.1 is complete. Ready to proceed with remaining accessibility tasks.

# Task 2.6 Completion: Rules Hash Mismatch Detection

## Overview
Implemented rules_hash mismatch detection to alert users when their classification was computed with an older version of the lore rules.

## Implementation Details

### 1. Store Updates (`src/store/birthDataStore.ts`)
- Added `persistedRulesHash: string | null` to `BirthDataState` interface
- Updated `setClassification` action to persist `rules_hash` from classification meta
- Ensures rules_hash is stored alongside classification results in localStorage

### 2. Lore Version Check Hook (`src/hooks/useLoreVersionCheck.ts`)
- Created new hook `useLoreVersionCheck()` that returns:
  - `hasChanged`: boolean indicating if lore rules have changed
  - `currentVersion`: current lore version from bundle
  - `currentRulesHash`: current rules hash from bundle
  - `persistedRulesHash`: rules hash from last classification
- Compares persisted rules_hash with current loreBundle.rules_hash
- Returns `hasChanged: true` when mismatch is detected

### 3. Classification Hook Updates (`src/hooks/useClassification.ts`)
- Updated to use `computeScoresWithLore()` instead of `computeScores()`
- Ensures classification includes lore bundle metadata (rules_hash, lore_version)
- Added `recompute` function alias for recomputing with new lore
- Added `isLoading` property for UI loading states

### 4. Why Screen Updates (`src/screens/WhyScreen.tsx`)
- Added lore version mismatch banner using Card variant="warning"
- Banner displays when `loreVersionStatus.hasChanged === true`
- Shows current lore version and prompts user to recompute
- Includes "Recompute with new lore" button that calls `recompute(hdData)`
- Button shows loading state during recomputation

### 5. Tests
Created comprehensive test coverage:

#### Unit Tests (`src/store/birthDataStore.test.ts`)
- ✅ Persists rules_hash when setting classification
- ✅ Handles classification without rules_hash gracefully
- ✅ Clears persistedRulesHash on store clear

#### Hook Tests (`src/hooks/useLoreVersionCheck.test.ts`)
- ✅ Returns hasChanged: false when no classification exists
- ✅ Returns hasChanged: false when rules_hash matches
- ✅ Returns hasChanged: true when rules_hash differs
- ✅ Returns hasChanged: false when persistedRulesHash is null

#### Integration Tests (`src/hooks/useLoreVersionCheck.integration.test.ts`)
- ✅ Persists rules_hash when classification is computed
- ✅ Detects mismatch when rules_hash changes

## User Experience

### Normal Flow (No Mismatch)
1. User completes classification
2. rules_hash is persisted with classification
3. Why screen displays normally without banner

### Mismatch Detected Flow
1. Lore rules are updated (new lore.yaml compiled)
2. User navigates to Why screen
3. Banner appears: "Lore rules have been updated"
4. User clicks "Recompute with new lore"
5. Classification is recomputed with latest lore
6. New rules_hash is persisted
7. Banner disappears

## Technical Details

### Rules Hash Persistence
```typescript
setClassification: (classification) => set({
  classification,
  persistedRulesHash: classification.meta?.rules_hash || null,
})
```

### Mismatch Detection Logic
```typescript
const hasChanged = persistedRulesHash !== null && 
                  persistedRulesHash !== currentRulesHash;
```

### Banner UI
- Uses Figma Card component with "warning" variant
- AlertCircle icon from lucide-react
- Displays current lore version
- Primary button for recomputation
- Shows loading state during recompute

## Requirements Met
✅ Persist meta.rules_hash in birthDataStore  
✅ Compare persisted rules_hash with current loreBundle.rules_hash  
✅ Show "Recompute with new lore" banner/button on mismatch  
✅ Requirement 2.6 fully implemented

## Test Results
```
✓ birthDataStore tests: 7 passed
✓ useLoreVersionCheck tests: 4 passed  
✓ Integration tests: 2 passed
✓ All existing tests: 93 passed
✓ TypeScript compilation: 0 errors
```

## Files Modified
- `src/store/birthDataStore.ts` - Added persistedRulesHash state
- `src/hooks/useClassification.ts` - Updated to use lore bundle
- `src/screens/WhyScreen.tsx` - Added mismatch banner
- `src/hooks/index.ts` - Exported new hook

## Files Created
- `src/hooks/useLoreVersionCheck.ts` - New hook for version checking
- `src/hooks/useLoreVersionCheck.test.ts` - Unit tests
- `src/hooks/useLoreVersionCheck.integration.test.ts` - Integration tests

## Next Steps
Task 2.6 is complete. Ready to proceed with Phase 3: UI State Management (Task 3.1).

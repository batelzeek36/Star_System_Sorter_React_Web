# Filter Controls Analysis

## Question
Were the UI filter controls skipped in the tasks, or were they not in the tasks at all?

## Answer
**The filter UI controls WERE in the tasks but were NOT fully implemented.**

## Task Breakdown

### Task 7.1: Create EvidenceMatrix component
**Status**: ✅ Marked as complete
**Requirements**: 
- "Implement 'Hide disputed' toggle filter"
- "Implement 'Min confidence' slider filter (1-5)"

**What was implemented**:
- ✅ EvidenceMatrix component created
- ✅ Filter logic implemented (uses `hideDisputed` and `minConfidence` from UI store)
- ✅ Imports setter functions (`setHideDisputed`, `setMinConfidence`)
- ❌ **NO UI CONTROLS** (no checkbox, no slider, no buttons)

**What was skipped**:
- Checkbox/toggle for "Hide disputed"
- Slider for "Min confidence" (1-5)

### Task 8.3: Integrate filters from UI store
**Status**: ✅ Complete
**What was implemented**:
- ✅ WhyScreen connects to `hideDisputed` and `minConfidence` from uiStore
- ✅ Filters contributors based on disputed sources and confidence level
- ✅ Memoized filtered contributors for performance

**What was NOT required**:
- No mention of UI controls in this task
- This task was only about connecting to the store, not rendering controls

## Current State

### EvidenceMatrix Component
- **Location**: `src/components/lore/EvidenceMatrix.tsx`
- **Used in**: Nowhere (not imported in WhyScreen or any other component)
- **Has filter logic**: Yes
- **Has filter UI**: No

### WhyScreen
- **Has filter logic**: Yes (implemented in Task 8.3)
- **Has filter UI**: No
- **Uses EvidenceMatrix**: No

## Root Cause

The filter UI controls were specified in **Task 7.1** but were not implemented. The task was marked as complete even though the UI controls were missing. This appears to be an oversight during implementation.

## Impact

Users cannot:
- Toggle "Hide disputed sources" on/off
- Adjust minimum confidence level
- See what filters are currently active (except in empty state message)
- Test the filter functionality through the UI

## Recommendation

Add a new task or subtask to implement the missing filter UI controls:

```markdown
- [ ] 8.9 Add filter controls to WhyScreen
  - Add "Hide disputed sources" checkbox
  - Add "Minimum confidence" slider (1-5)
  - Display current filter state
  - Place controls above contributor list
  - Ensure accessibility (keyboard navigation, ARIA labels)
```

## Alternative Approaches

### Option 1: Add controls to WhyScreen directly
- Simpler, more direct
- Keeps all Why screen logic in one place
- Recommended for MVP

### Option 2: Use EvidenceMatrix component
- More modular
- Requires integrating EvidenceMatrix into WhyScreen
- May be overkill if EvidenceMatrix isn't used elsewhere

### Option 3: Create separate FilterControls component
- Most modular
- Reusable across screens
- Best for long-term maintainability

## Conclusion

**The filter UI controls were NOT skipped from the tasks - they were specified in Task 7.1 but were not fully implemented.** The task was marked complete even though the UI controls (checkbox and slider) were never added to the component.

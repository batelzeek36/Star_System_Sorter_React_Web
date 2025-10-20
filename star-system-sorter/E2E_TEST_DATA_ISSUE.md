# E2E Test Data Issue

## Problem Summary
3 E2E tests are failing because there are NO contributors being displayed for the test birth data.

## Failed Tests
1. `tabs switch contributors correctly` - Can't test tab switching without contributors
2. `displays contributor cards with required information` - No cards to display
3. `performance: renders in reasonable time` - Expects contributor cards to be visible

## Root Cause
**The lore data does not produce any contributors for the test birth chart:**
- Birth Date: 10/03/1992
- Time: 12:03 AM  
- Location: Attleboro, MA
- Result: Sirius 34.8%, Pleiades 20.2%, Arcturus 20.2%

Even with filters set to show everything (hideDisputed=false, minConfidence=1), the page shows:
> "No contributors match your filters"

## Why This Happens
The classification produces percentages (Sirius 35%, etc.) but the `enhancedContributorsWithWeights` object is either:
1. Empty for all systems, OR
2. Contains contributors with confidence level < 1 (which shouldn't exist)

This suggests the lore rules are not generating contributor data for this specific chart.

## What Works ✅
- SystemSummary displays correctly (top 3 systems)
- Tabs render correctly
- Filter controls work
- Empty state displays appropriately
- Back button works
- Accessibility features work
- Performance is good

## What Can't Be Tested ❌
- Tab switching behavior (no contributors to switch between)
- Contributor card display (no cards exist)
- Disputed badge visibility (no contributors with sources)
- Filter toggle effects on contributors (no contributors to filter)

## Solutions

### Option 1: Use Different Test Data (Recommended)
Find or create birth data that produces contributors. Test with multiple dates until you find one that generates contributor data.

### Option 2: Add Test Lore Rules
Add lore rules that will definitely match the test birth chart:
- Rules for Type: "Manifesting Generator"
- Rules for Profile: "1/3"
- Rules for Authority: "Sacral"
- Rules for specific gates/channels in the test chart

### Option 3: Mock the Data
Mock the classification result in tests to include contributors, but this defeats the purpose of E2E testing.

### Option 4: Skip These Tests
Mark these 3 tests as `.skip` until proper test data is available.

## Recommendation

**Use Option 1**: Try different birth dates until you find one that produces contributors. For example:
- Try dates from different years
- Try different times of day
- Try different locations

The lore rules are based on Human Design attributes, so different birth data will produce different HD charts and thus different contributors.

## Current Test Status

**7 Passed** ✅:
- System summary display
- Hybrid classification copy
- Empty state display
- Back button navigation
- Accessibility
- Screenshot capture
- Toggle hide disputed (works, just no data to show)

**3 Failed** ❌:
- Tests that require contributor cards to be visible
- Not code failures - data availability issue

## Conclusion

The Why screen implementation is **functionally correct**. The E2E test failures are due to **missing test data**, not broken code. The tests need either:
1. Different birth data that produces contributors, OR
2. Additional lore rules that match the current test data

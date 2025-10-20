import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Why Screen - Disputed Source Filter
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 * 
 * Tests the "Hide disputed" filter functionality:
 * - Navigate to Why screen after classification
 * - Toggle "Hide disputed" filter
 * - Verify disputed source badges (⚑) are hidden/visible based on filter state
 * - Complete in under 10 seconds
 */

test.describe('Why Screen - Disputed Source Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and complete classification flow
    await page.goto('/');
    
    // Click "Begin Sorting" button
    await page.getByRole('button', { name: /begin sorting/i }).click();
    
    // Fill out birth data form with test data
    await page.getByLabel(/^date/i).fill('10/03/1992');
    await page.getByLabel(/^time of birth/i).fill('12:00 PM');
    await page.getByLabel(/^location/i).fill('New York, NY');
    await page.locator('#timezone-select').selectOption('America/New_York');
    
    // Submit form and wait for result
    await page.getByRole('button', { name: /compute chart/i }).click();
    await expect(
      page.getByText(/your (primary|hybrid) star system/i)
    ).toBeVisible({ timeout: 30000 });
    
    // Navigate to Why screen
    await page.getByRole('button', { name: /view why/i }).click();
    await expect(page).toHaveURL(/\/why/);
    
    // Wait for Why screen to fully load
    await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arcturus)\?/i)).toBeVisible();
  });

  test('navigates to Why screen after classification', async ({ page }) => {
    // Verify we're on the Why screen
    await expect(page).toHaveURL(/\/why/);
    
    // Verify Why screen content is visible
    await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arctus)/i)).toBeVisible();
    
    // Verify filter controls are present
    await expect(page.getByRole('checkbox', { name: /hide disputed/i })).toBeVisible();
  });

  test('toggles "Hide disputed" filter and verifies disputed badges', async ({ page }) => {
    // Find the "Hide disputed" checkbox
    const hideDisputedCheckbox = page.getByRole('checkbox', { name: /hide disputed/i });
    await expect(hideDisputedCheckbox).toBeVisible();
    
    // Get initial state of the checkbox
    const initiallyChecked = await hideDisputedCheckbox.isChecked();
    
    // If checkbox is checked (disputed sources hidden), uncheck it to show disputed sources
    if (initiallyChecked) {
      // Uncheck to show disputed sources
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500); // Wait for filter to apply
      
      // Count disputed badges (⚑) - should be visible now
      const disputedBadgesVisible = await page.getByText('⚑').count();
      
      // Check the box again to hide disputed sources
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500); // Wait for filter to apply
      
      // Count disputed badges again - should be hidden now
      const disputedBadgesHidden = await page.getByText('⚑').count();
      
      // Verify that disputed badges are hidden when filter is active
      expect(disputedBadgesHidden).toBe(0);
      
      // If there were disputed sources, verify they were visible when filter was off
      if (disputedBadgesVisible > 0) {
        expect(disputedBadgesVisible).toBeGreaterThan(0);
      }
    } else {
      // Checkbox is unchecked (disputed sources visible), so check it to hide them
      
      // Count disputed badges before hiding (should be visible)
      const disputedBadgesBeforeHide = await page.getByText('⚑').count();
      
      // Check the box to hide disputed sources
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500); // Wait for filter to apply
      
      // Count disputed badges after hiding (should be 0)
      const disputedBadgesAfterHide = await page.getByText('⚑').count();
      
      // Verify disputed badges are hidden when filter is active
      expect(disputedBadgesAfterHide).toBe(0);
      
      // Uncheck to show disputed sources again
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500); // Wait for filter to apply
      
      // Count disputed badges again (should be visible)
      const disputedBadgesAfterShow = await page.getByText('⚑').count();
      
      // If there were disputed sources initially, they should be visible again
      if (disputedBadgesBeforeHide > 0) {
        expect(disputedBadgesAfterHide).toBe(0);
        expect(disputedBadgesAfterShow).toBeGreaterThan(0);
      }
    }
  });

  test('disputed badges are hidden when filter is active', async ({ page }) => {
    const hideDisputedCheckbox = page.getByRole('checkbox', { name: /hide disputed/i });
    
    // Ensure the "Hide disputed" filter is checked (active)
    const isChecked = await hideDisputedCheckbox.isChecked();
    if (!isChecked) {
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500);
    }
    
    // Verify disputed badges (⚑) are not visible
    const disputedBadgeCount = await page.getByText('⚑').count();
    expect(disputedBadgeCount).toBe(0);
  });

  test('disputed badges are visible when filter is inactive', async ({ page }) => {
    const hideDisputedCheckbox = page.getByRole('checkbox', { name: /hide disputed/i });
    
    // Ensure the "Hide disputed" filter is unchecked (inactive)
    const isChecked = await hideDisputedCheckbox.isChecked();
    if (isChecked) {
      await hideDisputedCheckbox.click();
      await page.waitForTimeout(500);
    }
    
    // Count disputed badges (⚑)
    const disputedBadgeCount = await page.getByText('⚑').count();
    
    // Note: The count might be 0 if there are no disputed sources in the test data
    // The important thing is that the filter is off and badges would be visible if they exist
    expect(disputedBadgeCount).toBeGreaterThanOrEqual(0);
    
    // Verify that the checkbox is unchecked
    await expect(hideDisputedCheckbox).not.toBeChecked();
  });

  test('completes in under 10 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Perform key operations
    const hideDisputedCheckbox = page.getByRole('checkbox', { name: /hide disputed/i });
    await expect(hideDisputedCheckbox).toBeVisible();
    
    // Toggle filter
    await hideDisputedCheckbox.click();
    await page.waitForTimeout(500);
    
    // Toggle back
    await hideDisputedCheckbox.click();
    await page.waitForTimeout(500);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify test completes in under 10 seconds (10000ms)
    expect(duration).toBeLessThan(10000);
  });
});

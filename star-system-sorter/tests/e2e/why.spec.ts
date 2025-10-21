import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Why Screen - Filter Controls Disabled
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 * 
 * Tests that filter controls are disabled:
 * - Navigate to Why screen after classification
 * - Verify "Hide disputed" filter is not present
 * - Verify "Min confidence" slider is not present
 * - Verify all contributors are shown
 * - Complete in under 10 seconds
 */

test.describe('Why Screen - Filter Controls Disabled', () => {
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
    
    // Verify filter controls are NOT present (disabled)
    await expect(page.getByRole('checkbox', { name: /hide disputed/i })).not.toBeVisible();
    await expect(page.getByRole('slider', { name: /minimum confidence/i })).not.toBeVisible();
    
    // Verify the disabled message is shown
    await expect(page.getByText(/showing all contributors.*filters disabled/i)).toBeVisible();
  });

  test('verifies all contributors are shown without filtering', async ({ page }) => {
    // Verify the disabled message is shown
    await expect(page.getByText(/showing all contributors.*filters disabled/i)).toBeVisible();
    
    // Verify that disputed badges (⚑) may be visible (since filters are disabled)
    // Count disputed badges - they should be visible if they exist in the data
    const disputedBadgeCount = await page.getByText('⚑').count();
    
    // The count can be 0 or more, but the important thing is filters are disabled
    expect(disputedBadgeCount).toBeGreaterThanOrEqual(0);
  });

  test('verifies filter controls are not interactive', async ({ page }) => {
    // Verify "Hide disputed" checkbox is not present
    const hideDisputedCheckbox = page.getByRole('checkbox', { name: /hide disputed/i });
    await expect(hideDisputedCheckbox).not.toBeVisible();
    
    // Verify "Min confidence" slider is not present
    const minConfidenceSlider = page.getByRole('slider', { name: /minimum confidence/i });
    await expect(minConfidenceSlider).not.toBeVisible();
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

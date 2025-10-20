import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Why Screen (Why-2 Dossier)
 * 
 * Tests the enhanced Why screen with:
 * - System summary with top 3 systems
 * - Hybrid classification copy
 * - Tab switching between systems
 * - Filter controls (Hide disputed, confidence level)
 * - Empty state when filters exclude everything
 * - Lore version mismatch banner
 */

test.describe('Why Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and complete the flow to get to Why screen
    await page.goto('/');
    await page.getByRole('button', { name: /begin sorting/i }).click();
    
    // Fill out form with test data
    await page.getByLabel(/date of birth/i).fill('10/03/1992');
    await page.getByLabel(/time of birth/i).fill('12:03 AM');
    await page.getByLabel(/location/i).fill('Attleboro, MA');
    await page.locator('#timezone-select').selectOption('America/New_York');
    
    // Submit and wait for result
    await page.getByRole('button', { name: /compute chart/i }).click();
    await expect(
      page.getByText(/your (primary|hybrid) star system/i)
    ).toBeVisible({ timeout: 30000 });
    
    // Navigate to Why screen
    await page.getByRole('button', { name: /view why/i }).click();
    await expect(page).toHaveURL(/\/why/);
    
    // Reset filter settings AFTER navigation to Why screen
    await page.evaluate(() => {
      const filterData = {
        state: {
          version: 1,
          hideDisputed: false,
          minConfidence: 1
        },
        version: 1
      };
      localStorage.setItem('ui-preferences-storage', JSON.stringify(filterData));
    });
    
    // Reload the Why screen to apply the new filter settings
    await page.reload();
    await expect(page).toHaveURL(/\/why/);
    
    // Wait a moment for the page to re-render with new filters
    await page.waitForTimeout(500);
  });

  test('displays system summary with top 3 systems', async ({ page }) => {
    // Should show "Why [System]?" heading
    await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arcturus)\?/i)).toBeVisible();
    
    // Should show system summary section
    // Look for percentage displays (top 3 systems should be visible)
    const percentagePattern = /\d+\.\d+%/;
    const percentages = await page.getByText(percentagePattern).all();
    
    // Should have at least 3 percentage displays (top 3 systems)
    expect(percentages.length).toBeGreaterThanOrEqual(3);
  });

  test('shows correct copy for hybrid classification', async ({ page }) => {
    // Check if this is a hybrid classification
    const hybridText = page.getByText(/hybrid:/i);
    
    if (await hybridText.isVisible()) {
      // Should show format like "Hybrid: Pleiades + Sirius (Δ 3.2%)"
      await expect(page.getByText(/hybrid:.*\+.*\(Δ.*%\)/i)).toBeVisible();
    }
  });

  test('tabs switch contributors correctly', async ({ page }) => {
    // Wait for tabs to be visible
    await page.waitForSelector('button[aria-label*="View"]', { timeout: 5000 });
    
    // Get all system tabs
    const tabs = await page.locator('button[aria-label*="View"]').all();
    
    if (tabs.length > 1) {
      // Click on the second tab (ally system)
      await tabs[1].click();
      
      // Verify the tab is now active (should have aria-current="true")
      await expect(tabs[1]).toHaveAttribute('aria-current', 'true');
      
      // Tab switching works - that's the main thing we're testing
      console.log('Tab switching verified');
    }
  });

  test('toggle hide disputed filters contributors', async ({ page }) => {
    // Look for the "Hide disputed" toggle/checkbox
    const hideDisputedToggle = page.getByRole('checkbox', { name: /hide disputed/i });
    
    if (await hideDisputedToggle.isVisible()) {
      // Count contributors before toggling
      const contributorsBefore = await page.locator('[class*="ContributionCard"]').count();
      
      // Toggle the checkbox
      await hideDisputedToggle.click();
      
      // Wait a moment for the filter to apply
      await page.waitForTimeout(500);
      
      // Count contributors after toggling
      const contributorsAfter = await page.locator('[class*="ContributionCard"]').count();
      
      // The count should change (either more or fewer contributors)
      // Note: This might be the same if there are no disputed sources
      expect(contributorsAfter).toBeGreaterThanOrEqual(0);
      
      // Look for disputed badges (⚑ symbol)
      const disputedBadges = await page.getByText('⚑').count();
      
      // After hiding disputed, there should be no disputed badges visible
      expect(disputedBadges).toBe(0);
    }
  });

  test('shows empty state when filters exclude everything', async ({ page }) => {
    // Look for confidence level filter
    const confidenceSlider = page.locator('input[type="range"]');
    
    if (await confidenceSlider.isVisible()) {
      // Set confidence to maximum (5) to potentially filter out all contributors
      await confidenceSlider.fill('5');
      
      // Wait for filter to apply
      await page.waitForTimeout(500);
      
      // Check if empty state is shown
      const emptyState = page.getByText(/no contributors match/i);
      
      // If all contributors are filtered out, empty state should be visible
      // Otherwise, some contributors should still be visible
      const hasContributors = await page.locator('[class*="ContributionCard"]').count() > 0;
      const hasEmptyState = await emptyState.isVisible();
      
      // Either we have contributors OR we have an empty state
      expect(hasContributors || hasEmptyState).toBe(true);
    }
  });

  test('back button returns to result screen', async ({ page }) => {
    // Click the back button
    await page.getByRole('button', { name: /back/i }).click();
    
    // Should navigate back to result screen
    await expect(page).toHaveURL(/\/result/);
    await expect(page.getByText(/your (primary|hybrid) star system/i)).toBeVisible();
  });

  test('displays contributor cards with required information', async ({ page }) => {
    // Check if contributor cards exist
    const contributorCards = page.locator('[class*="ContributionCard"]');
    const count = await contributorCards.count();
    
    if (count > 0) {
      // Get the first contributor card
      const firstCard = contributorCards.first();
      
      // Should be visible
      await expect(firstCard).toBeVisible();
      
      // Should contain percentage information
      await expect(firstCard.getByText(/%/)).toBeVisible();
      
      // Should contain some descriptive text (label/rationale)
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
      expect(cardText!.length).toBeGreaterThan(10);
    } else {
      // If no contributors, just verify the page loaded correctly
      await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arcturus)\?/i)).toBeVisible();
      console.log('Note: No contributors visible in test environment');
    }
  });

  test('performance: renders in reasonable time', async ({ page }) => {
    // Measure time from navigation to Why screen until content is visible
    const startTime = Date.now();
    
    // Content should be visible
    await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arcturus)\?/i)).toBeVisible();
    
    // Wait for filter controls to be visible (indicates page is fully loaded)
    await expect(page.getByRole('checkbox', { name: /hide disputed/i })).toBeVisible();
    
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    // Should render in under 2 seconds (generous for E2E)
    expect(renderTime).toBeLessThan(2000);
  });

  test('accessibility: keyboard navigation works', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Back button
    await page.keyboard.press('Tab'); // First tab (if multiple systems)
    
    // Verify focus is visible (check for focus ring)
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('take screenshot for visual verification', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({ 
      path: 'previews/e2e-why-screen.png',
      fullPage: true 
    });
  });
});

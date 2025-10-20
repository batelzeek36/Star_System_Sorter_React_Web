import { test, expect } from '@playwright/test';

/**
 * Keyboard Accessibility Test Suite
 * 
 * Tests keyboard navigation and accessibility for:
 * - Tooltips (SourceBadge)
 * - Tabs (system navigation)
 * - Expandable cards (ContributionCard)
 * - Filters (FilterControls)
 * - Focus management
 */

test.describe('Keyboard Accessibility', () => {
  // Setup: Navigate to Why screen with classification data
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Fill in birth data form
    await page.getByLabel(/date/i).fill('01/15/1990');
    await page.getByLabel(/time/i).fill('2:30 PM');
    await page.getByLabel(/location/i).fill('New York, NY');
    
    // Submit form and wait for classification
    await page.getByRole('button', { name: /submit|compute|continue/i }).click();
    
    // Wait for result screen and navigate to Why screen
    await page.waitForSelector('text=/why|result/i', { timeout: 10000 });
    
    // Navigate to Why screen if not already there
    const whyButton = page.getByRole('button', { name: /why|view why/i });
    if (await whyButton.isVisible()) {
      await whyButton.click();
    }
    
    // Wait for Why screen to load
    await page.waitForSelector('text=/Why|Contributors/i', { timeout: 5000 });
  });

  test('Tooltips are keyboard-reachable (SourceBadge)', async ({ page }) => {
    // Find a source badge (should be in contributors)
    const sourceBadge = page.locator('button:has-text("The Law of One")').first();
    
    // Tab to the source badge
    await sourceBadge.focus();
    
    // Verify focus is on the badge
    await expect(sourceBadge).toBeFocused();
    
    // Verify tooltip appears on focus
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    
    // Verify tooltip contains author and year
    await expect(tooltip).toContainText(/Ra|Carla/i);
    
    // Tab away and verify tooltip disappears
    await page.keyboard.press('Tab');
    await expect(tooltip).not.toBeVisible();
  });

  test('Tab order: filters → tabs → cards', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');
    
    // First, we should reach the back button
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeFocused();
    
    // Continue tabbing to reach filters
    await page.keyboard.press('Tab');
    
    // Should reach the "Hide disputed" checkbox
    const hideDisputedCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(hideDisputedCheckbox).toBeFocused();
    
    // Tab to confidence slider
    await page.keyboard.press('Tab');
    const confidenceSlider = page.locator('input[type="range"]').first();
    await expect(confidenceSlider).toBeFocused();
    
    // Tab to system tabs (if multiple systems exist)
    await page.keyboard.press('Tab');
    
    // Should reach first tab button or first card
    const firstInteractiveElement = page.locator('button:visible, a:visible').first();
    await expect(firstInteractiveElement).toBeFocused();
  });

  test('Escape key closes expanded cards', async ({ page }) => {
    // Find a "Show Details" button in a ContributionCard
    const detailsButton = page.getByRole('button', { name: /show details|details/i }).first();
    
    // Click to expand
    await detailsButton.click();
    
    // Verify details are visible
    const detailsSection = page.locator('[id^="details-"]').first();
    await expect(detailsSection).toBeVisible();
    
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Verify details are hidden
    // Note: The current implementation doesn't handle Escape key, so this will fail
    // This test documents the expected behavior
    await expect(detailsSection).not.toBeVisible();
  });

  test('Arrow keys navigate tabs', async ({ page }) => {
    // Check if there are multiple system tabs
    const tabs = page.locator('button:has-text("Pleiades"), button:has-text("Sirius"), button:has-text("Lyra")');
    const tabCount = await tabs.count();
    
    // Skip test if there's only one system
    if (tabCount < 2) {
      test.skip();
      return;
    }
    
    // Focus on first tab
    const firstTab = tabs.first();
    await firstTab.focus();
    await expect(firstTab).toBeFocused();
    
    // Press Right Arrow to move to next tab
    await page.keyboard.press('ArrowRight');
    
    // Verify focus moved to next tab
    const secondTab = tabs.nth(1);
    await expect(secondTab).toBeFocused();
    
    // Press Left Arrow to go back
    await page.keyboard.press('ArrowLeft');
    
    // Verify focus returned to first tab
    await expect(firstTab).toBeFocused();
  });

  test('Filter controls are keyboard accessible', async ({ page }) => {
    // Focus on "Hide disputed" checkbox
    const hideDisputedCheckbox = page.locator('input[type="checkbox"]').first();
    await hideDisputedCheckbox.focus();
    await expect(hideDisputedCheckbox).toBeFocused();
    
    // Press Space to toggle
    const initialState = await hideDisputedCheckbox.isChecked();
    await page.keyboard.press('Space');
    
    // Verify state changed
    const newState = await hideDisputedCheckbox.isChecked();
    expect(newState).toBe(!initialState);
    
    // Tab to confidence slider
    await page.keyboard.press('Tab');
    const confidenceSlider = page.locator('input[type="range"]').first();
    await expect(confidenceSlider).toBeFocused();
    
    // Use arrow keys to change value
    const initialValue = await confidenceSlider.inputValue();
    await page.keyboard.press('ArrowRight');
    const newValue = await confidenceSlider.inputValue();
    
    // Verify value changed
    expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
  });

  test('Focus visible states are present', async ({ page }) => {
    // Tab through interactive elements and verify focus rings
    const interactiveElements = page.locator('button:visible, a:visible, input:visible');
    const count = await interactiveElements.count();
    
    // Test first 5 interactive elements
    for (let i = 0; i < Math.min(5, count); i++) {
      const element = interactiveElements.nth(i);
      await element.focus();
      
      // Verify element is focused
      await expect(element).toBeFocused();
      
      // Verify focus ring is visible (check for focus-visible class or ring styles)
      const hasRing = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outlineWidth !== '0px' || 
               styles.boxShadow.includes('rgb') ||
               el.classList.contains('focus-visible');
      });
      
      expect(hasRing).toBeTruthy();
    }
  });

  test('All interactive elements have minimum 44px touch target', async ({ page }) => {
    // Get all interactive elements
    const interactiveElements = page.locator('button:visible, a:visible, input[type="checkbox"]:visible');
    const count = await interactiveElements.count();
    
    // Check each element's size
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const box = await element.boundingBox();
      
      if (box) {
        // Verify minimum 44px height (width can vary for text links)
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Tab order is logical and sequential', async ({ page }) => {
    // Get all focusable elements in order
    const focusableElements = await page.locator('button:visible, a:visible, input:visible, [tabindex="0"]:visible').all();
    
    // Tab through and verify order makes sense
    let previousY = -1;
    
    for (const element of focusableElements.slice(0, 10)) {
      await element.focus();
      const box = await element.boundingBox();
      
      if (box) {
        // Verify elements are generally in top-to-bottom order
        // (Allow some flexibility for side-by-side elements)
        expect(box.y).toBeGreaterThanOrEqual(previousY - 100);
        previousY = box.y;
      }
    }
  });
});

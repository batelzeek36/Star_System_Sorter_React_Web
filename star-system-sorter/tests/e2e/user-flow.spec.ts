import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Test - Happy Path User Flow
 * 
 * Tests the complete user journey from onboarding to result screen:
 * 1. Navigate to onboarding screen
 * 2. Click "Begin Sorting" button
 * 3. Fill out birth data form
 * 4. Submit form and wait for result
 * 5. Verify result screen displays classification
 * 6. Take screenshot for visual verification
 * 
 * Requirements: 12.3, 12.11
 */
test('user can complete classification flow', async ({ page }) => {
  // Step 1: Navigate to onboarding screen
  await page.goto('/');
  
  // Verify onboarding screen loaded
  await expect(page.getByText('Star System Sorter')).toBeVisible();
  await expect(page.getByText('Discover your primary star system origin')).toBeVisible();
  
  // Step 2: Click "Begin Sorting" button
  await page.getByRole('button', { name: /begin sorting/i }).click();
  
  // Step 3: Verify input screen loaded
  await expect(page.getByText('Chart Input')).toBeVisible();
  
  // Step 4: Fill out birth data form
  // Date field
  await page.getByLabel(/date of birth/i).fill('10/03/1992');
  
  // Time field
  await page.getByLabel(/time of birth/i).fill('12:03 AM');
  
  // Location field
  await page.getByLabel(/location/i).fill('Attleboro, MA');
  
  // Timezone select (using the select element directly)
  await page.locator('#timezone-select').selectOption('America/New_York');
  
  // Step 5: Submit form
  await page.getByRole('button', { name: /compute chart/i }).click();
  
  // Step 6: Wait for result page to load
  // The result screen should show either "Your Primary Star System" or "Your Hybrid Star System"
  await expect(
    page.getByText(/your (primary|hybrid) star system/i)
  ).toBeVisible({ timeout: 30000 });
  
  // Step 7: Verify classification result is displayed
  // Check for percentage display (should show alignment percentage)
  await expect(page.getByText(/alignment/i)).toBeVisible();
  
  // Verify one of the star systems is displayed
  const starSystems = ['Pleiades', 'Sirius', 'Lyra', 'Andromeda', 'Orion', 'Arcturus'];
  let foundSystem = false;
  
  for (const system of starSystems) {
    const systemElement = page.getByText(system, { exact: true });
    if (await systemElement.isVisible()) {
      foundSystem = true;
      break;
    }
  }
  
  expect(foundSystem).toBe(true);
  
  // Step 8: Navigate to Why screen
  await page.getByRole('button', { name: /view why/i }).click();
  
  // Step 9: Verify Why screen loaded
  await expect(page.getByText(/why (pleiades|sirius|lyra|andromeda|orion|arcturus)/i)).toBeVisible();
  await expect(page).toHaveURL(/\/why/);
  
  // Step 10: Take screenshot for visual verification
  await page.screenshot({ 
    path: 'previews/e2e-happy.png',
    fullPage: true 
  });
});

/**
 * Additional test: Verify form validation
 * 
 * Tests that the form properly validates user input
 */
test('form validates user input', async ({ page }) => {
  await page.goto('/input');
  
  // Try to submit empty form
  await page.getByRole('button', { name: /compute chart/i }).click();
  
  // Should show validation errors (form should not submit)
  // The page should still be on /input
  await expect(page).toHaveURL(/\/input/);
});

/**
 * Additional test: Navigation flow
 * 
 * Tests that navigation between screens works correctly
 */
test('navigation between screens works', async ({ page }) => {
  // Start at onboarding
  await page.goto('/');
  
  // Navigate to input
  await page.getByRole('button', { name: /begin sorting/i }).click();
  await expect(page).toHaveURL(/\/input/);
  
  // Go back to onboarding
  await page.goBack();
  await expect(page).toHaveURL(/\//);
});

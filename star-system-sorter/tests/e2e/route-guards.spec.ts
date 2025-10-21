/**
 * Route Guards E2E Tests
 * 
 * Tests that protected routes redirect to /input when classification is missing.
 */

import { test, expect } from '@playwright/test';

test.describe('Route Guards', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure no classification data
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
  });

  test('redirects to /input when accessing /why without classification', async ({ page }) => {
    // Try to navigate directly to /why
    await page.goto('http://localhost:5173/why');
    
    // Should be redirected to /input
    await expect(page).toHaveURL('http://localhost:5173/input');
    
    // Toast message should be visible
    await expect(page.getByText('Add birth details first.')).toBeVisible();
  });

  test('redirects to /input when accessing /dossier without classification', async ({ page }) => {
    // Try to navigate directly to /dossier
    await page.goto('http://localhost:5173/dossier');
    
    // Should be redirected to /input
    await expect(page).toHaveURL('http://localhost:5173/input');
    
    // Toast message should be visible
    await expect(page.getByText('Add birth details first.')).toBeVisible();
  });

  test('allows access to /why with valid classification', async ({ page }) => {
    // Navigate to home and complete the flow
    await page.goto('http://localhost:5173');
    
    // Click "Begin Sorting"
    await page.getByRole('button', { name: /begin sorting/i }).click();
    
    // Fill in birth data
    await page.getByLabel(/date/i).fill('01/15/1990');
    await page.getByLabel(/time/i).fill('02:30 PM');
    await page.getByLabel(/location/i).fill('New York, NY');
    
    // Submit form
    await page.getByRole('button', { name: /compute|submit/i }).click();
    
    // Wait for result screen
    await page.waitForURL('**/result', { timeout: 10000 });
    
    // Navigate to Why screen
    await page.getByRole('button', { name: /view why/i }).click();
    
    // Should successfully navigate to /why
    await expect(page).toHaveURL(/\/why$/);
    
    // Should see Why screen content
    await expect(page.getByText(/lore v/i)).toBeVisible();
  });

  test('allows access to /dossier with valid classification', async ({ page }) => {
    // Navigate to home and complete the flow
    await page.goto('http://localhost:5173');
    
    // Click "Begin Sorting"
    await page.getByRole('button', { name: /begin sorting/i }).click();
    
    // Fill in birth data
    await page.getByLabel(/date/i).fill('01/15/1990');
    await page.getByLabel(/time/i).fill('02:30 PM');
    await page.getByLabel(/location/i).fill('New York, NY');
    
    // Submit form
    await page.getByRole('button', { name: /compute|submit/i }).click();
    
    // Wait for result screen
    await page.waitForURL('**/result', { timeout: 10000 });
    
    // Navigate to Dossier screen
    await page.getByRole('button', { name: /open dossier/i }).click();
    
    // Should successfully navigate to /dossier
    await expect(page).toHaveURL(/\/dossier$/);
    
    // Should see Dossier screen content
    await expect(page.getByText(/identity snapshot/i)).toBeVisible();
  });
});

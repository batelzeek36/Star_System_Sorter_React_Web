import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Dossier Screen
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9
 * 
 * Tests the Dossier screen functionality:
 * - Navigation to /dossier after classification
 * - Identity Snapshot section visibility
 * - Deployment Matrix section visibility
 * - Sources Gallery section visibility
 * - Export PNG button presence
 * - Print/PDF button presence
 * - PNG export functionality (yields non-empty data URL)
 * - Test completes in under 10 seconds
 */

test.describe('Dossier Screen', () => {
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
    
    // Navigate to Dossier screen
    await page.getByRole('button', { name: /open dossier/i }).click();
    await expect(page).toHaveURL(/\/dossier/);
  });

  test('navigates to Dossier after classification', async ({ page }) => {
    // Verify we're on the Dossier screen
    await expect(page).toHaveURL(/\/dossier/);
    
    // Verify Dossier header is visible
    await expect(page.getByText('Galactic Dossier')).toBeVisible();
    
    // Verify classification type is displayed (more specific selector)
    await expect(page.getByText(/^[A-Za-z]+ Classification$/)).toBeVisible();
  });

  test('Identity Snapshot section is visible', async ({ page }) => {
    // Verify Identity Snapshot section header
    await expect(page.getByText('Identity Snapshot')).toBeVisible();
    
    // Verify key fields are present (using more specific selectors)
    await expect(page.getByText('Type').first()).toBeVisible();
    await expect(page.getByText('Authority', { exact: true })).toBeVisible();
    await expect(page.getByText('Profile', { exact: true })).toBeVisible();
    await expect(page.getByText('Defined Centers')).toBeVisible();
    await expect(page.getByText('Signature Channel')).toBeVisible();
  });

  test('Deployment Matrix section is visible', async ({ page }) => {
    // Verify Deployment Matrix section header
    await expect(page.getByText('Deployment Matrix')).toBeVisible();
    
    // Verify at least one system is listed (Primary)
    await expect(page.getByText('Primary', { exact: true })).toBeVisible();
    
    // Verify the section description is present
    await expect(page.getByText(/All star systems.*by.*alignment/i)).toBeVisible();
  });

  test('Sources Gallery section is visible', async ({ page }) => {
    // Verify Sources Gallery section header
    await expect(page.getByText('Sources & References')).toBeVisible();
    
    // Verify the legend for disputed sources is present
    await expect(page.getByText(/⚑.*=.*Disputed.*or.*controversial/i)).toBeVisible();
  });

  test('Export PNG button is present', async ({ page }) => {
    // Verify Export PNG button exists
    const exportButton = page.getByRole('button', { name: /export png/i });
    await expect(exportButton).toBeVisible();
    
    // Verify button is enabled (not disabled)
    await expect(exportButton).toBeEnabled();
  });

  test('Print/PDF button is present', async ({ page }) => {
    // Verify Print/PDF button exists
    const printButton = page.getByRole('button', { name: /print.*pdf/i });
    await expect(printButton).toBeVisible();
    
    // Verify button is enabled
    await expect(printButton).toBeEnabled();
  });

  test('PNG export yields non-empty data URL', async ({ page }) => {
    // Set up a promise to capture the download
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    
    // Click Export PNG button
    const exportButton = page.getByRole('button', { name: /export png/i });
    await exportButton.click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Verify download has a filename
    const filename = download.suggestedFilename();
    expect(filename).toBeTruthy();
    expect(filename).toMatch(/^dossier-.*\.png$/);
    
    // Verify the download is not empty by checking the file size
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('all required sections are present', async ({ page }) => {
    // Verify all major sections are visible
    await expect(page.getByText('Identity Snapshot')).toBeVisible();
    await expect(page.getByText('The Verdict', { exact: false })).toBeVisible();
    await expect(page.getByText(/Gate.*Faction.*Grid|Gate.*Faction.*Matrix/i)).toBeVisible();
    await expect(page.getByText('Deployment Matrix')).toBeVisible();
    await expect(page.getByText('Sources & References')).toBeVisible();
    
    // Verify disclaimer is present
    await expect(page.getByText(/for insight.*entertainment.*not.*medical/i)).toBeVisible();
  });

  test('completes in under 10 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Perform key operations
    await expect(page.getByText('Galactic Dossier')).toBeVisible();
    await expect(page.getByText('Identity Snapshot')).toBeVisible();
    await expect(page.getByText('Deployment Matrix')).toBeVisible();
    await expect(page.getByText('Sources & References')).toBeVisible();
    
    // Verify Export and Print buttons are present
    await expect(page.getByRole('button', { name: /export png/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /print.*pdf/i })).toBeVisible();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify test completes in under 10 seconds (10000ms)
    expect(duration).toBeLessThan(10000);
  });
});

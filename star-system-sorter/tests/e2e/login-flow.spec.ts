import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login screen as entry point', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check for login screen elements
    await expect(page.getByRole('heading', { name: 'Star System Sorter' })).toBeVisible();
    await expect(page.getByText('S³')).toBeVisible();
    await expect(page.getByText(/Discover your cosmic origins/i)).toBeVisible();

    // Check for login buttons
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue as Guest/i })).toBeVisible();

    // Check for feature highlights
    await expect(page.getByText(/Deterministic star system classification/i)).toBeVisible();
    await expect(page.getByText(/Personalized cosmic insights/i)).toBeVisible();
    await expect(page.getByText(/Join a community of seekers/i)).toBeVisible();

    // Check for legal disclaimer
    await expect(page.getByText(/For insight & entertainment/i)).toBeVisible();
  });

  test('should navigate to onboarding when clicking Google login', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click Google login button
    await page.getByRole('button', { name: /Continue with Google/i }).click();

    // Should navigate to onboarding screen
    await expect(page).toHaveURL('http://localhost:5173/onboarding');
    await expect(page.getByRole('heading', { name: /Star System Sorter/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Begin Sorting/i })).toBeVisible();
  });

  test('should navigate to onboarding when clicking guest continue', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click guest continue button
    await page.getByRole('button', { name: /Continue as Guest/i }).click();

    // Should navigate to onboarding screen
    await expect(page).toHaveURL('http://localhost:5173/onboarding');
    await expect(page.getByRole('heading', { name: /Star System Sorter/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Begin Sorting/i })).toBeVisible();
  });

  test('should complete full flow from login to input', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Start from login
    await page.getByRole('button', { name: /Continue as Guest/i }).click();

    // Should be on onboarding
    await expect(page).toHaveURL('http://localhost:5173/onboarding');

    // Click Begin Sorting
    await page.getByRole('button', { name: /Begin Sorting/i }).click();

    // Should be on input screen
    await expect(page).toHaveURL('http://localhost:5173/input');
    await expect(page.getByLabelText(/Date of Birth/i)).toBeVisible();
  });

  test('login buttons should meet accessibility requirements', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check button sizes (should be at least 44px)
    const googleButton = page.getByRole('button', { name: /Continue with Google/i });
    const guestButton = page.getByRole('button', { name: /Continue as Guest/i });

    const googleBox = await googleButton.boundingBox();
    const guestBox = await guestButton.boundingBox();

    expect(googleBox?.height).toBeGreaterThanOrEqual(44);
    expect(guestBox?.height).toBeGreaterThanOrEqual(44);
  });
});

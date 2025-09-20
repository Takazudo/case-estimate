import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load the page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors (uncaught exceptions)
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Navigate to the app
    const response = await page.goto('/');

    // Check that the page loads successfully (not 404 or 500)
    expect(response?.status()).toBeLessThan(400);

    // Wait for the main app region to be visible
    await expect(page.getByRole('main')).toBeVisible();

    // Check that the main title is visible (in header button with aria-label)
    await expect(page.getByRole('button', { name: 'Go to home' })).toBeVisible();

    // Check that case selector is present in header
    await expect(page.getByRole('combobox').first()).toBeVisible();

    // Initially, we should see the top page with model selection
    // Check for the zudo-block-40 heading
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();

    // Select a case to make SVG appear
    await page.getByRole('combobox').first().selectOption('zudo-block-40-ACR-A');

    // Now check that SVG container is present after selecting a case
    await expect(page.locator('svg').first()).toBeVisible({ timeout: 5000 });

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should have interactive elements working', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check case selector dropdown has options
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toBeVisible();
    const options = await caseSelector.locator('option').count();
    expect(options).toBeGreaterThan(0);

    // Check that we're on the home page with model selection
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();

    // Select a case to reveal controls
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // After selecting a case, check that visualization panel appears
    await expect(page.locator('svg').first()).toBeVisible({ timeout: 5000 });

    // Check that tab buttons are visible
    await expect(page.getByRole('button', { name: 'Series' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Custom' })).toBeVisible();
  });

  test('should switch between different case models', async ({ page }) => {
    await page.goto('/');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    const caseSelector = page.getByRole('combobox').first();

    // Get initial case value
    const initialValue = await caseSelector.inputValue();

    // Change to a different case
    await caseSelector.selectOption('zudo-block-60-ACR-A');

    // Verify the selection changed
    const newValue = await caseSelector.inputValue();
    expect(newValue).not.toBe(initialValue);
    expect(newValue).toBe('zudo-block-60-ACR-A');

    // Verify SVG is still visible after change
    await expect(page.locator('svg').first()).toBeVisible();
  });
});

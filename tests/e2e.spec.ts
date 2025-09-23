import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load the landing page without errors', async ({ page }) => {
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

    // Check that we're showing the TopPage component
    // The header should have 'Takazudo Modular: Panels' logo link
    await expect(page.getByRole('link', { name: /Takazudo Modular: Panels/i })).toBeVisible();

    // Check that the model sections are visible
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-60/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /10BOX/i })).toBeVisible();

    // The case selector dropdown should NOT be visible on the landing page
    await expect(page.getByRole('combobox').first()).not.toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load the configurator at /m route', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the configurator with a case parameter
    const response = await page.goto('/m?c=1a');

    // Check that the page loads successfully
    expect(response?.status()).toBeLessThan(400);

    // Wait for the main app region to be visible
    await expect(page.getByRole('main')).toBeVisible();

    // Check that the main title is visible (in header link)
    await expect(page.getByRole('link', { name: /Takazudo Modular: Panels/i })).toBeVisible();

    // Check that case selector is present (HeadlessUI Listbox renders as button)
    // Wait for hydration to complete
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('button', { name: /Select a case model|zudo-block|10box/i }),
    ).toBeVisible({ timeout: 10000 });

    // Should show the visualization panel with SVG
    await expect(page.locator('svg').first()).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should navigate from case model grid to case configurator', async ({ page }) => {
    await page.goto('/');

    // Click on a case model from the grid (e.g., zudo-block-40-ACR-A)
    // The grid items are links with case model captions
    await page.getByRole('link', { name: 'zudo-block-40-ACR-A' }).first().click();

    // Wait for navigation to /m route
    await page.waitForURL(/\/m\?/);

    // Should be on /m route with case parameter
    const url = page.url();
    expect(url).toContain('/m?c=');

    // Should show the case selector with the selected case (HeadlessUI Listbox)
    const caseSelector = page.getByRole('button', { name: /zudo-block-40-ACR-A/i });
    await expect(caseSelector).toBeVisible({ timeout: 5000 });

    // Should show the visualization panel with SVG
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should have interactive elements working in configurator', async ({ page }) => {
    // Navigate directly to configurator with a case
    await page.goto('/m?c=1a');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check case selector is visible (HeadlessUI Listbox renders as button)
    // Wait for hydration to complete
    await page.waitForLoadState('networkidle');
    const caseSelector = page.getByRole('button', { name: /zudo-block-40-ACR-A/i });
    await expect(caseSelector).toBeVisible({ timeout: 10000 });

    // Check that visualization panel is visible
    await expect(page.locator('svg').first()).toBeVisible();

    // Check that tab buttons are visible
    await expect(page.getByRole('button', { name: 'Series' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Custom' })).toBeVisible();
  });

  test('should switch between different case models', async ({ page }) => {
    // Start with a specific case
    await page.goto('/m?c=1a');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Wait for hydration to complete
    await page.waitForLoadState('networkidle');

    // Click the case selector to open dropdown
    const caseSelector = page.getByRole('button', { name: /zudo-block-40-ACR-A/i });
    await expect(caseSelector).toBeVisible({ timeout: 10000 });
    await caseSelector.click();

    // Select a different case from the dropdown
    await page.getByRole('option', { name: /zudo-block-60-ACR-A/i }).click();

    // Verify the selection changed
    await expect(page.getByRole('button', { name: /zudo-block-60-ACR-A/i })).toBeVisible();

    // Verify SVG is still visible after change
    await expect(page.locator('svg').first()).toBeVisible();

    // Wait for URL to update
    await page.waitForFunction(() => window.location.href.includes('c=3a'), { timeout: 5000 });

    // URL should be updated
    const url = page.url();
    expect(url).toContain('c=3a'); // zudo-block-60-ACR-A encoded
  });

  test('should persist URL parameters at /m route', async ({ page }) => {
    // Navigate directly with URL parameters
    await page.goto('/m?c=3a&p=1cb.2cb');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the case selector shows the correct case
    // c=3a corresponds to zudo-block-60-ACR-A
    // HeadlessUI Listbox shows selected value as button text
    // Wait for hydration to complete
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: /zudo-block-60-ACR-A/i })).toBeVisible({
      timeout: 10000,
    });

    // Verify SVG is visible
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('header logo should navigate to home view', async ({ page }) => {
    // Start with the configurator with a case selected
    await page.goto('/m?c=1a');

    // Wait for case to load
    await expect(page.locator('svg').first()).toBeVisible();

    // Click the logo
    await page.getByRole('link', { name: /Takazudo Modular: Panels/i }).click();

    // Should navigate to home page
    await page.waitForURL('/');

    // Verify we're showing the TopPage with model sections
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-60/i })).toBeVisible();

    // Case selector should not be visible on home page
    // HeadlessUI Listbox would render as button
    await expect(page.getByRole('button', { name: /Select a case model/i })).not.toBeVisible();
  });
});

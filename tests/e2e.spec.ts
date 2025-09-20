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

    // Check that we're showing the TopPage component within Configurator
    // The header should have 'Takazudo Modular Panels'
    await expect(page.getByRole('button', { name: 'Go to home' })).toBeVisible();

    // Check that the model sections are visible
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-60/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /10BOX/i })).toBeVisible();

    // Check that the case selector dropdown is visible
    await expect(page.getByRole('combobox').first()).toBeVisible();

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

    // Navigate to the configurator
    const response = await page.goto('/m');

    // Check that the page loads successfully
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

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should navigate from case model grid to case configurator', async ({ page }) => {
    await page.goto('/');

    // Click on a case model from the grid (e.g., zudo-block-40-ACR-A)
    // The grid items are links with case model captions
    await page.getByRole('link', { name: 'zudo-block-40-ACR-A' }).first().click();

    // Should select the case in the dropdown
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toHaveValue('zudo-block-40-ACR-A', { timeout: 5000 });

    // Should show the visualization panel with SVG
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should have interactive elements working in configurator', async ({ page }) => {
    await page.goto('/m');

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
    await page.goto('/m');

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

  test('should persist URL parameters at /m route', async ({ page }) => {
    // Navigate directly with URL parameters
    await page.goto('/m?c=3a&p=1cb.2cb');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the case selector shows the correct case
    const caseSelector = page.getByRole('combobox').first();

    // Wait for the selector to have the correct value
    // This ensures hydration is complete and URL params are processed
    await expect(caseSelector).toHaveValue('zudo-block-60-ACR-A', { timeout: 5000 });

    const selectedValue = await caseSelector.inputValue();

    // c=3a corresponds to zudo-block-60-ACR-A
    expect(selectedValue).toBe('zudo-block-60-ACR-A');

    // Verify SVG is visible
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('header logo should navigate to home view', async ({ page }) => {
    // Start with a case selected
    await page.goto('/?c=1a');

    // Wait for case to load
    await expect(page.locator('svg').first()).toBeVisible();

    // Click the logo
    await page.getByRole('button', { name: 'Go to home' }).click();

    // Should clear the case selection and show TopPage
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toHaveValue('', { timeout: 5000 });

    // Verify we're showing the TopPage with model sections
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-40/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /zudo-block-60/i })).toBeVisible();
  });
});

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

    // Wait for the main app container to be visible
    await expect(page.locator('#root')).toBeVisible();

    // Check that the main title is visible
    await expect(page.locator('h1:has-text("Takazudo Modular Panels")')).toBeVisible();

    // Check that case selector is present
    await expect(page.locator('select').first()).toBeVisible();

    // Initially, no SVG should be present (welcome message instead)
    await expect(page.locator('text=Welcome to Takazudo Modular')).toBeVisible();

    // Select a case to make SVG appear
    await page.selectOption('select', 'zudo-block-40');

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
    const caseSelector = page.locator('select').first();
    await expect(caseSelector).toBeVisible();
    const options = await caseSelector.locator('option').count();
    expect(options).toBeGreaterThan(0);

    // Check that the welcome message is visible when no case is selected
    await expect(page.locator('text=Welcome to Takazudo Modular')).toBeVisible();

    // Select a case to reveal controls
    await page.selectOption('select', 'zudo-block-40');

    // Click on Custom tab to see panel selector
    await page.locator('button:has-text("Custom")').click();

    // Wait for the panel selector to appear
    await expect(page.locator('text=Select Panel')).toBeVisible();

    // Check that panel selector dropdown is present
    await expect(page.locator('button:has-text("Select a panel to customize")')).toBeVisible();
  });

  test('should switch between different case models', async ({ page }) => {
    await page.goto('/');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    const caseSelector = page.locator('select').first();

    // Get initial case value
    const initialValue = await caseSelector.inputValue();

    // Change to a different case
    await caseSelector.selectOption('zudo-block-60');

    // Verify the selection changed
    const newValue = await caseSelector.inputValue();
    expect(newValue).not.toBe(initialValue);
    expect(newValue).toBe('zudo-block-60');

    // Verify SVG is still visible after change
    await expect(page.locator('svg').first()).toBeVisible();
  });
});

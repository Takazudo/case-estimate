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

    // Check that the top navigation grid sections are visible
    await expect(
      page.getByRole('heading', { level: 2, name: /ギャラリー.*Gallery/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /ケースの種類.*Case Models/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /ケースビルダー.*Case Builder/i }),
    ).toBeVisible();

    // The case selector dropdown should NOT be visible on the landing page
    await expect(page.getByRole('combobox').first()).not.toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load the configurator at /m route', async ({ page }) => {
    // Track console errors (filter out image loading 404s which are timing-related in CI)
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out 404 errors from lazy-loaded images (timing issue in CI)
        if (!text.includes('404') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text);
        }
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

    // Verify no console errors (excluding 404s from lazy-loaded images)
    expect(consoleErrors).toHaveLength(0);
  });

  // FIXME: This test needs to be updated for the new case-models page structure
  test.skip('should navigate from case model grid to case configurator', async ({ page }) => {
    // Navigate to case models page where the BuilderNav links are located
    await page.goto('/case-models');

    // Click on a case model link (e.g., zudo-block-40-ACR-A)
    // BuilderNav uses BuildButton component which creates links
    await page
      .getByRole('link', { name: /zudo-block-40-ACR-A/i })
      .first()
      .click();

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

    // Check that preset selector is visible (instead of tabs)
    const presetSection = page.locator('h3', { hasText: 'プリセット' });
    await expect(presetSection).toBeVisible();

    // Check that panel list is visible (always visible now, not in a tab)
    const panelList = page.locator('text=サイド1');
    await expect(panelList).toBeVisible();
  });

  test('should switch between different case models', async ({ page }) => {
    // Start with a specific case
    await page.goto('/m?c=1a');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Wait for hydration to complete
    await page.waitForLoadState('networkidle');

    // Click the case selector button to open modal
    const caseSelector = page.getByRole('button', { name: /zudo-block-40-ACR-A/i });
    await expect(caseSelector).toBeVisible({ timeout: 10000 });
    await caseSelector.click();

    // Wait for modal to appear
    await expect(page.getByRole('dialog', { name: /モデル選択/i })).toBeVisible();

    // Select a different case from the modal (it's a button, not an option)
    await page.getByRole('button', { name: /zudo-block-60-ACR-A/i }).click();

    // Verify the selection changed in the sidebar
    await expect(page.getByRole('button', { name: /zudo-block-60-ACR-A/i }).first()).toBeVisible();

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

    // Verify we're showing the TopPage with navigation grid
    await expect(
      page.getByRole('heading', { level: 2, name: /ギャラリー.*Gallery/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /ケースの種類.*Case Models/i }),
    ).toBeVisible();

    // Case selector should not be visible on home page
    // HeadlessUI Listbox would render as button
    await expect(page.getByRole('button', { name: /Select a case model/i })).not.toBeVisible();
  });

  test('should load /gallery page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/gallery');
    expect(response?.status()).toBeLessThan(400);

    // Should show gallery heading
    await expect(page.getByRole('heading', { name: /ギャラリー|Gallery/i })).toBeVisible();

    // Should show gallery grid
    await expect(page.getByTestId('gallery-thumbnail-grid')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /modules page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/modules');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /selection page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/selection');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /price page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/price');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /case-models page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/case-models');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /panel page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/panel');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });

  test('should load /faq page without errors', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto('/faq');
    expect(response?.status()).toBeLessThan(400);

    // Should have main content
    await expect(page.getByRole('main')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify no page errors
    expect(pageErrors).toHaveLength(0);
  });
});

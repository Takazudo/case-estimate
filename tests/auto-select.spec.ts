import { test, expect } from '@playwright/test';

test.describe('Auto-Select Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should auto-select Series tab when selecting a case model', async ({ page }) => {
    // Initially no case is selected
    const caseSelector = page.locator('select').first();
    await expect(caseSelector).toHaveValue('');

    // Series tab should not be visible initially
    await expect(page.locator('button:has-text("Series")')).not.toBeVisible();

    // Select a case model
    await caseSelector.selectOption('zudo-block-40');

    // Series tab should now be visible and active
    await expect(page.locator('button:has-text("Series")')).toBeVisible();

    // Check that Series tab is active (has active styles)
    const seriesTab = page.locator('button:has-text("Series")');
    // Active tab has text-zd-white, inactive has text-zd-gray
    const seriesTabSpan = seriesTab.locator('span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    // Custom tab should not be active
    const customTabSpan = page.locator('button:has-text("Custom") span').first();
    await expect(customTabSpan).toHaveClass(/text-zd-gray/);
  });

  test('should auto-select first series and apply its colors when selecting a case', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // Select zudo-block-40 (acrylic case)
    await caseSelector.selectOption('zudo-block-40');

    // Wait for series cards to be visible
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    // First series card should be active (has active border)
    const firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
    await expect(firstSeriesCard).toHaveClass(/bg-zd-gray2/);

    // Check that the SVG panels have the colors from the first series (YamiKage - all shadow gray)
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check SVG panel colors by looking at path elements with fill attribute
    const svgPaths = page.locator('svg path[fill="#616161"]');
    const pathCount = await svgPaths.count();

    // Should have multiple panels with shadow color for YamiKage series
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should auto-select first series for 3D printed cases', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select zudo-block-40-lite (3D printed case)
    await caseSelector.selectOption('zudo-block-40-lite');

    // Wait for series cards to be visible
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    // First series card (YamiKage) should be active
    const firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
    await expect(firstSeriesCard).toHaveClass(/bg-zd-gray2/);

    // Check that panels have YamiKage series colors (all carbon-black)
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check SVG panel colors by looking at path elements with fill attribute
    const svgPaths = page.locator('svg path[fill="#212121"]');
    const pathCount = await svgPaths.count();

    // Should have multiple panels with carbon-black color for YamiKage series
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should switch case models and auto-select appropriate series each time', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // First select acrylic case
    await caseSelector.selectOption('zudo-block-40');
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    let firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);

    // Switch to 3D printed case
    await caseSelector.selectOption('zudo-block-40-lite');
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);

    // Switch to another acrylic case
    await caseSelector.selectOption('zudo-block-60');
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
  });

  test('should maintain auto-selected series when switching between tabs', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40');

    // Verify Series tab is active and first series is selected
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    const firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);

    // Switch to Custom tab
    await page.locator('button:has-text("Custom")').click();
    await expect(page.locator('text=Select Panel')).toBeVisible();

    // Switch back to Series tab
    await page.locator('button:has-text("Series")').click();

    // First series should still be active
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
  });

  test('should reset to first series when selecting the same case model again', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40');

    // Wait for series to load
    await page.waitForTimeout(500);

    // Select a different series (e.g., レッド - Red)
    const redCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await redCard.click();
    await expect(redCard).toHaveClass(/border-zd-white/);

    // Select the same case model again from dropdown
    await caseSelector.selectOption('zudo-block-40');

    // Should auto-select the first series (YamiKage) again
    const yamiKageCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(yamiKageCard).toHaveClass(/border-zd-white/);
    await expect(redCard).not.toHaveClass(/bg-zd-gray2/);
  });

  test('should handle case with no series gracefully', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // If we add a case without series in the future, it should fall back to default colors
    // For now, test that all existing cases have series
    const caseOptions = [
      'zudo-block-40',
      'zudo-block-40-lite',
      'zudo-block-60',
      'zudo-block-60-lite',
    ];

    for (const caseOption of caseOptions) {
      await caseSelector.selectOption(caseOption);

      // Should always show Series tab
      await expect(page.locator('button:has-text("Series")')).toBeVisible();

      // Should have at least one series card
      const seriesCards = page.locator('button[class*="border-3"]');
      const count = await seriesCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Auto-Select Edge Cases', () => {
  test('should not throw errors when rapidly switching cases', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    const caseSelector = page.locator('select').first();

    // Rapidly switch between cases
    await caseSelector.selectOption('zudo-block-40');
    await caseSelector.selectOption('zudo-block-60');
    await caseSelector.selectOption('zudo-block-40-lite');
    await caseSelector.selectOption('zudo-block-60-lite');
    await caseSelector.selectOption('zudo-block-40');

    // No console errors should occur
    expect(consoleErrors).toHaveLength(0);

    // Final state should be correct
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    const firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
  });

  test('should preserve user customizations until case change', async ({ page }) => {
    await page.goto('/');
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40');

    // Switch to Custom tab and make a customization
    await page.locator('button:has-text("Custom")').click();

    // Wait for panel selector to be visible
    await expect(page.locator('text=Select Panel')).toBeVisible();

    // Click the first clickable panel in the panel selector
    const panelButtons = page
      .locator('button')
      .filter({ hasText: /Panel \d+|Side|Front|Back|Bottom/ });
    if ((await panelButtons.count()) > 0) {
      await panelButtons.first().click();

      // Wait for color picker to appear
      await page.waitForTimeout(500);

      // Select a different color (red)
      const colorButtons = page.locator('button[class*="rounded-full"]');
      if ((await colorButtons.count()) > 1) {
        await colorButtons.nth(1).click(); // Click second color (should be different from default)
      }
    }

    // Now select a different case
    await caseSelector.selectOption('zudo-block-60');

    // Should auto-select Series tab and first series
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    // Customizations from previous case should be reset
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check that panels have YamiKage colors (shadow gray)
    const svgPaths = page.locator('svg path[fill="#616161"]');
    const pathCount = await svgPaths.count();
    expect(pathCount).toBeGreaterThan(0); // YamiKage is all shadow gray
  });
});

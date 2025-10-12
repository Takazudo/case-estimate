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
    await caseSelector.selectOption('zudo-block-40-acr-a');

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

    // Select zudo-block-40-acr-a (acrylic case)
    await caseSelector.selectOption('zudo-block-40-acr-a');

    // Wait for series cards to be visible
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    // First series card should be active (has active border)
    const firstSeriesCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
    await expect(firstSeriesCard).toHaveClass(/bg-zd-gray2/);

    // Check that the SVG panels have the colors from the first series (Red - all red)
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check SVG panel colors by looking at path elements with fill attribute
    const svgPaths = page.locator('svg path[fill="#b71c1c"]');
    const pathCount = await svgPaths.count();

    // Should have multiple panels with red color for Red series
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should auto-select first series for 3D printed cases', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select zudo-block-40-3dp-a (3D printed case)
    await caseSelector.selectOption('zudo-block-40-3dp-a');

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
    await caseSelector.selectOption('zudo-block-40-acr-a');
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    let firstSeriesCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);

    // Switch to 3D printed case
    await caseSelector.selectOption('zudo-block-40-3dp-a');
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    firstSeriesCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);

    // Switch to another acrylic case
    await caseSelector.selectOption('zudo-block-60-acr-a');
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    firstSeriesCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
  });

  test('should maintain auto-selected series when switching between tabs', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40-acr-a');

    // Verify Series tab is active and first series is selected
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    const firstSeriesCard = page.locator('button').filter({ hasText: 'レッド' }).first();
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
    await caseSelector.selectOption('zudo-block-40-acr-a');

    // Wait for series to load
    await page.waitForTimeout(500);

    // Select a different series (e.g., オレンジ - Orange)
    const orangeCard = page.locator('button').filter({ hasText: 'オレンジ' }).first();
    await orangeCard.click();
    await expect(orangeCard).toHaveClass(/border-zd-white/);

    // Select the same case model again from dropdown
    await caseSelector.selectOption('zudo-block-40-acr-a');

    // Should auto-select the first series (レッド) again
    const redCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(redCard).toHaveClass(/border-zd-white/);
    await expect(orangeCard).not.toHaveClass(/bg-zd-gray2/);
  });

  test('should handle case with no series gracefully', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // If we add a case without series in the future, it should fall back to default colors
    // For now, test that all existing cases have series
    const caseOptions = [
      'zudo-block-40-acr-a',
      'zudo-block-40-3dp-a',
      'zudo-block-60-acr-a',
      'zudo-block-60-3dp-a',
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
    await caseSelector.selectOption('zudo-block-40-acr-a');
    await caseSelector.selectOption('zudo-block-60-acr-a');
    await caseSelector.selectOption('zudo-block-40-3dp-a');
    await caseSelector.selectOption('zudo-block-60-3dp-a');
    await caseSelector.selectOption('zudo-block-40-acr-a');

    // No console errors should occur
    expect(consoleErrors).toHaveLength(0);

    // Final state should be correct
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    const firstSeriesCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstSeriesCard).toHaveClass(/border-zd-white/);
  });

  test('should preserve user customizations until case change', async ({ page }) => {
    await page.goto('/');
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40-acr-a');

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
    await caseSelector.selectOption('zudo-block-60-acr-a');

    // Should auto-select Series tab and first series
    const seriesTabSpan = page.locator('button:has-text("Series") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    // Customizations from previous case should be reset
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check that panels have Red colors (red)
    const svgPaths = page.locator('svg path[fill="#b71c1c"]');
    const pathCount = await svgPaths.count();
    expect(pathCount).toBeGreaterThan(0); // Red is all red
  });
});

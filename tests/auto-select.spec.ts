import { test, expect } from '@playwright/test';

// QUARANTINED: asserts pre-modal-UI (native select/combobox/tabs/home-config) that no longer exists; rewrite tracked in Takazudo/case-estimate#94
test.describe.skip('Auto-Select Feature', () => {
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

  test('should auto-select Preset tab when selecting a case model', async ({ page }) => {
    // Initially no case is selected
    const caseSelector = page.locator('select').first();
    await expect(caseSelector).toHaveValue('');

    // Preset tab should not be visible initially
    await expect(page.locator('button:has-text("Preset")')).not.toBeVisible();

    // Select a case model
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // Preset tab should now be visible and active
    await expect(page.locator('button:has-text("Preset")')).toBeVisible();

    // Check that Preset tab is active (has active styles)
    const presetTab = page.locator('button:has-text("Preset")');
    // Active tab has text-zd-white, inactive has text-zd-gray
    const presetTabSpan = presetTab.locator('span').first();
    await expect(presetTabSpan).toHaveClass(/text-zd-white/);

    // Custom tab should not be active
    const customTabSpan = page.locator('button:has-text("Custom") span').first();
    await expect(customTabSpan).toHaveClass(/text-zd-gray/);
  });

  test('should auto-select first preset and apply its colors when selecting a case', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // Select zudo-block-40-ACR-A (acrylic case)
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // Wait for preset cards to be visible
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    // First preset card should be active (has active border)
    const firstPresetCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);
    await expect(firstPresetCard).toHaveClass(/bg-zd-gray2/);

    // Check that the SVG panels have the colors from the first preset (Red - all red)
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check SVG panel colors by looking at path elements with fill attribute
    const svgPaths = page.locator('svg path[fill="#b71c1c"]');
    const pathCount = await svgPaths.count();

    // Should have multiple panels with red color for Red preset
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should auto-select first preset for 3D printed cases', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select zudo-block-40-3DP-A (3D printed case)
    await caseSelector.selectOption('zudo-block-40-3DP-A');

    // Wait for preset cards to be visible
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    // First preset card (YamiKage) should be active
    const firstPresetCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);
    await expect(firstPresetCard).toHaveClass(/bg-zd-gray2/);

    // Check that panels have YamiKage preset colors (all carbon-black)
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check SVG panel colors by looking at path elements with fill attribute
    const svgPaths = page.locator('svg path[fill="#212121"]');
    const pathCount = await svgPaths.count();

    // Should have multiple panels with carbon-black color for YamiKage preset
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should switch case models and auto-select appropriate preset each time', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // First select acrylic case
    await caseSelector.selectOption('zudo-block-40-ACR-A');
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    let firstPresetCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);

    // Switch to 3D printed case
    await caseSelector.selectOption('zudo-block-40-3DP-A');
    await expect(page.locator('button').filter({ hasText: 'YamiKage' }).first()).toBeVisible();

    firstPresetCard = page.locator('button').filter({ hasText: 'YamiKage' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);

    // Switch to another acrylic case
    await caseSelector.selectOption('zudo-block-60-ACR-A');
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    firstPresetCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);
  });

  test('should maintain auto-selected preset when switching between tabs', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // Verify Preset tab is active and first preset is selected
    const presetTabSpan = page.locator('button:has-text("Preset") span').first();
    await expect(presetTabSpan).toHaveClass(/text-zd-white/);

    const firstPresetCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);

    // Switch to Custom tab
    await page.locator('button:has-text("Custom")').click();
    await expect(page.locator('text=Select Panel')).toBeVisible();

    // Switch back to Preset tab
    await page.locator('button:has-text("Preset")').click();

    // First preset should still be active
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);
  });

  test('should reset to first preset when selecting the same case model again', async ({
    page,
  }) => {
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // Wait for preset to load
    await page.waitForTimeout(500);

    // Select a different preset (e.g., オレンジ - Orange)
    const orangeCard = page.locator('button').filter({ hasText: 'オレンジ' }).first();
    await orangeCard.click();
    await expect(orangeCard).toHaveClass(/border-zd-white/);

    // Select the same case model again from dropdown
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // Should auto-select the first preset (レッド) again
    const redCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(redCard).toHaveClass(/border-zd-white/);
    await expect(orangeCard).not.toHaveClass(/bg-zd-gray2/);
  });

  test('should handle case with no preset gracefully', async ({ page }) => {
    const caseSelector = page.locator('select').first();

    // If we add a case without preset in the future, it should fall back to default colors
    // For now, test that all existing cases have preset
    const caseOptions = [
      'zudo-block-40-ACR-A',
      'zudo-block-40-3DP-A',
      'zudo-block-60-ACR-A',
      'zudo-block-60-3DP-A',
    ];

    for (const caseOption of caseOptions) {
      await caseSelector.selectOption(caseOption);

      // Should always show Preset tab
      await expect(page.locator('button:has-text("Preset")')).toBeVisible();

      // Should have at least one preset card
      const presetCards = page.locator('button[class*="border-3"]');
      const count = await presetCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

// QUARANTINED: asserts pre-modal-UI (native select/combobox/tabs/home-config) that no longer exists; rewrite tracked in Takazudo/case-estimate#94
test.describe.skip('Auto-Select Edge Cases', () => {
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
    await caseSelector.selectOption('zudo-block-40-ACR-A');
    await caseSelector.selectOption('zudo-block-60-ACR-A');
    await caseSelector.selectOption('zudo-block-40-3DP-A');
    await caseSelector.selectOption('zudo-block-60-3DP-A');
    await caseSelector.selectOption('zudo-block-40-ACR-A');

    // No console errors should occur
    expect(consoleErrors).toHaveLength(0);

    // Final state should be correct
    const presetTabSpan = page.locator('button:has-text("Preset") span').first();
    await expect(presetTabSpan).toHaveClass(/text-zd-white/);

    const firstPresetCard = page.locator('button').filter({ hasText: 'レッド' }).first();
    await expect(firstPresetCard).toHaveClass(/border-zd-white/);
  });

  test('should preserve user customizations until case change', async ({ page }) => {
    await page.goto('/');
    const caseSelector = page.locator('select').first();

    // Select a case
    await caseSelector.selectOption('zudo-block-40-ACR-A');

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
    await caseSelector.selectOption('zudo-block-60-ACR-A');

    // Should auto-select Preset tab and first preset
    const presetTabSpan = page.locator('button:has-text("Preset") span').first();
    await expect(presetTabSpan).toHaveClass(/text-zd-white/);

    // Customizations from previous case should be reset
    // Wait for SVG to render
    await page.waitForTimeout(500);

    // Check that panels have Red colors (red)
    const svgPaths = page.locator('svg path[fill="#b71c1c"]');
    const pathCount = await svgPaths.count();
    expect(pathCount).toBeGreaterThan(0); // Red is all red
  });
});

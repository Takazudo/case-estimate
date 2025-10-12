import { test, expect } from '@playwright/test';

test.describe('Pattern Color URL Persistence', () => {
  test('should handle red-green-silk pattern color in URL', async ({ page }) => {
    // Test URL with red-green-silk pattern (rg code)
    const testUrl = '/m?c=2a&p=1rg.3cb';
    // This URL has:
    // - Case: 2a (zudo-block-40-3dp-a)
    // - Panels: side1=red-green-silk (1rg), front1=carbon-black (3cb)

    await page.goto(testUrl);

    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // The URL should be preserved
    expect(page.url()).toContain('1rg');

    // Get the current URL
    const currentUrl = page.url();

    // Open the same URL in a new page to test persistence
    const newPage = await page.context().newPage();
    await newPage.goto(currentUrl);
    await newPage.waitForLoadState('networkidle');

    // The URL should still contain the pattern color code
    expect(newPage.url()).toContain('1rg');

    // Close the new page
    await newPage.close();
  });

  test('should preserve pattern color when switching between panels', async ({ page }) => {
    // Start with a 3DP case URL
    await page.goto('/m?c=4a'); // zudo-block-60-3dp-a
    await page.waitForLoadState('networkidle');

    // Set a pattern color through URL
    await page.goto('/m?c=4a&p=1rg.2cb.3rg');
    await page.waitForLoadState('networkidle');

    // Verify URL contains both pattern colors
    const url = page.url();
    expect(url).toContain('1rg'); // side1 with red-green-silk
    expect(url).toContain('3rg'); // front1 with red-green-silk
    expect(url).toContain('2cb'); // side2 with carbon-black

    // Navigate to a different case and back
    await page.goto('/m?c=2a'); // Different case
    await page.waitForLoadState('networkidle');

    // Go back to the original URL
    await page.goto('/m?c=4a&p=1rg.2cb.3rg');
    await page.waitForLoadState('networkidle');

    // Pattern colors should still be in URL
    const finalUrl = page.url();
    expect(finalUrl).toContain('1rg');
    expect(finalUrl).toContain('3rg');
    expect(finalUrl).toContain('2cb');
  });

  test('renders pattern swatches with valid fallback backgrounds', async ({ page }) => {
    await page.goto('/m?c=2a');
    await page.waitForLoadState('networkidle');

    const customTabButton = page.locator('button:has-text("カスタム")');
    await customTabButton.click();

    const previewButton = page.locator('button[aria-label="Select サイド1"]');
    await previewButton.click();

    const patternColorButton = page.locator('button:has-text("レッドグリーンシルク")').first();

    const expectedColor = 'rgb(164, 83, 74)';

    // First check the color picker swatch BEFORE clicking
    const colorPickerSwatch = patternColorButton.locator('[data-testid="color-picker-swatch"]');
    await expect(colorPickerSwatch).toBeVisible();
    await expect
      .poll(async () => colorPickerSwatch.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe(expectedColor);
    const colorPickerStyle = await colorPickerSwatch.getAttribute('style');
    expect(colorPickerStyle ?? '').not.toContain('pattern-');

    // Now click the pattern color button
    await patternColorButton.click();

    // After clicking, check the selector and preview swatches
    const selectorSwatch = page.locator('[data-testid="panel-selector-swatch"]').first();
    await expect(selectorSwatch).toBeVisible();
    await expect
      .poll(async () => selectorSwatch.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe(expectedColor);
    const selectorStyle = await selectorSwatch.getAttribute('style');
    expect(selectorStyle ?? '').not.toContain('pattern-');

    const previewSwatch = previewButton.locator('[data-testid="custom-preview-swatch"]');
    await expect(previewSwatch).toBeVisible();
    await expect
      .poll(async () => previewSwatch.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe(expectedColor);
    const previewStyle = await previewSwatch.getAttribute('style');
    expect(previewStyle ?? '').not.toContain('pattern-');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Manual Tab Switching Fix', () => {
  test('should allow manual tab switching regardless of color configuration', async ({ page }) => {
    // Load a case with default colors
    await page.goto('/m?c=1a');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Start by clicking Custom tab
    const customTabButton = page.locator('button:has-text("カスタム")');
    await customTabButton.click();
    await page.waitForTimeout(500);

    // Verify Custom tab is active
    let customTabSpan = page.locator('button:has-text("カスタム") span').first();
    await expect(customTabSpan).toHaveClass(/text-zd-white/);

    // Now switch to Series tab
    const seriesTabButton = page.locator('button:has-text("シリーズ")');
    await seriesTabButton.click();
    await page.waitForTimeout(500);

    // Verify Series tab is active (this is what should work after the fix)
    let seriesTabSpan = page.locator('button:has-text("シリーズ") span').first();
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);
    await expect(customTabSpan).toHaveClass(/text-zd-gray/);

    // Series content should be visible
    await expect(page.locator('button').filter({ hasText: 'レッド' }).first()).toBeVisible();

    // Click a series to change colors
    const orangeSeriesButton = page.locator('button').filter({ hasText: 'オレンジ' }).first();
    await orangeSeriesButton.click();
    await page.waitForTimeout(500);

    // Should still be on Series tab
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);

    // Switch back to Custom
    await customTabButton.click();
    await page.waitForTimeout(500);
    await expect(customTabSpan).toHaveClass(/text-zd-white/);

    // Select a panel and change its color
    const panelSelector = page.locator('select').nth(1);
    if (await panelSelector.isVisible()) {
      await panelSelector.selectOption({ index: 0 });
      await page.waitForTimeout(300);

      // Look for black color button
      const blackButtons = page.locator('button').filter({ hasText: 'ブラック' });
      const blackColorButton = blackButtons.first();

      if (await blackColorButton.isVisible()) {
        await blackColorButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Now colors don't match any preset
    // Try to switch to Series tab - this should work after the fix
    await seriesTabButton.click();
    await page.waitForTimeout(1000);

    // THIS IS THE KEY TEST: Series tab should be active
    await expect(seriesTabSpan).toHaveClass(/text-zd-white/);
    await expect(customTabSpan).toHaveClass(/text-zd-gray/);
  });
});

import { test, expect } from '@playwright/test';

test.describe('10BOX URL Persistence - Simple', () => {
  test('should save 10BOX case selection in URL', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Select 10BOX Lite model
    await page.selectOption('select', '10box-lite');

    // Wait for SVG to load
    await expect(page.locator('svg').first()).toBeVisible({ timeout: 5000 });

    // Check URL contains correct case parameter
    const url = page.url();
    expect(url).toContain('c=9'); // 10box-lite is encoded as '9'
  });

  test('should restore 10BOX from URL', async ({ page }) => {
    // Navigate directly to 10BOX URL
    await page.goto('/?c=9');
    await page.waitForLoadState('networkidle');

    // Verify the case is automatically selected
    const caseSelector = page.locator('select').first();
    await expect(caseSelector).toHaveValue('10box-lite');

    // Verify SVG is loaded
    await expect(page.locator('svg').first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle 10BOX with custom colors in URL', async ({ page }) => {
    // Test URL with some custom panel colors
    // c=9 (10box-lite)
    // p=m1cr.l4gy (main-side1=crimson-red, lid-top1=gold-yellow)
    await page.goto('/?c=9&p=m1cr.l4gy');
    await page.waitForLoadState('networkidle');

    // Verify case is loaded
    const caseSelector = page.locator('select').first();
    await expect(caseSelector).toHaveValue('10box-lite');

    // The URL should contain both custom colors and default colors for other panels
    const url = new URL(page.url());
    const panelParam = url.searchParams.get('p');

    // Should contain our custom colors
    expect(panelParam).toContain('m1cr'); // main-side1 with crimson-red
    expect(panelParam).toContain('l4gy'); // lid-top1 with gold-yellow

    // Should also contain default colors for other panels
    expect(panelParam).toContain('cb'); // carbon-black (default for 3dp)
  });

  test('should update URL when selecting series for 10BOX', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Select 10BOX Lite
    await page.selectOption('select', '10box-lite');
    await expect(page.locator('svg').first()).toBeVisible({ timeout: 5000 });

    // Select a series (e.g., KuroBeni)
    await page.locator('button:has-text("KuroBeni")').click();

    // Wait a moment for URL to update
    await page.waitForTimeout(500);

    // URL should contain panel colors
    const url = page.url();
    expect(url).toContain('c=9');
    expect(url).toContain('p=');

    // The encoded panels should include both carbon-black and crimson-red
    const urlObj = new URL(url);
    const panelParam = urlObj.searchParams.get('p');
    expect(panelParam).toContain('cb'); // carbon-black
    expect(panelParam).toContain('cr'); // crimson-red
  });
});

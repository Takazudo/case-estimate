import { test, expect } from '@playwright/test';

test.describe('Color Selection Bug - Double Click Required', () => {
  test('should update panel color on FIRST click, not requiring double click', async ({ page }) => {
    // Navigate to a URL with サイド1 already set to イエロー (y)
    // Using c=3b (zudo-block-60-ACR-B), p=1y.2y (side1=yellow, side2=yellow)
    await page.goto('/m?c=3b&p=1y.2y', {
      waitUntil: 'networkidle',
    });

    // Wait for the page to load - look for the panel list
    await page.waitForSelector('button:has-text("サイド1")', { timeout: 10000 });

    // Store the initial URL to verify it changes
    const initialUrl = page.url();
    expect(initialUrl).toContain('1y'); // サイド1 is yellow

    // Click on サイド1 panel from the panel list (right column)
    await page.click('button:has-text("サイド1")');

    // Wait for the color modal to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Check the URL before clicking color
    const urlBeforeColorSelect = page.url();
    console.log('URL before color selection:', urlBeforeColorSelect);

    // Click on クリア (clear) color in the modal
    await page.click('[role="dialog"] button:has-text("クリア")');

    // Give it a moment for the URL to update
    await page.waitForTimeout(500);

    // Check the URL after clicking color
    const urlAfterColorSelect = page.url();
    console.log('URL after color selection:', urlAfterColorSelect);

    // Wait for modal to close (with increased timeout)
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });

    // CRITICAL: The URL should update immediately on the FIRST click
    // It should change from 1y (yellow) to 1c (clear)
    await expect(page).toHaveURL(/1c/, { timeout: 1000 });

    // The URL should NOT still contain 1y
    const updatedUrl = page.url();
    expect(updatedUrl).not.toContain('1y');
    expect(updatedUrl).toContain('1c');
  });

  test('should work correctly from SVG panel click as well', async ({ page }) => {
    // Navigate to a URL with a panel set to orange (o)
    // c=3b (zudo-block-60-ACR-B), p=1o.2o (side1=orange, side2=orange)
    await page.goto('/m?c=3b&p=1o.2o', {
      waitUntil: 'networkidle',
    });

    // Wait for page to load - look for a panel button
    await page.waitForSelector('button:has-text("サイド1")', { timeout: 10000 });

    // Click directly on the SVG panel (using the button with aria-label)
    await page.click('button[aria-label="Select サイド1"]');

    // Wait for modal to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Select yellow color (force click to avoid image interception)
    await page.click('[role="dialog"] button:has-text("イエロー")', { force: true });

    // Wait a moment for URL to update
    await page.waitForTimeout(500);

    // URL should update immediately from 1o to 1y
    await expect(page).toHaveURL(/1y/, { timeout: 1000 });
    const url = page.url();
    expect(url).not.toContain('1o');
    expect(url).toContain('1y');
  });

  test('should work correctly from color preview thumbnails', async ({ page }) => {
    // c=3b (zudo-block-60-ACR-B), p=1y.2y (side1=yellow, side2=yellow)
    await page.goto('/m?c=3b&p=1y.2y', {
      waitUntil: 'networkidle',
    });

    // Wait for page to load
    await page.waitForSelector('button:has-text("カスタム")', { timeout: 10000 });

    // Switch to Custom tab first
    await page.click('button:has-text("カスタム")');

    // Wait for custom tab content to be visible
    await page.waitForTimeout(300);

    // Find and click on the color preview for サイド1
    // The CustomColorPreview component renders buttons for each panel
    await page.click('button[aria-label="Select サイド1"]');

    // Wait for modal
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Select orange color (force click to avoid image interception)
    await page.click('[role="dialog"] button:has-text("オレンジ")', { force: true });

    // Wait a moment for URL to update
    await page.waitForTimeout(500);

    // URL should update immediately from 1y to 1o
    await expect(page).toHaveURL(/1o/, { timeout: 1000 });
  });
});

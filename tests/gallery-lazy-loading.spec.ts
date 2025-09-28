import { test, expect } from '@playwright/test';

test.describe('Gallery Lazy Loading', () => {
  test('should only load visible images initially', async ({ page }) => {
    // Track network requests to images
    const imageRequests: string[] = [];

    await page.route('https://takazudomodular.com/images/p/**/*.webp', async (route) => {
      const url = route.request().url();
      imageRequests.push(url);
      await route.continue();
    });

    // Navigate to gallery
    await page.goto('/gallery');

    // Wait for initial load to complete
    await page.waitForTimeout(2000);

    // Count how many images were requested initially
    const initialRequestCount = imageRequests.length;

    console.log(`Initial image requests: ${initialRequestCount}`);

    // Should be much less than 227 (total images)
    // Typically 12-30 depending on viewport size
    expect(initialRequestCount).toBeLessThan(50);
    expect(initialRequestCount).toBeGreaterThan(0);

    // Now scroll down
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(1000);

    // More images should have been requested
    const afterScrollCount = imageRequests.length;
    expect(afterScrollCount).toBeGreaterThan(initialRequestCount);

    console.log(`After scroll: ${afterScrollCount} total requests`);
  });

  test('blurhash should be visible for all items immediately', async ({ page }) => {
    await page.goto('/gallery');

    // Count all canvas elements (from Blurhash components)
    const canvasCount = await page.locator('canvas').count();

    // Should have canvases for all items with blurhash
    // Even those not in viewport yet
    expect(canvasCount).toBeGreaterThan(200);

    console.log(`Found ${canvasCount} blurhash canvases on initial load`);

    // Check that even items far down the page have blurhash
    const lastThumbnail = page.locator('[data-testid="gallery-thumbnail"]').last();
    await lastThumbnail.scrollIntoViewIfNeeded();

    // The last item should have a canvas (blurhash)
    const lastCanvas = lastThumbnail.locator('canvas');
    await expect(lastCanvas).toBeVisible();
  });
});

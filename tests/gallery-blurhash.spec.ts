import { test, expect } from '@playwright/test';

test.describe('Gallery Blurhash Loading', () => {
  test('should show blurhash placeholders immediately on page load', async ({ page }) => {
    // Navigate to gallery
    await page.goto('/gallery');

    // Wait for the gallery grid to be visible
    await page.waitForSelector('[data-testid="gallery-thumbnail-grid"]');

    // Check that canvas elements (from Blurhash component) are present immediately
    // The Blurhash component renders a canvas element
    const canvases = await page.locator('[data-testid="gallery-thumbnail"] canvas').count();

    // We should have multiple canvas elements (one for each thumbnail with blurhash)
    expect(canvases).toBeGreaterThan(0);

    // Verify that the canvases are visible (not hidden or with 0 opacity)
    const firstCanvas = page.locator('[data-testid="gallery-thumbnail"] canvas').first();
    await expect(firstCanvas).toBeVisible();

    // Check that the canvas has proper dimensions (not 0x0)
    const canvasSize = await firstCanvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));

    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);
  });

  test('should show blurhash in dialog immediately when opened', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for the client-only GalleryDialogHost island to be attached before interacting
    await page.waitForSelector('[data-zfb-island-skip-ssr="GalleryDialogHost"]', {
      state: 'attached',
      timeout: 15000,
    });

    // Click on the first thumbnail
    const firstThumbnail = page.locator('[data-testid="gallery-thumbnail"]').first();
    await firstThumbnail.click();

    // Wait for dialog to appear
    await page.waitForSelector('[data-testid="gallery-dialog"]');

    // Check that canvas element is present in the dialog (from Blurhash component)
    const dialogCanvas = page.locator('[data-testid="gallery-dialog"] canvas');

    // Canvas should be visible immediately
    await expect(dialogCanvas).toBeVisible({ timeout: 1000 });

    // Verify canvas has proper dimensions
    const canvasSize = await dialogCanvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));

    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);
  });

  test('blurhash should remain visible until image loads', async ({ page }) => {
    // Intercept image requests to delay them
    await page.route('**/*.webp', async (route) => {
      // Add a 2 second delay before fulfilling the request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.goto('/gallery');

    // Canvas should be visible immediately
    const firstThumbnail = page.locator('[data-testid="gallery-thumbnail"]').first();
    const canvas = firstThumbnail.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 1000 });

    // Image should have opacity 0 initially (while loading)
    const image = firstThumbnail.locator('img');
    const initialOpacity = await image.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(initialOpacity)).toBe(0);

    // Wait for image to load
    await page.waitForTimeout(2500);

    // After loading, image should have opacity 1
    const finalOpacity = await image.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(finalOpacity)).toBe(1);
  });
});

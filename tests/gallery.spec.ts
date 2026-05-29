import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { galleryData } from '../data/gallery-data';

const PLACEHOLDER_WEBP = Buffer.from(
  'UklGRiIAAABXRUJQVlA4ICAAAACQAgCdASoCAAIALmk0mk0iIiIiAgAgAA==',
  'base64',
);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(`
    (function () {
      var OriginalObserver = window.IntersectionObserver;

      function ImmediateIntersectionObserver(callback) {
        this._callback = callback;
      }

      ImmediateIntersectionObserver.prototype.observe = function (target) {
        var rect = target.getBoundingClientRect();
        var entry = {
          isIntersecting: true,
          target: target,
          intersectionRatio: 1,
          time: Date.now(),
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: null,
        };
        this._callback([entry], this);
      };

      ImmediateIntersectionObserver.prototype.unobserve = function () {};
      ImmediateIntersectionObserver.prototype.disconnect = function () {};
      ImmediateIntersectionObserver.prototype.takeRecords = function () {
        return [];
      };

      Object.defineProperty(window, 'IntersectionObserver', {
        configurable: true,
        writable: true,
        value: ImmediateIntersectionObserver,
      });

      if (OriginalObserver) {
        Object.defineProperty(window, 'IntersectionObserverEntry', {
          configurable: true,
          writable: true,
          value: OriginalObserver.prototype?.constructor || function () {},
        });
      }
    })();
  `);

  await page.route('https://takazudomodular.com/images/p/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/webp',
      body: PLACEHOLDER_WEBP,
    });
  });
});

const openFirstGalleryItem = async (page: Page) => {
  await page.goto('/gallery');
  await page.waitForSelector('[data-testid="gallery-thumbnail"]');

  // Wait for the client-only GalleryDialogHost island to be attached before interacting
  await page.waitForSelector('[data-zfb-island-skip-ssr="GalleryDialogHost"]', {
    state: 'attached',
    timeout: 15000,
  });

  const thumbnails = page.locator('[data-testid="gallery-thumbnail"]');
  const firstThumbnail = thumbnails.first();
  const slug = await firstThumbnail.getAttribute('data-slug');

  await firstThumbnail.scrollIntoViewIfNeeded();

  await Promise.all([
    page.waitForSelector('[data-testid="gallery-dialog"]', { state: 'visible' }),
    firstThumbnail.click(),
  ]);

  return { slug };
};

const waitForDialogVisible = async (page: Page) => {
  // Wait for the client-only GalleryDialogHost island to be attached before checking dialog state
  await page.waitForSelector('[data-zfb-island-skip-ssr="GalleryDialogHost"]', {
    state: 'attached',
    timeout: 15000,
  });
  await page
    .locator('[data-testid="gallery-dialog"]')
    .waitFor({ state: 'visible', timeout: 10000 });
};

const waitForDialogHidden = (page: Page) =>
  page.locator('[data-testid="gallery-dialog"]').waitFor({ state: 'hidden', timeout: 10000 });

test.describe('Gallery Page', () => {
  test('should load the gallery page', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the gallery
    const response = await page.goto('/gallery');

    // Check that the page loads successfully (not 404 or 500)
    expect(response?.status()).toBeLessThan(400);

    // Check that the header is visible
    await expect(page.getByRole('link', { name: /Takazudo Modular: Panels/i })).toBeVisible();

    // Check that thumbnail grid is visible
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();

    // Check that at least the first thumbnail becomes visible
    const thumbnails = page.locator('[data-testid="gallery-thumbnail"]');
    const firstThumbnail = thumbnails.first();
    await firstThumbnail.scrollIntoViewIfNeeded();
    await expect(firstThumbnail).toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should display thumbnails in a grid layout', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for thumbnails to load
    await page.waitForSelector('[data-testid="gallery-thumbnail"]');

    // Check that thumbnails are displayed
    const thumbnails = page.locator('[data-testid="gallery-thumbnail"]');
    const count = await thumbnails.count();

    expect(count).toBe(galleryData.length);

    // Spot check the first thumbnail has a valid slug to confirm dataset wiring
    const firstThumbnail = thumbnails.first();
    await firstThumbnail.scrollIntoViewIfNeeded();
    const firstSlug = await firstThumbnail.getAttribute('data-slug');
    expect(firstSlug).toBe(galleryData[0].slug);
  });

  test('should open dialog when clicking thumbnail', async ({ page }) => {
    const { slug } = await openFirstGalleryItem(page);

    await waitForDialogVisible(page);

    const dialog = page.locator('[data-testid="gallery-dialog"]');

    // Check that enlarged image is displayed
    const enlargedImage = dialog.locator('img');

    await expect(enlargedImage).toHaveAttribute(
      'src',
      /https:\/\/takazudomodular\.com\/images\/p\/.+\/2000w\.webp/,
      { timeout: 10000 },
    );

    // Check that close button is visible
    await expect(page.locator('[data-testid="gallery-dialog-close"]')).toBeVisible();

    if (slug) {
      await expect(page).toHaveURL(new RegExp(`id=${slug}`));
    }
  });

  test('should update URL when opening dialog', async ({ page }) => {
    const { slug } = await openFirstGalleryItem(page);

    // Check URL contains the image ID
    const url = page.url();
    if (slug) {
      expect(url).toContain(`/gallery?id=${slug}`);
    }
  });

  test('should navigate with prev/next buttons', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Check that both prev and next buttons are visible (middle item)
    await expect(page.locator('[data-testid="gallery-dialog-prev"]')).toBeVisible();
    await expect(page.locator('[data-testid="gallery-dialog-next"]')).toBeVisible();

    // Click next button
    await page.locator('[data-testid="gallery-dialog-next"]').click();

    // Wait for URL to update
    await page.waitForFunction(() =>
      window.location.search.includes('id=panels-gallery-zudo-blocks-026'),
    );

    // Check URL updated
    expect(page.url()).toContain('id=panels-gallery-zudo-blocks-026');

    // Click prev button
    await page.locator('[data-testid="gallery-dialog-prev"]').click();

    // Wait for URL to update back
    await page.waitForFunction(() =>
      window.location.search.includes('id=panels-gallery-zudo-blocks-025'),
    );

    // Check URL updated back
    expect(page.url()).toContain('id=panels-gallery-zudo-blocks-025');
  });

  test('should hide prev button on first item', async ({ page }) => {
    await page.goto('/gallery?id=panel-variations');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Prev button should not be visible
    await expect(page.locator('[data-testid="gallery-dialog-prev"]')).not.toBeVisible();

    // Next button should be visible
    await expect(page.locator('[data-testid="gallery-dialog-next"]')).toBeVisible();
  });

  test('should hide next button on last item', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-093');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Prev button should be visible
    await expect(page.locator('[data-testid="gallery-dialog-prev"]')).toBeVisible();

    // Next button should not be visible
    await expect(page.locator('[data-testid="gallery-dialog-next"]')).not.toBeVisible();
  });

  test('should close dialog when clicking close button', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Click close button
    await page.locator('[data-testid="gallery-dialog-close"]').click();

    // Wait for URL update first, then confirm dialog hidden
    await page.waitForFunction(() => !window.location.search.includes('id='));
    await waitForDialogHidden(page);
    expect(page.url()).toBe('http://localhost:3200/gallery');
  });

  test('closing dialog from grid should not reopen when navigating back', async ({ page }) => {
    await openFirstGalleryItem(page);

    await page.locator('[data-testid="gallery-dialog-close"]').click();
    await page.waitForFunction(() => !window.location.search.includes('id='));
    await waitForDialogHidden(page);

    await page.goBack();

    await expect(page.locator('[data-testid="gallery-dialog"]')).not.toBeVisible();
    expect(page.url()).toBe('http://localhost:3200/gallery');
  });

  test('should close dialog when pressing ESC key', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Press ESC key
    await page.keyboard.press('Escape');

    // URL should be updated
    await page.waitForFunction(() => !window.location.search.includes('id='));

    // Dialog should be hidden
    await waitForDialogHidden(page);
    expect(page.url()).toBe('http://localhost:3200/gallery');
  });

  test('should navigate with keyboard arrow keys', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Press right arrow key
    await page.keyboard.press('ArrowRight');

    // Wait for URL to update
    await page.waitForFunction(() =>
      window.location.search.includes('id=panels-gallery-zudo-blocks-026'),
    );

    // Check URL updated
    expect(page.url()).toContain('id=panels-gallery-zudo-blocks-026');

    // Press left arrow key
    await page.keyboard.press('ArrowLeft');

    // Wait for URL to update back
    await page.waitForFunction(() =>
      window.location.search.includes('id=panels-gallery-zudo-blocks-025'),
    );

    // Check URL updated back
    expect(page.url()).toContain('id=panels-gallery-zudo-blocks-025');
  });

  test('should handle direct URL access to specific image', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate directly to a specific image
    const response = await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Check that the page loads successfully
    expect(response?.status()).toBeLessThan(400);

    // Dialog should be immediately visible
    await waitForDialogVisible(page);

    // The correct image should be displayed
    const enlargedImage = page.locator('[data-testid="gallery-dialog"] img');
    await expect(enlargedImage).toHaveAttribute(
      'src',
      'https://takazudomodular.com/images/p/panels-gallery-zudo-blocks-025/2000w.webp',
    );

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should handle invalid image ID gracefully', async ({ page }) => {
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to gallery with invalid ID
    await page.goto('/gallery?id=non-existent-image');

    // Wait for the client-only GalleryDialogHost island to be attached
    // (ensures the not.toBeVisible assertion below is a real check, not a trivial pass)
    await page.waitForSelector('[data-zfb-island-skip-ssr="GalleryDialogHost"]', {
      state: 'attached',
      timeout: 15000,
    });

    // Should show gallery page without dialog
    await expect(page.locator('[data-testid="gallery-thumbnail-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="gallery-dialog"]')).not.toBeVisible();

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should close dialog when clicking outside', async ({ page }) => {
    await page.goto('/gallery?id=panels-gallery-zudo-blocks-025');

    // Wait for dialog to be visible
    await waitForDialogVisible(page);

    // Click on the backdrop/overlay at a safe coordinate
    await page.evaluate(() => {
      const backdrop = document.querySelector('[data-testid="gallery-dialog-backdrop"]');
      if (!backdrop) throw new Error('Backdrop not found');
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX: 1,
        clientY: 1,
      });
      backdrop.dispatchEvent(event);
    });

    // Wait for URL change then ensure dialog hidden
    await page.waitForFunction(() => !window.location.search.includes('id='));
    await waitForDialogHidden(page);
    expect(page.url()).toBe('http://localhost:3200/gallery');
  });
});

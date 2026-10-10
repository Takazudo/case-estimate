import { test, expect } from '@playwright/test';

// Acceptance flows added for the owned-runtime migration. Existing stale specs
// and their assertions remain unchanged so baseline failures stay visible.
test('panel edit, URL reload and order text preserve manufacturing choices', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/m/?c=1a');
  await expect(page.locator('[data-panel-id="side1"]')).toBeVisible();
  await page.getByRole('button', { name: /^サイド1\s*レッド$/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('button', { name: /^オーシャンブルー/ })
    .first()
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: /^サイド1\s*オーシャンブルー$/ })).toBeVisible();
  const url = page.url();
  await page.reload();
  await expect(page.getByRole('button', { name: /^サイド1\s*オーシャンブルー$/ })).toBeVisible();
  await page.getByRole('button', { name: 'オーダー情報を表示' }).click();
  await expect(dialog).toContainText('サイド1: オーシャンブルー');
  await expect(dialog).toContainText('サイド2: レッド');
  await expect(dialog).toContainText('カスタム');
  await expect(dialog).toContainText(url);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'オーダー情報を表示' })).toBeFocused();
  expect(errors).toEqual([]);
});

test('background sliders update persisted live state', async ({ page }) => {
  await page.goto('/m/?c=1a');
  await expect(page.locator('[data-panel-id="side1"]')).toBeVisible();
  await page.getByTitle('Adjust background colors').click();
  const range = page.locator('input[type="range"]').last();
  await range.fill('128');
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('takazudo_bg_color')))
    .toBe('#808080');
  await page.reload();
  await page.getByTitle('Adjust background colors').click();
  await expect(page.locator('input[type="range"]').last()).toHaveValue('128');
});

test('gallery dialog handles next, history back, Escape and focus restoration', async ({
  page,
}) => {
  await page.goto('/gallery/');
  const thumbnail = page.getByTestId('gallery-thumbnail').first();
  await thumbnail.click();
  const dialog = page.getByTestId('gallery-dialog');
  await expect(dialog).toBeVisible();
  const opened = page.url();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.url()).not.toBe(opened);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(thumbnail).toBeFocused();
  await thumbnail.click();
  await expect(dialog).toBeVisible();
  await page.goBack();
  await expect(dialog).not.toBeVisible();
});

test('standalone builder hides chrome while mobile navigation remains usable on content pages', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
  await page.goto('/m/?c=1a');
  await expect(page.locator('[data-panel-id="side1"]')).toBeVisible();
  await expect(page.getByRole('banner')).not.toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await page.getByRole('button', { name: /Toggle menu|Open menu/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Toggle menu|Open menu/ })).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

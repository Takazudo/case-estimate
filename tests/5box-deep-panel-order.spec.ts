import { test, expect } from '@playwright/test';

/**
 * 5BOX-deep-3DP Panel Order Test
 *
 * Verifies that the fixed SVG (with corrected side panel rotation) works correctly.
 * This test ensures that clicking on panels selects the correct panel,
 * particularly for the two side panels that were previously rotated 180 degrees:
 * - メイン: サイド1 (main-side1)
 * - メイン: サイド2 (main-bottom2)
 *
 * Expected panel order (same as shallow):
 * Panel 1: メイン: サイド1
 * Panel 2: メイン: バック
 * Panel 3: メイン: ボトム
 * Panel 4: メイン: フロント
 * Panel 5: メイン: サイド2
 * Panel 6: フタ: サイド1
 * Panel 7: フタ: バック
 * Panel 8: フタ: トップ1
 * Panel 9: フタ: トップ2
 * Panel 10: フタ: フロント
 * Panel 11: フタ: サイド2
 */

test.describe('5BOX-deep-3DP Panel Order (Fixed SVG)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to 5box-deep-3dp with all panels in different colors
    // c=fb (5box-deep-3dp)
    // Using diverse colors to make each panel visually distinct
    await page.goto('/m?c=fb&p=m1bw.m2rg.m5cb.m6lo.m7ib.m8bg.l1sg.l2sw.l7p.l8cr.l6g', {
      waitUntil: 'networkidle',
    });

    // Wait for the builder to load
    await page.waitForSelector('button:has-text("メイン: サイド1")', {
      timeout: 10000,
    });
  });

  test('should have all 11 panels in correct order', async ({ page }) => {
    // Get all panel buttons in the order they appear
    const panelButtons = await page
      .locator('button:has-text("メイン:"), button:has-text("フタ:")')
      .all();

    // Should have exactly 11 panels
    expect(panelButtons.length).toBe(11);

    // Verify the order matches the expected panel names
    const expectedPanels = [
      'メイン: サイド1',
      'メイン: バック',
      'メイン: ボトム',
      'メイン: フロント',
      'メイン: サイド2',
      'フタ: サイド1',
      'フタ: バック',
      'フタ: トップ1',
      'フタ: トップ2',
      'フタ: フロント',
      'フタ: サイド2',
    ];

    for (let i = 0; i < expectedPanels.length; i++) {
      const buttonText = await panelButtons[i].textContent();
      expect(buttonText).toContain(expectedPanels[i]);
    }
  });

  test('should select メイン: サイド1 (previously rotated panel)', async ({ page }) => {
    // Click on panel from list
    await page.click('button:has-text("メイン: サイド1")');

    // Modal should open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Verify modal title shows it's for color selection
    await expect(page.locator('[role="dialog"] h2:has-text("カラー選択")')).toBeVisible();

    // Select a new color to verify this panel is actually being modified
    await page.click('[role="dialog"] button:has-text("クリムゾンレッド")', {
      force: true,
    });

    // Wait for URL to update
    await page.waitForTimeout(500);

    // Close modal
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify that メイン: サイド1 now shows クリムゾンレッド (verifies actual state change)
    const panelButton = page.locator('button:has-text("メイン: サイド1")');
    await expect(panelButton).toContainText('クリムゾンレッド');
  });

  test('should select メイン: サイド2 (previously rotated panel)', async ({ page }) => {
    // Click on panel from list
    await page.click('button:has-text("メイン: サイド2")');

    // Modal should open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Verify modal title shows it's for color selection
    await expect(page.locator('[role="dialog"] h2:has-text("カラー選択")')).toBeVisible();

    // Select a new color to verify this panel is actually being modified
    await page.click('[role="dialog"] button:has-text("グリーン")', {
      force: true,
    });

    // Wait for URL to update
    await page.waitForTimeout(500);

    // Close modal
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify that メイン: サイド2 now shows グリーン (verifies actual state change)
    const panelButton = page.locator('button:has-text("メイン: サイド2")');
    await expect(panelButton).toContainText('グリーン');
  });

  test('should select correct panel when clicking SVG', async ({ page }) => {
    // Click on SVG panel for メイン: サイド1
    const svgButtons = await page.locator('button[aria-label^="Select"]').all();

    // Click the first one (should be メイン: サイド1)
    await svgButtons[0].click();

    // Wait for modal to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Select a distinct color to verify which panel was selected
    await page.click('[role="dialog"] button:has-text("クリムゾンレッド")', {
      force: true,
    });

    // Wait for URL to update
    await page.waitForTimeout(500);

    // Close modal
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify that メイン: サイド1 now shows クリムゾンレッド
    const panelButton = page.locator('button:has-text("メイン: サイド1")');
    await expect(panelButton).toContainText('クリムゾンレッド');
  });

  test('should maintain visual consistency after panel color changes', async ({ page }) => {
    // Change color of メイン: サイド1 (previously rotated)
    await page.click('button:has-text("メイン: サイド1")');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.click('[role="dialog"] button:has-text("ボーンホワイト")', {
      force: true,
    });
    await page.waitForTimeout(300);
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Change color of メイン: サイド2 (previously rotated)
    await page.click('button:has-text("メイン: サイド2")');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.click('[role="dialog"] button:has-text("グリーン")', {
      force: true,
    });
    await page.waitForTimeout(300);
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify panel buttons show updated colors
    const panelButtons = await page
      .locator('button:has-text("メイン:"), button:has-text("フタ:")')
      .all();

    const firstPanelText = await panelButtons[0].textContent();
    const fifthPanelText = await panelButtons[4].textContent();

    expect(firstPanelText).toContain('メイン: サイド1');
    expect(firstPanelText).toContain('ボーンホワイト');
    expect(fifthPanelText).toContain('メイン: サイド2');
    expect(fifthPanelText).toContain('グリーン');
  });
});

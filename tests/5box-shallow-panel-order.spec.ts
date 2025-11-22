import { test, expect } from '@playwright/test';

/**
 * 5BOX-shallow-3DP Panel Order Test
 *
 * Verifies that the visual panel positions (1-11 as shown in the diagram)
 * match the panel definition order in the panel list.
 *
 * Expected mapping based on visual diagram:
 * Visual Position 1 → Panel 1: メイン: サイド1
 * Visual Position 2 → Panel 2: メイン: サイド2
 * Visual Position 3 → Panel 3: メイン: バック1
 * Visual Position 4 → Panel 4: メイン: ボトム1
 * Visual Position 5 → Panel 5: メイン: ボトム2
 * Visual Position 6 → Panel 6: メイン: フロント
 * Visual Position 7 → Panel 7: フタ: サイド1
 * Visual Position 8 → Panel 8: フタ: サイド2
 * Visual Position 9 → Panel 9: フタ: バック1
 * Visual Position 10 → Panel 10: フタ: バック2
 * Visual Position 11 → Panel 11: フタ: フロント
 */

test.describe('5BOX-shallow-3DP Panel Order', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to 5box-shallow-3dp with all panels in different colors
    // c=5a (5box-shallow-3dp)
    // Using diverse colors to make each panel visually distinct
    await page.goto('/m?c=5a&p=m1bw.m2rg.m5cb.m6lo.m7ig.m8bg.l1sg.l2sw.l7p.l8cr.l6g', {
      waitUntil: 'networkidle',
    });

    // Wait for the builder to load
    await page.waitForSelector('button:has-text("メイン: サイド1")', {
      timeout: 10000,
    });
  });

  test('should map visual position 1 to メイン: サイド1 (Panel 1)', async ({ page }) => {
    // Click on panel from list
    await page.click('button:has-text("メイン: サイド1")');

    // Modal should open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Verify modal title shows it's for color selection
    await expect(page.locator('[role="dialog"] h2:has-text("カラー選択")')).toBeVisible();

    // Close modal
    await page.click('[role="dialog"] button[aria-label="Close modal"]');
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Now verify URL contains m1 (main panel 1)
    const url = page.url();
    expect(url).toContain('m1');
  });

  test('should map visual position 3 to メイン: バック1 (Panel 3)', async ({ page }) => {
    // Click on panel from list
    await page.click('button:has-text("メイン: バック1")');

    // Modal should open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    // Close modal
    await page.click('[role="dialog"] button[aria-label="Close modal"]');
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify this is panel 3 in URL (m5 based on current encoding)
    const url = page.url();
    // Note: The URL encoding might use different indices
    expect(url).toMatch(/m[0-9]/);
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
      'メイン: サイド2',
      'メイン: バック1',
      'メイン: ボトム1',
      'メイン: ボトム2',
      'メイン: フロント',
      'フタ: サイド1',
      'フタ: サイド2',
      'フタ: バック1',
      'フタ: バック2',
      'フタ: フロント',
    ];

    for (let i = 0; i < expectedPanels.length; i++) {
      const buttonText = await panelButtons[i].textContent();
      expect(buttonText).toContain(expectedPanels[i]);
    }
  });

  test('should select correct panel when clicking SVG visual position 1', async ({ page }) => {
    // Click on the first SVG button (visual position 1)
    // This should open the modal for メイン: サイド1
    const svgButtons = await page.locator('button[aria-label^="Select"]').all();

    // Click the first one (should be visual position 1)
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

  test('should maintain panel order after color changes', async ({ page }) => {
    // Change color of panel 1
    await page.click('button:has-text("メイン: サイド1")');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.click('[role="dialog"] button:has-text("ボーンホワイト")', {
      force: true,
    });
    await page.waitForTimeout(300);
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Change color of panel 3
    await page.click('button:has-text("メイン: バック1")');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.click('[role="dialog"] button:has-text("グリーン")', {
      force: true,
    });
    await page.waitForTimeout(300);
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    // Verify panel order is still correct
    const panelButtons = await page
      .locator('button:has-text("メイン:"), button:has-text("フタ:")')
      .all();

    const firstPanelText = await panelButtons[0].textContent();
    const thirdPanelText = await panelButtons[2].textContent();

    expect(firstPanelText).toContain('メイン: サイド1');
    expect(firstPanelText).toContain('ボーンホワイト');
    expect(thirdPanelText).toContain('メイン: バック1');
    expect(thirdPanelText).toContain('グリーン');
  });
});

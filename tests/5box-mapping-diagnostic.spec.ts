import { test } from '@playwright/test';

/**
 * Diagnostic test to discover the actual SVG path to panel mapping
 * for 5box-shallow-3dp
 */

test.describe('5BOX Mapping Diagnostic', () => {
  test('discover SVG button to panel name mapping', async ({ page }) => {
    // Start with all black panels
    await page.goto('/m?c=5a', {
      waitUntil: 'networkidle',
    });

    // Wait for the builder to load
    await page.waitForSelector('button:has-text("メイン: サイド1")', {
      timeout: 10000,
    });

    // Get all SVG panel buttons (the invisible buttons overlaying the SVG)
    const svgButtons = await page.locator('button[aria-label^="Select"]').all();

    console.log(`\nFound ${svgButtons.length} SVG buttons\n`);

    // Click each SVG button and record which panel it selects
    for (let i = 0; i < svgButtons.length; i++) {
      const ariaLabel = await svgButtons[i].getAttribute('aria-label');
      console.log(`SVG Button ${i + 1}: ${ariaLabel}`);

      // Click the button
      await svgButtons[i].click();

      // Wait for modal
      await page.waitForSelector('[role="dialog"]', {
        state: 'visible',
        timeout: 2000,
      });

      // Select a unique color for this position
      const colors = [
        'ボーンホワイト', // 1: Bone White
        'クリアブルー', // 2: Clear Blue
        'クリアレッド', // 3: Clear Red
        'クリムゾンレッド', // 4: Crimson Red
        'ダークオレンジ', // 5: Dark Orange
        'ライトオレンジ', // 6: Light Orange
        'ディープイエロー', // 7: Deep Yellow
        'ブライトゴールド', // 8: Bright Gold
        'ディープゴールド', // 9: Deep Gold
        'インディゴブルー', // 10: Indigo Blue
        'グリーン', // 11: Green
      ];

      await page.click(`[role="dialog"] button:has-text("${colors[i]}")`, {
        force: true,
      });

      // Wait for modal to close
      await page.waitForTimeout(500);
      await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

      // Check which panel now has this color
      const panelButtons = await page
        .locator('button:has-text("メイン:"), button:has-text("フタ:")')
        .all();

      for (let j = 0; j < panelButtons.length; j++) {
        const panelText = await panelButtons[j].textContent();
        if (panelText?.includes(colors[i])) {
          console.log(`  -> Maps to Panel ${j + 1}: ${panelText?.split('\n')[0]}`);
          break;
        }
      }
    }

    // Get final URL to see the panel encoding
    const url = page.url();
    console.log(`\nFinal URL: ${url}\n`);

    // List all panels in order with their assigned colors
    console.log('\nFinal Panel List Order:');
    const finalPanels = await page
      .locator('button:has-text("メイン:"), button:has-text("フタ:")')
      .all();

    for (let i = 0; i < finalPanels.length; i++) {
      const text = await finalPanels[i].textContent();
      console.log(`Panel ${i + 1}: ${text?.replace(/\s+/g, ' ').trim()}`);
    }
  });
});

import { test, expect } from '@playwright/test';
import { getExpectedColorValue, rgbToHex, colorsMatch } from './helpers/color-mappings';

/**
 * E2E tests to verify panel color mapping between URL parameters and SVG rendering
 *
 * These tests ensure that:
 * 1. URL parameters correctly control panel colors
 * 2. The correct panels are affected (no cross-panel bugs)
 * 3. Color encoding/decoding works correctly
 * 4. Panel mappings are accurate for all model types
 */

test.describe('Builder: Panel Color Mapping Verification', () => {
  /**
   * Helper function to navigate and wait for app to be ready
   */
  async function navigateAndWait(page: any, url: string) {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    // Wait for React hydration and SVG to be fully rendered with data-panel-id attributes
    await page.waitForSelector('[data-panel-id]', { timeout: 15000 });
  }

  /**
   * Helper function to verify panel color matches expected value
   */
  async function verifyPanelColor(
    page: any,
    panelId: string,
    expectedColorCode: string,
    testContext: string,
  ) {
    const expectedValue = getExpectedColorValue(expectedColorCode);
    if (!expectedValue) {
      throw new Error(`Unknown color code: ${expectedColorCode}`);
    }

    const panel = page.locator(`[data-panel-id="${panelId}"]`);
    await expect(panel, `${testContext}: Panel ${panelId} should exist`).toBeVisible({
      timeout: 10000,
    });

    // Wait a bit for colors to be applied (SVG rendering has a delay)
    await page.waitForTimeout(200);

    // Get the computed fill style
    const fillValue = await panel.evaluate((el: Element) => {
      const computed = getComputedStyle(el as HTMLElement);
      // Check both fill and style.fill
      return computed.fill || (el as HTMLElement).style.fill;
    });

    const actualHex = rgbToHex(fillValue);
    const matches = colorsMatch(actualHex, expectedValue);

    expect(
      matches,
      `${testContext}: Panel ${panelId} should have color ${expectedColorCode} (${expectedValue}), got ${actualHex}`,
    ).toBe(true);
  }

  test('Standard 8-panel model (zudo-block-40-3DP-A): Full panel color mapping', async ({
    page,
  }) => {
    // URL with all 8 panels having different colors
    // c=2a: zudo-block-40-3DP-A
    // p=1cb.2cr.3bg.4bw.5do.6lo.7dy.8dg
    const url = '/m?c=2a&p=1cb.2cr.3bg.4bw.5do.6lo.7dy.8dg';

    await navigateAndWait(page, url);

    // Expected mapping: panel number -> color code
    const expectedColors: { [panelId: string]: string } = {
      side1: 'cb', // Panel 1: carbon-black
      side2: 'cr', // Panel 2: crimson-red
      front1: 'bg', // Panel 3: bright-gold
      front2: 'bw', // Panel 4: bone-white
      bottom1: 'do', // Panel 5: dark-orange
      bottom2: 'lo', // Panel 6: light-orange
      back1: 'dy', // Panel 7: deep-yellow
      back2: 'dg', // Panel 8: deep-gold
    };

    // Verify each panel has the correct color
    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, 'Standard 8-panel');
    }
  });

  test('Standard 8-panel model: Partial panel colors (some panels default)', async ({ page }) => {
    // Only set colors for some panels, others should default to carbon-black
    const url = '/m?c=2a&p=1cr.3bg.7dy';

    await navigateAndWait(page, url);

    // Verify specified panels
    await verifyPanelColor(page, 'side1', 'cr', 'Partial colors');
    await verifyPanelColor(page, 'front1', 'bg', 'Partial colors');
    await verifyPanelColor(page, 'back1', 'dy', 'Partial colors');

    // Verify default panels (should be carbon-black or default color)
    // Note: We don't verify defaults in this test as they might vary
  });

  test('Standard 8-panel model: KuroBeni preset pattern', async ({ page }) => {
    // KuroBeni pattern: carbon-black + crimson-red alternating
    const url = '/m?c=2a&p=1cb.2cb.7cr.8cr.5cb.6cr.3cb.4cr';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      side1: 'cb',
      side2: 'cb',
      front1: 'cb',
      front2: 'cr',
      bottom1: 'cb',
      bottom2: 'cr',
      back1: 'cr',
      back2: 'cr',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, 'KuroBeni pattern');
    }
  });

  test('X2 12-panel model (zudo-block-40x2-3DP-A): Full panel mapping', async ({ page }) => {
    // URL with all 12 panels
    // c=6a: zudo-block-40x2-3DP-A
    const url = '/m?c=6a&p=1cb.2cr.9bg.abw.7do.8lo.5dy.6dg.bib.cg.3sg.4sw';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      side1: 'cb', // 1
      side2: 'cr', // 2
      side3: 'bg', // 9
      side4: 'bw', // a
      back1: 'do', // 7
      back2: 'lo', // 8
      bottom1: 'dy', // 5
      bottom2: 'dg', // 6
      bottom3: 'ib', // b
      bottom4: 'g', // c
      front1: 'sg', // 3
      front2: 'sw', // 4
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, 'X2 12-panel');
    }
  });

  test('10BOX Shallow model: Main body panels', async ({ page }) => {
    // Test 10BOX main body panels (m1-m8)
    const url = '/m?c=9a&p=m1cb.m2cr.m3bg.m4bw.m5do.m6lo.m7dy.m8dg';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      'main-side1': 'cb',
      'main-side2': 'cr',
      'main-side3': 'bg',
      'main-side4': 'bw',
      'main-back1': 'do',
      'main-bottom1': 'lo',
      'main-bottom2': 'dy',
      'main-front': 'dg',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, '10BOX main panels');
    }
  });

  test('10BOX Shallow model: Lid panels', async ({ page }) => {
    // Test 10BOX lid panels (l1-l6)
    const url = '/m?c=9a&p=l1cb.l2cr.l3bg.l4bw.l5do.l6lo';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      'lid-side1': 'cb',
      'lid-side2': 'cr',
      'lid-back': 'bg',
      'lid-top1': 'bw',
      'lid-top2': 'do',
      'lid-front': 'lo',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, '10BOX lid panels');
    }
  });

  test('10BOX Shallow model: Stand panels', async ({ page }) => {
    // Test 10BOX stand panels (sa1, sa2, ss1, ss2)
    const url = '/m?c=9a&p=sa1cb.sa2cr.ss1bg.ss2bw';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      'stand-angle1': 'cb',
      'stand-angle2': 'cr',
      'stand-support1': 'bg',
      'stand-support2': 'bw',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, '10BOX stand panels');
    }
  });

  test('10BOX Deep model: No stand panels (14 panels total)', async ({ page }) => {
    // Deep model has no stand panels, only main (8) + lid (6)
    const url = '/m?c=9b&p=m1cb.m2cr.m3bg.m4bw.m5do.m6lo.m7dy.m8dg.l1ib.l2g.l3sg.l4sw.l5pk.l6ca';

    await navigateAndWait(page, url);

    // Verify main panels
    const mainColors: { [panelId: string]: string } = {
      'main-side1': 'cb',
      'main-side2': 'cr',
      'main-side3': 'bg',
      'main-side4': 'bw',
      'main-back1': 'do',
      'main-bottom1': 'lo',
      'main-bottom2': 'dy',
      'main-front': 'dg',
    };

    const lidColors: { [panelId: string]: string } = {
      'lid-side1': 'ib',
      'lid-side2': 'g',
      'lid-back': 'sg',
      'lid-top1': 'sw',
      'lid-top2': 'pk',
      'lid-front': 'ca',
    };

    for (const [panelId, colorCode] of Object.entries(mainColors)) {
      await verifyPanelColor(page, panelId, colorCode, '10BOX Deep main panels');
    }

    for (const [panelId, colorCode] of Object.entries(lidColors)) {
      await verifyPanelColor(page, panelId, colorCode, '10BOX Deep lid panels');
    }

    // Verify stand panels don't exist
    const standPanel = page.locator('[data-panel-id="stand-angle1"]');
    await expect(standPanel).not.toBeVisible();
  });

  test('5BOX model: 11 panels (5 main + 6 lid)', async ({ page }) => {
    // 5BOX has 11 panels total
    const url = '/m?c=fa&p=m1cb.m2cr.m5bg.m6bw.m7do.m8lo.l1dy.l2dg.l7ib.l8g.l6sg';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      'main-side1': 'cb',
      'main-side2': 'cr',
      'main-back1': 'bg',
      'main-bottom1': 'bw',
      'main-bottom2': 'do',
      'main-front': 'lo',
      'lid-side1': 'dy',
      'lid-side2': 'dg',
      'lid-back1': 'ib',
      'lid-back2': 'g',
      'lid-front': 'sg',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, '5BOX panels');
    }
  });

  test('Pattern color: red-green-silk (special pattern fill)', async ({ page }) => {
    // Test pattern color rendering
    const url = '/m?c=2a&p=1rg.3cb';

    await navigateAndWait(page, url);

    // Verify pattern color
    await verifyPanelColor(page, 'side1', 'rg', 'Pattern color');
    await verifyPanelColor(page, 'front1', 'cb', 'Pattern color');
  });

  test('URL persistence: Colors remain after page reload', async ({ page }) => {
    const url = '/m?c=2a&p=1cb.2cr.3bg.4bw';

    // Initial load
    await navigateAndWait(page, url);

    // Verify initial colors
    await verifyPanelColor(page, 'side1', 'cb', 'Before reload');
    await verifyPanelColor(page, 'side2', 'cr', 'Before reload');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify colors persist after reload
    await verifyPanelColor(page, 'side1', 'cb', 'After reload');
    await verifyPanelColor(page, 'side2', 'cr', 'After reload');
    await verifyPanelColor(page, 'front1', 'bg', 'After reload');
    await verifyPanelColor(page, 'front2', 'bw', 'After reload');
  });

  test('Mixed colors: Same hex value, different opacity (crimson-red vs clear-red)', async ({
    page,
  }) => {
    // Both crimson-red (cr) and clear-red (rd) have hex #b71c1c
    // but different opacity (1.0 vs 0.6)
    const url = '/m?c=2a&p=1cr.2rd';

    await navigateAndWait(page, url);

    // Both should have the same fill hex value
    await verifyPanelColor(page, 'side1', 'cr', 'Opaque red');
    await verifyPanelColor(page, 'side2', 'rd', 'Semi-transparent red');

    // Verify opacity difference
    const crimsonPanel = page.locator('[data-panel-id="side1"]');
    const clearPanel = page.locator('[data-panel-id="side2"]');

    const crimsonOpacity = await crimsonPanel.evaluate(
      (el) => getComputedStyle(el as HTMLElement).fillOpacity,
    );
    const clearOpacity = await clearPanel.evaluate(
      (el) => getComputedStyle(el as HTMLElement).fillOpacity,
    );

    expect(parseFloat(crimsonOpacity)).toBeGreaterThan(parseFloat(clearOpacity));
  });

  test('Error prevention: Only specified panels should change color', async ({ page }) => {
    // Set color for only side1, verify other panels are NOT affected
    const url = '/m?c=2a&p=1cr';

    await navigateAndWait(page, url);

    // side1 should be crimson-red
    await verifyPanelColor(page, 'side1', 'cr', 'Specified panel');

    // Get colors of all other panels
    const otherPanels = ['side2', 'front1', 'front2', 'bottom1', 'bottom2', 'back1', 'back2'];

    for (const panelId of otherPanels) {
      const panel = page.locator(`[data-panel-id="${panelId}"]`);
      const fillValue = await panel.evaluate((el: Element) => {
        return getComputedStyle(el as HTMLElement).fill;
      });

      // None of these panels should be crimson-red
      const actualHex = rgbToHex(fillValue);
      expect(actualHex, `Panel ${panelId} should NOT be crimson-red (#b71c1c)`).not.toBe('#b71c1c');
    }
  });

  test('Open Frame Upgrade model: 6 panels with top panels', async ({ page }) => {
    // Open upgrade has back1, back2, bottom1, bottom2, top1, top2
    // Use 3DP variant (pu) instead of acrylic (ou) to test with 3DP colors
    const url = '/m?c=pu&p=7cb.8cr.5bg.6bw.t1do.t2lo';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      back1: 'cb',
      back2: 'cr',
      bottom1: 'bg',
      bottom2: 'bw',
      top1: 'do',
      top2: 'lo',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, 'Open Upgrade panels');
    }
  });

  test('Open Frame Basic model: 2 panels only', async ({ page }) => {
    // Basic open frame has only side1 and side2
    // Use 3DP variant (pa) instead of acrylic (oa) to test with 3DP colors
    const url = '/m?c=pa&p=1cb.2cr';

    await navigateAndWait(page, url);

    await verifyPanelColor(page, 'side1', 'cb', 'Open Basic side1');
    await verifyPanelColor(page, 'side2', 'cr', 'Open Basic side2');
  });

  test('Stand model: 4 panels (angle1, angle2, support1, support2)', async ({ page }) => {
    // Stand models have 4 panels
    const url = '/m?c=s4&p=n1cb.n2cr.p1bg.p2bw';

    await navigateAndWait(page, url);

    const expectedColors: { [panelId: string]: string } = {
      angle1: 'cb',
      angle2: 'cr',
      support1: 'bg',
      support2: 'bw',
    };

    for (const [panelId, colorCode] of Object.entries(expectedColors)) {
      await verifyPanelColor(page, panelId, colorCode, 'Stand panels');
    }
  });
});

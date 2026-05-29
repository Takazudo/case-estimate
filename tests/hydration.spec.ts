import { test, expect, Page, ConsoleMessage } from '@playwright/test';

// QUARANTINED: asserts pre-modal-UI (native select/combobox/tabs/home-config) that no longer exists; rewrite tracked in Takazudo/case-estimate#94
test.describe.skip('Hydration Tests', () => {
  // Helper to detect hydration errors
  const setupHydrationErrorDetection = (page: Page) => {
    const hydrationErrors: string[] = [];

    // Capture console errors that contain hydration-related messages
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Common hydration error patterns in React
        if (
          text.includes('Hydration') ||
          text.includes('did not match') ||
          text.includes('Text content does not match') ||
          text.includes('Expected server HTML') ||
          text.includes('Warning: Prop') ||
          text.includes('Warning: Extra attributes')
        ) {
          hydrationErrors.push(text);
        }
      }
    });

    // Capture uncaught exceptions that might indicate hydration issues
    page.on('pageerror', (error: Error) => {
      if (error.message.includes('Hydration') || error.message.includes('did not match')) {
        hydrationErrors.push(error.message);
      }
    });

    return hydrationErrors;
  };

  test('should not have hydration errors on home page', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/');

    // Wait for React hydration to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Give extra time for hydration

    // Check that page loaded correctly
    await expect(page.getByRole('button', { name: 'Go to home' })).toBeVisible();

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors on /m route without parameters', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/m');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors on /m route with case parameter', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    // Test with different case parameters
    await page.goto('/m?c=1a');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that case selector is visible and has correct value
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toBeVisible();
    await expect(caseSelector).toHaveValue('zudo-block-40-ACR-A', { timeout: 5000 });

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors on /m route with full parameters', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/m?c=3a&p=1cb.2cb');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that case selector is visible and has correct value
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toBeVisible();
    await expect(caseSelector).toHaveValue('zudo-block-60-ACR-A', { timeout: 5000 });

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors on /panel route', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/panel');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that header is visible
    await expect(page.getByRole('button', { name: 'Go to home' })).toBeVisible();

    // Panel Materials button should NOT be visible on panel page
    await expect(page.getByText('Panel Materials')).not.toBeVisible();

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors on /modules route', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/modules');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that header is visible
    await expect(page.getByRole('button', { name: 'Go to home' })).toBeVisible();

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors during navigation from home to configurator', async ({
    page,
  }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on a case model to navigate to configurator
    await page.getByRole('link', { name: 'zudo-block-40-ACR-A' }).first().click();

    // Wait for navigation
    await page.waitForURL(/\/m\?/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify case selector is visible with correct value
    const caseSelector = page.getByRole('combobox').first();
    await expect(caseSelector).toBeVisible();
    await expect(caseSelector).toHaveValue('zudo-block-40-ACR-A', { timeout: 5000 });

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have hydration errors when changing case models', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    await page.goto('/m?c=1a');
    await page.waitForLoadState('networkidle');

    const caseSelector = page.getByRole('combobox').first();

    // Change to a different case
    await caseSelector.selectOption('zudo-block-60-ACR-A');

    // Wait for update
    await page.waitForTimeout(1000);

    // Verify the selection changed
    await expect(caseSelector).toHaveValue('zudo-block-60-ACR-A');

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should maintain consistent header state across client/server', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    // Test 1: Direct navigation to /m with case (selector should be visible)
    await page.goto('/m?c=1a');
    await page.waitForLoadState('networkidle');

    const selector1 = page.getByRole('combobox').first();
    await expect(selector1).toBeVisible();

    // Test 2: Direct navigation to home (selector should NOT be visible)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const selector2 = page.getByRole('combobox').first();
    await expect(selector2).not.toBeVisible();

    // Test 3: Direct navigation to /panel (selector should NOT be visible)
    await page.goto('/panel');
    await page.waitForLoadState('networkidle');

    const selector3 = page.getByRole('combobox').first();
    await expect(selector3).not.toBeVisible();

    // Verify no hydration errors throughout
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should handle rapid page transitions without hydration errors', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorDetection(page);

    // Rapid navigation sequence
    await page.goto('/');
    await page.goto('/m?c=1a');
    await page.goto('/panel');
    await page.goto('/m?c=3a');
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify no hydration errors
    expect(hydrationErrors).toHaveLength(0);
  });
});

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Wired to serve the zfb build (not Next dev server).
 * The webServer builds zfb-app then starts `zfb preview` on port 3200.
 * Port 3200 is kept to avoid changing hardcoded URLs in existing test files
 * (tests/gallery.spec.ts references http://localhost:3200/gallery).
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3200',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Build zfb-app then serve the static output via `zfb preview`.
   * The build step is included so CI always gets a fresh artifact.
   * Locally, reuseExistingServer skips the build+boot if port 3200 is
   * already occupied (e.g. a manually-started preview). */
  webServer: {
    command:
      'pnpm --filter zfb-app run build && pnpm --filter zfb-app exec zfb preview --port 3200',
    url: 'http://localhost:3200',
    reuseExistingServer: !process.env.CI,
    /* Generous timeout: zfb build (~5-10s) + preview boot. 240s covers CI. */
    timeout: 240 * 1000,
  },
});

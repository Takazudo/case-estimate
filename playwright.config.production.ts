import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing production zfb builds.
 *
 * Serves the zfb static output via `zfb preview`. Keeps the PORT env-var
 * override so the caller can bind an arbitrary port when needed (e.g. to
 * avoid collision with a running dev instance). Defaults to 3200 to match
 * the hardcoded URLs in tests/gallery.spec.ts.
 *
 * Usage:
 *   pnpm run test:smoke:production          # build + preview on 3200
 *   PORT=4321 pnpm run test:smoke:production  # alternate port
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
    /* Base URL honours PORT env var (default 3200 to match gallery.spec.ts hardcodes). */
    baseURL: process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3200',
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

  /* Build and serve the zfb production output.
   * reuseExistingServer is always false here so the production config always
   * starts with a clean, freshly-built artifact — no stale preview risk. */
  webServer: {
    command: `pnpm --filter zfb-app run build && pnpm --filter zfb-app exec zfb preview --port ${process.env.PORT ?? '3200'}`,
    url: process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3200',
    reuseExistingServer: false,
    /* Generous timeout: zfb build (~5-10s) + preview boot. */
    timeout: 240 * 1000,
  },
});

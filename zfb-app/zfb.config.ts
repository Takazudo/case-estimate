import { defineConfig } from '@takazudo/zfb/config';

/**
 * zfb project config for the zpanels Next.js -> zfb migration.
 *
 * Lives under `zfb-app/` (not the repo root) because a populated root
 * `pages/` collides with Next's app-router during the coexistence phase
 * ("Conflicting app and page file"). Once the migration completes and Next
 * is retired, this can move to the repo root.
 *
 * `site` is the production origin (see CLAUDE.md deployment section); the
 * app deploys at the domain root so `base` stays the default "/".
 */
export default defineConfig({
  framework: 'react',
  outDir: 'dist',
  publicDir: 'public',
  site: 'https://panels.takazudomodular.com',
  tailwind: {
    enabled: true,
  },
  collections: [
    {
      // Populated by T4 (MDX page port). Set up now so T3-T6 build on a
      // stable collection name. `getCollection("content")` reads from here.
      name: 'content',
      path: 'content',
    },
  ],
});

import { Island } from '@takazudo/zfb';

import Configurator from '@/components/configurator';
import DefaultLayout from '../layouts/default';

/**
 * The interactive case configurator page (`/m`) — the product crux of the
 * Next.js → zfb migration.
 *
 * The entire Configurator tree (visualization panel, controls sidebar,
 * case/panel/color/rail selectors, presets, price table, and all Headless-UI
 * modals) is mounted as ONE large client island via `ssrFallback` — the
 * client:only equivalent. zfb emits the `data-zfb-island-skip-ssr` marker and
 * renders the fallback (here: nothing) in the static HTML, then the client
 * runtime mounts the real component into the placeholder on hydration.
 *
 * Why skip SSR for this tree:
 *  - The old Next `/m` already rendered the configurator behind
 *    `<Suspense fallback={null}>`, so there is no meaningful static first
 *    paint to preserve — SSR-skipping loses nothing visible.
 *  - It removes the build-time-render / hydration-mismatch burden for a large
 *    stateful tree that reads `window`/`location`/`localStorage` on mount, and
 *    sidesteps the Headless-UI (`modal/*`) SSR concern, in one move — rather
 *    than hand-making the whole tree SSR-safe.
 *  - All `window`/`location`/`localStorage` reads in the tree already happen
 *    inside `useEffect` (URL hydration) or guarded helpers (localStorage), so
 *    the client-only mount is correct.
 *
 * The old page also wrapped Configurator in an ErrorBoundary; that is dropped
 * here deliberately. The Island already isolates this subtree's hydration from
 * the rest of the page, and ErrorBoundary references `process.env.NODE_ENV`
 * (a Node global, not guaranteed in the zfb client bundle) and would shift the
 * island marker name away from "Configurator". `Suspense fallback={null}` is
 * likewise dropped — nothing in this tree suspends (loading is effect-driven
 * via `onLoadingChange`, not Suspense), and `ssrFallback` already fills the
 * client-only-mount role.
 *
 * getStaticProps passes the build-time route to the layout so SiteHeader's
 * active-nav / `fullWidth` state renders correctly in the static HTML.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/m',
    },
  };
}

interface ConfiguratorPageProps {
  currentPath?: string;
}

export default function ConfiguratorPage({ currentPath }: ConfiguratorPageProps) {
  return (
    <DefaultLayout
      title="Takazudo Modular Panels - Builder"
      description="Build your custom Takazudo Modular synthesizer case"
      currentPath={currentPath}
      configurator
    >
      {/* Whole configurator mounted client-only. ssrFallback renders nothing
          in the static HTML (matching the old Suspense fallback={null}); the
          full tree hydrates on load. The fallback element fills the height so
          the layout reserves the viewport before hydration. */}
      <Island when="load" ssrFallback={<div className="h-full" />}>
        <Configurator />
      </Island>
    </DefaultLayout>
  );
}

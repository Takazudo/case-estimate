import { Island } from '@takazudo/zfb';

import SanityIsland from '../components/sanity-island';
import DefaultLayout from '../layouts/default';

/**
 * Placeholder home page for the zfb scaffold (T1–T3).
 *
 * Real content is ported by T4-T6. This page exists to confirm the published
 * zfb binary builds a React page with the full chrome (header, footer, nav)
 * and hydrates a client island in THIS app.
 *
 * getStaticProps passes the build-time route to the layout so the active nav
 * highlight renders correctly in the static HTML (no client flash).
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/',
    },
  };
}

interface HomePageProps {
  currentPath?: string;
}

export default function HomePage({ currentPath }: HomePageProps) {
  return (
    <DefaultLayout
      title="Takazudo Modular: Panels — zfb scaffold"
      description="Foundation page for the Next.js → zfb migration."
      currentPath={currentPath}
    >
      <div
        className="
          box-content mx-auto max-w-[1280px]
          px-hgap-sm md:px-hgap-md
          py-vgap-lg
        "
      >
        <h1 className="text-2xl font-bold mb-vgap-sm">zfb scaffold</h1>
        <p className="mb-vgap-sm">
          Foundation page for the Next.js → zfb migration. The widget below is a client-only React
          island; if it reports &quot;Hydrated: yes&quot; and the button counts up, the zfb React
          hydration pipeline works in this app.
        </p>
        <Island when="load">
          <SanityIsland />
        </Island>
      </div>
    </DefaultLayout>
  );
}

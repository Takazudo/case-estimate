import { Island } from '@takazudo/zfb';

import SanityIsland from '../components/sanity-island';
import DefaultLayout from '../layouts/default';

/**
 * Placeholder home page for the zfb scaffold (T1).
 *
 * Real content is ported by T3-T6. This page exists to confirm the published
 * zfb binary builds a React page and hydrates a client island in THIS app.
 * Deliberately does NOT query the `content` collection — it is empty until T4,
 * and an empty getCollection() at this stage would only add noise.
 */
export default function HomePage() {
  return (
    <DefaultLayout title="Takazudo Modular: Panels — zfb scaffold">
      <h1>zfb scaffold</h1>
      <p>
        Foundation page for the Next.js → zfb migration. The widget below is a client-only React
        island; if it reports "Hydrated: yes" and the button counts up, the zfb React hydration
        pipeline works in this app.
      </p>
      <Island when="load">
        <SanityIsland />
      </Island>
    </DefaultLayout>
  );
}

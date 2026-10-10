import { Island } from '@takazudo/zfb';

import { galleryData } from '@/data/gallery-data';
import { H1 } from '@/components/article/h1';
import { P } from '@/components/article/p';
import GalleryThumbnailGrid from '@/components/gallery-thumbnail-grid';
import GalleryDialogHost from '../components/gallery-dialog-host';
import DefaultLayout from '../layouts/default';

/**
 * /gallery page for the zfb build.
 *
 * Structure:
 * - Intro text (H1, P) — pure SSR, no island needed.
 * - GalleryThumbnailGrid — rendered via Island (hydrates immediately) so the
 *   thumbnail grid and blurhash placeholders are present in the static HTML
 *   for first paint; the IntersectionObserver lazy-loading activates
 *   client-side after hydration.
 * - GalleryDialogHost — rendered with ssrFallback={null} (client:only
 *   equivalent). The dialog uses Headless UI portals and browser-only APIs
 *   (dialogRef.showModal(), history.pushState patch), so it must be
 *   client-only. The unconditional Island ensures the data-zfb-island-skip-ssr
 *   marker is always emitted in the static HTML.
 */
export function getStaticProps() {
  return {
    props: {
      currentPath: '/gallery',
    },
  };
}

interface GalleryPageProps {
  currentPath?: string;
}

export default function GalleryPage({ currentPath }: GalleryPageProps) {
  return (
    <DefaultLayout
      title="ギャラリー / Gallery — Takazudo Modular: Panels"
      description="ケース関連の写真です。Gallery of Takazudo Modular synthesizer case configurations and color combinations."
      currentPath={currentPath}
    >
      <div className="py-8">
        <H1>ギャラリー / Gallery</H1>
        <div className="text-center -mt-vgap-md">
          <P>
            ケース関連の写真です。色々ありすぎて分からんという場合、
            <br />
            これどれですかなどとURLと共にお気軽にお問い合わせください。
          </P>
        </div>

        {/* Thumbnail grid — SSR'd + hydrated for lazy-loading and click handling */}
        <Island when="load">
          <GalleryThumbnailGrid items={galleryData} />
        </Island>
      </div>

      {/*
        Dialog host — client-only (ssrFallback={null}).
        The data-zfb-island-skip-ssr marker is always emitted in the static
        HTML because the Island is unconditional; the dialog itself only renders
        when ?id= is set in the URL, which happens client-side.
      */}
      <Island when="load" ssrFallback={null}>
        <GalleryDialogHost />
      </Island>
    </DefaultLayout>
  );
}

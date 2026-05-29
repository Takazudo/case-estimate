import type { ReactNode } from 'react';
import { Island } from '@takazudo/zfb';

import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import '../styles/global.css';

export interface DefaultLayoutProps {
  /** Page title emitted into <title>. Defaults to the site name. */
  title?: string;
  /** Page meta description. */
  description?: string;
  /**
   * Current route path (e.g. "/" or "/gallery").
   *
   * Pages pass this via getStaticProps so the active nav highlight is
   * correct in the static HTML — no client flash. T4+ pages will provide
   * real values; the default makes the layout self-contained.
   */
  currentPath?: string;
  /**
   * When true, emits apple-mobile-web-app-capable and related PWA meta
   * tags in <head>. Set by the /m configurator page, mirroring the Next
   * app/(configurator)/m/layout.tsx metadata.
   */
  pwaCapable?: boolean;
  /**
   * When true, switches the page body into the full-viewport configurator
   * variant used by /m: the <main> fills the viewport (h-screen +
   * overflow-hidden) with NO top padding, and the footer island is
   * suppressed.
   *
   * This mirrors the old Next render chain for /m, where the
   * app/(configurator)/layout.tsx wrapped children in a bare
   * `h-full overflow-hidden` div with no footer — the configurator's own
   * VisualizationPanel adds its `pt-[96px]` to clear the fixed header, so
   * the layout must NOT also pad the top (that would double the gap). The
   * fixed SiteHeader floats over this full-height container.
   *
   * Defaults to false (the standard content-page chrome: padded main +
   * footer), so other pages are unaffected.
   */
  configurator?: boolean;
  children: ReactNode;
}

const SITE_NAME = 'Takazudo Modular: Panels';
const DEFAULT_DESCRIPTION =
  'Interactive tool for customizing Takazudo Modular synthesizer cases with real-time price estimates';

/**
 * Full-chrome layout for content pages in the zfb build.
 *
 * Emits the complete <html> shell: head (charset, viewport, title, meta,
 * PWA tags, manifest link), self-hosted Noto Sans @font-face is in
 * global.css, interactive header island, page content, footer island.
 *
 * The configurator page (/m) uses this same layout but the header's
 * fullWidth and standalone-hide logic is handled inside SiteHeader's
 * island (via useIsStandalone on the client).
 *
 * T4 will feed real per-page titles / descriptions through the props;
 * this file provides the prop interface + sensible defaults.
 */
export default function DefaultLayout({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  currentPath = '/',
  pwaCapable = false,
  configurator = false,
  children,
}: DefaultLayoutProps) {
  // Pad top of page content so it clears the fixed header (96px matches the
  // pt-[96px] in the Next app/(content)/layout.tsx).
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* PWA manifest — mirrors the Next app/manifest.ts metadata route */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* PWA apple-mobile-web-app meta — mirroring app/(configurator)/m/layout.tsx
            appleWebApp metadata. Emitted on all pages here (safe to include
            globally; only has an effect when saved to home screen on iOS). */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="TM Panels" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {/* Interactive header island — hydrates immediately on load.
            currentPath is serialized into data-props so the active nav
            highlight renders correctly in the static HTML. */}
        <Island when="load">
          <SiteHeader currentPath={currentPath} />
        </Island>

        {configurator ? (
          // Configurator variant (/m): full-viewport, no top padding, no
          // footer — mirrors the old (configurator)/layout.tsx. h-screen gives
          // the configurator's `h-full` tree a definite height to resolve
          // against; overflow-hidden prevents page scroll behind the fixed
          // header. VisualizationPanel adds its own pt-[96px] to clear the
          // header, so the layout must not pad here.
          <main className="h-screen overflow-hidden">{children}</main>
        ) : (
          // Standard content-page chrome: padded main (clears fixed header) +
          // deferred footer island.
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-[96px]">{children}</main>

            {/* Footer island — deferred until visible to avoid blocking initial paint */}
            <Island when="visible">
              <SiteFooter />
            </Island>
          </div>
        )}
      </body>
    </html>
  );
}

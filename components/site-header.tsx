'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/app-header';
import { NavigationProvider } from '@/components/navigation-context';
import { normalizePath } from '@/utils/normalize-path';

interface SiteHeaderProps {
  /** Build-time route path (e.g. "/", "/gallery"). Passed from the layout
   *  via getStaticProps so the active nav state is correct in the static HTML
   *  without a client flash. Falls back to window.location.pathname after
   *  hydration for SPA transitions. */
  currentPath?: string;
}

/**
 * Interactive site header island for the zfb build.
 *
 * Wraps NavigationProvider + AppHeader inside a single island so all
 * React context consumers (NavigationLink, MobileMenuDrawer, etc.) share the
 * same context tree. Context does not cross island boundaries, so the whole
 * interactive chrome lives here as one hydration root.
 *
 * The `currentPath` prop is serialized into `data-props` at SSR time and
 * re-hydrated on the client, giving correct active-nav highlights in the
 * static HTML with no flash.
 */
export default function SiteHeader({ currentPath = '' }: SiteHeaderProps) {
  const [resolvedPath, setResolvedPath] = useState(currentPath);

  // After hydration, sync with the live browser pathname in case of SPA
  // navigation after page load. The initial server value is preserved until
  // window becomes available so SSR and first client render match.
  useEffect(() => {
    setResolvedPath(window.location.pathname);

    const handlePopState = () => {
      setResolvedPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Normalize so a post-301 trailing slash ('/m/') still matches '/m'.
  const isFullWidth = normalizePath(resolvedPath) === '/m';

  return (
    <NavigationProvider>
      {/* currentPath is threaded into AppHeader for prop-driven active nav
          highlights — no flash even in the static HTML. */}
      <AppHeader fullWidth={isFullWidth} currentPath={resolvedPath} />
    </NavigationProvider>
  );
}

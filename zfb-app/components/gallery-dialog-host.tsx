'use client';

import { useState, useEffect } from 'react';
import GalleryDialog from '@/components/gallery-dialog';

/**
 * Client-only host for the GalleryDialog.
 *
 * Problem: GalleryThumbnailGrid opens the dialog by calling
 * window.history.pushState('/gallery?id=…'), which does NOT fire a `popstate`
 * event (browsers only emit popstate for back/forward navigation, not for
 * programmatic pushState calls). In the Next.js build, Next patches
 * replaceState/pushState to keep useSearchParams in sync. In zfb there is no
 * such patch, so we install one ourselves on mount.
 *
 * The patch wraps pushState and replaceState to dispatch a custom
 * "locationchange" event, which this host listens for to re-read ?id= and
 * show/hide the dialog. The patch is removed on unmount.
 *
 * This island is rendered unconditionally (ssrFallback={null}) so the
 * data-zfb-island-skip-ssr marker is always present in the static HTML — a
 * requirement of the proven ssrFallback pattern.
 */
export default function GalleryDialogHost() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Read the initial ?id= from the URL on mount
    const readId = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedId(params.get('id'));
    };

    readId();

    // Patch pushState / replaceState to emit "locationchange"
    // so this component can react to programmatic URL changes by the grid.
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    const emit = () => window.dispatchEvent(new Event('locationchange'));

    history.pushState = (...args) => {
      originalPushState(...args);
      emit();
    };

    history.replaceState = (...args) => {
      originalReplaceState(...args);
      emit();
    };

    window.addEventListener('locationchange', readId);
    // Also handle browser back/forward
    window.addEventListener('popstate', readId);

    return () => {
      window.removeEventListener('locationchange', readId);
      window.removeEventListener('popstate', readId);
      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  if (!selectedId) {
    return null;
  }

  return <GalleryDialog slug={selectedId} />;
}

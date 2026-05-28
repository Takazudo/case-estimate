import { useEffect } from 'react';
import { encodeCase, encodePanelColors } from '@/utils/url-encoder';
import type { PanelColorIds } from '@/types';

interface UseUrlPersistenceProps {
  selectedCase: string | null;
  panelColorIds: PanelColorIds; // Now accepts color IDs instead of hex values
}

export function useUrlPersistence({ selectedCase, panelColorIds }: UseUrlPersistenceProps) {
  // We no longer load from URL here since the component handles initial state itself
  // This hook now only handles URL updates when state changes

  // Update URL when state changes (only on /m/ route)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only update URL if we're on the /m route
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/m')) return;

    const params = new URLSearchParams();
    if (selectedCase) {
      params.set('c', encodeCase(selectedCase));

      if (Object.keys(panelColorIds).length > 0) {
        // Now directly encode color IDs, no need for conversion
        const encoded = encodePanelColors(panelColorIds);
        if (encoded) {
          params.set('p', encoded);
        }
      }
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    // Use native History API instead of Next.js router — framework-agnostic, works in zfb islands too
    window.history.replaceState(window.history.state, '', newUrl);
  }, [selectedCase, panelColorIds]);
}

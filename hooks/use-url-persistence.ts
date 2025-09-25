import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { encodeCase, encodePanelColors } from '@/utils/url-encoder';

interface PanelColorIds {
  [key: string]: string; // Maps panel ID to color ID
}

interface UseUrlPersistenceProps {
  selectedCase: string | null;
  panelColorIds: PanelColorIds; // Now accepts color IDs instead of hex values
}

export function useUrlPersistence({ selectedCase, panelColorIds }: UseUrlPersistenceProps) {
  const router = useRouter();
  const pathname = usePathname();

  // We no longer load from URL here since the component handles initial state itself
  // This hook now only handles URL updates when state changes

  // Update URL when state changes (only on /m/ route)
  useEffect(() => {
    // Only update URL if we're on the /m route
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
    router.replace(newUrl, { scroll: false });
  }, [selectedCase, panelColorIds, router, pathname]);
}

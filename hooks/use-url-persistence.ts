import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { encodeCase, encodePanelColors, createColorIdMap } from '@/utils/url-encoder';
import { colors } from '@/data/colors';

interface PanelColors {
  [key: string]: string;
}

interface UseUrlPersistenceProps {
  selectedCase: string | null;
  panelColors: PanelColors;
}

export function useUrlPersistence({ selectedCase, panelColors }: UseUrlPersistenceProps) {
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

      if (Object.keys(panelColors).length > 0) {
        const colorIdMap = createColorIdMap(colors);
        const encoded = encodePanelColors(panelColors, colorIdMap);
        if (encoded) {
          params.set('p', encoded);
        }
      }
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedCase, panelColors, router, pathname]);
}

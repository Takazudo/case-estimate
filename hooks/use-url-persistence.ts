import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cases } from '@/data/cases';
import {
  encodeCase,
  decodeCase,
  encodePanelColors,
  decodePanelColors,
  createColorIdMap,
  createColorValueMap,
} from '@/utils/url-encoder';
import { colors } from '@/data/colors';

interface PanelColors {
  [key: string]: string;
}

interface UseUrlPersistenceProps {
  selectedCase: string | null;
  panelColors: PanelColors;
  onCaseLoad: (caseType: string, colors: PanelColors) => void;
  skipInitialLoad?: boolean;
}

export function useUrlPersistence({
  selectedCase,
  panelColors,
  onCaseLoad,
  skipInitialLoad = false,
}: UseUrlPersistenceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Load state from URL on mount
  useEffect(() => {
    // Skip initial load if requested (e.g., when using server-side props)
    if (skipInitialLoad) return;

    if (!searchParams) return; // Wait for searchParams to be available

    const caseParam = searchParams.get('c');
    const colorsParam = searchParams.get('p');

    const decodedCase = caseParam ? decodeCase(caseParam) : null;

    if (decodedCase && cases[decodedCase]) {
      let loadedColors: PanelColors = {};

      if (colorsParam) {
        try {
          const colorValueMap = createColorValueMap(colors);
          const decodedColors = decodePanelColors(colorsParam, colorValueMap);

          if (Object.keys(decodedColors).length > 0) {
            loadedColors = decodedColors;
          }
        } catch (e) {
          console.error('Failed to decode colors from URL', e);
        }
      }

      onCaseLoad(decodedCase, loadedColors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, skipInitialLoad]); // Re-run when searchParams becomes available

  // Update URL when state changes
  useEffect(() => {
    // Don't update URL if we're skipping initial load and haven't loaded yet
    if (skipInitialLoad && !selectedCase) return;

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
  }, [selectedCase, panelColors, router, pathname, skipInitialLoad]);
}

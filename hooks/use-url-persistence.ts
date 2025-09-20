import { useEffect } from 'react';
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
}

export function useUrlPersistence({
  selectedCase,
  panelColors,
  onCaseLoad,
}: UseUrlPersistenceProps) {
  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const caseParam = params.get('c');
    const colorsParam = params.get('p');

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
  }, []); // Only run on mount - onCaseLoad should be stable

  // Update URL when state changes
  useEffect(() => {
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

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCase, panelColors]);
}

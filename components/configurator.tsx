'use client';

import { useState, useEffect } from 'react';
import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Series } from '@/types';
import { decodeCase, decodePanelColors, createColorValueMap } from '@/utils/url-encoder';

// Components
import VisualizationPanel from '@/components/visualization-panel';
import ControlsSidebar from '@/components/controls-sidebar';

// Hooks
import { useLocalStorageColor } from '@/hooks/use-local-storage-color';
import { useUrlPersistence } from '@/hooks/use-url-persistence';

// Utils
import {
  getDefaultColors,
  applySeriesColorsWithIds,
  isSeriesActive as checkSeriesActive,
} from '@/utils/panel-colors';

interface PanelColors {
  [key: string]: string;
}

interface PanelColorIds {
  [key: string]: string; // Maps panel ID to color ID
}

// localStorage keys
const STORAGE_KEYS = {
  BG_COLOR: 'takazudo_bg_color',
  GRID_COLOR: 'takazudo_grid_color',
} as const;

// Default colors (Line: 59%, Background: 66%)
const DEFAULT_COLORS = {
  BG_COLOR: '#a8a8a8',
  GRID_COLOR: '#969696',
} as const;

// Helper to get initial state from URL
function getInitialStateFromUrl(): { selectedCase: string | null; panelColors: PanelColors } {
  if (typeof window === 'undefined') {
    return { selectedCase: null, panelColors: {} };
  }

  const params = new URLSearchParams(window.location.search);
  const caseParam = params.get('c');
  const colorsParam = params.get('p');

  // Default to first available case if no case param
  if (!caseParam) {
    // Get the first case from the cases object
    const firstCaseKey = Object.keys(cases)[0];
    return { selectedCase: firstCaseKey || null, panelColors: getDefaultColors(firstCaseKey) };
  }

  const decodedCase = decodeCase(caseParam);
  if (!decodedCase || !cases[decodedCase]) {
    // Fall back to first case if invalid case param
    const firstCaseKey = Object.keys(cases)[0];
    return { selectedCase: firstCaseKey || null, panelColors: getDefaultColors(firstCaseKey) };
  }

  // Load default colors for the case
  const defaultColors = getDefaultColors(decodedCase);
  let panelColors = defaultColors;

  // If we have panel colors in URL, decode and apply them
  if (colorsParam) {
    try {
      const colorValueMap = createColorValueMap(colors);
      const decodedColors = decodePanelColors(colorsParam, colorValueMap);
      panelColors = { ...defaultColors, ...decodedColors };
    } catch (e) {
      console.error('Failed to decode panel colors from URL', e);
    }
  }

  return { selectedCase: decodedCase, panelColors };
}

function Configurator() {
  // Initialize with null/empty state for consistent SSR
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [panelColors, setPanelColors] = useState<PanelColors>({});
  const [panelColorIds, setPanelColorIds] = useState<PanelColorIds>({}); // Track color IDs
  const [activeTab, setActiveTab] = useState<string>('series');
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);

  // Use localStorage hooks for background colors
  const [bgColor, setBgColor] = useLocalStorageColor(
    STORAGE_KEYS.BG_COLOR,
    DEFAULT_COLORS.BG_COLOR,
  );
  const [gridColor, setGridColor] = useLocalStorageColor(
    STORAGE_KEYS.GRID_COLOR,
    DEFAULT_COLORS.GRID_COLOR,
  );

  // Hydrate state from URL after mount to avoid SSR mismatches
  useEffect(() => {
    const initialState = getInitialStateFromUrl();
    setSelectedCase(initialState.selectedCase);
    setPanelColors(initialState.panelColors);

    // Reconstruct color IDs from the panel colors
    if (initialState.selectedCase && initialState.panelColors) {
      const caseData = cases[initialState.selectedCase];
      if (caseData && caseData.material) {
        const availableColors = colors[caseData.material];
        const colorIds: PanelColorIds = {};

        Object.entries(initialState.panelColors).forEach(([panelId, colorValue]) => {
          // Find the color ID that matches this value
          // Note: If multiple colors have the same value, this will pick the first one
          const matchingColor = availableColors?.find((c) => c.value === colorValue);
          if (matchingColor) {
            colorIds[panelId] = matchingColor.id;
          }
        });

        setPanelColorIds(colorIds);
      }
    }
  }, []);

  const currentCase = selectedCase ? cases[selectedCase] : null;
  const material = currentCase?.material;

  // Sync selectedColor when selectedPanel changes (e.g., from panel selector dropdown)
  useEffect(() => {
    if (selectedPanel && material && panelColors[selectedPanel]) {
      const currentColorValue = panelColors[selectedPanel];
      const availableColors = colors[material];
      const matchingColor = availableColors?.find((c) => c.value === currentColorValue);
      setSelectedColor(matchingColor || null);
    }
  }, [selectedPanel, material, panelColors]);

  // Handle URL persistence for client-side state (only updates URL when state changes)
  useUrlPersistence({
    selectedCase,
    panelColors,
  });

  const handlePanelClick = (panelId: string) => {
    // If in Series tab, switch to Custom tab when a panel is clicked
    if (activeTab === 'series') {
      setActiveTab('custom');
    }

    setSelectedPanel(panelId);

    // Sync selectedColor with the panel's current color
    if (material && panelColors[panelId]) {
      const currentColorValue = panelColors[panelId];
      const availableColors = colors[material];
      const matchingColor = availableColors?.find((c) => c.value === currentColorValue);
      if (matchingColor) {
        setSelectedColor(matchingColor);
      } else {
        // If no matching color found (e.g., custom hex), clear selection
        setSelectedColor(null);
      }
    }
  };

  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    if (selectedPanel) {
      setPanelColors((prev) => ({
        ...prev,
        [selectedPanel]: color.value,
      }));
      setPanelColorIds((prev) => ({
        ...prev,
        [selectedPanel]: color.id,
      }));
    }
  };

  const handleCaseSelect = (caseType: string) => {
    // Always require a case to be selected
    if (!caseType) return;
    setSelectedCase(caseType);
    setSelectedPanel(null);
    setSelectedColor(null);
    setActiveTab('series');

    // Auto-select first series
    const caseData = cases[caseType];
    if (caseData && caseData.material) {
      const seriesList = colors.series[caseData.material];
      if (seriesList && seriesList.length > 0) {
        const firstSeries = seriesList[0];
        const result = applySeriesColorsWithIds(firstSeries, caseType, caseData.material);
        setPanelColors(result.colors);
        setPanelColorIds(result.colorIds);
      } else {
        setPanelColors(getDefaultColors(caseType));
        setPanelColorIds({});
      }
    } else {
      setPanelColors(getDefaultColors(caseType));
      setPanelColorIds({});
    }
  };

  const handleSeriesSelect = (series: Series) => {
    if (!selectedCase || !material) return;
    const result = applySeriesColorsWithIds(series, selectedCase, material);
    setPanelColors(result.colors);
    setPanelColorIds(result.colorIds);
  };

  const isSeriesActive = (series: Series): boolean => {
    return checkSeriesActive(series, panelColors, selectedCase, material, panelColorIds);
  };

  // Create color map for display
  const colorMap: { [key: string]: string } = {};
  if (material) {
    colors[material]?.forEach((color) => {
      colorMap[color.value] = color.name;
    });
  }

  return (
    <div className="h-full relative">
      {/* Loading overlay */}
      {isLoadingSvg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="loader relative z-10" />
        </div>
      )}

      {selectedCase && (
        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_600px]">
          {/* Left Column - Visualization */}
          <VisualizationPanel
            selectedCase={selectedCase}
            panelColors={panelColors}
            panelColorIds={panelColorIds}
            onPanelClick={handlePanelClick}
            selectedPanel={selectedPanel}
            material={material}
            bgColor={bgColor}
            gridColor={gridColor}
            onLoadingChange={setIsLoadingSvg}
          />

          {/* Right Column - Controls */}
          <ControlsSidebar
            selectedCase={selectedCase}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            material={material}
            onSeriesSelect={handleSeriesSelect}
            isSeriesActive={isSeriesActive}
            panels={currentCase?.panels || []}
            panelColors={panelColors}
            selectedPanel={selectedPanel}
            onPanelSelect={setSelectedPanel}
            colorMap={colorMap}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            onCaseSelect={handleCaseSelect}
            bgColor={bgColor}
            gridColor={gridColor}
            onBgColorChange={setBgColor}
            onGridColorChange={setGridColor}
          />
        </div>
      )}
    </div>
  );
}

export default Configurator;

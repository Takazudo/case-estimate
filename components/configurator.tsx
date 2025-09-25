'use client';

import { useState, useEffect } from 'react';
import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Series } from '@/types';
import { decodeCase, decodePanelColors } from '@/utils/url-encoder';

// Components
import VisualizationPanel from '@/components/visualization-panel';
import ControlsSidebar from '@/components/controls-sidebar';

// Hooks
import { useLocalStorageColor } from '@/hooks/use-local-storage-color';
import { useUrlPersistence } from '@/hooks/use-url-persistence';

// Utils
import {
  applySeriesColorsWithIds,
  isSeriesActive as checkSeriesActive,
  derivePanelColors,
} from '@/utils/panel-colors';

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
function getInitialStateFromUrl(): { selectedCase: string | null; panelColorIds: PanelColorIds } {
  if (typeof window === 'undefined') {
    return { selectedCase: null, panelColorIds: {} };
  }

  const params = new URLSearchParams(window.location.search);
  const caseParam = params.get('c');
  const colorsParam = params.get('p');

  // Default to first available case if no case param
  if (!caseParam) {
    // Get the first case from the cases object
    const firstCaseKey = Object.keys(cases)[0];
    const caseData = cases[firstCaseKey];
    if (!caseData || !caseData.material) {
      return { selectedCase: firstCaseKey || null, panelColorIds: {} };
    }
    // Initialize with default color IDs (first color for all panels)
    const defaultColorId = colors[caseData.material]?.[0]?.id;
    const defaultColorIds: PanelColorIds = {};
    if (defaultColorId) {
      caseData.panels.forEach((panel) => {
        defaultColorIds[panel.id] = defaultColorId;
      });
    }
    return { selectedCase: firstCaseKey || null, panelColorIds: defaultColorIds };
  }

  const decodedCase = decodeCase(caseParam);
  if (!decodedCase || !cases[decodedCase]) {
    // Fall back to first case if invalid case param
    const firstCaseKey = Object.keys(cases)[0];
    const caseData = cases[firstCaseKey];
    if (!caseData || !caseData.material) {
      return { selectedCase: firstCaseKey || null, panelColorIds: {} };
    }
    // Initialize with default color IDs
    const defaultColorId = colors[caseData.material]?.[0]?.id;
    const defaultColorIds: PanelColorIds = {};
    if (defaultColorId) {
      caseData.panels.forEach((panel) => {
        defaultColorIds[panel.id] = defaultColorId;
      });
    }
    return { selectedCase: firstCaseKey || null, panelColorIds: defaultColorIds };
  }

  // Load default color IDs for the case
  const caseData = cases[decodedCase];
  let panelColorIds: PanelColorIds = {};

  if (caseData && caseData.material) {
    const defaultColorId = colors[caseData.material]?.[0]?.id;
    if (defaultColorId) {
      caseData.panels.forEach((panel) => {
        panelColorIds[panel.id] = defaultColorId;
      });
    }
  }

  // If we have panel colors in URL, decode and apply them
  if (colorsParam) {
    try {
      const decodedColorIds = decodePanelColors(colorsParam);
      panelColorIds = { ...panelColorIds, ...decodedColorIds };
    } catch (e) {
      console.error('Failed to decode panel colors from URL', e);
    }
  }

  return { selectedCase: decodedCase, panelColorIds };
}

function Configurator() {
  // Initialize with null/empty state for consistent SSR
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [panelColorIds, setPanelColorIds] = useState<PanelColorIds>({}); // Primary state - color IDs
  const [activeTab, setActiveTab] = useState<string>('series');
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);

  // Derive panel colors (hex values) from color IDs for rendering
  const currentCase = selectedCase ? cases[selectedCase] : null;
  const material = currentCase?.material;
  const panelColors = derivePanelColors(panelColorIds, material);

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
    setPanelColorIds(initialState.panelColorIds);
  }, []);

  // Sync selectedColor when selectedPanel changes (e.g., from panel selector dropdown)
  useEffect(() => {
    if (selectedPanel && material && panelColorIds[selectedPanel]) {
      const currentColorId = panelColorIds[selectedPanel];
      const availableColors = colors[material];
      const matchingColor = availableColors?.find((c) => c.id === currentColorId);
      setSelectedColor(matchingColor || null);
    }
  }, [selectedPanel, material, panelColorIds]);

  // Handle URL persistence for client-side state (only updates URL when state changes)
  useUrlPersistence({
    selectedCase,
    panelColorIds, // Pass color IDs instead of hex values
  });

  const handlePanelClick = (panelId: string) => {
    // If in Series tab, switch to Custom tab when a panel is clicked
    if (activeTab === 'series') {
      setActiveTab('custom');
    }

    setSelectedPanel(panelId);

    // Sync selectedColor with the panel's current color ID
    if (material && panelColorIds[panelId]) {
      const currentColorId = panelColorIds[panelId];
      const availableColors = colors[material];
      const matchingColor = availableColors?.find((c) => c.id === currentColorId);
      setSelectedColor(matchingColor || null);
    }
  };

  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    if (selectedPanel) {
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
        setPanelColorIds(result.colorIds);
      } else {
        // Set default color IDs for all panels
        const defaultColorId = colors[caseData.material]?.[0]?.id;
        if (defaultColorId) {
          const defaultColorIds: PanelColorIds = {};
          caseData.panels.forEach((panel) => {
            defaultColorIds[panel.id] = defaultColorId;
          });
          setPanelColorIds(defaultColorIds);
        } else {
          setPanelColorIds({});
        }
      }
    } else {
      // Set default color IDs for all panels
      const caseData = cases[caseType];
      if (caseData && caseData.material) {
        const defaultColorId = colors[caseData.material]?.[0]?.id;
        if (defaultColorId) {
          const defaultColorIds: PanelColorIds = {};
          caseData.panels.forEach((panel) => {
            defaultColorIds[panel.id] = defaultColorId;
          });
          setPanelColorIds(defaultColorIds);
        } else {
          setPanelColorIds({});
        }
      } else {
        setPanelColorIds({});
      }
    }
  };

  const handleSeriesSelect = (series: Series) => {
    if (!selectedCase || !material) return;
    const result = applySeriesColorsWithIds(series, selectedCase, material);
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

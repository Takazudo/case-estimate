'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Series } from '@/types';
import { decodeCase, decodePanelColors } from '@/utils/url-encoder';

// Components
import VisualizationPanel from '@/components/visualization-panel';
import ControlsSidebar from '@/components/controls-sidebar';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';

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
  const [panelColorIds, setPanelColorIds] = useState<PanelColorIds>({}); // Primary state - color IDs
  const [activeTab, setActiveTab] = useState<string>('series');
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const isUserTabChangeRef = useRef(false);

  // Derive panel colors (hex values) from color IDs for rendering
  const currentCase = selectedCase ? cases[selectedCase] : null;
  const material = currentCase?.material;
  const panelColors = useMemo(
    () => derivePanelColors(panelColorIds, material),
    [panelColorIds, material],
  );

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

    // Check if initial colors match any preset series
    if (initialState.selectedCase && cases[initialState.selectedCase]) {
      const caseData = cases[initialState.selectedCase];
      const material = caseData.material;
      if (material && Object.keys(initialState.panelColorIds).length > 0) {
        const seriesList = colors.series[material] ?? [];
        const panelColorsFromIds: { [key: string]: string } = {};

        // Convert color IDs to hex values for comparison
        Object.entries(initialState.panelColorIds).forEach(([panelId, colorId]) => {
          const color = colors[material]?.find((c) => c.id === colorId);
          if (color) {
            panelColorsFromIds[panelId] = color.value;
          }
        });

        const matchesPreset = seriesList.some((series) =>
          checkSeriesActive(
            series,
            panelColorsFromIds,
            initialState.selectedCase,
            material,
            initialState.panelColorIds,
          ),
        );

        // Auto-switch to custom if colors don't match any preset
        if (!matchesPreset) {
          setActiveTab('custom');
        }
      }
    }
  }, []);

  // Ensure the Custom tab is active when the current colors don't match any preset series
  // But only auto-switch on initial load or case change, not during manual tab switches
  useEffect(() => {
    if (!selectedCase || !material) return;
    if (activeTab !== 'series') return;
    if (Object.keys(panelColorIds).length === 0) return;

    // Don't auto-switch if this was a user-initiated tab change
    if (isUserTabChangeRef.current) {
      isUserTabChangeRef.current = false; // Skip one cycle for manual switches
      return;
    }

    const seriesList = colors.series[material] ?? [];
    const matchesPreset = seriesList.some((series) =>
      checkSeriesActive(series, panelColors, selectedCase, material, panelColorIds),
    );

    if (!matchesPreset) {
      setActiveTab('custom');
    }
  }, [selectedCase, material, panelColors, panelColorIds, activeTab]);

  // Handle URL persistence for client-side state (only updates URL when state changes)
  useUrlPersistence({
    selectedCase,
    panelColorIds, // Pass color IDs instead of hex values
  });

  const handlePanelClick = (panelId: string) => {
    // If in Series tab, switch to Custom tab when a panel is clicked
    if (activeTab === 'series') {
      isUserTabChangeRef.current = true; // Panel click is user-initiated
      setActiveTab('custom');
    }

    setSelectedPanel(panelId);
    // Open color selection modal when SVG panel is clicked
    setIsColorModalOpen(true);
  };

  const handleColorSelect = (color: Color) => {
    if (selectedPanel) {
      setPanelColorIds((prev) => ({
        ...prev,
        [selectedPanel]: color.id,
      }));
    }
  };

  const handleModalColorSelect = (color: Color) => {
    handleColorSelect(color);
    setIsColorModalOpen(false);
  };

  const getSelectedColor = (): Color | null => {
    if (!selectedPanel || !material) return null;

    const colorValue = panelColors[selectedPanel];
    const colorName = colorMap[colorValue] || 'Default';

    return {
      id: panelColorIds[selectedPanel] || 'default',
      name: colorName,
      value: colorValue || '#f3f4f6',
      material: material === 'acrylic' ? 'Acrylic' : '3DP',
    };
  };

  const handleTabChange = (tabId: string) => {
    isUserTabChangeRef.current = true; // Mark as user-initiated
    setActiveTab(tabId);
  };

  const handleCaseSelect = (caseType: string) => {
    // Always require a case to be selected
    if (!caseType) return;
    setSelectedCase(caseType);
    setSelectedPanel(null);
    isUserTabChangeRef.current = false; // Case change resets tab change origin
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
        <div
          className={`
            h-full grid grid-cols-1
            md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_480px]
            xl:grid-cols-[1fr_600px]
          `}
        >
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
            onTabChange={handleTabChange}
            material={material}
            onSeriesSelect={handleSeriesSelect}
            isSeriesActive={isSeriesActive}
            panels={currentCase?.panels || []}
            panelColors={panelColors}
            selectedPanel={selectedPanel}
            onPanelSelect={setSelectedPanel}
            colorMap={colorMap}
            onColorSelect={handleColorSelect}
            onCaseSelect={handleCaseSelect}
            bgColor={bgColor}
            gridColor={gridColor}
            onBgColorChange={setBgColor}
            onGridColorChange={setGridColor}
          />
        </div>
      )}

      {/* Color Selection Modal */}
      {material && (
        <ColorSelectorModal
          isOpen={isColorModalOpen}
          material={material}
          selectedColor={getSelectedColor()}
          onColorSelect={handleModalColorSelect}
          onClose={() => setIsColorModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Configurator;

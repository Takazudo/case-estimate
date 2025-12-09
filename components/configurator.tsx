'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { cases } from '@/data/cases';
import { colors } from '@/data/colors';
import type { Color, Preset, PanelColorIds } from '@/types';
import { decodeCase, decodePanelColors } from '@/utils/url-encoder';

// Components
import VisualizationPanel from '@/components/visualization-panel';
import ControlsSidebar from '@/components/controls-sidebar';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';
import { OrderInfoModal } from '@/components/modal/order-info-modal';

// Hooks
import { useLocalStorageColor } from '@/hooks/use-local-storage-color';
import { useUrlPersistence } from '@/hooks/use-url-persistence';

// Utils
import {
  applyPresetColorsWithIds,
  isPresetActive as checkPresetActive,
  derivePanelColors,
} from '@/utils/panel-colors';

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
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isOrderInfoModalOpen, setIsOrderInfoModalOpen] = useState(false);
  // Use a ref to track the panel ID associated with the color selector modal.
  // We use a ref instead of state to ensure we always have the latest panel ID
  // when the modal opens, and to avoid stale closure issues in asynchronous
  // callbacks or event handlers that may reference this value after state updates.
  const modalPanelIdRef = useRef<string | null>(null);

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
  }, []);

  // Handle URL persistence for client-side state (only updates URL when state changes)
  useUrlPersistence({
    selectedCase,
    panelColorIds, // Pass color IDs instead of hex values
  });

  const handlePanelClick = useCallback((panelId: string) => {
    setSelectedPanel(panelId);
    // Store the panel ID for the modal to use immediately
    modalPanelIdRef.current = panelId;
    // Open color selection modal when SVG panel is clicked
    setIsColorModalOpen(true);
  }, []);

  // Handle panel selection from sidebar (panel list or color preview)
  const handleSidebarPanelSelect = useCallback((panelId: string | null) => {
    if (panelId) {
      setSelectedPanel(panelId);
      // Store the panel ID for the modal to use immediately
      modalPanelIdRef.current = panelId;
      // Open color selection modal
      setIsColorModalOpen(true);
    } else {
      setSelectedPanel(null);
    }
  }, []);

  const handleModalColorSelect = (color: Color) => {
    // Use the panel ID from ref, which was set when modal was opened
    const targetPanelId = modalPanelIdRef.current || selectedPanel;
    if (targetPanelId) {
      setPanelColorIds((prev) => ({
        ...prev,
        [targetPanelId]: color.id,
      }));
    }
    setIsColorModalOpen(false);
  };

  const getSelectedColor = (panelId?: string): Color | null => {
    // Use provided panelId or fall back to selectedPanel state
    const targetPanelId = panelId || selectedPanel;

    if (!targetPanelId || !material) return null;

    const colorValue = panelColors[targetPanelId];
    const colorName = colorMap[colorValue] || 'Default';

    return {
      id: panelColorIds[targetPanelId] || 'default',
      name: colorName,
      value: colorValue || '#f3f4f6',
      material: '', // Material display name not available in this context
    };
  };

  // Helper function to set default color IDs for all panels
  const setDefaultColorIds = useCallback((caseData: (typeof cases)[string]) => {
    if (!caseData?.material) {
      setPanelColorIds({});
      return;
    }

    const defaultColorId = colors[caseData.material]?.[0]?.id;
    if (!defaultColorId) {
      setPanelColorIds({});
      return;
    }

    const defaultColorIds: PanelColorIds = {};
    caseData.panels.forEach((panel) => {
      defaultColorIds[panel.id] = defaultColorId;
    });
    setPanelColorIds(defaultColorIds);
  }, []);

  const handleCaseSelect = useCallback(
    (caseType: string) => {
      // Always require a case to be selected
      if (!caseType) return;
      setSelectedCase(caseType);
      setSelectedPanel(null);

      // Auto-select first preset
      const caseData = cases[caseType];
      if (caseData?.material) {
        const presetList = colors.presets[caseData.material];
        if (presetList && presetList.length > 0) {
          const firstPreset = presetList[0];
          const result = applyPresetColorsWithIds(firstPreset, caseType, caseData.material);
          setPanelColorIds(result.colorIds);
        } else {
          setDefaultColorIds(caseData);
        }
      } else {
        setDefaultColorIds(cases[caseType]);
      }
    },
    [setDefaultColorIds],
  );

  const handlePresetSelect = useCallback(
    (preset: Preset) => {
      if (!selectedCase || !material) return;
      const result = applyPresetColorsWithIds(preset, selectedCase, material);
      setPanelColorIds(result.colorIds);
    },
    [selectedCase, material],
  );

  const isPresetActive = (preset: Preset): boolean => {
    return checkPresetActive(preset, panelColors, selectedCase, material, panelColorIds);
  };

  const handleOrderInfoClick = () => {
    setIsOrderInfoModalOpen(true);
  };

  // Create color map for display (memoized to prevent unnecessary recalculation)
  const colorMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    if (material) {
      colors[material]?.forEach((color) => {
        map[color.value] = color.name;
      });
    }
    return map;
  }, [material]);

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
            material={material}
            onPresetSelect={handlePresetSelect}
            isPresetActive={isPresetActive}
            panels={currentCase?.panels || []}
            panelColors={panelColors}
            selectedPanel={selectedPanel}
            onPanelSelect={handleSidebarPanelSelect}
            colorMap={colorMap}
            onCaseSelect={handleCaseSelect}
            bgColor={bgColor}
            gridColor={gridColor}
            onBgColorChange={setBgColor}
            onGridColorChange={setGridColor}
            onOrderInfoClick={handleOrderInfoClick}
          />
        </div>
      )}

      {/* Color Selection Modal */}
      {material && (
        <ColorSelectorModal
          isOpen={isColorModalOpen}
          material={material}
          selectedColor={getSelectedColor(modalPanelIdRef.current || undefined)}
          onColorSelect={handleModalColorSelect}
          onClose={() => {
            setIsColorModalOpen(false);
            modalPanelIdRef.current = null; // Clear the ref after closing
          }}
        />
      )}

      {/* Order Info Modal */}
      {selectedCase && material && (
        <OrderInfoModal
          isOpen={isOrderInfoModalOpen}
          selectedCase={selectedCase}
          panelColorIds={panelColorIds}
          material={material}
          onClose={() => setIsOrderInfoModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Configurator;

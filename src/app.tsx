import { useState, useEffect } from 'react';
import { cases } from './data/cases';
import { colors } from './data/colors';
import type { Color, Series } from './types';

// Components
import AppHeader from './components/app-header';
import AppFooter from './components/app-footer';
import VisualizationPanel from './components/visualization-panel';
import ControlsSidebar from './components/controls-sidebar';

// Hooks
import { useLocalStorageColor } from './hooks/use-local-storage-color';
import { useUrlPersistence } from './hooks/use-url-persistence';

// Utils
import {
  getDefaultColors,
  applySeriesColors,
  isSeriesActive as checkSeriesActive,
} from './utils/panel-colors';

interface PanelColors {
  [key: string]: string;
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

function App() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [panelColors, setPanelColors] = useState<PanelColors>({});
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

  // Handle URL persistence
  useUrlPersistence({
    selectedCase,
    panelColors,
    onCaseLoad: (caseType, colors) => {
      setSelectedCase(caseType);
      // Always start with default colors, then merge any loaded colors on top
      const defaultColors = getDefaultColors(caseType);
      const mergedColors = { ...defaultColors, ...colors };
      setPanelColors(mergedColors);
    },
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
    }
  };

  const handleCaseSelect = (caseType: string) => {
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
        const newColors = applySeriesColors(firstSeries, caseType, caseData.material);
        setPanelColors(newColors);
      } else {
        setPanelColors(getDefaultColors(caseType));
      }
    } else {
      setPanelColors(getDefaultColors(caseType));
    }
  };

  const handleSeriesSelect = (series: Series) => {
    if (!selectedCase || !material) return;
    const newColors = applySeriesColors(series, selectedCase, material);
    setPanelColors(newColors);
  };

  const isSeriesActive = (series: Series): boolean => {
    return checkSeriesActive(series, panelColors, selectedCase, material);
  };

  // Create color map for display
  const colorMap: { [key: string]: string } = {};
  if (material) {
    colors[material]?.forEach((color) => {
      colorMap[color.value] = color.name;
    });
  }

  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={selectedCase} onCaseSelect={handleCaseSelect} />

      {/* Main Content Area - 2 Column Grid */}
      <main className="flex-1 overflow-hidden relative">
        {/* Loading overlay */}
        {isLoadingSvg && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="loader relative z-10" />
          </div>
        )}

        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_600px]">
          {/* Left Column - Visualization */}
          <VisualizationPanel
            selectedCase={selectedCase}
            panelColors={panelColors}
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
          />
        </div>
      </main>

      <AppFooter
        bgColor={bgColor}
        gridColor={gridColor}
        onBgColorChange={setBgColor}
        onGridColorChange={setGridColor}
      />
    </div>
  );
}

export default App;

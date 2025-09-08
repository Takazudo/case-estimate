import { useState, useEffect } from 'react';
import { cases } from './data/cases';
import { colors } from './data/colors';
import type { Color, Preset } from './types';
import AllInOneSVG from './components/all-in-one-svg';
import HeaderCaseSelector from './components/header-case-selector';
import ColorPicker from './components/color-picker';
import PanelSelector from './components/panel-selector';
import BackgroundColorPicker from './components/background-color-picker';
import {
  encodeCase,
  decodeCase,
  encodePanelColors,
  decodePanelColors,
  createColorIdMap,
  createColorValueMap,
} from './utils/url-encoder';

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
  BG_COLOR: '#a8a8a8', // 66% gray
  GRID_COLOR: '#969696', // 59% gray
} as const;

// Helper function to validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

// Helper function to safely get color from localStorage with validation
const getStoredColor = (key: string, defaultValue: string): string => {
  try {
    const stored = localStorage.getItem(key);
    if (stored && isValidHexColor(stored)) {
      return stored;
    }
  } catch (error) {
    // localStorage might be unavailable or throw errors
    console.warn(`Failed to read ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Helper function to safely save color to localStorage
const saveColorToStorage = (key: string, value: string): void => {
  try {
    if (isValidHexColor(value)) {
      localStorage.setItem(key, value);
    } else {
      console.warn(`Invalid color value for ${key}:`, value);
    }
  } catch (error) {
    // localStorage might be unavailable or throw errors (e.g., in private browsing)
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

function App() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [panelColors, setPanelColors] = useState<PanelColors>({});
  // Initialize background colors from localStorage with fallback to defaults
  const [bgColor, setBgColor] = useState<string>(() =>
    getStoredColor(STORAGE_KEYS.BG_COLOR, DEFAULT_COLORS.BG_COLOR),
  );
  const [gridColor, setGridColor] = useState<string>(() =>
    getStoredColor(STORAGE_KEYS.GRID_COLOR, DEFAULT_COLORS.GRID_COLOR),
  );

  const currentCase = selectedCase ? cases[selectedCase] : null;
  const material = currentCase?.material;

  // Initialize default colors for all panels (always use first color)
  const getDefaultColors = (caseType: string) => {
    const caseData = cases[caseType];
    if (!caseData || !caseData.material) {
      // Case or material not found, return empty object
      return {};
    }
    const availableColors = colors[caseData.material];
    if (!Array.isArray(availableColors) || availableColors.length === 0) {
      // No available colors, return empty object
      return {};
    }
    const defaultColor = availableColors[0]; // Always use first color
    const defaultColors: PanelColors = {};
    caseData.panels.forEach((panel) => {
      defaultColors[panel.id] = defaultColor.value;
    });
    return defaultColors;
  };

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const caseParam = params.get('c'); // 'c' for case
    const colorsParam = params.get('p'); // 'p' for panels

    // Decode case type
    const decodedCase = caseParam ? decodeCase(caseParam) : null;

    if (decodedCase && cases[decodedCase]) {
      setSelectedCase(decodedCase);

      // Load colors from URL or set defaults
      if (colorsParam) {
        try {
          const colorValueMap = createColorValueMap(colors);
          const decodedColors = decodePanelColors(colorsParam, colorValueMap);

          // If decoded colors are valid, use them; otherwise use defaults
          if (Object.keys(decodedColors).length > 0) {
            setPanelColors(decodedColors);
          } else {
            setPanelColors(getDefaultColors(decodedCase));
          }
        } catch (e) {
          console.error('Failed to decode colors from URL', e);
          setPanelColors(getDefaultColors(decodedCase));
        }
      } else {
        // Set default colors if no URL params
        setPanelColors(getDefaultColors(decodedCase));
      }
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCase) {
      // Encode case as short code
      params.set('c', encodeCase(selectedCase));

      // Encode panel colors if they exist
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

  // Save bgColor to localStorage when it changes
  useEffect(() => {
    saveColorToStorage(STORAGE_KEYS.BG_COLOR, bgColor);
  }, [bgColor]);

  // Save gridColor to localStorage when it changes
  useEffect(() => {
    saveColorToStorage(STORAGE_KEYS.GRID_COLOR, gridColor);
  }, [gridColor]);

  const handlePanelClick = (panelId: string) => {
    setSelectedPanel(panelId);
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
    setPanelColors(getDefaultColors(caseType));
    setSelectedPanel(null);
    setSelectedColor(null);
  };

  const handlePreset = (preset: Preset) => {
    if (!currentCase || !material) return;
    const newColors: PanelColors = {};
    currentCase.panels.forEach((panel) => {
      if (preset.colors.all) {
        const color = colors[material].find((c: Color) => c.id === preset.colors.all);
        if (color) newColors[panel.id] = color.value;
      } else {
        // Apply primary/secondary pattern based on actual preset images
        // Primary (black): side1, side2, front1, bottom1, back1
        // Secondary (colored): front2, bottom2, back2
        const isPrimary =
          panel.id === 'side1' ||
          panel.id === 'side2' ||
          panel.id === 'front1' ||
          panel.id === 'bottom1' ||
          panel.id === 'back1';
        const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary;
        const color = colors[material].find((c: Color) => c.id === colorId);
        if (color) newColors[panel.id] = color.value;
      }
    });
    setPanelColors(newColors);
  };

  const resetColors = () => {
    if (selectedCase) {
      setPanelColors(getDefaultColors(selectedCase));
    }
    setSelectedPanel(null);
    setSelectedColor(null);
  };

  // Create color map for display
  const colorMap: { [key: string]: string } = {};
  if (material) {
    colors[material]?.forEach((color) => {
      colorMap[color.value] = color.name;
    });
  }

  // Generate dynamic SVG background pattern
  const generateBackgroundPattern = (bgColor: string, gridColor: string): string => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternTransform="scale(3)" patternUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <path fill="none" stroke="${gridColor}" d="M10 0v20ZM0 10h20Z"/>
          </pattern>
        </defs>
        <rect width="800%" height="800%" fill="url(#grid)"/>
      </svg>
    `.trim();

    // Convert to data URL
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  };

  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-zd-gray2 border-b border-zd-gray shadow-sm flex-shrink-0">
        <div className="px-hgap-sm py-vgap-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-base md:text-xl text-zd-white flex items-center gap-hgap-xs">
              <img
                src="/takazudo-logo.svg"
                alt="Takazudo Logo"
                className="w-12 h-12 brightness-0 invert mr-[4px]"
              />
              Takazudo Modular Panels
            </h1>
            <div className="flex items-center gap-hgap-xs">
              <HeaderCaseSelector selectedCase={selectedCase} onCaseSelect={handleCaseSelect} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - 2 Column Grid */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_600px]">
          {/* Left Column - Visualization */}
          <div
            className="relative border-r border-zd-gray overflow-hidden"
            style={{
              backgroundImage: `url("${generateBackgroundPattern(bgColor, gridColor)}")`,
              backgroundSize: '60px 60px',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full p-[10px] md:p-[15px] lg:p-[20px] xl:p-[30px] flex items-center justify-center">
              {selectedCase ? (
                <AllInOneSVG
                  caseType={selectedCase}
                  panelColors={panelColors}
                  onPanelClick={handlePanelClick}
                  selectedPanel={selectedPanel}
                  material={material}
                />
              ) : (
                <div className="text-center max-w-md">
                  <h2 className="text-3xl font-bold text-zd-white mb-4">
                    Welcome to Takazudo Modular
                  </h2>
                  <p className="text-lg text-zd-gray mb-8">
                    Design your custom modular synthesizer case with our interactive configurator.
                  </p>
                  <p className="text-zd-gray">
                    Select a case model from the dropdown above to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="bg-zd-black h-full overflow-y-auto overflow-x-hidden min-w-0">
            <div className="p-hgap-xs lg:p-hgap-sm space-y-vgap-sm lg:space-y-vgap-md">
              {currentCase ? (
                <>
                  {/* Panel Selector */}
                  <PanelSelector
                    panels={currentCase.panels}
                    panelColors={panelColors}
                    selectedPanel={selectedPanel}
                    onPanelSelect={setSelectedPanel}
                    colorMap={colorMap}
                  />

                  {/* Color Picker */}
                  {selectedPanel && material && (
                    <ColorPicker
                      material={material}
                      selectedColor={selectedColor}
                      onColorSelect={handleColorSelect}
                    />
                  )}

                  {/* Presets for 3DP */}
                  {material === '3dp' && colors.presets['3dp'] && (
                    <div className="space-y-vgap-xs">
                      <h3 className="font-semibold text-zd-white">Presets</h3>
                      <div className="space-y-vgap-2xs">
                        {colors.presets['3dp'].map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePreset(preset)}
                            className="w-full text-left p-hgap-xs rounded-lg border-2 border-zd-gray hover:border-zd-link transition-all"
                          >
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={resetColors}
                      className="w-full px-hgap-xs py-vgap-2xs bg-zd-gray2 text-zd-white rounded-lg hover:bg-zd-gray transition-colors"
                    >
                      Reset All Colors
                    </button>
                  </div>

                  {/* Info */}
                  <div className="text-sm text-zd-gray space-y-vgap-2xs">
                    <p>• Click on any panel to select it</p>
                    <p>• Choose a color to apply to the selected panel</p>
                    <p>• Your configuration is saved in the URL</p>
                  </div>

                  {/* Footer Info */}
                  <div className="text-sm text-zd-gray pt-4 border-t border-zd-gray">
                    <p>© 2025 Takazudo Modular</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-zd-gray mt-8">
                  <p>Select a case model to begin customization</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-zd-gray2 border-t border-zd-gray fixed bottom-0 left-0 right-0 z-10">
        <div className="px-hgap-sm py-vgap-xs">
          <div className="flex items-center justify-between">
            <BackgroundColorPicker
              bgColor={bgColor}
              gridColor={gridColor}
              onBgColorChange={setBgColor}
              onGridColorChange={setGridColor}
            />
            <div className="text-xs md:text-sm text-zd-gray">© 2025 Takazudo Modular</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

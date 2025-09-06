import { useState, useEffect } from 'react';
import { cases } from './data/cases';
import { colors } from './data/colors';
import type { Color, Preset } from './types';
import AllInOneSVG from './components/all-in-one-svg';
import HeaderCaseSelector from './components/header-case-selector';
import ColorPicker from './components/color-picker';
import PanelSelector from './components/panel-selector';
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

function App() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [panelColors, setPanelColors] = useState<PanelColors>({});

  const currentCase = selectedCase ? cases[selectedCase] : null;
  const material = currentCase?.material;

  // Initialize default colors for all panels (always use first color)
  const getDefaultColors = (caseType: string) => {
    const caseData = cases[caseType];
    const availableColors = colors[caseData.material];
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
    const newColors: PanelColors = {};
    currentCase.panels.forEach((panel) => {
      if (preset.colors.all) {
        const color = colors[material].find((c) => c.id === preset.colors.all);
        if (color) newColors[panel.id] = color.value;
      } else {
        // Apply primary/secondary pattern
        const isPrimary = panel.id.includes('side') || panel.id.includes('center');
        const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary;
        const color = colors[material].find((c) => c.id === colorId);
        if (color) newColors[panel.id] = color.value;
      }
    });
    setPanelColors(newColors);
  };

  const resetColors = () => {
    setPanelColors(getDefaultColors(selectedCase));
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Takazudo Modular Case Configurator</h1>
            <div className="flex items-center gap-4">
              <HeaderCaseSelector selectedCase={selectedCase} onCaseSelect={handleCaseSelect} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex pt-16 pb-16 min-h-screen">
        {/* Left Panel - Visualization or Welcome */}
        <div className="flex-1 bg-white border-r border-gray-200 mr-96">
          <div className="h-full p-8 flex items-center justify-center">
            {selectedCase ? (
              <AllInOneSVG
                caseType={selectedCase}
                panelColors={panelColors}
                onPanelClick={handlePanelClick}
                selectedPanel={selectedPanel}
              />
            ) : (
              <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Takazudo Modular
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Design your custom modular synthesizer case with our interactive configurator.
                </p>
                <p className="text-gray-500">
                  Select a case model from the dropdown above to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-96 bg-gray-50 h-full overflow-y-auto fixed right-0 top-16 bottom-16">
          <div className="p-6 space-y-6">
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
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Presets</h3>
                    <div className="space-y-2">
                      {colors.presets['3dp'].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handlePreset(preset)}
                          className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                        >
                          <span className="text-sm">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={resetColors}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reset All Colors
                  </button>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Click on any panel to select it</p>
                  <p>• Choose a color to apply to the selected panel</p>
                  <p>• Your configuration is saved in the URL</p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <p>Select a case model to begin customization</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">© 2025 Takazudo Modular</div>
            <div className="text-sm text-gray-500">Configuration saved in URL</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

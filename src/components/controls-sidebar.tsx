import { colors } from '../data/colors';
import { cases } from '../data/cases';
import type { Color, Series } from '../types';
import Tabs from './tabs';
import SeriesCard from './series-card';
import PanelSelector from './panel-selector';
import ColorPicker from './color-picker';
import CustomColorPreview from './custom-color-preview';

interface ControlsSidebarProps {
  selectedCase: string | null;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  material: 'acrylic' | '3dp' | undefined;
  onSeriesSelect: (series: Series) => void;
  isSeriesActive: (series: Series) => boolean;
  panels: Array<{ id: string; name: string }>;
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string | null) => void;
  colorMap: { [key: string]: string };
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
}

export default function ControlsSidebar({
  selectedCase,
  activeTab,
  onTabChange,
  material,
  onSeriesSelect,
  isSeriesActive,
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
  selectedColor,
  onColorSelect,
}: ControlsSidebarProps) {
  const currentCase = selectedCase ? cases[selectedCase] : null;

  return (
    <div className="bg-zd-black h-full overflow-y-scroll overflow-x-hidden min-w-0">
      {currentCase ? (
        <>
          <div className="px-hgap-sm lg:px-hgap-md py-vgap-md">
            <Tabs
              activeTab={activeTab}
              onTabChange={onTabChange}
              tabs={[
                {
                  id: 'series',
                  label: 'Series',
                  content: (
                    <div className="space-y-vgap-sm pt-vgap-md">
                      {material && colors.series[material] && selectedCase && (
                        <>
                          {colors.series[material]
                            .filter((series) => {
                              // For 10BOX Lite, only show YamiKage series
                              if (selectedCase === '10box-lite') {
                                return series.id === 'yamikage';
                              }
                              return true;
                            })
                            .map((series) => (
                              <SeriesCard
                                key={series.id}
                                series={series}
                                material={material}
                                caseType={selectedCase}
                                onClick={onSeriesSelect}
                                isActive={isSeriesActive(series)}
                              />
                            ))}
                        </>
                      )}
                    </div>
                  ),
                },
                {
                  id: 'custom',
                  label: 'Custom',
                  content: (
                    <div className="pt-vgap-md">
                      {/* Color preview bar at the top of custom tab */}
                      {selectedCase && (
                        <div className="-mx-hgap-sm lg:-mx-hgap-md mb-vgap-md">
                          <CustomColorPreview
                            caseType={selectedCase}
                            panelColors={panelColors}
                            selectedPanel={selectedPanel}
                            onPanelSelect={onPanelSelect}
                          />
                        </div>
                      )}

                      <div className="space-y-vgap-sm">
                        <PanelSelector
                          panels={panels}
                          panelColors={panelColors}
                          selectedPanel={selectedPanel}
                          onPanelSelect={onPanelSelect}
                          colorMap={colorMap}
                        />

                        {selectedPanel && material && (
                          <ColorPicker
                            material={material}
                            selectedColor={selectedColor}
                            onColorSelect={onColorSelect}
                          />
                        )}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="px-hgap-sm lg:px-hgap-md py-vgap-md space-y-vgap-sm lg:space-y-vgap-md">
            <div className="text-sm text-zd-gray space-y-vgap-2xs">
              <p>• Click on any panel to select it</p>
              <p>• Choose a color to apply to the selected panel</p>
              <p>• Your configuration is saved in the URL</p>
            </div>

            <div className="text-sm text-zd-gray pt-4 border-t border-zd-gray">
              <p>© 2025 Takazudo Modular</p>
            </div>
          </div>
        </>
      ) : (
        <div className="px-hgap-sm lg:px-hgap-md py-vgap-md">
          <div className="text-center text-zd-gray mt-8">
            <p>Select a case model to begin customization</p>
          </div>
        </div>
      )}
    </div>
  );
}

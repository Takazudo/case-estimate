'use client';

import { colors } from '@/data/colors';
import { cases } from '@/data/cases';
import type { Preset } from '@/types';
import Tabs from './tabs';
import PresetCard from './preset-card';
import PanelListWithColorPicker from './panel-list-with-color-picker';
import CustomColorPreview from './custom-color-preview';
import ModelSelector from './model-selector';
import BackgroundColorPicker from './background-color-picker';

interface ControlsSidebarProps {
  selectedCase: string | null;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  material: 'acrylic' | '3dp' | undefined;
  onPresetSelect: (preset: Preset) => void;
  isPresetActive: (preset: Preset) => boolean;
  panels: Array<{ id: string; name: string }>;
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string | null) => void;
  colorMap: { [key: string]: string };
  onCaseSelect: (caseType: string) => void;
  bgColor?: string;
  gridColor?: string;
  onBgColorChange?: (color: string) => void;
  onGridColorChange?: (color: string) => void;
}

export default function ControlsSidebar({
  selectedCase,
  activeTab,
  onTabChange,
  material,
  onPresetSelect,
  isPresetActive,
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
  onCaseSelect,
  bgColor,
  gridColor,
  onBgColorChange,
  onGridColorChange,
}: ControlsSidebarProps) {
  const currentCase = selectedCase ? cases[selectedCase] : null;

  return (
    <div className="bg-zd-black h-full overflow-y-scroll overflow-x-hidden min-w-0 pt-[96px]">
      {/* Model selector at the top */}
      <div className="px-hgap-sm lg:px-hgap-md pt-vgap-md pb-vgap-sm border-b border-zd-gray">
        <ModelSelector selectedCase={selectedCase} onCaseSelect={onCaseSelect} />
      </div>

      {currentCase ? (
        <>
          <div className="px-hgap-sm lg:px-hgap-md py-vgap-md">
            <Tabs
              activeTab={activeTab}
              onTabChange={onTabChange}
              tabs={[
                {
                  id: 'preset',
                  label: 'プリセット',
                  content: (
                    <div className="space-y-vgap-sm pt-vgap-md">
                      {material && colors.presets[material] && selectedCase && (
                        <>
                          {colors.presets[material]
                            .filter((preset) => {
                              // For 10BOX models and zudo-block-60-open 3DP Type A/B, only show YamiKage preset
                              if (
                                selectedCase.startsWith('10box-') ||
                                selectedCase === 'zudo-block-60-open-3DP-A' ||
                                selectedCase === 'zudo-block-60-open-3DP-B'
                              ) {
                                return preset.id === 'yamikage';
                              }
                              return true;
                            })
                            .map((preset) => (
                              <PresetCard
                                key={preset.id}
                                preset={preset}
                                material={material}
                                caseType={selectedCase}
                                onClick={onPresetSelect}
                                isActive={isPresetActive(preset)}
                              />
                            ))}
                        </>
                      )}
                    </div>
                  ),
                },
                {
                  id: 'custom',
                  label: 'カスタム',
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
                        {material && (
                          <PanelListWithColorPicker
                            panels={panels}
                            panelColors={panelColors}
                            onPanelClick={onPanelSelect}
                            colorMap={colorMap}
                            material={material}
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
              <p>• Click on a panel to choose its color</p>
              <p>• Your configuration is saved in the URL</p>
            </div>

            {bgColor && gridColor && onBgColorChange && onGridColorChange && (
              <div className="pt-4 border-t border-zd-gray">
                <BackgroundColorPicker
                  bgColor={bgColor}
                  gridColor={gridColor}
                  onBgColorChange={onBgColorChange}
                  onGridColorChange={onGridColorChange}
                />
              </div>
            )}
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

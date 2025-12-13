'use client';

import type { Panel } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { DEFAULT_PANEL_COLOR } from '@/data/colors';

type PanelListVariant = 'default' | 'color-picker';

interface PanelListUnifiedProps {
  panels: Panel[];
  panelColors: { [key: string]: string };
  onPanelSelect: (panelId: string) => void;
  colorMap: { [key: string]: string };
  selectedPanel?: string | null;
  variant?: PanelListVariant;
}

const PanelListUnified = ({
  panels,
  panelColors,
  onPanelSelect,
  colorMap,
  selectedPanel = null,
  variant = 'default',
}: PanelListUnifiedProps) => {
  const isColorPicker = variant === 'color-picker';

  return (
    <div className="space-y-vgap-xs">
      <h3 className={`font-semibold text-zd-white ${isColorPicker ? 'pb-vgap-xs' : ''}`}>
        {isColorPicker ? 'Select Panel' : 'Panels'}
      </h3>
      <div className={`space-y-vgap-2xs ${!isColorPicker ? 'max-h-[300px] overflow-y-auto' : ''}`}>
        {panels.map((panel) => {
          const colorValue = panelColors[panel.id];
          const colorName = colorMap[colorValue] || 'Default';
          const isSelected = selectedPanel === panel.id;

          return (
            <button
              key={panel.id}
              onClick={() => onPanelSelect(panel.id)}
              className={`
                w-full text-left rounded-lg border-2 transition-all
                ${
                  isColorPicker
                    ? 'py-vgap-sm px-hgap-sm border-zd-gray hover:border-zd-link bg-zd-surface-2'
                    : `p-hgap-xs ${
                        isSelected
                          ? 'border-zd-link bg-zd-active'
                          : 'border-zd-gray hover:border-zd-link'
                      }`
                }
              `}
              data-testid={isColorPicker ? `panel-button-${panel.id}` : undefined}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isColorPicker ? 'text-zd-white' : ''}`}>
                  {panel.name}
                </span>
                <div className={`flex items-center ${isColorPicker ? 'gap-hgap-2xs' : ''}`}>
                  <PanelColorSwatch
                    value={colorValue}
                    fallbackColor={DEFAULT_PANEL_COLOR}
                    className={`relative overflow-hidden rounded border border-zd-gray ${
                      isColorPicker ? 'w-6 h-6' : 'w-5 h-5 mr-hgap-2xs'
                    }`}
                    patternViewBoxSize={20}
                    dataTestId={
                      isColorPicker ? `panel-button-swatch-${panel.id}` : 'panel-list-swatch'
                    }
                  />
                  <span className={`text-zd-gray ${isColorPicker ? 'text-sm' : ''}`}>
                    {colorName}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PanelListUnified;

'use client';

import type { Panel } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';

interface PanelListWithColorPickerProps {
  panels: Panel[];
  panelColors: { [key: string]: string };
  onPanelClick: (panelId: string) => void;
  colorMap: { [key: string]: string };
  material: 'acrylic' | '3dp';
}

const PanelListWithColorPicker = ({
  panels,
  panelColors,
  onPanelClick,
  colorMap,
}: PanelListWithColorPickerProps) => {
  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white pb-vgap-xs">Select Panel</h3>
      <div className="space-y-vgap-2xs">
        {panels.map((panel) => {
          const colorValue = panelColors[panel.id];
          const colorName = colorMap[colorValue] || 'Default';

          return (
            <button
              key={panel.id}
              onClick={() => onPanelClick(panel.id)}
              className={`
                w-full text-left py-vgap-sm px-hgap-sm rounded-lg border-2 transition-all
                border-zd-gray hover:border-zd-link
                bg-zd-surface-2
              `}
              data-testid={`panel-button-${panel.id}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zd-white">{panel.name}</span>
                <div className="flex items-center gap-hgap-2xs">
                  <PanelColorSwatch
                    value={colorValue}
                    fallbackColor="#1f2937"
                    className="relative overflow-hidden w-6 h-6 rounded border border-zd-gray"
                    patternViewBoxSize={20}
                    dataTestId={`panel-button-swatch-${panel.id}`}
                  />
                  <span className="text-sm text-zd-gray">{colorName}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PanelListWithColorPicker;

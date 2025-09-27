'use client';

import type { Panel } from '@/types';
import PatternFill from '@/components/pattern-fill';
import { isPanelPattern, getPanelPatternFallbackColor } from '@/utils/panel-patterns';

interface PanelListProps {
  panels: Panel[];
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string) => void;
  colorMap: { [key: string]: string };
}

const PanelList = ({
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
}: PanelListProps) => {
  // Helper to render color swatch (handle patterns)
  const renderColorSwatch = (colorValue: string | undefined) => {
    const color = colorValue || '#1f2937';

    if (isPanelPattern(color)) {
      const fallback = getPanelPatternFallbackColor(color);
      return (
        <div
          className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs overflow-hidden relative"
          style={{ backgroundColor: fallback }}
        >
          <PatternFill
            pattern={color}
            className="absolute inset-0 w-full h-full"
            viewBoxSize={20}
          />
        </div>
      );
    }

    return (
      <div
        className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
        style={{ backgroundColor: color }}
      />
    );
  };

  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white">Panels</h3>
      <div className="space-y-vgap-2xs max-h-[300px] overflow-y-auto">
        {panels.map((panel) => {
          const colorValue = panelColors[panel.id];
          const colorName = colorMap[colorValue] || 'Default';

          return (
            <button
              key={panel.id}
              onClick={() => onPanelSelect(panel.id)}
              className={`
                w-full text-left p-hgap-xs rounded-lg border-2 transition-all
                ${
                  selectedPanel === panel.id
                    ? 'border-zd-link bg-zd-active'
                    : 'border-zd-gray hover:border-zd-link'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{panel.name}</span>
                <div className="flex items-center">
                  {renderColorSwatch(colorValue)}
                  <span className="text-zd-gray">{colorName}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PanelList;

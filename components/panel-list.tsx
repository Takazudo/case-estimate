'use client';

import type { Panel } from '@/types';

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
  const renderColorSwatch = (colorValue: string | undefined, panelId: string) => {
    const color = colorValue || '#1f2937';
    const isPattern = color.startsWith('pattern-');

    if (isPattern && color === 'pattern-red-green-stripe') {
      return (
        <div className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs overflow-hidden relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 20 20">
            <defs>
              <pattern
                id={`list-stripe-${panelId}`}
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill="#a4534a" />
                <rect x="0" y="0" width="3" height="6" fill="#7bc97d" />
              </pattern>
            </defs>
            <rect width="20" height="20" fill={`url(#list-stripe-${panelId})`} />
          </svg>
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
                  {renderColorSwatch(colorValue, panel.id)}
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

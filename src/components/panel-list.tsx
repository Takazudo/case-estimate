import type { Panel } from '../types';

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
                  <div
                    className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
                    style={{ backgroundColor: colorValue || '#1f2937' }}
                  />
                  <span className="text-xs text-zd-gray">{colorName}</span>
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

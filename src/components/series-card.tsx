import type { Series, Color } from '../types';
import { colors } from '../data/colors';
import { cases } from '../data/cases';

interface SeriesCardProps {
  series: Series;
  material: 'acrylic' | '3dp';
  caseType: string;
  onClick: (series: Series) => void;
  isActive?: boolean;
}

export default function SeriesCard({
  series,
  material,
  caseType,
  onClick,
  isActive = false,
}: SeriesCardProps) {
  const currentCase = cases[caseType];
  const availableColors = colors[material];

  const getPanelColor = (panelId: string): string => {
    if (series.colors.all) {
      const color = availableColors.find((c: Color) => c.id === series.colors.all);
      return color?.value || '#000000';
    } else {
      // For 10BOX, all panels should use the same color for YamiKage
      if (caseType === '10box-3dp') {
        const color = availableColors.find((c: Color) => c.id === series.colors.all);
        return color?.value || '#000000';
      }

      const isPrimary =
        panelId === 'side1' ||
        panelId === 'side2' ||
        panelId === 'front1' ||
        panelId === 'bottom1' ||
        panelId === 'back1';
      const colorId = isPrimary ? series.colors.primary : series.colors.secondary;
      const color = availableColors.find((c: Color) => c.id === colorId);
      return color?.value || '#000000';
    }
  };

  return (
    <button
      onClick={() => onClick(series)}
      className={`w-full border-3 transition-all ${
        isActive ? 'border-zd-white bg-zd-gray2' : 'border-zd-gray hover:border-zd-white'
      }`}
    >
      <div className="flex items-baseline justify-between px-hgap-sm py-vgap-sm border-b border-zd-gray flex-col lg:flex-row">
        <span className="text-zd-white text-lg">{series.name}</span>
        <span className="text-zd-gray text-sm">{series.description}</span>
      </div>

      <div className="flex">
        {currentCase.panels.map((panel) => (
          <div
            key={panel.id}
            className="flex-1 aspect-square border-l-1 first:border-l-0 border-zd-gray"
            style={{ backgroundColor: getPanelColor(panel.id) }}
            title={panel.name}
          />
        ))}
      </div>
    </button>
  );
}

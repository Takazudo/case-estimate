'use client';

import type { Preset, Color } from '@/types';
import { colors } from '@/data/colors';
import { cases } from '@/data/cases';
import { is10BoxModel } from '@/utils/case-model-type';

interface PresetCardProps {
  preset: Preset;
  material: 'acrylic' | '3dp';
  caseType: string;
  onClick: (preset: Preset) => void;
  isActive?: boolean;
}

export default function PresetCard({
  preset,
  material,
  caseType,
  onClick,
  isActive = false,
}: PresetCardProps) {
  const currentCase = cases[caseType];
  const availableColors = colors[material];

  const getPanelColor = (panelId: string): string => {
    if (preset.colors.all) {
      const color = availableColors.find((c: Color) => c.id === preset.colors.all);
      return color?.value || '#000000';
    } else {
      // For 10BOX, all panels should use the same color for YamiKage
      if (is10BoxModel(caseType)) {
        const color = availableColors.find((c: Color) => c.id === preset.colors.all);
        return color?.value || '#000000';
      }

      // For upgrade models, alternating pattern based on physical display order
      // Physical display order: back1, back2, bottom1, bottom2, top1, top2
      // Desired pattern: black, red, black, red, black, red
      // Panels ending in 1 are primary (black): side1, side2, front1, back1, bottom1, top1
      // Panels ending in 2 are secondary (colored): back2, bottom2, front2, top2
      const isPrimary =
        panelId === 'side1' ||
        panelId === 'side2' ||
        panelId === 'front1' ||
        panelId === 'back1' ||
        panelId === 'bottom1' ||
        panelId === 'top1';
      const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary;
      const color = availableColors.find((c: Color) => c.id === colorId);
      return color?.value || '#000000';
    }
  };

  return (
    <button
      onClick={() => onClick(preset)}
      className={`w-full border-3 transition-all ${
        isActive ? 'border-zd-white bg-zd-gray2' : 'border-zd-gray hover:border-zd-white'
      }`}
    >
      <div className="flex items-baseline justify-between px-hgap-sm py-vgap-sm border-b border-zd-gray flex-col lg:flex-row">
        <span className="text-zd-white text-lg">{preset.name}</span>
        <span className="text-zd-gray text-sm">{preset.description}</span>
      </div>

      <div className="flex h-12">
        {currentCase.panels.map((panel) => (
          <div
            key={panel.id}
            className="flex-1 border-l-1 first:border-l-0 border-zd-gray"
            style={{ backgroundColor: getPanelColor(panel.id) }}
            title={panel.name}
          />
        ))}
      </div>
    </button>
  );
}

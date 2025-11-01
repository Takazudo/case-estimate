'use client';

import { useState } from 'react';
import type { Panel, Color } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';

interface PanelListWithColorPickerProps {
  panels: Panel[];
  panelColors: { [key: string]: string };
  onPanelColorChange: (panelId: string, color: Color) => void;
  colorMap: { [key: string]: string };
  material: 'acrylic' | '3dp';
}

const PanelListWithColorPicker = ({
  panels,
  panelColors,
  onPanelColorChange,
  colorMap,
  material,
}: PanelListWithColorPickerProps) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const handlePanelClick = (panelId: string) => {
    setSelectedPanelId(panelId);
    setIsColorModalOpen(true);
  };

  const handleColorSelect = (color: Color) => {
    if (selectedPanelId) {
      onPanelColorChange(selectedPanelId, color);
    }
  };

  const getSelectedColor = (): Color | null => {
    if (!selectedPanelId) return null;

    const colorValue = panelColors[selectedPanelId];
    const colorName = colorMap[colorValue] || 'Default';

    // Return a minimal Color object - the actual color data will be used from the modal
    return {
      id: colorValue || 'default',
      name: colorName,
      value: colorValue || '#f3f4f6',
      material: material === 'acrylic' ? 'Acrylic' : '3DP',
    };
  };

  return (
    <>
      <div className="space-y-vgap-xs">
        <h3 className="font-semibold text-zd-white pb-vgap-xs">Select Panel</h3>
        <div className="space-y-vgap-2xs">
          {panels.map((panel) => {
            const colorValue = panelColors[panel.id];
            const colorName = colorMap[colorValue] || 'Default';

            return (
              <button
                key={panel.id}
                onClick={() => handlePanelClick(panel.id)}
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

      <ColorSelectorModal
        isOpen={isColorModalOpen}
        material={material}
        selectedColor={getSelectedColor()}
        onColorSelect={handleColorSelect}
        onClose={() => setIsColorModalOpen(false)}
      />
    </>
  );
};

export default PanelListWithColorPicker;

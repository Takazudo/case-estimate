'use client';

import { useState } from 'react';
import type { Color } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';

interface ColorPickerProps {
  material: 'acrylic' | '3dp';
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
}

const ColorPicker = ({ material, selectedColor, onColorSelect }: ColorPickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const materialLabel = material === 'acrylic' ? 'アクリル' : '3Dプリント';

  return (
    <>
      <div className="space-y-vgap-xs">
        <h3 className="font-semibold text-zd-white pb-vgap-xs">Colors</h3>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            w-full flex items-center gap-hgap-sm
            rounded-lg border-2 transition-all text-left
            py-vgap-sm px-hgap-sm
            border-zd-gray hover:border-zd-link
            bg-zd-surface-2
          `}
          data-testid="color-picker-button"
        >
          {selectedColor ? (
            <>
              <PanelColorSwatch
                value={selectedColor.value}
                className="relative overflow-hidden w-8 h-8 rounded border border-zd-gray flex-shrink-0"
                dataTestId="color-picker-current-swatch"
              />
              <span className="flex flex-1 flex-col">
                <span className="font-medium text-zd-white">{selectedColor.name}</span>
                <span className="text-sm text-zd-gray">{selectedColor.material}</span>
              </span>
            </>
          ) : (
            <span className="flex flex-1 flex-col">
              <span className="font-medium text-zd-white">カラーを選択</span>
              <span className="text-sm text-zd-gray">{materialLabel}</span>
            </span>
          )}

          {/* Arrow icon */}
          <svg
            className="w-5 h-5 text-zd-gray flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <ColorSelectorModal
        isOpen={isModalOpen}
        material={material}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ColorPicker;

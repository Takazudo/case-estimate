'use client';

import React from 'react';
import { BaseModal } from './base-modal';
import { PaletteIcon } from '@/components/icons/palette-icon';
import { colors } from '@/data/colors';
import type { Color } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';

interface ColorSelectorModalProps {
  isOpen: boolean;
  material: 'acrylic' | '3dp';
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
  onClose: () => void;
}

const ColorSelectorModal: React.FC<ColorSelectorModalProps> = ({
  isOpen,
  material,
  selectedColor,
  onColorSelect,
  onClose,
}) => {
  const availableColors = colors[material] || [];

  const handleColorClick = (color: Color) => {
    onColorSelect(color);
    onClose();
  };

  const title = material === 'acrylic' ? 'カラー選択 (アクリル)' : 'カラー選択 (3Dプリント)';
  const titleEn = material === 'acrylic' ? 'Acrylic Color Selection' : '3D Printed Color Selection';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={<PaletteIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />}
      ariaLabelledBy="color-selector-modal-title"
    >
      <div className="space-y-vgap-md">
        <p className="text-zd-gray text-sm hidden lg:block">{titleEn}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-hgap-sm gap-y-vgap-sm">
          {availableColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color)}
              className={`
                group relative
                flex flex-col
                border-2 rounded-lg
                transition-all
                overflow-hidden
                ${
                  selectedColor?.id === color.id
                    ? 'border-zd-link bg-zd-active'
                    : 'border-zd-gray hover:border-zd-link'
                }
              `}
            >
              {/* Color preview - large square */}
              <div className="aspect-square w-full relative bg-zd-surface-3 flex items-center justify-center overflow-hidden">
                {color.imageUrl ? (
                  <img
                    src={color.imageUrl}
                    alt={color.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <PanelColorSwatch
                    value={color.value}
                    className="w-full h-full"
                    dataTestId={`color-modal-swatch-${color.id}`}
                  />
                )}
              </div>

              {/* Color info */}
              <div className="p-hgap-xs bg-zd-black border-t border-zd-gray">
                <div className="text-zd-white font-medium text-sm">{color.name}</div>
                <div className="text-zd-gray text-xs">{color.material}</div>
              </div>

              {/* Selected indicator */}
              {selectedColor?.id === color.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-zd-link rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-zd-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export { ColorSelectorModal };

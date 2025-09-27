'use client';

import { colors } from '@/data/colors';
import type { Color } from '@/types';

interface ColorPickerProps {
  material: 'acrylic' | '3dp';
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
}

const ColorPicker = ({ material, selectedColor, onColorSelect }: ColorPickerProps) => {
  const availableColors = colors[material] || [];

  // Render color thumbnail with pattern support
  const renderColorThumbnail = (color: Color) => {
    if (color.value === 'pattern-red-green-stripe') {
      // Create an inline SVG with the stripe pattern
      return (
        <span className="w-6 h-6 rounded mr-hgap-xs border border-zd-gray flex-shrink-0 overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <defs>
              <pattern
                id="thumb-red-green-stripe"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <rect width="8" height="8" fill="#a4534a" />
                <rect x="0" y="0" width="4" height="8" fill="#7bc97d" />
              </pattern>
            </defs>
            <rect width="24" height="24" fill="url(#thumb-red-green-stripe)" />
          </svg>
        </span>
      );
    }

    // Regular color
    return (
      <span
        className="w-6 h-6 rounded mr-hgap-xs border border-zd-gray flex-shrink-0"
        style={{ backgroundColor: color.value }}
      />
    );
  };

  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white pb-vgap-xs">Colors</h3>
      <div className="grid grid-cols-1 gap-vgap-2xs text-sm">
        {availableColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color)}
            className={`
              flex items-center rounded-lg border-2 transition-all text-left
              py-vgap-sm px-hgap-sm
              ${
                selectedColor?.id === color.id
                  ? 'border-zd-link bg-zd-active'
                  : 'border-zd-gray hover:border-zd-link'
              }
            `}
          >
            {renderColorThumbnail(color)}
            <span className="flex flex-1 flex-col lg:flex-row">
              <span className="font-medium text-zd-white flex-1">{color.name}</span>
              <span className="text-zd-gray nowrap">{color.material}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

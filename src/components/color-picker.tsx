import { colors } from '../data/colors';
import type { Color } from '../types';

interface ColorPickerProps {
  material: 'acrylic' | '3dp';
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
}

const ColorPicker = ({ material, selectedColor, onColorSelect }: ColorPickerProps) => {
  const availableColors = colors[material] || [];

  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white">Colors</h3>
      <div className="grid grid-cols-1 gap-vgap-2xs">
        {availableColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color)}
            className={`
              flex items-center p-hgap-xs rounded-lg border-2 transition-all text-left
              ${
                selectedColor?.id === color.id
                  ? 'border-zd-link bg-zd-active'
                  : 'border-zd-gray hover:border-zd-link'
              }
            `}
          >
            <div
              className="w-6 h-6 rounded mr-hgap-xs border border-zd-gray flex-shrink-0"
              style={{ backgroundColor: color.value }}
            />
            <div className="flex-1">
              <div className="font-medium text-zd-white">{color.name}</div>
              <div className="text-zd-gray">{color.material}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

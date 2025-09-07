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
    <div className="space-y-3">
      <h3 className="font-semibold text-zd-white">Colors</h3>
      <div className="grid grid-cols-1 gap-2">
        {availableColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color)}
            className={`
              flex items-center p-3 rounded-lg border-2 transition-all text-left
              ${
                selectedColor?.id === color.id
                  ? 'border-zd-link bg-zd-active'
                  : 'border-zd-gray hover:border-zd-link'
              }
            `}
          >
            <div
              className="w-6 h-6 rounded mr-3 border border-zd-gray flex-shrink-0"
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

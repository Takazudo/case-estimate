import { colors } from '../data/colors';
import type { Color } from '../types';

interface ColorPickerProps {
  material: 'acrylic' | '3d-printed';
  selectedColor: Color | null;
  onColorSelect: (color: Color) => void;
}

const ColorPicker = ({ material, selectedColor, onColorSelect }: ColorPickerProps) => {
  const availableColors = colors[material] || [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Colors</h3>
      <div className="grid grid-cols-2 gap-2">
        {availableColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color)}
            className={`
              flex items-center justify-center p-3 rounded-lg border-2 transition-all
              ${
                selectedColor?.id === color.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div
              className="w-6 h-6 rounded mr-2 border border-gray-300"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-sm">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

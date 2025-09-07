import { useState, useEffect, useRef } from 'react';

interface BackgroundColorPickerProps {
  bgColor: string;
  gridColor: string;
  onBgColorChange: (color: string) => void;
  onGridColorChange: (color: string) => void;
}

function BackgroundColorPicker({
  bgColor,
  gridColor,
  onBgColorChange,
  onGridColorChange,
}: BackgroundColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Convert hex color to grayscale value (0-255)
  const hexToGrayscale = (hex: string): number => {
    // Remove the # if present
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    // Use the average for grayscale (since we expect R=G=B for grayscale colors)
    return Math.round((r + g + b) / 3);
  };

  // Convert grayscale value (0-255) to hex color
  const grayscaleToHex = (value: number): string => {
    const hexValue = Math.round(value).toString(16).padStart(2, '0');
    return `#${hexValue}${hexValue}${hexValue}`;
  };

  // Get current grayscale values
  const bgGrayscale = hexToGrayscale(bgColor);
  const gridGrayscale = hexToGrayscale(gridColor);

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Button showing both colors */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex rounded overflow-hidden border-2 border-gray-400 hover:border-gray-600 transition-colors"
        title="Adjust background colors"
      >
        <div className="w-8 h-8" style={{ backgroundColor: gridColor }} />
        <div className="w-8 h-8" style={{ backgroundColor: bgColor }} />
      </button>

      {/* Popup with sliders */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-12 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20"
          style={{ minWidth: '280px' }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h3 className="text-sm font-semibold text-gray-700 mb-4">Background Settings</h3>

          {/* Grid/Line Color Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600 font-medium">Line</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: gridColor }}
                />
                <span className="text-xs text-gray-500 font-mono w-12">
                  {Math.round((gridGrayscale / 255) * 100)}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={gridGrayscale}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onGridColorChange(grayscaleToHex(value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #000000 0%, #ffffff 100%)`,
              }}
            />
          </div>

          {/* Background Color Slider */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600 font-medium">Background</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: bgColor }}
                />
                <span className="text-xs text-gray-500 font-mono w-12">
                  {Math.round((bgGrayscale / 255) * 100)}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={bgGrayscale}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onBgColorChange(grayscaleToHex(value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #000000 0%, #ffffff 100%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BackgroundColorPicker;

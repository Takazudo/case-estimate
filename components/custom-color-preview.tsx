'use client';

import { useEffect, useRef, useState } from 'react';
import { cases } from '@/data/cases';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';
import { resolvePanelColorBackground } from '@/utils/panel-color-utils';
import type { Color } from '@/types';

interface CustomColorPreviewProps {
  caseType: string;
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string) => void;
  onColorSelect?: (panelId: string, color: Color) => void;
  colorMap?: { [key: string]: string };
  material?: 'acrylic' | '3dp';
}

const CustomColorPreview = ({
  caseType,
  panelColors,
  selectedPanel,
  onPanelSelect,
  onColorSelect,
  colorMap,
  material,
}: CustomColorPreviewProps) => {
  const currentCase = cases[caseType];
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when focus is within the preview container
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();

        const buttons = Array.from(
          containerRef.current.querySelectorAll('button'),
        ) as HTMLButtonElement[];
        const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);

        let nextIndex: number;
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        } else {
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        }

        buttons[nextIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePanelClick = (panelId: string) => {
    onPanelSelect(panelId);

    // If onColorSelect callback is provided, also open the color modal
    if (onColorSelect && material) {
      setSelectedPanelId(panelId);
      setIsColorModalOpen(true);
    }
  };

  const handleColorSelect = (color: Color) => {
    if (selectedPanelId && onColorSelect) {
      onColorSelect(selectedPanelId, color);
    }
  };

  const getSelectedColor = (): Color | null => {
    if (!selectedPanelId || !colorMap) return null;

    const colorValue = panelColors[selectedPanelId];
    const colorName = colorMap[colorValue] || 'Default';

    return {
      id: colorValue || 'default',
      name: colorName,
      value: colorValue || '#f3f4f6',
      material: material === 'acrylic' ? 'Acrylic' : '3DP',
    };
  };

  if (!currentCase) return null;

  return (
    <>
      <div className="bg-zd-black">
        <div ref={containerRef} className="px-hgap-sm lg:px-hgap-md py-vgap-xs">
          <div className="flex">
            {currentCase.panels.map((panel) => {
              const color = panelColors[panel.id];
              const backgroundColor = resolvePanelColorBackground(color, '#1f2937');

              return (
                <button
                  key={panel.id}
                  onClick={() => handlePanelClick(panel.id)}
                  className={`
                    flex-1 h-12 border transition-all overflow-hidden
                    ml-[2px] first:ml-0
                    relative active:z-10 focus:z-10
                    ${
                      selectedPanel === panel.id
                        ? 'border-zd-link border-2 shadow-lg'
                        : 'border-zd-gray hover:border-zd-link'
                    }
                  `}
                  style={{ backgroundColor }}
                  title={panel.name}
                  aria-label={`Select ${panel.name}`}
                >
                  <PanelColorSwatch
                    value={color}
                    fallbackColor="#1f2937"
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    dataTestId="custom-preview-swatch"
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-hgap-sm lg:px-hgap-md pb-vgap-xs text-center">
          <span className="text-zd-white text-sm inline-flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
            でフォーカスを移動できます
          </span>
        </div>
      </div>

      {material && onColorSelect && (
        <ColorSelectorModal
          isOpen={isColorModalOpen}
          material={material}
          selectedColor={getSelectedColor()}
          onColorSelect={handleColorSelect}
          onClose={() => setIsColorModalOpen(false)}
        />
      )}
    </>
  );
};

export default CustomColorPreview;

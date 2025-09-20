'use client';

import { useEffect, useRef } from 'react';
import { cases } from '@/data/cases';

interface CustomColorPreviewProps {
  caseType: string;
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string) => void;
}

const CustomColorPreview = ({
  caseType,
  panelColors,
  selectedPanel,
  onPanelSelect,
}: CustomColorPreviewProps) => {
  const currentCase = cases[caseType];
  const containerRef = useRef<HTMLDivElement>(null);

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

  if (!currentCase) return null;

  return (
    <div className="bg-zd-black">
      <div ref={containerRef} className="px-hgap-sm lg:px-hgap-md py-vgap-xs">
        <div className="flex">
          {currentCase.panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => onPanelSelect(panel.id)}
              className={`
                flex-1 h-12 border transition-all
                ml-[2px] first:ml-0
                relative active:z-10 focus:z-10
                ${
                  selectedPanel === panel.id
                    ? 'border-zd-link border-2 shadow-lg'
                    : 'border-zd-gray hover:border-zd-link'
                }
              `}
              style={{ backgroundColor: panelColors[panel.id] || '#1f2937' }}
              title={panel.name}
              aria-label={`Select ${panel.name}`}
            />
          ))}
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
  );
};

export default CustomColorPreview;

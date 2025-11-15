'use client';

import React, { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/icons/close-icon';
import { PresetIcon } from '@/components/icons/preset-icon';
import { colors } from '@/data/colors';
import PresetCard from '@/components/preset-card';
import type { Preset } from '@/types';

interface PresetSelectorModalProps {
  isOpen: boolean;
  selectedCase: string | null;
  material: 'acrylic' | '3dp' | undefined;
  onPresetSelect: (preset: Preset) => void;
  onClose: () => void;
  isPresetActive: (preset: Preset) => boolean;
}

const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  selectedCase,
  material,
  onPresetSelect,
  onClose,
  isPresetActive,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      return undefined;
    }

    if (shouldRender) {
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handlePresetClick = (preset: Preset) => {
    onPresetSelect(preset);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender || !material || !selectedCase) return null;

  // Get available presets for the current material
  const availablePresets = colors.presets[material] || [];

  // Filter presets based on case model (same logic as controls-sidebar)
  const filteredPresets = availablePresets.filter((preset) => {
    // For 10BOX models and zudo-block-60-open 3DP Type A/B, only show YamiKage preset
    if (
      selectedCase.startsWith('10box-') ||
      selectedCase === 'zudo-block-60-open-3DP-A' ||
      selectedCase === 'zudo-block-60-open-3DP-B'
    ) {
      return preset.id === 'yamikage';
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-selector-modal-title"
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        bg-zd-black/70
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative bg-zd-black shadow-xl border border-zd-white
          w-full md:w-[90vw] max-w-[1400px]
          h-full md:h-[85vh]
          overflow-hidden
          transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            px-hgap-sm py-vgap-sm
            md:px-hgap-md md:py-vgap-md
            flex items-center justify-between
            border-b border-zd-white
          `}
        >
          <h2
            id="preset-selector-modal-title"
            className={`
              font-bold text-zd-white
              flex items-baseline gap-hgap-xs
            `}
          >
            <PresetIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />
            <span className="text-base lg:text-xl">プリセット選択 </span>
            <span className="hidden lg:inline text-base">/ Preset Selection</span>
          </h2>
          <button
            onClick={onClose}
            className="text-zd-white zd-invert-color-link"
            aria-label="Close modal"
          >
            <CloseIcon className="w-[30px] md:w-[44px] aspect-square" />
          </button>
        </div>

        {/* Content */}
        <div
          className={`
            overflow-y-auto max-h-[calc(85vh-80px)]
            px-hgap-md
            pt-vgap-md
            pb-[100px]
          `}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-vgap-sm">
            {filteredPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                material={material}
                caseType={selectedCase}
                onClick={handlePresetClick}
                isActive={isPresetActive(preset)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PresetSelectorModal };

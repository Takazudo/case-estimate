'use client';

import { useState } from 'react';
import { colors } from '@/data/colors';
import { PresetSelectorModal } from '@/components/modal/preset-selector-modal';
import { ModelBoxIcon } from '@/components/icons/model-box-icon';
import type { Preset } from '@/types';

interface PresetSelectorProps {
  selectedCase: string | null;
  material: 'acrylic' | '3dp' | undefined;
  onPresetSelect: (preset: Preset) => void;
  isPresetActive: (preset: Preset) => boolean;
}

const PresetSelector = ({
  selectedCase,
  material,
  onPresetSelect,
  isPresetActive,
}: PresetSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect the currently active preset
  const getActivePreset = (): Preset | null => {
    if (!material) return null;

    const availablePresets = colors.presets[material] || [];

    // Filter presets based on case model (same logic as modal)
    const filteredPresets = availablePresets.filter((preset) => {
      if (
        selectedCase &&
        (selectedCase.startsWith('10box-') ||
          selectedCase === 'zudo-block-60-open-3DP-A' ||
          selectedCase === 'zudo-block-60-open-3DP-B')
      ) {
        return preset.id === 'yamikage';
      }
      return true;
    });

    // Find the active preset
    const activePreset = filteredPresets.find((preset) => isPresetActive(preset));
    return activePreset || null;
  };

  const activePreset = getActivePreset();

  // Determine display text
  let displayText: string;
  if (activePreset) {
    // For 3DP models, show YamiKage with description
    if (material === '3dp' && activePreset.id === 'yamikage') {
      displayText = 'YamiKage（デフォルト黒一色）';
    } else {
      displayText = activePreset.name;
    }
  } else {
    displayText = 'カスタム';
  }

  return (
    <>
      <div className="space-y-vgap-xs pb-vgap-sm">
        <h3 className="font-semibold text-zd-white pb-vgap-xs flex items-center gap-hgap-2xs">
          <ModelBoxIcon className="w-[30px] h-[30px] text-zd-white mr-[2px]" />
          プリセット <span className="text-sm">/ Preset</span>
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative w-full rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray hover:border-zd-link/60 focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white transition-colors text-sm"
        >
          <span className="block truncate">
            <span className="font-medium">{displayText}</span>
          </span>
        </button>
      </div>

      <PresetSelectorModal
        isOpen={isModalOpen}
        selectedCase={selectedCase}
        material={material}
        onPresetSelect={onPresetSelect}
        onClose={() => setIsModalOpen(false)}
        isPresetActive={isPresetActive}
      />
    </>
  );
};

export default PresetSelector;

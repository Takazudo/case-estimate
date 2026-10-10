'use client';

import { computed, signal } from '@takazudo/zfb/zudo-react';
import { colors } from '@/data/colors';
import { PresetSelectorModal } from '@/components/modal/preset-selector-modal';
import { PresetIcon } from '@/components/icons/preset-icon';
import type { Preset } from '@/types';
import { isSingleColorOnlyModel, isOpenModel } from '@/utils/case-model-type';
import { read, type Reactive } from '@/utils/reactive';

interface PresetSelectorProps {
  selectedCase: Reactive<string | null>;
  material: Reactive<'acrylic' | '3dp' | undefined>;
  onPresetSelect: (preset: Preset) => void;
  isPresetActive: (preset: Preset) => boolean;
}

export default function PresetSelector({
  selectedCase,
  material,
  onPresetSelect,
  isPresetActive,
}: PresetSelectorProps) {
  const isModalOpen = signal(false);
  const displayText = computed(() => {
    const type = read(material),
      caseType = read(selectedCase);
    if (!type) return 'カスタム';
    const activePreset = (colors.presets[type] || [])
      .filter(
        (preset) =>
          !caseType ||
          (!isSingleColorOnlyModel(caseType) && !isOpenModel(caseType)) ||
          preset.id === 'yamikage',
      )
      .find(isPresetActive);
    if (!activePreset) return 'カスタム';
    return type === '3dp' && activePreset.id === 'yamikage'
      ? 'YamiKage（デフォルト黒一色）'
      : activePreset.name;
  });
  return (
    <>
      <div class="space-y-vgap-xs pb-vgap-sm">
        <h3 class="font-semibold text-zd-white pb-vgap-xs flex items-center gap-hgap-2xs">
          <PresetIcon className="w-[30px] h-[30px] text-zd-white mr-[2px]" />
          プリセット <span class="text-sm">/ Preset</span>
        </h3>
        <button
          on:click={() => {
            isModalOpen.value = true;
          }}
          class="relative w-full rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray hover:border-zd-link/60 focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white transition-colors text-sm"
        >
          <span class="block truncate">
            <span class="font-medium">{displayText}</span>
          </span>
        </button>
      </div>
      <PresetSelectorModal
        isOpen={isModalOpen}
        selectedCase={selectedCase}
        material={material}
        onPresetSelect={onPresetSelect}
        onClose={() => {
          isModalOpen.value = false;
        }}
        isPresetActive={isPresetActive}
      />
    </>
  );
}

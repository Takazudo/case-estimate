'use client';

import { computed, For } from '@takazudo/zfb/zudo-react';
import { PresetIcon } from '@/components/icons/preset-icon';
import { colors } from '@/data/colors';
import PresetCard from '@/components/preset-card';
import type { Preset } from '@/types';
import { isSingleColorOnlyModel, isOpenModel } from '@/utils/case-model-type';
import { BaseModal } from './base-modal';
import { read, type Reactive } from '@/utils/reactive';

interface PresetSelectorModalProps {
  isOpen: Reactive<boolean>;
  selectedCase: Reactive<string | null>;
  material: Reactive<'acrylic' | '3dp' | undefined>;
  onPresetSelect: (preset: Preset) => void;
  onClose: () => void;
  isPresetActive: (preset: Preset) => boolean;
}
export function PresetSelectorModal({
  isOpen,
  selectedCase,
  material,
  onPresetSelect,
  onClose,
  isPresetActive,
}: PresetSelectorModalProps) {
  const filteredPresets = computed(() => {
    const type = read(material),
      caseType = read(selectedCase);
    if (!type || !caseType) return [];
    return (colors.presets[type] || []).filter(
      (preset) =>
        (!isSingleColorOnlyModel(caseType) && !isOpenModel(caseType)) || preset.id === 'yamikage',
    );
  });
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="プリセット選択 / Preset Selection"
      icon={<PresetIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />}
      ariaLabelledBy="preset-selector-modal-title"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-vgap-sm">
        <For each={filteredPresets} by={(preset) => preset.id}>
          {(preset) => (
            <PresetCard
              preset={preset}
              material={computed(() => read(material)!)}
              caseType={computed(() => read(selectedCase)!)}
              onClick={(value) => {
                onPresetSelect(value);
                onClose();
              }}
              isActive={computed(() => isPresetActive(preset.value))}
            />
          )}
        </For>
      </div>
    </BaseModal>
  );
}

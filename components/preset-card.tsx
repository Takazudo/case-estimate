'use client';

import { computed, For } from '@takazudo/zfb/zudo-react';
import type { Preset, Color } from '@/types';
import { colors } from '@/data/colors';
import { cases } from '@/data/cases';
import { is10BoxModel } from '@/utils/case-model-type';
import { read, type Reactive } from '@/utils/reactive';

interface PresetCardProps {
  preset: Reactive<Preset>;
  material: Reactive<'acrylic' | '3dp'>;
  caseType: Reactive<string>;
  onClick: (preset: Preset) => void;
  isActive?: Reactive<boolean>;
}
export default function PresetCard({
  preset,
  material,
  caseType,
  onClick,
  isActive = false,
}: PresetCardProps) {
  const panels = computed(() => cases[read(caseType)]?.panels || []);
  const getPanelColor = (panelId: string): string => {
    const currentPreset = read(preset),
      availableColors = colors[read(material)];
    if (currentPreset.colors.all || is10BoxModel(read(caseType))) {
      return (
        availableColors.find((color: Color) => color.id === currentPreset.colors.all)?.value ||
        '#000000'
      );
    }
    const isPrimary = ['side1', 'side2', 'front1', 'back1', 'bottom1', 'top1'].includes(panelId);
    const colorId = isPrimary ? currentPreset.colors.primary : currentPreset.colors.secondary;
    return availableColors.find((color: Color) => color.id === colorId)?.value || '#000000';
  };
  return (
    <button
      on:click={() => onClick(read(preset))}
      class={computed(
        () =>
          `w-full border-3 transition-all ${read(isActive) ? 'border-zd-white bg-zd-gray2' : 'border-zd-gray hover:border-zd-white'}`,
      )}
    >
      <div class="flex items-baseline justify-between px-hgap-sm py-vgap-sm border-b border-zd-gray flex-col lg:flex-row">
        <span class="text-zd-white text-lg">{computed(() => read(preset).name)}</span>
        <span class="text-zd-gray text-sm">{computed(() => read(preset).description)}</span>
      </div>
      <div class="flex h-12">
        <For each={panels} by={(panel) => panel.id}>
          {(panel) => (
            <div
              class="flex-1 border-l-1 first:border-l-0 border-zd-gray"
              style={computed(() => ({ 'background-color': getPanelColor(panel.value.id) }))}
              title={computed(() => panel.value.name)}
            />
          )}
        </For>
      </div>
    </button>
  );
}

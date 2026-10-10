'use client';

import { computed, signal, Show } from '@takazudo/zfb/zudo-react';
import type { Color } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { ColorSelectorModal } from '@/components/modal/color-selector-modal';
import { read, type Reactive } from '@/utils/reactive';

interface ColorPickerProps {
  material: Reactive<'acrylic' | '3dp'>;
  selectedColor: Reactive<Color | null>;
  onColorSelect: (color: Color) => void;
}
export default function ColorPicker({ material, selectedColor, onColorSelect }: ColorPickerProps) {
  const isModalOpen = signal(false);
  const color = computed(() => read(selectedColor));
  return (
    <>
      <div class="space-y-vgap-xs">
        <h3 class="font-semibold text-zd-white pb-vgap-xs">Colors</h3>
        <button
          on:click={() => {
            isModalOpen.value = true;
          }}
          class="w-full flex items-center gap-hgap-sm rounded-lg border-2 transition-all text-left py-vgap-sm px-hgap-sm border-zd-gray hover:border-zd-link bg-zd-surface-2"
          data-testid="color-picker-button"
        >
          <Show
            when={computed(() => !!color.value)}
            fallback={() => (
              <span class="flex flex-1 flex-col">
                <span class="font-medium text-zd-white">カラーを選択</span>
                <span class="text-sm text-zd-gray">
                  {computed(() => (read(material) === 'acrylic' ? 'アクリル' : '3Dプリント'))}
                </span>
              </span>
            )}
          >
            {() => (
              <>
                <PanelColorSwatch
                  value={computed(() => color.value?.value)}
                  ownerKey="color-picker-current"
                  className="relative overflow-hidden w-8 h-8 rounded border border-zd-gray flex-shrink-0"
                  dataTestId="color-picker-current-swatch"
                />
                <span class="flex flex-1 flex-col">
                  <span class="font-medium text-zd-white">{computed(() => color.value?.name)}</span>
                  <span class="text-sm text-zd-gray">{computed(() => color.value?.material)}</span>
                </span>
              </>
            )}
          </Show>
          <svg
            class="w-5 h-5 text-zd-gray flex-shrink-0"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <ColorSelectorModal
        isOpen={isModalOpen}
        material={material}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
        onClose={() => {
          isModalOpen.value = false;
        }}
      />
    </>
  );
}

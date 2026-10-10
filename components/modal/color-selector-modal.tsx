'use client';

import { computed, For, Show } from '@takazudo/zfb/zudo-react';
import { BaseModal } from './base-modal';
import { PaletteIcon } from '@/components/icons/palette-icon';
import { colors } from '@/data/colors';
import type { Color } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { read, type Reactive } from '@/utils/reactive';

interface ColorSelectorModalProps {
  isOpen: Reactive<boolean>;
  material: Reactive<'acrylic' | '3dp'>;
  selectedColor: Reactive<Color | null>;
  onColorSelect: (color: Color) => void;
  onClose: () => void;
}
export function ColorSelectorModal({
  isOpen,
  material,
  selectedColor,
  onColorSelect,
  onClose,
}: ColorSelectorModalProps) {
  const availableColors = computed(() => colors[read(material)] || []);
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={computed(() =>
        read(material) === 'acrylic' ? 'カラー選択 (アクリル)' : 'カラー選択 (3Dプリント)',
      )}
      icon={<PaletteIcon class="w-[32px] h-[32px] text-zd-white relative top-[5px]" />}
      ariaLabelledBy="color-selector-modal-title"
    >
      <div class="space-y-vgap-md">
        <p class="text-zd-gray text-sm hidden lg:block">
          {computed(() =>
            read(material) === 'acrylic' ? 'Acrylic Color Selection' : '3D Printed Color Selection',
          )}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-hgap-sm gap-y-vgap-sm">
          <For each={availableColors} by={(color) => color.id}>
            {(color) => (
              <button
                on:click={() => {
                  onColorSelect(color.value);
                  onClose();
                }}
                class={computed(
                  () =>
                    `group relative flex flex-col border-2 rounded-lg transition-all overflow-hidden ${read(selectedColor)?.id === color.value.id ? 'border-zd-link bg-zd-active' : 'border-zd-gray hover:border-zd-link'}`,
                )}
              >
                <div class="aspect-square w-full relative bg-zd-surface-3 flex items-center justify-center overflow-hidden">
                  <Show
                    when={computed(() => !!color.value.imageUrl)}
                    fallback={() => (
                      <PanelColorSwatch
                        value={computed(() => color.value.value)}
                        ownerKey={`color-modal-${color.value.id}`}
                        className="w-full h-full"
                        dataTestId={`color-modal-swatch-${color.value.id}`}
                      />
                    )}
                  >
                    {() => (
                      <img
                        src={computed(() => color.value.imageUrl || null)}
                        alt={computed(() => color.value.name)}
                        class="w-full h-full object-cover"
                        loading="lazy"
                        width="400"
                        height="400"
                      />
                    )}
                  </Show>
                </div>
                <div class="p-hgap-xs bg-zd-black border-t border-zd-gray">
                  <div class="text-zd-white font-medium text-sm">
                    {computed(() => color.value.name)}
                  </div>
                  <div class="text-zd-gray text-xs">{computed(() => color.value.material)}</div>
                </div>
                <Show when={computed(() => read(selectedColor)?.id === color.value.id)}>
                  {() => (
                    <div class="absolute top-2 right-2 w-6 h-6 bg-zd-link rounded-full flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-zd-black"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </Show>
              </button>
            )}
          </For>
        </div>
      </div>
    </BaseModal>
  );
}

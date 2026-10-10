'use client';

import { computed, For } from '@takazudo/zfb/zudo-react';
import type { Panel } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { DEFAULT_PANEL_COLOR } from '@/data/colors';
import { read, type Reactive } from '@/utils/reactive';

type PanelListVariant = 'default' | 'color-picker';
interface PanelListUnifiedProps {
  panels: Reactive<Panel[]>;
  panelColors: Reactive<Record<string, string>>;
  onPanelSelect: (panelId: string) => void;
  colorMap: Reactive<Record<string, string>>;
  selectedPanel?: Reactive<string | null>;
  variant?: PanelListVariant;
}
export default function PanelListUnified({
  panels,
  panelColors,
  onPanelSelect,
  colorMap,
  selectedPanel = null,
  variant = 'default',
}: PanelListUnifiedProps) {
  const isColorPicker = variant === 'color-picker';
  return (
    <div class="space-y-vgap-xs">
      <h3 class={`font-semibold text-zd-white ${isColorPicker ? 'pb-vgap-xs' : ''}`}>
        {isColorPicker ? 'Select Panel' : 'Panels'}
      </h3>
      <div class={`space-y-vgap-2xs ${!isColorPicker ? 'max-h-[300px] overflow-y-auto' : ''}`}>
        <For each={computed(() => read(panels))} by={(panel) => panel.id}>
          {(panel) => {
            const colorValue = computed(() => read(panelColors)[panel.value.id]);
            const colorName = computed(() => read(colorMap)[colorValue.value] || 'Default');
            const isSelected = computed(() => read(selectedPanel) === panel.value.id);
            return (
              <button
                on:click={() => onPanelSelect(panel.value.id)}
                class={computed(
                  () =>
                    `w-full text-left rounded-lg border-2 transition-all ${isColorPicker ? 'py-vgap-sm px-hgap-sm border-zd-gray hover:border-zd-link bg-zd-surface-2' : `p-hgap-xs ${isSelected.value ? 'border-zd-link bg-zd-active' : 'border-zd-gray hover:border-zd-link'}`}`,
                )}
                data-testid={isColorPicker ? `panel-button-${panel.value.id}` : undefined}
              >
                <div class="flex items-center justify-between">
                  <span class={`font-medium ${isColorPicker ? 'text-zd-white' : ''}`}>
                    {computed(() => panel.value.name)}
                  </span>
                  <div class={`flex items-center ${isColorPicker ? 'gap-hgap-2xs' : ''}`}>
                    <PanelColorSwatch
                      value={colorValue}
                      fallbackColor={DEFAULT_PANEL_COLOR}
                      ownerKey={`panel-list-${variant}-${panel.value.id}`}
                      className={`relative overflow-hidden rounded border border-zd-gray ${isColorPicker ? 'w-6 h-6' : 'w-5 h-5 mr-hgap-2xs'}`}
                      patternViewBoxSize={20}
                      dataTestId={
                        isColorPicker
                          ? `panel-button-swatch-${panel.value.id}`
                          : 'panel-list-swatch'
                      }
                    />
                    <span class={`text-zd-gray ${isColorPicker ? 'text-sm' : ''}`}>
                      {colorName}
                    </span>
                  </div>
                </div>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}

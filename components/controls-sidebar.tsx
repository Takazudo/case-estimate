'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import type { Preset, Panel } from '@/types';
import PanelListUnified from './panel-list-unified';
import CustomColorPreview from './custom-color-preview';
import ModelSelector from './model-selector';
import PresetSelector from './preset-selector';
import BackgroundColorPicker from './background-color-picker';
import { OrderIcon } from './icons/order-icon';
import { useIsStandalone } from '@/hooks/use-is-standalone';
import { useCurrentPath } from '@/hooks/use-current-path';
import { read, type Reactive } from '@/utils/reactive';

interface ControlsSidebarProps {
  selectedCase: Reactive<string | null>;
  material: Reactive<'acrylic' | '3dp' | undefined>;
  onPresetSelect: (preset: Preset) => void;
  isPresetActive: (preset: Preset) => boolean;
  panels: Reactive<Panel[]>;
  panelColors: Reactive<Record<string, string>>;
  selectedPanel: Reactive<string | null>;
  onPanelSelect: (panelId: string | null) => void;
  colorMap: Reactive<Record<string, string>>;
  onCaseSelect: (caseType: string) => void;
  bgColor?: Reactive<string>;
  gridColor?: Reactive<string>;
  onBgColorChange?: (color: string) => void;
  onGridColorChange?: (color: string) => void;
  onOrderInfoClick?: () => void;
}

export default function ControlsSidebar({
  selectedCase,
  material,
  onPresetSelect,
  isPresetActive,
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
  onCaseSelect,
  bgColor,
  gridColor,
  onBgColorChange,
  onGridColorChange,
  onOrderInfoClick,
}: ControlsSidebarProps) {
  const isStandalone = useIsStandalone();
  const currentPath = useCurrentPath();
  const shouldHideHeader = computed(() => read(currentPath) === '/m' && read(isStandalone));
  return (
    <div
      class={computed(
        () =>
          `bg-zd-black h-full overflow-y-scroll overflow-x-hidden min-w-0 relative ${shouldHideHeader.value ? '' : 'pt-[96px]'}`,
      )}
    >
      <div class="px-hgap-sm lg:px-hgap-md pt-vgap-md pb-vgap-sm border-b border-zd-gray">
        <ModelSelector selectedCase={selectedCase} onCaseSelect={onCaseSelect} />
      </div>
      <Show
        when={computed(() => !!read(selectedCase))}
        fallback={() => (
          <div class="px-hgap-sm lg:px-hgap-md py-vgap-md">
            <div class="text-center text-zd-gray mt-8">
              <p>Select a case model to begin customization</p>
            </div>
          </div>
        )}
      >
        {() => (
          <>
            <div class="px-hgap-sm lg:px-hgap-md pt-vgap-md pb-vgap-sm border-b border-zd-gray">
              <PresetSelector
                selectedCase={selectedCase}
                material={material}
                onPresetSelect={onPresetSelect}
                isPresetActive={isPresetActive}
              />
            </div>
            <div class="px-hgap-sm lg:px-hgap-md py-vgap-md">
              <div class="-mx-hgap-sm lg:-mx-hgap-md mb-vgap-md">
                <CustomColorPreview
                  caseType={computed(() => read(selectedCase) || '')}
                  panelColors={panelColors}
                  selectedPanel={selectedPanel}
                  onPanelSelect={onPanelSelect}
                />
              </div>
              <div class="space-y-vgap-sm">
                <Show when={computed(() => !!read(material))}>
                  {() => (
                    <PanelListUnified
                      panels={panels}
                      panelColors={panelColors}
                      onPanelSelect={onPanelSelect}
                      colorMap={colorMap}
                      variant="color-picker"
                    />
                  )}
                </Show>
              </div>
            </div>
            <div class="px-hgap-sm lg:px-hgap-md py-vgap-md space-y-vgap-sm lg:space-y-vgap-md">
              <div class="text-sm text-zd-gray space-y-vgap-2xs">
                <p>• Click on a panel to choose its color</p>
                <p>• Your configuration is saved in the URL</p>
              </div>
              <Show
                when={computed(
                  () => !!bgColor && !!gridColor && !!onBgColorChange && !!onGridColorChange,
                )}
              >
                {() => (
                  <div class="pt-4 border-t border-zd-gray">
                    <BackgroundColorPicker
                      bgColor={bgColor!}
                      gridColor={gridColor!}
                      onBgColorChange={onBgColorChange!}
                      onGridColorChange={onGridColorChange!}
                    />
                  </div>
                )}
              </Show>
            </div>
            <Show when={computed(() => !!onOrderInfoClick)}>
              {() => (
                <div class="sticky bottom-0 left-0 right-0 w-full bg-zd-black border-t border-zd-white p-hgap-sm lg:p-hgap-md mt-vgap-md">
                  <button
                    on:click={onOrderInfoClick}
                    class="w-full inline-flex items-center justify-center gap-[6px] px-hgap-sm py-vgap-xs rounded text-zd-white whitespace-nowrap zd-button-gradient transition-all text-sm lg:text-base"
                  >
                    <OrderIcon className="w-[28px] h-[28px] lg:w-[34px] lg:h-[34px] flex-shrink-0" />
                    <span class="font-medium pt-[.1em]">オーダー情報を表示</span>
                  </button>
                </div>
              )}
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}

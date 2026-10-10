'use client';

import { computed, For, getScope, type Ref } from '@takazudo/zfb/zudo-react';
import { cases } from '@/data/cases';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { resolvePanelColorBackground } from '@/utils/panel-color-utils';
import { DEFAULT_PANEL_COLOR } from '@/data/colors';
import { read, type Reactive } from '@/utils/reactive';

interface CustomColorPreviewProps {
  caseType: Reactive<string>;
  panelColors: Reactive<Record<string, string>>;
  selectedPanel: Reactive<string | null>;
  onPanelSelect: (panelId: string) => void;
}
export default function CustomColorPreview({
  caseType,
  panelColors,
  selectedPanel,
  onPanelSelect,
}: CustomColorPreviewProps) {
  const containerRef: Ref<HTMLDivElement> = { current: null };
  getScope().onActivate(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !containerRef.current?.contains(document.activeElement) ||
        !['ArrowLeft', 'ArrowRight'].includes(event.key)
      )
        return;
      event.preventDefault();
      const buttons = Array.from(containerRef.current.querySelectorAll('button'));
      const index = buttons.findIndex((button) => button === document.activeElement);
      buttons[
        (index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length
      ]?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });
  const panels = computed(() => cases[read(caseType)]?.panels || []);
  return (
    <div class="bg-zd-black">
      <div ref={containerRef} class="px-hgap-sm lg:px-hgap-md py-vgap-xs">
        <div class="flex">
          <For each={panels} by={(panel) => panel.id}>
            {(panel) => {
              const color = computed(() => read(panelColors)[panel.value.id]);
              return (
                <button
                  on:click={() => onPanelSelect(panel.value.id)}
                  class={computed(
                    () =>
                      `flex-1 h-12 border transition-all overflow-hidden ml-[2px] first:ml-0 relative active:z-10 focus:z-10 ${read(selectedPanel) === panel.value.id ? 'border-zd-link border-2 shadow-lg' : 'border-zd-gray hover:border-zd-link'}`,
                  )}
                  style={computed(() => ({
                    'background-color': resolvePanelColorBackground(
                      color.value,
                      DEFAULT_PANEL_COLOR,
                    ),
                  }))}
                  title={computed(() => panel.value.name)}
                  aria-label={computed(() => `Select ${panel.value.name}`)}
                >
                  <PanelColorSwatch
                    value={color}
                    fallbackColor={DEFAULT_PANEL_COLOR}
                    ownerKey={`custom-preview-${panel.value.id}`}
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    dataTestId="custom-preview-swatch"
                  />
                </button>
              );
            }}
          </For>
        </div>
      </div>
      <div class="px-hgap-sm lg:px-hgap-md pb-vgap-xs text-center">
        <span class="text-zd-white text-sm inline-flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
          でフォーカスを移動できます
        </span>
      </div>
    </div>
  );
}

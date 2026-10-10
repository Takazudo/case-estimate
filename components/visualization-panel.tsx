'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import CaseVisualizer from './case-visualizer';
import { generateBackgroundPattern } from '@/utils/panel-colors';
import { useIsStandalone } from '@/hooks/use-is-standalone';
import { useCurrentPath } from '@/hooks/use-current-path';

interface VisualizationPanelProps {
  selectedCase: Reactive<string | null>;
  panelColors: Reactive<{ [key: string]: string }>;
  panelColorIds?: Reactive<{ [key: string]: string } | undefined>;
  onPanelClick: (panelId: string) => void;
  selectedPanel: Reactive<string | null>;
  material: Reactive<'acrylic' | '3dp' | undefined>;
  bgColor: Reactive<string>;
  gridColor: Reactive<string>;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function VisualizationPanel({
  selectedCase,
  panelColors,
  panelColorIds,
  onPanelClick,
  selectedPanel,
  material,
  bgColor,
  gridColor,
  onLoadingChange,
}: VisualizationPanelProps) {
  const isStandalone = useIsStandalone();
  const currentPath = useCurrentPath();
  const className = computed(
    () =>
      `relative border-r border-zd-gray overflow-hidden ${read(currentPath) === '/m' && read(isStandalone) ? '' : 'pt-[96px]'}`,
  );
  const style = computed(() => ({
    'background-image': `url("${generateBackgroundPattern(read(bgColor), read(gridColor))}")`,
    'background-size': '60px 60px',
    'background-position': 'center',
  }));

  return (
    <div class={className} style={style}>
      <div class="h-full p-[10px] md:p-[15px] lg:p-[20px] xl:p-[30px] flex items-center justify-center">
        <Show
          when={computed(() => !!read(selectedCase))}
          fallback={() => (
            <div class="text-center max-w-md">
              <h2 class="text-3xl font-bold text-zd-white mb-4 font-futura">
                Welcome to Takazudo Modular
              </h2>
              <p class="text-lg text-zd-gray mb-8">
                Design your custom modular synthesizer case with our interactive configurator.
              </p>
              <p class="text-zd-gray">
                Select a case model from the dropdown above to get started.
              </p>
            </div>
          )}
        >
          {() => (
            <CaseVisualizer
              caseType={computed(() => read(selectedCase) ?? '')}
              panelColors={panelColors}
              panelColorIds={panelColorIds}
              onPanelClick={onPanelClick}
              selectedPanel={selectedPanel}
              material={material}
              onLoadingChange={onLoadingChange}
            />
          )}
        </Show>
      </div>
    </div>
  );
}

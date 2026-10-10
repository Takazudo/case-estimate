'use client';

import { computed, For, getScope, Show, signal, type Ref } from '@takazudo/zfb/zudo-react';
import type { Panel } from '@/types';
import PanelColorSwatch from '@/components/panel-color-swatch';
import { read, type Reactive } from '@/utils/reactive';

interface PanelSelectorProps {
  panels: Reactive<Panel[]>;
  panelColors: Reactive<Record<string, string>>;
  selectedPanel: Reactive<string | null>;
  onPanelSelect: (panelId: string) => void;
  colorMap: Reactive<Record<string, string>>;
}
export default function PanelSelector({
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
}: PanelSelectorProps) {
  const isOpen = signal(false);
  const highlighted = signal(0);
  const root: Ref<HTMLDivElement> = { current: null };
  const options: Ref<HTMLDivElement> = { current: null };
  const button: Ref<HTMLButtonElement> = { current: null };
  const selected = computed(() => read(panels).find((panel) => panel.id === read(selectedPanel)));
  const selectedColor = computed(() =>
    selected.value ? read(panelColors)[selected.value.id] : undefined,
  );
  const selectedColorName = computed(() =>
    selectedColor.value ? read(colorMap)[selectedColor.value] || 'Default' : 'Default',
  );
  let typeahead = '';
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
  getScope().onCleanup(() => {
    if (typeaheadTimer) clearTimeout(typeaheadTimer);
  });
  getScope().effect(() => {
    if (!isOpen.value) return;
    const index = highlighted.value;
    queueMicrotask(() => options.current?.children[index]?.scrollIntoView({ block: 'nearest' }));
  });
  const open = () => {
    highlighted.value = Math.max(
      0,
      read(panels).findIndex((panel) => panel.id === read(selectedPanel)),
    );
    isOpen.value = true;
    setTimeout(() => options.current?.focus(), 0);
  };
  const choose = (index: number) => {
    const panel = read(panels)[index];
    if (!panel) return;
    onPanelSelect(panel.id);
    isOpen.value = false;
    button.current?.focus();
  };
  getScope().onActivate(() => {
    const outside = (event: PointerEvent) => {
      if (isOpen.value && !root.current?.contains(event.target as Node)) isOpen.value = false;
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  });
  const onListKeydown = (event: KeyboardEvent) => {
    const count = read(panels).length;
    if (event.key === 'Escape') {
      event.preventDefault();
      isOpen.value = false;
      button.current?.focus();
    } else if (count > 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      highlighted.value =
        (highlighted.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
    } else if (event.key === 'Home') {
      event.preventDefault();
      highlighted.value = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      highlighted.value = count - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(highlighted.value);
    } else if (event.key === 'Tab') {
      isOpen.value = false;
    } else if (event.key.length === 1 && /[\p{L}\p{N}]/u.test(event.key)) {
      typeahead += event.key.toLocaleLowerCase();
      if (typeaheadTimer) clearTimeout(typeaheadTimer);
      typeaheadTimer = setTimeout(() => {
        typeahead = '';
      }, 700);
      const match = read(panels).findIndex((panel) =>
        panel.name.toLocaleLowerCase().startsWith(typeahead),
      );
      if (match >= 0) highlighted.value = match;
    }
  };
  return (
    <div ref={root} class="space-y-vgap-xs">
      <h3 id="panel-selector-label" class="font-semibold text-zd-white pb-vgap-xs">
        Select Panel
      </h3>
      <div class="relative text-sm">
        <button
          ref={button}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={computed(() => isOpen.value)}
          aria-labelledby="panel-selector-label"
          on:click={() => {
            if (isOpen.value) isOpen.value = false;
            else open();
          }}
          on:keydown={(event) => {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && !isOpen.value) {
              event.preventDefault();
              open();
            }
          }}
          class="relative w-full cursor-default rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white"
        >
          <Show
            when={computed(() => !!selected.value)}
            fallback={() => <span class="text-zd-gray">Select a panel to customize</span>}
          >
            {() => (
              <span class="flex items-center justify-between">
                <span class="font-medium">{computed(() => selected.value?.name)}</span>
                <span class="flex items-center mr-hgap-sm">
                  <PanelColorSwatch
                    value={selectedColor}
                    ownerKey="panel-selector-current"
                    fallbackColor="#f3f4f6"
                    className="relative overflow-hidden w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
                    patternViewBoxSize={20}
                    dataTestId="panel-selector-swatch"
                  />
                  <span class="text-zd-gray">{selectedColorName}</span>
                </span>
              </span>
            )}
          </Show>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-zd-gray"
          >
            ⌃⌄
          </span>
        </button>
        <Show when={isOpen}>
          {() => (
            <div
              ref={options}
              role="listbox"
              tabindex={0}
              aria-labelledby="panel-selector-label"
              aria-activedescendant={computed(() =>
                read(panels)[highlighted.value]
                  ? `panel-option-${read(panels)[highlighted.value].id}`
                  : undefined,
              )}
              on:keydown={onListKeydown}
              class="absolute z-20 mt-1px max-h-[400px] w-full overflow-auto rounded-lg bg-zd-black border-2 border-zd-gray shadow-2xl focus:outline-none"
            >
              <For each={computed(() => read(panels))} by={(panel) => panel.id}>
                {(panel, index) => {
                  const color = computed(() => read(panelColors)[panel.value.id]);
                  return (
                    <div
                      id={computed(() => `panel-option-${panel.value.id}`)}
                      role="option"
                      aria-selected={computed(() => read(selectedPanel) === panel.value.id)}
                      on:click={() => choose(index.value)}
                      on:pointermove={() => {
                        highlighted.value = index.value;
                      }}
                      class={computed(
                        () =>
                          `relative cursor-default select-none py-[.5em] first:pt-[1em] last:pb-[1em] pl-hgap-md pr-hgap-xs ${highlighted.value === index.value ? 'bg-zd-active text-zd-white' : 'text-zd-white'}`,
                      )}
                    >
                      <div class="flex items-center justify-between">
                        <span
                          class={computed(
                            () =>
                              `block truncate ${read(selectedPanel) === panel.value.id ? 'font-medium' : 'font-normal'}`,
                          )}
                        >
                          {computed(() => panel.value.name)}
                        </span>
                        <div class="flex items-center">
                          <PanelColorSwatch
                            value={color}
                            ownerKey={`panel-selector-option-${panel.value.id}`}
                            fallbackColor="#f3f4f6"
                            className="relative overflow-hidden w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
                            patternViewBoxSize={20}
                            dataTestId="panel-selector-option-swatch"
                          />
                          <span class="text-zd-gray">
                            {computed(() => read(colorMap)[color.value] || 'Default')}
                          </span>
                        </div>
                      </div>
                      <Show when={computed(() => read(selectedPanel) === panel.value.id)}>
                        {() => (
                          <span
                            aria-hidden="true"
                            class="absolute inset-y-0 left-0 flex items-center pl-hgap-xs text-zd-link"
                          >
                            ✓
                          </span>
                        )}
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}

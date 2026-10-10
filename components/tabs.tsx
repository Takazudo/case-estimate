'use client';

import { computed, For, signal, type Child } from '@takazudo/zfb/zudo-react';
import { read, type Reactive } from '@/utils/reactive';

interface Tab {
  id: string;
  label: string;
  content: Child;
}
interface TabsProps {
  tabs: Reactive<Tab[]>;
  defaultTab?: string;
  activeTab?: Reactive<string>;
  onTabChange?: (tabId: string) => void;
}
export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
}: TabsProps) {
  const internalActiveTab = signal(defaultTab || read(tabs)[0]?.id || '');
  const activeTab = computed(() =>
    controlledActiveTab !== undefined ? read(controlledActiveTab) : internalActiveTab.value,
  );
  return (
    <div>
      <div class="flex gap-[14px] border-b-2 border-zd-white text-base px-[20px]">
        <For each={computed(() => read(tabs))} by={(tab) => tab.id}>
          {(tab) => (
            <button
              on:click={() => {
                if (controlledActiveTab === undefined) internalActiveTab.value = tab.value.id;
                onTabChange?.(tab.value.id);
              }}
              class={computed(
                () =>
                  `flex-1 transition-all grid outline-offset-[-10px] rounded-[14px] ${activeTab.value === tab.value.id ? 'bg-zd-black text-zd-white' : 'bg-zd-black text-zd-gray'}`,
              )}
            >
              <span
                class={computed(
                  () =>
                    `bg-amber-200 px-hgap-sm pt-vgap-sm pb-vgap-xs ${activeTab.value === tab.value.id ? 'bg-zd-black text-zd-white border-t-2 border-l-2 border-r-2 border-zd-white' : 'bg-zd-black text-zd-gray border-t-2 border-l-2 border-r-2 border-b-0 border-zd-gray hover:text-zd-white'}`,
                )}
              >
                {computed(() => tab.value.label)}
              </span>
              <span
                class={computed(() =>
                  activeTab.value === tab.value.id
                    ? 'mb-[-2px] bg-zd-black h-[14px] border-r-2 border-l-2 border-zd-white'
                    : 'h-[12px]',
                )}
              />
            </button>
          )}
        </For>
      </div>
      <div
        class="transition-opacity duration-300 ease-in-out animate-fade-in"
        style="animation: fadeIn 300ms ease-in-out"
      >
        <For
          each={computed(() => read(tabs).filter((tab) => tab.id === activeTab.value))}
          by={(tab) => tab.id}
        >
          {(tab) => tab.value.content}
        </For>
      </div>
    </div>
  );
}

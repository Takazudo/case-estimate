'use client';

import { computed, signal } from '@takazudo/zfb/zudo-react';
import { cases } from '@/data/cases';
import { CaseSelectorModal } from '@/components/modal/case-selector-modal';
import { ModelBoxIcon } from '@/components/icons/model-box-icon';
import { read, type Reactive } from '@/utils/reactive';

interface ModelSelectorProps {
  selectedCase: Reactive<string | null>;
  onCaseSelect: (caseType: string) => void;
}

export default function ModelSelector({ selectedCase, onCaseSelect }: ModelSelectorProps) {
  const isModalOpen = signal(false);
  const selectedCaseData = computed(() => {
    const key = read(selectedCase);
    return key ? cases[key] : null;
  });
  return (
    <>
      <div class="space-y-vgap-xs pb-vgap-sm">
        <h3 class="font-semibold text-zd-white pb-vgap-xs flex items-center gap-hgap-2xs">
          <ModelBoxIcon className="w-[30px] h-[30px] text-zd-white mr-[2px]" />
          ケースモデル <span class="text-sm">/ Case Model</span>
        </h3>
        <button
          on:click={() => {
            isModalOpen.value = true;
          }}
          class="relative w-full rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray hover:border-zd-link/60 focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white transition-colors text-sm"
        >
          <span class="block truncate">
            {computed(() =>
              selectedCaseData.value ? selectedCaseData.value.name : 'Select a case model',
            )}
          </span>
        </button>
      </div>
      <CaseSelectorModal
        isOpen={isModalOpen}
        selectedCase={selectedCase}
        onCaseSelect={onCaseSelect}
        onClose={() => {
          isModalOpen.value = false;
        }}
      />
    </>
  );
}

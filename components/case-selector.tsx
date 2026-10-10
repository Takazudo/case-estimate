'use client';

import { getScope, type Ref } from '@takazudo/zfb/zudo-react';
import { cases } from '@/data/cases';
import { read, type Reactive } from '@/utils/reactive';

interface CaseSelectorProps {
  selectedCase: Reactive<string>;
  onCaseSelect: (caseType: string) => void;
}
const caseGroups = {
  'zudo-block-40': Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-40')),
  'zudo-block-60': Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-60')),
  '10BOX': Object.entries(cases).filter(([key]) => key.startsWith('10box')),
};
export default function CaseSelector({ selectedCase, onCaseSelect }: CaseSelectorProps) {
  const selectRef: Ref<HTMLSelectElement> = { current: null };
  getScope().effect(() => {
    if (selectRef.current) selectRef.current.value = read(selectedCase);
  });
  return (
    <div class="space-y-vgap-xs">
      <h3 class="font-semibold text-zd-white">Case Model</h3>
      <select
        ref={selectRef}
        defaultValue={read(selectedCase)}
        on:change={(event) => onCaseSelect((event.currentTarget as HTMLSelectElement).value)}
        class="w-full px-hgap-xs py-vgap-2xs border border-zd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zd-link bg-zd-gray2 text-zd-white"
      >
        {Object.entries(caseGroups).map(([groupName, groupCases]) => (
          <optgroup label={groupName}>
            {groupCases.map(([key, caseData]) => (
              <option value={key}>{caseData.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

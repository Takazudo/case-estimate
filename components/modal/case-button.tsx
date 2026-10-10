import { computed } from '@takazudo/zfb/zudo-react';
import type { CaseEntry } from '@/data/cases';
import { read, type Reactive } from '@/utils/reactive';

interface CaseButtonProps {
  caseData: CaseEntry[1];
  isSelected: Reactive<boolean>;
  onClick: () => void;
}
export function CaseButton({ caseData, isSelected, onClick }: CaseButtonProps) {
  return (
    <button
      on:click={onClick}
      class={computed(
        () =>
          `w-full text-left py-vgap-xs rounded transition-all flex items-baseline justify-between md:px-hgap-sm md:-mx-hgap-sm ${read(isSelected) ? 'bg-zd-link text-zd-black font-medium' : 'text-zd-white zd-invert-color-link'}`,
      )}
    >
      <span class="text-sm md:text-base underline">{caseData.name}</span>
      <span
        class={computed(
          () =>
            `text-xs md:text-sm underline ${read(isSelected) ? 'text-zd-black' : 'text-zd-gray'}`,
        )}
      >
        {caseData.hp} HP • {caseData.material === '3dp' ? '3D' : 'ACR'}
      </span>
    </button>
  );
}

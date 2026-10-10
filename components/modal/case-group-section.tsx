import { computed } from '@takazudo/zfb/zudo-react';
import type { CaseGroup } from '@/data/case-groups';
import { getThumbnailUrl } from '@/utils/cdn-urls';
import { CaseButton } from './case-button';
import { read, type Reactive } from '@/utils/reactive';

interface CaseGroupSectionProps {
  group: CaseGroup;
  selectedCase: Reactive<string | null>;
  onCaseClick: (caseKey: string) => void;
}
export function CaseGroupSection({ group, selectedCase, onCaseClick }: CaseGroupSectionProps) {
  if (!group.cases.length) return null;
  return (
    <div class="mb-vgap-lg last:mb-0">
      <h3 class="text-sm md:text-lg font-bold text-zd-white border-b border-zd-white pb-vgap-sm mb-vgap-sm md:mb-vgap-md">
        {group.displayLabel}
      </h3>
      <div class="flex gap-hgap-md">
        <div class="hidden md:block flex-shrink-0">
          <img
            src={getThumbnailUrl(group.imageSlug)}
            alt={group.displayLabel}
            class="w-[200px] lg:w-[300px] xl:w-[400px] aspect-square border border-zd-white"
          />
        </div>
        <div class="flex-1">
          <ul class="space-y-vgap-xs">
            {group.cases.map(([key, caseData]) => (
              <li>
                <CaseButton
                  caseData={caseData}
                  isSelected={computed(() => read(selectedCase) === key)}
                  onClick={() => onCaseClick(key)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { CaseGroup } from '@/data/case-groups';
import { getThumbnailUrl } from '@/utils/cdn-urls';
import { CaseButton } from './case-button';

interface CaseGroupSectionProps {
  group: CaseGroup;
  selectedCase: string | null;
  onCaseClick: (caseKey: string) => void;
}

export const CaseGroupSection: React.FC<CaseGroupSectionProps> = ({
  group,
  selectedCase,
  onCaseClick,
}) => {
  if (group.cases.length === 0) return null;

  return (
    <div className="mb-vgap-lg last:mb-0">
      <h3
        className={`
          text-sm md:text-lg font-bold text-zd-white
          border-b border-zd-white pb-vgap-sm
          mb-vgap-sm md:mb-vgap-md
        `}
      >
        {group.displayLabel}
      </h3>
      <div className="flex gap-hgap-md">
        <div
          className={`
            hidden md:block
            flex-shrink-0
          `}
        >
          <img
            src={getThumbnailUrl(group.imageSlug)}
            alt={group.displayLabel}
            className={`
              w-[200px] lg:w-[300px] xl:w-[400px] aspect-square border border-zd-white
            `}
          />
        </div>
        <div className="flex-1">
          <ul className="space-y-vgap-xs">
            {group.cases.map(([key, caseData]) => (
              <li key={key}>
                <CaseButton
                  caseData={caseData}
                  isSelected={selectedCase === key}
                  onClick={() => onCaseClick(key)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

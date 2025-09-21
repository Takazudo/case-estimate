'use client';

import { cases } from '@/data/cases';

interface HeaderCaseSelectorProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

const HeaderCaseSelector = ({ selectedCase, onCaseSelect }: HeaderCaseSelectorProps) => {
  // Group cases by their base model
  const caseGroups = {
    'zudo-block-40': [] as Array<[string, (typeof cases)[keyof typeof cases]]>,
    'zudo-block-60': [] as Array<[string, (typeof cases)[keyof typeof cases]]>,
    '10BOX': [] as Array<[string, (typeof cases)[keyof typeof cases]]>,
  };

  // Sort cases into groups
  Object.entries(cases).forEach(([key, caseData]) => {
    if (key.startsWith('zudo-block-40')) {
      caseGroups['zudo-block-40'].push([key, caseData]);
    } else if (key.startsWith('zudo-block-60')) {
      caseGroups['zudo-block-60'].push([key, caseData]);
    } else if (key.startsWith('10box')) {
      caseGroups['10BOX'].push([key, caseData]);
    }
  });

  return (
    <div className="flex items-center gap-hgap-2xs">
      <label className="text-zd-gray text-sm lg:text-lg px-[3px]">Model:</label>
      <select
        value={selectedCase || ''}
        onChange={(e) => e.target.value && onCaseSelect(e.target.value)}
        className="px-hgap-sm py-vgap-xs border border-zd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zd-link bg-zd-gray2 text-zd-white text-sm md:text-base"
      >
        <option value="">モデル選択</option>
        {Object.entries(caseGroups).map(([groupName, groupCases]) => (
          <optgroup key={groupName} label={groupName}>
            {groupCases.map(([key, caseData]) => (
              <option key={key} value={key}>
                {caseData.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default HeaderCaseSelector;

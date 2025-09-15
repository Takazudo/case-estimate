import { cases } from '../data/cases';

interface CaseSelectorProps {
  selectedCase: string;
  onCaseSelect: (caseType: string) => void;
}

const CaseSelector = ({ selectedCase, onCaseSelect }: CaseSelectorProps) => {
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
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white">Case Model</h3>
      <select
        value={selectedCase}
        onChange={(e) => onCaseSelect(e.target.value)}
        className="w-full px-hgap-xs py-vgap-2xs border border-zd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zd-link bg-zd-gray2 text-zd-white"
      >
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

export default CaseSelector;

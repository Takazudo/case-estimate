import { cases } from '../data/cases';

interface HeaderCaseSelectorProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

const HeaderCaseSelector = ({ selectedCase, onCaseSelect }: HeaderCaseSelectorProps) => {
  return (
    <div className="flex items-center gap-hgap-2xs">
      <label className="text-zd-gray text-sm lg:text-lg px-[3px]">Model:</label>
      <select
        value={selectedCase || ''}
        onChange={(e) => e.target.value && onCaseSelect(e.target.value)}
        className="px-hgap-sm py-vgap-xs border border-zd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zd-link bg-zd-gray2 text-zd-white text-sm md:text-base"
      >
        <option value="">モデル選択</option>
        {Object.entries(cases).map(([key, caseData]) => (
          <option key={key} value={key}>
            {caseData.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HeaderCaseSelector;

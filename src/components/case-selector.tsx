import { cases } from '../data/cases';

interface CaseSelectorProps {
  selectedCase: string;
  onCaseSelect: (caseType: string) => void;
}

const CaseSelector = ({ selectedCase, onCaseSelect }: CaseSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zd-white">Case Model</h3>
      <select
        value={selectedCase}
        onChange={(e) => onCaseSelect(e.target.value)}
        className="w-full px-3 py-2 border border-zd-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zd-link bg-zd-gray2 text-zd-white"
      >
        {Object.entries(cases).map(([key, caseData]) => (
          <option key={key} value={key}>
            {caseData.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CaseSelector;

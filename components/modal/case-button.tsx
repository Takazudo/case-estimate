import React from 'react';
import type { CaseEntry } from '@/data/cases';

interface CaseButtonProps {
  caseData: CaseEntry[1];
  isSelected: boolean;
  onClick: () => void;
}

export const CaseButton: React.FC<CaseButtonProps> = ({ caseData, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left py-vgap-xs rounded transition-all flex items-baseline justify-between
        md:px-hgap-sm
        md:-mx-hgap-sm
        ${isSelected ? 'bg-zd-link text-zd-black font-medium' : 'text-zd-white zd-invert-color-link'}
      `}
    >
      <span className="text-sm md:text-base underline">{caseData.name}</span>
      <span
        className={`text-xs md:text-sm underline ${isSelected ? 'text-zd-black' : 'text-zd-gray'}`}
      >
        {caseData.hp} HP • {caseData.material === '3dp' ? '3D' : 'ACR'}
      </span>
    </button>
  );
};

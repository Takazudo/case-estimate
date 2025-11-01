'use client';

import { useState } from 'react';
import { cases } from '@/data/cases';
import { CaseSelectorModal } from '@/components/modal/case-selector-modal';

interface HeaderCaseSelectorProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

const HeaderCaseSelector = ({ selectedCase, onCaseSelect }: HeaderCaseSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCaseName = selectedCase ? cases[selectedCase]?.name || 'モデル選択' : 'モデル選択';

  return (
    <>
      <div className="flex items-center gap-hgap-2xs">
        <label className="text-zd-black font-medium text-sm lg:text-base px-[3px]">Model:</label>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-hgap-sm py-vgap-xs border border-zd-black/20 rounded focus:outline-none focus:ring-2 focus:ring-zd-black/30 bg-white text-zd-black text-sm md:text-base font-medium flex-1 text-left hover:border-zd-black/40 transition-colors"
        >
          {selectedCaseName}
        </button>
      </div>

      <CaseSelectorModal
        isOpen={isModalOpen}
        selectedCase={selectedCase}
        onCaseSelect={onCaseSelect}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HeaderCaseSelector;

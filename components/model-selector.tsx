'use client';

import { useState } from 'react';
import { cases } from '@/data/cases';
import { CaseSelectorModal } from '@/components/modal/case-selector-modal';

interface ModelSelectorProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

const ModelSelector = ({ selectedCase, onCaseSelect }: ModelSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedCaseData = selectedCase ? cases[selectedCase] : null;

  return (
    <>
      <div className="space-y-vgap-xs pb-vgap-sm">
        <h3 className="font-semibold text-zd-white pb-vgap-xs">モデル選択</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative w-full rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray hover:border-zd-link/60 focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white transition-colors text-sm"
        >
          <span className="block truncate">
            {selectedCaseData ? (
              <span className="font-medium">{selectedCaseData.name}</span>
            ) : (
              <span className="text-zd-gray">Select a case model</span>
            )}
          </span>
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

export default ModelSelector;

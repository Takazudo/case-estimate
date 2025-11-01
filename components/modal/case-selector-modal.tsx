'use client';

import React, { useEffect, useState } from 'react';
import { cases } from '@/data/cases';
import { CloseIcon } from '@/components/icons/close-icon';

interface CaseSelectorModalProps {
  isOpen: boolean;
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
  onClose: () => void;
}

const CaseSelectorModal: React.FC<CaseSelectorModalProps> = ({
  isOpen,
  selectedCase,
  onCaseSelect,
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      if (isOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCaseClick = (caseKey: string) => {
    onCaseSelect(caseKey);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-selector-modal-title"
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        bg-zd-black/70
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative bg-white rounded-lg shadow-xl
          w-[90vw] max-w-[800px] max-h-[85vh]
          overflow-hidden
          transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-hgap-md border-b border-zd-black/10">
          <h2 id="case-selector-modal-title" className="text-xl font-bold text-zd-black">
            モデル選択
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zd-black hover:text-zd-black/60 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-hgap-md">
          {Object.entries(caseGroups).map(([groupName, groupCases]) => {
            if (groupCases.length === 0) return null;

            return (
              <div key={groupName} className="mb-vgap-lg last:mb-0">
                <h3 className="text-lg font-semibold text-zd-black mb-vgap-sm border-b border-zd-black/20 pb-vgap-xs">
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-hgap-sm">
                  {groupCases.map(([key, caseData]) => (
                    <button
                      key={key}
                      onClick={() => handleCaseClick(key)}
                      className={`
                        text-left p-hgap-md rounded-lg border-2 transition-all
                        ${
                          selectedCase === key
                            ? 'border-zd-black bg-zd-black/5 font-semibold'
                            : 'border-zd-black/20 hover:border-zd-black/40 hover:bg-zd-black/5'
                        }
                      `}
                    >
                      <div className="text-base text-zd-black">{caseData.name}</div>
                      <div className="text-sm text-zd-black/60 mt-vgap-2xs">
                        {caseData.hp} HP • {caseData.material === '3dp' ? '3D Printed' : 'Acrylic'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { CaseSelectorModal };

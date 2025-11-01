'use client';

import React, { useEffect, useState } from 'react';
import { cases } from '@/data/cases';
import { CloseIcon } from '@/components/icons/close-icon';
import { getThumbnailUrl } from '@/utils/cdn-urls';

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

  // Group cases by their base model, matching the order and categorization from /case-models page
  const caseGroups = [
    {
      label: 'zudo-block-60-open',
      displayLabel: 'Zudo Block 60 Open (Starter Kit)',
      imageSlug: 'zb60-open-high-view-a',
      cases: Object.entries(cases)
        .filter(([key]) => key.includes('zudo-block-60-open'))
        .sort(([keyA], [keyB]) => {
          // Order: 3DP-A, 3DP-B, 3DP-upgrade, ACR-A, ACR-B, ACR-upgrade
          const order = [
            'zudo-block-60-open-3DP-A',
            'zudo-block-60-open-3DP-B',
            'zudo-block-60-open-upgrade-3DP',
            'zudo-block-60-open-ACR-A',
            'zudo-block-60-open-ACR-B',
            'zudo-block-60-open-upgrade-ACR',
          ];
          return order.indexOf(keyA) - order.indexOf(keyB);
        }),
    },
    {
      label: 'zudo-block-60',
      displayLabel: 'Zudo Block 60',
      imageSlug: 'panels-gallery-zudo-blocks-110',
      cases: Object.entries(cases).filter(
        ([key]) => key.startsWith('zudo-block-60') && !key.includes('x2') && !key.includes('open'),
      ),
    },
    {
      label: 'zudo-block-40',
      displayLabel: 'Zudo Block 40',
      imageSlug: 'panels-gallery-zudo-blocks-102',
      cases: Object.entries(cases).filter(
        ([key]) => key.startsWith('zudo-block-40') && !key.includes('x2'),
      ),
    },
    {
      label: 'zudo-block-60x2',
      displayLabel: 'Zudo Block 60x2',
      imageSlug: 'panels-gallery-zudo-blocks-114',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-60x2')),
    },
    {
      label: 'zudo-block-40x2',
      displayLabel: 'Zudo Block 40x2',
      imageSlug: 'panels-gallery-zudo-blocks-101',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-40x2')),
    },
    {
      label: '10box',
      displayLabel: '10BOX Ju-Bako',
      imageSlug: 'panels-gallery-zudo-blocks-142',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('10box')),
    },
  ];

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
          relative bg-zd-black rounded-lg shadow-xl border-2 border-zd-gray
          w-[90vw] max-w-[800px] max-h-[85vh]
          overflow-hidden
          transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-hgap-md border-b border-zd-gray">
          <h2 id="case-selector-modal-title" className="text-xl font-bold text-zd-white">
            モデル選択
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zd-white hover:text-zd-white/60 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-hgap-md">
          {caseGroups.map((group) => {
            if (group.cases.length === 0) return null;

            return (
              <div key={group.label} className="mb-vgap-lg last:mb-0">
                <div className="flex items-center gap-hgap-sm mb-vgap-sm border-b border-zd-gray pb-vgap-xs">
                  <img
                    src={getThumbnailUrl(group.imageSlug)}
                    alt={group.displayLabel}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold text-zd-white">{group.displayLabel}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-hgap-sm">
                  {group.cases.map(([key, caseData]) => (
                    <button
                      key={key}
                      onClick={() => handleCaseClick(key)}
                      className={`
                        text-left p-hgap-md rounded-lg border-2 transition-all
                        ${
                          selectedCase === key
                            ? 'border-zd-link bg-zd-link/10 font-semibold'
                            : 'border-zd-gray hover:border-zd-link/60 hover:bg-zd-gray2'
                        }
                      `}
                    >
                      <div className="text-base text-zd-white">{caseData.name}</div>
                      <div className="text-sm text-zd-gray mt-vgap-2xs">
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

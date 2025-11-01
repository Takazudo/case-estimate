'use client';

import React, { useEffect, useState } from 'react';
import { cases } from '@/data/cases';
import { CloseIcon } from '@/components/icons/close-icon';
import { ModelBoxIcon } from '@/components/icons/model-box-icon';
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
          relative bg-zd-black shadow-xl border border-zd-white
          w-full md:w-[90vw] max-w-[1400px] max-h-[85vh]
          overflow-hidden
          transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            px-hgap-sm py-vgap-sm
            md:px-hgap-md md:py-vgap-md
            flex items-center justify-between
            border-b border-zd-white
          `}
        >
          <h2
            id="case-selector-modal-title"
            className={`
              font-bold text-zd-white
              flex items-baseline gap-hgap-xs
            `}
          >
            <ModelBoxIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />
            <span className="text-base lg:text-xl">モデル選択 </span>
            <span className="hidden lg:inline text-base">/ Model Selection</span>
          </h2>
          <button
            onClick={onClose}
            className="text-zd-white zd-invert-color-link"
            aria-label="Close modal"
          >
            <CloseIcon className="w-[30px] md:w-[44px] aspect-square" />
          </button>
        </div>

        {/* Content */}
        <div
          className={`
            overflow-y-auto max-h-[calc(85vh-80px)]
            px-hgap-md
            pt-vgap-md
            pb-[100px]
          `}
        >
          {caseGroups.map((group) => {
            if (group.cases.length === 0) return null;

            return (
              <div key={group.label} className="mb-vgap-lg last:mb-0">
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
                          <button
                            onClick={() => handleCaseClick(key)}
                            className={`
                              w-full text-left py-vgap-xs rounded transition-all flex items-baseline justify-between
                              md:px-hgap-sm
                              md:-mx-hgap-sm
                              ${
                                selectedCase === key
                                  ? 'bg-zd-link text-zd-black font-medium'
                                  : 'text-zd-white zd-invert-color-link'
                              }
                        `}
                          >
                            <span className="text-sm md:text-base underline">{caseData.name}</span>
                            <span
                              className={`text-xs md:text-sm underline ${selectedCase === key ? 'text-zd-black' : 'text-zd-gray'}`}
                            >
                              {caseData.hp} HP • {caseData.material === '3dp' ? '3D' : 'ACR'}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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

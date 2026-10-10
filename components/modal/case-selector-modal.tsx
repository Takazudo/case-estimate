'use client';

import { ModelBoxIcon } from '@/components/icons/model-box-icon';
import { caseGroups } from '@/data/case-groups';
import { CaseGroupSection } from './case-group-section';
import { BaseModal } from './base-modal';
import type { Reactive } from '@/utils/reactive';

interface CaseSelectorModalProps {
  isOpen: Reactive<boolean>;
  selectedCase: Reactive<string | null>;
  onCaseSelect: (caseType: string) => void;
  onClose: () => void;
}
export function CaseSelectorModal({
  isOpen,
  selectedCase,
  onCaseSelect,
  onClose,
}: CaseSelectorModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="モデル選択 / Model Selection"
      icon={<ModelBoxIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />}
      ariaLabelledBy="case-selector-modal-title"
    >
      {caseGroups.map((group) => (
        <CaseGroupSection
          group={group}
          selectedCase={selectedCase}
          onCaseClick={(key) => {
            onCaseSelect(key);
            onClose();
          }}
        />
      ))}
    </BaseModal>
  );
}

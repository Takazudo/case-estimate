'use client';

import { computed, getScope, signal } from '@takazudo/zfb/zudo-react';
import { BaseModal } from './base-modal';
import { OrderIcon } from '@/components/icons/order-icon';
import { generateOrderInfo } from '@/utils/generate-order-info';
import type { PanelColorIds } from '@/types';
import { read, type Reactive } from '@/utils/reactive';

interface OrderInfoModalProps {
  isOpen: Reactive<boolean>;
  selectedCase: Reactive<string>;
  panelColorIds: Reactive<PanelColorIds>;
  material: Reactive<'acrylic' | '3dp'>;
  onClose: () => void;
}
export function OrderInfoModal({
  isOpen,
  selectedCase,
  panelColorIds,
  material,
  onClose,
}: OrderInfoModalProps) {
  const copySuccess = signal(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  getScope().onCleanup(() => {
    if (resetTimer) clearTimeout(resetTimer);
  });
  const orderInfo = computed(() =>
    generateOrderInfo({
      selectedCase: read(selectedCase),
      panelColorIds: read(panelColorIds),
      material: read(material),
      currentUrl: typeof window === 'undefined' ? '' : window.location.href,
    }),
  );
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderInfo.value);
      copySuccess.value = true;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="オーダー情報 / Order Information"
      icon={<OrderIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />}
      ariaLabelledBy="order-info-modal-title"
    >
      <div class="mb-vgap-md p-hgap-sm bg-zd-gray/20 border border-zd-gray rounded">
        <p class="text-zd-white text-sm leading-relaxed">
          Mercari Shopsで購入後、メッセージ機能を使ってこの情報をコピー&ペーストしてお送りください。
        </p>
      </div>
      <div class="mb-vgap-md">
        <button
          on:click={handleCopyToClipboard}
          class={computed(
            () =>
              `w-full md:w-auto px-hgap-md py-vgap-sm bg-zd-white text-zd-black hover:bg-zd-gray hover:text-zd-white transition-colors font-medium rounded ${copySuccess.value ? 'bg-green-600 text-white hover:bg-green-700' : ''}`,
          )}
        >
          {computed(() => (copySuccess.value ? 'コピーしました！' : 'テキストをコピー'))}
        </button>
      </div>
      <div class="bg-zd-black border border-zd-gray rounded p-hgap-md font-mono text-sm text-zd-white whitespace-pre-wrap break-words">
        {orderInfo}
      </div>
    </BaseModal>
  );
}

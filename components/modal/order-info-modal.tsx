'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BaseModal } from './base-modal';
import { OrderIcon } from '@/components/icons/order-icon';
import { generateOrderInfo } from '@/utils/generate-order-info';
import type { PanelColorIds } from '@/types';

interface OrderInfoModalProps {
  isOpen: boolean;
  selectedCase: string;
  panelColorIds: PanelColorIds;
  material: 'acrylic' | '3dp';
  onClose: () => void;
}

const OrderInfoModal: React.FC<OrderInfoModalProps> = ({
  isOpen,
  selectedCase,
  panelColorIds,
  material,
  onClose,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Compute currentUrl and orderInfo once
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const orderInfo = useMemo(
    () =>
      generateOrderInfo({
        selectedCase,
        panelColorIds,
        material,
        currentUrl,
      }),
    [selectedCase, panelColorIds, material, currentUrl],
  );

  // Clear copy success timeout on unmount
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (copySuccess) {
      timeoutId = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [copySuccess]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderInfo);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy text:', err);
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
      {/* Instructions */}
      <div className="mb-vgap-md p-hgap-sm bg-zd-gray/20 border border-zd-gray rounded">
        <p className="text-zd-white text-sm leading-relaxed">
          Mercari Shopsで購入後、メッセージ機能を使ってこの情報をコピー&ペーストしてお送りください。
        </p>
      </div>

      {/* Copy Button */}
      <div className="mb-vgap-md">
        <button
          onClick={handleCopyToClipboard}
          className={`
            w-full md:w-auto
            px-hgap-md py-vgap-sm
            bg-zd-white text-zd-black
            hover:bg-zd-gray hover:text-zd-white
            transition-colors
            font-medium
            rounded
            ${copySuccess ? 'bg-green-600 text-white hover:bg-green-700' : ''}
          `}
        >
          {copySuccess ? 'コピーしました！' : 'テキストをコピー'}
        </button>
      </div>

      {/* Order Info Display */}
      <div
        className={`
          bg-zd-black border border-zd-gray rounded
          p-hgap-md
          font-mono text-sm
          text-zd-white
          whitespace-pre-wrap
          break-words
        `}
      >
        {orderInfo}
      </div>
    </BaseModal>
  );
};

export { OrderInfoModal };

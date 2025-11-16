'use client';

import React, { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/icons/close-icon';
import { OrderIcon } from '@/components/icons/order-icon';
import { generateOrderInfo } from '@/utils/generate-order-info';

interface OrderInfoModalProps {
  isOpen: boolean;
  selectedCase: string;
  panelColorIds: { [key: string]: string };
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
  const [shouldRender, setShouldRender] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      return undefined;
    }

    if (shouldRender) {
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);

      return () => clearTimeout(timer);
    }

    return undefined;
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyToClipboard = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const orderInfo = generateOrderInfo({
      selectedCase,
      panelColorIds,
      material,
      currentUrl,
    });

    try {
      await navigator.clipboard.writeText(orderInfo);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!shouldRender) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const orderInfo = generateOrderInfo({
    selectedCase,
    panelColorIds,
    material,
    currentUrl,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-info-modal-title"
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
          w-full md:w-[90vw] max-w-[1400px]
          h-full md:h-[85vh]
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
            id="order-info-modal-title"
            className={`
              font-bold text-zd-white
              flex items-baseline gap-hgap-xs
            `}
          >
            <OrderIcon className="w-[32px] h-[32px] text-zd-white relative top-[5px]" />
            <span className="text-base lg:text-xl">オーダー情報 </span>
            <span className="hidden lg:inline text-base">/ Order Information</span>
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
          {/* Instructions */}
          <div className="mb-vgap-md p-hgap-sm bg-zd-gray/20 border border-zd-gray rounded">
            <p className="text-zd-white text-sm leading-relaxed">
              Mercari
              Shopsで購入後、メッセージ機能を使ってこの情報をコピー&ペーストしてお送りください。
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
        </div>
      </div>
    </div>
  );
};

export { OrderInfoModal };
